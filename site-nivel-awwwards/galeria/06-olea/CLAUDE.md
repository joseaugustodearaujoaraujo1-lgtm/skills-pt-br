# olea: pacote do site

## Como rodar
```
npm install
npm run build        # gera public/app.js
npm run serve        # http://localhost:3006/
PLAYWRIGHT_CORE=/opt/node-tools/node_modules/playwright-core node ../../scripts/verificar-site.mjs http://localhost:3006/ --espera 4000   # precisa dar 0 FAIL
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
- `intro (<section>)`
- `recursos (<section>)`
- `produto (<section>)`
- `contato (<footer>)`

## Cores por papel
- `--cor-escura: #12130c`
- `--cor-escura-2: #1c1d13`
- `--cor-claro: #fff1d8`
- `--cor-claro-2: #f1e6cf`
- `--cor-destaque: #b7c449`
- `--cor-destaque-2: #8f9a2e`
- `--cor-tinta: #12130c`
- `--f-sans: 'Instrument Sans', 'Helvetica Neue', Arial, sans-serif`
- `--f-serif: 'Literata', Georgia, serif`
- `--ease: cubic-bezier(.22, 1, .36, 1)`
Trocar a paleta: `?tema=<nome>`. Temas prontos: quente, frio, mono (blocos `html[data-paleta="..."]` no fim do :root).

## Atributos data-* que controlam comportamento
- `data-sec`
- `data-quadros`
- `data-i`
- `data-img`
- `data-nome`
- `data-txt`
- `data-lista`

### O que cada atributo faz (o JS lê; mude no HTML, não no JS)
- `data-quadros` (`.giro`): quantidade de quadros 3D do giro do sabonete (`img/giro/NN.webp`).
- `data-img`, `data-nome`, `data-txt`, `data-lista` (abas `.abas button`): foto, título, texto e lista (itens separados por `|`) do modelo mostrado em "Escolha a sua".
- `data-i` (abas): índice da aba / do modelo.
- `data-sec` (links do menu): nome da seção para marcar o item ativo do menu.

## Regras de rolagem
- Altura total medida: 56.691 px no desktop (1440x900, 1 vh = 9 px, igual ao original) e 51.314 px no celular (390x844).
- Por seção no desktop: intro 900 (100vh), giro 8100 (900vh), portátil 12825 (1425vh), recursos 10350 (1150vh), cripto 8100 (900vh), sustentabilidade 5991, avaliações 2292, produto 7625, escolha 2918, artigo 1109, rodapé 981.
- Palcos encadeados: cada seção alta tem um `.palco` com `position: sticky; top: 0` (7 palcos + `.escolha-palco`) e UMA timeline GSAP com `scrollTrigger: palco(sec)` (`start: 'top top'`, `end: 'bottom bottom'`, `scrub: .6`). Os tempos das timelines são frações (0 a 1) da altura da seção menos a janela, medidas no original; por isso a altura de cada seção (acima) não pode mudar.
- `giro` (900vh): quadros do sabonete 3D em `img/giro/NN.webp` desenhados num canvas conforme a rolagem; depois "Feito com IA*" com a mão e o brilho que segue o ponteiro.
- A lista `['.giro', '.portatil', '.recursos', '.cripto']` esconde cada palco quando o seguinte assume a tela (`onLeave`).
- `.continuar` (aviso "continue rolando") aparece só entre 8 e 56,4 alturas de janela de rolagem, exceto entre 45,4 e 48,9.
- Lenis controla a rolagem suave; não use scroll nativo em animações.

## Regras do celular (390x844)
- O JS é o mesmo em 390x844: as seções mantêm as alturas em vh (giro 900vh, portátil 1425vh, recursos 1150vh, cripto 900vh), mudam `sustentabilidade` (7,9vh) e `produto` (4,8vh) por causa do CSS responsivo. Sem scroll horizontal (medido: 0).
- Menu vira botão `Menu` (`.menu-bt`) que abre `.topo.aberto`. Lenis só com ponteiro fino.
- Com `prefers-reduced-motion`: sem pré-carregamento animado, sem timelines e o texto fica legível.

## Armadilhas conhecidas
- `public/app.js` é gerado: `npm run build` depois de mexer em `src/`.
- Quadros 3D: 48 arquivos `img/giro/00.webp` a `47.webp`, gerados por `gerar-renders.mjs` a partir de `src/sabonete.js` (o sabonete é nosso). `data-quadros="48"` precisa bater com a quantidade de arquivos.
- Cores por papel (`--cor-*`). Gradientes decorativos (arco-íris do brilho, cores de produto) continuam com hex próprio e não seguem `?tema=`; o fundo e o texto seguem.
- Sombras e linhas com transparência usam `color-mix` com o papel (o `verificar-site.mjs` já entende essa saída).
- `.ia-t` e `.giro-texto` são divididos em letras e palavras por `dividir()`: mantenha texto puro (o `<sup>` do asterisco é tratado à parte).
- Pré-carregamento: o anel só termina depois que `intro-fundo` e o quadro 0 carregarem (mínimo 1,7 s).
- Em `data-lista` (abas de modelo) os itens se separam por `|`.

## Imagens
- Essenciais (o usuário gera): ver `../IMAGENS-PARA-GERAR.md`.
- Não essenciais: placeholder de mesma proporção.
- Essenciais da OLEA: seção `06 · OLEA` de `../IMAGENS-PARA-GERAR.md` (fotos com mãos e cenários). O sabonete 3D e os quadros do giro já são nossos e continuam.

## Capturas-alvo
Em `conceito/`: `d-NN.jpg` (desktop 1440x900) e `m-NN.jpg` (celular 390x844), uma por tela na ordem da rolagem. 
Refazer: `ESPERA=4500 node ../../replica/ferramentas/telas2.cjs http://localhost:PORTA/ d conceito N 1440` e o mesmo com `m` e `390`.
