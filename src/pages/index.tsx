import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Index.css'

const bases = [
    { id: '1', nome: 'Base Transparente', imagem: '/images/ba_transparente.png' },
    { id: '2', nome: 'Base Branca', imagem: '/images/ba_branco.png' },
    { id: '3', nome: 'Base Cinza Clara', imagem: '/images/ba_cinzaCA.png' },
    { id: '4', nome: 'Base Cinza Escura', imagem: '/images/ba_cinzaES.png' },
    { id: '5', nome: 'Base Preta', imagem: '/images/ba_preto.png' },
]

const suportes = [
    { id: '1', nome: 'Suporte Amarelo', imagem: '/images/sup_amarelo.png' },
    { id: '2', nome: 'Suporte Azul', imagem: '/images/sup_azul.png' },
    { id: '3', nome: 'Suporte Verde', imagem: '/images/sup_verde.png' },
    { id: '4', nome: 'Suporte Vermelho', imagem: '/images/sup_vermelho.png' },
]

interface Produto {
    id: string
    nome: string
    imagem: string
}

export default function Index() {
    const navigate = useNavigate()

    const handleLogin = () => navigate('/login')
    const handleRegister = () => navigate('/registrar')

    const renderItem = (item: Produto) => (
        <div className="catalog-item" key={item.id}>
            <div className="image-wrapper">
            <img src={item.imagem} alt={item.nome} className="catalog-image" />
            </div>
            <p className="catalog-title">{item.nome}</p>
        </div>
    )

    return (
        <div className="home-container">
        {/* Header */}
        <header className="header">
            <img src="/images/logo2.png" className="logo" alt="Logo" />
            <div className="authButtons">
            <button className="index-link" onClick={handleLogin}>Entrar</button>
            <button className="index-register" onClick={handleRegister}>Registrar</button>
            </div>
        </header>

        {/* Hero */}
        <section className="hero">
            <h1 className="title">Núcleo de Sistemas Produtivos Inteligentes</h1>
            <p className="description">
            O Centro de Pesquisa em Soluções Inovadoras para Sistemas Produtivos Inteligentes tem como missão
            fundamental a investigação científica, o desenvolvimento tecnológico e a aplicação prática de conhecimentos
            voltados à transformação dos sistemas produtivos tradicionais em estruturas inteligentes, adaptáveis e sustentáveis.
            </p>
            <button className="cta-button" onClick={handleLogin}>Crie o seu agora mesmo!</button>
        </section>

        {/* Produtos */}
        <section className="products">
            <h2 className="products-title">Conheça nossos produtos manufaturados</h2>

            <h3 className="catalog-header">Suportes</h3>
            <div className="catalog-list">
            {suportes.map(renderItem)}
            </div>

            <h3 className="catalog-header">Bases</h3>
            <div className="catalog-list">
            {bases.map(renderItem)}
            </div>
        </section>
        </div>
    )
}