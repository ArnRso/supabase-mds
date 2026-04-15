import { describe, it, expect, beforeEach, vi } from 'vitest'
import './supabase.mock'
import { supabaseMock } from './supabase.mock'
import { getLikesCount, getUserLike, addLike, removeLike } from '../store/likes'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getLikesCount', () => {
  it('retourne le nombre de likes pour un article', async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ count: 5, error: null }),
    }
    supabaseMock.from.mockReturnValue(chain)

    const count = await getLikesCount('article-1')

    expect(count).toBe(5)
    expect(chain.eq).toHaveBeenCalledWith('article_id', 'article-1')
  })

  it('retourne 0 si count est null', async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ count: null, error: null }),
    }
    supabaseMock.from.mockReturnValue(chain)

    const count = await getLikesCount('article-1')
    expect(count).toBe(0)
  })
})

describe('getUserLike', () => {
  it('retourne true si l\'utilisateur a liké', async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { article_id: 'article-1' } }),
    }
    supabaseMock.from.mockReturnValue(chain)

    const liked = await getUserLike('article-1', 'user-1')
    expect(liked).toBe(true)
  })

  it('retourne false si l\'utilisateur n\'a pas liké', async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null }),
    }
    supabaseMock.from.mockReturnValue(chain)

    const liked = await getUserLike('article-1', 'user-1')
    expect(liked).toBe(false)
  })
})

describe('addLike', () => {
  it('insère un like pour l\'utilisateur courant', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const chain = { insert: vi.fn().mockResolvedValue({ error: null }) }
    supabaseMock.from.mockReturnValue(chain)

    await addLike('article-1')

    expect(chain.insert).toHaveBeenCalledWith({ article_id: 'article-1', user_id: 'user-1' })
  })
})

describe('removeLike', () => {
  it('supprime le like de l\'utilisateur courant', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const eqFinal = vi.fn().mockResolvedValue({ error: null })
    const eqFirst = vi.fn().mockReturnValue({ eq: eqFinal })
    const chain = {
      delete: vi.fn().mockReturnValue({ eq: eqFirst }),
    }
    supabaseMock.from.mockReturnValue(chain)

    await removeLike('article-1')

    expect(chain.delete).toHaveBeenCalled()
    expect(eqFirst).toHaveBeenCalledWith('article_id', 'article-1')
    expect(eqFinal).toHaveBeenCalledWith('user_id', 'user-1')
  })
})
