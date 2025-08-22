import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth'
import './home.css'
// ⚠️ Certifique-se de importar o CSS dos Bootstrap Icons no entrypoint do app (ex.: main.tsx):
// import 'bootstrap-icons/font/bootstrap-icons.css'

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
    const location = useLocation()
    const { isAuthenticated, logout } = useAuth()

    // ======== NAV / DROPDOWN ========
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const userBtnRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        const close = (e: MouseEvent) => {
        if (!userBtnRef.current) return
        const target = e.target as Node
        const dropdown = document.querySelector('.user-dropdown')
        if (target !== userBtnRef.current && dropdown && !dropdown.contains(target)) {
            setUserMenuOpen(false)
        }
        }
        document.addEventListener('click', close)
        return () => document.removeEventListener('click', close)
    }, [])

    // ======== HERO -> scroll pra seção ========
    const produtosRef = useRef<HTMLElement | null>(null)
    const scrollToProdutos = () => {
        produtosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // ======== CARROSSEIS ========
    const [idxSup, setIdxSup] = useState(0)
    const [idxBase, setIdxBase] = useState(0)

    // auto-rotate a cada 3s
    useEffect(() => {
        const supTimer = setInterval(() => {
        setIdxSup((i) => (i + 1) % suportes.length)
        }, 3000)
        const baseTimer = setInterval(() => {
        setIdxBase((i) => (i + 1) % bases.length)
        }, 3000)
        return () => {
        clearInterval(supTimer)
        clearInterval(baseTimer)
        }
    }, [])

    const supAtual = useMemo(() => suportes[idxSup], [idxSup])
    const baseAtual = useMemo(() => bases[idxBase], [idxBase])

    const proximoSup = () => setIdxSup((i) => (i + 1) % suportes.length)
    const proximoBase = () => setIdxBase((i) => (i + 1) % bases.length)

    const handleCTA = () => {
        navigate(isAuthenticated ? '/pedido' : '/login')
    }

    const goBrand = () => navigate('/')
    const isPath = (p: string) => (location.pathname === p ? 'active' : '')

    return (
        <div className="home-root">
        {/* ======= NAVBAR ======= */}
        <nav className="navbar">
            <div className="nav-left" onClick={goBrand} role="button" aria-label="NSPi Home">
            <img src="/images/logo2.png" alt="NSPi" className="nav-logo" />
            </div>

            <ul className="nav-center">
            <li><Link className={`nav-link ${isPath('/')}`} to="/">HOME</Link></li>
            <li><Link className="nav-link" to="/sobre">SOBRE</Link></li>
            <li><Link className="nav-link" to="/contato">CONTATO</Link></li>
            </ul>

            <div className="nav-right">
            <button
                ref={userBtnRef}
                className="user-btn"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                onClick={() => setUserMenuOpen((v) => !v)}
                title={isAuthenticated ? 'Conta' : 'Entrar'}
            >
                <i className="bi bi-person" aria-hidden="true"></i>
            </button>

            {userMenuOpen && (
                <div className="user-dropdown" role="menu">
                {isAuthenticated ? (
                    <>
                    <button
                        className="dropdown-item"
                        onClick={() => { setUserMenuOpen(false); navigate('/pedido') }}
                    >
                        <i className="bi bi-plus-circle" aria-hidden="true"></i> Novo Pedido
                    </button>
                    <button
                        className="dropdown-item"
                        onClick={() => { logout(); setUserMenuOpen(false) }}
                    >
                        <i className="bi bi-box-arrow-right" aria-hidden="true"></i> Sair
                    </button>
                    </>
                ) : (
                    <>
                    <button
                        className="dropdown-item"
                        onClick={() => { setUserMenuOpen(false); navigate('/login') }}
                    >
                        <i className="bi bi-box-arrow-in-right" aria-hidden="true"></i> Login
                    </button>
                    <button
                        className="dropdown-item"
                        onClick={() => { setUserMenuOpen(false); navigate('/registrar') }}
                    >
                        <i className="bi bi-person-plus" aria-hidden="true"></i> Registrar
                    </button>
                    </>
                )}
                </div>
            )}
            </div>
        </nav>

        {/* ======= HERO ======= */}
        <section className="hero-area">
            <img
            src="/images/foto_inicio.jpg"
            alt="Ambiente do NSPi"
            className="hero-bg"
            loading="eager"
            />

            <div className="hero-card">
            <h1 className="hero-title">Núcleo de Sistemas<br />Produtivos Inteligentes</h1>
            <p className="hero-sub">
                Inovação em movimento: onde automação,<br />
                dados e inteligência se encontram para<br />
                criar a Indústria 4.0 do futuro
            </p>
            </div>

            {/* Chip com seta para baixo (Bootstrap Icons) */}
            <button className="hero-chip" onClick={scrollToProdutos} aria-label="Ir para produtos manufaturados">
            <i className="bi bi-arrow-90deg-down" aria-hidden="true"></i>
            <div className="hero-chip-text">
                <span>Conheça nossos</span>
                <strong>Produtos manufaturados</strong>
            </div>
            </button>
        </section>

        {/* ======= PRODUTOS ======= */}
        <section className="produtos" ref={produtosRef} id="produtos">
            <h2 className="produtos-title">Nossos produtos manufaturados</h2>

            <div className="grid-produtos">
            <div className="col">
                <h3 className="col-title">Suportes</h3>
                <div className="carousel" onClick={proximoSup} role="button" aria-label="Próximo suporte">
                <img key={supAtual.id} src={supAtual.imagem} alt={supAtual.nome} className="carousel-img fade" />
                </div>
                <p className="legenda">{supAtual.legenda}</p>
            </div>

            <div className="mais">+</div>

            <div className="col">
                <h3 className="col-title">Bases</h3>
                <div className="carousel" onClick={proximoBase} role="button" aria-label="Próxima base">
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