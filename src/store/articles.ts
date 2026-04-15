export interface Article {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
}

const KEY = 'articles'

export function getArticles(): Article[] {
  return JSON.parse(localStorage.getItem(KEY) ?? '[]')
}

export function getArticle(id: string): Article | undefined {
  return getArticles().find(a => a.id === id)
}

export function createArticle(data: Omit<Article, 'id' | 'createdAt'>): Article {
  const articles = getArticles()
  const article: Article = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
  localStorage.setItem(KEY, JSON.stringify([...articles, article]))
  return article
}

export function updateArticle(id: string, data: Omit<Article, 'id' | 'createdAt'>): Article {
  const articles = getArticles()
  const index = articles.findIndex(a => a.id === id)
  if (index === -1) throw new Error('Article introuvable')
  const updated = { ...articles[index], ...data }
  articles[index] = updated
  localStorage.setItem(KEY, JSON.stringify(articles))
  return updated
}

export function deleteArticle(id: string): void {
  const articles = getArticles().filter(a => a.id !== id)
  localStorage.setItem(KEY, JSON.stringify(articles))
}
