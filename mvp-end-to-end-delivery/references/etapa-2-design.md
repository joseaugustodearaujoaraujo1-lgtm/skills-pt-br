# Etapa 2 — Design do sistema

**Objetivo:** definir *como* o sistema funciona e *como* ele se apresenta, antes de programar. Cobre arquitetura, dados, experiência do usuário, identidade visual, motion e mídia.

**Entrada:** `docs/01-requisitos.md` aprovado. **Saída:** `docs/02-design/` aprovado.

## 2.1 Arquitetura proporcional

1. **Escolha o menor desenho que atende os RNF.** Monólito modular costuma bastar para MVP; microsserviços só com justificativa concreta.
2. **Compare até 3 opções** (ex.: Next.js + API Express; Next.js com rotas de API; backend gerenciado) em simplicidade, custo, segurança, manutenção e desempenho. Recomende uma e registre o ADR.
3. **Diagrama de contexto e de containers** (texto/Mermaid): front, API, banco, cache, fila, provedores externos, CDN/WAF.
4. **Ambientes:** local, staging e produção, com variáveis separadas. Staging é onde o teste de carga (Etapa 6) acontecerá.

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
- **Wireframes de baixa fidelidade** antes do visual final; valide com o usuário.

## 2.4 Design system com tokens (tema claro e escuro)

Defina tokens como variáveis CSS no `:root` e redefina para o escuro com `[data-theme="dark"]` e `@media (prefers-color-scheme: dark)`.

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

## 2.5 Scrollytelling e motion com GSAP

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

## 2.6 Briefs de mídia (imagens e vídeos gerados por IA)

Use `references/media-prompts.md`. Entregue: lista de ativos (nome, uso, proporção, peso máximo), prompt estruturado, descrição da cena, e comandos de compressão. **Meta de peso:** vídeos curtos de fundo ≤ ~1,4 MB; imagens em WebP/AVIF, tipicamente ≤ 150 KB.

## 2.7 Orçamento de performance e SEO

- Core Web Vitals: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 (mobile, 4G simulado).
- JS inicial ≤ ~170 KB gzip na primeira dobra; fontes com `font-display: swap`; imagens com `width/height`, `loading="lazy"` e `srcset`.
- Metadados, `sitemap.xml`, `robots.txt`, dados estruturados (`Product`, `Organization`) em lojas.
- Imagens decorativas com `alt=""`; imagens informativas com `alt` descritivo.

## 2.8 Segurança e privacidade no design

- Telas de login, recuperação e cadastro sem enumeração de usuário.
- Consentimento granular (cookies, marketing) com opção de recusar tão visível quanto a de aceitar.
- Páginas e componentes jurídicos previstos: política de privacidade, termos, política de cookies, troca/devolução, contato/SAC, dados do fornecedor no rodapé.
- Evite *dark patterns* (pré-marcar consentimento, esconder cancelamento): além de antiético, geram risco legal (CDC, LGPD).

## 2.9 Entregáveis de `docs/02-design/`

```
arquitetura.md   (diagramas, ADRs, ambientes)
dados.md         (ER, índices, retenção, colunas pessoais)
fluxos.md        (jornadas, estados de tela, wireframes)
design-system.md (tokens claro/escuro, componentes, contrastes medidos)
motion.md        (storyboard do scrollytelling, GSAP, fallback)
midia.md         (briefs e prompts de imagem/vídeo)
performance.md   (orçamento e plano de medição)
```

## 2.10 Critério de pronto e portão

- [ ] Arquitetura recomendada com ADR e custos.
- [ ] Modelo de dados com dados pessoais marcados.
- [ ] Fluxos principais e estados de tela cobertos.
- [ ] Tokens para dois temas com contraste AA medido.
- [ ] Storyboard de motion com fallback para `prefers-reduced-motion`.
- [ ] Briefs de mídia com limite de peso.
- [ ] Usuário aprovou o design (pode ser por protótipo clicável).

Peça autorização antes de iniciar a Etapa 3.
