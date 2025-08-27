import { useNavigate } from 'react-router-dom'
import './confirmado.css'

export default function Confirmado() {
    const navigate = useNavigate()

    return (
        <div className="confirmado-screen">
        <div className="confirmado-card">
            <h1 className="confirmado-titulo">PEDIDO CONCLUIDO!</h1>
            <p className="confirmado-texto">
            Seu pedido foi efetuado com sucesso.<br />
            Olhe para as maquinas !!!
            </p>
        </div>
        <button className="confirmado-botao" onClick={() => navigate('/')}>
            HOME
        </button>
        </div>
    )
}