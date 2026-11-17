# Padrões que se repetem nos sites premiados

Gerado por `node scripts/gerar-padroes.mjs` em 2026-11-17 a partir de **449 sites** do acervo com coleta estrutural (Awwwards 146, One Page Love 303). Medido (versão 3 da coleta) com o navegador em 1440×900, depois de 6 s de espera (preloader) e com 1 rolagem de teste.

**Como ler:** ≥ 80% = quase universal (trate como regra); 50–79% = padrão forte; 20–49% = escolha comum; < 10% = raro (evite sem motivo). O One Page Love inclui muitos sites simples; o Awwwards representa o topo. Detecção por heurística: confirme visualmente em caso de dúvida.

## 1. Estrutura e navegação

| Característica | Awwwards (n=146) | One Page Love (n=303) |
|---|---|---|
| Tem menu no topo | 51% | 50% |
| Menu fixo (fica ao rolar) | 36% | 35% |
| Menu com hambúrguer no desktop | 20% | 5% |
| Links do menu em caixa alta | 16% | 9% |
| Menu transparente (sobre o hero) | 38% | 35% |
| Tem preloader/intro cobrindo a tela | 42% | 34% |
| Preloader com contador/porcentagem | 8% | 5% |
| Cursor próprio | 13% | 13% |
| Tem rodapé (<footer>) | 51% | 60% |
| Rolagem virtual (documento travado, conteúdo maior) | 10% | 7% |

| Medida (mediana) | Awwwards (n=146) | One Page Love (n=303) |
|---|---|---|
| Links no menu | 5 | 4 |
| Altura do menu (px) | 80 | 72 |
| Altura da página (telas) | 4.2 | 9.5 |
| Seções | 4 | 7 |
| Palavras na página | 175 | 459 |
| Padding vertical das seções (px) | 80 | 84 |
| Maior texto do rodapé (px) | 17 | 18 |

## 2. Hero (primeira dobra)

| Característica | Awwwards (n=146) | One Page Love (n=303) |
|---|---|---|
| Fundo/mídia em vídeo | 12% | 7% |
| Canvas/WebGL no hero | 43% | 21% |
| Imagem grande no hero | 16% | 23% |
| Título em caixa alta | 34% | 23% |
| Título com fonte serifada | 8% | 9% |
| Título centralizado | 40% | 39% |
| Título com tracking negativo | 23% | 51% |
| Título grande (≥ 72 px) | 25% | 38% |
| Título gigante (≥ 120 px) | 14% | 19% |

**Só heros guiados por tipografia** (sem canvas nem vídeo; Awwwards n=69, One Page Love n=217):

| Medida (mediana) | Awwwards (n=69) | One Page Love (n=217) |
|---|---|---|
| Tamanho do título (px) | 48 | 61 |
| Título em % da largura da tela (vw) | 3.3 | 4.2 |
| Palavras no título | 2 | 3 |
| Heros com título ≥ 72 px (%) | 30 | 39 |

| Medida (mediana) | Awwwards (n=146) | One Page Love (n=303) |
|---|---|---|
| Tamanho do título (px) | 40 | 58 |
| Título em % da largura da tela (vw) | 2.8 | 4 |
| Palavras no título | 2 | 2 |
| Entrelinha do título | 1.08 | 1.05 |
| Tracking do título (em) | 0 | -0.01 |
| Peso do título | 400 | 400 |
| Botões na primeira dobra | 1 | 0 |

Distribuição do título (px): 25% ≤ 20 · 75% ≤ 72 no Awwwards; 25% ≤ 22 · 75% ≤ 101 no One Page Love.

## 3. Rolagem e movimento

| Característica | Awwwards (n=146) | One Page Love (n=303) |
|---|---|---|
| Scroll suave (Lenis) | 16% | 28% |
| Scroll suave (Locomotive) | 1% | 1% |
| Seção fixada (pin do ScrollTrigger) | 5% | 6% |
| Elementos sticky (2 ou mais) | 15% | 27% |
| Carrossel/slider | 27% | 20% |
| scroll-snap em algum elemento | 21% | 24% |
| Marquee/ticker | 34% | 50% |
| Respeita prefers-reduced-motion (CSS) | 24% | 39% |

| Medida (mediana) | Awwwards (n=146) | One Page Love (n=303) |
|---|---|---|
| Animações ativas na página | 1 | 2 |

**Durações de transição mais comuns (ms)**: Awwwards 300, 200, 500, 400 · One Page Love 200, 300, 150, 250.

