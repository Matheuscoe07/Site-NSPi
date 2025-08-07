import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bcrypt from 'bcryptjs'
import supabase from '@supabase/supabase-js'
import '../styles/registrar.css'

export default function RegisterPage() {
    const [nome, setNome] = useState('')
    const [sobrenome, setSobrenome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const navigate = useNavigate()

    const handleRegister = async () => {
        if (!nome || !sobrenome || !email || !senha) {
        alert('Preencha todos os campos.')
        return
        }

        const senha_hash = bcrypt.hashSync(senha, 10)
        const data_cadastro = new Date().toISOString()

        try {
        const { error } = await supabase
            .from('usuarios')
            .insert([
            {
                nome,
                sobrenome,
                email,
                senha_hash,
                data_cadastro,
                tipo_usuario: 'user',
            },
            ])
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
        <div className="registrar-container">
        <h1 className="registrar-title">Registrar</h1>

        <div className="form-wrapper">
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
            placeholder="E-mail"
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

            <button className="button" onClick={handleRegister}>
            Registrar
            </button>

            <p className="login-prompt">
            Já tem uma conta? <a href="/login" className="login-link">Entrar</a>
            </p>
        </div>
        </div>
    )
}