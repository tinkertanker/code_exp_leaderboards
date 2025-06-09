import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type ScoringType = 'points_high' | 'points_low' | 'time_fast' | 'time_slow'

export default function CreateLeaderboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    scoring_type: 'points_high' as ScoringType,
    score_label: 'Points',
    allow_updates: false
  })

  // Update score label when scoring type changes
  function handleScoringTypeChange(type: ScoringType) {
    setFormData({
      ...formData,
      scoring_type: type,
      score_label: type.startsWith('time') ? 'Time' : 'Points'
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.name.trim()) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('leaderboards')
        .insert([{
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          scoring_type: formData.scoring_type,
          score_label: formData.score_label.trim() || 
            (formData.scoring_type.startsWith('time') ? 'Time' : 'Points'),
          allow_updates: formData.allow_updates,
          is_active: true
        }])
        .select()
        .single()

      if (error) throw error

      // Redirect to the new leaderboard
      navigate(`/${data.id}/leaderboard`)
    } catch (error) {
      console.error('Error creating leaderboard:', error)
      alert('Failed to create leaderboard. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Create New Leaderboard
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

          <div className="mb-8">
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={formData.allow_updates}
                onChange={(e) => setFormData({ ...formData, allow_updates: e.target.checked })}
                className="mr-3 w-5 h-5"
              />
              <span>Allow teams to update their scores</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Creating...' : 'Create Leaderboard'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}