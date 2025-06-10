import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { supabase, type Leaderboard } from '../lib/supabase'

function EntryForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null)
  const [teamName, setTeamName] = useState('')
  const [score, setScore] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      fetchLeaderboard(parseInt(id))
    }
  }, [id])

  async function fetchLeaderboard(leaderboardId: number) {
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
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName.trim() || !score || !leaderboard) return

    setSubmitting(true)
    try {
      // Check if team already exists
      const { data: existingEntry } = await supabase
        .from('entries')
        .select('id')
        .eq('leaderboard_id', leaderboard.id)
        .eq('team_name', teamName.trim())
        .single()

      if (existingEntry && !leaderboard.allow_updates) {
        alert('This team name already exists and updates are not allowed for this leaderboard.')
        return
      }

      if (existingEntry && leaderboard.allow_updates) {
        // Update existing entry
        const { error } = await supabase
          .from('entries')
          .update({
            score: parseFloat(score),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingEntry.id)

        if (error) throw error
        alert('Score updated successfully!')
      } else {
        // Create new entry
        const { error } = await supabase
          .from('entries')
          .insert([{
            leaderboard_id: leaderboard.id,
            team_name: teamName.trim(),
            score: parseFloat(score)
          }])

        if (error) throw error
        alert('Entry submitted successfully!')
      }

      // Navigate to leaderboard
      navigate(`/${leaderboard.id}/leaderboard`)
    } catch (error) {
      console.error('Error submitting entry:', error)
      alert('Failed to submit entry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!leaderboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Leaderboard not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-8">
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-white/20 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center text-white">{leaderboard.name}</h1>
        {leaderboard.description && (
          <p className="text-lg text-white/80 mb-6 text-center">{leaderboard.description}</p>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Team/Participant Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full p-3 rounded bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-white/60 focus:outline-none"
              placeholder="Enter your team name"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-white font-medium mb-2">
              {leaderboard.score_label}
            </label>
            <input
              type="number"
              step="any"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full p-3 rounded bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-white/60 focus:outline-none"
              placeholder={`Enter ${leaderboard.score_label.toLowerCase()}`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded transition-colors mb-4"
          >
            {submitting ? 'Submitting...' : 'Submit Entry'}
          </button>
        </form>

        <div className="text-center">
          <Link
            to={`/${leaderboard.id}/leaderboard`}
            className="text-white/80 hover:text-white underline"
          >
            View Leaderboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EntryForm