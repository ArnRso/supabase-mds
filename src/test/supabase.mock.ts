import { vi } from 'vitest'

export const mockSelect = vi.fn()
export const mockInsert = vi.fn()
export const mockUpdate = vi.fn()
export const mockDelete = vi.fn()
export const mockEq = vi.fn()
export const mockSingle = vi.fn()
export const mockOrder = vi.fn()

const buildChain = () => {
  const chain: Record<string, unknown> = {}
  chain.select = vi.fn(() => chain)
  chain.insert = vi.fn(() => chain)
  chain.update = vi.fn(() => chain)
  chain.delete = vi.fn(() => chain)
  chain.eq = vi.fn(() => chain)
  chain.single = vi.fn(() => Promise.resolve({ data: null, error: null, count: null }))
  chain.order = vi.fn(() => chain)
  return chain
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any

export const supabaseMock = {
  from: vi.fn(() => buildChain()),
  auth: {
    getUser: vi.fn<AnyFn>(() => Promise.resolve({ data: { user: null }, error: null })),
    signUp: vi.fn<AnyFn>(),
    signInWithPassword: vi.fn<AnyFn>(),
    signOut: vi.fn<AnyFn>(),
    onAuthStateChange: vi.fn<AnyFn>(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  },
}

vi.mock('../lib/supabase', () => ({ supabase: supabaseMock }))
