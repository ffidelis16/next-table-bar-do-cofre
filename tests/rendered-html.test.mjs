import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
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
}

test("renderiza a LP RSVP com conteúdo essencial", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="pt-BR">/i);
  assert.match(
    html,
    /<title>Nuvemshop Next no Bar do Cofre \| 27\.08<\/title>/i,
  );
  assert.match(html, /Você acaba de receber a chave para um momento exclusivo/);
  assert.match(html, /Marcas Aspiracionais da Nuvemshop/);
  assert.match(html, /marcas selecionadas que faturam milhões por ano/);
  assert.match(html, /27 de agosto · 19h/);
  assert.match(html, /Um dos endereços mais bem guardados de São Paulo/);
  assert.match(html, /Mais de 2\.000/);
  assert.match(html, /A curadoria reúne cerca de 15 marcas convidadas/);
  assert.match(html, /Os próximos movimentos de quem já é referência/);
  assert.match(html, /Sem palco\. Sem palestra\. À mesa\./);
  assert.match(html, /Algumas marcas que já escolheram/);
  assert.match(html, /Este convite é para quem participa das/);
  assert.match(html, /Confirmar presença/);
  assert.doesNotMatch(
    html,
    /A pergunta que abre a noite|Se você pudesse destravar|Há conversas que não são abertas ao público|Prospects|Para crescer sem perder o comando|Dois lugares já estão reservados/,
  );
  assert.equal(
    (html.match(/Dois lugares por marca/g) ?? []).length,
    1,
    "a informação sobre dois lugares deve aparecer apenas na Hero",
  );
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("mantém imagens, marca oficial e formulário na marcação", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /vault-door-closeup\.png/);
  assert.match(html, /vault-entrance\.png/);
  assert.match(html, /keyhole-blue\.webp/);
  assert.match(html, /brands\/pa-concept\.webp/);
  assert.match(html, /brands\/lilly-sarti\.webp/);
  assert.match(html, /brands\/ryzi\.webp/);
  assert.match(html, /não indicam presença confirmada no jantar/);
  assert.match(html, /nuvemshop-logo-dark\.svg/);
  assert.match(html, /favicon-next\.ico/);
  assert.match(html, /og\.png/);
  assert.match(html, /<dialog/i);
  assert.match(html, /id="hubspotForm"/);
  assert.match(html, /Carregando formulário/);
  assert.doesNotMatch(html, /ainda não envia dados ao HubSpot/);
  assert.doesNotMatch(html, /<form/i);
  assert.match(html, /linkedin\.com\/company\/nuvemshop/);
  assert.match(html, /instagram\.com\/nuvemshop/);
});

test("usa o mesmo formulário HubSpot da LP Next Sessions", async () => {
  const pageSource = await readFile(
    new URL("../app/page.tsx", import.meta.url),
    "utf8",
  );
  const exportSource = await readFile(
    new URL("../scripts/export-github-pages.mjs", import.meta.url),
    "utf8",
  );

  for (const source of [pageSource, exportSource]) {
    assert.match(source, /8180620/);
    assert.match(source, /bdb0ccad-d2b3-471a-adf1-9187057e1ab3/);
    assert.match(source, /js\.hsforms\.net\/forms\/embed\/v2\.js/);
  }
});
