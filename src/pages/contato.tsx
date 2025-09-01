import Navbar from '../components/navbar'
import './contato.css'

export default function Contato() {
  return (
    <div className="contact-root">
      <Navbar />

      <main className="contact-wrap">
        <header className="contact-header">
          <h1 className="contact-title">Contato</h1>
          <p className="contact-sub">
            Nossa equipe está pronta para atendê-lo. Entre em contato conosco a qualquer momento.
          </p>
        </header>

        <section className="contact-grid">
          {/* Coluna esquerda: Informações */}
          <article className="contact-card contact-card--info">
            <h2 className="contact-card__title">Informações</h2>

            <div className="contact-info">
              <div className="contact-field">
                <span className="contact-field__label">NSPi</span>
                <span className="contact-field__value">4239-3131</span>
              </div>

              <div className="contact-field">
                <span className="contact-field__label">Técnicos</span>
                <span className="contact-field__value">4239-3506</span>
              </div>

              <div className="contact-field">
                <span className="contact-field__label">E-mail</span>
                <a className="contact-field__value contact-link" href="mailto:lab.nspi@maua.br">
                  lab.nspi@maua.br
                </a>
              </div>

              <div className="contact-field">
                <span className="contact-field__label">Endereço</span>
                <address className="contact-field__value">
                  Praça Mauá, 1 - Mauá, São Caetano do Sul - SP, 09580-900
                </address>
              </div>

              <div className="contact-field">
                <span className="contact-field__label">Horário</span>
                <span className="contact-field__value">Seg. a Sex. 08:00 - 18:00</span>
              </div>
            </div>
          </article>

          {/* Coluna direita: Central de ajuda + LGPD */}
          <div className="contact-right">
            <article className="contact-card contact-card--help">
              <h2 className="contact-card__title">
                Central de ajuda: sua referência<br />
                para dúvidas e informações
              </h2>

              <div className="contact-helpRow">
                <span className="contact-badge">
                  <i className="bi bi-whatsapp" aria-hidden="true" />
                  <span>WhatsApp</span>
                </span>

                <a
                  className="contact-helpNumber"
                  href="https://wa.me/5500000000000"
                  target="_blank"
                  rel="noreferrer"
                >
                  +xx (xx) xxxxx-xxxx
                </a>
              </div>
            </article>

            <article className="contact-card">
              <h2 className="contact-card__title">LGPD</h2>
              <p className="contact-card__subtitle">
                A Lei Geral de Proteção de Dados (LGPD), Lei nº 13.709/2018
              </p>
              <p className="contact-card__text">
                Os dados informados serão utilizados exclusivamente para o atendimento da solicitação.
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  )
}