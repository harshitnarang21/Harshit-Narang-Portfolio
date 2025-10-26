-- ============================================
-- CONTACT MESSAGES TABLE
-- ============================================
-- This table stores all contact form submissions
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public insert (anyone can submit contact form)
CREATE POLICY "Allow public insert contact messages" ON public.contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Create policy to allow public read (so dashboard can read without auth)
CREATE POLICY "Allow public read contact messages" ON public.contact_messages
  FOR SELECT TO anon, authenticated USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON public.contact_messages(read);

-- ============================================
-- PORTFOLIO COMMENTS TABLE (if not exists)
-- ============================================
-- This table stores all comments from the comments section
CREATE TABLE IF NOT EXISTS public.portfolio_comments (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  profile_image TEXT,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.portfolio_comments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access comments" ON public.portfolio_comments
  FOR SELECT USING (true);

-- Create policy to allow public insert
CREATE POLICY "Allow public insert comments" ON public.portfolio_comments
  FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated update (for pinning comments)
CREATE POLICY "Allow authenticated update comments" ON public.portfolio_comments
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_portfolio_comments_created_at ON public.portfolio_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_comments_pinned ON public.portfolio_comments(is_pinned);

-- ============================================
-- HELPFUL QUERIES TO VIEW DATA
-- ============================================

-- View all contact messages (newest first)
-- SELECT * FROM public.contact_messages ORDER BY created_at DESC;

-- View unread contact messages
-- SELECT * FROM public.contact_messages WHERE read = false ORDER BY created_at DESC;

-- Mark a message as read
-- UPDATE public.contact_messages SET read = true WHERE id = 1;

-- View all comments (newest first)
-- SELECT * FROM public.portfolio_comments ORDER BY created_at DESC;

-- View pinned comments
-- SELECT * FROM public.portfolio_comments WHERE is_pinned = true ORDER BY created_at DESC;

-- Pin a comment
-- UPDATE public.portfolio_comments SET is_pinned = true WHERE id = 1;

-- Count unread messages
-- SELECT COUNT(*) as unread_count FROM public.contact_messages WHERE read = false;

-- Count total comments
-- SELECT COUNT(*) as total_comments FROM public.portfolio_comments;
