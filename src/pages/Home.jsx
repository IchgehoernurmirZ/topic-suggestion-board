import PostForm from '../components/PostForm'

export default function Home() {
  return (
    <main>
      <header className="app-header">
        <h1>话题征集板</h1>
        <p className="app-header__sub">匿名提交你想在活动中探讨的话题</p>
      </header>
      <PostForm />
    </main>
  )
}
