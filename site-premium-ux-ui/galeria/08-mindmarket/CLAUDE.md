# escuta: pacote do site

## Como rodar
```
npm install
npm run build        # gera public/app.js
npm run serve        # http://localhost:3008/
PLAYWRIGHT_CORE=/opt/node-tools/node_modules/playwright-core node ../../scripts/verificar-site.mjs http://localhost:3008/ --espera 4000   # precisa dar 0 FAIL
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
- `linha (<section>)`
- `numeros (<section>)`
- `artigos (<section>)`
- `rodape (<footer>)`

## Cores por papel
- `--cor-texto: #2C2E2A`
- `--cor-destaque: #F4A261`
- `--cor-destaque-2: #E07B2E`
- `--cor-fundo: #F6F0E8`
- `--cor-fundo-2: #E7DDD0`
- `--cor-piscina: #9AD3F0`
- `--cor-acai: #6A3FB5`
- `--cor-rosa: #F7A1B5`
- `--cor-amarelo: #F5D547`
- `--cor-azul: #8EC5FF`
- `--cor-lilas: #CDB4F5`
- `--f: 'Inter', system-ui, sans-serif`
- `--raio: 3.47vw`
- `--ease: cubic-bezier(.22, 1, .36, 1)`
Trocar a paleta: `?tema=<nome>`. Temas prontos: quente, frio, mono (blocos `html[data-paleta="..."]` no fim do :root).

## Atributos data-* que controlam comportamento
- `data-pontos`
- `data-marcas`
- `data-dir`

### O que cada atributo faz (o JS lê; mude no HTML, não no JS)
- `data-dir` (`.trilho`): sentido do trilho de marcas (1 ou -1).
- `data-marcas` (`.trilho`): nomes das marcas do trilho, separados por `|` (o JS monta as pílulas e os ícones).
- `data-pontos` (`.ncard`): pontos [rolagem, y] em px de 1440 que posicionam o cartão de número durante a rolagem (JSON).

## Regras de rolagem
- Altura total medida: 13.731 px no desktop (1440x900, 1 vh = 9 px; as medidas do original são em px de 1440 de largura e o JS escala por `innerWidth / 1440`) e 10.996 px no celular (390x844).
- Por seção no desktop: hero 900, linha do tempo 5296, chamada 1202, público 857, números 2466, areia (artigos) 2109, rodapé 901.
- Trechos fixos (`position: sticky`): `.hero-fixo` e `.grupo-fixo` (o bloco do hero encolhe de 1 a .8 e escurece enquanto a linha do tempo sobe por cima: `scrub` de `top top` a `bottom top`), `.ciclistas-fixo` (ciclistas atravessam os morros e saem antes do título da chamada), `.num-esq` (top 158 px) e `.num-pilha` (3 cartões de número que sobem e se empilham, em `ScrollTrigger.create` sobre `.numeros`).
- Os cartões de número seguem pontos medidos no original (`data-pontos` de cada `.ncard`: pares [rolagem, y] em px de 1440, interpolados linearmente); a rolagem equivalente é `scrollY - (topo de .numeros - 8256 * k)`.
- Trilhos de marcas: 3 faixas infinitas em sentidos alternados (`data-dir` 1 ou -1), velocidade base 40 px/s mais até 360 px/s conforme a velocidade do Lenis.
- Lenis controla a rolagem suave; não use scroll nativo em animações.

## Regras do celular (390x844)
- Abaixo de 860 px (`estreito`): `paralaxe()` zera os cartões da linha do tempo (`y: 0`), os cartões de número perdem o `transform` (`clearProps`) e ficam em coluna; o menu vira botão (`.menu-bt`, `#menu-cel`).
- `.ciclistas-fixo` continua sticky; o hero ganha altura 879 px e o público cai para 232 px. Sem scroll horizontal (medido: 0).
- Com `prefers-reduced-motion`: sem Lenis, sem pré-carregamento e sem timelines.

## Armadilhas conhecidas
- `public/app.js` é gerado: `npm run build` depois de mexer em `src/`.
- Cores por papel (`--cor-*`). Os ícones das marcas fictícias dos trilhos usam a lista `CORES` do `main.js` (hex fixos) e não seguem `?tema=`.
- `data-marcas` (nomes separados por `|`, `&` escrito `&amp;`) gera as pílulas de cada trilho; o JS duplica a lista para o loop infinito: não duplique no HTML.
- `data-pontos` é JSON com pares [rolagem, y]; cada cartão precisa de pelo menos 2 pontos e os valores de rolagem têm de crescer.
- `.hero` e `.grupo` entram animados só depois do pré-carregamento (traço da marca + 1,4 s): em capturas espere 4 s.
- As ilustrações são SVG em `img/ilustra/`; ver `../IMAGENS-PARA-GERAR.md` para trocá-las.

## Imagens
- Essenciais (o usuário gera): ver `../IMAGENS-PARA-GERAR.md`.
- Não essenciais: placeholder de mesma proporção.
- Essenciais da ESCUTA: seção `08 · ESCUTA` de `../IMAGENS-PARA-GERAR.md` (ilustrações vetoriais dos personagens, foto do público e dos artigos). Hoje há ilustrações e fotos provisórias nossas.

## Capturas-alvo
Em `conceito/`: `d-NN-secao.jpg` (desktop 1440x900) e `m-NN-secao.jpg` (celular 390x844), uma por seção (seção alta ganha também a captura do meio).
Refazer (servidor rodando): `PLAYWRIGHT_CORE=/opt/node-tools/node_modules/playwright-core node ../../replica/ferramentas/secoes.cjs http://localhost:PORTA/ conceito`
