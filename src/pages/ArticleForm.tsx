import { type FormEvent, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getArticle, createArticle, updateArticle, type Article } from '../store/articles'
import { useAuth } from '../context/AuthContext'

export default function ArticleForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const { user } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (id) {
      getArticle(id).then((article: Article | undefined) => {
        if (article) {
          setTitle(article.title)
          setContent(article.content)
        }
      })
    }
  }, [id])

  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const data = { title, content, author: user!.username }
      if (isEdit && id) {
        await updateArticle(id, data)
      } else {
        await createArticle(data)
      }
      navigate('/articles')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <article style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>{isEdit ? 'Modifier l\'article' : 'Nouvel article'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Titre
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </label>
        <label>
          Contenu
          <textarea value={content} onChange={e => setContent(e.target.value)} required rows={8} />
        </label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit">{isEdit ? 'Enregistrer' : 'Créer'}</button>
          <button type="button" className="secondary" onClick={() => navigate('/articles')}>Annuler</button>
        </div>
      </form>
    </article>
  )
}
