# Etapa 2 — Design do sistema

**Objetivo:** definir *como* o sistema funciona e *como* ele se apresenta, antes de programar. Cobre arquitetura, dados, experiência do usuário, identidade visual (logo e ativos-chave), motion e mídia.

**Entrada:** `docs/01-requisitos.md` aprovado. **Saída:** `docs/02-design/` aprovado.

## 2.1 Arquitetura proporcional

1. **Escolha o menor desenho que atende os RNF.** Monólito modular costuma bastar para MVP; microsserviços só com justificativa concreta.
2. **Compare até 3 opções** (ex.: Next.js + API Express; Next.js com rotas de API; backend gerenciado) em simplicidade, custo, segurança, manutenção e desempenho. Recomende uma e registre o ADR.
3. **Diagrama de contexto e de containers** (texto/Mermaid): front, API, banco, cache, fila, provedores externos, CDN/WAF.
4. **Ambientes:** local, staging e produção, com variáveis separadas. Staging é onde o teste de carga (Etapa 7) acontecerá.

## 2.2 Modelo de dados

- Entidades, relacionamentos, chaves, índices e restrições (`NOT NULL`, `UNIQUE`, `CHECK`, FKs).
- Separe **identidade** (usuário, credenciais) de **perfil** e de dados sensíveis, para reduzir exposição.
- Marque colunas com dados pessoais e a retenção; planeje **exclusão/anonimização** (soft delete não basta para pedido de eliminação).
- Valores monetários em **inteiros (centavos)** ou `NUMERIC`, nunca `float`.
- Auditoria: tabela de eventos (quem, o quê, quando, de onde) sem gravar dados sensíveis.
- Migrações versionadas e reversíveis.

## 2.3 Fluxos e telas

- **Mapa do site / navegação** e **fluxos principais** (cadastro, login, busca, carrinho, checkout, pós-venda).
- Para cada tela: objetivo, dados exibidos, ações, estados (carregando, vazio, erro, sucesso, sem permissão).
- **Wireframes de baixa fidelidade** antes do visual final; valide com o usuário. O layout de alta fidelidade só começa depois da logo e dos ativos-chave aprovados (2.4).

## 2.4 Identidade e ativos-chave (antes do layout completo)

**Regra:** o layout de alta fidelidade só começa depois que o usuário aprovar a **logo** e os **ativos-chave** abaixo. Eles definem paleta, forma, tom e movimento; os tokens da seção 2.5 derivam deles. Wireframes de baixa fidelidade (seção 2.3) podem existir antes.

### 2.4.1 Logo do sistema

**Entrada:** nome, essência do produto, público e tom (vem da Etapa 1). **Saída:** `docs/02-design/identidade.md` e `assets/brand/` (SVG).

**Direção visual de referência: inovadora e futurista.** Ícone de app em formato *squircle* (quadrado de cantos muito arredondados) sobre fundo escuro quase preto, com **um glifo/monograma geométrico branco ou claro**, minimalista e construído em grade, e **um único acento luminoso** (ex.: verde-menta `#3DF2A0` ou violeta `#7C5CFF`) que nasce como brilho em degradê na borda inferior do ícone. Opcional: um pequeno detalhe geométrico (ponto ou quadrado) na cor do acento. Fundo da apresentação com *glow* suave do acento nos cantos. Use isso como **inspiração de qualidade e atmosfera, nunca copie uma marca existente**.

Processo:

1. **Brief:** nome, o que o sistema faz em uma frase, 3 adjetivos de marca, cores proibidas, onde a logo aparece (header, favicon, app, redes, documentos).
2. **Três conceitos** distintos (ex.: monograma, símbolo abstrato, letra reinventada) com a justificativa de cada um e recomendação de um.
3. **Gere as explorações** com IA usando o prompt estruturado abaixo (e os comandos de realismo e a estrutura de `references/media-prompts.md`).
4. **Refine e vetorize:** logo gerada por IA é só exploração. Redesenhe em **SVG limpo** (poucas formas, curvas suaves, sem texto rasterizado), em grade, e valide em 16, 32 e 64 px.
5. **Entregue as variações:** ícone (squircle), símbolo sozinho, versão horizontal com nome, monocromática (clara e escura), favicon (16/32/48), ícone *maskable* com margem de segurança e versão para fundo claro e escuro.
6. **Regras de uso:** área de respiro, tamanho mínimo, o que não fazer (distorcer, trocar cor, aplicar sombra).

