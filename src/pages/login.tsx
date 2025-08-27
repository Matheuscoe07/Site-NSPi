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

    return (
        <div className="screen">
        <main className="card">
            {/* ESQUERDA */}
            <section className="panel left">
            <div className="inner left-inner">
                <h2 className="title">Entrar</h2>

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