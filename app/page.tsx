"use client";

import { useEffect, useRef, useState } from "react";

type HubSpotFormOptions = {
  portalId: string;
  formId: string;
  target: string;
  onFormReady?: () => void;
  onFormSubmitted?: () => void;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    hbspt?: {
      forms: {
        create: (options: HubSpotFormOptions) => void;
      };
    };
  }
}

const HUBSPOT_SCRIPT_ID = "hubspot-forms-v2";
const HUBSPOT_SCRIPT_URL = "https://js.hsforms.net/forms/embed/v2.js";
const HUBSPOT_PORTAL_ID = "8180620";
const HUBSPOT_FORM_ID = "bdb0ccad-d2b3-471a-adf1-9187057e1ab3";

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
  { value: "30", label: "lugares" },
  { value: "15", label: "marcas convidadas" },
  {
    value: "Varejo e e-commerce",
    label: "em uma mesma mesa",
    compact: true,
  },
];

const socialLinks = [
  ["LinkedIn", "https://www.linkedin.com/company/nuvemshop/"],
  ["Instagram", "https://www.instagram.com/nuvemshop/"],
  ["YouTube", "https://www.youtube.com/nuvemshop"],
  ["Facebook", "https://www.facebook.com/Nuvemshop/"],
];

export default function Home() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const mobileCtaRef = useRef<HTMLButtonElement>(null);
  const hubSpotRenderedRef = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const root = document.documentElement;
    const hero = document.querySelector<HTMLElement>(".hero");
    const ctaSuppressSections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-cta-suppress]"),
    );
    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (!reducedMotion) {
      root.dataset.motion = "on";
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    if (reducedMotion) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      revealItems.forEach((item) => observer.observe(item));
    }

    let frame = 0;
    const updateScrollState = () => {
      frame = 0;
      const scrollTop = window.scrollY;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollable > 0 ? Math.min(1, Math.max(0, scrollTop / scrollable)) : 0;

      headerRef.current?.classList.toggle("is-scrolled", scrollTop > 20);
      const ctaSuppressed = ctaSuppressSections.some((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top < window.innerHeight && bounds.bottom > 0;
      });
      mobileCtaRef.current?.classList.toggle(
        "is-visible",
        scrollTop > window.innerHeight * 0.72 && !ctaSuppressed,
      );
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      if (hero && !reducedMotion) {
        const heroProgress = Math.min(
          1,
          Math.max(0, -hero.getBoundingClientRect().top / window.innerHeight),
        );
        hero.style.setProperty("--hero-progress", heroProgress.toFixed(3));
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScrollState);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
      if (frame) window.cancelAnimationFrame(frame);
      delete root.dataset.motion;
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-is-open", menuOpen);
    return () => document.body.classList.remove("menu-is-open");
  }, [menuOpen]);

  const renderHubSpotForm = () => {
    if (hubSpotRenderedRef.current || !window.hbspt) return;

    window.hbspt.forms.create({
      portalId: HUBSPOT_PORTAL_ID,
      formId: HUBSPOT_FORM_ID,
      target: "#hubspotForm",
      onFormReady: () => {
        document
          .querySelector(".hubspot-form-shell")
          ?.classList.add("is-ready");
      },
      onFormSubmitted: () => {
        window.dataLayer = window.dataLayer ?? [];
        window.dataLayer.push({
          event: "form_submit",
          form_id: HUBSPOT_FORM_ID,
        });
        window.dataLayer.push({
          event: "generate_lead",
          form_id: HUBSPOT_FORM_ID,
          value: 1,
        });
      },
    });
    hubSpotRenderedRef.current = true;
  };

  const loadHubSpotForm = () => {
    if (hubSpotRenderedRef.current) return;
    if (window.hbspt) {
      renderHubSpotForm();
      return;
    }

    const currentScript = document.getElementById(
      HUBSPOT_SCRIPT_ID,
    ) as HTMLScriptElement | null;
    const script = currentScript ?? document.createElement("script");

    script.addEventListener("load", renderHubSpotForm, { once: true });

    if (!currentScript) {
      script.id = HUBSPOT_SCRIPT_ID;
      script.src = HUBSPOT_SCRIPT_URL;
      script.async = true;
      script.addEventListener(
        "error",
        () => {
          const status = document.querySelector<HTMLElement>(
            "[data-hubspot-status]",
          );
          if (status) {
            status.textContent =
              "Não foi possível carregar o formulário. Atualize a página e tente novamente.";
          }
        },
        { once: true },
      );
      document.body.appendChild(script);
    }
  };

  const openRsvp = () => {
    setMenuOpen(false);
    dialogRef.current?.showModal();
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event: "form_open", form_id: HUBSPOT_FORM_ID });
    window.requestAnimationFrame(loadHubSpotForm);
  };

  const closeRsvp = () => dialogRef.current?.close();

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <a className="skip-link" href="#conversa">
        Ir para o conteúdo
      </a>

      <header className="site-header" ref={headerRef}>
        <div className="header-progress" aria-hidden="true">
          <span ref={progressRef} />
        </div>

        <div className="header-inner">
          <a
            className="header-brand"
            href="#inicio"
            aria-label="Nuvemshop Next, voltar ao início"
            onClick={closeMenu}
          >
            <img
              className="header-logo header-logo--white"
              src="/assets/nuvemshop-logo-dark.svg"
              alt=""
            />
            <img
              className="header-logo header-logo--blue"
              src="/assets/nuvemshop-logo-light.svg"
              alt=""
            />
            <span className="header-brand__divider" aria-hidden="true" />
            <span className="header-brand__next">Next</span>
          </a>

          <p className="header-context">
            27 de agosto <span>·</span> Bar do Cofre <span>·</span> São Paulo
          </p>

          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            className={`site-nav${menuOpen ? " is-open" : ""}`}
            id="site-nav"
            aria-label="Navegação principal"
          >
            <a href="#conversa" onClick={closeMenu}>
              A conversa
            </a>
            <a href="#curadoria" onClick={closeMenu}>
              Curadoria
            </a>
            <a href="#local" onClick={closeMenu}>
              O lugar
            </a>
            <button
              className="button button--small button--header"
              onClick={openRsvp}
            >
              Confirmar presença
            </button>
          </nav>
        </div>
      </header>

      <section className="hero snap-section" id="inicio">
        <div className="hero__content">
          <p className="eyebrow">Nuvemshop Next convida</p>
          <h1>
            <span className="hero__line">Os próximos</span>
            <span className="hero__line">movimentos de</span>
            <span className="hero__line">
              quem já é <span className="mobile-break">referência</span>
            </span>
            <span className="hero__line">
              começam <em>à mesa.</em>
            </span>
          </h1>
          <p className="hero__lead">
            Em 27 de agosto, o Bar do Cofre recebe sócios, fundadores e quem
            lidera o e-commerce de marcas de varejo. Uma conversa franca sobre o
            que o próximo ano vai exigir de cada operação.
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

        <div className="portal" aria-label="Porta do cofre se abrindo">
          <div className="portal__halo" aria-hidden="true" />
          <div className="portal__ring portal__ring--outer" aria-hidden="true" />
          <div className="portal__ring portal__ring--middle" aria-hidden="true" />
          <div className="portal__ring portal__ring--inner" aria-hidden="true" />
          <div className="portal__ticks" aria-hidden="true" />
          <div className="portal__window">
            <img
              className="portal__interior"
              src="/assets/vault-entrance.png"
              alt="Interior do Bar do Cofre visto pela porta circular"
            />
            <div className="portal__shade" aria-hidden="true" />
          </div>
          <img
            className="portal__door"
            src="/assets/vault-door-closeup.png"
            alt=""
            aria-hidden="true"
          />
          <div className="portal__rim" aria-hidden="true" />
        </div>

        <a className="hero__scroll" href="#conversa">
          <span>Conheça a noite</span>
          <i aria-hidden="true" />
        </a>
      </section>

      <section className="conversation section snap-section" id="conversa">
        <div className="section__index" data-reveal>
          <span>01</span>
          <span>A conversa</span>
        </div>

        <div className="conversation__statement" data-reveal>
          <p className="eyebrow">A conversa</p>
          <h2>
            Há conversas que não são abertas ao público.{" "}
            <em>Esta é uma delas.</em>
          </h2>
          <p>
            A noite começa com uma pergunta e segue sem roteiro fechado. Os
            desafios de quem conduz operações maduras de e-commerce dão o rumo
            da conversa.
          </p>
        </div>

        <div className="question-stage snap-point">
          <blockquote data-reveal>
            <span>A pergunta que abre a noite</span>
            “Se você pudesse destravar um único gargalo para crescer no próximo
            ano, qual seria?”
          </blockquote>
        </div>

        <div
          className="factline"
          aria-label="Composição da mesa"
          data-reveal
        >
          {tableFacts.map(({ value, label, compact }, index) => (
            <div
              className={`factline__item${
                compact ? " factline__item--compact" : ""
              }`}
              key={label}
              style={{ "--item-index": index } as React.CSSProperties}
            >
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section
        className="curation section section--light snap-section"
        id="curadoria"
      >
        <div className="section__index section__index--dark" data-reveal>
          <span>02</span>
          <span>A curadoria</span>
        </div>

        <div className="curation__grid">
          <div data-reveal>
            <p className="eyebrow eyebrow--dark">Quem participa</p>
            <h2>
              Um encontro entre pares, <em>formado com critério.</em>
            </h2>
          </div>
          <div className="curation__copy" data-reveal>
            <p>
              A curadoria reúne marcas de varejo com e-commerce próprio. À mesa
              estarão sócios, fundadores e líderes que respondem pelo crescimento
              do negócio.
            </p>
            <p>
              Algumas já são clientes Nuvemshop Next e trazem para a mesa a
              experiência de quem enfrenta desafios semelhantes.
            </p>
            <div className="invitation-note">
              <span>Curadoria Nuvemshop Next</span>
              <strong>Marcas que compartilham desafios de escala.</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="next-bridge section snap-section" id="next">
        <div className="section__index" data-reveal>
          <span>03</span>
          <span>Por que este encontro</span>
        </div>

        <div className="next-bridge__headline" data-reveal>
          <Brand />
          <h2>
            Depois de certa escala, as respostas{" "}
            <em>deixam de vir prontas.</em>
          </h2>
          <p>
            Cada operação passa a pedir decisões próprias sobre tecnologia,
            eficiência e crescimento. Este encontro aproxima quem já enfrenta
            essas escolhas.
          </p>
        </div>

        <div className="next-bridge__symbol" aria-hidden="true">
          <img src="/assets/keyhole-blue.webp" alt="" loading="lazy" />
        </div>
      </section>

      <section className="venue section snap-section" id="local">
        <div className="section__index" data-reveal>
          <span>04</span>
          <span>O lugar</span>
        </div>

        <div className="venue__heading" data-reveal>
          <p className="eyebrow">Bar do Cofre · Farol Santander</p>
          <h2>
            Uma mesa de 30 lugares dentro do{" "}
            <em>antigo cofre do Farol Santander.</em>
          </h2>
          <p>
            No subsolo do edifício, entre portas monumentais e caixas de depósito
            preservadas, o Bar do Cofre dá à noite o grau certo de reserva.
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

      <section
        className="rsvp section section--light snap-section"
        id="rsvp"
        data-cta-suppress
      >
        <div className="rsvp__copy" data-reveal>
          <p className="eyebrow eyebrow--dark">RSVP</p>
          <h2>
            Este convite é para quem responde pelo{" "}
            <em>e-commerce da marca.</em>
          </h2>
          <p>
            Confirme sua presença até 25/08. Você receberá por e-mail os detalhes
            do encontro e o convite de agenda.
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
          <small>Convite nominal · Encontro reservado</small>
        </div>
      </section>

      <footer className="site-footer snap-section" data-cta-suppress>
        <div className="site-footer__main">
          <div className="site-footer__brand">
            <Brand />
            <p>Uma noite entre quem decide o futuro do e-commerce no Brasil.</p>
          </div>

          <div className="site-footer__event">
            <span>Encontro reservado</span>
            <strong>27 de agosto · Bar do Cofre</strong>
            <p>Farol Santander · São Paulo</p>
          </div>

          <nav className="site-footer__social" aria-label="Redes da Nuvemshop">
            <span>Siga a Nuvemshop</span>
            {socialLinks.map(([label, url]) => (
              <a href={url} target="_blank" rel="noreferrer" key={label}>
                {label}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="site-footer__bottom">
          <span>© 2026 Nuvemshop</span>
          <a href="#inicio">Voltar ao início ↑</a>
        </div>
      </footer>

      <button className="mobile-rsvp" onClick={openRsvp} ref={mobileCtaRef}>
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

        <div className="rsvp-dialog__intro">
          <p className="eyebrow eyebrow--dark">RSVP · 27.08</p>
          <h2>Confirme sua presença.</h2>
          <p>
            Informe seus dados para confirmar sua presença e, se desejar, o
            nome de quem estará com você.
          </p>
        </div>

        <div className="hubspot-form-shell">
          <p className="hubspot-form__status" data-hubspot-status aria-live="polite">
            Carregando formulário…
          </p>
          <div id="hubspotForm" />
        </div>
      </dialog>
    </main>
  );
}
