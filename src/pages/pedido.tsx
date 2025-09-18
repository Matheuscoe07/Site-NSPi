import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { criarPedidoSimples } from '../lib/criarPedido'
import './pedido.css'

/** Ajuste se sua rota de sucesso for diferente */
const SUCCESS_PATH = '/confirmado'
const PUBLIC_PRODUTOS_DIR = '/images/produtos'

type ChaveSuporte = 'Azul' | 'Vermelho' | 'Amarelo' | 'Verde'
type ChaveBase = 'Branca' | 'Cinza' | 'CinzaEscura' | 'Preta' | 'Trans'

interface CorItem<T extends string> {
  id: number
  key: T
  label: string
  color?: string
  transparente?: boolean
}

const coresSuporte: CorItem<ChaveSuporte>[] = [
  { id: 1, key: 'Azul',     label: 'Azul',     color: '#2563eb' },
  { id: 2, key: 'Vermelho', label: 'Vermelho', color: '#dc2626' },
  { id: 3, key: 'Amarelo',  label: 'Amarelo',  color: '#f59e0b' },
  { id: 4, key: 'Verde',    label: 'Verde',    color: '#16a34a' },
]

const coresBase: CorItem<ChaveBase>[] = [
  { id: 5, key: 'Branca',      label: 'Branco',        color: '#f5f5f5' },
  { id: 6, key: 'Cinza',       label: 'Cinza',         color: '#9ca3af' },
  { id: 7, key: 'CinzaEscura', label: 'Cinza escuro',  color: '#4b5563' },
  { id: 8, key: 'Preta',       label: 'Preto',         color: '#0a0a0a' },
  { id: 9, key: 'Trans',       label: 'Transparente',  transparente: true },
]

/** heurística pra checar se a API realmente criou algo */
function isSuccess(result: any): boolean {
  if (!result) return false
  if (result.error) return false
  if (result.success === true) return true
  if (typeof result.status === 'string' && result.status.toLowerCase() === 'ok') return true
  if (result.data) {
    if (result.data.id) return true
    if (Array.isArray(result.data) && result.data.length > 0) return true
    if (typeof result.data === 'number' && result.data > 0) return true
    if (typeof result.data?.count === 'number' && result.data.count > 0) return true
  }
  return false
}

/** monta o nome do arquivo exatamente como está na pasta public */
function buildPreviewPath(suporte: ChaveSuporte, base: ChaveBase): string {
  return `${PUBLIC_PRODUTOS_DIR}/Sup${suporte}Base${base}.png`
}

export default function Pedido() {
  const navigate = useNavigate()
  const [etapa, setEtapa] = useState<'suporte' | 'base'>('suporte')
  const [corSuporte, setCorSuporte] = useState<CorItem<ChaveSuporte>>(coresSuporte[0])
  const [corBase, setCorBase] = useState<CorItem<ChaveBase>>(coresBase[0])
  const [loading, setLoading] = useState(false)
  const [imgError, setImgError] = useState(false)

  const lista = etapa === 'suporte' ? coresSuporte : coresBase
  const selecionado = etapa === 'suporte' ? corSuporte : corBase
  const setSelecionado =
    etapa === 'suporte' ? setCorSuporte : setCorBase

  const previewSrc = useMemo(
    () => buildPreviewPath(corSuporte.key, corBase.key),
    [corSuporte.key, corBase.key]
  )

  /** reseta estado de erro quando a combinação muda */
  useEffect(() => {
    setImgError(false)
  }, [previewSrc])

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

      const nome_customizado = `Suporte ${corSuporte.label} + Base ${corBase.label}`

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
        {!imgError ? (
          <img
            className="piece"
            src={previewSrc}
            alt={`Suporte ${corSuporte.label} + Base ${corBase.label}`}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="piece missing">
            <span>Imagem não encontrada para esta combinação.</span>
            <small>{`Sup${corSuporte.key}Base${corBase.key}.png`}</small>
          </div>
        )}

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
                onClick={() => setSelecionado(item as any)}
                title={item.label}
              >
                <span
                  className={`dot ${item.transparente ? 'dot-transparent' : ''}`}
                  style={!item.transparente ? { backgroundColor: item.color } : undefined}
                />
                {ativo && <small className="dot-label">{item.label}</small>}
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