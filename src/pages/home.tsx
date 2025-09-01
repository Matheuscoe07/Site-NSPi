import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import Navbar from '../components/navbar'
import './home.css'

type Produto = {
    id: string
    nome: string
    imagem: string
    legenda?: string
}

const bases: Produto[] = [
    { id: '1', nome: 'Base Transparente', imagem: '/images/ba_transparente.png', legenda: 'Transparente' },
    { id: '2', nome: 'Base Branca', imagem: '/images/ba_branco.png', legenda: 'Branco' },
    { id: '3', nome: 'Base Cinza Clara', imagem: '/images/ba_cinzaCA.png', legenda: 'Cinza Claro' },
    { id: '4', nome: 'Base Cinza Escura', imagem: '/images/ba_cinzaES.png', legenda: 'Cinza Escuro' },
    { id: '5', nome: 'Base Preta', imagem: '/images/ba_preto.png', legenda: 'Preto' },
]

const suportes: Produto[] = [
    { id: '1', nome: 'Suporte Amarelo', imagem: '/images/sup_amarelo.png', legenda: 'Amarelo' },
    { id: '2', nome: 'Suporte Azul', imagem: '/images/sup_azul.png', legenda: 'Azul' },
    { id: '3', nome: 'Suporte Verde', imagem: '/images/sup_verde.png', legenda: 'Verde' },
    { id: '4', nome: 'Suporte Vermelho', imagem: '/images/sup_vermelho.png', legenda: 'Vermelho' },
]

export default function Home() {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    const produtosRef = useRef<HTMLElement | null>(null)
    const scrollToProdutos = () => {
        produtosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const [idxSup, setIdxSup] = useState(0)
    const [idxBase, setIdxBase] = useState(0)

    useEffect(() => {
        const supTimer = setInterval(() => setIdxSup(i => (i + 1) % suportes.length), 3000)
        const baseTimer = setInterval(() => setIdxBase(i => (i + 1) % bases.length), 3000)
        return () => { clearInterval(supTimer); clearInterval(baseTimer) }
    }, [])

    const supAtual = useMemo(() => suportes[idxSup], [idxSup])
    const baseAtual = useMemo(() => bases[idxBase], [idxBase])

    const proximoSup = () => setIdxSup(i => (i + 1) % suportes.length)
    const proximoBase = () => setIdxBase(i => (i + 1) % bases.length)

    const handleCTA = () => navigate(isAuthenticated ? '/pedido' : '/login')

    return (
        <div className="home-root">
        <Navbar />

        {/* HERO */}
        <section className="hero-area">
            <img src="/images/foto_inicio.jpg" alt="Ambiente do NSPi" className="hero-bg" loading="eager" />

            <div className="hero-card">
            <h1 className="hero-title">Núcleo de Sistemas<br />Produtivos Inteligentes</h1>
            <p className="hero-sub">
                Inovação em movimento: onde automação,<br />
                dados e inteligência se encontram para<br />
                criar a Indústria 4.0 do futuro
            </p>
            </div>

            <button className="hero-chip" onClick={scrollToProdutos} aria-label="Ir para produtos manufaturados">
            <i className="bi bi-arrow-90deg-down" aria-hidden="true"></i>
            <div className="hero-chip-text">
                <span>Conheça nossos</span>
                <strong>Produtos manufaturados</strong>
            </div>
            </button>
        </section>

        {/* PRODUTOS */}
        <section className="produtos" ref={produtosRef} id="produtos">
            <h2 className="produtos-title">Nossos produtos manufaturados</h2>

            <div className="grid-produtos">
            <div className="col">
                <h3 className="col-title">Suportes</h3>
                <div className="carousel" onClick={proximoSup} role="button" aria-label="Próximo suporte" tabIndex={0}>
                <img key={supAtual.id} src={supAtual.imagem} alt={supAtual.nome} className="carousel-img fade" />
                </div>
                <p className="legenda">{supAtual.legenda}</p>
            </div>

            <div className="mais">+</div>

            <div className="col">
                <h3 className="col-title">Bases</h3>
                <div className="carousel" onClick={proximoBase} role="button" aria-label="Próxima base" tabIndex={0}>
                <img key={baseAtual.id} src={baseAtual.imagem} alt={baseAtual.nome} className="carousel-img fade" />
                </div>
                <p className="legenda">{baseAtual.legenda}</p>
            </div>
            </div>

            <button className="cta-pill" onClick={handleCTA}>
            Adquira já o seu! <i className="bi bi-chevron-right arrow" aria-hidden="true"></i>
            </button>
        </section>
        </div>
    )
}