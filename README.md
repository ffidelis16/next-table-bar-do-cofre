# Nuvemshop Next · Bar do Cofre

Landing page de RSVP para o jantar reservado da Nuvemshop Next no Bar do
Cofre, no Farol Santander, em São Paulo.

[Abrir página pública](https://ffidelis16.github.io/next-table-bar-do-cofre/)

## Proposta

A página apresenta um jantar reservado para executivos da Nuvemshop, sócios,
fundadores e líderes de e-commerce de marcas selecionadas que faturam milhões
por ano. O conceito visual parte do cofre como metáfora de curadoria, reserva e
acesso.

## Copy final

Revisão consolidada em 30 de julho de 2026:

- abertura com a chave e o programa de Marcas Aspiracionais;
- público e critério de curadoria identificados na Hero;
- localização tratada como principal destaque da experiência;
- horário de início incorporado aos pontos de serviço;
- retirada da pergunta condutora e de qualquer promessa de pauta;
- presença de marcas clientes Nuvemshop como prova social, sem sugerir
  confirmação no jantar;
- informação sobre os dois lugares mantida apenas na Hero.

## Estrutura

- Hero, perfil dos convidados e informações do encontro
- O lugar, sua história e a experiência
- Composição e formato da mesa
- Marcas que já escolheram a Nuvemshop
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
