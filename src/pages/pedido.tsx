import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { criarPedidoSimples } from '../lib/criarPedido';
import './pedido.css';

// Tipagem opcional pra evitar erros no TypeScript
interface CorItem {
    id: number;
    cor: string;
    imagem: string;
}

const coresSuporte: CorItem[] = [
    { id: 1, cor: 'blue', imagem: '/images/sup_azul.png' },
    { id: 2, cor: 'red', imagem: '/images/sup_vermelho.png' },
    { id: 3, cor: 'yellow', imagem: '/images/sup_amarelo.png' },
    { id: 4, cor: 'green', imagem: '/images/sup_verde.png' },
];

const coresBase: CorItem[] = [
    { id: 5, cor: 'black', imagem: '/images/ba_preto.png' },
    { id: 6, cor: 'lightgray', imagem: '/images/ba_cinzaCA.png' },
    { id: 8, cor: 'darkgray', imagem: '/images/ba_cinzaES.png' },
    { id: 9, cor: 'white', imagem: '/images/ba_branco.png' },
    { id: 10, cor: 'transparente', imagem: '/images/ba_transparente.png' },
];

export default function Pedido() {
    const [corSuporte, setCorSuporte] = useState<CorItem>(coresSuporte[0]);
    const [corBase, setCorBase] = useState<CorItem>(coresBase[0]);
    const [etapa, setEtapa] = useState<'suporte' | 'base'>('suporte');
    const navigate = useNavigate();

    const handleFeito = async () => {
        const usuarioIdString = localStorage.getItem('usuario_id');
        const id_usuario = usuarioIdString ? parseInt(usuarioIdString, 10) : null;

        if (!id_usuario) {
        alert('Erro: Usuário não identificado. Faça login novamente.');
        return;
        }

        const nome_customizado = `Suporte ${corSuporte.cor} + Base ${corBase.cor}`;
        const result = await criarPedidoSimples({
        id_usuario,
        id_base: corBase.id,
        id_suporte: corSuporte.id,
        nome_customizado,
        });

        if (result.error) {
        alert(`Erro: ${result.error}`);
        } else {
        navigate('/confirmado');
        }
    };

    const renderCores = (
        lista: CorItem[],
        selecionado: CorItem,
        setSelecionado: React.Dispatch<React.SetStateAction<CorItem>>
    ) => (
        <div className="lista-cores">
        {lista.map((item) => {
            const isSelecionado = selecionado.cor === item.cor;
            return (
            <div
                key={item.id}
                onClick={() => setSelecionado(item)}
                className={`bolinha-wrapper ${isSelecionado ? 'selecionado' : ''}`}
            >
                <div
                className="bolinha"
                style={{ backgroundColor: item.cor !== 'transparente' ? item.cor : undefined }}
                >
                {item.cor === 'transparente' && (
                    <img src={item.imagem} alt={item.cor} className="bolinha-img" />
                )}
                </div>
            </div>
            );
        })}
        </div>
    );

    return (
        <div className="pedido-container">
        <div className="top-bar">
            <button className="pronto-btn" onClick={handleFeito}>Pronto</button>
        </div>

        <div className="visualizacao">
            <img
            src={etapa === 'suporte' ? corSuporte.imagem : corBase.imagem}
            alt="visualizacao"
            className="imagem"
            />
        </div>

        <div className="controles">
            <button onClick={() => setEtapa(etapa === 'suporte' ? 'base' : 'suporte')}>&lt;</button>
            <h2>{etapa === 'suporte' ? 'Suporte' : 'Base'}</h2>
            <button onClick={() => setEtapa(etapa === 'suporte' ? 'base' : 'suporte')}>&gt;</button>
        </div>

        {etapa === 'suporte'
            ? renderCores(coresSuporte, corSuporte, setCorSuporte)
            : renderCores(coresBase, corBase, setCorBase)}
        </div>
    );
}