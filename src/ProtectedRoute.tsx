import { useEffect, useMemo, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import supabase from './utils/supabase'

export default function ProtectedRoute() {
  const location = useLocation()
  const [authReady, setAuthReady] = useState(false)
  const [hasSession, setHasSession] = useState(false)

  // aceita login “legado” (flag que seu /login seta ao validar senha_hash do banco)
  const legacy = useMemo(() => {
    try { return localStorage.getItem('legacy_login') === '1' } catch { return false }
  }, [])

  useEffect(() => {
    let unsub = () => {}
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      setHasSession(!!data.session)
      setAuthReady(true)

      const sub = supabase.auth.onAuthStateChange((_e, session) => {
        setHasSession(!!session)
      })
      unsub = () => sub.data.subscription.unsubscribe()
    })()
    return () => unsub()
  }, [])

  // DEBUG: veja no console porque está barrando (pode apagar depois)
  console.log('[Guard]', { path: location.pathname, legacy, authReady, hasSession })

  // se for legado, libera na hora (evita “Carregando…” eterno/loop)
  if (legacy) return <Outlet />

  // senão, espera checar a sessão do Supabase
  if (!authReady) return <div style={{ padding: 24 }}>Carregando…</div>

  if (hasSession) return <Outlet />
  return <Navigate to="/login" replace state={{ from: location }} />
}
