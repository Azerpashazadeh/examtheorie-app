#!/usr/bin/env node
'use strict';

/**
 * ExamTheorie Incremental TTS Generator & Cloudflare R2 Sync Tool
 * Zero external npm dependencies (uses Node >=18 built-ins + local Gemini Web TTS Studio).
 *
 * Usage examples:
 *   node scripts/sync-tts-r2.cjs --dry-run
 *   node scripts/sync-tts-r2.cjs --scope=exams --langs=tr,nl --limit=20
 *   node scripts/sync-tts-r2.cjs --scope=all
 *   node scripts/sync-tts-r2.cjs --upload-r2
 *
 * Environment variables for --upload-r2:
 *   R2_ACCOUNT_ID        (e.g. 30ef3317065692bb2dfd9f741b1c82bf)
 *   R2_BUCKET_NAME       (default: examtheorie-tts)
 *   R2_ACCESS_KEY_ID     (Cloudflare R2 S3 API Access Key ID)
 *   R2_SECRET_ACCESS_KEY (Cloudflare R2 S3 API Secret Access Key)
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const APP_ROOT = path.resolve(__dirname, '..');
const DEFAULT_STUDIO_DIR = process.env.GEMINI_TTS_STUDIO_DIR
  || 'C:/Users/matht/Desktop/gemini-web-tts-studio/gemini-web-tts-studio';

const { createGeminiWebTtsClient } = require(path.join(DEFAULT_STUDIO_DIR, 'lib/geminiWebTts.cjs'));
const { computeTtsCacheKey } = require(path.join(DEFAULT_STUDIO_DIR, 'lib/ttsCacheKey.cjs'));

const CACHE_DIR = path.resolve(process.env.TTS_CACHE_DIR || path.join(DEFAULT_STUDIO_DIR, 'tts-cache'));
const R2_MANIFEST_PATH = path.join(CACHE_DIR, '.r2-uploaded-manifest.json');

const ALL_LANGS = ['en', 'nl', 'tr', 'ar', 'ru', 'fa', 'es'];
const ALL_VOICES = ['capella', 'orion'];
const EXAM_FILE_TYPES = ['radio', 'fillblank', 'checkbox', 'resimsech', 'dragdrop'];
const REMOTE_EXAM_FOLDERS = {
  en: 'englishjsons',
  nl: 'dutchjsons',
  tr: 'turkishjsons',
  ar: 'arabicjsons'
};

function parseArgs(argv) {
  const opts = {
    dryRun: false,
    uploadR2: false,
    synthesize: true,
    scope: 'all', // all | exams | quizzes | theory
    langs: ALL_LANGS.slice(),
    voices: ALL_VOICES.slice(),
    maxTest: 5,
    limit: Infinity,
    concurrency: 2,
    delayMs: 700,
    jitterMs: 350
  };
  for (const arg of argv.slice(2)) {
    if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--upload-r2') opts.uploadR2 = true;
    else if (arg === '--upload-only') { opts.uploadR2 = true; opts.synthesize = false; }
    else if (arg === '--watch-upload') { opts.uploadR2 = true; opts.synthesize = false; opts.watchUpload = true; }
    else if (arg.startsWith('--scope=')) opts.scope = arg.split('=')[1].trim();
    else if (arg.startsWith('--langs=')) opts.langs = arg.split('=')[1].split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    else if (arg.startsWith('--voices=')) opts.voices = arg.split('=')[1].split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    else if (arg.startsWith('--max-test=')) opts.maxTest = Math.max(1, parseInt(arg.split('=')[1], 10) || 5);
    else if (arg.startsWith('--limit=')) opts.limit = Math.max(1, parseInt(arg.split('=')[1], 10) || 1);
    else if (arg.startsWith('--concurrency=')) opts.concurrency = Math.max(1, Math.min(4, parseInt(arg.split('=')[1], 10) || 2));
    else if (arg.startsWith('--delay-ms=')) opts.delayMs = Math.max(200, parseInt(arg.split('=')[1], 10) || 700);
  }
  return opts;
}

function decodeHtmlEntities(str) {
  return String(str || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–')
    .replace(/&permil;/gi, '‰')
    .replace(/&micro;/gi, 'µ')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));
}

// Balanced HTML block extractor matching cleanNodeSpeechText() in theory-tts.js
function extractBalancedBlocksByClass(html, targetClasses) {
  const results = [];
  const classPattern = targetClasses.map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const openRe = new RegExp(`<(div|section|h1|h2)\\b[^>]*class="[^"]*\\b(?:${classPattern})\\b[^"]*"[^>]*>`, 'gi');
  let match;
  while ((match = openRe.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const startIdx = match.index;
    const tagRe = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
    tagRe.lastIndex = startIdx;
    let depth = 0;
    let tMatch;
    while ((tMatch = tagRe.exec(html)) !== null) {
      if (tMatch[0].startsWith('</')) depth--;
      else if (!tMatch[0].endsWith('/>')) depth++;
      if (depth === 0) {
        results.push(html.slice(startIdx, tagRe.lastIndex));
        break;
      }
    }
  }
  return results;
}

function stripBlockHtmlToSpeechText(blockHtml) {
  let s = String(blockHtml || '');
  // Remove .img-slot divs, scripts, styles, buttons
  s = s.replace(/<div\b[^>]*class="[^"]*\bimg-slot\b[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
  s = s.replace(/<(?:script|style|button)\b[^>]*>[\s\S]*?<\/(?:script|style|button)>/gi, '');
  s = s.replace(/<\/(?:div|p|li|h[1-6]|tr|td|th)>|<br\s*\/?>/gi, ' ');
  s = s.replace(/<[^>]+>/g, '');
  s = decodeHtmlEntities(s);
  return s.replace(/\s+/g, ' ').trim();
}

async function loadExamJson(lang, testNum, fileType) {
  const localFile = path.join(APP_ROOT, 'exam-data', lang, `test${testNum}`, `test${testNum}-${fileType}${lang}.json`);
  if (fs.existsSync(localFile)) {
    return JSON.parse(fs.readFileSync(localFile, 'utf8'));
  }
  const remoteFolder = REMOTE_EXAM_FOLDERS[lang];
  if (!remoteFolder) return null;
  const url = `https://azerpashazadeh.github.io/sorularveresimler/test${testNum}/${remoteFolder}/test${testNum}-${fileType}${lang}.json`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (_) {
    return null;
  }
}

async function collectCorpus(opts) {
  const itemsByKey = new Map(); // objectKey -> { keyInfo, category }
  const stats = { exams: 0, quizzes: 0, theory: 0 };

  function addText(lang, text, category, tier = 2) {
    const trimmed = String(text || '').trim();
    if (!trimmed) return;
    for (const voice of opts.voices) {
      const keyInfo = computeTtsCacheKey(trimmed, { language: lang, voice, mode: 'bard', audioFormat: 1 });
      if (!keyInfo.canonicalText) continue;
      if (!itemsByKey.has(keyInfo.objectKey)) {
        itemsByKey.set(keyInfo.objectKey, { keyInfo, category, tier });
        stats[category] = (stats[category] || 0) + 1;
      }
    }
  }

  // Priority 1: Exams — loop testNum OUTER, lang INNER so Test 1 (deneme-*) finishes across ALL 7 languages first!
  if (opts.scope === 'all' || opts.scope === 'exams') {
    for (let tNum = 1; tNum <= opts.maxTest; tNum++) {
      const tier = tNum === 1 ? 0 : 1;
      for (const lang of opts.langs) {
        for (const fType of EXAM_FILE_TYPES) {
          const data = await loadExamJson(lang, tNum, fType);
          if (!data || !Array.isArray(data.sorular)) continue;
          for (const q of data.sorular) {
            if (q.soru) addText(lang, q.soru, 'exams', tier);
            if (Array.isArray(q.cevaplar)) {
              for (const c of q.cevaplar) addText(lang, c, 'exams', tier);
            }
            if (q.feedback && q.feedback.metin) {
              addText(lang, q.feedback.metin, 'exams', tier);
            }
          }
        }
      }
    }
  }

  // Priority 2: Chapter Quizzes
  if (opts.scope === 'all' || opts.scope === 'quizzes') {
    for (const lang of opts.langs) {
      const langDir = path.join(APP_ROOT, 'theory', lang);
      if (!fs.existsSync(langDir)) continue;
      for (const file of fs.readdirSync(langDir).filter((f) => f.endsWith('.html'))) {
        const html = fs.readFileSync(path.join(langDir, file), 'utf8');
        const m = html.match(/<script type="application\/json" id="chapter-quiz-data">([\s\S]*?)<\/script>/i);
        if (!m) continue;
        const parsed = JSON.parse(m[1]);
        for (const q of parsed.questions || []) {
          if (q.q) addText(lang, q.q, 'quizzes');
          for (const opt of q.opts || []) addText(lang, opt, 'quizzes');
          if (q.exp) addText(lang, q.exp, 'quizzes');
        }
      }
    }
  }

  // Priority 3: Theory Audiobook & Sign Catalogue
  if (opts.scope === 'all' || opts.scope === 'theory') {
    for (const lang of opts.langs) {
      const langDir = path.join(APP_ROOT, 'theory', lang);
      if (!fs.existsSync(langDir)) continue;
      for (const file of fs.readdirSync(langDir).filter((f) => f.endsWith('.html'))) {
        const html = fs.readFileSync(path.join(langDir, file), 'utf8');
        if (file === 'traffic-sign-catalogue.html') {
          const signBlocks = extractBalancedBlocksByClass(html, ['sign-card']);
          for (const sb of signBlocks) {
            const codeM = sb.match(/<div class="sign-code">([\s\S]*?)<\/div>/i);
            const nameM = sb.match(/<div class="sign-name">([\s\S]*?)<\/div>/i);
            const code = codeM ? decodeHtmlEntities(codeM[1].replace(/<[^>]+>/g, '')).trim() : '';
            const name = nameM ? decodeHtmlEntities(nameM[1].replace(/<[^>]+>/g, '')).trim() : '';
            const spoken = code && name ? `${code} — ${name}` : (name || code);
            if (spoken) addText(lang, spoken, 'theory');
          }
        } else {
          const h1M = html.match(/<header class="book-header">[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i);
          if (h1M) addText(lang, stripBlockHtmlToSpeechText(h1M[1]), 'theory');
          const heads = extractBalancedBlocksByClass(html, ['section-head']);
          for (const h of heads) addText(lang, stripBlockHtmlToSpeechText(h), 'theory');
          const cards = extractBalancedBlocksByClass(html, ['intro-pull', 'rule-block', 'callout', 'split-box', 'alcohol-box']);
          for (const c of cards) addText(lang, stripBlockHtmlToSpeechText(c), 'theory');
        }
      }
    }
  }

  const catOrder = { exams: 1, theory: 2, quizzes: 3 };
  const ordered = Array.from(itemsByKey.values()).sort((a, b) => {
    const ta = a.tier ?? 2;
    const tb = b.tier ?? 2;
    if (ta !== tb) return ta - tb;
    const va = a.keyInfo.voice === 'capella' ? 0 : 1;
    const vb = b.keyInfo.voice === 'capella' ? 0 : 1;
    if (va !== vb) return va - vb;
    const ca = catOrder[a.category] || 9;
    const cb = catOrder[b.category] || 9;
    return ca - cb;
  });

  return { items: ordered, stats };
}

// Minimal AWS SigV4 PUT uploader for Cloudflare R2 S3-compatible API
function hmacSha256(key, data) {
  return crypto.createHmac('sha256', key).update(data, 'utf8').digest();
}

function sha256HexBuf(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

async function putObjectToR2(r2Cfg, objectKey, buffer) {
  const host = `${r2Cfg.accountId}.r2.cloudflarestorage.com`;
  const canonicalUri = `/${r2Cfg.bucket}/${objectKey}`;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const region = 'auto';
  const service = 's3';
  const payloadHash = sha256HexBuf(buffer);
  const contentType = 'audio/mpeg';
  const cacheControl = 'public, max-age=31536000, immutable';

  const canonicalHeaders =
    `cache-control:${cacheControl}\n` +
    `content-type:${contentType}\n` +
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;
  const signedHeaders = 'cache-control;content-type;host;x-amz-content-sha256;x-amz-date';
  const canonicalRequest = `PUT\n${canonicalUri}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign =
    `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n` +
    crypto.createHash('sha256').update(canonicalRequest, 'utf8').digest('hex');

  const kDate = hmacSha256(`AWS4${r2Cfg.secretAccessKey}`, dateStamp);
  const kRegion = hmacSha256(kDate, region);
  const kService = hmacSha256(kRegion, service);
  const kSigning = hmacSha256(kService, 'aws4_request');
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign, 'utf8').digest('hex');

  const authorization =
    `AWS4-HMAC-SHA256 Credential=${r2Cfg.accessKeyId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(`https://${host}${canonicalUri}`, {
    method: 'PUT',
    headers: {
      'Cache-Control': cacheControl,
      'Content-Type': contentType,
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': amzDate,
      Authorization: authorization
    },
    body: buffer
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`R2 PUT ${res.status}: ${errText.slice(0, 240)}`);
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const opts = parseArgs(process.argv);
  console.log(`\n[TTS Sync] Scanning corpus (scope=${opts.scope}, langs=${opts.langs.join(',')}, voices=${opts.voices.join(',')})...`);

  const { items, stats } = await collectCorpus(opts);
  let alreadyCached = 0;
  const missingLocal = [];

  for (const item of items) {
    const filePath = path.join(CACHE_DIR, item.keyInfo.objectKey);
    if (fs.existsSync(filePath)) alreadyCached++;
    else missingLocal.push(item);
  }

  console.log(`[TTS Sync] Total unique clips (deduplicated): ${items.length}`);
  console.log(`           • Exams:          ${stats.exams}`);
  console.log(`           • Chapter Quizzes:${stats.quizzes}`);
  console.log(`           • Theory Pages:   ${stats.theory}`);
  console.log(`           • Cached locally: ${alreadyCached}`);
  console.log(`           • Missing local:  ${missingLocal.length}`);

  if (opts.dryRun) {
    console.log('[TTS Sync] Dry-run complete. No synthesis or upload performed.\n');
    return;
  }

  if (opts.synthesize && missingLocal.length > 0) {
    const client = createGeminiWebTtsClient({
      sessionFile: path.join(DEFAULT_STUDIO_DIR, '.gemini-session.json')
    });
    const toGenerate = missingLocal.slice(0, opts.limit);
    console.log(`[TTS Sync] Synthesizing ${toGenerate.length} clip(s) safely (concurrency=${opts.concurrency}) into ${CACHE_DIR}...`);

    let generated = 0;
    let cursor = 0;
    let aborted = false;

    async function worker() {
      while (!aborted) {
        const idx = cursor++;
        if (idx >= toGenerate.length) return;
        const { keyInfo, category } = toGenerate[idx];
        const outPath = path.join(CACHE_DIR, keyInfo.objectKey);
        if (fs.existsSync(outPath)) continue;
        try {
          const res = await client.synthesizeSpeech(keyInfo.canonicalText, {
            voice: keyInfo.voice,
            language: keyInfo.locale,
            mode: keyInfo.mode,
            audioFormat: 1
          });
          fs.mkdirSync(path.dirname(outPath), { recursive: true });
          const tmp = `${outPath}.${process.pid}.${idx}.tmp`;
          fs.writeFileSync(tmp, res.audioBuffer);
          fs.renameSync(tmp, outPath);
          generated++;
          if (generated % 25 === 0 || generated === toGenerate.length) {
            console.log(`  [${generated}/${toGenerate.length}] OK (${category} · ${keyInfo.shortLang}/${keyInfo.voice} · ${res.sizeBytes}B)`);
          }
          const waitMs = opts.delayMs + Math.floor(Math.random() * opts.jitterMs);
          await sleep(waitMs);
        } catch (err) {
          const msg = String((err && err.message) || err);
          if (/fetch failed|ENOTFOUND|ECONNRESET|ETIMEDOUT|bağlanılamadı/i.test(msg)) {
            console.warn(`\n[TTS Sync] Network/sleep hiccup (${keyInfo.objectKey}), waiting 12s and retrying...`);
            await sleep(12000);
            cursor = Math.max(0, idx);
            continue;
          }
          aborted = true;
          console.error(`\n[TTS Sync] Stopped safely on error (${keyInfo.objectKey}): ${msg}`);
          return;
        }
      }
    }

    await Promise.all(Array.from({ length: opts.concurrency }, () => worker()));
    console.log(`[TTS Sync] Local synthesis finished (${generated} new clips saved).`);
  }

  if (opts.uploadR2) {
    const syncConfigPath = path.join(DEFAULT_STUDIO_DIR, '.r2-sync.json');
    let workerSync = null;
    if (fs.existsSync(syncConfigPath)) {
      try { workerSync = JSON.parse(fs.readFileSync(syncConfigPath, 'utf8')); } catch (_) {}
    }

    const r2Cfg = {
      accountId: process.env.R2_ACCOUNT_ID || '',
      bucket: process.env.R2_BUCKET_NAME || 'examtheorie-tts',
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || ''
    };

    if ((!workerSync || !workerSync.workerUrl || !workerSync.syncToken) && (!r2Cfg.accountId || !r2Cfg.accessKeyId || !r2Cfg.secretAccessKey)) {
      throw new Error('Missing .r2-sync.json or R2 S3 environment variables.');
    }

    let manifest = {};
    if (fs.existsSync(R2_MANIFEST_PATH)) {
      try { manifest = JSON.parse(fs.readFileSync(R2_MANIFEST_PATH, 'utf8')); } catch (_) {}
    }

    async function flushBatch(batch) {
      if (!batch.length) return;
      if (workerSync && workerSync.workerUrl && workerSync.syncToken) {
        let lastErr = null;
        for (let attempt = 1; attempt <= 4; attempt++) {
          try {
            const res = await fetch(`${workerSync.workerUrl.replace(/\/+$/, '')}/batch-put`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${workerSync.syncToken}`
              },
              body: JSON.stringify({
                items: batch.map((b) => ({ key: b.objectKey, b64: b.buf.toString('base64') }))
              })
            });
            if (!res.ok) {
              const errTxt = await res.text().catch(() => '');
              throw new Error(`Worker batch-put HTTP ${res.status}: ${errTxt.slice(0, 200)}`);
            }
            lastErr = null;
            break;
          } catch (err) {
            lastErr = err;
            await sleep(1500 * attempt);
          }
        }
        if (lastErr) throw lastErr;
      } else {
        for (const b of batch) {
          await putObjectToR2(r2Cfg, b.objectKey, b.buf);
        }
      }
      for (const b of batch) {
        manifest[b.objectKey] = b.buf.length;
      }
    }

    async function runUploadPass() {
      let uploaded = 0;
      let batch = [];
      let batchBytes = 0;

      for (const item of items) {
        const { objectKey } = item.keyInfo;
        if (manifest[objectKey]) continue;
        const localPath = path.join(CACHE_DIR, objectKey);
        if (!fs.existsSync(localPath)) continue;
        const buf = fs.readFileSync(localPath);
        if (buf.length < 512) continue;

        if (batch.length >= 20 || (batchBytes + buf.length) > 2_800_000) {
          await flushBatch(batch);
          uploaded += batch.length;
          batch = [];
          batchBytes = 0;
          fs.mkdirSync(path.dirname(R2_MANIFEST_PATH), { recursive: true });
          fs.writeFileSync(R2_MANIFEST_PATH, JSON.stringify(manifest));
          if (uploaded % 100 === 0) {
            console.log(`  [R2 Upload] Uploaded ${uploaded} new objects (${Object.keys(manifest).length}/${items.length} total in R2)...`);
          }
        }
        batch.push({ objectKey, buf });
        batchBytes += buf.length;
      }

      if (batch.length > 0) {
        await flushBatch(batch);
        uploaded += batch.length;
        fs.mkdirSync(path.dirname(R2_MANIFEST_PATH), { recursive: true });
        fs.writeFileSync(R2_MANIFEST_PATH, JSON.stringify(manifest));
      }
      return uploaded;
    }

    do {
      try {
        const newlyUploaded = await runUploadPass();
        const totalInR2 = Object.keys(manifest).length;
        if (newlyUploaded > 0 || !opts.watchUpload) {
          console.log(`[TTS Sync] R2 sync pass (+${newlyUploaded} uploaded, ${totalInR2}/${items.length} total in R2).`);
        }
        if (!opts.watchUpload || totalInR2 >= items.length) break;
      } catch (err) {
        if (!opts.watchUpload) throw err;
        console.warn(`[TTS Sync] Watch-upload network hiccup (${err.message || err}), retrying in 15s...`);
      }
      await sleep(15000);
    } while (true);
  }
}

main().catch((err) => {
  console.error('[TTS Sync] Fatal error:', err.message || err);
  process.exit(1);
});
