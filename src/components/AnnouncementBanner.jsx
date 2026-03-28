import { useState, useEffect } from 'react'
import { useAnnouncement } from '../hooks/useAnnouncement'

const STORAGE_KEY = 'tsb_announcement_collapsed'

export default function AnnouncementBanner() {
  const { announcement, loading } = useAnnouncement()
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true')

  function toggle() {
    setCollapsed((v) => {
      const next = !v
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }

  if (loading || !announcement?.text) return null

  const preview = announcement.text.length > 20
    ? announcement.text.slice(0, 20).trimEnd() + '…'
    : announcement.text

  return (
    <div className="announcement-banner">
      <button className="announcement-banner__header" onClick={toggle} aria-expanded={!collapsed}>
        <span>📣 {preview}</span>
        <span className="announcement-banner__chevron">{collapsed ? '▼' : '▲'}</span>
      </button>
      {!collapsed && (
        <p className="announcement-banner__body">{announcement.text}</p>
      )}
    </div>
  )
}
