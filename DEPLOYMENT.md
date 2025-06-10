# Deployment Guide - Flexible Leaderboard System

## Project Status: ✅ READY TO DEPLOY

The flexible leaderboard system is complete and ready for deployment. Here's how to set it up:

## 1. Database Setup (Supabase)

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to initialize
3. Go to the SQL Editor and run this schema:

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
```

### Get Environment Variables
1. Go to Settings → API in your Supabase dashboard
2. Copy your Project URL and anon/public key
3. Create `.env` file in your project root:

```env
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 2. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 3. Netlify Deployment

### Option A: Git Integration (Recommended)
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and create a new site
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add environment variables in Netlify dashboard:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
6. Deploy!

### Option B: Manual Deploy
```bash
# Build the project
npm run build

# Deploy the dist folder to Netlify
# (drag and drop dist folder to netlify.com/drop)
```

## 4. Usage

### URL Structure
- `/` - Landing page showing all leaderboards
- `/create` - Create a new leaderboard
- `/1/entry` - Entry form for leaderboard #1
- `/1/leaderboard` - Display for leaderboard #1

### Creating Leaderboards
1. Visit `/create` on your deployed site
2. Fill in leaderboard details:
   - **Name**: Display name for the leaderboard
   - **Description**: Optional description
   - **Scoring Type**: How entries are ranked
   - **Score Label**: What to call the score (Points, Time, etc.)
   - **Allow Updates**: Whether teams can update their scores
3. Click "Create Leaderboard"

### Adding Entries
1. Visit `/{id}/entry` where {id} is the leaderboard ID
2. Enter team name and score
3. Submit entry

### Viewing Leaderboards
1. Visit `/{id}/leaderboard` for full-screen display
2. Perfect for projectors and monitors
3. Auto-refreshes every 30 seconds
4. Real-time updates via Supabase

## 5. Hackathon Setup

### For Organizers
1. Create leaderboards in advance via `/create`
2. Share entry URLs: `yoursite.netlify.app/{id}/entry`
3. Display leaderboards: `yoursite.netlify.app/{id}/leaderboard`
4. Each competition gets its own ID and independent scoring

### For Participants
1. Go to entry URL provided by organizers
2. Enter team name and score
3. View live rankings on leaderboard display

## 6. Features

### Scoring Types
- **Points (High Wins)**: Trivia, challenges where more is better
- **Points (Low Wins)**: Golf scoring, code golf, where less is better  
- **Time (Fast Wins)**: Speed challenges, races
- **Time (Slow Wins)**: Endurance challenges

### Real-time Updates
- Automatic refresh every 30 seconds
- Live updates via Supabase subscriptions
- No page refresh needed

### Mobile Friendly
- Responsive design works on phones, tablets, laptops
- Touch-friendly interface

## 7. Customization

### Adding More Scoring Types
Update the `scoring_type` enum in the database schema and add logic in `sortEntries()` function.

### Styling
Modify Tailwind classes in components for different themes.

### Additional Features
- CSV export: Add to leaderboard display
- Team photos: Add to entry form and display
- Admin interface: Create management dashboard

## Project Structure

```
src/
├── components/
│   ├── LandingPage.tsx      # Home page listing leaderboards
│   ├── CreateLeaderboard.tsx # Form to create new leaderboards
│   ├── EntryForm.tsx        # Generic entry submission form
│   └── Leaderboard.tsx      # Display leaderboard with real-time updates
├── lib/
│   └── supabase.ts          # Database client and types
├── App.tsx                  # Main routing
└── main.tsx                 # Entry point
```

## Ready to Deploy! 🚀

The system is fully functional and ready for your hackathon. Just set up Supabase, deploy to Netlify, and you're good to go!