import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Leaderboard = {
  id: number
  name: string
  description: string | null
  scoring_type: 'points_high' | 'points_low' | 'time_fast' | 'time_slow'
  score_label: string
  allow_updates: boolean
  is_active: boolean
  created_at: string
}

export type Entry = {
  id: string
  leaderboard_id: number
  team_name: string
  score: number
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export type Settings = {
  id: number
  refresh_interval_seconds: number
}