import { useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('tsb_theme') || 'light'
  )

  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('tsb_theme', next)
  }

  return (
    <button onClick={toggle} className="theme-toggle" aria-label="切换深色/浅色模式">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
