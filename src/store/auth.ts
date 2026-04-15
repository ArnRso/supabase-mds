import { supabase } from '../lib/supabase'

export interface User {
  id: string
  username: string
}

export async function register(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw new Error(error.message)
  return { id: data.user!.id, username: email }
}

export async function login(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error('Identifiants incorrects')
  return { id: data.user.id, username: data.user.email! }
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut()
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser()
  if (!data.user) return null
  return { id: data.user.id, username: data.user.email! }
}
