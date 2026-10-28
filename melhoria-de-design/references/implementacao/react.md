# Implementação · React e Next.js

Como aplicar o sistema desta skill em projetos React (Vite, Next.js, Remix). Os estilos usam as variáveis CSS de `css-puro.md` (seção 1). Funciona com CSS Modules, CSS global ou Tailwind (ver `tailwind.md`).

## Sumário
1. Fontes no Next.js
2. Componente Button com variantes
3. Hook de entrada ao rolar
4. Alternância de tema
5. Motion (biblioteca) com reduced-motion
6. Erros comuns em React

---

## 1. Fontes no Next.js

```jsx
// app/layout.jsx
import { Fraunces, Source_Sans_3 } from 'next/font/google';
import './globals.css';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const body = Source_Sans_3({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

`next/font` hospeda as fontes junto do site, evita requisições ao Google e reduz o "pulo" do layout. Em Vite, use `@fontsource-variable/<fonte>` ou o link do Google Fonts com `display=swap`.

## 2. Componente Button com variantes

```jsx
// components/Button.jsx
import styles from './Button.module.css';

const VARIANTS = { primary: styles.primary, secondary: styles.secondary, ghost: styles.ghost };

export function Button({ variant = 'primary', loading = false, href, children, className = '', ...props }) {
  const classes = [styles.btn, VARIANTS[variant], className].filter(Boolean).join(' ');

  if (href) {
    return <a href={href} className={classes} {...props}>{children}</a>;
  }

  return (
    <button className={classes} disabled={loading || props.disabled} aria-busy={loading || undefined} {...props}>
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}
```

```css
/* components/Button.module.css: os mesmos estilos de css-puro.md, seção 4 */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: var(--space-2);
  min-height: 2.75rem; padding: 0 var(--space-5); border: 1px solid transparent; border-radius: var(--radius);
  font: 600 var(--text-base) / 1 var(--font-body); cursor: pointer; text-decoration: none;
  transition: background-color var(--duration-fast) var(--ease-out); }
.btn:disabled { opacity: 0.55; cursor: not-allowed; }
.primary { background: var(--color-accent); color: var(--color-on-accent); }
.primary:hover { background: var(--color-accent-hover); }
.secondary { background: transparent; color: var(--color-text); border-color: var(--color-border); }
.secondary:hover { background: var(--color-surface-muted); }
.ghost { background: transparent; color: var(--color-accent); }
.spinner { width: 1em; height: 1em; border: 2px solid currentColor; border-right-color: transparent;
  border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
```

Uso: `<Button>Agendar visita</Button>`, `<Button variant="secondary" href="#precos">Ver preços</Button>`, `<Button loading>Enviando…</Button>`.

Com Tailwind, a mesma ideia funciona com `cva` (class-variance-authority) ou um objeto de variantes com strings de classes.

## 3. Hook de entrada ao rolar

```jsx
// hooks/useReveal.js
import { useEffect, useRef, useState } from 'react';

export function useReveal({ rootMargin = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true); // visível por padrão (SSR, sem JS)

  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!el || reduce || !('IntersectionObserver' in window)) return undefined;

    // só esconde se o elemento ainda não estiver na tela
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) return undefined;

    setVisible(false);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin });
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, visible };
}
```

```jsx
function Section({ children }) {
  const { ref, visible } = useReveal();
  return (
    <section ref={ref} className={visible ? 'reveal is-visible' : 'reveal'}>
      {children}
    </section>
  );
}
```

```css
.reveal { transition: opacity var(--duration-slow) var(--ease-out), transform var(--duration-slow) var(--ease-out); }
.reveal:not(.is-visible) { opacity: 0; transform: translateY(16px); }
```

## 4. Alternância de tema

```jsx
// components/ThemeToggle.jsx: três estados (sistema, claro, escuro)
'use client';
import { useEffect, useState } from 'react';

const OPTIONS = [
  { value: 'system', label: 'Sistema' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
];

export function ThemeToggle() {
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    try { setTheme(localStorage.getItem('theme') ?? 'system'); } catch { /* armazenamento bloqueado */ }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch { /* ignora */ }
  }, [theme]);

  return (
    <label>
      <span className="visually-hidden">Tema</span>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        {OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
```

Para evitar o "piscar" do tema errado no carregamento em SSR, aplique o atributo com um script curto no `<head>` antes da página renderizar (ou use `next-themes`).

## 5. Motion (biblioteca) com reduced-motion

Se o projeto já usa Motion (antigo Framer Motion):

```jsx
import { motion, useReducedMotion } from 'motion/react';

export function FadeUp({ children, delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
```

Em projetos com GSAP, use `gsap.matchMedia()` com `(prefers-reduced-motion: no-preference)` e o hook `useGSAP` para limpeza automática. Não misture Motion e GSAP no mesmo projeto sem motivo.

## 6. Erros comuns em React

- **Estilos inline espalhados** (`style={{ marginTop: 13 }}`): fogem dos tokens. Use classes e variáveis.
- **`div` com `onClick` no lugar de `button` ou `a`:** sem teclado e sem leitor de tela.
- **Conteúdo do hero escondido até o efeito rodar:** a primeira tela aparece vazia. Não anime a entrada do primeiro quadro.
- **Animação sem limpeza** (listeners, observers, `requestAnimationFrame`): vaza memória ao navegar. Sempre retorne a função de limpeza no `useEffect`.
- **Componentes de UI duplicados** (três "Button" diferentes): centralize num só, com variantes.
- **Imagens sem `width`/`height`:** o layout pula. No Next, use `next/image` com dimensões ou `fill` + `sizes`.
