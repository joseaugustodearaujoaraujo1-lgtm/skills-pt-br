# 02 · Tipografia

A tipografia decide como a página é lida e qual personalidade ela tem, mesmo quando o assunto não é tipografia. É a mudança de maior retorno na maioria dos sites.

## Sumário
1. Regras de legibilidade
2. Escala tipográfica
3. Hierarquia
4. Escolha e combinação de fontes
5. Carregamento de fontes
6. Erros comuns

---

## 1. Regras de legibilidade

| Item | Valor recomendado |
|---|---|
| Corpo de texto | 16 a 18px no desktop, nunca menos de 16px no celular (abaixo disso o iOS dá zoom em inputs) |
| Altura de linha do corpo | 1,5 a 1,7 |
| Altura de linha de títulos | 1,05 a 1,25 (quanto maior o título, menor a altura de linha) |
| Largura da linha | 45 a 75 caracteres (`max-width: 65ch`) |
| Espaço entre parágrafos | cerca de 0,75 a 1em |
| Cor do corpo | escura o bastante para 4,5:1 de contraste; evite cinza-claro "elegante" |
| Pesos usados | 2 ou 3 (ex.: 400, 600, 700) |
| Caixa alta | só em rótulos curtos, com `letter-spacing: 0.04em` a `0.08em` |
| Títulos grandes | `letter-spacing` levemente negativo (−0.01em a −0.03em) |

Ajudas do CSS moderno:
- `text-wrap: balance` nos títulos (evita uma palavra sozinha na última linha);
- `text-wrap: pretty` nos parágrafos;
- `font-variant-numeric: tabular-nums` em tabelas, preços e números que se alinham.

## 2. Escala tipográfica

Escolha uma razão e derive todos os tamanhos dela:
- **1,2:** sóbria; dashboards e apps;
- **1,25:** equilibrada; a maioria dos sites;
- **1,333:** expressiva; landing pages e editoriais.

Use `clamp()` para os tamanhos crescerem com a tela sem breakpoints:

```css
:root {
  --text-sm: 0.875rem;                              /* 14px: legendas, rótulos */
  --text-base: 1rem;                                /* 16px */
  --text-lg: clamp(1.125rem, 1.05rem + 0.3vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.6vw, 1.563rem);
  --text-2xl: clamp(1.5rem, 1.2rem + 1.2vw, 1.953rem);
  --text-3xl: clamp(1.875rem, 1.4rem + 2vw, 2.441rem);
  --text-4xl: clamp(2.25rem, 1.5rem + 3.2vw, 3.815rem); /* título do hero */
}
```

Regras:
- Use **só** os tamanhos da escala. Se precisar de um tamanho fora dela, revise a escala em vez de criar exceção.
- Rem para tamanhos de fonte, porque respeita o zoom do usuário.

## 3. Hierarquia

Diferencie os níveis usando poucas ferramentas ao mesmo tempo:
1. **Tamanho:** a principal.
2. **Peso:** negrito para títulos e ênfase.
3. **Cor:** texto principal escuro; secundário um degrau mais claro, ainda com contraste.
4. **Espaço:** mais espaço acima de um título do que abaixo (o título "pertence" ao conteúdo seguinte).
5. **Caixa e família:** rótulos em caixa alta pequena; dados em fonte mono.

Um nível por vez: um título não precisa ser maior, mais grosso, colorido e sublinhado ao mesmo tempo.

Estrutura típica de uma seção:
- **sobretítulo (eyebrow):** opcional; pequeno, caixa alta, cor de acento ou neutra;
- **título:** um da escala grande;
- **parágrafo de apoio:** `--text-lg`, cor secundária, largura de cerca de 60ch;
- **conteúdo.**

## 4. Escolha e combinação de fontes

**Critério principal: o tom do negócio.** Pergunte que voz a marca tem: séria, acolhedora, técnica, luxuosa, divertida, editorial.

**Estratégias de combinação que funcionam:**
- **Contraste de estrutura:** serifa no título + sem serifa no corpo (ou o contrário).
- **Mesma família em pesos diferentes:** seguro e coerente; dê personalidade com tamanho e espaçamento.
- **Display com personalidade + texto neutro:** a fonte forte aparece pouco (títulos); a neutra carrega a leitura.
- **Mono como terceira voz:** números, rótulos técnicos, código.

**Combinações de partida (todas no Google Fonts):**

| Tom | Títulos | Corpo |
|---|---|---|
| Editorial, revista | Fraunces, Newsreader ou Instrument Serif | Source Serif 4, Literata ou Inter Tight |
| Tecnologia, produto | Schibsted Grotesk, Familjen Grotesk ou Archivo | IBM Plex Sans ou Hanken Grotesk |
| Acolhedor, saúde, educação | Bricolage Grotesque ou Figtree | Figtree ou Nunito Sans |
| Institucional, governo, jurídico | Source Serif 4 ou Libre Caslon Text | Public Sans ou Source Sans 3 |
| Luxo, moda, gastronomia | Cormorant Garamond ou Playfair Display | Manrope ou Jost |
| Divertido, criativo | Syne, Unbounded ou Darker Grotesque | Work Sans ou Onest |
| Dados, dashboards | Instrument Sans ou IBM Plex Sans | IBM Plex Sans + JetBrains Mono ou IBM Plex Mono |

São pontos de partida: teste com o conteúdo real e confira os pesos disponíveis. Inter, Roboto, Poppins, Montserrat e Space Grotesk não são erradas, mas aparecem em tantos sites (e em tanto código gerado por IA) que tiram identidade. Use-as quando forem da marca ou quando a neutralidade for o objetivo.

## 5. Carregamento de fontes

- No máximo 2 famílias e 3 a 4 arquivos (pesos/estilos) no total; prefira fontes variáveis.
- `font-display: swap` (no Google Fonts, `&display=swap`) e `preconnect` para `fonts.gstatic.com`.
- Pilha de fallback real: `font-family: "Fraunces", Georgia, "Times New Roman", serif;`.
- Hospedar localmente melhora privacidade e velocidade (Next.js: `next/font/google` faz isso automaticamente).
- Para reduzir o "pulo" quando a fonte carrega: use `size-adjust` no fallback ou os ajustes automáticos do `next/font` / `fontaine`.

## 6. Erros comuns

- **Corpo com 14px e cinza-claro:** o texto fica ilegível. Corrija para 16 a 18px e uma cor com contraste.
- **Linhas de 120 caracteres em telas largas:** corrija com `max-width: 65ch` no texto.
- **Títulos todos em negrito máximo e caixa alta:** a página "grita". Corrija com um peso forte, caixa normal e o tamanho fazendo a hierarquia.
- **Texto justificado no celular:** cria buracos entre as palavras. Corrija alinhando à esquerda.
- **Centralizar parágrafos longos:** a leitura fica cansativa. Centralize só textos curtos (até 2 ou 3 linhas).
- **Três ou mais famílias:** corrija com uma de títulos e uma de corpo (a mono é opcional).
- **Tamanhos quebrados (15, 17, 19, 22px):** corrija com uma escala única.
- **Cor de link igual à do texto, sem sublinhado:** corrija com cor de acento e sublinhado em links dentro de parágrafos.
