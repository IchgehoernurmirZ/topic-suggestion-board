export default function PostCard({ post }) {
  const { nickname, content, upvotes, createdAt } = post

  const date = createdAt?.toDate().toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <article className="post-card">
      <p className="post-card__content">{content}</p>
      <footer className="post-card__footer">
        <span className="post-card__meta">
          {nickname} · {date ?? '…'}
        </span>
        <span className="post-card__upvotes">
          <span className="post-card__upvote-icon">▲</span>
          {upvotes}
        </span>
      </footer>
    </article>
  )
}
