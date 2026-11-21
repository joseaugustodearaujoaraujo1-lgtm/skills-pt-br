# Receitas de elementos (como se faz, passo a passo)

Cada receita é a técnica **observada nos sites premiados**, reescrita do zero. Valores numéricos medidos no acervo ficam em [padroes.md](padroes.md); aqui está o "como". Sempre adapte aos tokens do `brief.json` (`tokens.css`) e respeite `prefers-reduced-motion`.

Stack padrão: GSAP + ScrollTrigger + Lenis (a base mais comum entre os premiados). SplitText e os demais plugins do GSAP são gratuitos desde a versão 3.13.

## 0. Base de scroll suave + animação (comece por aqui)
```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger);

const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduzido) {
  const lenis = new Lenis({ duration: 1.1, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
```
React/Next: faça isso em um `useEffect` (ou `useGSAP`) e devolva a limpeza (`lenis.destroy()`, `ScrollTrigger.getAll().forEach(t => t.kill())`).

## 1. Tipografia
- **Título gigante** (quando a tipografia é a protagonista): `font-size: clamp(3rem, 10vw, 10.5rem)`, `line-height: .92–1.05`, `letter-spacing: -.02 a -.04em`. É uma escolha comum, não universal: só ~25% dos heros do Awwwards têm título ≥ 72 px (13% ≥ 120 px); nos outros o protagonista é uma cena WebGL (43%), imagem ou vídeo. Decida **qual é o protagonista da primeira dobra** e deixe o resto em segundo plano.
- **Contraste de escala**: maior texto ≈ 5× o menor. Corpo contido (16–20 px) para o título respirar.
- **Hierarquia por escala e peso**, não por cor. 2 famílias + 1 de detalhe (mono para rótulos/números).
- **Revelação por linhas** (a técnica mais usada em hero):
```js
const split = SplitText.create('.hero h1', { type: 'lines', mask: 'lines', autoSplit: true });
gsap.from(split.lines, { yPercent: 110, duration: .9, ease: 'power4.out', stagger: .08, delay: .2 });
```
- **Contraste no estado inicial**: o Lighthouse mede o estado inicial. Palavras com `opacity: .14` dão contraste 1,4:1 e reprovam; use **≥ .4** (texto grande precisa de 3:1) ou revele por máscara/`clip-path` em vez de esmaecer.
- **Acessibilidade do SplitText**: com `aria: 'auto'` (padrão) ele põe `aria-label` no elemento; em `<p>` isso é proibido (`aria-prohibited-attr`). Em parágrafos use `aria: 'none'`; em títulos o padrão é válido.
- **Hero sem JavaScript (melhor LCP)**: o título e os textos da primeira dobra **não devem depender de SplitText nem de `document.fonts.ready`**. Divida as linhas **no HTML** (`<span class="linha-mask"><span class="linha" style="--i:0">…</span></span>`) e anime por CSS (`@keyframes sobe { from { transform: translateY(110%) } }`, `animation: sobe 1.1s var(--ease-out) backwards; animation-delay: calc(.1s + var(--i) * .12s)`; use `backwards`, não `forwards`, para o GSAP poder mexer no `transform` depois). Medido: o `elementRenderDelay` do LCP era 1,47 s com SplitText atrás de fontes; cabe ao JS só o que vem depois (scroll, cursor, seções abaixo).
- **Fontes hospedadas no próprio site**: `node ~/.claude/skills/site-nivel-awwwards/scripts/baixar-fontes.mjs --familias "Playfair Display:ital@0;1,Inter,Jost" --saida ./public/fonts --preload "Playfair Display,Inter"` baixa só o subconjunto latin em woff2 (as 4 fontes do teste somaram 75 KB), gera `fonts.css` com `font-display: swap` e imprime os `<link rel="preload">`. Evita a cadeia de rede CSS → arquivo de fonte do Google (764 ms medidos) e **não envia o IP do visitante ao Google** (relevante para a LGPD). Sirva `.woff2` como `font/woff2` e com cache longo.
- **Lenis só com mouse**: em toque (`(pointer: coarse)`) o scroll nativo é melhor e poupa um laço de JavaScript por quadro.
- **SplitText por linhas só quando precisa**: divida por linhas apenas o que está perto da viewport (`IntersectionObserver` com `rootMargin`); por palavras é barato.
- **Fontes**: carregue por `<link rel="preconnect">` + `<link rel="stylesheet">` no `<head>` (o `montar-brief.mjs` gera `fontes.html`), nunca por `@import` no CSS. Evite `filter: drop-shadow` em elemento que gira ou rola: use um halo com `radial-gradient` atrás.
- **Armadilha da máscara**: o invólucro da linha (`<nome>-mask`, onde `<nome>` é o `linesClass`) usa `overflow: clip` e **corta os descendentes** (g, p, q, y) quando a entrelinha é < 1,1. Dê `linesClass: 'linha'` e acrescente `.linha-mask { padding-bottom: .16em; margin-bottom: -.16em; }`. O nome `maskClass` não existe nesta versão (3.15): inspecione o DOM em vez de supor.
- **Texto que se revela com o scroll** (manifesto): palavras de `opacity .15 → 1` com `scrub`:
```js
const p = SplitText.create('.manifesto', { type: 'words', aria: 'none' }); // aria:'none': o padrão põe aria-label em <p>, o que é proibido
gsap.fromTo(p.words, { opacity: .4 }, { opacity: 1, stagger: .05, ease: 'none',
  scrollTrigger: { trigger: '.manifesto', start: 'top 75%', end: 'bottom 40%', scrub: true } });
```
- Fonte variável + `font-variation-settings` no hover é um detalhe de acabamento barato.
- `text-wrap: balance` nos títulos; `hyphens: auto` no corpo; `font-display: swap` e pré-carregar a fonte do título.

