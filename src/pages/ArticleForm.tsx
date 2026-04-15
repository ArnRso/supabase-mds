import { FormEvent, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getArticle, createArticle, updateArticle } from '../store/articles'
import { useAuth } from '../context/AuthContext'

export default function ArticleForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const existing = id ? getArticle(id) : undefined
  const { user } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState(existing?.title ?? '')
  const [content, setContent] = useState(existing?.content ?? '')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const data = { title, content, author: user!.username }
    if (isEdit && id) {
      updateArticle(id, data)
    } else {
      createArticle(data)
    }
    navigate('/articles')
  }

  return (
    <article style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>{isEdit ? 'Modifier l\'article' : 'Nouvel article'}</h2>
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