Prompt de exemplo (ajuste nome, letra e acento):

```
/8k /ultra-detailed /sharp-focus /flat-vector-look /minimalist /futuristic
App icon logo for "<NOME>", a rounded-square (squircle) tile on a near-black
background (#0B0B0F), a single bold geometric monogram "<LETRA>" in clean white,
built on a grid with sharp cuts and one small accent square, a soft glowing
gradient of <ACENTO #3DF2A0> rising from the bottom edge inside the tile,
subtle ambient glow in the background corners, centered composition, high
contrast, premium, innovative, front view, no perspective.
Negative: extra text, tiny details, gradients with many colors, 3D bevel,
stock-icon look, existing brand logos, watermark, mockup, hands, photo background.
```

**Direito e marca:** verifique semelhança com marcas existentes e busque o nome no INPI antes de adotar a logo; não use imagens de referência como base direta. Consulte `dev-legal-compliance-br` (propriedade intelectual e conteúdo de IA). Se a logo vier de IA, registre que ela precisa de desenho próprio para ser vetorizada e protegida.

### 2.4.2 Ícones importantes

- Escolha **uma biblioteca** coerente (ex.: Lucide ou Phosphor) para todo o sistema e liste os ícones de navegação, ações, estados e status que serão usados.
- Desenhe **de 3 a 6 ícones próprios** só onde a marca precisa de identidade (ex.: categoria principal, empty state, conquista), no mesmo traço da biblioteca.
- Especificação única: grade 24 px, traço 1,5–2 px, cantos e pontas padronizados, tamanhos 16/20/24, cor por token (`currentColor`).
- Entregue como SVG (sprite ou componentes). Ícone sozinho precisa de `aria-label`; decorativo leva `aria-hidden="true"`.

### 2.4.3 Componentes 3D (só se o site tiver)

Decida se o 3D **justifica o peso**: ele deve explicar ou vender algo (produto, hero, visualização de dados), não só enfeitar. Para cada peça 3D, especifique:

- **Objeto, ângulos, iluminação, materiais e paleta** (coerentes com o acento da logo) e a **interação** (rotação no hover ou no scroll, zoom, estados).
- **Formato e orçamento:** glTF/GLB com compressão (Draco ou Meshopt, texturas KTX2/WebP), alvo de **≤ 1–2 MB** por modelo.
- **Tecnologia proporcional:** `<model-viewer>` para um objeto simples; Three.js/React Three Fiber para cenas interativas; alternativa leve: **renders pré-gerados** (WebP/AVIF ou vídeo curto) ou CSS 3D.
- **Carregamento e fallback:** *poster* estático imediato, carregamento tardio (nunca bloquear o LCP), pausa fora da viewport, limite de *pixel ratio*, fallback sem WebGL e versão estática com `prefers-reduced-motion`. Texto essencial permanece no HTML e a imagem tem `alt`.

### 2.4.4 Motions principais

Liste cada animação do sistema numa tabela em `docs/02-design/motion.md`:

| Motion | Gatilho | Duração | Easing | Propriedades | Fallback |
|---|---|---|---|---|---|
| Revelação da logo / loader | carregamento | 600–900 ms | ease-out | transform, opacity | logo estática |
| Hover/press de botões e cards | interação | 150–250 ms | ease-out | transform, opacity | sem animação |
| Transição entre páginas ou seções | navegação | 300–500 ms | ease-in-out | transform, opacity | corte direto |
| Microinterações (toast, toggle, validação) | evento | 150–300 ms | ease-out | transform, opacity | troca instantânea |
| Narrativa por scroll (se houver) | scroll | relativa ao scroll | linear/scrub | transform, opacity | estado final estático |

