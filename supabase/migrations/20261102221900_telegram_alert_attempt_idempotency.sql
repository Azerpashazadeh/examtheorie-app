alter table public.telegram_fast_test_alerts
  add column alert_session uuid;

update public.telegram_fast_test_alerts
set alert_session = gen_random_uuid()
where alert_session is null;

alter table public.telegram_fast_test_alerts
  alter column alert_session set default gen_random_uuid(),
  alter column alert_session set not null;

alter table public.telegram_fast_test_alerts
  drop constraint if exists telegram_fast_test_alerts_user_id_test_number_language_key;

alter table public.telegram_fast_test_alerts
  add constraint telegram_fast_test_alerts_alert_session_key unique (alert_session);
