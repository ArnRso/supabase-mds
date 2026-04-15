import { supabase } from '../lib/supabase'

export interface Comment {
  id: string
  articleId: string
  userId: string
  username: string
  content: string
  createdAt: string
}

type Row = {
  id: string
  article_id: string
  user_id: string
  content: string
  created_at: string
  profiles: { username: string } | null
}

function fromRow(row: Row): Comment {
  return {
    id: row.id,
    articleId: row.article_id,
    userId: row.user_id,
    username: row.profiles?.username ?? 'Anonyme',
    content: row.content,
    createdAt: row.created_at,
  }
}

export async function getComments(articleId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(username)')
    .eq('article_id', articleId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data as Row[]).map(fromRow)
}

export async function addComment(articleId: string, content: string): Promise<Comment> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('comments')
    .insert({ article_id: articleId, user_id: user!.id, content })
    .select('*, profiles(username)')
    .single()
  if (error) throw error
  return fromRow(data as Row)
}

export async function deleteComment(id: string): Promise<void> {
  const { error } = await supabase.from('comments').delete().eq('id', id)
  if (error) throw error
}
