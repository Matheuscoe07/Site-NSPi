// src/utils/supabase.ts
import { createClient, type Session, type AuthChangeEvent } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// 👇 logs de debug (FORA do createClient)
console.log('[SB URL]', supabaseUrl)
console.log('[SB KEY]', supabaseKey ? 'ok' : 'MISSING')

// ✅ client único do supabase-js (inclui Postgrest + Auth)
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,      // guarda sessão no storage
    autoRefreshToken: true,    // renova token automaticamente
    detectSessionInUrl: true,  // útil caso use magic link
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
})
// depois de criar o client:
;(window as any).__supabase = supabase  // DEBUG ONLY


// ———————— Helpers de Auth (opcional, mas prático) ————————

/** Pega a sessão atual (ou null) */
export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.warn('[supabase] getSession error:', error.message)
    return null
  }
  return data.session ?? null
}

/** Listener global pra mudanças de auth (login/logout/refresh) */
export function onAuthChange(cb: (event: AuthChangeEvent, session: Session | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => cb(event, session))
  return () => data.subscription.unsubscribe()
}

/** Atalho: criar conta (email/senha) */
export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password })
}

/** Atalho: login com email/senha */
export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

/** Atalho: logout */
export async function signOut() {
  return supabase.auth.signOut()
}

/** (Opcional) Access token atual — útil se precisar chamar API externa com Bearer */
export async function getAccessToken(): Promise<string | null> {
  const s = await getSession()
  return s?.access_token ?? null
}

export default supabase
