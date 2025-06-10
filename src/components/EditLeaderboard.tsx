import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase, type Leaderboard } from '../lib/supabase'

type ScoringType = 'points_high' | 'points_low' | 'time_fast' | 'time_slow'

export default function EditLeaderboard() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    scoring_type: 'points_high' as ScoringType,
    score_label: 'Points',
    allow_updates: false,
    is_active: true
  })

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
      setFormData({
        name: data.name,
        description: data.description || '',
        scoring_type: data.scoring_type,
        score_label: data.score_label,
        allow_updates: data.allow_updates,
        is_active: data.is_active
      })
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      alert('Leaderboard not found')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  function handleScoringTypeChange(type: ScoringType) {
    setFormData({
      ...formData,
      scoring_type: type,
      score_label: type.startsWith('time') ? 'Time' : 'Points'
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.name.trim() || !leaderboard) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('leaderboards')
        .update({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          scoring_type: formData.scoring_type,
          score_label: formData.score_label.trim() || 
            (formData.scoring_type.startsWith('time') ? 'Time' : 'Points'),
          allow_updates: formData.allow_updates,
          is_active: formData.is_active
        })
        .eq('id', leaderboard.id)

      if (error) throw error

      alert('Leaderboard updated successfully!')
      navigate('/')
    } catch (error) {
      console.error('Error updating leaderboard:', error)
      alert('Failed to update leaderboard. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!leaderboard) return
    
    if (!confirm(`Are you sure you want to delete "${leaderboard.name}"? This will also delete all entries and cannot be undone.`)) {
      return
    }

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('leaderboards')
        .delete()
        .eq('id', leaderboard.id)

      if (error) throw error

      alert('Leaderboard deleted successfully!')
      navigate('/')
    } catch (error) {
      console.error('Error deleting leaderboard:', error)
      alert('Failed to delete leaderboard. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading leaderboard...</div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Edit Leaderboard
        </h1>

        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
          <div className="mb-6">
            <label htmlFor="name" className="block text-white font-semibold mb-2">
              Leaderboard Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-white/60 focus:outline-none"
              placeholder="e.g., Hackathon Trivia Night"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-white font-semibold mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-white/60 focus:outline-none"
              placeholder="e.g., Test your tech knowledge!"
              rows={3}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="scoring_type" className="block text-white font-semibold mb-2">
              Scoring Type
            </label>
            <select
              id="scoring_type"
              value={formData.scoring_type}
              onChange={(e) => handleScoringTypeChange(e.target.value as ScoringType)}
              className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/30 focus:border-white/60 focus:outline-none"
            >
              <option value="points_high">Points (High Score Wins)</option>
              <option value="points_low">Points (Low Score Wins)</option>
              <option value="time_fast">Time (Fastest Wins)</option>
              <option value="time_slow">Time (Longest Wins)</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="score_label" className="block text-white font-semibold mb-2">
              Score Label
            </label>
            <input
              id="score_label"
              type="text"
              value={formData.score_label}
              onChange={(e) => setFormData({ ...formData, score_label: e.target.value })}
              className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-white/60 focus:outline-none"
              placeholder="e.g., Points, Time, Questions"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center text-white mb-3">
              <input
                type="checkbox"
                checked={formData.allow_updates}
                onChange={(e) => setFormData({ ...formData, allow_updates: e.target.checked })}
                className="mr-3 w-5 h-5"
              />
              <span>Allow teams to update their scores</span>
            </label>
            
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-3 w-5 h-5"
              />
              <span>Leaderboard is active</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {deleting ? 'Deleting...' : 'Delete Leaderboard'}
            </button>
            <p className="text-white/60 text-sm mt-2 text-center">
              This will permanently delete the leaderboard and all entries
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}