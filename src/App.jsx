import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Placeholder pages — replaced in subsequent steps
function Home() {
  return <p style={{ padding: 24 }}>话题征集板 — scaffold ready ✓</p>
}

function ModLogin() {
  return <p style={{ padding: 24 }}>Moderator login — coming soon</p>
}

function ModDashboard() {
  return <p style={{ padding: 24 }}>Moderator dashboard — coming soon</p>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mod/login" element={<ModLogin />} />
        <Route path="/mod" element={<ModDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
