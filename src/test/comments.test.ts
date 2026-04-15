import { describe, it, expect, beforeEach, vi } from 'vitest'
import './supabase.mock'
import { supabaseMock } from './supabase.mock'
import { getComments, addComment, deleteComment } from '../store/comments'

const fakeRow = {
  id: 'comment-1',
  article_id: 'article-1',
  user_id: 'user-1',
  content: 'Super article !',
  created_at: '2026-01-01T00:00:00Z',
  profiles: { username: 'testuser' },
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getComments', () => {
  it('retourne les commentaires d\'un article avec le username', async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [fakeRow], error: null }),
    }
    supabaseMock.from.mockReturnValue(chain)

    const comments = await getComments('article-1')

    expect(comments).toHaveLength(1)
    expect(comments[0]).toMatchObject({
      id: 'comment-1',
      articleId: 'article-1',
      userId: 'user-1',
      username: 'testuser',
      content: 'Super article !',
    })
    expect(chain.eq).toHaveBeenCalledWith('article_id', 'article-1')
  })

  it('affiche "Anonyme" si le profil est absent', async () => {
    const rowSansProfil = { ...fakeRow, profiles: null }
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [rowSansProfil], error: null }),
    }
    supabaseMock.from.mockReturnValue(chain)

    const comments = await getComments('article-1')
    expect(comments[0].username).toBe('Anonyme')
  })
})

describe('addComment', () => {
  it('insère un commentaire et le retourne', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const chain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: fakeRow, error: null }),
    }
    supabaseMock.from.mockReturnValue(chain)

    const comment = await addComment('article-1', 'Super article !')

    expect(chain.insert).toHaveBeenCalledWith({
      article_id: 'article-1',
      user_id: 'user-1',
      content: 'Super article !',
    })
    expect(comment.content).toBe('Super article !')
    expect(comment.username).toBe('testuser')
  })
})

describe('deleteComment', () => {
  it('supprime un commentaire par id', async () => {
    const chain = {
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }
    supabaseMock.from.mockReturnValue(chain)

    await deleteComment('comment-1')

    expect(chain.delete).toHaveBeenCalled()
    expect(chain.eq).toHaveBeenCalledWith('id', 'comment-1')
  })
})
