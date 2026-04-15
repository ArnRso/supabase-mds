import { supabase } from '../lib/supabase'
import { getProfile } from './profiles'

export interface User {
  id: string
  username: string
}

export async function register(email: string, password: string, username: string): Promise<User> {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw new Error(error.message)
  const userId = data.user!.id
  const { error: profileError } = await supabase.from('profiles').insert({ id: userId, username })
  if (profileError) throw new Error(profileError.message)
  return { id: userId, username }
}

export async function login(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error('Identifiants incorrects')
  const profile = await getProfile(data.user.id)
  return { id: data.user.id, username: profile?.username ?? data.user.email! }
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut()
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser()
  if (!data.user) return null
  const profile = await getProfile(data.user.id)
  return { id: data.user.id, username: profile?.username ?? data.user.email! }
}
