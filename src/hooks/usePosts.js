import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'

export function usePosts(status = 'active') {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const sortField = status === 'active' ? 'upvotes'
      : status === 'selected' ? 'selectedAt'
      : 'archivedAt'
    const sortDir = 'desc'

    const q = query(
      collection(db, 'posts'),
      where('status', '==', status),
      orderBy(sortField, sortDir),
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
        setLoading(false)
      },
      (err) => {
        console.error(err)
        setError(err)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [status])

  return { posts, loading, error }
}
