import { useState } from 'react'
import PostForm from '../components/PostForm'
import PostCard from '../components/PostCard'
import ThemeToggle from '../components/ThemeToggle'
import AnnouncementBanner from '../components/AnnouncementBanner'
import { usePosts } from '../hooks/usePosts'

export default function Home() {
  const [showForm, setShowForm] = useState(true)
  const { posts: selected, loading: selectedLoading } = usePosts('selected')
  const { posts, loading, error } = usePosts('active')
  const { posts: archived, loading: archivedLoading } = usePosts('archived')

  return (
    <main>
      <header className="app-header">
        <div>
          <h1>💬 话题征集板</h1>
          <p className="app-header__sub">提交你想在下次活动中探讨的话题</p>
        </div>
        <ThemeToggle />
      </header>

      <AnnouncementBanner />

      {!selectedLoading && selected.length > 0 && (
        <section className="feed feed--selected">
          <h2 className="feed__title">🎉 本期话题 · {selected.length}</h2>
          <div className="post-grid">
            {selected.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {showForm
        ? <PostForm onSuccess={() => setShowForm(false)} />
        : (
          <button className="btn-new-post" onClick={() => setShowForm(true)}>
            + 提交新话题
          </button>
        )
      }

      <section className="feed">
        <h2 className="feed__title">🔥 当前话题 {!loading && `· ${posts.length}`}</h2>

        {loading && <p className="feed__state">加载中…</p>}
        {error && <p className="feed__state feed__state--error">加载失败，请刷新页面</p>}
        {!loading && !error && posts.length === 0 && (
          <p className="feed__state">还没有话题，来提交第一个吧！</p>
        )}

        <div className="post-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {!archivedLoading && archived.length > 0 && (
        <section className="feed feed--archived">
          <h2 className="feed__title">📖 往期话题 · {archived.length}</h2>
          <div className="post-grid">
            {archived.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
