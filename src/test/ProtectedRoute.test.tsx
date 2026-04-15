import { describe, it, expect, vi } from 'vitest'
import './supabase.mock'
import { supabaseMock } from './supabase.mock'
import { screen } from '@testing-library/react'
import { renderWithProviders } from './render'
import ProtectedRoute from '../components/ProtectedRoute'

describe('ProtectedRoute', () => {
  it('redirige vers /login si non connecté', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } })

    renderWithProviders(
      <ProtectedRoute><p>Contenu protégé</p></ProtectedRoute>,
      { initialEntries: ['/articles/new'] }
    )

    await vi.waitFor(() => {
      expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument()
    })
  })

  it('affiche le contenu si connecté', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'test@example.com' } } })

    const profileChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'user-1', username: 'testuser' } }),
    }
    supabaseMock.from.mockReturnValue(profileChain)

    renderWithProviders(
      <ProtectedRoute><p>Contenu protégé</p></ProtectedRoute>
    )

    await vi.waitFor(() => {
      expect(screen.getByText('Contenu protégé')).toBeInTheDocument()
    })
  })
})
