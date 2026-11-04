# Implementação · CSS puro

Base pronta para sites em HTML/CSS puro, WordPress com tema próprio, Astro, ou qualquer stack que use CSS comum. Copie, troque os valores pelos da marca e mantenha a estrutura.

## Sumário
1. Tokens (claro e escuro)
2. Base
3. Layout
4. Botões
5. Cards
6. Formulários
7. Entrada ao rolar
8. Ordem de aplicação num site existente

---

## 1. Tokens (claro e escuro)

```css
/* tokens.css — um único lugar para todas as decisões */
:root {
  /* cor */
  --color-bg: oklch(98.5% 0.004 250);
  --color-surface: oklch(100% 0 0);
  --color-surface-muted: oklch(96% 0.006 250);
  --color-border: oklch(90% 0.01 250);
  --color-text: oklch(22% 0.02 250);
  --color-text-muted: oklch(45% 0.02 250);
  --color-accent: oklch(52% 0.17 255);
  --color-accent-hover: oklch(46% 0.17 255);
  --color-on-accent: oklch(99% 0 0);
  --color-focus: oklch(60% 0.19 255);
  --color-danger: oklch(52% 0.19 27);
  --color-success: oklch(52% 0.13 150);

  /* tipografia */
  --font-display: "Fraunces", Georgia, "Times New Roman", serif;
  --font-body: "Source Sans 3", "Segoe UI", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, Consolas, monospace;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: clamp(1.125rem, 1.05rem + 0.3vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.6vw, 1.563rem);
  --text-2xl: clamp(1.5rem, 1.2rem + 1.2vw, 1.953rem);
  --text-3xl: clamp(1.875rem, 1.4rem + 2vw, 2.441rem);
  --text-4xl: clamp(2.25rem, 1.5rem + 3.2vw, 3.815rem);

  /* espaço */
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem; --space-4: 1rem;
  --space-5: 1.5rem;  --space-6: 2rem;   --space-7: 3rem;    --space-8: 4rem;
  --space-section: clamp(3rem, 2rem + 5vw, 7rem);

  /* forma */
  --radius: 0.5rem;
  --radius-lg: 0.875rem;
  --shadow-sm: 0 1px 2px oklch(20% 0.02 250 / 0.06), 0 1px 3px oklch(20% 0.02 250 / 0.08);
  --shadow-md: 0 2px 4px oklch(20% 0.02 250 / 0.06), 0 8px 24px oklch(20% 0.02 250 / 0.10);

  /* motion */
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 400ms;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg: oklch(18% 0.015 250);
    --color-surface: oklch(22% 0.017 250);
    --color-surface-muted: oklch(25% 0.018 250);
    --color-border: oklch(32% 0.02 250);
    --color-text: oklch(93% 0.01 250);
    --color-text-muted: oklch(74% 0.015 250);
    --color-accent: oklch(72% 0.14 255);
    --color-accent-hover: oklch(78% 0.13 255);
    --color-on-accent: oklch(18% 0.02 255);
    --color-focus: oklch(78% 0.15 255);
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --color-bg: oklch(18% 0.015 250);
  --color-surface: oklch(22% 0.017 250);
  --color-surface-muted: oklch(25% 0.018 250);
  --color-border: oklch(32% 0.02 250);
  --color-text: oklch(93% 0.01 250);
  --color-text-muted: oklch(74% 0.015 250);
  --color-accent: oklch(72% 0.14 255);
  --color-accent-hover: oklch(78% 0.13 255);
  --color-on-accent: oklch(18% 0.02 255);
  --color-focus: oklch(78% 0.15 255);
  color-scheme: dark;
}
```

## 2. Base

```css
*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: var(--font-display);
  line-height: 1.15;
  letter-spacing: -0.015em;
  text-wrap: balance;
  margin: 0;
}
h1 { font-size: var(--text-4xl); }
h2 { font-size: var(--text-3xl); }
h3 { font-size: var(--text-xl); }
p { margin: 0; text-wrap: pretty; }

a { color: var(--color-accent); text-underline-offset: 0.2em; text-decoration-thickness: 1px; }
a:hover { color: var(--color-accent-hover); }

:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
}

img, video { max-width: 100%; height: auto; display: block; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## 3. Layout

```css
.container {
  width: 100%;
  max-width: 72rem;
  margin-inline: auto;
  padding-left: max(var(--space-4), env(safe-area-inset-left, 0px));
  padding-right: max(var(--space-4), env(safe-area-inset-right, 0px));
}
.section { padding-block: var(--space-section); }
.section--muted { background: var(--color-surface-muted); }

