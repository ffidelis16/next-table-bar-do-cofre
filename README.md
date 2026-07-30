# Nuvemshop Next · Bar do Cofre

Landing page de RSVP para o jantar reservado da Nuvemshop Next no Bar do
Cofre, no Farol Santander, em São Paulo.

[Abrir página pública](https://ffidelis16.github.io/next-table-bar-do-cofre/)

## Proposta

A página apresenta um encontro para sócios, fundadores e lideranças
responsáveis pelo e-commerce de marcas de varejo. O conceito visual parte do
cofre como metáfora de curadoria, reserva e decisões de valor.

O encontro reúne cerca de 15 marcas em uma conversa sem palco e sem roteiro
fechado, conduzida pelos desafios que essas operações enfrentam.

## Versão corrigida de copy

Revisão aprovada em 30 de julho de 2026:

- identificação do público antecipada para a Hero;
- presença mais clara de varejo e e-commerce ao longo da narrativa;
- redução das menções aos dois lugares por marca;
- informação sobre os dois lugares mantida apenas na Hero;
- fechamento do RSVP direcionado a quem responde pelo e-commerce da marca;
- preservação do conceito, da estrutura e da atmosfera visual aprovados.

## Estrutura

- Hero e informações do encontro
- A conversa e a pergunta condutora
- Composição e curadoria da mesa
- Contexto Nuvemshop Next
- Bar do Cofre e endereço
- RSVP

## Desenvolvimento

```bash
npm install
npm run dev
```

Validação:

```bash
npm test
npm run lint
```

## Publicação no GitHub Pages

A versão estática é gerada em `docs/`:

```bash
npm run export:pages
```

O GitHub Pages publica a pasta `docs/` da branch `main`.

## Formulário

O RSVP usa o mesmo formulário oficial da LP Next Sessions. O script do HubSpot
é carregado somente quando o modal é aberto, preservando o desempenho inicial
da página.
