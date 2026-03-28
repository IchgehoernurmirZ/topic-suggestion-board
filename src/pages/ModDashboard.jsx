import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'
import { usePosts } from '../hooks/usePosts'
import PostCard from '../components/PostCard'

export default function ModDashboard() {
  const user = useAuth()
  const { posts, loading, error } = usePosts('active')
  const { posts: archived, loading: archivedLoading } = usePosts('archived')

  async function handleSignOut() {
    await signOut(auth)
  }

  return (
    <main>
      <header className="app-header mod-header">
        <div>
          <h1>话题管理</h1>
          <p className="app-header__sub">{user?.email}</p>
        </div>
        <button onClick={handleSignOut} className="btn btn--secondary">
          退出登录
        </button>
      </header>

      <section className="feed">
        <h2 className="feed__title">当前话题 {!loading && `· ${posts.length}`}</h2>

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
          <h2 className="feed__title">往期话题 · {archived.length}</h2>
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
