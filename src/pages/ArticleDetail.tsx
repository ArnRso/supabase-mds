import { useParams, Link } from 'react-router-dom'
import { getArticle } from '../store/articles'

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>()
  const article = getArticle(id!)

  if (!article) return <p>Article introuvable.</p>

  return (
    <article>
      <header>
        <h1>{article.title}</h1>
        <small>Par {article.author} — {new Date(article.createdAt).toLocaleDateString()}</small>
      </header>
      <p style={{ whiteSpace: 'pre-wrap' }}>{article.content}</p>
      <footer>
        <Link to="/articles">← Retour</Link>
      </footer>
    </article>
  )
}
