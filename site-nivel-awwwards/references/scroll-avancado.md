# Scroll animado avançado (sugerir sempre, logo depois do 3D)

Regra da skill: **depois da decisão de 3D (ou de não ter 3D), sempre sugira um scroll animado extremamente sofisticado e avançado**, no nível dos sete sites de referência abaixo. O scroll é o "gesto de assinatura" da página: um só, bem acabado, ligado ao conceito. Não é adorno solto.

## Os 7 sites de referência (sinais medidos na base, 2026-11)
Medidos por `extrair-estrutura.mjs` (DOM, 1440 px). Os números são sinais objetivos; o efeito exato de cada um precisa ser **visto** (abra o site e a captura `desktop-scroll.jpg` antes de citá-lo ao usuário).

| Site | Altura da página | Seções | sticky / pin | Libs e mídia | Sinal dominante |
|---|---|---|---|---|---|
| [Era Residence](https://www.era-residence.com/) | 24 vh | 18 | 5 / 0 + scroll-snap | GSAP, ScrollTrigger, Lenis, Barba, SplitText, Lottie, 8 vídeos | seções em snap, transição de página (Barba), `mix-blend` 16, `clip-path` 22 |
| [Rectangles FM](https://rectangles.fm) | 14,7 vh | 6 | **9 / 1** | GSAP, ScrollTrigger, Lenis, Framer Motion, 2 canvas | pilha de cartões fixos (sticky) + pin, `mix-blend` 14, 22 imagens lazy |
| [Zentry](https://zentry.com/) | 15,7 vh | 9 | 5 / 0 | GSAP, ScrollTrigger, Lenis, **Three.js**, canvas hero, 15 vídeos, Rive, SplitText | hero WebGL, `clip-path` 11, vídeo ligado ao scroll, tipografia própria |
| [Tenztan](https://www.tenztan.in/) | 26,6 vh | 3 | 1 / **3** | GSAP, ScrollTrigger, Lenis, canvas hero, cursor customizado | 3 pins longos (cena que "dura" vários vh), gradiente 32, sombras 38 |
| [The Art of Cinema](https://www.theartofcinema.xyz/) | 22 vh | 11 | 1 / **3** + snap | GSAP, ScrollTrigger, Lenis, Next.js, SplitText, 62 imagens | pins com troca de imagem, texto dividido, `backdrop-filter` 12 |
| [Diego Liv](https://www.diegoliv.works/) | 25,3 vh | 13 | **26 / 0** + snap | GSAP, ScrollTrigger, Lenis, Webflow, canvas hero, 12 vídeos, 98 imagens | cada projeto é uma seção fixa que cobre a anterior, `filter` 56, `clip-path` 20 |
| [Collab Capitolium](https://www.collabcapitolium.fr/) | **35,5 vh** | 14 | **13 / 0** + snap | GSAP, ScrollTrigger, Lenis, Nuxt, 3 canvas, 11 vídeos (4 autoplay), 132 SVG | hero em vídeo, `clip-path` 55, `mix-blend` 43, preloader rotulado |

**DNA comum (7 de 7):** GSAP + ScrollTrigger + **Lenis** (rolagem suave com inércia). Em 6 de 7 há **sticky/pin** (a seção fica parada enquanto o conteúdo muda), em 5 de 7 **scroll-snap** ou seções em sequência, em 5 de 7 **canvas ou vídeo** como protagonista, e a página é **longa** (14 a 35 telas) com poucas seções grandes, não muitas pequenas.

## Os 7 padrões de scroll avançado (escolha UM de assinatura + no máximo dois de apoio)
1. **Pin + scrub de sequência** (Tenztan, Art of Cinema): a seção fixa por 300–600 vh; a rolagem controla uma linha do tempo (troca de imagem, texto que entra, objeto que gira). É o melhor casamento com o **3D**: a rolagem gira o objeto ou move a câmera.
2. **Pilha de seções sticky** (Diego Liv, Capitolium, Rectangles FM): cada seção `position: sticky; top: 0` cobre a anterior, que escurece e encolhe levemente. Muito bom para portfólio e vitrine.
3. **Revelação por `clip-path`** (Capitolium, Zentry, Era): a imagem ou vídeo "abre" de uma forma (retângulo → tela cheia, círculo, polígono) conforme a rolagem. Só `clip-path` e `transform`, GPU.
4. **Vídeo ou canvas controlado pela rolagem** (Zentry, Capitolium): o tempo do vídeo (ou o quadro de uma sequência) segue o scroll (`scrub`). Exige vídeo curto, comprimido e com pôster.
5. **Texto que acende palavra a palavra** (Art of Cinema, Era): `SplitText` com opacidade de .5 a 1 ligada à rolagem. Mantenha contraste 3:1 mesmo no estado apagado.
6. **Trilho horizontal dentro da vertical** (starter da skill): a seção fixa e o conteúdo anda para o lado (só ≥ 861 px; no celular vira carrossel com snap).
7. **Transição entre seções ou páginas** (Era, Barba): máscara ou cortina que troca de cena. Use `transitions.dev` e `reactbits.dev` como ponto de partida.

## A sugestão (sempre apresentar assim)
Depois do 3D, pergunte **"Qual scroll animado?"** com a primeira opção "(Recomendado)" ligada ao tema e ao 3D escolhido, mais duas alternativas e "Outro". Mostre os sites de referência **com link clicável** ao lado de cada padrão (use os 7 acima ou sites do ranking `pesquisar-referencias.mjs --recursos scroll`).

| Situação | Recomendado |
|---|---|
| Há objeto 3D | **Pin + scrub**: a rolagem gira o objeto e muda o texto ao lado (padrão 1, ligado ao 3D) |
| Portfólio, galeria, vitrine de vários itens | **Pilha sticky** (padrão 2) com `clip-path` na imagem (padrão 3) |
| Produto com história (café, joia, vinho) | **Pin + scrub de sequência** com texto que acende (padrões 1 e 5) |
| Institucional, evento, editorial | **Revelação por clip-path** + texto que acende (padrões 3 e 5) |
| Há vídeo curto próprio | **Vídeo ligado ao scroll** (padrão 4) |

## Receitas (GSAP 3.15 + ScrollTrigger + Lenis)

### Lenis ligado ao ScrollTrigger (base de tudo; só com mouse)
```js
const fino = matchMedia('(pointer: fine)').matches;
if (fino && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
}
```

### 1. Pin + scrub de sequência com 3D
```js
const tl = gsap.timeline({ scrollTrigger: { trigger: '#palco', start: 'top top', end: '+=400%', scrub: 1, pin: true, anticipatePin: 1 } });
tl.to(objeto3d.rotation, { y: Math.PI * 2, ease: 'none' }, 0)          // a rolagem gira o objeto
  .to('.passo-1', { opacity: 1, y: 0 }, 0.05).to('.passo-1', { opacity: 0 }, 0.30)
  .to('.passo-2', { opacity: 1, y: 0 }, 0.35).to('.passo-2', { opacity: 0 }, 0.60)
  .to('.passo-3', { opacity: 1, y: 0 }, 0.65);
// quando o 3D é WebGL sob demanda: onUpdate: () => pedir()   (ver 3d-leve.md, seção 7)
```
Texto de cada passo em `position:absolute` dentro do palco; **o conteúdo continua no HTML** (acessível e indexável).

### 2. Pilha sticky
```css
.pilha > section { position: sticky; top: 0; min-height: 100svh; }
```
```js
gsap.utils.toArray('.pilha > section').forEach((s, i, tudo) => {
  if (i === tudo.length - 1) return;
  gsap.to(s, { scale: .94, filter: 'brightness(.55)', ease: 'none',
    scrollTrigger: { trigger: tudo[i + 1], start: 'top bottom', end: 'top top', scrub: true } });
});
```
Evite `filter` caro em tela cheia no celular: troque por uma camada `::after` com opacidade.

### 3. Revelação por clip-path
```js
gsap.fromTo('.revela', { clipPath: 'inset(18% 22% 18% 22% round 24px)' },
  { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
    scrollTrigger: { trigger: '.revela', start: 'top 85%', end: 'top 20%', scrub: true } });
gsap.fromTo('.revela img', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.revela', start: 'top 85%', end: 'top 20%', scrub: true } });
```

### 4. Vídeo ligado à rolagem
```js
const v = document.querySelector('#sequencia'); v.pause();
v.addEventListener('loadedmetadata', () => {
  gsap.to(v, { currentTime: v.duration, ease: 'none',
    scrollTrigger: { trigger: '#palco', start: 'top top', end: '+=300%', scrub: true, pin: true } });
});
```
Requisitos: vídeo curto (≤ 8 s), **mp4 H.264 com keyframes frequentes** (`ffmpeg -g 5`), `muted playsinline preload="auto"`, pôster, ≤ 2 MB. Alternativa mais leve e precisa: sequência de 60–120 quadros WebP desenhados em `<canvas>` por índice.

### 5. Texto que acende
Use a receita do starter (`quandoPerto` + `SplitText type: 'words'`, opacidade de `.5` a `1`, `scrub`). Só divida o texto quando a seção se aproxima.

## Regras de qualidade (medidas em testes anteriores)
- **Um scroll de assinatura** por página. Os outros efeitos são discretos. Mais de 3 pins longos cansam e atrapalham o celular.
- **Só `transform`, `opacity` e `clip-path`**; nada de animar `width`, `top`, `box-shadow`. Evite `filter` e `mix-blend` em tela cheia no celular.
- **Celular:** sem Lenis (rolagem nativa), pins mais curtos (`end: '+=200%'`), sem vídeo em scrub (troque por imagem + fade) e `ScrollTrigger.matchMedia` para versões separadas.
- **Movimento reduzido (`prefers-reduced-motion`)**: sem pin nem scrub; mostre o estado final, tudo legível.
- **Conteúdo sempre no HTML** (texto real, `alt` nas imagens, 1 `<h1>`); o scroll só o revela.
- **Desempenho:** crie os `ScrollTrigger` depois de `document.fonts.ready`, chame `ScrollTrigger.refresh()` após carregar imagens, use `invalidateOnRefresh`, e meça com Lighthouse (meta 90 desktop, 75 celular) e CPU 4× mais lenta. Páginas longas pedem `content-visibility: auto` nas seções **sem pin e só depois do último pin**: numa seção antes de um pin, a altura estimada (`contain-intrinsic-size`) muda quando ela renderiza e desloca o início e o fim do pin (testado na cafeteria, 2026-11-21: o título seguinte invadia a seção fixa).
- **Teste de rolagem real:** role a página inteira em 3 larguras (1440, 768, 390) e confirme que nada fica preso, cortado ou sobreposto; o verificador (`verificar-site.mjs`) captura o estado final e o inicial.

## Direitos
Estudar a técnica dos sites de referência é permitido; **copiar** layout, texto, imagens, vídeo, fonte ou código não. A sua versão usa conteúdo, forma e movimento próprios.
