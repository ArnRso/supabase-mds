import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getArticles, deleteArticle, type Article } from '../store/articles'
import { useAuth } from '../context/AuthContext'

export default function Articles() {
  const { user } = useAuth()
  const [articles, setArticles] = useState<Article[]>(getArticles)

  function handleDelete(id: string) {
    deleteArticle(id)
    setArticles(getArticles())
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Articles</h1>
        {user && <Link to="/articles/new" role="button">Nouvel article</Link>}
      </div>
      {articles.length === 0 && <p>Aucun article pour l'instant.</p>}
      {articles.map(article => (
        <article key={article.id}>
          <header>
            <strong><Link to={`/articles/${article.id}`}>{article.title}</Link></strong>
            <small> — par {article.author} le {new Date(article.createdAt).toLocaleDateString()}</small>
          </header>
          <p>{article.content.slice(0, 150)}{article.content.length > 150 ? '…' : ''}</p>
          {user && (
            <footer style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to={`/articles/${article.id}/edit`} role="button" className="secondary">Modifier</Link>
              <button className="contrast" onClick={() => handleDelete(article.id)}>Supprimer</button>
            </footer>
          )}
        </article>
      ))}
    </div>
  )
}
