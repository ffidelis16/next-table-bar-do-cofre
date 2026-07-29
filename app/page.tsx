"use client";

import { FormEvent, useRef, useState } from "react";

function Brand() {
  return (
    <span className="brand" aria-label="Nuvemshop Next">
      <span className="brand__mark" aria-hidden="true">
        <i />
        <i />
      </span>
      <span className="brand__name">nuvemshop</span>
      <span className="brand__next">next</span>
    </span>
  );
}

const tableFacts = [
  ["30", "lugares"],
  ["~15", "marcas"],
  ["02", "representantes por marca"],
];

const nextPillars = [
  ["01", "Autonomia para decidir e operar"],
  ["02", "Infraestrutura para sustentar escala"],
  ["03", "Proximidade para avançar com clareza"],
];

export default function Home() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [confirmed, setConfirmed] = useState(false);

  const openRsvp = () => {
    setConfirmed(false);
    dialogRef.current?.showModal();
  };

  const closeRsvp = () => dialogRef.current?.close();

  const confirmRsvp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmed(true);
  };

  return (
    <main>
      <header className="topbar">
        <a className="topbar__brand" href="#inicio">
          <Brand />
        </a>
        <div className="topbar__event">
          <span>27.08</span>
          <span>Bar do Cofre</span>
        </div>
        <button className="button button--small button--ghost" onClick={openRsvp}>
          Confirmar presença
        </button>
      </header>

      <section className="hero" id="inicio">
        <div className="hero__content">
          <p className="eyebrow">Nuvemshop Next convida</p>
          <h1>
            Os próximos movimentos de quem já é referência começam{" "}
            <em>à mesa.</em>
          </h1>
          <p className="hero__lead">
            Uma conversa reservada entre líderes de e-commerce sobre os
            desafios e decisões que devem marcar o próximo ciclo de crescimento.
          </p>

          <div className="hero__details" aria-label="Informações do evento">
            <div>
              <span>Quando</span>
              <strong>27 de agosto</strong>
            </div>
            <div>
              <span>Onde</span>
              <strong>Bar do Cofre · São Paulo</strong>
            </div>
          </div>

          <div className="hero__actions">
            <button className="button button--light" onClick={openRsvp}>
              Confirmar presença
              <span aria-hidden="true">↗</span>
            </button>
            <p>
              Convite nominal · Até dois representantes por marca · Confirmação
              até 25/08
            </p>
          </div>
        </div>

        <div className="portal" aria-hidden="true">
          <div className="portal__halo" />
          <div className="portal__ring portal__ring--outer" />
          <div className="portal__ring portal__ring--middle" />
          <div className="portal__ring portal__ring--inner" />
          <div className="portal__ticks" />
          <img
            className="portal__image portal__image--base"
            src="/assets/vault-door-closeup.png"
            alt=""
          />
          <img
            className="portal__image portal__image--reveal"
            src="/assets/vault-door-closeup.png"
            alt=""
          />
          <div className="portal__axis" />
        </div>

        <a className="hero__scroll" href="#conversa">
          <span>Continuar</span>
          <i aria-hidden="true" />
        </a>
      </section>

      <section className="conversation section" id="conversa">
        <div className="section__index">
          <span>01</span>
          <span>A conversa</span>
        </div>

        <div className="conversation__statement">
          <p className="eyebrow">O formato</p>
          <h2>
            Sem palco. Sem palestra. <em>À mesa.</em>
          </h2>
          <p>
            Um jantar para trocar experiências com quem conhece, por dentro, o
            peso das decisões que fazem uma marca crescer.
          </p>
        </div>

        <blockquote>
          <span>A pergunta que abre a mesa</span>
          “Se você pudesse destravar um único gargalo para crescer no próximo
          ano, qual seria?”
        </blockquote>

        <div className="factline" aria-label="Composição da mesa">
          {tableFacts.map(([number, label]) => (
            <div className="factline__item" key={label}>
              <strong>{number}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="curation section section--light">
        <div className="section__index section__index--dark">
          <span>02</span>
          <span>A curadoria</span>
        </div>

        <div className="curation__grid">
          <div>
            <p className="eyebrow eyebrow--dark">Quem estará à mesa</p>
            <h2>
              Uma sala formada por quem já tem escala — e ainda tem decisões
              importantes pela frente.
            </h2>
          </div>
          <div className="curation__copy">
            <p>
              Fundadores, sócios e líderes de e-commerce de marcas com operação
              própria, reunidos para uma conversa franca sobre gargalos,
              escolhas e oportunidades.
            </p>
            <p>
              Clientes Next também participam da mesa, trazendo a experiência
              de quem já atravessou parte desse caminho.
            </p>
            <div className="invitation-note">
              <span>Convite pessoal</span>
              <strong>Dois lugares reservados por marca.</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="next-bridge section">
        <div className="section__index">
          <span>03</span>
          <span>O próximo movimento</span>
        </div>

        <div className="next-bridge__headline">
          <Brand />
          <h2>
            Crescer sem perder <em>o comando.</em>
          </h2>
          <p>
            Para operações que já ganharam escala, o próximo salto pede
            infraestrutura, autonomia e proximidade estratégica.
          </p>
        </div>

        <div className="next-pillars">
          {nextPillars.map(([number, text]) => (
            <div className="next-pillars__item" key={number}>
              <span>{number}</span>
              <strong>{text}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="venue section">
        <div className="section__index">
          <span>04</span>
          <span>O lugar</span>
        </div>

        <div className="venue__heading">
          <p className="eyebrow">Bar do Cofre · Farol Santander</p>
          <h2>Uma noite reservada no coração histórico de São Paulo.</h2>
        </div>

        <div className="venue__gallery">
          <figure className="venue__main">
            <img
              src="/assets/vault-entrance.png"
              alt="Entrada circular do Bar do Cofre"
              loading="lazy"
            />
          </figure>
          <figure className="venue__detail">
            <img
              src="/assets/vault-cocktail.png"
              alt="Cofres individuais e coquetel no Bar do Cofre"
              loading="lazy"
            />
          </figure>
          <div className="venue__address">
            <span>27.08 · São Paulo</span>
            <strong>Rua João Brícola, 24</strong>
            <p>Centro Histórico · Farol Santander</p>
          </div>
        </div>
      </section>

      <section className="rsvp section section--light" id="rsvp">
        <div className="rsvp__copy">
          <p className="eyebrow eyebrow--dark">RSVP</p>
          <h2>Seu lugar à mesa.</h2>
          <p>
            Confirme sua presença até 25/08. Após a confirmação, você receberá
            por e-mail os próximos detalhes e o convite de agenda.
          </p>
        </div>

        <div className="rsvp__card">
          <div className="rsvp__date">
            <span>AGOSTO</span>
            <strong>27</strong>
          </div>
          <div className="rsvp__event">
            <span>Nuvemshop Next</span>
            <strong>Bar do Cofre · Farol Santander</strong>
            <p>São Paulo</p>
          </div>
          <button className="button button--blue" onClick={openRsvp}>
            Confirmar presença
            <span aria-hidden="true">↗</span>
          </button>
          <small>Convite nominal · Até dois representantes por marca</small>
        </div>
      </section>

      <footer>
        <Brand />
        <p>Uma conversa para os próximos movimentos de quem já é referência.</p>
        <span>São Paulo · 2026</span>
      </footer>

      <button className="mobile-rsvp" onClick={openRsvp}>
        Confirmar presença
        <span aria-hidden="true">↗</span>
      </button>

      <dialog
        className="rsvp-dialog"
        ref={dialogRef}
        onClick={(event) => {
          if (event.currentTarget === event.target) closeRsvp();
        }}
      >
        <button
          className="rsvp-dialog__close"
          onClick={closeRsvp}
          aria-label="Fechar formulário"
        >
          ×
        </button>

        {confirmed ? (
          <div className="success-state" aria-live="polite">
            <span>27.08</span>
            <h2>Presença confirmada.</h2>
            <p>
              Você receberá por e-mail os próximos detalhes e o convite de
              agenda.
            </p>
            <button className="button button--blue" onClick={closeRsvp}>
              Voltar à página
            </button>
          </div>
        ) : (
          <>
            <div className="rsvp-dialog__intro">
              <p className="eyebrow eyebrow--dark">RSVP · 27.08</p>
              <h2>Confirme sua presença.</h2>
              <p>
                Dois lugares estão reservados para sua marca. Preencha os dados
                abaixo para confirmar.
              </p>
              <small>
                Wireframe: este formulário ainda não envia dados ao HubSpot.
              </small>
            </div>

            <form onSubmit={confirmRsvp}>
              <label>
                Nome completo
                <input name="name" autoComplete="name" required />
              </label>
              <label>
                E-mail corporativo
                <input name="email" type="email" autoComplete="email" required />
              </label>
              <div className="form-row">
                <label>
                  Empresa
                  <input name="company" autoComplete="organization" required />
                </label>
                <label>
                  Cargo
                  <input name="role" autoComplete="organization-title" required />
                </label>
              </div>
              <label>
                Nome do segundo representante
                <input name="guest" />
                <small>Opcional</small>
              </label>
              <button className="button button--blue" type="submit">
                Confirmar presença
                <span aria-hidden="true">↗</span>
              </button>
              <p className="form-legal">
                Ao confirmar, você concorda em receber comunicações relacionadas
                a este encontro.
              </p>
            </form>
          </>
        )}
      </dialog>
    </main>
  );
}
