# 06 · Motion e microinterações

Animação boa é quase invisível: confirma uma ação, mostra de onde algo veio, chama atenção para o que importa. Animação demais deixa o site lento, cansativo e pode causar enjoo em pessoas sensíveis a movimento.

## Sumário
1. Para que animar
2. Durações e curvas
3. Desempenho
4. Acessibilidade (`prefers-reduced-motion`)
5. Entradas ao rolar sem esconder conteúdo
6. Dosagem por página
7. Técnicas modernas
8. Usando o naocodei.com
9. Erros comuns

---

## 1. Para que animar

Só anime quando houver um destes motivos:
- **Feedback:** o botão reage ao clique; o campo mostra que foi validado.
- **Orientação:** o menu desliza de onde foi aberto; o modal nasce do card clicado.
- **Continuidade:** a transição entre estados ou páginas mantém o contexto.
- **Ênfase:** um único destaque no hero ou no número mais importante.

Se a animação não serve a nenhum desses, remova.

## 2. Durações e curvas

| Tipo | Duração |
|---|---|
| Microinterações (hover, foco, toggle) | 100 a 200ms |
| Elementos pequenos entrando/saindo (tooltip, dropdown) | 150 a 250ms |
| Elementos médios (modal, painel, card) | 200 a 350ms |
| Transições grandes (página, seção) | 300 a 500ms |
| Escalonamento entre itens de uma lista (stagger) | 40 a 80ms por item, no máximo cerca de 400ms no total |

Curvas:
- **Entrando:** desacelera no fim (`cubic-bezier(0.2, 0.8, 0.2, 1)` ou `ease-out`).
- **Saindo:** acelera (`ease-in`), e um pouco mais rápido que a entrada.
- **Mudando de estado na tela:** `ease-in-out`.
- **Linear:** só em loops contínuos (spinner, marquee).

```css
:root {
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 400ms;
}
```

## 3. Desempenho

- Anime só `transform` e `opacity`, que não recalculam layout. Evite animar `width`, `height`, `top`, `left`, `margin` e `box-shadow` em elementos grandes.
- `will-change` só durante a animação, não espalhado pelo CSS.
- Canvas, WebGL e efeitos de partículas: pause fora da tela (`IntersectionObserver`) e quando a aba está oculta (`document.hidden`).
- Teste no celular médio: animação suave no notebook pode travar num aparelho de entrada.
- Efeitos que seguem o cursor só no desktop (`@media (hover: hover) and (pointer: fine)`).

## 4. Acessibilidade (`prefers-reduced-motion`)

Pessoas com distúrbios vestibulares podem sentir tontura com parallax, zoom e movimentos grandes. Sempre ofereça a versão sem movimento:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```js
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) startFancyAnimation();
```

Também: nada pisca mais de 3 vezes por segundo; animações automáticas com mais de 5 segundos (carrosséis, vídeos de fundo) precisam de botão de pausar.

## 5. Entradas ao rolar sem esconder conteúdo

Erro muito comum: deixar o conteúdo em `opacity: 0` esperando o JavaScript. Se o script falha, demora ou o print é tirado antes, a página aparece vazia. Faça o oposto: o conteúdo é visível por padrão e só é preparado para animar quando o JS confirma que vai rodar.

```css
/* só esconde quando o JS marcou a página como pronta para animar */
.js-reveal [data-reveal] {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity var(--duration-slow) var(--ease-out), transform var(--duration-slow) var(--ease-out);
}
.js-reveal [data-reveal].is-visible {
  opacity: 1;
  transform: none;
}
```

```js
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-reveal');
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // anima uma vez só
      }
    }
  }, { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
}
```

Não aplique entrada animada no conteúdo do primeiro quadro (hero): ele precisa aparecer imediatamente.

## 6. Dosagem por página

Padrão recomendado para uma landing page:
- **1 efeito de entrada** consistente para as seções (ex.: subir e aparecer);
- **1 destaque** no hero (ex.: palavras que se revelam ou um fundo animado sutil);
- **microinterações** em botões, links e cards (hover, foco, clique);
- **no máximo 1 efeito pesado** de rolagem (cards que empilham, galeria horizontal) por página.

Um momento bem orquestrado impressiona mais que dez efeitos espalhados, e excesso de animação é um dos sinais de site genérico.

## 7. Técnicas modernas

- **View Transitions API:** transições suaves entre estados e páginas (`document.startViewTransition()`; para multipágina, `@view-transition { navigation: auto; }`). Tem suporte crescente; use como melhoria progressiva.
- **Animações guiadas pela rolagem em CSS** (`animation-timeline: view()` / `scroll()`): sem JavaScript, mas o suporte ainda não é universal. Envolva em `@supports (animation-timeline: view())`.
- **`<details>` + `interpolate-size: allow-keywords`** para acordeões que animam a altura (suporte limitado; o acordeão funciona sem a animação).
- **Bibliotecas:** GSAP (completo, com ScrollTrigger) e Motion (antigo Framer Motion, para React). Se o projeto já usa uma, siga com ela; não misture motores de animação.

## 8. Usando o naocodei.com

O naocodei.com oferece 66 efeitos em HTML, CSS e JS puro, sem bibliotecas, com código comentado em português. O catálogo completo, com IDs e indicação de uso, está em `catalogo-naocodei.md`: leia o catálogo antes de abrir o site.

**Como obter o código:**
1. Abra https://naocodei.com/free-code-css/ (efeitos `a01`–`a30`) ou https://naocodei.com/free-code/ (efeitos `j01`–`j36`).
2. Use o botão "Copiar efeito" do card. Com uma ferramenta de navegador que execute JavaScript, também dá para ler `window.CODIGOS["a07"]` (ou o ID desejado), só para os efeitos escolhidos.
3. Se o objeto não existir mais (o site mudou), recrie o efeito a partir da descrição do card.

**Como adaptar (obrigatório):**
- Os efeitos CSS de entrada animam quando o container recebe a classe `.run`. No site real, adicione-a com `IntersectionObserver` (como na seção 5).
- Troque as variáveis da vitrine (`var(--border)`, `var(--display)` etc.) pelos tokens do projeto.
- Nos efeitos de rolagem em JS, troque o container `.mini` da vitrine pela janela (`window` / `document.documentElement`).
- Em React/Next, transforme o script em hook com limpeza de listeners, observers e `requestAnimationFrame`.
- Envolva tudo com `prefers-reduced-motion` e anime só `transform`/`opacity`.

**Uso responsável:** o site oferece o código para cópia, mas não declara licença formal. Use e adapte em projetos, não republique a coleção como sua e dê crédito ao autor (Não Codei) quando houver página de créditos.

## 9. Erros comuns

- **Todo elemento anima ao rolar:** a página fica lenta e cansativa. Anime as seções, não cada parágrafo.
- **Conteúdo invisível até o JS rodar:** a página aparece vazia. Use o padrão da seção 5.
- **Durações de 800ms a 1,5s:** parece lento. Use 200–400ms.
- **Parallax pesado e scroll "sequestrado"** (smooth scroll que muda a velocidade): causa enjoo e atrapalha a navegação. Use pouco e desligue com reduced-motion.
- **Hover com efeito grande em cards no celular:** o hover não existe no toque. Garanta que tudo funcione sem ele.
- **Carrossel automático de banners:** quase ninguém vê além do primeiro. Prefira conteúdo estático ou controle manual.
