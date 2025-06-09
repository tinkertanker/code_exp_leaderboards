# Flexible Leaderboard System - Specification

## Overview
A flexible, multi-purpose leaderboard web app for hackathon competitions. Supports multiple concurrent leaderboards with different scoring types, perfect for trivia contests, speed challenges, point-based competitions, and more.

## Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL database)
- **Styling**: Tailwind CSS
- **Hosting**: Netlify (single instance serving multiple leaderboards)

## Core Features

### Multiple Leaderboards
- Single deployment supports unlimited leaderboards
- Each leaderboard has a unique numerical ID (e.g., `/1/leaderboard`)
- Independent scoring and display for each competition

### Flexible Scoring Types
- **Points (High Wins)**: Higher scores rank better (e.g., trivia points)
- **Points (Low Wins)**: Lower scores rank better (e.g., golf scores)
- **Time (Fast Wins)**: Faster times rank better (e.g., speed challenges)
- **Time (Slow Wins)**: Longer times rank better (e.g., endurance challenges)

### Three Main Views

#### View 1: Create Leaderboard (`/create`)
- Leaderboard name input
- Description (optional)
- Scoring type dropdown:
  - Points (High Score Wins) - default
  - Points (Low Score Wins)
  - Time (Fastest Wins)
  - Time (Longest Wins)
- Score label input (defaults to "Points" or "Time" based on type)
- Allow score updates checkbox
- Create button → redirects to leaderboard display with ID

#### View 2: Entry Form (`/:id/entry`)
- Shows leaderboard name at top
- Team/participant name input
- Score input with appropriate label (Points/Time/custom)
- Submit button with success feedback
- Option to update score if leaderboard allows
- Link to view leaderboard

#### View 3: Leaderboard Display (`/:id/leaderboard`)
- Full-screen display optimized for projectors/monitors
- Shows leaderboard name and description
- Auto-refreshes every 30 seconds
- Real-time updates via Supabase subscriptions
- Shows rank, team name, score, and submission time
- Top 3 highlighted with medals (🥇🥈🥉)
- Links to entry form and home page

## Supabase Schema
```sql
-- Leaderboard configurations
CREATE TABLE leaderboards (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    description text,
    scoring_type text NOT NULL CHECK (scoring_type IN ('points_high', 'points_low', 'time_fast', 'time_slow')),
    score_label text DEFAULT 'Score', -- Customizable label (e.g., "Points", "Time", "Questions")
    allow_updates boolean DEFAULT false, -- Can teams update their scores?
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

-- Generic entries for any leaderboard
CREATE TABLE entries (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    leaderboard_id integer REFERENCES leaderboards(id) ON DELETE CASCADE,
    team_name text NOT NULL,
    score numeric NOT NULL,
    metadata jsonb DEFAULT '{}', -- Flexible field for additional data
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(leaderboard_id, team_name) -- Prevent duplicate team names per leaderboard
);

-- Global settings
CREATE TABLE settings (
    id integer PRIMARY KEY DEFAULT 1,
    refresh_interval_seconds integer NOT NULL DEFAULT 30
);

-- Insert default settings
INSERT INTO settings (refresh_interval_seconds) VALUES (30);

-- Example leaderboards
INSERT INTO leaderboards (name, description, scoring_type, score_label) VALUES 
    ('Hackathon Trivia Night', 'Test your tech knowledge!', 'points_high', 'Points'),
    ('Speed Coding Challenge', 'How fast can you solve it?', 'time_fast', 'Seconds'),
    ('Code Golf Challenge', 'Lowest character count wins', 'points_low', 'Characters');
```

## Application Routes

### Landing Page (`/`)
- Lists all active leaderboards
- Shows leaderboard ID, name, description, and entry count
- Links to both entry form and display for each leaderboard
- "Create New Leaderboard" button

### Create Leaderboard (`/create`)
- Form to create a new leaderboard
- Automatically generates next ID
- Redirects to the new leaderboard display after creation

### Entry Form (`/:id/entry`)
- Fetches leaderboard config by ID to show appropriate fields
- Validates team name uniqueness
- Shows score label based on leaderboard type
- Success message with option to view leaderboard

