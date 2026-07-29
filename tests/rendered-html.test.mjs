import assert from "node:assert/strict";
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
  assert.match(html, /Os próximos movimentos de quem já é referência/);
  assert.match(html, /Sem palco\. Sem palestra\./);
  assert.match(html, /30/);
  assert.match(html, /Confirmar presença/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("mantém imagens, marca oficial e formulário na marcação", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /vault-door-closeup\.png/);
  assert.match(html, /vault-entrance\.png/);
  assert.match(html, /nuvemshop-logo-dark\.svg/);
  assert.match(html, /og\.png/);
  assert.match(html, /<dialog/i);
  assert.match(html, /E-mail corporativo/);
  assert.match(html, /segundo representante/);
  assert.match(html, /ainda não envia dados ao HubSpot/);
});