Regras: anime só `transform` e `opacity`; uma ideia por movimento; nada piscando mais de 3 vezes por segundo; respeite `prefers-reduced-motion`. O scrollytelling detalhado segue a seção 2.6.

### 2.4.5 Ficha dos ativos-chave e portão

Entregue em `docs/02-design/identidade.md` uma ficha com: logo (conceito escolhido e variações), paleta derivada, ícones (biblioteca e customizados), peças 3D (se houver), tabela de motions e o que **ficou de fora do MVP**. **Peça aprovação do usuário** antes de partir para o layout de alta fidelidade e para os briefs de mídia.
## 2.5 Design system com tokens (tema claro e escuro)

Parta da paleta e do acento da logo (2.4). Defina tokens como variáveis CSS no `:root` e redefina para o escuro com `[data-theme="dark"]` e `@media (prefers-color-scheme: dark)`.

Conjunto mínimo:

```
--bg, --surface, --surface-raised, --surface-sunken
--text, --text-muted, --text-on-accent
--accent, --accent-strong, --accent-soft
--success, --warning, --danger, --info
--border, --focus-ring
--shadow-light, --shadow-dark        (para neumorfismo)
--radius-sm/md/lg, --space-1..8, --font-sans, --font-display
```

Regras:

- **Contraste (WCAG 2.2 AA):** texto normal ≥ 4,5:1; texto grande e ícones/controles ≥ 3:1; foco visível ≥ 3:1. Meça com ferramenta, não a olho.
- **Cores acentuadas em ambos os temas:** teste o `--accent` sobre `--bg` e `--surface` nos dois temas; ajuste luminosidade, não só o matiz.
- **Tipografia:** no máximo 2 famílias; escala modular; `clamp()` para fluida; linha de 60–75 caracteres.
- **Espaçamento:** escala de 4/8 px.

### Estilo neumórfico (se escolhido)

Neumorfismo = superfícies "extrudadas" com sombra clara e escura sobre fundo de mesma cor. É bonito, mas tem riscos de acessibilidade:

- Bordas e sombras **sozinhas** não bastam para indicar limites e estados; adicione borda sutil, cor de acento e ícones.
- Em botões e campos, use **acento saturado** para o estado ativo/foco/primário (o azul vibrante do botão de login é um bom padrão).
- Use sombras em duas camadas (clara/escura) com *blur* moderado; reduza intensidade no tema escuro para evitar "sujeira".
- Nunca use neumorfismo para texto de baixo contraste; mantenha AA.
- Limite o efeito a superfícies principais (cards, botões, inputs). Páginas inteiras em relevo cansam e prejudicam a hierarquia.

## 2.6 Scrollytelling e motion com GSAP

**Quando usar:** onboarding, narrativa de produto, apresentação de categorias. Não use em fluxos críticos (checkout, formulários longos).

Princípios:

1. **Uma ideia por cena.** Cada "capítulo" tem uma mensagem, um objeto principal e uma transição.
2. **Estrutura:** `gsap.registerPlugin(ScrollTrigger)`; uma `timeline` por capítulo com `scrollTrigger: { trigger, start, end, scrub: true|0.5, pin: true }`.
3. **Vídeo controlado por scroll:** para suavidade, codifique o vídeo com *keyframes* frequentes (ex.: `-g 12` no ffmpeg) e atualize `video.currentTime` em `onUpdate`; alternativa: sequência de imagens em `<canvas>` (mais pesada) ou transformações CSS/SVG sobre uma imagem estática (mais leve).
4. **Só anime `transform` e `opacity`.** Evite animar `width/height/top/left`.
5. **`gsap.matchMedia()`** para versões desktop/mobile e para `prefers-reduced-motion: reduce` (desligue *scrub*, pin e parallax; mostre estados finais).
6. **Carregamento:** `preload="metadata"` ou `none`, `poster` leve, `playsinline muted`; carregue GSAP via módulo; evite bloquear LCP com o vídeo.
7. **Cleanup** em SPA (React): `useGSAP`/`gsap.context()` e `ctx.revert()` ao desmontar.
8. **Acessibilidade:** conteúdo textual essencial no HTML (não só em canvas/vídeo); navegação por teclado preservada; sem pin que "prenda" o usuário; botão "Pular introdução".

