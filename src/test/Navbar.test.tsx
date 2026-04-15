import { describe, it, expect, vi } from 'vitest'
import './supabase.mock'
import { supabaseMock } from './supabase.mock'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from './render'
import Navbar from '../components/Navbar'

describe('Navbar', () => {
  it('affiche les liens Connexion et Inscription si non connecté', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } })

    renderWithProviders(<Navbar />)

    await vi.waitFor(() => {
      expect(screen.getByText('Connexion')).toBeInTheDocument()
      expect(screen.getByText('Inscription')).toBeInTheDocument()
    })
  })

  it('affiche le pseudo et le bouton Déconnexion si connecté', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'test@example.com' } } })

    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'user-1', username: 'testuser' } }),
    }
    supabaseMock.from.mockReturnValue(chain)

    renderWithProviders(<Navbar />)

    await vi.waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument()
      expect(screen.getByText('Déconnexion')).toBeInTheDocument()
    })
  })

  it('appelle signOut au clic sur Déconnexion', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'test@example.com' } } })
    supabaseMock.auth.signOut.mockResolvedValue({})

    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'user-1', username: 'testuser' } }),
    }
    supabaseMock.from.mockReturnValue(chain)

    renderWithProviders(<Navbar />)

    await vi.waitFor(() => screen.getByText('Déconnexion'))
    await userEvent.click(screen.getByText('Déconnexion'))

    expect(supabaseMock.auth.signOut).toHaveBeenCalledOnce()
  })
})
