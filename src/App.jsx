import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

function PrivateRoute({ children }) {
  const user = useAuth()
  if (user === undefined) return null // auth state loading
  if (!user) return <Navigate to="/mod/login" replace />
  return children
}

// Placeholder pages — replaced in subsequent steps
function Home() {
  return <p style={{ padding: 24 }}>话题征集板 — Firebase connected ✓</p>
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
        <Route
          path="/mod"
          element={
            <PrivateRoute>
              <ModDashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
