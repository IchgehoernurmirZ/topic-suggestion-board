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
  const [selecting, setSelecting] = useState(false)
  const [actionError, setActionError] = useState('')

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

  async function handleSelect() {
    if (!window.confirm('确认选入本期吗？')) return
    setSelecting(true)
    setActionError('')
    try {
      await updateDoc(doc(db, 'posts', id), {
        status: 'selected',
        selectedAt: serverTimestamp(),
      })
    } catch (err) {
      console.error('select failed', err)
      setActionError('操作失败，请检查权限')
      setSelecting(false)
    }
  }

  async function handleUnselect() {
    if (!window.confirm('取消选中吗？')) return
    setSelecting(true)
    setActionError('')
    try {
      await updateDoc(doc(db, 'posts', id), {
        status: 'active',
      })
    } catch (err) {
      console.error('unselect failed', err)
      setActionError('操作失败，请检查权限')
      setSelecting(false)
    }
  }

  async function handleArchive() {
    if (!window.confirm('将此话题标记为"已选入本期"吗？')) return
    setArchiving(true)
    setActionError('')
    try {
      await updateDoc(doc(db, 'posts', id), {
        status: 'archived',
        archivedAt: serverTimestamp(),
      })
    } catch (err) {
      console.error('archive failed', err)
      setActionError('操作失败，请检查权限')
      setArchiving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('确认删除这个话题吗？')) return
    setDeleting(true)
    setActionError('')
    try {
      await updateDoc(doc(db, 'posts', id), {
        status: 'deleted',
        deletedAt: serverTimestamp(),
      })
    } catch (err) {
      console.error('delete failed', err)
      setActionError('删除失败，请检查权限')
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

      {post.status === 'selected' && (
        <span className="post-card__selected-badge">🎉 本期话题</span>
      )}

      {post.willPresent && (
        <span className="post-card__presenter-badge">
          🙋‍♀️ 有人愿意分享 · 约{post.presentDuration}分钟
        </span>
      )}

      {actionError && <p className="post-card__action-error">{actionError}</p>}

      <footer className="post-card__footer">
        <span className="post-card__meta">
          {nickname} · {date ?? '…'}
        </span>
        <div className="post-card__actions">
          {isModerator && post.status === 'active' && (
            <button
              className="post-card__icon-btn post-card__icon-btn--select"
              onClick={handleSelect}
              disabled={selecting}
              title="选入本期"
              aria-label="选入本期"
            >
              {selecting ? '…' : '📌'}
            </button>
          )}
          {isModerator && post.status === 'selected' && (
            <button
              className="post-card__icon-btn post-card__icon-btn--unselect"
              onClick={handleUnselect}
              disabled={selecting}
              title="取消选中"
              aria-label="取消选中"
            >
              {selecting ? '…' : '🔖'}
            </button>
          )}
          {isModerator && (post.status === 'active' || post.status === 'selected') && (
            <button
              className="post-card__icon-btn post-card__icon-btn--archive"
              onClick={handleArchive}
              disabled={archiving}
              title="归档"
              aria-label="归档"
            >
              {archiving ? '…' : '🗄️'}
            </button>
          )}
          {isModerator && (
            <button
              className="post-card__icon-btn post-card__icon-btn--delete"
              onClick={handleDelete}
              disabled={deleting}
              title="删除"
              aria-label="删除"
            >
              {deleting ? '…' : '🗑️'}
            </button>
          )}
          {!isModerator && post.status === 'active' && (
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
