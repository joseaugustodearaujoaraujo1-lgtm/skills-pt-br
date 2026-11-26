# aura: pacote do site

## Como rodar
```
npm install
npm run build        # gera public/app.js
npm run serve        # http://localhost:3004/
PLAYWRIGHT_CORE=/opt/node-tools/node_modules/playwright-core node ../../scripts/verificar-site.mjs http://localhost:3004/ --espera 4000   # precisa dar 0 FAIL
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
- `inicio (<section>)`
- `plantas (<section>)`
- `contato (<footer>)`

## Cores por papel
- `--cor-texto: #2b1d14`
- `--cor-claro: #f5efe4`
- `--cor-fundo: #c9d8c5`
- `--cor-fundo-2: #b7cbb2`
- `--cor-destaque: #f5b800`
- `--cor-terra: #8a4a22`
- `--f-serif: 'Instrument Serif', Georgia, serif`
- `--f-script: 'Pinyon Script', cursive`
- `--f-sans: 'Archivo', system-ui, sans-serif`
- `--ease: cubic-bezier(.22, 1, .36, 1)`
- `--cor-preta: #0f0d0c`
Trocar a paleta: `?tema=<nome>`. Temas prontos: quente, frio, mono (blocos `html[data-paleta="..."]` no fim do :root).

## Atributos data-* que controlam comportamento
- `data-zoom`
- `data-sobe-de`
- `data-sobe-ate`
- `data-sobe-inicio`
- `data-sobe-fim`
- `data-arco-inicio`

### O que cada atributo faz (o JS lê; mude no HTML, não no JS)
- `data-zoom` (`.hero`): escala final da foto do hero (aproxima a piscina).
- `data-sobe-de`, `data-sobe-ate`, `data-sobe-inicio`, `data-sobe-fim` (`.arco`): posição vertical inicial e final do arco em % da altura dele, e o trecho do hero (% da altura) em que ele sobe.
- `data-arco-inicio` (`.noite`): ponto da seção (%) em que o arco creme começa a subir.

## Regras de rolagem
- Altura total medida: 14.635 px no desktop (1440x900, 1 vh = 9 px) e 13.739 px no celular (390x844).
- Por seção no desktop: hero 2340 (260vh), local 2340 (260vh), manifesto 1170, costa 1170, mapa 809, paisagem 990, aérea 1080, plantas 990, metragem 810, noite 2340 (260vh), rodapé 596.
- Trechos fixos (`position: sticky; top: 0`) com timeline GSAP presa à rolagem (`scrub: true`): `.hero-foto` (hero 260vh: a foto aproxima a piscina com `scale` até 1,45 e o título sobe; o arco creme sobe de 30% a 62% do hero), `.local-janela` (260vh: a janela abre com `clip-path` até a tela cheia e a citação aparece no fim; `.local-titulo` também fica fixo, a 126 px) e `.noite-palco` (260vh: foto noturna e arco creme subindo com "O ESPAÇO").
- Mudar a altura de uma dessas seções muda a velocidade: o progresso é a altura menos a janela.
- Lenis controla a rolagem suave; não use scroll nativo em animações.

## Regras do celular (390x844)
- O JS não tem ramo separado para o celular: as mesmas animações rodam em 390x844, e o CSS reorganiza a grade (alturas medidas acima, scroll horizontal 0). Os trechos fixos mantêm 260vh.
- Lenis só liga com ponteiro fino (no toque vale o scroll nativo). Aviso do verificador: 1 alvo de toque menor que 44 px no celular.
- Com `prefers-reduced-motion` nada anima e o manifesto aparece inteiro.

## Armadilhas conhecidas
- `public/app.js` é gerado: `npm run build` depois de mexer em `src/`.
- Cores por papel (`--cor-*`). Fundos e textos das seções claras/escuras vêm só dessas variáveis; troque via `?tema=`.
- `.manifesto-texto` é quebrado em `<span class="pal">` por palavra: precisa ser texto puro, sem tags.
- O topo fica escuro sobre as seções da lista `claras` do `main.js` (`.local, .manifesto, .costa, .mapa-sec, .plantas, .metragem, .rodape, .arco-sec`); seção nova clara precisa entrar nessa lista.
- A linha do mapa (`.mapa-linha`) se desenha por `stroke-dasharray`: o caminho SVG precisa ter `getTotalLength()` válido.

## Imagens
- Essenciais (o usuário gera): ver `../IMAGENS-PARA-GERAR.md`.
- Não essenciais: placeholder de mesma proporção.
- Sem lista própria em `../IMAGENS-PARA-GERAR.md`. As fotos de `public/img/` (piscina, costa, plantas, noite) são provisórias: ao lançar com a marca real, gere-as ultra-realistas com o mesmo nome e proporção.

## Capturas-alvo
Em `conceito/`: `d-NN.jpg` (desktop 1440x900) e `m-NN.jpg` (celular 390x844), uma por tela na ordem da rolagem. 
Refazer: `ESPERA=4500 node ../../replica/ferramentas/telas2.cjs http://localhost:PORTA/ d conceito N 1440` e o mesmo com `m` e `390`.
