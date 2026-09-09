-- Mentis Database Schema
-- Aligned with docs/DATABASE.md

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. PROFILES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('super_admin', 'admin', 'editor', 'user')),
  daily_goal_minutes INT NOT NULL DEFAULT 20,
  roadmap_target_months INT NOT NULL DEFAULT 2,
  total_xp INT NOT NULL DEFAULT 0,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==========================================
-- 2. MODULES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Modules are readable by everyone"
  ON public.modules FOR SELECT
  USING (true);


-- ==========================================
-- 3. LESSONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_md TEXT NOT NULL DEFAULT '',
  estimated_minutes INT NOT NULL DEFAULT 10,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lessons are readable by everyone" ON public.lessons;
DROP POLICY IF EXISTS "Enable read access for lessons" ON public.lessons;
DROP POLICY IF EXISTS "Enable insert access for lessons" ON public.lessons;
DROP POLICY IF EXISTS "Enable update access for lessons" ON public.lessons;

CREATE POLICY "Enable read access for lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Enable insert access for lessons" ON public.lessons FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for lessons" ON public.lessons FOR UPDATE USING (true);


-- ==========================================
-- 4. LESSON_SECTIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.lesson_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0
);

ALTER TABLE public.lesson_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lesson sections are readable by everyone"
  ON public.lesson_sections FOR SELECT
  USING (true);


-- ==========================================
-- 5. QUESTIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  answer TEXT NOT NULL,
  explanation TEXT NOT NULL DEFAULT '',
  estimated_seconds INT NOT NULL DEFAULT 10,
  source TEXT NOT NULL DEFAULT 'admin' CHECK (source IN ('ai', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Questions are readable by authenticated users" ON public.questions;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.questions;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.questions;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.questions;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.questions;

CREATE POLICY "Enable read access for all users" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.questions FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.questions FOR DELETE USING (true);


-- ==========================================
-- 6. QUIZ_ATTEMPTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  total_questions INT NOT NULL DEFAULT 0,
  score NUMERIC NOT NULL DEFAULT 0
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own quiz attempts"
  ON public.quiz_attempts FOR ALL
  USING (auth.uid() = user_id);


-- ==========================================
-- 7. QUIZ_ANSWERS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  time_taken_ms INT NOT NULL DEFAULT 0
);

ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own quiz answers"
  ON public.quiz_answers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts
      WHERE id = quiz_answers.attempt_id AND user_id = auth.uid()
    )
  );


-- ==========================================
-- 8. LEARNING_PROGRESS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  mastery_percent NUMERIC NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);

ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their learning progress"
  ON public.learning_progress FOR ALL
  USING (auth.uid() = user_id);


-- ==========================================
-- 9. REVIEW_QUEUE (Spaced Repetition)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.review_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  next_review_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  review_count INT NOT NULL DEFAULT 0,
  UNIQUE (user_id, question_id)
);

ALTER TABLE public.review_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their review queue"
  ON public.review_queue FOR ALL
  USING (auth.uid() = user_id);


-- ==========================================
-- 10. ROADMAPS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_months INT NOT NULL DEFAULT 2,
  current_phase INT NOT NULL DEFAULT 1,
  completion_percent NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their roadmap"
  ON public.roadmaps FOR ALL
  USING (auth.uid() = user_id);


-- ==========================================
-- 11. ROADMAP_STEPS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.roadmap_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  target_accuracy NUMERIC NOT NULL DEFAULT 85,
  target_time_seconds INT NOT NULL DEFAULT 5,
  completed BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.roadmap_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their roadmap steps"
  ON public.roadmap_steps FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.roadmaps
      WHERE id = roadmap_steps.roadmap_id AND user_id = auth.uid()
    )
  );


-- ==========================================
-- SEED INITIAL MOCK DATA
-- ==========================================
INSERT INTO public.modules (id, title, slug, description, difficulty, order_index) VALUES
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Mental Math & Speed Calculation', 'mental-math-speed', 'Master rapid multiplication, percentage estimation, and division shortcuts.', 'Beginner', 1),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Numerical Reasoning & Series', 'numerical-reasoning', 'Identify complex number sequences, missing terms, and pattern logic.', 'Intermediate', 2),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'Logical Deductions & Syllogisms', 'logical-deductions', 'Evaluate conditional statements, Venn diagrams, and valid inferences.', 'Advanced', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.lessons (id, module_id, title, content_md, estimated_minutes, order_index) VALUES
  ('b1c2d3e4-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001', 'Rapid Multiplication by 11', 'To multiply any 2-digit number by 11: add the two digits and place the sum in between! Example: 35 x 11 -> 3+(3+5)+5 = 385.', 5, 1),
  ('b1c2d3e4-0000-0000-0000-000000000002', 'a1b2c3d4-0000-0000-0000-000000000001', 'Squaring Numbers Ending in 5', 'Multiply the first digit by (first digit + 1), then append 25. Example: 65^2 -> (6 x 7) = 42 -> 4225.', 8, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.questions (id, module_id, lesson_id, category, difficulty, question, options, answer, explanation, estimated_seconds, source) VALUES
  ('c1d2e3f4-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001', 'b1c2d3e4-0000-0000-0000-000000000001', 'Mental Arithmetic', 'Easy', 'What is 43 x 11?', '["463", "473", "483", "493"]'::jsonb, '473', '4 + 3 = 7. Insert 7 between 4 and 3 to get 473.', 5, 'admin'),
  ('c1d2e3f4-0000-0000-0000-000000000002', 'a1b2c3d4-0000-0000-0000-000000000001', 'b1c2d3e4-0000-0000-0000-000000000002', 'Mental Arithmetic', 'Medium', 'What is 75 squared (75^2)?', '["5225", "5425", "5625", "5825"]'::jsonb, '5625', '7 x (7 + 1) = 56. Append 25 to get 5625.', 7, 'admin')
ON CONFLICT (id) DO NOTHING;
