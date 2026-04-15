import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { type User, getCurrentUser, login as storeLogin, logout as storeLogout, register as storeRegister } from '../store/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, username: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser().then(setUser).finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const u = await storeLogin(email, password)
    setUser(u)
  }

  async function logout() {
    await storeLogout()
    setUser(null)
  }

  async function register(email: string, password: string, username: string) {
    const u = await storeRegister(email, password, username)
    setUser(u)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100svh' }}>
        <p aria-busy="true">Chargement…</p>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
