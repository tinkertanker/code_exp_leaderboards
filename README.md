# Flexible Leaderboard System

A flexible, multi-purpose leaderboard web app for hackathon competitions. Supports multiple concurrent leaderboards with different scoring types, perfect for trivia contests, speed challenges, point-based competitions, and more.

## Features

### 🏆 **Multiple Leaderboards**
- Single deployment supports unlimited leaderboards
- Each leaderboard has a unique numerical ID (e.g., `/1/leaderboard`)
- Independent scoring and display for each competition

### 📊 **Flexible Scoring Types**
- **Points (High Wins)**: Higher scores rank better (e.g., trivia points)
- **Points (Low Wins)**: Lower scores rank better (e.g., golf scores)
- **Time (Fast Wins)**: Faster times rank better (e.g., speed challenges)
- **Time (Slow Wins)**: Longer times rank better (e.g., endurance challenges)

### 💻 **Three Main Views**
- **Landing Page** (`/`): Lists all active leaderboards
- **Create Leaderboard** (`/create`): Form to create new leaderboards
- **Entry Form** (`/:id/entry`): Submit scores for teams/participants
- **Leaderboard Display** (`/:id/leaderboard`): Full-screen display for monitors

### ⚡ **Real-time Features**
- Auto-refreshes every 30 seconds
- Live updates via Supabase subscriptions
- Mobile-friendly responsive design
- Top 3 highlighted with medals (🥇🥈🥉)

## Quick Deploy

### 🚀 One-Click Deployment

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tinkertanker/code_exp_leaderboards)

