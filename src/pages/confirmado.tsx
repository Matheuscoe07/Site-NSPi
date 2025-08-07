import { useNavigate } from 'react-router-dom';
import './confirmado.css';

export default function Confirmado() {
    const navigate = useNavigate();

    return (
        <div className="confirmado-container">
        <h1 className="confirmado-titulo">Pedido confirmado com sucesso!</h1>
        <p className="confirmado-texto">Olhe para as máquinas 👀✨</p>
        <button className="confirmado-botao" onClick={() => navigate('/')}>
            Voltar ao Início
        </button>
        </div>
    );
}