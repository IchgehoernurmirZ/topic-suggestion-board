import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'

const MAX_CHARS = 1000

export default function PostForm() {
  const [nickname, setNickname] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmedContent = content.trim()
    if (!trimmedContent) return

    setSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      await addDoc(collection(db, 'posts'), {
        content: trimmedContent,
        nickname: nickname.trim() || '匿名uu',
        createdAt: serverTimestamp(),
        upvotes: 0,
        upvotedBy: [],
        status: 'active',
      })
      setContent('')
      setNickname('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('提交失败，请稍后重试')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const remaining = MAX_CHARS - content.length

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h2 className="post-form__title">提交新话题</h2>

      <div className="post-form__field">
        <label htmlFor="nickname">昵称（可选）</label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="匿名uu"
          maxLength={30}
          disabled={submitting}
        />
      </div>

      <div className="post-form__field">
        <label htmlFor="content">话题内容 *</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="你希望在下次活动中探讨什么话题？"
          maxLength={MAX_CHARS}
          rows={4}
          required
          disabled={submitting}
        />
        <span className={`post-form__counter ${remaining < 50 ? 'post-form__counter--warn' : ''}`}>
          {remaining} 字
        </span>
      </div>

      {error && <p className="post-form__error">{error}</p>}
      {success && <p className="post-form__success">提交成功！感谢你的分享 🙏</p>}

      <button type="submit" disabled={submitting || !content.trim()} className="btn btn--primary">
        {submitting ? '提交中…' : '提交话题'}
      </button>
    </form>
  )
}
