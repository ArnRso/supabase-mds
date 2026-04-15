export interface User {
  id: string
  username: string
  password: string
}

const USERS_KEY = 'users'
const SESSION_KEY = 'session'

export function getUsers(): User[] {
  return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]')
}

export function getCurrentUser(): User | null {
  return JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null')
}

export function register(username: string, password: string): User {
  const users = getUsers()
  if (users.find(u => u.username === username)) {
    throw new Error('Nom d\'utilisateur déjà pris')
  }
  const user: User = { id: crypto.randomUUID(), username, password }
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]))
  return user
}

export function login(username: string, password: string): User {
  const user = getUsers().find(u => u.username === username && u.password === password)
  if (!user) throw new Error('Identifiants incorrects')
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}
