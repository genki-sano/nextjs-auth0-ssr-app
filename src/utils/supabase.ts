import { createClient, SupabaseClient } from '@supabase/supabase-js'

export const getSupabase = (accessToken: string): SupabaseClient => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Supabase url is required.')
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Supabase anon key is required.')
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )

  // AuthはSupabaseで実装しないため、JWTをオーバーライド
  supabase.auth.setAuth(accessToken)

  return supabase
}