## 2. Posicionamento e grade
- Grade de **12 colunas** com `--gutter` generoso (`clamp(1rem, 4vw, 4rem)`); conteúdo largo (até 1440 px), texto estreito (60–75 caracteres).
- **Assimetria deliberada**: título alinhado a uma coluna e imagem deslocada 1–2 colunas; blocos que **quebram a grade** (imagem sangrando até a borda, título sobrepondo a foto com `z-index` ou `mix-blend-mode: difference`).
- **Espaço vertical enorme** entre seções (`--space-section`: 4–12 rem). Densidade baixa é parte do visual premium.
- Mobile não é o desktop encolhido: refaça a composição (título menor mas ainda grande, uma coluna, imagem em proporção própria).

## 3. Imagens
- **Proporção reservada** (`aspect-ratio`) para evitar salto de layout (CLS); `object-fit: cover`.
- Formatos: AVIF/WebP com `srcset` e `sizes`; hero com `fetchpriority="high"`, o resto `loading="lazy"`.
- **Revelação com máscara** ao entrar na tela:
```js
gsap.fromTo('.img-reveal', { clipPath: 'inset(100% 0% 0% 0%)' },
  { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut', stagger: .15,
    scrollTrigger: { trigger: '.img-reveal', start: 'top 80%' } });
```
- **Paralaxe leve** (imagem maior que o contêiner, deslocada de −10% a +10%):
```js
gsap.fromTo('.parallax img', { yPercent: -10 }, { yPercent: 10, ease: 'none',
  scrollTrigger: { trigger: '.parallax', scrub: true } });
```
- Tratamento consistente: mesma temperatura de cor, mesmo recorte e mesma proporção nas galerias. Foto genérica de banco derruba o nível mais rápido que qualquer efeito.

## 4. Vídeo
- Hero/fundo: `<video autoplay muted loop playsinline preload="metadata" poster="poster.webp">` com **MP4 (H.264) e WebM** (AV1 primeiro, quando houver), 720p, ≤ 3 MB, sem áudio, loop sem emenda e **color grading igual ao da paleta e das fotos** (vídeo cinematográfico, não stock).
- Desligue em `prefers-reduced-motion`, em `navigator.connection.saveData` e em telas pequenas se pesar (mostre o `poster`).
- Vídeo é o recurso mais comum no One Page Love e o mais caro em dados: comprima (ffmpeg `-crf 28`, 24 fps) e carregue só quando visível (`IntersectionObserver`).
- Nunca dependa de player de terceiros (YouTube/Vimeo) na primeira dobra.

## 5. Scroll: seções fixadas, horizontal, snap
- **Seção fixada com troca de etapas** (storytelling):
```js
gsap.timeline({ scrollTrigger: { trigger: '.historia', pin: true, scrub: 1, end: '+=300%' } })
  .to('.passo-1', { opacity: 0 }).from('.passo-2', { opacity: 0, y: 40 })
  .to('.passo-2', { opacity: 0 }).from('.passo-3', { opacity: 0, y: 40 });
```
- **Rolagem horizontal** (galeria de trabalhos):
```js
const trilho = document.querySelector('.trilho');
gsap.to(trilho, { x: () => -(trilho.scrollWidth - innerWidth), ease: 'none',
  scrollTrigger: { trigger: '.horizontal', pin: true, scrub: 1, invalidateOnRefresh: true,
    end: () => '+=' + (trilho.scrollWidth - innerWidth) } });
```
Em celular, troque por carrossel nativo (`overflow-x: auto; scroll-snap-type: x mandatory`): fixar e rolar na horizontal em toque costuma brigar com a rolagem vertical.
- **Barra de progresso de leitura**: `scaleX` ligado ao scroll (`transform-origin: left`).
- `scroll-snap` só em carrosséis, não na página inteira.

