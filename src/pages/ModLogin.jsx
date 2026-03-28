import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Navigate } from 'react-router-dom'
import { auth } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'

export default function ModLogin() {
  const user = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Already signed in — go straight to dashboard
  if (user === undefined) return null
  if (user) return <Navigate to="/mod" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // PrivateRoute + Navigate above will redirect on next render
    } catch (err) {
      setError('邮箱或密码错误，请重试')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mod-login">
      <form onSubmit={handleSubmit} className="mod-login__form">
        <h1 className="mod-login__title">管理员登录</h1>

        <div className="post-form__field">
          <label htmlFor="email">邮箱</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
          />
        </div>

        <div className="post-form__field">
          <label htmlFor="password">密码</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={loading}
          />
        </div>

        {error && <p className="post-form__error">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn--primary">
          {loading ? '登录中…' : '登录'}
        </button>
      </form>
    </main>
  )
}
