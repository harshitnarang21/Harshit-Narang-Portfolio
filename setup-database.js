import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://agudokvkugsayxclkpnm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFndWRva3ZrdWdzYXl4Y2xrcG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0ODQxODgsImV4cCI6MjA3NzA2MDE4OH0.1jwLhT5CoXtI5KCiOz2RIB_f8hBJLtmSrR9cJXAh63I';

console.log('\n📋 Database Setup Instructions\n');
console.log('Please create the following tables in your Supabase dashboard:\n');

console.log('1️⃣  CREATE PROJECTS TABLE:');
console.log('   Go to: https://supabase.com/dashboard/project/agudokvkugsayxclkpnm/editor\n');
console.log('   Run this SQL:\n');
console.log(`
CREATE TABLE IF NOT EXISTS public.projects (
  id SERIAL PRIMARY KEY,
  "Title" TEXT NOT NULL,
  "Description" TEXT NOT NULL,
  "Img" TEXT NOT NULL,
  "Link" TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.projects
  FOR SELECT USING (true);

-- Create policy to allow authenticated insert
CREATE POLICY "Allow authenticated insert" ON public.projects
  FOR INSERT WITH CHECK (true);
`);

console.log('\n2️⃣  CREATE CERTIFICATES TABLE:');
console.log(`
CREATE TABLE IF NOT EXISTS public.certificates (
  id SERIAL PRIMARY KEY,
  "Img" TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.certificates
  FOR SELECT USING (true);
`);

console.log('\n3️⃣  CREATE COMMENTS TABLE:');
console.log(`
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
CREATE POLICY "Allow public read access" ON public.portfolio_comments
  FOR SELECT USING (true);

-- Create policy to allow public insert
CREATE POLICY "Allow public insert" ON public.portfolio_comments
  FOR INSERT WITH CHECK (true);
`);

console.log('\n4️⃣  CREATE STORAGE BUCKET:');
console.log('   Go to Storage → Create a new bucket named: profile-images');
console.log('   Set it to Public\n');

console.log('\n5️⃣  INSERT PROJECTS DATA:');
console.log(`
INSERT INTO public.projects ("Title", "Description", "Img", "Link") VALUES
('Bank Management System', 'Led design and implementation for a scalable banking platform handling over 1,000 customer records. Streamlined daily banking operations, reducing manual effort by 25% through automation. Automated fraud detection system lowered incident rate by 15%. Presented comprehensive solution to client team, receiving positive feedback for clarity and communication.', 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=800&q=80', 'https://github.com/harshitnarang21/BANK-MANAGEMENT-SYSTEM'),
('AI-Powered Mental Health Platform (MindCare)', 'Built user-focused wellness modules adopted by 120+ users within the first month. Integrated secure Google OAuth authentication, raising sign-up rates by 40%. Conducted user interviews and incorporated feedback into new features. Communicated product vision in group presentations and hackathon pitches, demonstrating strong presentation and collaboration skills.', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80', 'https://minc.netlify.app'),
('Sudarshan – Village Infrastructure Digital Twin', 'Digitized reporting for 15+ civic facilities, accelerating issue resolution by 2x. Managed comprehensive database design for 5,000+ data points, improving reliability of issue tracking. Facilitated seamless communication between administrators and users via structured notifications. Coordinated a team of 3 during feature delivery cycles, ensuring timely project completion.', 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80', '#');
`);

console.log('\n✅ After running these SQL commands, your projects will appear on the website!\n');
