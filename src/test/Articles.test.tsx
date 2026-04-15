import { describe, it, expect, vi } from 'vitest'
import './supabase.mock'
import { supabaseMock } from './supabase.mock'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from './render'
import Articles from '../pages/Articles'

const fakeArticleRow = {
  id: 'article-1',
  title: 'Mon premier article',
  content: 'Contenu de test pour cet article.',
  author: 'testuser',
  created_at: '2026-01-01T00:00:00Z',
  user_id: 'user-1',
}

const fakeCommentRow = {
  id: 'comment-1',
  article_id: 'article-1',
  user_id: 'user-1',
  content: 'Un commentaire',
  created_at: '2026-01-01T00:00:00Z',
  profiles: { username: 'testuser' },
}

function mockArticlesAndMeta() {
  supabaseMock.from.mockImplementation((table: string) => {
    if (table === 'articles') {
      return {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [fakeArticleRow], error: null }),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      }
    }
    if (table === 'likes') {
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ count: 3, error: null }),
      }
    }
    if (table === 'comments') {
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [fakeCommentRow], error: null }),
      }
    }
    return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), order: vi.fn().mockResolvedValue({ data: [], error: null }) }
  })
}

describe('Articles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('affiche la liste des articles avec likes et commentaires', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } })
    mockArticlesAndMeta()

    renderWithProviders(<Articles />)

    await vi.waitFor(() => {
      expect(screen.getByText('Mon premier article')).toBeInTheDocument()
      expect(screen.getByText(/♥ 3/)).toBeInTheDocument()
      expect(screen.getByText(/1 commentaire/)).toBeInTheDocument()
    })
  })

  it('affiche "Aucun article" si la liste est vide', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } })
    supabaseMock.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    }))

    renderWithProviders(<Articles />)

    await vi.waitFor(() => {
      expect(screen.getByText("Aucun article pour l'instant.")).toBeInTheDocument()
    })
  })

  it('affiche le bouton "Nouvel article" uniquement si connecté', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'test@example.com' } } })

    supabaseMock.from.mockImplementation((table: string) => {
      if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: { id: 'user-1', username: 'testuser' } }),
        }
      }
      if (table === 'articles') {
        return {
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        }
      }
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), order: vi.fn().mockResolvedValue({ data: [], error: null }) }
    })

    renderWithProviders(<Articles />)

    await vi.waitFor(() => {
      expect(screen.getByText('Nouvel article')).toBeInTheDocument()
    })
  })

  it('affiche Modifier/Supprimer uniquement pour les articles de l\'utilisateur', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'test@example.com' } } })

    supabaseMock.from.mockImplementation((table: string) => {
      if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: { id: 'user-1', username: 'testuser' } }),
        }
      }
      if (table === 'articles') {
        return {
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: [fakeArticleRow], error: null }),
        }
      }
      if (table === 'likes') {
        return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ count: 0, error: null }) }
      }
      if (table === 'comments') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        }
      }
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), order: vi.fn().mockResolvedValue({ data: [], error: null }) }
    })

    renderWithProviders(<Articles />)

    await vi.waitFor(() => {
      expect(screen.getByText('Modifier')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Supprimer' })).toBeInTheDocument()
    })
  })

  it('supprime un article au clic sur Supprimer', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'test@example.com' } } })

    const deleteMock = vi.fn().mockReturnThis()
    const eqMock = vi.fn().mockResolvedValue({ error: null })

    supabaseMock.from.mockImplementation((table: string) => {
      if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: { id: 'user-1', username: 'testuser' } }),
        }
      }
      if (table === 'articles') {
        return {
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: [fakeArticleRow], error: null }),
          delete: deleteMock,
          eq: eqMock,
        }
      }
      if (table === 'likes') {
        return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ count: 0, error: null }) }
      }
      if (table === 'comments') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        }
      }
      return { select: vi.fn().mockReturnThis(), eq: eqMock, order: vi.fn().mockResolvedValue({ data: [], error: null }) }
    })

    renderWithProviders(<Articles />)

    await vi.waitFor(() => screen.getByRole('button', { name: 'Supprimer' }))
    await userEvent.click(screen.getByRole('button', { name: 'Supprimer' }))

    await vi.waitFor(() => {
      expect(deleteMock).toHaveBeenCalled()
    })
  })
})
