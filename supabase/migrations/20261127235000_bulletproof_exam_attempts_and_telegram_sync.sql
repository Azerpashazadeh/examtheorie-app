-- 1. Deduplicate any accidental double-insert in user_exam_attempts within 15 seconds
DELETE FROM public.user_exam_attempts a
USING public.user_exam_attempts b
WHERE a.id > b.id
  AND a.user_id = b.user_id
  AND a.test_number = b.test_number
  AND a.language = b.language
  AND ABS(EXTRACT(EPOCH FROM (a.completed_at - b.completed_at))) < 15;

-- 2. Backfill any user_progress rows with answered_count (such as Test 9 from an unrefreshed tab) into user_exam_attempts
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
      AND ABS(EXTRACT(EPOCH FROM (a.completed_at - COALESCE(pr.completed_at, now())))) < 60
  );

-- 3. Backfill answered_count / correct_count into today's telegram_fast_test_alerts where available
UPDATE public.telegram_fast_test_alerts t
SET
  answered_count = pr.answered_count,
  correct_count = pr.correct_count,
  total_questions = COALESCE(pr.total_questions, 50)
FROM public.user_progress pr
WHERE t.user_id = pr.user_id
  AND t.test_number = pr.test_number
  AND t.language = pr.language
  AND t.answered_count IS NULL
  AND pr.answered_count IS NOT NULL;

-- 4. Guard against rapid duplicate inserts (<15s) on user_exam_attempts (e.g. double-clicking View Result)
CREATE OR REPLACE FUNCTION public.prevent_rapid_duplicate_exam_attempt()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.user_exam_attempts a
    WHERE a.user_id = NEW.user_id
      AND a.test_number = NEW.test_number
      AND a.language = NEW.language
      AND a.completed_at >= now() - interval '15 seconds'
  ) THEN
    RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_rapid_duplicate_exam_attempt ON public.user_exam_attempts;
CREATE TRIGGER trg_prevent_rapid_duplicate_exam_attempt
  BEFORE INSERT ON public.user_exam_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_rapid_duplicate_exam_attempt();

-- 5. Automatically mirror user_progress writes with answered_count into user_exam_attempts
-- so even an unrefreshed browser tab records every completed test attempt permanently
CREATE OR REPLACE FUNCTION public.sync_user_progress_to_exam_attempts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.answered_count IS NOT NULL THEN
    INSERT INTO public.user_exam_attempts (
      user_id, test_number, language, answered_count, correct_count, total_questions, duration_seconds, completed_at
    )
    VALUES (
      NEW.user_id,
      NEW.test_number,
      NEW.language,
      NEW.answered_count,
      NEW.correct_count,
      COALESCE(NEW.total_questions, 50),
      NEW.duration_seconds,
      now()
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_user_progress_to_exam_attempts ON public.user_progress;
CREATE TRIGGER trg_sync_user_progress_to_exam_attempts
  AFTER INSERT OR UPDATE OF answered_count, correct_count, duration_seconds ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_progress_to_exam_attempts();
