# Database Setup Guide

This guide will help you set up Supabase to store and view contact messages and comments from your portfolio website.

## 📋 Step 1: Run SQL Commands in Supabase

1. **Open Supabase SQL Editor**
   - Go to: https://supabase.com/dashboard/project/agudokvkugsayxclkpnm/sql

2. **Create Tables**
   - Click "New Query"
   - Copy and paste the entire content from `setup-contact-tables.sql`
   - Click "Run" to execute

This will create:
- ✅ `contact_messages` table - stores all contact form submissions
- ✅ `portfolio_comments` table - stores all comments from visitors
- ✅ Proper security policies (RLS enabled)
- ✅ Database indexes for better performance

## 🎯 Step 2: Access Your Dashboard

### View Messages and Comments:
Navigate to: **http://localhost:5173/dashboard**

### Dashboard Features:

#### 📊 Statistics Overview
- Total Messages
- Unread Messages
- Total Comments
- Pinned Comments

#### 📧 Contact Messages Tab
- View all contact form submissions
- Mark messages as read/unread
- Delete unwanted messages
- See timestamp and email details

#### 💬 Comments Tab
- View all visitor comments
- Pin/unpin important comments
- Delete spam or inappropriate comments
- See user profile images

## 🔍 How to View Data in Supabase

### Option 1: Using Supabase Dashboard (Recommended)

1. **View Contact Messages:**
   - Go to: https://supabase.com/dashboard/project/agudokvkugsayxclkpnm/editor
   - Select `contact_messages` table
   - Click "View data"

2. **View Comments:**
   - Go to: https://supabase.com/dashboard/project/agudokvkugsayxclkpnm/editor
   - Select `portfolio_comments` table
   - Click "View data"

### Option 2: Using SQL Queries

Open SQL Editor and run these queries:

```sql
-- View all contact messages (newest first)
SELECT * FROM public.contact_messages ORDER BY created_at DESC;

-- View unread messages only
SELECT * FROM public.contact_messages WHERE read = false ORDER BY created_at DESC;

-- View all comments (newest first)
SELECT * FROM public.portfolio_comments ORDER BY created_at DESC;

-- View pinned comments only
SELECT * FROM public.portfolio_comments WHERE is_pinned = true ORDER BY created_at DESC;

-- Count unread messages
SELECT COUNT(*) as unread_count FROM public.contact_messages WHERE read = false;

-- Count total comments
SELECT COUNT(*) as total_comments FROM public.portfolio_comments;
```

## 📝 Useful SQL Operations

### Mark a message as read:
```sql
UPDATE public.contact_messages SET read = true WHERE id = 1;
```

### Pin a comment:
```sql
UPDATE public.portfolio_comments SET is_pinned = true WHERE id = 1;
```

### Delete a message:
```sql
DELETE FROM public.contact_messages WHERE id = 1;
```

### Delete a comment:
```sql
DELETE FROM public.portfolio_comments WHERE id = 1;
```

## 🔐 Security Notes

### Row Level Security (RLS) is enabled:

**Contact Messages:**
- ✅ Anyone can submit (INSERT)
- ❌ Only authenticated users can view (SELECT)
- This keeps your messages private

**Comments:**
- ✅ Anyone can view (SELECT)
- ✅ Anyone can submit (INSERT)
- ❌ Only authenticated users can update (pin/unpin)
- This allows public interaction while protecting against abuse

## 📧 Email Notifications (Optional)

The contact form is configured to also send emails via FormSubmit.

**Current email:** `ekizulfarrachman@gmail.com`

**To change the email:**
1. Open `src/Pages/Contact.jsx`
2. Find line 52: `const formSubmitUrl = 'https://formsubmit.co/ekizulfarrachman@gmail.com';`
3. Replace with your email
4. Save and restart the dev server

**Note:** Messages are saved to Supabase regardless of email delivery status.

## 🧪 Testing

### Test Contact Form:
1. Go to http://localhost:5173
2. Scroll to Contact section
3. Fill out and submit the form
4. Check the dashboard: http://localhost:5173/dashboard
5. Verify the message appears in Supabase

### Test Comments:
1. Go to http://localhost:5173
2. Scroll to the Comments section
3. Submit a comment
4. Check the dashboard
5. Try pinning/unpinning comments

## 🚀 Production Deployment

When deploying to production (e.g., Vercel, Netlify):

1. **Environment Variables:**
   - Make sure `.env` is NOT committed to Git
   - Set environment variables in your hosting platform:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

2. **Dashboard Access:**
   - The dashboard is currently public at `/dashboard`
   - Consider adding authentication if needed

3. **Email Configuration:**
   - Update FormSubmit email to your production email
   - Or remove email functionality and rely only on Supabase

## 🆘 Troubleshooting

### "Database connection not available" error:
- Check that `.env` file exists and has correct values
- Restart the development server: `npm run dev`
- Verify Supabase credentials are correct

### Messages not saving:
- Check browser console for errors
- Verify tables were created in Supabase
- Check RLS policies are set correctly

### Dashboard showing "No messages yet":
- Submit a test message first
- Check Supabase table directly to verify data exists
- Refresh the dashboard page

## 📊 Database Schema

### contact_messages
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Auto-incrementing primary key |
| name | TEXT | Sender's name |
| email | TEXT | Sender's email |
| message | TEXT | Message content |
| created_at | TIMESTAMP | When message was sent |
| read | BOOLEAN | Read/unread status |

### portfolio_comments
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Auto-incrementing primary key |
| user_name | TEXT | Commenter's name |
| content | TEXT | Comment text |
| profile_image | TEXT | Optional profile image URL |
| is_pinned | BOOLEAN | Pin status |
| created_at | TIMESTAMP | When comment was posted |

## 🎉 Success!

You've successfully set up:
- ✅ Contact form connected to Supabase
- ✅ Comments system connected to Supabase
- ✅ Admin dashboard to view all data
- ✅ Secure database with RLS policies

Your portfolio now has a fully functional contact and commenting system with persistent data storage!