Esqueleto:

```js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  const video = document.querySelector('#hero-video');
  video.pause();
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '#story', start: 'top top', end: '+=300%', scrub: 0.6, pin: true },
  });
  video.addEventListener('loadedmetadata', () => {
    tl.fromTo(video, { currentTime: 0 }, { currentTime: video.duration, ease: 'none' }, 0);
  });
  tl.from('.chapter-1', { autoAlpha: 0, y: 40 }, 0.05)
    .to('.chapter-1', { autoAlpha: 0, y: -40 }, 0.30)
    .from('.chapter-2', { autoAlpha: 0, y: 40 }, 0.35);
});
mm.add('(prefers-reduced-motion: reduce)', () => {
  gsap.set('.chapter', { autoAlpha: 1, y: 0 }); // versão estática
});
```

Documente em `docs/02-design/motion.md`: capítulos, mensagem de cada um, gatilhos, durações relativas, fallback.

## 2.7 Briefs de mídia (imagens e vídeos gerados por IA)

Use `references/media-prompts.md`. Entregue: lista de ativos (nome, uso, proporção, peso máximo), prompt estruturado, descrição da cena, e comandos de compressão. **Meta de peso:** vídeos curtos de fundo ≤ ~1,4 MB; imagens em WebP/AVIF, tipicamente ≤ 150 KB.

## 2.8 Orçamento de performance e SEO

- Core Web Vitals: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 (mobile, 4G simulado).
- JS inicial ≤ ~170 KB gzip na primeira dobra; fontes com `font-display: swap`; imagens com `width/height`, `loading="lazy"` e `srcset`.
- Metadados, `sitemap.xml`, `robots.txt`, dados estruturados (`Product`, `Organization`) em lojas.
- Imagens decorativas com `alt=""`; imagens informativas com `alt` descritivo.

## 2.9 Segurança e privacidade no design

- Telas de login, recuperação e cadastro sem enumeração de usuário.
- Consentimento granular (cookies, marketing) com opção de recusar tão visível quanto a de aceitar.
- Páginas e componentes jurídicos previstos: política de privacidade, termos, política de cookies, troca/devolução, contato/SAC, dados do fornecedor no rodapé.
- Evite *dark patterns* (pré-marcar consentimento, esconder cancelamento): além de antiético, geram risco legal (CDC, LGPD).

## 2.10 Entregáveis de `docs/02-design/`

```
arquitetura.md   (diagramas, ADRs, ambientes)
dados.md         (ER, índices, retenção, colunas pessoais)
fluxos.md        (jornadas, estados de tela, wireframes)
identidade.md    (logo, ícones, peças 3D, tabela de motions; SVGs em assets/brand/)
design-system.md (tokens claro/escuro, componentes, contrastes medidos)
motion.md        (storyboard do scrollytelling, GSAP, fallback)
midia.md         (briefs e prompts de imagem/vídeo)
performance.md   (orçamento e plano de medição)
```

## 2.11 Critério de pronto e portão

- [ ] Arquitetura recomendada com ADR e custos.
- [ ] Modelo de dados com dados pessoais marcados.
- [ ] Fluxos principais e estados de tela cobertos.
- [ ] Logo com variações em SVG, ícones principais, peças 3D (se houver) e motions principais definidos e aprovados antes do layout completo.
- [ ] Tokens para dois temas com contraste AA medido.
- [ ] Storyboard de motion com fallback para `prefers-reduced-motion`.
- [ ] Briefs de mídia com limite de peso.
- [ ] Usuário aprovou o design (pode ser por protótipo clicável).

Peça autorização antes de iniciar a Etapa 3.
