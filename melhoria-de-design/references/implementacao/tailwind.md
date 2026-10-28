# Implementação · Tailwind CSS

Como aplicar o sistema desta skill em projetos com Tailwind. A versão 4 configura tudo em CSS (`@theme`); a versão 3 usa `tailwind.config.js`. Confira a versão instalada antes (`package.json`).

## Sumário
1. Tokens no Tailwind v4
2. Tokens no Tailwind v3
3. Modo escuro
4. Componentes sem "sopa de classes"
5. Padrões prontos
6. Erros comuns com Tailwind

---

## 1. Tokens no Tailwind v4

```css
/* app.css */
@import "tailwindcss";

@theme {
  --font-display: "Fraunces", Georgia, serif;
  --font-sans: "Source Sans 3", "Segoe UI", system-ui, sans-serif;

  --color-bg: oklch(98.5% 0.004 250);
  --color-surface: oklch(100% 0 0);
  --color-surface-muted: oklch(96% 0.006 250);
  --color-line: oklch(90% 0.01 250);
  --color-ink: oklch(22% 0.02 250);
  --color-ink-muted: oklch(45% 0.02 250);
  --color-accent: oklch(52% 0.17 255);
  --color-accent-hover: oklch(46% 0.17 255);
  --color-on-accent: oklch(99% 0 0);

  --radius-card: 0.875rem;
  --shadow-card: 0 2px 4px oklch(20% 0.02 250 / 0.06), 0 8px 24px oklch(20% 0.02 250 / 0.10);
  --ease-out-soft: cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

Isso gera utilitários como `bg-surface`, `text-ink-muted`, `border-line`, `bg-accent`, `font-display`, `rounded-card` e `shadow-card`.

Para substituir a paleta padrão inteira e impedir o uso de `blue-500` solto, use `--color-*: initial;` no início do `@theme`.

## 2. Tokens no Tailwind v3

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx,vue,svelte,astro}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Source Sans 3"', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        line: 'var(--color-border)',
        ink: { DEFAULT: 'var(--color-text)', muted: 'var(--color-text-muted)' },
        accent: { DEFAULT: 'var(--color-accent)', hover: 'var(--color-accent-hover)', on: 'var(--color-on-accent)' },
      },
      borderRadius: { card: '0.875rem' },
    },
  },
};
```

As variáveis (`--color-*`) ficam num CSS global, com os valores claros e escuros (ver `css-puro.md`, seção 1). Assim o modo escuro troca só as variáveis, sem `dark:` em cada classe.

## 3. Modo escuro

Duas abordagens:
- **Tokens que mudam (recomendado):** as cores são variáveis CSS redefinidas no tema escuro. As classes (`bg-surface`, `text-ink`) não mudam e não é preciso escrever `dark:` em todo lugar.
- **Variante `dark:`:** útil para ajustes pontuais (`dark:shadow-none`). No v4, para controlar por atributo, use `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`.

## 4. Componentes sem "sopa de classes"

Classes utilitárias repetidas em 30 botões viram inconsistência. Centralize:
- **Em frameworks de componentes** (React, Vue, Svelte): crie um componente `Button` com variantes (ver `react.md`). É a melhor opção.
- **Em HTML/templates:** use `@utility` (v4) ou `@layer components` com `@apply` (v3/v4) para poucos componentes muito repetidos:

```css
/* v4 */
@utility btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding-inline: 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background-color 150ms var(--ease-out-soft);
}
```

Ordene as classes automaticamente com `prettier-plugin-tailwindcss`.

## 5. Padrões prontos

```html
<!-- seção com cabeçalho alinhado à esquerda e grid que se ajusta sozinho -->
<section class="bg-bg py-[clamp(3rem,2rem+5vw,7rem)]">
  <div class="mx-auto max-w-6xl px-4">
    <header class="mb-12 grid max-w-2xl gap-3">
      <p class="text-sm font-semibold uppercase tracking-[0.08em] text-ink-muted">Serviços</p>
      <h2 class="font-display text-[clamp(1.875rem,1.4rem+2vw,2.441rem)] leading-tight tracking-tight text-balance text-ink">
        Manutenção completa sem tirar o carro da sua rotina
      </h2>
      <p class="max-w-[60ch] text-lg text-ink-muted">Buscamos e devolvemos o carro no mesmo dia em Campinas e região.</p>
    </header>

    <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-6">
      <article class="relative flex flex-col gap-3 rounded-card border border-line bg-surface p-6 transition hover:-translate-y-0.5 hover:shadow-card">
        <h3 class="font-display text-xl text-ink">
          <a href="/revisao" class="after:absolute after:inset-0 focus-visible:outline-none">Revisão preventiva</a>
        </h3>
        <p class="text-ink-muted">Checklist de 40 itens, com fotos de cada peça trocada.</p>
        <p class="mt-auto font-semibold tabular-nums text-ink">a partir de R$ 289</p>
      </article>
    </div>
  </div>
</section>

<!-- botões: um primário, um secundário -->
<div class="flex flex-wrap gap-3">
  <a href="/agendar" class="inline-flex min-h-11 items-center rounded-lg bg-accent px-6 font-semibold text-on-accent transition hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
    Agendar revisão
  </a>
  <a href="#precos" class="inline-flex min-h-11 items-center rounded-lg border border-line px-6 font-semibold text-ink transition hover:bg-surface-muted">
    Ver preços
  </a>
</div>
```

Animações respeitando reduced-motion: `motion-safe:transition motion-safe:hover:-translate-y-0.5`.

## 6. Erros comuns com Tailwind

- **Valores arbitrários espalhados** (`p-[13px]`, `text-[17px]`, `#3b82f6` solto): voltam a bagunça. Use os tokens e a escala.
- **`rounded-2xl shadow-xl` em tudo:** um dos sinais de "cara de IA". Defina um raio e uma sombra de card no tema.
- **Paleta padrão usada crua** (`bg-indigo-600`, `from-purple-500 to-pink-500`): parece modelo. Defina as cores da marca no tema.
- **`dark:` em cada classe:** difícil de manter. Prefira tokens que mudam no tema escuro.
- **Remover o foco** (`outline-none` sem `focus-visible:`): quebra a navegação por teclado.
- **Esquecer o celular:** escreva o estilo base para celular e use `md:`/`lg:` para telas maiores, e não o contrário.
