import { useState } from 'react'
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { randomNickname } from '../lib/nicknames'

const MAX_CHARS = 1000
const MAX_NICKNAME = 20
const INVALID_NICKNAME_RE = /[<>"'`\\{}]/

function validateNickname(value) {
  if (!value) return ''
  if (value.length > MAX_NICKNAME) return `昵称最多 ${MAX_NICKNAME} 个字符`
  if (INVALID_NICKNAME_RE.test(value)) return '昵称包含不支持的字符'
  return ''
}

export default function PostForm() {
  const [nickname, setNickname] = useState('')
  const [nicknameError, setNicknameError] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmedContent = content.trim()
    const trimmedNickname = nickname.trim()

    if (!trimmedContent) {
      setError('话题内容不能为空')
      return
    }

    const nickErr = validateNickname(trimmedNickname)
    if (nickErr) {
      setNicknameError(nickErr)
      return
    }

    if (!window.confirm('确认提交这个话题吗？')) return

    setSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      const snapshot = await getDocs(
        query(collection(db, 'posts'), where('status', '!=', 'deleted'))
      )
      const isDuplicate = snapshot.docs.some(
        (doc) => doc.data().content.trim().toLowerCase() === trimmedContent.toLowerCase()
      )
      if (isDuplicate) {
        setError('该话题已存在')
        setSubmitting(false)
        return
      }

      await addDoc(collection(db, 'posts'), {
        content: trimmedContent,
        nickname: trimmedNickname || randomNickname(),
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
      <h2 className="post-form__title">✍️ 提交新话题</h2>

      <div className="post-form__field">
        <label htmlFor="nickname">昵称（可选，最多 {MAX_NICKNAME} 字）</label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value)
            if (nicknameError) setNicknameError(validateNickname(e.target.value.trim()))
          }}
          onBlur={() => setNicknameError(validateNickname(nickname.trim()))}
          placeholder="留空将随机生成一个昵称"
          maxLength={MAX_NICKNAME}
          disabled={submitting}
        />
        {nicknameError && <span className="post-form__field-error">{nicknameError}</span>}
      </div>

      <div className="post-form__field">
        <label htmlFor="content">话题内容 *</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="分享你想探讨的话题，无论大小，都值得被听见。"
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