## 6. Animação em geral
- **Um efeito de assinatura** (hero ou transição) + **um padrão de revelação** igual em todas as seções + microinterações discretas. Mais que isso vira ruído.
- **Curvas que os premiados mais usam**: `cubic-bezier(0.25, 1, 0.5, 1)` (easeOutQuart, entradas) e `cubic-bezier(0.76, 0, 0.24, 1)` (easeInOutQuart, transições). Durações: 200 ms (hover), 600–900 ms (revelação), ~1000 ms (transição de página).
- **Botão magnético**:
```js
const mover = gsap.quickTo(btn, 'x', { duration: .4, ease: 'power3' }), moverY = gsap.quickTo(btn, 'y', { duration: .4, ease: 'power3' });
btn.addEventListener('pointermove', e => { const r = btn.getBoundingClientRect(); mover((e.clientX - r.left - r.width / 2) * .3); moverY((e.clientY - r.top - r.height / 2) * .3); });
btn.addEventListener('pointerleave', () => { mover(0); moverY(0); });
```
- **Cursor próprio** (só desktop com ponteiro fino): `@media (pointer: fine)`; esconda o cursor nativo só onde o elemento seguidor existir.
```js
const cx = gsap.quickTo('.cursor', 'x', { duration: .25, ease: 'power3' }), cy = gsap.quickTo('.cursor', 'y', { duration: .25, ease: 'power3' });
addEventListener('pointermove', e => { cx(e.clientX); cy(e.clientY); });
```
- **Marquee** em CSS puro (conteúdo duplicado):
```css
.marquee { display: flex; width: max-content; animation: marquee 30s linear infinite; }
@keyframes marquee { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .marquee { animation: none; } }
```
- **Preloader**: curto (≤ 2,5 s), com contador ou palavra; só se houver o que carregar. Nunca bloqueie o conteúdo se o JS falhar.
- **Transição de página**: cobrir → navegar → revelar (Barba, View Transitions API ou rota do Next com camada animada).
- Anime só `transform` e `opacity`; `will-change` apenas durante a animação; pause canvas fora da tela.

## 7. Elementos 3D
Use somente se o conceito pede. Receita completa, orçamento e método testado em [3d-leve.md](3d-leve.md). Resumo: geometria em código, instanciamento, textura pequena, renderização sob demanda, plano B em imagem.

## 8. Acabamento que separa o nível
- Estados de hover/focus/active em **tudo** que é clicável; foco visível.
- Seleção de texto na cor do acento (`::selection`), barra de rolagem estilizada, favicon e imagem de compartilhamento (Open Graph) com identidade.
- Microcopy com personalidade (botões, erros, 404, rodapé).
- Celular **redesenhado**, não encolhido: no toque, troque hover e cursor por toque e, se o gesto pedir, por giroscópio (`deviceorientation`, com pedido de permissão no iOS e plano B parado).
- Teste em 1440, 768 e 390 px, em celular real **de gama média**, com rede lenta.

## 9. Desempenho no celular: o que mais pesou (medido no Grão Raro, Lighthouse móvel)
Resultado de partida: desktop 98, celular 64–67 (TBT ~2,4–3 s). Depois dos ajustes: celular 67–75 (varia entre rodadas), acessibilidade 100.
- **Divida o texto só quando a seção se aproxima** (`IntersectionObserver` + `SplitText`): dividir manifesto e títulos no carregamento gera estilo/layout caro. Mantenha o título do hero em CSS puro (linhas já no HTML).
- **Não use `text-rendering: optimizeLegibility` no `html`** com fonte serifada grande: em teste, tirá-lo reduziu as tarefas longas de ~1,8 s para ~0,2 s.
- **`content-visibility: auto` + `contain-intrinsic-size`** nas seções abaixo da dobra e sem pin (use a altura real medida, para a rolagem não pular). Não aplique em seção com `pin` do ScrollTrigger.
- **SVGs grandes decorativos** (grão, placas) pesam em CPU lenta: poucos, simples, sem filtros.
- **Fonte variável:** peça uma vez só; o Google repete o mesmo arquivo para cada peso (o `baixar-fontes.mjs` agora agrupa: 136 KB → 89 KB).
- **Opacidade mínima de texto que acende com a rolagem: .5** (com .35 o contraste de texto grande falhou, 3:1).
- Meça com a CPU 4× mais lenta e tarefas longas (`PerformanceObserver` `longtask`), bloqueando o `app.js` para separar "custo do JS" de "custo de HTML/CSS".
