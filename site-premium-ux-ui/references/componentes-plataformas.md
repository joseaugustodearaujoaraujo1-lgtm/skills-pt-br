# Catálogo de componentes das plataformas (por necessidade)

Verificado em 2026-11-16 nas páginas oficiais. **Regra da skill: todo site usa componentes ou transições destas plataformas** (adaptados aos tokens do projeto), e o relatório lista o que veio de onde. Sem login, conta ou compra; itens "Pro" ficam com o usuário.

- **reactbits.dev** (MIT + Commons Clause, grátis): `https://reactbits.dev/<categoria>/<slug>`. Categorias: `text-animations`, `animations`, `components`, `backgrounds`. Escolha JS ou TS, CSS ou Tailwind. Em HTML puro, use como **referência** e reescreva em JS/CSS/GSAP. Confira as dependências de cada página (alguns usam GSAP ou motion, outros OGL/three/WebGL).
- **transitions.dev** (core MIT, grátis; "Pro only" fica de fora): snippets CSS/React de microinterações.
- **naocodei.com** (grátis): motion em CSS e JS puro, catálogo em `base-design-completo/catalogo-naocodei.md`.
- **pinstack.app / tasteskill.dev**: só referência de estrutura e direção.

## Peso: escolha primeiro os leves
**Leves (CSS/JS/GSAP, bons para o celular):** Split Text, Blur Text, Scroll Reveal, Scroll Float, Scroll Velocity, Count Up, Shiny Text, Text Type, Magnet, Click Spark, Glare Hover, Noise, Gradual Blur, Logo Loop, Fade Content, Animated Content, Scroll Expand, Scroll Stack, Spotlight Card, Tilted Card, Pill Nav, Staggered Menu, Flowing Menu, Card Nav, Accordion Gallery, Magic Bento, Counter, Target Cursor, Image Trail, Border Glow.
**Pesados (WebGL, canvas, 3D):** quase todos os *Backgrounds* (Aurora, Plasma, Liquid Ether, Galaxy, Particles, Silk, Light Rays...), Fluid Glass, Morph Slider, Model Viewer, Dome Gallery, Infinite Menu, Splash Cursor, Metallic Paint, Ballpit, Lanyard. Use **no máximo um**, carregue tarde (depois do primeiro desenho), com pôster ou plano B e `prefers-reduced-motion` (ver `3d-leve.md` e `elementos.md` seção 9).

## Por necessidade
| Preciso de… | reactbits.dev | transitions.dev (grátis) |
|---|---|---|
| Título de hero que entra | Split Text, Blur Text, Masked Heading, Stroke Text, Fold Text, Shuffle | Texts reveal |
| Texto que acende na rolagem | Scroll Reveal, Scroll Float, True Focus | Streaming text, Shimmer text |
| Marquee e faixa de texto/logos | Scroll Velocity, Text Loop, Curved Loop, Logo Loop | |
| Números e contadores | Count Up, Counter | Spinning counter, Number pop-in, Number subtle change |
| Botão com vida | Magnet, Specular Button, Star Border, Glare Hover | Learn more hover |
| Cursor próprio | Target Cursor, Crosshair, Glow Cursor, Ghost Cursor, Blob Cursor, Text Cursor | |
| Imagens que reagem | Image Trail, Halftone Reveal, Dither Veil, Ripple Distortion, Grid Distortion, Decay Card | Image open tilt (Pro) |
| Galeria e portfólio | Accordion Gallery, Circular Gallery, Masonry, Flying Posters, Chroma Grid, Depth Carousel, Drift Wall | Card resize |
| Cards e vitrines | Tilted Card, Spotlight Card, Magic Bento, Holo Card, Pixel Card, Bounce Cards, Card Swap | 3D tilt |
| Trilho/stack na rolagem | Scroll Stack, Scroll Expand, Animated Content, Fade Content | |
| Menu e navegação | Pill Nav, Staggered Menu, Flowing Menu, Card Nav, Bubble Menu, Gooey Nav, Dock | Menu dropdown, Dropdown menu morph, Tabs sliding |
| Carrossel | Carousel, Stack, Circular Carousel, Morph Slider | |
| Fundo animado (um só, leve ou tarde) | Aurora, Soft Aurora, Dark Veil, Silk, Light Rays, Grainient, Dot Grid, Noise | Skeleton loader and reveal |
| Transição de página | | Page side-by-side |
| Formulário e feedback | Stepper, Elastic Slider | Error state shake, Success check, Checkbox check, Input clear with dissolve, Toggle, Toast open/close, Like button |
| Modal, painel, tooltip | Glass Surface | Modal open/close, Panel reveal, Tooltip open/close, Accordion |
| Borda e brilho | Border Glow, Electric Border, Star Border, Gradual Blur | |
| Loader e estados | | Matrix dot loader, Thinking states, Banner stacking |
| Objeto 3D do produto | Model Viewer, Fluid Glass, Crystalized Ball | |

**Pro only em transitions.dev (não usar sem o usuário ter o plano):** Confetti burst, Gooey plus menu, Card stack hover, Drag & drop with physics, Organic shimmer, Image open tilt, Spinner to check morph, Pro gradient text, Delete with smoky dissolve, Image generation placeholder, Get Pro button.

## Combinações prontas por tipo de página
| Tipo | Combinação sugerida (3 a 5 itens, coerentes entre si) |
|---|---|
| Vitrine de produto (café, joia, moda) | Split Text (hero) + Scroll Reveal (manifesto) + Tilted Card ou Magic Bento (produtos) + Count Up (números) + Magnet (botão) + Noise (textura) |
| Portfólio e galeria | Flowing Menu ou Pill Nav + Accordion Gallery ou Circular Gallery + Image Trail + Target Cursor + Page side-by-side |
| Produto digital (SaaS, app, IA) | Split Text + Magic Bento + Scroll Stack + Spotlight Card + Counter + Dark Veil ou Aurora (um fundo, tarde) |
| Institucional | Fade Content + Animated Content + Accordion + Count Up + Pill Nav |
| Editorial | Scroll Reveal + Scroll Float + Text Type (discreto) + Gradual Blur |
| Evento e experiência | Scroll Velocity + Scroll Expand + Particle Text ou Warp Text + Click Spark + Target Cursor |

## Como adaptar (sempre)
1. Pegue **uma** ideia por componente; não monte um "museu de efeitos".
2. Reescreva com os tokens do projeto (`--bg`, `--accent`, `--ease-out`, `--dur-*`).
3. Respeite `prefers-reduced-motion`, foco visível e alvo ≥ 44 px.
4. Meça o peso e o TBT (Lighthouse) depois de incluir.
5. Registre no relatório: componente, plataforma, URL e licença.
