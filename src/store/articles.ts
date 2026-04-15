import { supabase } from '../lib/supabase'

export interface Article {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
  userId: string
}

type Row = {
  id: string
  title: string
  content: string
  author: string
  created_at: string
  user_id: string
}

function fromRow(row: Row): Article {
  return { ...row, createdAt: row.created_at, userId: row.user_id }
}

export async function getArticles(): Promise<Article[]> {
  const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data.map(fromRow)
}

export async function getArticle(id: string): Promise<Article | undefined> {
  const { data, error } = await supabase.from('articles').select('*').eq('id', id).single()
  if (error) throw error
  return fromRow(data)
}

export async function createArticle(data: Omit<Article, 'id' | 'createdAt' | 'userId'>): Promise<Article> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data: row, error } = await supabase.from('articles').insert({ ...data, user_id: user!.id }).select().single()
  if (error) throw error
  return fromRow(row)
}

export async function updateArticle(id: string, data: Omit<Article, 'id' | 'createdAt' | 'userId'>): Promise<Article> {
  const { data: row, error } = await supabase.from('articles').update(data).eq('id', id).select().single()
  if (error) throw error
  return fromRow(row)
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) throw error
}
