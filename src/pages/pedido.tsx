import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { criarPedidoSimples } from '../lib/criarPedido'
import './pedido.css'

interface CorItem {
  id: number
  cor: string
  imagem: string
  label?: string
}

const coresSuporte: CorItem[] = [
  { id: 1, cor: 'blue',   imagem: '/images/sup_azul.png',     label: 'Azul' },
  { id: 2, cor: 'red',    imagem: '/images/sup_vermelho.png', label: 'Vermelho' },
  { id: 3, cor: 'yellow', imagem: '/images/sup_amarelo.png',  label: 'Amarelo' },
  { id: 4, cor: 'green',  imagem: '/images/sup_verde.png',    label: 'Verde' },
]

const coresBase: CorItem[] = [
  { id: 5,  cor: 'black',        imagem: '/images/ba_preto.png',         label: 'Preto' },
  { id: 6,  cor: 'lightgray',    imagem: '/images/ba_cinzaCA.png',       label: 'Cinza claro' },
  { id: 8,  cor: 'darkgray',     imagem: '/images/ba_cinzaES.png',       label: 'Cinza escuro' },
  { id: 9,  cor: 'white',        imagem: '/images/ba_branco.png',        label: 'Branco' },
  { id: 10, cor: 'transparente', imagem: '/images/ba_transparente.png',  label: 'Transparente' },
]

/** Troque aqui se sua rota de sucesso for diferente */
const SUCCESS_PATH = '/confirmado'

/** heurística pra checar se a API realmente criou algo */
function isSuccess(result: any): boolean {
  if (!result) return false
  if (result.error) return false
  if (result.success === true) return true
  if (typeof result.status === 'string' && result.status.toLowerCase() === 'ok') return true
  if (result.data) {
    // id direto, ou um array com item criado, ou contagem de linhas
    if (result.data.id) return true
    if (Array.isArray(result.data) && result.data.length > 0) return true
    if (typeof result.data === 'number' && result.data > 0) return true
    if (typeof result.data?.count === 'number' && result.data.count > 0) return true
  }
  return false
}

export default function Pedido() {
  const navigate = useNavigate()
  const [etapa, setEtapa] = useState<'suporte' | 'base'>('suporte')
  const [corSuporte, setCorSuporte] = useState<CorItem>(coresSuporte[0])
  const [corBase, setCorBase] = useState<CorItem>(coresBase[0])
  const [loading, setLoading] = useState(false)

  const lista = etapa === 'suporte' ? coresSuporte : coresBase
  const selecionado = etapa === 'suporte' ? corSuporte : corBase
  const setSelecionado = etapa === 'suporte' ? setCorSuporte : setCorBase

  function goPrev() { if (etapa === 'base') setEtapa('suporte') }
  function goNext() { if (etapa === 'suporte') setEtapa('base') }

  async function handlePronto() {
    if (loading) return
    setLoading(true)
    try {
      const usuarioIdString = localStorage.getItem('usuario_id')
      const id_usuario = usuarioIdString ? parseInt(usuarioIdString, 10) : null
      if (!id_usuario) {
        alert('Erro: Usuário não identificado. Faça login novamente.')
        return
      }

      const nome_customizado =
        `Suporte ${corSuporte.label ?? corSuporte.cor} + Base ${corBase.label ?? corBase.cor}`

      const result = await criarPedidoSimples({
        id_usuario,
        id_base: corBase.id,
        id_suporte: corSuporte.id,
        nome_customizado,
      })

      if (isSuccess(result)) {
        navigate(SUCCESS_PATH)
      } else {
        console.error('Falha ao criar pedido:', result)
        alert('Não consegui criar seu pedido agora. Tenta de novo em alguns segundos.')
      }
    } catch (err) {
      console.error(err)
      alert('Rolou um erro inesperado ao criar seu pedido.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pedido">
      {/* botão voltar ghost -> sempre para Home */}
      <button className="btn-ghost" onClick={() => navigate('/')}>Voltar</button>

      {/* preview central */}
      <div className="stage">
        <img
          className="piece"
          src={etapa === 'suporte' ? corSuporte.imagem : corBase.imagem}
          alt={`${etapa} ${selecionado.label ?? selecionado.cor}`}
        />

        {etapa === 'base' && (
          <button
            className="pronto-pill"
            onClick={handlePronto}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Enviando…' : 'Pronto!'}
          </button>
        )}
      </div>

      {/* barra inferior */}
      <div className="bar">
        <button
          className={`bar-arrow left ${etapa === 'suporte' ? 'hide' : ''}`}
          onClick={goPrev}
          aria-label="Voltar para Suporte"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="palette">
          {lista.map((item) => {
            const ativo = item.id === selecionado.id
            return (
              <button
                key={item.id}
                className={`dot-wrap ${ativo ? 'active' : ''}`}
                onClick={() => setSelecionado(item)}
                title={item.label ?? item.cor}
              >
                <span
                  className="dot"
                  style={item.cor !== 'transparente' ? { backgroundColor: item.cor } : {}}
                >
                  {item.cor === 'transparente' && (
                    <img
                      src="/images/transparente.png"
                      className="dot-img"
                      alt="Transparente"
                    />
                  )}
                </span>
                {ativo && <small className="dot-label">{item.label ?? item.cor}</small>}
              </button>
            )
          })}
        </div>

        <button
          className={`bar-arrow right ${etapa === 'base' ? 'hide' : ''}`}
          onClick={goNext}
          aria-label="Ir para Base"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}