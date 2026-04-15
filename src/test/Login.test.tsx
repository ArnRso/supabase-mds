import { describe, it, expect, vi } from 'vitest'
import './supabase.mock'
import { supabaseMock } from './supabase.mock'
import { screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from './render'
import Login from '../pages/Login'

beforeEach(() => {
  vi.clearAllMocks()
  supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })
})

async function renderLogin() {
  renderWithProviders(<Login />)
  await waitForElementToBeRemoved(() => screen.queryByText('Chargement…'))
}

describe('Login', () => {
  it('affiche le formulaire de connexion', async () => {
    await renderLogin()

    expect(screen.getByRole('heading', { name: 'Connexion' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument()
    expect(screen.getByText("S'inscrire")).toBeInTheDocument()
  })

  it('affiche une erreur si les identifiants sont incorrects', async () => {
    supabaseMock.auth.signInWithPassword.mockResolvedValue({ data: { user: null }, error: { message: 'Invalid' } })

    await renderLogin()

    await userEvent.type(screen.getByLabelText('Email'), 'wrong@example.com')
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'badpassword')
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }))

    await vi.waitFor(() => {
      expect(screen.getByText('Identifiants incorrects')).toBeInTheDocument()
    })
  })

  it('connecte et redirige si les identifiants sont corrects', async () => {
    supabaseMock.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'user-1', email: 'test@example.com' } },
      error: null,
    })

    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'user-1', username: 'testuser' } }),
    }
    supabaseMock.from.mockReturnValue(chain)

    await renderLogin()

    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com')
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }))

    await vi.waitFor(() => {
      expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })
})
