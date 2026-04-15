import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { type User, getCurrentUser, login as storeLogin, logout as storeLogout, register as storeRegister } from '../store/auth'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    getCurrentUser().then(setUser)
  }, [])

  async function login(email: string, password: string) {
    const u = await storeLogin(email, password)
    setUser(u)
  }

  async function logout() {
    await storeLogout()
    setUser(null)
  }

  async function register(email: string, password: string) {
    const u = await storeRegister(email, password)
    setUser(u)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
