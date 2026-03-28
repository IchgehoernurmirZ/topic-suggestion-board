import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Home from './pages/Home'
import ModLogin from './pages/ModLogin'
import ModDashboard from './pages/ModDashboard'

function PrivateRoute({ children }) {
  const user = useAuth()
  if (user === undefined) return null // auth state loading
  if (!user) return <Navigate to="/mod/login" replace />
  return children
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
