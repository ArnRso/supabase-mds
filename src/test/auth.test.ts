import { describe, it, expect, beforeEach, vi } from 'vitest'
import './supabase.mock'
import { supabaseMock } from './supabase.mock'
import { login, logout, register, getCurrentUser } from '../store/auth'

const fakeUser = { id: 'user-1', email: 'test@example.com' }
const fakeProfile = { id: 'user-1', username: 'testuser' }

beforeEach(() => {
  vi.clearAllMocks()
})

describe('register', () => {
  it('crée un compte et un profil, retourne un User', async () => {
    supabaseMock.auth.signUp.mockResolvedValue({ data: { user: fakeUser }, error: null })

    const chain = { insert: vi.fn().mockResolvedValue({ error: null }) }
    supabaseMock.from.mockReturnValue(chain)

    const user = await register('test@example.com', 'password123', 'testuser')

    expect(supabaseMock.auth.signUp).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' })
    expect(chain.insert).toHaveBeenCalledWith({ id: 'user-1', username: 'testuser' })
    expect(user).toEqual({ id: 'user-1', username: 'testuser' })
  })

  it('lève une erreur si signUp échoue', async () => {
    supabaseMock.auth.signUp.mockResolvedValue({ data: { user: null }, error: { message: 'Email déjà utilisé' } })

    await expect(register('test@example.com', 'password123', 'testuser')).rejects.toThrow('Email déjà utilisé')
  })

  it('lève une erreur si la création de profil échoue', async () => {
    supabaseMock.auth.signUp.mockResolvedValue({ data: { user: fakeUser }, error: null })

    const chain = { insert: vi.fn().mockResolvedValue({ error: { message: 'Pseudo déjà pris' } }) }
    supabaseMock.from.mockReturnValue(chain)

    await expect(register('test@example.com', 'password123', 'testuser')).rejects.toThrow('Pseudo déjà pris')
  })
})

describe('login', () => {
  it('connecte un utilisateur et retourne son profil', async () => {
    supabaseMock.auth.signInWithPassword.mockResolvedValue({ data: { user: fakeUser }, error: null })

    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: fakeProfile }),
    }
    supabaseMock.from.mockReturnValue(chain)

    const user = await login('test@example.com', 'password123')

    expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' })
    expect(user).toEqual({ id: 'user-1', username: 'testuser' })
  })

  it('retourne l\'email comme fallback si pas de profil', async () => {
    supabaseMock.auth.signInWithPassword.mockResolvedValue({ data: { user: fakeUser }, error: null })

    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null }),
    }
    supabaseMock.from.mockReturnValue(chain)

    const user = await login('test@example.com', 'password123')
    expect(user.username).toBe('test@example.com')
  })

  it('lève "Identifiants incorrects" si signIn échoue', async () => {
    supabaseMock.auth.signInWithPassword.mockResolvedValue({ data: { user: null }, error: { message: 'Invalid login' } })

    await expect(login('wrong@example.com', 'badpassword')).rejects.toThrow('Identifiants incorrects')
  })
})

describe('logout', () => {
  it('appelle supabase.auth.signOut', async () => {
    supabaseMock.auth.signOut.mockResolvedValue({})
    await logout()
    expect(supabaseMock.auth.signOut).toHaveBeenCalledOnce()
  })
})

describe('getCurrentUser', () => {
  it('retourne null si pas de session', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } })
    const user = await getCurrentUser()
    expect(user).toBeNull()
  })

  it('retourne l\'utilisateur avec son profil', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: fakeUser } })

    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: fakeProfile }),
    }
    supabaseMock.from.mockReturnValue(chain)

    const user = await getCurrentUser()
    expect(user).toEqual({ id: 'user-1', username: 'testuser' })
  })
})
