# Authentication & Project Saving Setup

## Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Go to Settings > API and copy your project URL and anon key
3. Update `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

## Database Setup

1. Go to your Supabase dashboard > SQL Editor
2. Run the SQL commands from `supabase-setup.sql` to create the projects table

## Features Added

### Authentication
- Login/Signup dialog with email/password
- User session management
- Protected IDE access (requires login)
- User info display in header

### Project Management
- Save projects to Supabase database
- Load user's saved projects on IDE launch
- Visual indicators for saved projects (green dot)
- Delete projects from database
- Projects are user-specific (RLS enabled)

### Usage
1. Users must sign in to access the IDE
2. Projects are automatically loaded when entering the IDE
3. Use the dropdown menu on sketch tabs to save projects
4. Saved projects show a green indicator dot
5. Projects persist across sessions

## Security
- Row Level Security (RLS) ensures users only see their own projects
- Authentication handled by Supabase Auth
- Secure API calls with user context