.stack { display: flex; flex-direction: column; gap: var(--space-4); }
.section-head { display: grid; gap: var(--space-3); max-width: 40rem; margin-bottom: var(--space-7); }
.eyebrow {
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}
.lede { font-size: var(--text-lg); color: var(--color-text-muted); max-width: 60ch; }

.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: var(--space-5);
}
.split { display: grid; gap: var(--space-7); align-items: center; }
@media (min-width: 56rem) { .split { grid-template-columns: 5fr 7fr; } }
```

## 4. Botões

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 2.75rem;               /* 44px: bom para toque */
  padding: 0 var(--space-5);
  border: 1px solid transparent;
  border-radius: var(--radius);
  font: 600 var(--text-base) / 1 var(--font-body);
  text-decoration: none;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out);
}
.btn:active { transform: translateY(1px); }
.btn:disabled, .btn[aria-disabled="true"] { opacity: 0.55; cursor: not-allowed; transform: none; }

.btn--primary { background: var(--color-accent); color: var(--color-on-accent); }
.btn--primary:hover { background: var(--color-accent-hover); color: var(--color-on-accent); }

.btn--secondary { background: transparent; color: var(--color-text); border-color: var(--color-border); }
.btn--secondary:hover { background: var(--color-surface-muted); color: var(--color-text); }

.btn--ghost { background: transparent; color: var(--color-accent); padding-inline: var(--space-2); }
.btn--ghost:hover { text-decoration: underline; }
```

```html
<a class="btn btn--primary" href="/agendar">Agendar avaliação gratuita</a>
<a class="btn btn--secondary" href="#servicos">Ver serviços</a>
```

## 5. Cards

```css
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: box-shadow var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out);
}
.card__media { aspect-ratio: 16 / 10; object-fit: cover; border-radius: var(--radius); }
.card__title { font-size: var(--text-xl); }
.card__text { color: var(--color-text-muted); }
.card__action { margin-top: auto; }                 /* alinha ações entre cards da mesma linha */

/* card inteiro clicável, mantendo um só link acessível */
.card__link::after { content: ""; position: absolute; inset: 0; border-radius: inherit; }
.card:has(.card__link):hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.card:has(.card__link:focus-visible) { outline: 2px solid var(--color-focus); outline-offset: 3px; }
.card__link:focus-visible { outline: none; }
```

## 6. Formulários

```css
.field { display: grid; gap: var(--space-2); }
.field label { font-weight: 600; }
.field .hint { font-size: var(--text-sm); color: var(--color-text-muted); }
.field input, .field select, .field textarea {
  font: inherit;
  min-height: 2.75rem;
  padding: var(--space-2) var(--space-3);
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}
.field input:focus-visible, .field select:focus-visible, .field textarea:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 1px;
  border-color: var(--color-focus);
}
.field [aria-invalid="true"] { border-color: var(--color-danger); }
.field .error { color: var(--color-danger); font-size: var(--text-sm); }
```

```html
<div class="field">
  <label for="email">E-mail</label>
  <input id="email" name="email" type="email" autocomplete="email" required
         aria-describedby="email-error" aria-invalid="true">
  <p class="error" id="email-error">Informe um e-mail com @, por exemplo nome@empresa.com.</p>
</div>
```

## 7. Entrada ao rolar

O conteúdo fica visível por padrão; só é preparado para animar quando o script roda (ver `06-motion.md`, seção 5).

```css
.js-reveal [data-reveal] {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity var(--duration-slow) var(--ease-out), transform var(--duration-slow) var(--ease-out);
}
.js-reveal [data-reveal].is-visible { opacity: 1; transform: none; }
```

```js
// reveal.js — carregue com <script type="module" src="/reveal.js"></script>
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-reveal');
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
}
```

## 8. Ordem de aplicação num site existente

1. Crie `tokens.css` e importe antes dos outros estilos.
2. Troque cores soltas por tokens: busque `#`, `rgb(`, `hsl(` nos CSS e substitua pelo token da função.
3. Troque tamanhos de fonte soltos pelos da escala, e espaçamentos soltos pela escala de espaço.
4. Aplique a base (seção 2) e confira o site inteiro: muitas melhorias aparecem só com isso.
5. Refaça botões, cards e formulários usando as classes acima ou adaptando as existentes.
6. Ajuste layout seção por seção.
7. Por último, motion.
