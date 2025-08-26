import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import supabase from '../utils/supabase'

export default function Login() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleLogin(e?: React.FormEvent<HTMLFormElement>) {
        e?.preventDefault()
        if (!email || !senha) return alert('Preencha todos os campos.')

        try {
        setLoading(true)
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: senha,
        })
        if (error || !data?.user) {
            console.error(error)
            alert('E-mail ou senha inválidos.')
            return
        }

        const authUserId = data.user.id

        let { data: perfil } = await supabase
            .from('usuarios')
            .select('id_usuario, tipo_usuario')
            .eq('auth_user_id', authUserId)
            .single()

        if (!perfil) {
            const alt = await supabase
            .from('usuarios')
            .select('id_usuario, tipo_usuario')
            .eq('email', email)
            .single()
            perfil = alt.data ?? null
        }

        if (perfil?.id_usuario) localStorage.setItem('usuario_id', String(perfil.id_usuario))
        if (perfil?.tipo_usuario) localStorage.setItem('tipo_usuario', perfil.tipo_usuario)

        const tipo = perfil?.tipo_usuario?.toLowerCase()
        if (tipo === 'operator' || tipo === 'operador') navigate('/operador')
        else navigate('/home')
        } catch (err) {
        console.error(err)
        alert('Erro ao tentar fazer login.')
        } finally {
        setLoading(false)
        }
    }

    async function signInWithProvider(provider: 'google' | 'azure') {
        try {
        setLoading(true)
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: `${window.location.origin}/home` },
        })
        if (error) throw error
        } catch (e) {
        console.error(e)
        alert('Falha ao iniciar login social.')
        setLoading(false)
        }
    }

    return (
        <div className="screen">
        <main className="card">
            {/* ESQUERDA */}
            <section className="panel left">
            <div className="inner left-inner">
                <h2 className="title">Entrar</h2>

                {/* ===== Social (comentado a pedido) ===== */}
                {/*
                <div className="social" aria-label="Entrar com">
                <button
                    className="icon-btn"
                    title="Entrar com Google"
                    onClick={() => signInWithProvider('google')}
                >
                    <svg viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3A12 12 0 1 1 24 12a11.9 11.9 0 0 1 8.5 3.5l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.1-.4-3.5z"/>
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3.2 0 6 .9 8.5 3.5l5.7-5.7A20 20 0 0 0 6.3 14.7z"/>
                    <path fill="#4CAF50" d="M24 44a20 20 0 0 0 19.8-16H24v8h11.3A12 12 0 0 1 24 44z"/>
                    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3A12 12 0 0 1 24 44c-6.5 0-12-4.3-13.9-10.3l-6.6 5A20 20 0 1 0 44 24c0-1.2-.1-2.1-.4-3.5z" opacity=".08"/>
                    </svg>
                </button>

                <button
                    className="icon-btn"
                    title="Entrar com Microsoft"
                    onClick={() => signInWithProvider('azure')}
                >
                    <svg viewBox="0 0 23 23" aria-hidden="true">
                    <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                    <rect x="13" y="1" width="9" height="9" fill="#7FBA00"/>
                    <rect x="1" y="13" width="9" height="9" fill="#00A4EF"/>
                    <rect x="13" y="13" width="9" height="9" fill="#FFB900"/>
                    </svg>
                </button>
                </div>
                */}

                <form className="form" onSubmit={handleLogin}>
                <input
                    className="input"
                    placeholder="Email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="input"
                    placeholder="Senha"
                    type="password"
                    autoComplete="current-password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <button className="primary" type="submit" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
                </form>

                <Link to="/recuperar-senha" className="link-xs">Esqueceu a senha?</Link>
            </div>
            </section>

            {/* DIREITA */}
            <section className="panel right">
            <div className="inner right-inner">
                <h2 className="title alt">Cadastrar</h2>
                <p className="subtitle">
                Embarque conosco na<br />quarta revolução industrial
                </p>
                <Link to="/registrar" className="ghost">Cadastrar</Link>
            </div>
            </section>
        </main>
        </div>
    )
}