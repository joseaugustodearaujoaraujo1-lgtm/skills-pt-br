# Padrões de UX/UI da base (medidos em 830 sites válidos)

Gerado por `scripts/gerar-padroes-ux.mjs` em 2026-11-19. Amostra: **122 do Awwwards** e **708 do One Page Love** com estrutura medida (113 descartados por erro, bloqueio ou pouca informação). Porcentagem = sites da base que têm o recurso na página inicial (detecção por DOM, bibliotecas e CSS em 1440 px); **não prova que o efeito é bom**, só que é comum. "Maioria" = acima de 50%.

**Medianas da página:** 9.1 telas de altura (Awwwards e OPL juntos), 7 seções, 433 palavras, 2 famílias de fonte. Os 7 sites de scroll avançado de `scroll-avancado.md` têm 14 a 35 telas: são **exceção** (nível máximo), não a regra.

## Scroll

| Recurso | Todos | Awwwards | One Page Love |
|---|---|---|---|
| Seção sticky | 40% | 30% | 41% |
| ScrollTrigger | 32% | 45% | 30% |
| Scroll-snap | 24% | 25% | 24% |
| Lenis (rolagem suave) | 22% | 21% | 22% |
| Pin (ScrollTrigger) | 5% | 6% | 5% |
| Locomotive | 3% | 5% | 3% |

## 3D e canvas

| Recurso | Todos | Awwwards | One Page Love |
|---|---|---|---|
| Canvas (qualquer) | 29% | 50% | 26% |
| Hero com canvas/WebGL | 19% | 41% | 15% |
| Three.js/WebGL | 18% | 32% | 15% |
| Rive | 2% | 5% | 2% |

## Mídia

| Recurso | Todos | Awwwards | One Page Love |
|---|---|---|---|
| Vídeo | 37% | 34% | 37% |
| SVG abundante (≥20) | 31% | 42% | 29% |
| Lottie | 24% | 20% | 24% |
| Hero com imagem grande | 23% | 18% | 24% |
| Vídeo autoplay | 22% | 16% | 23% |
| Hero com vídeo | 11% | 15% | 10% |

## Animação e movimento

| Recurso | Todos | Awwwards | One Page Love |
|---|---|---|---|
| Marquee | 40% | 35% | 41% |
| GSAP | 38% | 57% | 35% |
| Swiper/carrossel | 33% | 45% | 31% |
| Preloader | 31% | 45% | 29% |
| prefers-reduced-motion | 30% | 28% | 31% |
| Barba (transição de página) | 15% | 26% | 13% |
| SplitText | 13% | 24% | 11% |
| Cursor customizado | 13% | 12% | 13% |
| Framer Motion | 9% | 1% | 11% |

## Efeitos visuais

| Recurso | Todos | Awwwards | One Page Love |
|---|---|---|---|
| Sombra | 62% | 60% | 63% |
| clip-path | 54% | 54% | 54% |
| Gradiente | 52% | 45% | 53% |
| filter (blur/brilho) | 50% | 39% | 52% |
| mix-blend-mode | 40% | 37% | 41% |
| backdrop-filter (vidro) | 32% | 14% | 35% |
| Texto em gradiente | 8% | 6% | 9% |

## Menu, hero e tipografia

| Recurso | Todos | Awwwards | One Page Love |
|---|---|---|---|
| Grid CSS | 64% | 55% | 65% |
| Botão pílula | 44% | 37% | 45% |
| Menu transparente | 39% | 43% | 39% |
| Título ≥ 72 px | 39% | 28% | 41% |
| Tracking negativo no título | 39% | 26% | 41% |
| Menu fixo | 36% | 41% | 35% |
| Título em CAIXA ALTA | 23% | 34% | 21% |
| Menu hambúrguer no desktop | 10% | 23% | 8% |
| Título serifado | 10% | 7% | 11% |

## Curvas e durações de transição (mais usadas)

- Curvas (nº de sites): `ease` (506), `ease-in-out` (173), `cubic-bezier(0.4,0,0.2,1)` (139), `ease-out` (131), `linear` (118), `cubic-bezier(0.22,1,0.36,1)` (46).
- Durações em ms (nº de sites): `300` (393), `200` (364), `500` (243), `150` (214), `400` (176), `250` (147).
- Leitura: a maioria usa `ease` e 200–500 ms; o acabamento "premium" aparece em curvas `cubic-bezier(.19,1,.22,1)` (expo-out) e `cubic-bezier(.22,1,.36,1)`.

## Como usar
- O que passa de 50% é **expectativa do público** (grid, sombra suave, clip-path, gradiente): fazer sem destaque.
- O que está entre 20% e 50% é **diferencial de linguagem**: escolha com propósito (sticky, marquee, mix-blend, preloader, scroll-snap, Lenis, canvas).
- O que está abaixo de 20% é **assinatura rara** (Three.js em hero, pin longo, Barba, SplitText, cursor customizado): use um, bem feito.
- Diferença entre as bases: o Awwwards usa muito mais **GSAP, ScrollTrigger, preloader, canvas/WebGL, Barba e SplitText**; o One Page Love usa mais **sticky, vidro (`backdrop-filter`), vídeo autoplay, títulos grandes e grid**.
