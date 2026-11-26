# turmalina: pacote do site

## Como rodar
```
npm install
npm run build        # gera public/app.js
npm run serve        # http://localhost:3010/
PLAYWRIGHT_CORE=/opt/node-tools/node_modules/playwright-core node ../../scripts/verificar-site.mjs http://localhost:3010/ --espera 4000   # precisa dar 0 FAIL
```

## Mapa de arquivos
- `src/`: JS de origem (esbuild empacota em `public/app.js`). Não edite `app.js`.
- `public/app.js`
- `public/estilo.css`
- `public/fonts`
- `public/index.html`

## Seções (ordem da página)
- `.estatico` (lista de peças por escrito, para leitores de tela e movimento reduzido)
- 9 salas no canvas, definidas em `src/capitulos.js`: abertura, onça, baguete, molduras, janelas, vitrine, noite, trançado e ícones

## Cores por papel
- `--f: 'Jost', system-ui, sans-serif`
- `--s: 'Cormorant Garamond', Georgia, serif`
- `--ease: cubic-bezier(.22, 1, .36, 1)`
- `--cor-fundo: #5b4936`
- `--cor-texto: #fff`
- `--cor-carga: #7f6a55`
- `--cor-painel: #f6efe4`
- `--cor-painel-texto: #6f5f4c`
- `--cor-painel-tinta: #2a2118`
Trocar a paleta: `?tema=<nome>`. Temas prontos: quente, frio, mono (blocos `html[data-paleta="..."]` no fim do :root).

## Atributos data-* que controlam comportamento
- `data-limiar-roda`
- `data-limiar-toque`
- `data-pausa-roda`
- `data-transicao`
- `data-carga-ms`

### O que cada atributo faz (o JS lê; mude no HTML, não no JS)
- `data-limiar-roda`, `data-pausa-roda` (`<body>`): soma de rolagem da roda que troca de sala (120) e tempo parado que zera a soma (400 ms).
- `data-limiar-toque` (`<body>`): distância do arrasto vertical para trocar de sala (40 px).
- `data-transicao`, `data-carga-ms` (`<body>`): duração do véu entre salas (650 ms) e ms por 1% do carregamento (18).
- `data-i` (pontos de navegação): índice da sala (0 a 8); gerado pelo JS a partir de `CAPITULOS`.

## Regras de rolagem
- Este site NÃO rola: `html, body { height: 100%; overflow: hidden }` e o canvas WebGL (`.palco`, `position: fixed`) ocupa a tela. Não há altura de página.
- Navegação por capítulos: 9 salas (`src/capitulos.js`, índices 0 a 8). Cada gesto (roda, toque ou seta) troca UMA sala, com véu de transição (`TRANSICAO` = 650 ms) e câmera que chega de longe (`chegada` de 0 a 1).
- Não há trechos fixos nem timelines: `src/main.js` guarda `cap` (sala atual) e chama `cena.quadro(cap, chegada, t, ptr)` a cada quadro; `src/cena.js` (three.js) monta as 9 salas por código (ouro, aço, couro e gemas com transmissão).
- Limiares lidos do `<body>`: roda `data-limiar-roda` = 120 (soma de `deltaY` que troca de sala; zera após `data-pausa-roda` = 400 ms parado), toque `data-limiar-toque` = 40 px, transição `data-transicao` = 650 ms, carregamento `data-carga-ms` = 18 ms por 1% (cerca de 1,8 s).
- Cada capítulo em `capitulos.js` tem `id`, `titulo` (use `<br>` para quebrar), `fundo` (cor do véu), e, se tiver peça, `peca` e `texto` do painel "Descobrir".
- Lenis controla a rolagem suave; não use scroll nativo em animações.

## Regras do celular (390x844)
- Abaixo de 760 px o CSS reposiciona título, botões e pontos (`@media (max-width: 760px)`) e esconde `.rolar2`; a cena WebGL é a mesma. O gesto é o toque vertical (40 px) e os pontos de navegação têm 44 px de área.
- Com `prefers-reduced-motion`: transição instantânea, câmera sem animação e a lista estática `.estatico` (peças por escrito) fica disponível para leitores de tela.

## Armadilhas conhecidas
- `public/app.js` é gerado e inclui o three.js: `npm run build` depois de mexer em `src/`.
- `?tema=` só recolore a interface HTML (fundo, texto, painel). As cores das salas (`fundo` em `capitulos.js` e materiais/luzes em `cena.js`) NÃO seguem o tema.
- Se o WebGL falhar, `<html>` ganha a classe `sem-3d` (o site continua navegável, sem cena).
- O som (Web Audio, acordes suaves) só liga depois do clique em "Som".
- Trocar a quantidade de salas exige atualizar `capitulos.js`, a lista `.estatico` do HTML e a função `quadro` do `cena.js` (um bloco por sala).
- O `<dialog class="painel">` bloqueia as setas enquanto aberto (`painel.open`).

## Conteúdo que manda
Salas, títulos, cores de véu e textos do painel "Descobrir" ficam em `src/capitulos.js`; as joias e os cenários estão em `src/cena.js`. Trocar a marca é editar esses dois arquivos e os textos do `index.html` (carregamento, marca e lista estática).

## Imagens
- Essenciais (o usuário gera): ver `../IMAGENS-PARA-GERAR.md`.
- Não essenciais: placeholder de mesma proporção.
- Sem imagens: tudo é 3D por código e CSS. Não há foto essencial pendente (o aviso de poucas imagens do verificador é esperado).

## Capturas-alvo
Em `conceito/`: `d-NN-tecla-ArrowDown.jpg` (desktop 1440x900) e `m-NN-...` (celular 390x844), uma por sala (0 a 8, a abertura é `00-abertura`). Site de palco fixo: gerado com `palco.cjs`.
Refazer (servidor rodando): `PLAYWRIGHT_CORE=/opt/node-tools/node_modules/playwright-core node ../../replica/ferramentas/palco.cjs http://localhost:3010/ conceito "" tecla:ArrowDown tecla:ArrowDown tecla:ArrowDown tecla:ArrowDown tecla:ArrowDown tecla:ArrowDown tecla:ArrowDown tecla:ArrowDown`
