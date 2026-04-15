import { describe, it, expect, vi } from 'vitest'
import './supabase.mock'
import { supabaseMock } from './supabase.mock'
import { screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from './render'
import Register from '../pages/Register'

beforeEach(() => {
  vi.clearAllMocks()
  supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })
})

async function renderRegister() {
  renderWithProviders(<Register />)
  await waitForElementToBeRemoved(() => screen.queryByText('Chargement…'))
}

describe('Register', () => {
  it('affiche le formulaire d\'inscription', async () => {
    await renderRegister()

    expect(screen.getByRole('heading', { name: 'Créer un compte' })).toBeInTheDocument()
    expect(screen.getByLabelText('Pseudo')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: "S'inscrire" })).toBeInTheDocument()
  })

  it('crée un compte avec pseudo, email et mot de passe', async () => {
    supabaseMock.auth.signUp.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })

    const chain = { insert: vi.fn().mockResolvedValue({ error: null }) }
    supabaseMock.from.mockReturnValue(chain)

    await renderRegister()

    await userEvent.type(screen.getByLabelText('Pseudo'), 'testuser')
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com')
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: "S'inscrire" }))

    await vi.waitFor(() => {
      expect(supabaseMock.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(chain.insert).toHaveBeenCalledWith({ id: 'user-1', username: 'testuser' })
    })
  })

  it('affiche une erreur si l\'inscription échoue', async () => {
    supabaseMock.auth.signUp.mockResolvedValue({ data: { user: null }, error: { message: 'Email déjà utilisé' } })

    await renderRegister()

    await userEvent.type(screen.getByLabelText('Pseudo'), 'testuser')
    await userEvent.type(screen.getByLabelText('Email'), 'existing@example.com')
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: "S'inscrire" }))

    await vi.waitFor(() => {
      expect(screen.getByText('Email déjà utilisé')).toBeInTheDocument()
    })
  })
})
