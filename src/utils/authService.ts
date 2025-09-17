// src/utils/authService.ts
import supabase, {
  getSession as getSbSession,
  onAuthChange as onSbAuthChange,
} from './supabase'
import type { Session, AuthChangeEvent, User } from '@supabase/supabase-js'
import { validateCredentials } from './validators'

export type AuthResult<T> = {
  ok: boolean
  data?: T
  error?: string
}

/**
 * Cadastro com validação local de e-mail/senha.
 * - Cria usuário no Supabase Auth
 * - (Opcional) cria/atualiza registro em `profiles` se a tabela existir
 */
export async function signUp(
  email: string,
  password: string,
  extraProfile?: { full_name?: string; role?: string }
): Promise<AuthResult<{ user: User | null; session: Session | null }>> {
  const emailNorm = email.trim().toLowerCase()
  const v = validateCredentials(emailNorm, password)
  if (!v.valid) {
    return { ok: false, error: v.problems.join(' · ') }
  }

  const { data, error } = await supabase.auth.signUp({ email: emailNorm, password })
  if (error) return { ok: false, error: error.message }

  // tenta criar/atualizar profile (se a tabela existir)
  try {
    const userId = data.user?.id
    if (userId && extraProfile) {
      const { error: upErr } = await supabase
        .from('profiles')
        .upsert(
          {
            id: userId,
            full_name: extraProfile.full_name ?? null,
            role: extraProfile.role ?? 'user',
          },
          { onConflict: 'id' }
        )
      if (upErr) console.warn('[auth] profile upsert falhou (ignorado):', upErr.message)
    }
  } catch (e) {
    console.warn('[auth] profile upsert exception (ignorado):', e)
  }

  return { ok: true, data }
}

/** Login com email/senha (valida e-mail básico antes) */
export async function signIn(
  email: string,
  password: string
): Promise<AuthResult<{ user: User | null; session: Session | null }>> {
  const emailNorm = email.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(emailNorm)) {
    return { ok: false, error: 'E-mail inválido' }
  }
  if (!password) return { ok: false, error: 'Informe a senha' }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailNorm,
    password,
  })
  if (error) return { ok: false, error: error.message }
  return { ok: true, data }
}

/** Logout */
export async function signOut(): Promise<AuthResult<null>> {
  const { error } = await supabase.auth.signOut()
  if (error) return { ok: false, error: error.message }
  return { ok: true, data: null }
}

/** Sessão atual */
export async function getSession(): Promise<Session | null> {
  return await getSbSession()
}

/** Listener de mudanças de auth (login/logout/refresh) */
export function onAuthChange(
  cb: (event: AuthChangeEvent, session: Session | null) => void
) {
  return onSbAuthChange(cb)
}
