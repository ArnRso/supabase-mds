import { describe, it, expect, beforeEach, vi } from 'vitest'
import './supabase.mock'
import { supabaseMock } from './supabase.mock'
import { getArticles, getArticle, createArticle, updateArticle, deleteArticle } from '../store/articles'

const fakeRow = {
  id: 'article-1',
  title: 'Mon article',
  content: 'Contenu de test',
  author: 'testuser',
  created_at: '2026-01-01T00:00:00Z',
  user_id: 'user-1',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getArticles', () => {
  it('retourne la liste des articles triée par date', async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [fakeRow], error: null }),
    }
    supabaseMock.from.mockReturnValue(chain)

    const articles = await getArticles()

    expect(articles).toHaveLength(1)
    expect(articles[0]).toMatchObject({ id: 'article-1', title: 'Mon article', userId: 'user-1' })
    expect(chain.order).toHaveBeenCalledWith('created_at', { ascending: false })
  })

  it('lève une erreur si la requête échoue', async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
    }
    supabaseMock.from.mockReturnValue(chain)

    await expect(getArticles()).rejects.toMatchObject({ message: 'DB error' })
  })
})

describe('getArticle', () => {
  it('retourne un article par id', async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: fakeRow, error: null }),
    }
    supabaseMock.from.mockReturnValue(chain)

    const article = await getArticle('article-1')

    expect(article).toMatchObject({ id: 'article-1', title: 'Mon article' })
    expect(chain.eq).toHaveBeenCalledWith('id', 'article-1')
  })
})

describe('createArticle', () => {
  it('insère un article avec user_id et le retourne', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const chain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: fakeRow, error: null }),
    }
    supabaseMock.from.mockReturnValue(chain)

    const article = await createArticle({ title: 'Mon article', content: 'Contenu', author: 'testuser' })

    expect(chain.insert).toHaveBeenCalledWith(expect.objectContaining({ user_id: 'user-1', title: 'Mon article' }))
    expect(article).toMatchObject({ id: 'article-1', title: 'Mon article' })
  })
})

describe('updateArticle', () => {
  it('met à jour un article et le retourne', async () => {
    const updatedRow = { ...fakeRow, title: 'Titre modifié' }
    const chain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: updatedRow, error: null }),
    }
    supabaseMock.from.mockReturnValue(chain)

    const article = await updateArticle('article-1', { title: 'Titre modifié', content: 'Contenu', author: 'testuser' })

    expect(chain.eq).toHaveBeenCalledWith('id', 'article-1')
    expect(article.title).toBe('Titre modifié')
  })
})

describe('deleteArticle', () => {
  it('supprime un article par id', async () => {
    const chain = {
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }
    supabaseMock.from.mockReturnValue(chain)

    await deleteArticle('article-1')

    expect(chain.delete).toHaveBeenCalled()
    expect(chain.eq).toHaveBeenCalledWith('id', 'article-1')
  })
})
