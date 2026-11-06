import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.118.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const TELEGRAM_CHAT_IDS = (Deno.env.get("TELEGRAM_CHAT_ID") ?? "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const allowedOrigins = new Set([
  "https://examtheorie.nl",
  "https://www.examtheorie.nl",
  "https://azerpashazadeh.github.io",
]);

function response(body: unknown, status: number, origin: string | null) {
  const cors = origin && allowedOrigins.has(origin)
    ? {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Vary": "Origin",
      }
    : {};
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") {
    if (!origin || !allowedOrigins.has(origin)) return response({ error: "Origin not allowed" }, 403, null);
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Vary": "Origin",
      },
    });
  }
  if (req.method !== "POST") return response({ error: "Method not allowed" }, 405, origin);
  if (!origin || !allowedOrigins.has(origin)) return response({ error: "Origin not allowed" }, 403, null);

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY ||
      !TELEGRAM_BOT_TOKEN || TELEGRAM_CHAT_IDS.length === 0 || TELEGRAM_CHAT_IDS.some((id) => !/^-?\d+$/.test(id))) {
    console.error("Required server configuration is missing.");
    return response({ error: "Server configuration error" }, 500, origin);
  }

  const authorization = req.headers.get("Authorization") ?? "";
  const accessToken = authorization.replace(/^Bearer\s+/i, "");
  if (!accessToken || accessToken === authorization) {
    return response({ error: "Authentication required" }, 401, origin);
  }

  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: authData, error: authError } = await authClient.auth.getUser(accessToken);
  if (authError || !authData.user) return response({ error: "Invalid session" }, 401, origin);

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return response({ error: "Invalid JSON" }, 400, origin);
  }

  const testNumber = payload.testNumber;
  const language = payload.language;
  const elapsedSeconds = payload.elapsedSeconds;
  const alertSession = payload.alertSession === undefined ? crypto.randomUUID() : payload.alertSession;
  if (typeof alertSession !== "string" || !UUID_PATTERN.test(alertSession) ||
      !Number.isInteger(testNumber) || (testNumber as number) < 1 || (testNumber as number) > 50 ||
      !["en", "ar", "nl", "tr"].includes(String(language)) ||
      !Number.isInteger(elapsedSeconds) || (elapsedSeconds as number) < 1500 || (elapsedSeconds as number) > 1800) {
    return response({ error: "Invalid alert data" }, 400, origin);
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const row = {
    user_id: authData.user.id,
    test_number: testNumber,
    language,
    alert_session: alertSession,
    elapsed_seconds: elapsedSeconds,
  };

  let alertId: string;
  let sentMessageIds: Array<string | null> = TELEGRAM_CHAT_IDS.map(() => null);
  const { data: inserted, error: insertError } = await admin
    .from("telegram_fast_test_alerts")
    .insert(row)
    .select("id")
    .single();

  if (insertError?.code === "23505") {
    const { data: existing, error: lookupError } = await admin
      .from("telegram_fast_test_alerts")
      .select("id, notification_status, telegram_message_id")
      .eq("alert_session", alertSession)
      .eq("user_id", authData.user.id)
      .eq("test_number", testNumber)
      .eq("language", language)
      .maybeSingle();
    if (lookupError || !existing) {
      console.error("Could not inspect an existing alert record.");
      return response({ error: "Could not process alert" }, 500, origin);
    }
    if (existing.notification_status !== "failed") {
      return response({ ok: true, duplicate: true }, 200, origin);
    }
    try {
      const savedIds = JSON.parse(existing.telegram_message_id ?? "[]");
      if (Array.isArray(savedIds)) {
        sentMessageIds = TELEGRAM_CHAT_IDS.map((_, index) =>
          typeof savedIds[index] === "string" ? savedIds[index] : null
        );
      }
    } catch {
      // A failed record without a saved delivery list is retried for every recipient.
    }
    const { data: retry } = await admin
      .from("telegram_fast_test_alerts")
      .update({ elapsed_seconds: elapsedSeconds, notification_status: "pending" })
      .eq("id", existing.id)
      .eq("notification_status", "failed")
      .select("id")
      .maybeSingle();
    if (!retry) return response({ ok: true, duplicate: true }, 200, origin);
    alertId = retry.id;
  } else if (insertError || !inserted) {
    console.error("Could not create the fast-test alert record.");
    return response({ error: "Could not save alert" }, 500, origin);
  } else {
    alertId = inserted.id;
  }

  const mins = Math.floor((elapsedSeconds as number) / 60);
  const secs = (elapsedSeconds as number) % 60;
  const message = [
    "⚠️ Test result completed (25–30 min)",
    `Test: ${testNumber} | Language: ${String(language).toUpperCase()}`,
    `Elapsed: ${mins}m ${String(secs).padStart(2, "0")}s`,
    `Supabase User ID: ${authData.user.id}`,
  ].join("\n");

  try {
    for (let index = 0; index < TELEGRAM_CHAT_IDS.length; index++) {
      if (sentMessageIds[index]) continue;
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: TELEGRAM_CHAT_IDS[index], text: message }),
          signal: AbortSignal.timeout(10000),
        },
      );
      const telegramResult = await telegramResponse.json();
      if (!telegramResponse.ok || !telegramResult.ok ||
          String(telegramResult.result?.chat?.id) !== TELEGRAM_CHAT_IDS[index]) {
        throw new Error("Telegram rejected delivery to a recipient.");
      }

      sentMessageIds[index] = String(telegramResult.result.message_id);
      const { error: saveDeliveryError } = await admin
        .from("telegram_fast_test_alerts")
        .update({ telegram_message_id: JSON.stringify(sentMessageIds) })
        .eq("id", alertId);
      if (saveDeliveryError) throw new Error("Could not record Telegram delivery.");
    }

    const { error: updateError } = await admin
      .from("telegram_fast_test_alerts")
      .update({ notification_status: "sent", telegram_message_id: JSON.stringify(sentMessageIds) })
      .eq("id", alertId);
    if (updateError) console.error("Telegram sent, but alert status could not be updated.");
    return response({ ok: true, notified: true, recipients: TELEGRAM_CHAT_IDS.length }, 200, origin);
  } catch {
    await admin
      .from("telegram_fast_test_alerts")
      .update({
        notification_status: "failed",
        telegram_message_id: JSON.stringify(sentMessageIds),
      })
      .eq("id", alertId);
    console.error("Telegram delivery failed for one or more recipients.");
    return response({ error: "Telegram delivery failed" }, 502, origin);
  }
});
