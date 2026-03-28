import { useAnnouncement } from '../hooks/useAnnouncement'

export default function AnnouncementBanner() {
  const { announcement, loading } = useAnnouncement()

  if (loading || !announcement?.text) return null

  return (
    <div className="announcement-banner">
      📣 {announcement.text}
    </div>
  )
}
