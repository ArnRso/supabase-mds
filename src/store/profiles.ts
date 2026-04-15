import { supabase } from '../lib/supabase'

export interface Profile {
  id: string
  username: string
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase.from('profiles').select('id, username').eq('id', userId).single()
  return data
}

export async function createProfile(userId: string, username: string): Promise<void> {
  const { error } = await supabase.from('profiles').insert({ id: userId, username })
  if (error) throw error
}
