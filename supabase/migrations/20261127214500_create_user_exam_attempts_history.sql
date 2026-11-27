-- Permanent append-only history table so every single exam attempt is recorded separately
-- (never overwritten on re-solve and never deleted when a user resets progress or buys a new package)
CREATE TABLE IF NOT EXISTS public.user_exam_attempts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_number integer NOT NULL CHECK (test_number >= 1 AND test_number <= 100),
  language text NOT NULL,
  answered_count integer CHECK (answered_count IS NULL OR (answered_count >= 0 AND answered_count <= 100)),
  correct_count integer CHECK (correct_count IS NULL OR (correct_count >= 0 AND correct_count <= 100)),
  total_questions integer NOT NULL DEFAULT 50 CHECK (total_questions > 0 AND total_questions <= 100),
  duration_seconds integer CHECK (duration_seconds IS NULL OR (duration_seconds >= 0 AND duration_seconds <= 7200)),
  completed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_exam_attempts_user_completed
  ON public.user_exam_attempts (user_id, completed_at DESC);

ALTER TABLE public.user_exam_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own exam attempts" ON public.user_exam_attempts;
CREATE POLICY "Users can insert own exam attempts"
  ON public.user_exam_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view own exam attempts" ON public.user_exam_attempts;
CREATE POLICY "Users can view own exam attempts"
  ON public.user_exam_attempts
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Backfill already-recorded tests from user_progress so nothing solved earlier is lost
INSERT INTO public.user_exam_attempts (
  user_id, test_number, language, answered_count, correct_count, total_questions, duration_seconds, completed_at
)
SELECT
  pr.user_id,
  pr.test_number,
  pr.language,
  pr.answered_count,
  pr.correct_count,
  COALESCE(pr.total_questions, 50),
  pr.duration_seconds,
  COALESCE(pr.completed_at, now())
FROM public.user_progress pr
WHERE pr.answered_count IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM public.user_exam_attempts a
    WHERE a.user_id = pr.user_id
      AND a.test_number = pr.test_number
      AND a.language = pr.language
      AND a.completed_at = pr.completed_at
  );

NOTIFY pgrst, 'reload schema';
