"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type BrandProps = {
  theme?: "dark" | "light";
};

function Brand({ theme = "dark" }: BrandProps) {
  const logo =
    theme === "dark"
      ? "/assets/nuvemshop-logo-dark.svg"
      : "/assets/nuvemshop-logo-light.svg";

  return (
    <span className={`brand brand--${theme}`} aria-label="Nuvemshop Next">
      <img src={logo} alt="" />
      <span className="brand__divider" aria-hidden="true" />
      <span className="brand__next">Next</span>
    </span>
  );
}

const tableFacts = [
  ["30", "lugares"],
  ["~15", "marcas"],
  ["02", "representantes por marca"],
];

const nextPillars = [
  ["01", "Mais controle sobre a operação"],
  ["02", "Infraestrutura pronta para picos e escala"],
  ["03", "Acompanhamento próximo do time Next"],
];

export default function Home() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const root = document.documentElement;
    const hero = document.querySelector<HTMLElement>(".hero");
    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (reducedMotion) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    root.dataset.motion = "on";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    revealItems.forEach((item) => observer.observe(item));

    let frame = 0;
    const updateHero = () => {
      frame = 0;
      if (!hero) return;
      const progress = Math.min(
        1,
        Math.max(0, -hero.getBoundingClientRect().top / window.innerHeight),
      );
      hero.style.setProperty("--hero-progress", progress.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateHero);
    };

    updateHero();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      delete root.dataset.motion;
    };
  }, []);

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
      <a className="skip-link" href="#conversa">
        Ir para o conteúdo
      </a>

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
            Um jantar reservado para líderes de e-commerce trocarem decisões,
            impasses e caminhos para o próximo ano.
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
              Convite nominal · Dois lugares por marca · Confirmação até 25/08
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
        <div className="section__index" data-reveal>
          <span>01</span>
          <span>A conversa</span>
        </div>

        <div className="conversation__statement" data-reveal>
          <p className="eyebrow">O formato</p>
          <h2>
            Sem palco. Sem palestra. <em>À mesa.</em>
          </h2>
          <p>
            Uma conversa direta, entre pares, sobre o que já funciona — e o que
            ainda precisa mudar para a marca seguir crescendo.
          </p>
        </div>

        <div className="question-stage">
          <blockquote data-reveal>
            <span>A pergunta que abre a mesa</span>
            “Se você pudesse destravar um único gargalo para crescer no próximo
            ano, qual seria?”
          </blockquote>
        </div>

        <div
          className="factline"
          aria-label="Composição da mesa"
          data-reveal
        >
          {tableFacts.map(([number, label], index) => (
            <div
              className="factline__item"
              key={label}
              style={{ "--item-index": index } as React.CSSProperties}
            >
              <strong>{number}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="curation section section--light">
        <div className="section__index section__index--dark" data-reveal>
          <span>02</span>
          <span>A curadoria</span>
        </div>

        <div className="curation__grid">
          <div data-reveal>
            <p className="eyebrow eyebrow--dark">Quem estará à mesa</p>
            <h2>
              Uma mesa com quem já construiu muito — e ainda tem decisões
              grandes pela frente.
            </h2>
          </div>
          <div className="curation__copy" data-reveal>
            <p>
              Sócios, fundadores e líderes de e-commerce de marcas com loja
              própria e operação madura.
            </p>
            <p>
              Prospects e clientes Next dividem a mesa. A troca acontece entre
              quem está decidindo os próximos passos e quem já viveu parte
              deles.
            </p>
            <div className="invitation-note">
              <span>Convite pessoal</span>
              <strong>Cerca de 15 marcas. Dois lugares por marca.</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="next-bridge section">
        <div className="section__index" data-reveal>
          <span>03</span>
          <span>O próximo movimento</span>
        </div>

        <div className="next-bridge__headline" data-reveal>
          <Brand />
          <h2>
            Para crescer sem perder <em>o comando.</em>
          </h2>
          <p>
            Quando a operação ganha escala, crescer deixa de ser só vender mais.
            É preciso ter autonomia para decidir, estrutura para aguentar o
            ritmo e gente próxima quando a escolha é importante.
          </p>
        </div>

        <div className="next-pillars" data-reveal>
          {nextPillars.map(([number, text], index) => (
            <div
              className="next-pillars__item"
              key={number}
              style={{ "--item-index": index } as React.CSSProperties}
            >
              <span>{number}</span>
              <strong>{text}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="venue section">
        <div className="section__index" data-reveal>
          <span>04</span>
          <span>O lugar</span>
        </div>

        <div className="venue__heading" data-reveal>
          <p className="eyebrow">Bar do Cofre · Farol Santander</p>
          <h2>
            O Bar do Cofre abre as portas para uma conversa que pede reserva.
          </h2>
          <p>
            No subsolo do Farol Santander, um dos espaços mais singulares de São
            Paulo recebe uma mesa formada para esta noite.
          </p>
        </div>

        <div className="venue__gallery">
          <figure className="venue__main" data-reveal="image">
            <img
              src="/assets/vault-entrance.png"
              alt="Entrada circular do Bar do Cofre"
              loading="lazy"
            />
          </figure>
          <figure className="venue__detail" data-reveal="image">
            <img
              src="/assets/vault-cocktail.png"
              alt="Cofres individuais e coquetel no Bar do Cofre"
              loading="lazy"
            />
          </figure>
          <div className="venue__address" data-reveal>
            <span>27.08 · São Paulo</span>
            <strong>Rua João Brícola, 24</strong>
            <p>Centro Histórico · Farol Santander</p>
          </div>
        </div>
      </section>

      <section className="rsvp section section--light" id="rsvp">
        <div className="rsvp__copy" data-reveal>
          <p className="eyebrow eyebrow--dark">RSVP</p>
          <h2>Seu lugar está à mesa.</h2>
          <p>
            Confirme sua presença até 25/08. Assim que confirmar, você recebe
            por e-mail os detalhes do encontro e o convite de agenda.
          </p>
        </div>

        <div className="rsvp__card" data-reveal>
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
          <small>Convite nominal · Dois representantes por marca</small>
        </div>
      </section>

      <footer>
        <Brand />
        <p>Uma conversa sobre os próximos movimentos de quem já é referência.</p>
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
            <h2>Tudo certo. Sua presença está confirmada.</h2>
            <p>
              Você receberá por e-mail os detalhes do encontro e o convite de
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
                Dois lugares estão reservados para a sua marca. Preencha seus
                dados e, se já souber, inclua o nome de quem vai acompanhar
                você.
              </p>
              <small>
                Prévia: o formulário ainda não envia dados ao HubSpot.
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
