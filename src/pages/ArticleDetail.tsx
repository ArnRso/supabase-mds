import { useState, useEffect, type FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getArticle, type Article } from '../store/articles'
import { getComments, addComment, deleteComment, type Comment } from '../store/comments'
import { getLikesCount, getUserLike, addLike, removeLike } from '../store/likes'
import { useAuth } from '../context/AuthContext'

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [article, setArticle] = useState<Article | undefined>()
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [likesCount, setLikesCount] = useState(0)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    async function load() {
      const [a, c, count] = await Promise.all([
        getArticle(id!),
        getComments(id!),
        getLikesCount(id!),
      ])
      setArticle(a)
      setComments(c)
      setLikesCount(count)
      if (user) {
        setLiked(await getUserLike(id!, user.id))
      }
      setLoading(false)
    }
    load()
  }, [id, user])

  async function handleLike() {
    if (!user) return
    if (liked) {
      await removeLike(id!)
      setLiked(false)
      setLikesCount(c => c - 1)
    } else {
      await addLike(id!)
      setLiked(true)
      setLikesCount(c => c + 1)
    }
  }

  async function handleComment(e: FormEvent) {
    e.preventDefault()
    if (!commentText.trim()) return
    const comment = await addComment(id!, commentText)
    setComments(c => [...c, comment])
    setCommentText('')
  }

  async function handleDeleteComment(commentId: string) {
    await deleteComment(commentId)
    setComments(c => c.filter(c => c.id !== commentId))
  }

  if (loading) return <p>Chargement…</p>
  if (!article) return <p>Article introuvable.</p>

  return (
    <div>
      <article>
        <header>
          <h1>{article.title}</h1>
          <small>Par {article.author} — {new Date(article.createdAt).toLocaleDateString()}</small>
        </header>
        <p style={{ whiteSpace: 'pre-wrap' }}>{article.content}</p>
        <footer style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/articles">← Retour</Link>
          <button
            className={liked ? 'contrast' : 'secondary'}
            onClick={handleLike}
            disabled={!user}
            title={!user ? 'Connectez-vous pour liker' : undefined}
          >
            ♥ {likesCount}
          </button>
        </footer>
      </article>

      <section style={{ marginTop: '2rem' }}>
        <h2>Commentaires ({comments.length})</h2>
        {comments.length === 0 && <p>Aucun commentaire pour l'instant.</p>}
        {comments.map(c => (
          <article key={c.id}>
            <header>
              <strong>{c.username}</strong>
              <small> — {new Date(c.createdAt).toLocaleDateString()}</small>
            </header>
            <p>{c.content}</p>
            {user?.id === c.userId && (
              <footer>
                <button className="contrast outline" onClick={() => handleDeleteComment(c.id)}>Supprimer</button>
              </footer>
            )}
          </article>
        ))}

        {user ? (
          <form onSubmit={handleComment} style={{ marginTop: '1rem' }}>
            <label>
              Ajouter un commentaire
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                rows={3}
                required
              />
            </label>
            <button type="submit">Publier</button>
          </form>
        ) : (
          <p><Link to="/login">Connectez-vous</Link> pour laisser un commentaire.</p>
        )}
      </section>
    </div>
  )
}
