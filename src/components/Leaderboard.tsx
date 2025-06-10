import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, type Entry, type Leaderboard as LeaderboardType } from '../lib/supabase'

function Leaderboard() {
  const { id } = useParams<{ id: string }>()
  const [leaderboard, setLeaderboard] = useState<LeaderboardType | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLeaderboard = async (leaderboardId: number) => {
    try {
      const { data, error } = await supabase
        .from('leaderboards')
        .select('*')
        .eq('id', leaderboardId)
        .single()

      if (error) throw error
      setLeaderboard(data)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    }
  }

  const fetchEntries = async (leaderboardId: number) => {
    const { data } = await supabase
      .from('entries')
      .select('*')
      .eq('leaderboard_id', leaderboardId)
      .order('created_at', { ascending: true })

    if (data && leaderboard) {
      // Sort based on scoring type
      const sorted = sortEntries(data, leaderboard.scoring_type)
      setEntries(sorted)
    }
  }

  const sortEntries = (entries: Entry[], scoringType: string) => {
    return [...entries].sort((a, b) => {
      switch (scoringType) {
        case 'points_high':
        case 'time_slow':
          // Higher is better
          if (b.score !== a.score) return b.score - a.score
          break
        case 'points_low':
        case 'time_fast':
          // Lower is better
          if (a.score !== b.score) return a.score - b.score
          break
      }
      // Tiebreaker: earlier submission wins
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    })
  }

  const formatScore = (score: number, scoringType: string) => {
    if (scoringType.startsWith('time')) {
      // Format as time if it's in seconds
      const mins = Math.floor(score / 60)
      const secs = score % 60
      if (mins > 0) {
        return `${mins}:${secs.toString().padStart(2, '0')}`
      }
      return `${score}s`
    }
    // Format as number with commas for points
    return score.toLocaleString()
  }

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date()
    const submissionTime = new Date(timestamp)
    const diffMs = now.getTime() - submissionTime.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  useEffect(() => {
    if (id) {
      const leaderboardId = parseInt(id)
      fetchLeaderboard(leaderboardId)
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (leaderboard) {
      fetchEntries(leaderboard.id)
      
      // Refresh every 30 seconds
      const interval = setInterval(() => fetchEntries(leaderboard.id), 30000)
      
      // Subscribe to real-time updates
      const subscription = supabase
        .channel('entries')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'entries',
          filter: `leaderboard_id=eq.${leaderboard.id}`
        }, () => {
          fetchEntries(leaderboard.id)
        })
        .subscribe()

      return () => {
        clearInterval(interval)
        subscription.unsubscribe()
      }
    }
  }, [leaderboard])

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-xl'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-black font-bold text-lg'
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold text-lg'
      default:
        return 'bg-gray-800 text-white hover:bg-gray-700'
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return rank
    }
  }

  if (loading || !leaderboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading leaderboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
            🏆 {leaderboard.name} 🏆
          </h1>
          {leaderboard.description && (
            <p className="text-2xl text-gray-300">{leaderboard.description}</p>
          )}
          <p className="text-lg text-gray-400 mt-2">
            {leaderboard.scoring_type.replace('_', ' ').toUpperCase()}
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-900/80">
              <tr>
                <th className="px-8 py-6 text-left text-2xl font-bold">Rank</th>
                <th className="px-8 py-6 text-left text-2xl font-bold">Team/Player</th>
                <th className="px-8 py-6 text-right text-2xl font-bold">{leaderboard.score_label}</th>
                <th className="px-8 py-6 text-right text-2xl font-bold">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => {
                const rank = index + 1
                return (
                  <tr 
                    key={entry.id} 
                    className={`border-t border-gray-600 transition-all duration-300 ${getRankStyle(rank)}`}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-mono font-bold">
                          {getRankIcon(rank)}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-3xl font-bold ${rank <= 3 ? 'text-shadow' : ''}`}>
                        {entry.team_name}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className={`text-3xl font-mono font-bold ${
                        rank <= 3 ? 'text-gray-800' : 'text-green-400'
                      }`}>
                        {formatScore(entry.score, leaderboard.scoring_type)}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-lg text-gray-300">
                        {formatRelativeTime(entry.created_at)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          
          {entries.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-4">🚀</div>
              <div className="text-2xl font-bold">No entries yet!</div>
              <div className="text-xl mt-2">Be the first to join the leaderboard!</div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <div className="inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur rounded-full px-6 py-3 border border-gray-600">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-lg text-gray-300">Auto-refreshes every 30 seconds</span>
          </div>
          <Link
            to={`/${leaderboard.id}/entry`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 backdrop-blur rounded-full px-6 py-3 border border-blue-500 transition-colors"
          >
            <span className="text-lg">Add Entry</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 backdrop-blur rounded-full px-6 py-3 border border-gray-500 transition-colors"
          >
            <span className="text-lg">All Leaderboards</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard