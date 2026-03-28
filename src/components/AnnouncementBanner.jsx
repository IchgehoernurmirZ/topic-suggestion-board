import { useState, useEffect } from 'react'
import { useAnnouncement } from '../hooks/useAnnouncement'

const STORAGE_KEY = 'tsb_announcement_dismissed'

export default function AnnouncementBanner() {
  const { announcement, loading } = useAnnouncement()
  const [dismissed, setDismissed] = useState(false)

  // When announcement text changes, clear any prior dismissal for the old text
  useEffect(() => {
    if (!announcement?.text) return
    const dismissedText = localStorage.getItem(STORAGE_KEY)
    setDismissed(dismissedText === announcement.text)
  }, [announcement?.text])

  function handleDismiss() {
    localStorage.setItem(STORAGE_KEY, announcement.text)
    setDismissed(true)
  }

  if (loading || !announcement?.enabled || !announcement?.text || dismissed) return null

  return (
    <div className="announcement-banner">
      <span className="announcement-banner__text">📣 {announcement.text}</span>
      <button
        className="announcement-banner__dismiss"
        onClick={handleDismiss}
        aria-label="关闭公告"
      >
        ✕
      </button>
    </div>
  )
}
