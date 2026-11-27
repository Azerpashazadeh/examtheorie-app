-- Store answered_count, correct_count, and total_questions on fast-test Telegram alerts
-- and index user_id foreign key for fast joins in admin reports
ALTER TABLE public.telegram_fast_test_alerts
  ADD COLUMN IF NOT EXISTS answered_count integer CHECK (answered_count IS NULL OR (answered_count >= 0 AND answered_count <= 100)),
  ADD COLUMN IF NOT EXISTS correct_count integer CHECK (correct_count IS NULL OR (correct_count >= 0 AND correct_count <= 100)),
  ADD COLUMN IF NOT EXISTS total_questions integer DEFAULT 50 CHECK (total_questions IS NULL OR (total_questions > 0 AND total_questions <= 100));

CREATE INDEX IF NOT EXISTS idx_telegram_fast_test_alerts_user_id
  ON public.telegram_fast_test_alerts (user_id);

NOTIFY pgrst, 'reload schema';
