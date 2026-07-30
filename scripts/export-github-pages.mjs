import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = resolve(rootDir, "docs");
const clientDir = resolve(rootDir, "dist", "client");
const clientAssetsDir = resolve(clientDir, "assets");
const publicDir = resolve(rootDir, "public");
const publicAssetsDir = resolve(publicDir, "assets");
const workerPath = resolve(rootDir, "dist", "server", "index.js");

if (!outputDir.startsWith(`${rootDir}${sep}`)) {
  throw new Error("O diretório de exportação precisa permanecer dentro do projeto.");
}

const workerUrl = pathToFileURL(workerPath);
workerUrl.searchParams.set("export", `${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const response = await worker.fetch(
  new Request("http://localhost/", {
    headers: { accept: "text/html" },
  }),
  {
    ASSETS: {
      fetch: async () => new Response("Not found", { status: 404 }),
    },
  },
  {
    waitUntil() {},
    passThroughOnException() {},
  },
);

if (!response.ok) {
  throw new Error(`A renderização retornou HTTP ${response.status}.`);
}

const assetFiles = await readdir(clientAssetsDir);
const cssFile = assetFiles.find(
  (file) => file.startsWith("index-") && file.endsWith(".css"),
);

if (!cssFile) {
  throw new Error("A folha de estilo compilada não foi encontrada.");
}

const pagesBase = "https://ffidelis16.github.io/next-table-bar-do-cofre";
const sitesBase =
  "https://next-table-bar-do-cofre-wireframe.ffidelis.chatgpt.site";

let html = await response.text();
html = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<link\b(?=[^>]*rel="modulepreload")[^>]*>/gi, "")
  .replace(
    /<link rel="stylesheet" href="\/assets\/[^"]+\.css"[^>]*>/i,
    '<link rel="stylesheet" href="./assets/site.css"/>',
  )
  .replaceAll('="/assets/', '="./assets/')
  .replaceAll(sitesBase, pagesBase)
  .replaceAll("<!-- -->", "")
  .replace(
    "</head>",
    `<link rel="canonical" href="${pagesBase}/"/></head>`,
  )
  .replace("</body>", '<script src="./site.js" defer></script></body>');

const runtime = `(() => {
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
  const hubSpotScriptId = "hubspot-forms-v2";
  const hubSpotScriptUrl = "https://js.hsforms.net/forms/embed/v2.js";
  const hubSpotPortalId = "8180620";
  const hubSpotFormId = "bdb0ccad-d2b3-471a-adf1-9187057e1ab3";
  let hubSpotRendered = false;

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

  const renderHubSpotForm = () => {
    if (hubSpotRendered || !window.hbspt) return;
    window.hbspt.forms.create({
      portalId: hubSpotPortalId,
      formId: hubSpotFormId,
      target: "#hubspotForm",
      onFormReady: () => {
        document.querySelector(".hubspot-form-shell")?.classList.add("is-ready");
      },
      onFormSubmitted: () => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "form_submit", form_id: hubSpotFormId });
        window.dataLayer.push({
          event: "generate_lead",
          form_id: hubSpotFormId,
          value: 1,
        });
      },
    });
    hubSpotRendered = true;
  };

  const loadHubSpotForm = () => {
    if (hubSpotRendered) return;
    if (window.hbspt) {
      renderHubSpotForm();
      return;
    }

    const currentScript = document.getElementById(hubSpotScriptId);
    const script = currentScript || document.createElement("script");
    script.addEventListener("load", renderHubSpotForm, { once: true });

    if (!currentScript) {
      script.id = hubSpotScriptId;
      script.src = hubSpotScriptUrl;
      script.async = true;
      script.addEventListener(
        "error",
        () => {
          const status = document.querySelector("[data-hubspot-status]");
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

  const openDialog = () => {
    closeMenu();
    dialog?.showModal();
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "form_open", form_id: hubSpotFormId });
    window.requestAnimationFrame(loadHubSpotForm);
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

    if (progress) progress.style.transform = \`scaleX(\${pageProgress})\`;

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
})();`;

await rm(outputDir, { recursive: true, force: true });
await mkdir(join(outputDir, "assets"), { recursive: true });
await cp(publicAssetsDir, join(outputDir, "assets"), { recursive: true });
await cp(
  join(publicDir, "favicon-next.ico"),
  join(outputDir, "favicon-next.ico"),
);
await cp(join(publicDir, "og.png"), join(outputDir, "og.png"));
await writeFile(
  join(outputDir, "assets", "site.css"),
  await readFile(join(clientAssetsDir, cssFile)),
);
await writeFile(join(outputDir, "site.js"), runtime, "utf8");
await writeFile(join(outputDir, "index.html"), html, "utf8");
await writeFile(join(outputDir, ".nojekyll"), "", "utf8");

console.log(`GitHub Pages exportado em ${outputDir}`);
