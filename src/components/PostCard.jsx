import { useState } from 'react'
import { doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { getSessionId } from '../lib/session'

const TRUNCATE_AT = 150

export default function PostCard({ post }) {
  const { id, nickname, content, upvotes, upvotedBy, createdAt } = post
  const [expanded, setExpanded] = useState(false)
  const [voting, setVoting] = useState(false)

  const sessionId = getSessionId()
  const hasVoted = upvotedBy?.includes(sessionId)

  const isLong = content.length > TRUNCATE_AT
  const displayContent = isLong && !expanded ? content.slice(0, TRUNCATE_AT).trimEnd() + '…' : content

  const date = createdAt?.toDate().toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  })

  async function handleUpvote() {
    if (voting) return
    setVoting(true)
    try {
      await updateDoc(doc(db, 'posts', id), {
        upvotes: increment(hasVoted ? -1 : 1),
        upvotedBy: hasVoted ? arrayRemove(sessionId) : arrayUnion(sessionId),
      })
    } catch (err) {
      console.error('upvote failed', err)
    } finally {
      setVoting(false)
    }
  }

  return (
    <article className="post-card">
      <p className="post-card__content">{displayContent}</p>

      {isLong && (
        <button className="post-card__toggle" onClick={() => setExpanded((v) => !v)}>
          {expanded ? '收起' : '展开阅读'}
        </button>
      )}

      <footer className="post-card__footer">
        <span className="post-card__meta">
          {nickname} · {date ?? '…'}
        </span>
        <button
          className={`post-card__upvote-btn ${hasVoted ? 'post-card__upvote-btn--voted' : ''}`}
          onClick={handleUpvote}
          disabled={voting}
          aria-label="upvote"
        >
          ▲ {upvotes}
        </button>
      </footer>
    </article>
  )
}
