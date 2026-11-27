-- Add answered question count, correct answer count, total questions, and duration to user_progress
ALTER TABLE public.user_progress
  ADD COLUMN IF NOT EXISTS answered_count integer CHECK (answered_count IS NULL OR (answered_count >= 0 AND answered_count <= 100)),
  ADD COLUMN IF NOT EXISTS correct_count integer CHECK (correct_count IS NULL OR (correct_count >= 0 AND correct_count <= 100)),
  ADD COLUMN IF NOT EXISTS total_questions integer DEFAULT 50 CHECK (total_questions IS NULL OR (total_questions > 0 AND total_questions <= 100)),
  ADD COLUMN IF NOT EXISTS duration_seconds integer CHECK (duration_seconds IS NULL OR (duration_seconds >= 0 AND duration_seconds <= 7200));

NOTIFY pgrst, 'reload schema';
