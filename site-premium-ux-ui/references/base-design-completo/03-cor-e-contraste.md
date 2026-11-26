# 03 · Cor e contraste

Cor bem usada comunica função (o que é clicável, o que é erro, o que é destaque) e dá personalidade. Mal usada, cansa, confunde e exclui quem tem baixa visão ou daltonismo.

## Sumário
1. Estrutura de uma paleta
2. Tokens semânticos
3. Construindo escalas com OKLCH
4. Contraste (WCAG)
5. Modo escuro
6. Gradientes, sombras e superfícies
7. Erros comuns

---

## 1. Estrutura de uma paleta

| Papel | Quantidade | Uso |
|---|---|---|
| **Neutros** | 1 escala de 9 a 11 tons | fundo, superfícies, bordas, texto. É a maior parte da página. |
| **Acento (primária)** | 1 cor (com 2 ou 3 variações) | ação principal, links, seleção, foco. Use pouco para que signifique algo. |
| **Secundária** | opcional, 1 cor | apoio da marca, ilustrações, destaques raros |
| **Semânticas** | sucesso, aviso, erro, informação | só para estados, nunca como decoração |

Proporção de referência: cerca de 60% neutro de fundo, 30% superfícies e texto, 10% acento.

**Neutros com intenção:** um cinza puro (`#808080`) parece sem cuidado. Incline os neutros levemente para o matiz do acento (frio para azul, quente para laranja). O resultado parece pensado sem chamar atenção.

## 2. Tokens semânticos

Nomeie as cores pela **função**, não pelo valor. Assim o modo escuro e as mudanças de marca não exigem caçar cores no código.

```css
:root {
  --color-bg: oklch(98.5% 0.004 250);          /* fundo da página */
  --color-surface: oklch(100% 0 0);            /* cards, painéis */
  --color-surface-muted: oklch(96% 0.006 250); /* faixas alternadas, inputs */
  --color-border: oklch(90% 0.01 250);
  --color-text: oklch(22% 0.02 250);           /* corpo e títulos */
  --color-text-muted: oklch(45% 0.02 250);     /* textos secundários (ainda com 4,5:1) */
  --color-accent: oklch(52% 0.17 255);         /* ação principal */
  --color-accent-hover: oklch(46% 0.17 255);
  --color-on-accent: oklch(99% 0 0);           /* texto sobre o acento */
  --color-focus: oklch(60% 0.19 255);
  --color-success: oklch(52% 0.13 150);
  --color-warning: oklch(62% 0.15 70);
  --color-danger: oklch(52% 0.19 27);
}
```

Componentes usam só os tokens (`background: var(--color-accent)`), nunca valores soltos.

## 3. Construindo escalas com OKLCH

`oklch(L C H)` é suportado em todos os navegadores modernos. Ele é previsível:
- **L** (luminosidade, 0 a 100%) corresponde à claridade percebida;
- **C** (croma) é a saturação;
- **H** (matiz) é o ângulo da cor.

Para gerar uma escala, mantenha o matiz, varie L em passos regulares e reduza um pouco o croma nos extremos:

```css
--blue-50:  oklch(97% 0.02 255);
--blue-100: oklch(93% 0.04 255);
--blue-300: oklch(80% 0.09 255);
--blue-500: oklch(62% 0.16 255);
--blue-600: oklch(52% 0.17 255);  /* bom para botão com texto branco */
--blue-700: oklch(45% 0.15 255);
--blue-900: oklch(28% 0.08 255);
```

Para navegadores muito antigos, defina antes um fallback em hex (`--color-accent: #1d5fd1;`) e redefina em OKLCH dentro de `@supports (color: oklch(0% 0 0)) { ... }`.

Ferramentas: oklch.com, Realtime Colors (testa a paleta num site de exemplo), Huemint, Coolors.

## 4. Contraste (WCAG 2.2, nível AA)

| Elemento | Contraste mínimo |
|---|---|
| Texto normal (abaixo de 24px, ou abaixo de 18,66px em negrito) | **4,5:1** |
| Texto grande | **3:1** |
| Componentes de interface (borda de input, ícones que significam algo, foco) | **3:1** contra o que está ao redor |
| Texto desabilitado e decoração | sem exigência (mas deixe claro que está desabilitado) |

Regras práticas:
- Não use só a cor para passar informação. Um erro precisa de texto ou ícone, além do vermelho; um link dentro do texto precisa de sublinhado.
- Placeholder não é label. Além disso, ele costuma ter pouco contraste.
- Texto sobre imagem precisa de sobreposição (gradiente ou camada escura) ou de um fundo atrás do texto.
- O anel de foco precisa contrastar com o fundo **e** com o componente.

Ferramentas: WebAIM Contrast Checker, painel de contraste do DevTools do Chrome, axe.

## 5. Modo escuro

- **Não é inverter as cores.** Fundo escuro levemente colorido (ex.: `oklch(18% 0.015 250)`) em vez de `#000`; texto claro, mas não branco puro, em blocos longos (`oklch(92% 0.01 250)`).
- **Elevação com claridade:** no escuro, superfícies "mais altas" são um pouco mais claras; sombras quase não funcionam.
- **Acento ajustado:** costuma precisar de mais luminosidade e menos croma para não "vibrar" no fundo escuro.
- **Imagens e ilustrações:** confira se não ficam estouradas; reduza levemente o brilho se necessário.
- **Implementação em três estados** (sistema, claro, escuro):

```css
:root { /* tokens claros */ }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* tokens escuros */ color-scheme: dark; }
}
:root[data-theme="dark"] { /* os mesmos tokens escuros */ color-scheme: dark; }
body { background: var(--color-bg); color: var(--color-text); }
```

`color-scheme: dark` faz barras de rolagem e campos nativos seguirem o tema.

## 6. Gradientes, sombras e superfícies

- **Gradientes:** sutis e de cores vizinhas no círculo cromático (azul → azul-violeta) parecem refinados. Gradientes de cores opostas e saturadas (roxo → laranja) em todos os títulos são um dos sinais de "cara de IA".
- **Sombras:** use uma escala pequena (2 ou 3 níveis), com a cor da sombra puxada para o matiz do fundo, baixa opacidade e duas camadas (uma próxima e nítida, uma difusa):

```css
--shadow-sm: 0 1px 2px oklch(20% 0.02 250 / 0.06), 0 1px 3px oklch(20% 0.02 250 / 0.08);
--shadow-md: 0 2px 4px oklch(20% 0.02 250 / 0.06), 0 8px 24px oklch(20% 0.02 250 / 0.10);
```

- **Bordas versus sombras:** em interfaces densas, bordas de 1px finas costumam ser mais limpas que sombras. Escolha uma linguagem e mantenha.

## 7. Erros comuns

- **Acento em tudo** (títulos, ícones, bordas, fundos): a ação principal deixa de se destacar. Reserve o acento para ação e destaque.
- **Cinza-claro em texto de leitura:** é falha de contraste. Use o `--color-text-muted` com 4,5:1.
- **Muitos tons parecidos sem nome:** corrija com tokens e uma escala única.
- **Vermelho e verde como única diferença** (gráficos, status): pessoas com daltonismo não distinguem. Acrescente ícone, texto ou padrão.
- **Fundo de seção colorido com texto cinza:** o contraste cai. Recalcule o texto para aquele fundo.
- **Modo escuro com `#000` e `#fff`:** contraste excessivo, que cansa e "vibra". Use tons próximos, não extremos.
