-- Lightweight pointer-only table for "Zorlandığım Sorular" (Saved Difficult Questions)
-- Stores NO images or question blobs (~50 bytes per bookmark)
CREATE TABLE IF NOT EXISTS public.user_saved_questions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language text NOT NULL CHECK (language IN ('en', 'nl', 'tr', 'ar', 'ru', 'fa', 'es')),
  content_test integer NOT NULL CHECK (content_test >= 1 AND content_test <= 5),
  file_type text NOT NULL CHECK (file_type IN ('radio', 'fillblank', 'checkbox', 'resimsech', 'dragdrop')),
  question_numara integer NOT NULL CHECK (question_numara >= 1 AND question_numara <= 100),
  source_test integer CHECK (source_test IS NULL OR (source_test >= 1 AND source_test <= 50)),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_saved_questions_unique_item UNIQUE (user_id, language, content_test, file_type, question_numara)
);

CREATE INDEX IF NOT EXISTS idx_user_saved_questions_user_lang_created
  ON public.user_saved_questions (user_id, language, created_at DESC);

ALTER TABLE public.user_saved_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own saved questions" ON public.user_saved_questions;
CREATE POLICY "Users can view own saved questions"
  ON public.user_saved_questions
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own saved questions" ON public.user_saved_questions;
CREATE POLICY "Users can insert own saved questions"
  ON public.user_saved_questions
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own saved questions" ON public.user_saved_questions;
CREATE POLICY "Users can update own saved questions"
  ON public.user_saved_questions
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own saved questions" ON public.user_saved_questions;
CREATE POLICY "Users can delete own saved questions"
  ON public.user_saved_questions
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_saved_questions TO authenticated;
GRANT ALL ON public.user_saved_questions TO service_role;

NOTIFY pgrst, 'reload schema';
