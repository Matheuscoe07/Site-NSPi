import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import bcrypt from 'bcryptjs'
import supabase from '../utils/supabase'
import './registrar.css'

export default function Registrar() {
    const [nome, setNome] = useState('')
    const [sobrenome, setSobrenome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const navigate = useNavigate()

    async function handleRegister(e?: React.FormEvent) {
        e?.preventDefault()
        if (!nome || !sobrenome || !email || !senha) {
        alert('Preencha todos os campos.')
        return
        }

        const senha_hash = bcrypt.hashSync(senha, 10)
        const data_cadastro = new Date().toISOString()

        try {
        const { error } = await supabase
            .from('usuarios')
            .insert([{ nome, sobrenome, email, senha_hash, data_cadastro, tipo_usuario: 'user' }])
            .throwOnError()

        if (error) throw error
        alert('Registro realizado com sucesso!')
        navigate('/login')
        } catch (err) {
        console.error('Erro ao registrar:', err)
        alert('Não foi possível registrar. Verifique os dados ou tente novamente.')
        }
    }

    return (
        <main className="screen">
        <section className="card">
            {/* ESQUERDA — CADASTRAR */}
            <div className="pane left">
            {/* título fantasma igual ao mock */}
            <h1 aria-hidden className="ghost-title">Cadastrar</h1>

            <form className="stack" onSubmit={handleRegister}>
                <input
                className="input"
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                />
                <input
                className="input"
                type="text"
                placeholder="Sobrenome"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
                />
                <input
                className="input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <input
                className="input"
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                />

                <button className="btn outline-light" type="submit">Cadastrar</button>
            </form>
            </div>

            {/* DIREITA — ENTRAR */}
            <div className="pane right">
            <div className="right-content">
                <h2 className="title">Entrar</h2>
                <p className="welcome">Bem vindo(a) de volta!</p>
                <Link to="/login" className="btn solid-dark as-link">Entrar</Link>
            </div>
            </div>
        </section>
        </main>
    )
}