import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, type Leaderboard } from '../lib/supabase'

export default function LandingPage() {
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([])
  const [entryCounts, setEntryCounts] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboards()
  }, [])

  async function fetchLeaderboards() {
    try {
      // Fetch all active leaderboards
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from('leaderboards')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: true })

      if (leaderboardError) throw leaderboardError

      setLeaderboards(leaderboardData || [])

      // Fetch entry counts for each leaderboard
      if (leaderboardData && leaderboardData.length > 0) {
        const counts: Record<number, number> = {}
        
        for (const lb of leaderboardData) {
          const { count } = await supabase
            .from('entries')
            .select('*', { count: 'exact', head: true })
            .eq('leaderboard_id', lb.id)
          
          counts[lb.id] = count || 0
        }
        
        setEntryCounts(counts)
      }
    } catch (error) {
      console.error('Error fetching leaderboards:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading leaderboards...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-bold text-white text-center mb-12">
          Leaderboard System
        </h1>

        <div className="text-center mb-8">
          <Link
            to="/create"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Create New Leaderboard
          </Link>
        </div>

        {leaderboards.length === 0 ? (
          <div className="text-center text-white text-xl">
            No active leaderboards yet. Create one to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaderboards.map((leaderboard) => (
              <div
                key={leaderboard.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
              >
                <h2 className="text-2xl font-bold text-white mb-2">
                  {leaderboard.name}
                </h2>
                
                {leaderboard.description && (
                  <p className="text-white/80 mb-4">{leaderboard.description}</p>
                )}

                <div className="text-white/60 text-sm mb-4">
                  <div>ID: #{leaderboard.id}</div>
                  <div>Type: {leaderboard.scoring_type.replace('_', ' ')}</div>
                  <div>Entries: {entryCounts[leaderboard.id] || 0}</div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/${leaderboard.id}/entry`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-center transition-colors"
                  >
                    Add Entry
                  </Link>
                  <Link
                    to={`/${leaderboard.id}/leaderboard`}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded text-center transition-colors"
                  >
                    View Board
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}