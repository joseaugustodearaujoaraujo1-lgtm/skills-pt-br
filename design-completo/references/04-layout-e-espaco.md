# 04 · Layout e espaçamento

Espaço é o que organiza a página. A maioria dos sites "amadores" não tem problema de cor ou fonte: tem espaçamento aleatório e alinhamento descuidado.

## Sumário
1. Escala de espaçamento
2. Proximidade: dentro menor que fora
3. Containers e larguras
4. Grid e composição
5. Alinhamento
6. Responsividade
7. Erros comuns

---

## 1. Escala de espaçamento

Use uma escala de base 4 ou 8 e só valores dela:

```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.5rem;   /* 24px */
  --space-6: 2rem;     /* 32px */
  --space-7: 3rem;     /* 48px */
  --space-8: 4rem;     /* 64px */
  --space-9: 6rem;     /* 96px */
  --space-section: clamp(3rem, 2rem + 5vw, 7rem); /* respiro entre seções */
}
```

Ícone e texto ficam a 8px; itens de uma lista, a 12–16px; blocos de um card, a 16–24px; grupos dentro de uma seção, a 32–48px; seções, a 64–112px.

## 2. Proximidade: dentro menor que fora

Elementos relacionados ficam próximos; grupos diferentes ficam separados. Regra de bolso: **o espaço dentro de um grupo é no máximo metade do espaço que separa esse grupo do próximo.**

Exemplos:
- Título de seção mais perto do conteúdo dele do que da seção anterior (`margin-top` maior que `margin-bottom`).
- Label colado ao campo (4–8px), e campos separados entre si por 16–24px.
- Em cards, o padding interno costuma ser maior que o espaço entre os elementos internos.

Use `gap` em flex e grid em vez de margens em cada elemento, porque margens colapsam ou dobram sem aviso.

## 3. Containers e larguras

```css
.container {
  width: 100%;
  max-width: 72rem;                                  /* ~1152px; até 80rem em layouts amplos */
  margin-inline: auto;
  padding-inline: max(1rem, env(safe-area-inset-left, 0px)); /* gutter mínimo de 16px */
}
.prose { max-width: 65ch; }                          /* texto corrido */
```

- Texto de leitura nunca ocupa a largura toda em telas grandes.
- Seções com fundo colorido podem ir de ponta a ponta, mas o conteúdo dentro delas respeita o container.

## 4. Grid e composição

```css
/* cards que se ajustam sozinhos: sem breakpoints */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: var(--space-5);
}

/* duas colunas desiguais: texto + imagem */
.split {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-7);
  align-items: center;
}
@media (min-width: 56rem) {
  .split { grid-template-columns: 5fr 7fr; }
}
```

Princípios de composição:
- **Varie o ritmo entre seções**, por exemplo: título + texto em duas colunas, depois grid de cards, depois uma faixa de citação larga, depois lista com imagem lateral. Dez seções seguidas de "título centralizado + 3 cards" deixam a página monótona.
- **Assimetria intencional** (5/7, 4/8) costuma ser mais interessante que tudo 50/50 ou tudo centralizado.
- **Um elemento dominante por seção.** Defina o que é mais importante e dê a ele mais espaço ou peso.
- **Leitura em F ou Z:** em páginas de texto o olho varre em F, em landing pages em Z. Coloque título e ação nesses caminhos.
- **Quantidade de itens:** escolha um número de colunas que o conteúdo preenche. Evite um card sozinho na última linha e cards esticados com espaço vazio.

## 5. Alinhamento

- **Uma borda esquerda forte:** títulos, textos e botões de uma seção começam na mesma linha vertical.
- **Centralizar com critério:** centralize blocos curtos (hero curto, CTA final, depoimento único). Textos longos, formulários e listas ficam alinhados à esquerda.
- **Alinhamento óptico:** ícones dentro de botões, aspas grandes e números podem precisar de ajuste de 1–2px para *parecer* alinhados.
- **Bases iguais:** em uma linha de cards, títulos, preços e botões alinhados entre si (use `display: grid` com `grid-template-rows: subgrid` ou flex com `margin-top: auto` no botão).

## 6. Responsividade

- **Celular primeiro:** comece pelo layout de uma coluna e acrescente colunas quando houver espaço.
- **Breakpoints pelo conteúdo,** não por aparelhos: quebre quando o layout começa a ficar ruim.
- **Fluido em vez de saltos:** `clamp()` para tipografia e espaços de seção; `auto-fit` para grids.
- **Container queries** (`@container`) para componentes que mudam conforme o espaço que recebem, e não conforme a tela.
- **Toque:** alvos com cerca de 44×44px e pelo menos 8px entre alvos vizinhos (o mínimo do WCAG 2.2 é 24×24px).
- **Nada de rolagem horizontal:** imagens com `max-width: 100%`; tabelas e blocos de código dentro de `overflow-x: auto`; `min-width: 0` em filhos de flex/grid que contêm texto longo.
- **Áreas seguras:** em celulares com notch, use `env(safe-area-inset-*)` em elementos fixos.
- **Altura de tela:** prefira `min-height: 100svh` a `100vh` (que estoura no celular por causa das barras do navegador), e só quando a seção realmente precisa ocupar a tela.

## 7. Erros comuns

- **Espaços diferentes entre seções** (40px, 72px, 55px): corrija com um único `--space-section`.
- **Título equidistante do conteúdo anterior e do seguinte:** parece solto. Dê mais espaço acima.
- **Conteúdo encostado na borda no celular:** corrija com um gutter mínimo de 16px.
- **Hero com `100vh` e pouco conteúdo:** empurra todo o resto para fora da primeira tela. Dimensione o hero pelo conteúdo.
- **Tudo centralizado:** a leitura fica sem âncora. Alinhe à esquerda e centralize por exceção.
- **Cards com alturas e alinhamentos diferentes lado a lado:** corrija com grid e o botão empurrado para o fim.
- **Elementos com `position: absolute` para montar layout:** quebram em outras telas. Use flex ou grid.
