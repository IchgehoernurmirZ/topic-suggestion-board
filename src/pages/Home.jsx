import PostForm from '../components/PostForm'
import PostCard from '../components/PostCard'
import { usePosts } from '../hooks/usePosts'

export default function Home() {
  const { posts, loading, error } = usePosts()

  return (
    <main>
      <header className="app-header">
        <h1>话题征集板</h1>
        <p className="app-header__sub">匿名提交你想在活动中探讨的话题</p>
      </header>

      <PostForm />

      <section className="feed">
        <h2 className="feed__title">当前话题 {!loading && `· ${posts.length}`}</h2>

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
    </main>
  )
}
