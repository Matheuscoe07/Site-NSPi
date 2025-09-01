import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import './navbar.css'

type NavbarProps = {
    logoSrc?: string
    logoAlt?: string
}

export default function Navbar({
    logoSrc = '/images/logo_invertido.png',
    logoAlt = 'NSPi',
    }: NavbarProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const { isAuthenticated, logout } = useAuth()

    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const userBtnRef = useRef<HTMLButtonElement | null>(null)
    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const dropdownId = 'user-dropdown-menu'

    useEffect(() => {
        const handleDocClick = (e: MouseEvent) => {
        const target = e.target as Node
        if (
            (userBtnRef.current && userBtnRef.current.contains(target)) ||
            (dropdownRef.current && dropdownRef.current.contains(target))
        ) return
        setUserMenuOpen(false)
        }
        const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setUserMenuOpen(false)
        }
        document.addEventListener('click', handleDocClick)
        document.addEventListener('keydown', handleKey)
        return () => {
        document.removeEventListener('click', handleDocClick)
        document.removeEventListener('keydown', handleKey)
        }
    }, [])

    const goHome = () => navigate('/')
    const isPath = (p: string) => (location.pathname === p ? 'active' : '')

    return (
        <nav className="navbar">
        <div
            className="nav-left"
            onClick={goHome}
            role="button"
            aria-label="Ir para a Home"
            tabIndex={0}
        >
            <img src={logoSrc} alt={logoAlt} className="nav-logo" />
        </div>

        <ul className="nav-center" aria-label="Navegação principal">
            <li><Link className={`nav-link ${isPath('/')}`} to="/">HOME</Link></li>
            <li><Link className={`nav-link ${isPath('/sobre')}`} to="/sobre">SOBRE</Link></li>
            <li><Link className={`nav-link ${isPath('/contato')}`} to="/contato">CONTATO</Link></li>
        </ul>

        <div className="nav-right">
            <button
            ref={userBtnRef}
            className="user-btn"
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
            aria-controls={dropdownId}
            title={isAuthenticated ? 'Conta' : 'Entrar'}
            onMouseDown={(e) => { e.stopPropagation(); setUserMenuOpen(v => !v) }}
            >
            <i className="bi bi-person" aria-hidden="true" />
            <span className="sr-only">
                {isAuthenticated ? 'Abrir menu da conta' : 'Abrir menu de login'}
            </span>
            </button>

            {userMenuOpen && (
            <div
                id={dropdownId}
                className="user-dropdown"
                role="menu"
                ref={dropdownRef}
            >
                {isAuthenticated ? (
                <>
                    <button
                    className="dropdown-item"
                    onClick={() => { setUserMenuOpen(false); navigate('/pedido') }}
                    role="menuitem"
                    >
                    <i className="bi bi-plus-circle" aria-hidden="true" /> Novo Pedido
                    </button>
                    <button
                    className="dropdown-item"
                    onClick={() => { logout(); setUserMenuOpen(false) }}
                    role="menuitem"
                    >
                    <i className="bi bi-box-arrow-right" aria-hidden="true" /> Sair
                    </button>
                </>
                ) : (
                <>
                    <button
                    className="dropdown-item"
                    onClick={() => { setUserMenuOpen(false); navigate('/login') }}
                    role="menuitem"
                    >
                    <i className="bi bi-box-arrow-in-right" aria-hidden="true" /> Login
                    </button>
                    <button
                    className="dropdown-item"
                    onClick={() => { setUserMenuOpen(false); navigate('/registrar') }}
                    role="menuitem"
                    >
                    <i className="bi bi-person-plus" aria-hidden="true" /> Registrar
                    </button>
                </>
                )}
            </div>
            )}
        </div>
        </nav>
    )
}