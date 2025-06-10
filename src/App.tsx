import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import CreateLeaderboard from './components/CreateLeaderboard'
import EditLeaderboard from './components/EditLeaderboard'
import EntryForm from './components/EntryForm'
import Leaderboard from './components/Leaderboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreateLeaderboard />} />
        <Route path="/:id/edit" element={<EditLeaderboard />} />
        <Route path="/:id/entry" element={<EntryForm />} />
        <Route path="/:id/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  )
}

export default App