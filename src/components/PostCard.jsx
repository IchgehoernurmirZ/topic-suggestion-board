import { useState } from 'react'

const TRUNCATE_AT = 150

export default function PostCard({ post }) {
  const { nickname, content, upvotes, createdAt } = post
  const [expanded, setExpanded] = useState(false)

  const isLong = content.length > TRUNCATE_AT
  const displayContent = isLong && !expanded ? content.slice(0, TRUNCATE_AT).trimEnd() + '…' : content

  const date = createdAt?.toDate().toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <article className="post-card">
      <p className="post-card__content">{displayContent}</p>

      {isLong && (
        <button
          className="post-card__toggle"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? '收起' : '展开阅读'}
        </button>
      )}

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
