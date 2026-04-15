import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getArticles, deleteArticle, type Article } from '../store/articles'
import { getLikesCount } from '../store/likes'
import { getComments } from '../store/comments'
import { useAuth } from '../context/AuthContext'

interface ArticleMeta {
  article: Article
  likes: number
  commentCount: number
}

export default function Articles() {
  const { user } = useAuth()
  const [items, setItems] = useState<ArticleMeta[]>([])

  async function loadArticles() {
    const articles = await getArticles()
    const metas = await Promise.all(
      articles.map(async article => {
        const [likes, comments] = await Promise.all([
          getLikesCount(article.id),
          getComments(article.id),
        ])
        return { article, likes, commentCount: comments.length }
      })
    )
    setItems(metas)
  }

  useEffect(() => {
    loadArticles()
  }, [])

  async function handleDelete(id: string) {
    await deleteArticle(id)
    await loadArticles()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Articles</h1>
        {user && <Link to="/articles/new" role="button">Nouvel article</Link>}
      </div>
      {items.length === 0 && <p>Aucun article pour l'instant.</p>}
      {items.map(({ article, likes, commentCount }) => (
        <article key={article.id}>
          <header>
            <strong><Link to={`/articles/${article.id}`}>{article.title}</Link></strong>
            <small> — par {article.author} le {new Date(article.createdAt).toLocaleDateString()}</small>
          </header>
          <p>{article.content.slice(0, 150)}{article.content.length > 150 ? '…' : ''}</p>
          <footer style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <small>♥ {likes} · {commentCount} commentaire{commentCount !== 1 ? 's' : ''}</small>
            {user?.id === article.userId && (
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                <Link to={`/articles/${article.id}/edit`} role="button" className="secondary">Modifier</Link>
                <button className="contrast" onClick={() => handleDelete(article.id)}>Supprimer</button>
              </div>
            )}
          </footer>
        </article>
      ))}
    </div>
  )
}