### Leaderboard Display (`/:id/leaderboard`)
- Full-screen responsive design
- Sorting based on scoring_type configuration
- Real-time updates without page refresh
- Clean, readable display for projection

## Key Implementation Details

### Scoring Logic
```typescript
// Sort entries based on leaderboard scoring_type
const sortEntries = (entries: Entry[], scoringType: string) => {
  return entries.sort((a, b) => {
    switch (scoringType) {
      case 'points_high':
      case 'time_slow':
        return b.score - a.score; // Higher is better
      case 'points_low':
      case 'time_fast':
        return a.score - b.score; // Lower is better
      default:
        return 0;
    }
  });
};
```

### URL Structure
- `/` - Landing page showing all leaderboards
- `/create` - Form to create a new leaderboard
- `/1/entry` - Entry form for leaderboard #1
- `/1/leaderboard` - Display for leaderboard #1
- `/2/entry` - Entry form for leaderboard #2
- `/2/leaderboard` - Display for leaderboard #2

### Update Behavior
- If `allow_updates` is true: Updates existing entry for team
- If `allow_updates` is false: Rejects duplicate team names
- All updates tracked with `updated_at` timestamp

## Development Setup
```bash
# Clone or create new project
npm install
npm install @supabase/supabase-js
npm install react-router-dom
```

## Environment Variables
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Key Features
- No authentication required
- Support for multiple concurrent leaderboards
- Real-time updates and auto-refresh
- Mobile-friendly responsive design
- Flexible scoring systems
- Optional score updates per leaderboard

## Migration from Code Golf

### Components to Keep
- `Leaderboard.tsx` - Adapt for generic scoring
- `supabase.ts` - Update types for new schema
- Routing structure - Expand for multiple leaderboards
- Real-time subscriptions - Keep for live updates

### Components to Remove
- `Challenge.tsx` - No longer needed
- `Timer.tsx` - Can be removed or repurposed
- Monaco Editor dependencies
- Code execution edge functions

### Components to Modify
- `TeamEntry.tsx` → Generic entry form
- `App.tsx` → New routing with IDs
- Database schema → New flexible structure

### New Components to Create
- `CreateLeaderboard.tsx` - Form for creating new leaderboards
- `LandingPage.tsx` - Home page listing all leaderboards

## Implementation Plan

### Phase 1: Database Migration (30 minutes)
1. Create new Supabase tables (leaderboards, entries)
2. Migrate settings table if needed
3. Insert example leaderboards
4. Test database connections

### Phase 2: Core Refactoring (1-2 hours)
1. Update TypeScript types for new schema
2. Remove code execution functionality
3. Create landing page component listing all leaderboards
4. Create leaderboard creation form component
5. Refactor entry form for generic use
6. Update leaderboard display for flexible scoring

### Phase 3: Routing Updates (30 minutes)
1. Implement ID-based routing (:id parameter)
2. Add landing page route (/)
3. Add create leaderboard route (/create)
4. Update navigation flow
5. Handle 404 for invalid IDs

### Phase 4: Testing & Polish (30 minutes)
1. Test different scoring types
2. Verify real-time updates
3. Check responsive design
4. Add error handling

### Deployment
- Same Netlify setup as before
- No changes needed to deployment process
- Update environment variables if needed

## Usage Examples

### Creating a New Leaderboard
```sql
INSERT INTO leaderboards (name, description, scoring_type, score_label, allow_updates) 
VALUES ('Hackathon Trivia', 'Test your knowledge!', 'points_high', 'Points', true);
-- This will create a leaderboard with ID 1 (or next available ID)
```

### Accessing Leaderboards
- Entry: `https://yourapp.netlify.app/1/entry`
- Display: `https://yourapp.netlify.app/1/leaderboard`

## Future Enhancements
- CSV export functionality
- Custom themes per leaderboard
- Team photos/avatars
- Historical leaderboard archives
- Leaderboard deletion/archiving
- Password protection for certain leaderboards
- QR codes for easy access to entry forms