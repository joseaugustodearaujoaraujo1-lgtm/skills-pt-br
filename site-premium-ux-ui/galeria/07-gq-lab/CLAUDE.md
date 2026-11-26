# acorde-lab: pacote do site

## Como rodar
```
npm install
npm run build        # gera public/app.js
npm run serve        # http://localhost:3007/
PLAYWRIGHT_CORE=/opt/node-tools/node_modules/playwright-core node ../../scripts/verificar-site.mjs http://localhost:3007/ --espera 4000   # precisa dar 0 FAIL
```

## Mapa de arquivos
- `src/`: JS de origem (esbuild empacota em `public/app.js`). Não edite `app.js`.
- `public/app.js`
- `public/estilo.css`
- `public/fonts`
- `public/index.html`

## Seções (ordem da página)
- `intro (<section>)`
- `transcricao (<section>)`

## Cores por papel
- `--f: 'Inter Tight', system-ui, sans-serif`
- `--s: 'EB Garamond', Georgia, serif`
- `--ease: cubic-bezier(.22, 1, .36, 1)`
- `--cor-destaque: #e7b36a`
- `--cor-fundo: #000`
- `--cor-texto: #fff`
Trocar a paleta: `?tema=<nome>`. Temas prontos: quente, frio, mono (blocos `html[data-paleta="..."]` no fim do :root).

## Atributos data-* que controlam comportamento
- `data-passos`
- `data-passo-px`
- `data-cap`
- `data-ponto`

### O que cada atributo faz (o JS lê; mude no HTML, não no JS)
- `data-passos` (`<body>`): total de passos da experiência (46), lido pelo `main.js` no lugar do `TOTAL` do roteiro.
- `data-passo-px` (`<body>`): pixels de roda por passo (600).
- `data-cap` (botões de capítulo): índice do capítulo em `CAPITULOS` (0 a 2) para o salto.
- `data-ponto` (botões "+"): índice do ponto de exploração em `PONTOS` (0 a 1).

## Regras de rolagem
- Este site NÃO rola: `html, body { height: 100%; overflow: hidden }` e o canvas WebGL (`.palco`, `position: fixed`) ocupa a tela. Não há altura de página para medir.
- A "rolagem" é virtual: 46 passos (`data-passos`), 1 passo = 600 px de roda (`data-passo-px`). Mapa medido no original em `replica/estudos/gq-lab-mapa.json`.
- Tudo é uma linha do tempo por passos em `src/roteiro.js` (`TOTAL`, `CAPITULOS`, `FALAS`, `PONTOS`): abertura 0 a 1, esboços 1 a 6, esboço vira matéria 6 a 7, céu 7 a 10, capítulo I 10 a 18,5, capítulo II 18,5 a 30, capítulo III 30 a 42, fecho 42 a 46.
- `src/cena.js` (three.js) lê o passo e posiciona a câmera, a luz e os objetos; `src/main.js` suaviza o passo (`alvo` persegue o valor atual), mostra legendas, título de capítulo e pontos "+" (`PONTOS[i].passo = [de, até]`).
- Não há GSAP nem Lenis: a roda (`wheel`), o toque (`touchmove`, 260 px por passo) e as setas/`PageDown`/espaço avançam o passo.
- Lenis controla a rolagem suave; não use scroll nativo em animações.

## Regras do celular (390x844)
- Abaixo de 760 px o CSS reposiciona título, legenda e botões (`@media (max-width: 760px)`); a cena WebGL é a mesma. O toque arrasta o passo (260 px por passo).
- Aviso do verificador: 1 alvo de toque menor que 44 px no celular e corpo com 13 px.
- Com `prefers-reduced-motion` a transcrição completa (`.transcricao`) continua disponível como alternativa estática.

## Armadilhas conhecidas
- `public/app.js` é gerado e já inclui o three.js: `npm run build` depois de mexer em `src/`.
- `?tema=` só recolore a interface HTML (destaque dourado `--cor-destaque`; fundo e texto são preto e branco). As cores do 3D estão no `cena.js` (hex em materiais e no shader do céu) e NÃO seguem o tema.
- Sem GPU (verificador, servidor), o three.js usa o renderizador de software: é lento mas funciona; para capturas use `--use-angle=swiftshader` (o `palco.cjs` já faz).
- O som só liga depois do clique em "ativar o som"; a rolagem virtual só é liberada depois dele (`iniciar()`).
- Mudar `data-passos` sem atualizar `roteiro.js` deixa falas e capítulos fora de sincronia: o conteúdo manda em `roteiro.js`.
- Se `data-passo-px` mudar, a velocidade do mouse muda mas o toque continua em 260 px por passo.

## Roteiro (conteúdo que manda)
Falas, capítulos e pontos de exploração ficam em `src/roteiro.js` (arrays `FALAS`, `CAPITULOS`, `PONTOS`). Trocar a marca, o produto e as falas é editar esse arquivo e os textos do `index.html`; o 3D do frasco está em `src/cena.js`.

## Imagens
- Essenciais (o usuário gera): ver `../IMAGENS-PARA-GERAR.md`.
- Não essenciais: placeholder de mesma proporção.
- Sem imagens: o site é 100% 3D e CSS. Não há foto essencial pendente (o aviso `poucas-imagens` do verificador é esperado).

## Capturas-alvo
Em `conceito/`: `d-NN-passo-N.jpg` (desktop 1440x900) e `m-NN-passo-N.jpg` (celular 390x844) nos passos 0, 3, 8, 13, 20, 25, 33, 40 e 45 (site de palco fixo: não rola).
Refazer (servidor rodando): `PLAYWRIGHT_CORE=/opt/node-tools/node_modules/playwright-core node ../../replica/ferramentas/palco.cjs http://localhost:3007/ conceito ".ativar" passo:3 passo:8 passo:13 passo:20 passo:25 passo:33 passo:40 passo:45`
