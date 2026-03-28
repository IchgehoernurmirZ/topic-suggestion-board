import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'
import { usePosts } from '../hooks/usePosts'
import { useAnnouncement } from '../hooks/useAnnouncement'
import PostCard from '../components/PostCard'
import ThemeToggle from '../components/ThemeToggle'

export default function ModDashboard() {
  const user = useAuth()
  const { posts: selected, loading: selectedLoading } = usePosts('selected')
  const { posts, loading, error } = usePosts('active')
  const { posts: archived, loading: archivedLoading } = usePosts('archived')

  const { announcement } = useAnnouncement()
  const [announcementText, setAnnouncementText] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  // Sync local state when Firestore data arrives (only on first load)
  const [synced, setSynced] = useState(false)
  if (announcement !== null && !synced) {
    setAnnouncementText(announcement?.text ?? '')
    setSynced(true)
  }

  async function handleSave() {
    setSaving(true)
    setSaveMsg('')
    try {
      await setDoc(doc(db, 'config', 'announcement'), {
        text: announcementText,
      })
      setSaveMsg('已保存')
      setTimeout(() => setSaveMsg(''), 2000)
    } catch (err) {
      console.error('save announcement failed', err)
      setSaveMsg('保存失败')
    } finally {
      setSaving(false)
    }
  }

  async function handleSignOut() {
    await signOut(auth)
  }

  return (
    <main>
      <header className="app-header mod-header">
        <div>
          <h1>⚙️ 话题管理</h1>
          <p className="app-header__sub">{user?.email}</p>
        </div>
        <div className="mod-header__actions">
          <button onClick={handleSignOut} className="btn btn--secondary">
            退出登录
          </button>
          <ThemeToggle />
        </div>
      </header>

      <section className="announcement-settings">
        <h2 className="feed__title">📣 公告设置</h2>
        <div className="announcement-settings__body">
          <textarea
            className="announcement-settings__input"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            placeholder="输入公告内容…"
            rows={2}
          />
          <div className="announcement-settings__row">
            <div className="announcement-settings__save-row">
              {saveMsg && <span className="announcement-settings__save-msg">{saveMsg}</span>}
              <button
                className="btn btn--primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? '保存中…' : '保存'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {!selectedLoading && selected.length > 0 && (
        <section className="feed feed--selected">
          <h2 className="feed__title">🎉 本期话题 · {selected.length}</h2>
          <div className="post-grid">
            {selected.map((post) => (
              <PostCard key={post.id} post={post} isModerator />
            ))}
          </div>
        </section>
      )}

      <section className="feed">
        <h2 className="feed__title">🔥 当前话题 {!loading && `· ${posts.length}`}</h2>

        {loading && <p className="feed__state">加载中…</p>}
        {error && <p className="feed__state feed__state--error">加载失败，请刷新页面</p>}
        {!loading && !error && posts.length === 0 && (
          <p className="feed__state">暂无话题</p>
        )}

        <div className="post-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} isModerator />
          ))}
        </div>
      </section>

      {!archivedLoading && archived.length > 0 && (
        <section className="feed feed--archived">
          <h2 className="feed__title">📖 往期话题 · {archived.length}</h2>
          <div className="post-grid">
            {archived.map((post) => (
              <PostCard key={post.id} post={post} isModerator />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
