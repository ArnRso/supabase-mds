import { createContext, useContext, useState, ReactNode } from 'react'
import { type User, getCurrentUser, login as storeLogin, logout as storeLogout, register as storeRegister } from '../store/auth'

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => void
  logout: () => void
  register: (username: string, password: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getCurrentUser)

  function login(username: string, password: string) {
    const u = storeLogin(username, password)
    setUser(u)
  }

  function logout() {
    storeLogout()
    setUser(null)
  }

  function register(username: string, password: string) {
    const u = storeRegister(username, password)
    storeLogin(username, password)
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
