import { createClient, SupabaseClient } from '@supabase/supabase-js'

export const getSupabase = (
  accessToken: string | undefined,
): SupabaseClient | undefined => {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )

  if (accessToken) {
    supabase.auth.setAuth(accessToken)
  }

  return supabase
}
