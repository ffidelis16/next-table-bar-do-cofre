(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".header-progress span");
  const hero = document.querySelector(".hero");
  const mobileCta = document.querySelector(".mobile-rsvp");
  const suppressSections = [...document.querySelectorAll("[data-cta-suppress]")];
  const revealItems = [...document.querySelectorAll("[data-reveal]")];
  const dialog = document.querySelector(".rsvp-dialog");
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".site-nav");

  if (!reducedMotion) {
    root.dataset.motion = "on";
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
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const closeMenu = () => {
    menu?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-is-open");
  };

  menuToggle?.addEventListener("click", () => {
    const willOpen = !menu?.classList.contains("is-open");
    menu?.classList.toggle("is-open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    document.body.classList.toggle("menu-is-open", willOpen);
  });

  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  const openDialog = () => {
    closeMenu();
    dialog?.showModal();
  };

  document.querySelectorAll("button").forEach((button) => {
    if (
      !button.closest("form") &&
      button.textContent?.includes("Confirmar presença")
    ) {
      button.addEventListener("click", openDialog);
    }
  });

  dialog?.querySelector(".rsvp-dialog__close")?.addEventListener("click", () => {
    dialog.close();
  });

  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog?.querySelector("form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    dialog.querySelector(".rsvp-dialog__intro")?.remove();
    event.currentTarget.replaceWith(
      Object.assign(document.createElement("div"), {
        className: "success-state",
        innerHTML:
          '<span>27.08</span><h2>Presença confirmada.</h2><p>Os detalhes da noite e o convite de agenda serão enviados por e-mail.</p><button class="button button--blue" type="button">Voltar à página</button>',
      }),
    );
    dialog
      .querySelector(".success-state .button")
      ?.addEventListener("click", () => dialog.close());
  });

  let frame = 0;
  const updateScrollState = () => {
    frame = 0;
    const scrollTop = window.scrollY;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pageProgress =
      scrollable > 0 ? Math.min(1, Math.max(0, scrollTop / scrollable)) : 0;
    const ctaSuppressed = suppressSections.some((section) => {
      const bounds = section.getBoundingClientRect();
      return bounds.top < window.innerHeight && bounds.bottom > 0;
    });

    header?.classList.toggle("is-scrolled", scrollTop > 20);
    mobileCta?.classList.toggle(
      "is-visible",
      scrollTop > window.innerHeight * 0.72 && !ctaSuppressed,
    );

    if (progress) progress.style.transform = `scaleX(${pageProgress})`;

    if (hero && !reducedMotion) {
      const heroProgress = Math.min(
        1,
        Math.max(0, -hero.getBoundingClientRect().top / window.innerHeight),
      );
      hero.style.setProperty("--hero-progress", heroProgress.toFixed(3));
    }
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!frame) frame = window.requestAnimationFrame(updateScrollState);
    },
    { passive: true },
  );

  updateScrollState();
})();