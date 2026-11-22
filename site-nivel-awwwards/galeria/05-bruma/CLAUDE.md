# bruma: pacote do site

> Gerado por `scripts/gerar-pacote.mjs`. Complete os trechos <PREENCHER> e apague este aviso.

## Como rodar
```
npm install
npm run build        # gera public/app.js
npm run serve        # http://localhost:3005/
PLAYWRIGHT_CORE=/opt/node-tools/node_modules/playwright-core node ../../scripts/verificar-site.mjs http://localhost:3005/ --espera 4000   # precisa dar 0 FAIL
```

## Mapa de arquivos
- `src/`: JS de origem (esbuild empacota em `public/app.js`). Não edite `app.js`.
- `public/app.js`
- `public/creditos.json`
- `public/estilo.css`
- `public/fonts`
- `public/img`
- `public/index.html`
- `cena/`: scripts que geram renders e imagens.

## Seções (ordem da página)
- `conteudo (<main>)`
- `topo (<section>)`
- `sobre (<section>)`
- `lugar (<section>)`
- `encanto (<section>)`
- `suites (<section>)`
- `estacoes (<section>)`
- `galeria (<section>)`
- `contato (<section>)`
- `perguntas (<section>)`

## Cores por papel
- `--musgo: #1b2620`
- `--musgo-2: #24312a`
- `--liquen: #b9b496`
- `--liquen-2: #a9a585`
- `--nevoa: #f1efe6`
- `--pinhao: #8c4b2c`
- `--f-serif: 'Cormorant', 'Cormorant Garamond', Georgia, serif`
- `--f-rot: 'Michroma', 'Arial', sans-serif`
- `--ease: cubic-bezier(.22, 1, .36, 1)`
Trocar a paleta: `?tema=<nome>` (<PREENCHER se existir>).

## Atributos data-* que controlam comportamento
- `data-tema`
- `data-quadros`
- `data-dir`
- `data-i`
- `data-n`
- `data-f`
- `data-tipo`

## Regras de rolagem
- Altura medida do original: <PREENCHER> px a 1440x900 (1 vh = 9 px).
- Trechos fixos (`position: sticky`) com timeline GSAP presa à rolagem: <PREENCHER>.
- Lenis controla a rolagem suave; não use scroll nativo em animações.

## Regras do celular (390x844)
- <PREENCHER>

## Armadilhas conhecidas
- <PREENCHER>

## Imagens
- Essenciais (o usuário gera): ver `../IMAGENS-PARA-GERAR.md`.
- Não essenciais: placeholder de mesma proporção.

## Capturas-alvo
Em `conceito/` (nossas, uma por seção, desktop e celular). Gere com `replica/ferramentas/telas2.cjs`.
