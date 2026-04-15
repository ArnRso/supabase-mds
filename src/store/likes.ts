import { supabase } from '../lib/supabase'

export async function getLikesCount(articleId: string): Promise<number> {
  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('article_id', articleId)
  return count ?? 0
}

export async function getUserLike(articleId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('likes')
    .select('article_id')
    .eq('article_id', articleId)
    .eq('user_id', userId)
    .single()
  return !!data
}

export async function addLike(articleId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('likes').insert({ article_id: articleId, user_id: user!.id })
  if (error) throw error
}

export async function removeLike(articleId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('likes').delete().eq('article_id', articleId).eq('user_id', user!.id)
  if (error) throw error
}