[![Deploy to Supabase](https://img.shields.io/badge/Deploy%20to-Supabase-181818?style=flat&logo=supabase&logoColor=white)](https://database.new/)

### Easy Setup (5 minutes)

1. **Deploy to Netlify**: Click the button above to automatically fork and deploy
2. **Set up Supabase**: Click the Supabase button to create a new project
3. **Run the database schema** (see below)
4. **Add environment variables** to Netlify
5. **Done!** Your leaderboard system is ready

## Manual Setup

### Prerequisites
- Node.js 18+
- Supabase account (free tier works)
- Netlify account for deployment (optional)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/code_exp_leaderboard.git
   cd code_exp_leaderboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create Supabase Project**
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your **Project URL** and **Anon Key** from Settings → API

4. **Set up database schema**
   
   **Option A: One-Click Setup**
   - Use this SQL template: [![Run in Supabase](https://img.shields.io/badge/Run%20in-Supabase-181818?style=flat&logo=supabase&logoColor=white)](https://supabase.com/dashboard/projects/_/sql/new?content=LS0gTGVhZGVyYm9hcmQgY29uZmlndXJhdGlvbnMKQ1JFQVRFIFRBQkxFIGxlYWRlcmJvYXJkcyAoCiAgICBpZCBTRVJJQUwgUFJJTUFSWSBLRVksCiAgICBuYW1lIHRleHQgTk9UIE5VTEwsCiAgICBkZXNjcmlwdGlvbiB0ZXh0LAogICAgc2NvcmluZ190eXBlIHRleHQgTk9UIE5VTEwgQ0hFQ0sgKHNjb3JpbmdfdHlwZSBJTiAoJ3BvaW50c19oaWdoJywgJ3BvaW50c19sb3cnLCAndGltZV9mYXN0JywgJ3RpbWVfc2xvdycpKSwKICAgIHNjb3JlX2xhYmVsIHRleHQgREVGQVVMVCAnU2NvcmUnLAogICAgYWxsb3dfdXBkYXRlcyBib29sZWFuIERFRkFVTFQgZmFsc2UsCiAgICBpc19hY3RpdmUgYm9vbGVhbiBERUZBVUxUIHRydWUsCiAgICBjcmVhdGVkX2F0IHRpbWVzdGFtcCB3aXRoIHRpbWUgem9uZSBERUZBVUxUIE5PVygpCik7CgotLSBHZW5lcmljIGVudHJpZXMgZm9yIGFueSBsZWFkZXJib2FyZApDUkVBVEUgVEFCTEUgZW50cmllcyAoCiAgICBpZCB1dWlkIERFRkFVTFQgZ2VuX3JhbmRvbV91dWlkKCkgUFJJTUFSWSBLRVksCiAgICBsZWFkZXJib2FyZF9pZCBpbnRlZ2VyIFJFRkVSRU5DRVMgbGVhZGVyYm9hcmRzKGlkKSBPTiBERUxFVEUgQ0FTQ0FERSwKICAgIHRlYW1fbmFtZSB0ZXh0IE5PVCBOVUxMLAogICAgc2NvcmUgbnVtZXJpYyBOT1QgTlVMTCwKICAgIG1ldGFkYXRhIGpzb25iIERFRkFVTFQgJ3t9JywKICAgIGNyZWF0ZWRfYXQgdGltZXN0YW1wIHdpdGggdGltZSB6b25lIERFRkFVTFQgTk9XKCksCiAgICB1cGRhdGVkX2F0IHRpbWVzdGFtcCB3aXRoIHRpbWUgem9uZSBERUZBVUxUIE5PVygpLAogICAgVU5JUVVFKGxlYWRlcmJvYXJkX2lkLCB0ZWFtX25hbWUpCik7CgotLSBHbG9iYWwgc2V0dGluZ3MKQ1JFQVRFIFRBQkxFIHNldHRpbmdzICgKICAgIGlkIGludGVnZXIgUFJJTUFSWSBLRVkgREVGQVVMVCAxLAogICAgcmVmcmVzaF9pbnRlcnZhbF9zZWNvbmRzIGludGVnZXIgTk9UIE5VTEwgREVGQVVMVCAzMAopOwoKLS0gSW5zZXJ0IGRlZmF1bHQgc2V0dGluZ3MKSU5TRVJUIElOVE8gc2V0dGluZ3MgKHJlZnJlc2hfaW50ZXJ2YWxfc2Vjb25kcykgVkFMVUVTICgzMCk7CgotLSBFeGFtcGxlIGxlYWRlcmJvYXJkcyAob3B0aW9uYWwpCklOU0VSVCBJTlRPIGxlYWRlcmJvYXJkcyAobmFtZSwgZGVzY3JpcHRpb24sIHNjb3JpbmdfdHlwZSwgc2NvcmVfbGFiZWwpIFZBTFVFUyAKICAgICgnSGFja2F0aG9uIFRyaXZpYSBOaWdodCcsICdUZXN0IHlvdXIgdGVjaCBrbm93bGVkZ2UhJywgJ3BvaW50c19oaWdoJywgJ1BvaW50cycpLAogICAgKCdTcGVlZCBDb2RpbmcgQ2hhbGxlbmdlJywgJ0hvdyBmYXN0IGNhbiB5b3Ugc29sdmUgaXQ%2FJywgJ3RpbWVfZmFzdCcsICdTZWNvbmRzJyksCiAgICAoJ0NvZGUgR29sZiBDaGFsbGVuZ2UnLCAnTG93ZXN0IGNoYXJhY3RlciBjb3VudCB3aW5zJywgJ3BvaW50c19sb3cnLCAnQ2hhcmFjdGVycycpOwoKLS0gRGlzYWJsZSBSTFMgZm9yIGhhY2thdGhvbiBzaW1wbGljaXR5CkFMVEVSIFRBQkxFIGxlYWRlcmJvYXJkcyBESVNBQkxFIFJPVyBMRVZFTCBTRUNVUklUWTsKQUxURVIgVEFCTEUgZW50cmllcyBESVNBQkxFIFJPVyBMRVZFTCBTRUNVUklUWTsKQUxURVIgVEFCTEUgc2V0dGluZ3MgRElTQUJMRSBST1cgTEVWRUwgU0VDVVJJVFk7)
   
   **Option B: Manual Setup**
   Go to **SQL Editor** in Supabase dashboard and run:
   ```sql
   -- Leaderboard configurations
   CREATE TABLE leaderboards (
       id SERIAL PRIMARY KEY,
       name text NOT NULL,
       description text,
       scoring_type text NOT NULL CHECK (scoring_type IN ('points_high', 'points_low', 'time_fast', 'time_slow')),
       score_label text DEFAULT 'Score',
       allow_updates boolean DEFAULT false,
       is_active boolean DEFAULT true,
       created_at timestamp with time zone DEFAULT now()
   );

   -- Generic entries for any leaderboard
   CREATE TABLE entries (
       id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
       leaderboard_id integer REFERENCES leaderboards(id) ON DELETE CASCADE,
       team_name text NOT NULL,
       score numeric NOT NULL,
       metadata jsonb DEFAULT '{}',
       created_at timestamp with time zone DEFAULT now(),
       updated_at timestamp with time zone DEFAULT now(),
       UNIQUE(leaderboard_id, team_name)
   );

   -- Global settings
   CREATE TABLE settings (
       id integer PRIMARY KEY DEFAULT 1,
       refresh_interval_seconds integer NOT NULL DEFAULT 30
   );

   -- Insert default settings
   INSERT INTO settings (refresh_interval_seconds) VALUES (30);

   -- Example leaderboards (optional)
   INSERT INTO leaderboards (name, description, scoring_type, score_label) VALUES 
       ('Hackathon Trivia Night', 'Test your tech knowledge!', 'points_high', 'Points'),
       ('Speed Coding Challenge', 'How fast can you solve it?', 'time_fast', 'Seconds'),
       ('Code Golf Challenge', 'Lowest character count wins', 'points_low', 'Characters');

   -- Disable RLS for hackathon simplicity
   ALTER TABLE leaderboards DISABLE ROW LEVEL SECURITY;
   ALTER TABLE entries DISABLE ROW LEVEL SECURITY;
   ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
   ```

5. **Configure environment**
   Create `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

6. **Run locally**
   ```bash
   npm run dev
   ```
   
   Your app will be available at:
   - **Landing page**: `http://localhost:5173/`
   - **Create leaderboard**: `http://localhost:5173/create`
   - **Entry form**: `http://localhost:5173/1/entry`
   - **Leaderboard display**: `http://localhost:5173/1/leaderboard`

## Deployment

### Netlify (Recommended)

#### Option A: One-Click Deploy
Use the deploy button at the top of this README - it will automatically:
- Fork the repository to your GitHub
- Connect it to Netlify
- Set up build configuration
- You just need to add your environment variables

#### Option B: Manual Deploy
1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com) and create a new site
   - Connect your GitHub repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Add environment variables in Netlify dashboard:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - Deploy!

### Manual Deploy
```bash
# Build the project
npm run build

# Deploy the dist folder to Netlify
# (drag and drop dist folder to netlify.com/drop)
```

## Usage

### URL Structure
- `/` - Landing page showing all leaderboards
- `/create` - Create a new leaderboard
- `/1/entry` - Entry form for leaderboard #1
- `/1/leaderboard` - Display for leaderboard #1

### For Organizers

1. **Create leaderboards** via `/create`
2. **Share entry URLs**: `yoursite.netlify.app/{id}/entry`
3. **Display leaderboards**: `yoursite.netlify.app/{id}/leaderboard`
4. Each competition gets its own ID and independent scoring

### For Participants

1. Go to entry URL provided by organizers
2. Enter team name and score
3. View live rankings on leaderboard display

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL database)
- **Routing**: React Router
- **Hosting**: Netlify

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/
│   ├── LandingPage.tsx      # Home page listing leaderboards
│   ├── CreateLeaderboard.tsx # Form to create new leaderboards
│   ├── EntryForm.tsx        # Generic entry submission form
│   ├── EditLeaderboard.tsx  # Edit existing leaderboards
│   └── Leaderboard.tsx      # Display leaderboard with real-time updates
├── lib/
│   └── supabase.ts          # Database client and types
├── App.tsx                  # Main routing
└── main.tsx                 # Entry point
```

## Troubleshooting

### Common Issues

1. **Database connection issues**
   - Verify your Supabase URL and Anon Key are correct
   - Check that RLS is disabled on all tables
   - Restart dev server after changing `.env`

2. **Environment variables not working**
   - Make sure `.env` file exists with correct Supabase credentials
   - Restart dev server after changing `.env`

3. **Deployment issues**
   - Ensure environment variables are set in Netlify dashboard
   - Check build logs for errors
   - Verify build command is `npm run build` and publish directory is `dist`

## Contributing

Feel free to submit issues and pull requests!

## License

MIT