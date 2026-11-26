# cais: pacote do site

## Como rodar
```
npm install
npm run build        # gera public/app.js
npm run serve        # http://localhost:3009/
PLAYWRIGHT_CORE=/opt/node-tools/node_modules/playwright-core node ../../scripts/verificar-site.mjs http://localhost:3009/ --espera 4000   # precisa dar 0 FAIL
```

## Mapa de arquivos
- `src/`: JS de origem (esbuild empacota em `public/app.js`). Não edite `app.js`.
- `public/app.js`
- `public/creditos.json`
- `public/estilo.css`
- `public/fonts`
- `public/img`
- `public/index.html`

## Seções (ordem da página)
- `conteudo (<main>)`
- `porque (<section>)`
- `passos (<section>)`
- `plataforma (<section>)`
- `setor (<section>)`
- `contato (<section>)`
- `perguntas (<section>)`

## Cores por papel
- `--cor-escura: #0B1E2D`
- `--cor-destaque: #FF8A1F`
- `--cor-neutra: #8A9096`
- `--cor-claro: #EEF0F1`
- `--f: 'Inter Tight', system-ui, sans-serif`
- `--m: 'IBM Plex Mono', ui-monospace, monospace`
- `--ease: cubic-bezier(.22, 1, .36, 1)`
- `--cor-linha: #e4e6e8`
- `--cor-cinza-texto: #6e757b`
- `--cor-linha-escura: #2a3a46`
- `--cor-escura-2: #26343e`
- `--cor-azul: #13324a`
- `--cor-destaque-2: #c25e00`
- `--cor-fundo: #fff`
Trocar a paleta: `?tema=<nome>`. Temas prontos: quente, frio, mono (blocos `html[data-paleta="..."]` no fim do :root).

## Atributos data-* que controlam comportamento
- `data-rolagem`
- `data-logos`
- `data-semanas`
- `data-horas`
- `data-fator-mao`
- `data-fator-manobra`
- `data-multa-base`
- `data-multa-por`
- `data-r`
- `data-inicio`
- `data-passo`
- `data-i`

### O que cada atributo faz (o JS lê; mude no HTML, não no JS)
- `data-rolagem` (`.hero`): px de rolagem equivalentes ao hero (1800) usados para sincronizar as 3 frases.
- `data-inicio`, `data-passo` (`.passos`): rolagem absoluta em que a lista de passos começa (5700) e px por item (900).
- `data-passo` (`.slides`): px que o carrossel da plataforma anda por slide (600).
- `data-logos` (`.grade-logos`): nomes dos logos fictícios da grade, separados por `|`.
- `data-semanas`, `data-horas`, `data-fator-mao`, `data-fator-manobra`, `data-multa-base`, `data-multa-por` (`.calc-form`): premissas da calculadora de custo.
- `data-r` (`<b>`): onde cada resultado da calculadora aparece (mao, manobra, multa, total).
- `data-i` (abas): índice do slide da plataforma.

## Regras de rolagem
- Altura total medida: 15.766 px no desktop (1440x900, 1 vh = 9 px, medidas do original em px de página) e 17.237 px no celular (390x844).
- Por seção no desktop: hero 2700 (300vh), marcas 641, caminhos 1028, entalhe 481, calculadora 834, porquê 681, passos 3101, plataforma 1340, setor 621, investidores 621, citação 900, contato 925, perguntas 787, rodapé 1106.
- Trechos fixos (`position: sticky`): `.hero-fixo` (hero 300vh: três quadros que se cruzam com zoom lento, o gêmeo digital em canvas por cima da aérea, e três frases escritas letra a letra; cada frase ocupa 600 px de uma rolagem de `data-rolagem` = 1800 px: escreve de +40 a +355 e apaga de +400 a +570) e `.passos-dentro` (top 48 px: o item ativo e a mídia trocam a cada `data-passo` = 900 px a partir de `data-inicio` = 5700 px de rolagem da página).
- A lista de passos usa `scrollY` absoluto: se alguma seção acima do `.passos` mudar de altura, ajuste `data-inicio` na mesma proporção.
- O carrossel da plataforma (`.slides`) anda `data-passo` = 600 px por slide, só no desktop.
- Lenis controla a rolagem suave; não use scroll nativo em animações.

## Regras do celular (390x844)
- Abaixo de 860 px (`estreito`): o hero tem 2532 px (300vh), `.passos` perde a troca por rolagem (os 4 itens ficam empilhados, seção de 903 px), o carrossel da plataforma deixa de transladar (`estreito.matches`) e o rodapé deixa de ser fixo.
- O menu vira botão `.menu-bt` com `#menu-cel`. Alvos de toque do rodapé têm 44 px. Sem scroll horizontal (medido: 0).
- Com `prefers-reduced-motion`: sem Lenis, a primeira frase já aparece escrita e o pré-carregamento é pulado.

## Armadilhas conhecidas
- `public/app.js` é gerado: `npm run build` depois de mexer em `src/`.
- Cores por papel (`--cor-*`), incluindo as 7 cinzas/azuis mais usadas. O canvas do gêmeo digital (`desenharGemeo`) usa `rgba(140,210,255,...)` e laranja fixos no JS: não seguem `?tema=`.
- A calculadora faz conta de verdade (`calcular()`), com premissas em `data-semanas`, `data-horas`, `data-fator-mao`, `data-fator-manobra`, `data-multa-base` e `data-multa-por` do `<form class="calc-form">`; os campos do formulário precisam se chamar `portoes`, `turnos`, `dias`, `hora`, `manobristas`, `entradas`, `multas`.
- As frases do hero (`.f1`, `.f2`, `.f3`) são quebradas em letras por JS: texto puro, com `aria-label` automático.
- O filme do hero (caminhão atravessando) é o vídeo essencial; hoje há quadros provisórios (`gerar-hero.mjs`). Ver `../IMAGENS-PARA-GERAR.md`.
- `data-logos` usa `|` como separador (18 nomes); os ícones são 4 formas SVG que se repetem.

## Imagens
- Essenciais (o usuário gera): ver `../IMAGENS-PARA-GERAR.md`.
- Não essenciais: placeholder de mesma proporção.
- Essenciais da CAIS: seção `09 · CAIS` de `../IMAGENS-PARA-GERAR.md` (filme do hero em `img/hero/`, cartões e fotos de pátio).

## Capturas-alvo
Em `conceito/`: `d-NN-secao.jpg` (desktop 1440x900) e `m-NN-secao.jpg` (celular 390x844), uma por seção (seção alta ganha também a captura do meio).
Refazer (servidor rodando): `PLAYWRIGHT_CORE=/opt/node-tools/node_modules/playwright-core node ../../replica/ferramentas/secoes.cjs http://localhost:PORTA/ conceito`
