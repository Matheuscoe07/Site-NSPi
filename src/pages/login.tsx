import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom' // 👈 ADD useLocation
import './login.css'
import supabase from '../utils/supabase'
import bcrypt from 'bcryptjs' // pra validar senha_hash do banco

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation() // 👈 ADD

  // 👇 path de destino: se veio de rota protegida, volta pra lá; senão vai pra /pedido
  const from = (location.state as any)?.from?.pathname || '/pedido'

  // 👇 helper de redirect com fallback hard (resolve loop do guard/SPA)
  function redirectSafely(path: string) {
    navigate(path, { replace: true })
    // se por algum motivo continuar no /login, força navegação
    setTimeout(() => {
      if (window.location.pathname === '/login') window.location.assign(path)
    }, 120)
  }

  async function handleLogin(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault()
    if (loading) return
    if (!email || !senha) return alert('Preencha todos os campos.')

    try {
      setLoading(true)
      const emailNorm = email.trim().toLowerCase()
      const pass = senha.replace(/\s+$/,'') // tira espaço no fim (copy/paste trolla)

      // 1) tenta LOGIN via Supabase Auth
      const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({
        email: emailNorm,
        password: pass,
      })

      if (!authErr && auth?.user) {
        // carrega perfil (se existir) e guarda
        const { data: perfil } = await supabase
          .from('usuarios')
          .select('id_usuario, tipo_usuario')
          .eq('email', emailNorm)
          .maybeSingle()

        if (perfil?.id_usuario) localStorage.setItem('usuario_id', String(perfil.id_usuario))
        if (perfil?.tipo_usuario) localStorage.setItem('tipo_usuario', perfil.tipo_usuario)
        localStorage.removeItem('legacy_login') // sessão real

        // ✅ REDIRECT usando "from" ou /pedido
        redirectSafely(from)
        return
      }

      // 2) FALLBACK LEGADO: usuário só na tabela `usuarios`
      const { data: row, error: rowErr } = await supabase
        .from('usuarios')
        .select('id_usuario, tipo_usuario, senha_hash, email')
        .eq('email', emailNorm)
        .maybeSingle()

      if (rowErr) {
        console.error('[usuarios lookup error]', rowErr)
        alert('Erro ao buscar usuário.')
        return
      }

      if (!row?.senha_hash || !bcrypt.compareSync(pass, row.senha_hash)) {
        alert(authErr?.message || 'E-mail ou senha inválidos.')
        return
      }

      // login LEGADO ok → “sessão” local
      localStorage.setItem('usuario_id', String(row.id_usuario))
      localStorage.setItem('tipo_usuario', row.tipo_usuario || 'user')
      localStorage.setItem('legacy_login', '1')

      // ✅ REDIRECT usando "from" ou /pedido
      redirectSafely(from)
    } catch (err) {
      console.error(err)
      alert('Erro ao tentar fazer login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="screen">
      <main className="card">
        <section className="panel left">
          <div className="inner left-inner">
            <h2 className="title">Entrar</h2>

            <form className="form" onSubmit={handleLogin}>
              <input
                className="input"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <input
                className="input"
                placeholder="Senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
              />
              <button className="primary" type="submit" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <Link to="/recuperar-senha" className="link-xs">Esqueceu a senha?</Link>
          </div>
        </section>

        <section className="panel right">
          <div className="inner right-inner">
            <h2 className="title alt">Cadastrar</h2>
            <p className="subtitle">Embarque conosco na<br />quarta revolução industrial</p>
            <Link to="/registrar" className="ghost">Cadastrar</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
