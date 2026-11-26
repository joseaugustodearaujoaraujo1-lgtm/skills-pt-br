# bruma: pacote do site

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
- `--cor-escura: #1b2620`
- `--cor-escura-2: #24312a`
- `--cor-fundo: #b9b496`
- `--cor-fundo-2: #a9a585`
- `--cor-claro: #f1efe6`
- `--cor-destaque: #8c4b2c`
- `--f-serif: 'Cormorant', 'Cormorant Garamond', Georgia, serif`
- `--f-rot: 'Michroma', 'Arial', sans-serif`
- `--ease: cubic-bezier(.22, 1, .36, 1)`
Trocar a paleta: `?tema=<nome>`. Temas prontos: quente, frio, mono (blocos `html[data-paleta="..."]` no fim do :root).

## Atributos data-* que controlam comportamento
- `data-tema`
- `data-quadros`
- `data-cartao-px`
- `data-cartao-celular`
- `data-voo-fim`
- `data-cartao-duracao`
- `data-lugares`
- `data-dir`
- `data-velocidade`
- `data-x`
- `data-y`
- `data-r`
- `data-i`
- `data-area`
- `data-hosp`
- `data-preco`
- `data-desc`
- `data-foto`
- `data-texto`
- `data-n`
- `data-f`
- `data-tipo`

### O que cada atributo faz (o JS lê; mude no HTML, não no JS)
- `data-tema="claro|escuro"` (seções): cor do topo fixo (claro ou escuro) enquanto a seção está sob ele.
- `data-quadros` (`.hero`): número de quadros do voo de drone em `img/voo/NN.webp`; 0 usa só a foto.
- `data-voo-fim`, `data-cartao-px`, `data-cartao-celular`, `data-cartao-duracao` (`.hero`): fim do voo (fração da rolagem), largura final do cartão em px de 1440 e escala final no celular, e a duração do encolhimento (fração).
- `data-x`, `data-y`, `data-r` (`.cartao`): posição inicial e inclinação de cada cartão da diagonal, em px de 1440x900.
- `data-velocidade` (`.encanto-palco`): quanto os cartões andam por px de rolagem.
- `data-area`, `data-hosp`, `data-preco`, `data-desc`, `data-foto` (abas de suíte): dados que aparecem ao clicar na aba; `data-foto` é o índice da foto do carrossel.
- `data-texto` (botões de estação): parágrafo mostrado quando a estação é escolhida.
- `data-lugares` (`.infra`): lista JSON de {n minutos, lugar, foto, alt} do carrossel de infraestrutura.
- `data-n` (`.stat-n`): valor final da contagem dos números.
- `data-f` e `data-tipo`: filtro das notícias (aba `todas` ou `obra`, item com `data-tipo`).
- `data-dir`: sentido (-1 ou 1) das setas dos carrosséis.
- `data-i`: índice da aba ou da estação.

## Regras de rolagem
- Altura total medida: 33.201 px no desktop (1440x900, 1 vh = 9 px) e 23.171 px no celular (390x844).
- Por seção no desktop: hero 3600 (400vh), prólogo 900, faixa 360, sobre 1998, lugar 2133, encanto 8064 (896vh), linha do tempo 1485, suítes 1962, números 1053, estações 1170, criadores 1323, ateliê em números 1332, galeria 1242, notícias 1215, contato 1800, F·A·Q 1764 (196vh), rodapé 1800 (200vh).
- Trechos fixos (`position: sticky; top: 0`) com timeline GSAP presa à rolagem (`scrub: true`): `.hero-palco` (hero 400vh: a foto aproxima até 55% e depois encolhe num cartão de 433 px), `.encanto-cena` (palco de 896vh: lua em meio-tom fixa e depois 8 cartões atravessando em diagonal), `.faq-palco` (letras sobem e somem, a lista entra) e `.rodape-palco` (cena começa ampliada 1.5x e se afasta até 1.04x). A lua `.encanto-lua` também é sticky.
- Trocar a altura de uma seção fixa muda a velocidade da animação: o progresso 0 a 1 do `scrub` é a altura da seção menos a janela.
- Lenis controla a rolagem suave; não use scroll nativo em animações.

## Regras do celular (390x844)
- Abaixo de 861 px (`largo` falso) só valem: o hero fixo de 400vh, o texto que acende palavra a palavra e um fade simples (`y: 40`, `opacity`) em títulos, cartões, linha do tempo, suítes e infraestrutura. Nada de paralaxe nem de arrasto.
- Cartões de "Por que encanta" viram lista vertical (seção de 1450 px, sem palco fixo). O cartão do hero encolhe só até 60% (`data-cartao-celular`).
- Lenis só liga com ponteiro fino (`pointer: fine`); no toque vale o scroll nativo. Sem scroll horizontal (medido: 0). Alvos de toque com no mínimo 44 px.
- Com `prefers-reduced-motion`, a abertura é removida na hora e nenhuma animação roda.

## Armadilhas conhecidas
- `public/app.js` é gerado: rode `npm run build` depois de mexer em `src/` e commite o resultado.
- As cores foram renomeadas por papel (`--cor-*`): não use hex solto no CSS; sombras e linhas usam `color-mix` com o papel.
- `?tema=` só troca o que está em CSS. O letreiro (`img/marca.webp`) é máscara pintada com `currentColor`, então acompanha o tema.
- `.prologo-texto p` e `.criadores-frase` precisam ser texto puro: o JS os quebra em `<span class="pal">` por palavra.
- Os cartões da diagonal escalam por `innerWidth/1440` e `innerHeight/900`; as coordenadas em `data-x/y/r` são em px de 1440x900.
- `data-lugares` é JSON dentro de aspas simples: não coloque aspas simples nos textos nem remova a vírgula entre itens.
- A faixa "A pousada em números" (letreiro) anda sozinha pelo tempo: ao comparar capturas, ignore essa faixa.
- O som ambiente é sintetizado no navegador (`AudioContext`), sem arquivo de áudio; só inicia depois do clique.
- Menu e cookies são fixos (z-index 55 e 60): não coloque nada com z-index maior que 150 (a abertura usa 150).

## Imagens
- Essenciais (o usuário gera): ver `../IMAGENS-PARA-GERAR.md`.
- Não essenciais: placeholder de mesma proporção.
- Essenciais da BRUMA: seção `05 · BRUMA ALTA` de `../IMAGENS-PARA-GERAR.md` (vídeo do hero em `img/voo/`, hero, lugar, cartões, suítes, galeria). Hoje são fotos livres e renders nossos; troque mantendo nome e proporção. Os meios-tons `mt-*.webp` e `marca.webp` são nossos (`cena/`).

## Capturas-alvo
Em `conceito/`: `d-NN-secao.jpg` (desktop 1440x900) e `m-NN-secao.jpg` (celular 390x844), uma por seção (seção alta ganha também a captura do meio).
Refazer (com o servidor rodando): `PLAYWRIGHT_CORE=/opt/node-tools/node_modules/playwright-core node ../../replica/ferramentas/secoes.cjs http://localhost:3005/ conceito`
