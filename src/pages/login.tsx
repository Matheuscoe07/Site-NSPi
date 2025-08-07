import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Login.css'
import supabase from '@utils/supabase'
import bcrypt from 'bcryptjs'

export default function Login() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const navigate = useNavigate()

    const handleLogin = async () => {
        if (!email || !senha) {
        alert('Preencha todos os campos.')
        return
        }

        try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .single()

        if (error || !data) {
            console.error('Erro ao buscar o usuário:', error?.message)
            alert('Usuário não encontrado ou erro de conexão.')
            return
        }

        const senhaValida = bcrypt.compareSync(senha, data.senha_hash)

        if (!senhaValida) {
            alert('Senha incorreta.')
            return
        }

        localStorage.setItem('usuario_id', data.id_usuario.toString())

        if (data.tipo_usuario) {
            localStorage.setItem('tipo_usuario', data.tipo_usuario)
            console.log(`🔐 Login confirmado. Tipo de usuário: ${data.tipo_usuario}`)

            if (data.tipo_usuario.toLowerCase() === 'operator') {
            navigate('/operador')
            } else {
            navigate('/home')
            }
        } else {
            console.warn('❗ tipo_usuario não encontrado no Supabase!')
            alert('O tipo de usuário não está definido.')
        }
        } catch (err) {
        console.error('Erro ao realizar login:', err)
        alert('Erro ao tentar fazer login.')
        }
    }

    return (
        <div className="login-container">
        <h2 className="login-title">Entrar</h2>

        <div className="form-wrapper">
            <input
            className="login-input"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            />
            <input
            className="login-input"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            type="password"
            />

            <button className="login-button" onClick={handleLogin}>
            Entrar
            </button>

            <p className="register-prompt">
            Não tem uma conta?{' '}
            <Link to="/registrar" className="register-link">Registrar-se</Link>
            </p>
        </div>
        </div>
    )
}