**Curvas mais comuns**: Awwwards `ease`, `linear`, `cubic-bezier(0.19,1,0.22,1)`, `ease-out`, `cubic-bezier(0.165,0.84,0.44,1)` · One Page Love `ease`, `cubic-bezier(0.4,0,0.2,1)`, `ease-out`, `ease-in-out`, `linear`.

## 4. Mídia

| Característica | Awwwards (n=146) | One Page Love (n=303) |
|---|---|---|
| Usa <video> | 34% | 42% |
| Vídeo com autoplay | 14% | 24% |
| Usa <canvas> | 55% | 36% |
| Imagens com loading="lazy" | 28% | 62% |
| Imagens com srcset | 29% | 52% |
| Usa iframe (embed) | 39% | 26% |

| Medida (mediana) | Awwwards (n=146) | One Page Love (n=303) |
|---|---|---|
| Imagens (<img>) | 13 | 23 |
| SVGs inline | 11 | 9 |
| Vídeos | 0 | 0 |

## 5. Forma e efeitos

| Característica | Awwwards (n=146) | One Page Love (n=303) |
|---|---|---|
| Botões em pílula (maioria arredondada total) | 28% | 33% |
| Usa backdrop-filter (vidro) | 13% | 44% |
| Usa mix-blend-mode | 34% | 46% |
| Usa clip-path (máscaras) | 50% | 61% |
| Usa gradientes | 43% | 54% |
| Texto com gradiente (background-clip: text) | 6% | 6% |
| Usa filtros (blur etc.) | 34% | 61% |
| Usa sombras (box-shadow) | 52% | 66% |
| Usa display: grid | 47% | 75% |

| Medida (mediana) | Awwwards (n=146) | One Page Love (n=303) |
|---|---|---|
| Raio dos cartões (px) | 16 | 16 |
| Largura máxima do conteúdo (px) | 900 | 800 |

## 6. Texto corrido

| Medida (mediana) | Awwwards (n=146) | One Page Love (n=303) |
|---|---|---|
| Tamanho do corpo (px) | 16 | 16 |
| Entrelinha do corpo | 1.33 | 1.4 |
| Subtítulos h2 | 4 | 4 |
| Subtítulos h3 | 1 | 4 |

## 7. Regras derivadas (Awwwards)

- **Canvas/WebGL**: 55% (padrão forte).
- **Máscaras (clip-path)**: 50% (padrão forte).
- **Preloader/intro**: 42% (escolha comum).
- **Menu fixo no topo**: 36% (escolha comum).
- **Marquee**: 34% (escolha comum).
- **Vídeo**: 34% (escolha comum).
- **mix-blend-mode**: 34% (escolha comum).
- **Título em caixa alta**: 34% (escolha comum).
- **Botões em pílula**: 28% (escolha comum).
- **prefers-reduced-motion**: 24% (escolha comum).
- **Scroll suave (Lenis)**: 16% (minoria).
- **Cursor próprio**: 13% (minoria).
- **Vidro (backdrop-filter)**: 13% (minoria).
- **Seção fixada**: 5% (raro).

## 8. O que isso significa para o design

- **Título gigante é escolha, não regra**: só ~25% (Awwwards) e ~37% (One Page Love) têm título de 72 px ou mais na primeira dobra, e 13–16% passam de 120 px. Nos heros de WebGL (42% no Awwwards) o texto é mínimo e o protagonista é a cena.
- O "maior texto da página" (mediana ~70 px no Awwwards, 75% até ~150 px; skill `identidade-visual`) costuma aparecer em **outra seção** (manifesto, rodapé, números), não no hero.
- Quase todo site premiado **escolhe um protagonista** na primeira dobra: tipografia, cena 3D/canvas, imagem ou vídeo. Escolha o seu e deixe o resto em segundo plano.

## 9. Como usar

- Trate "quase universal" como **requisito de nível** (ex.: menu fixo, scroll suave) e "raro" como **risco** (justifique se usar).
- Para cada recurso que você quiser (preloader, cursor, pin, marquee), peça referências com `pesquisar-referencias.mjs --recursos ...` e abra as capturas.
- Os números descrevem o que existe, não o que ganha prêmio: use junto da [rubrica](rubrica.md) e do conceito do projeto.

**Limites:** detecção por heurística de DOM (um preloader pode ser perdido se terminar antes de 0,9 s; um menu pode ser confundido com cabeçalho); sites com WebGL pesado podem ter menos medições; amostra do One Page Love limitada aos mais recentes.
