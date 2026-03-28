import { useState } from 'react'
import { doc, updateDoc, increment, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { getSessionId } from '../lib/session'

const TRUNCATE_AT = 150

export default function PostCard({ post, isModerator }) {
  const { id, nickname, content, upvotes, upvotedBy, createdAt } = post
  const [expanded, setExpanded] = useState(false)
  const [voting, setVoting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [archiving, setArchiving] = useState(false)

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

  async function handleArchive() {
    if (!window.confirm('将此话题标记为"已选入本期"吗？')) return
    setArchiving(true)
    try {
      await updateDoc(doc(db, 'posts', id), {
        status: 'archived',
        archivedAt: serverTimestamp(),
      })
    } catch (err) {
      console.error('archive failed', err)
      setArchiving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('确认删除这个话题吗？')) return
    setDeleting(true)
    try {
      await updateDoc(doc(db, 'posts', id), {
        status: 'deleted',
        deletedAt: serverTimestamp(),
      })
    } catch (err) {
      console.error('delete failed', err)
      setDeleting(false)
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
        <div className="post-card__actions">
          {isModerator && post.status === 'active' && (
            <button
              className="post-card__archive-btn"
              onClick={handleArchive}
              disabled={archiving}
              aria-label="标记为已选入本期"
            >
              {archiving ? '…' : '已选入本期'}
            </button>
          )}
          {isModerator && (
            <button
              className="post-card__delete-btn"
              onClick={handleDelete}
              disabled={deleting}
              aria-label="删除"
            >
              {deleting ? '…' : '删除'}
            </button>
          )}
          {post.status === 'active' && (
            <button
              className={`post-card__upvote-btn ${hasVoted ? 'post-card__upvote-btn--voted' : ''}`}
              onClick={handleUpvote}
              disabled={voting}
              aria-label="upvote"
            >
              ▲ {upvotes}
            </button>
          )}
        </div>
      </footer>
    </article>
  )
}
