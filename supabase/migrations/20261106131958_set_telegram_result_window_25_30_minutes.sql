alter table public.telegram_fast_test_alerts
  drop constraint if exists telegram_fast_test_alerts_elapsed_seconds_check;

alter table public.telegram_fast_test_alerts
  add constraint telegram_fast_test_alerts_elapsed_seconds_check
  check (
    (elapsed_seconds >= 480 and elapsed_seconds <= 900)
    or (elapsed_seconds >= 1500 and elapsed_seconds <= 1800)
  );
