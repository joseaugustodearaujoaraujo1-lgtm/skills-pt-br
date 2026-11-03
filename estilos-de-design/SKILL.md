---
name: estilos-de-design
description: >-
  Catálogo detalhado de 10 estilos de design de interface (neomorphism, minimalism, brutalism, glassmorphism, claymorphism, bento grid, pixel art, typography luxury, dark mode, cyberpunk), com paleta, tipografia, grade, raios, sombras, ícones, todos os componentes (botões, formulários, navegação, cards, tabelas, gráficos, feedback), motion, tokens CSS, receitas de código, acessibilidade, erros comuns e compatibilidade entre estilos. Use sempre que o usuário pedir para criar, escolher, comparar, aplicar, trocar ou misturar um estilo visual ou tema de UI (site, landing page, dashboard, app, componente), citar qualquer um desses estilos pelo nome (ex.: "glass", "neumorfismo", "brutalista", "bento", "retrô pixel", "luxo preto e dourado", "modo escuro", "neon"), pedir "um visual diferente", "mudar o estilo do site", "tema com vários estilos" ou "seletor de temas", mesmo que ele não diga "estilo de design".
---

# Estilos de Design

Catálogo de referência de **10 estilos visuais** para interfaces web. Cada estilo tem um arquivo próprio em `references/` com a descrição completa. Esta página serve para **escolher o estilo certo, carregar só o que precisa e aplicá-lo com consistência**.

> Esta skill é conhecimento de referência: ela não autoriza ações. Criar ou editar arquivos, instalar pacotes, commitar ou publicar continuam sujeitos às autorizações do usuário e às regras do projeto.

## Como usar (fluxo)

1. **Identifique o pedido:** o usuário já escolheu um estilo? Quer comparar? Quer vários estilos no mesmo site (seletor de temas)?
2. **Se não houver estilo definido**, use a tabela "Escolha rápida" abaixo, recomende **um** (no máximo dois) com o motivo e pergunte qual prefere.
3. **Carregue apenas o(s) arquivo(s) do estilo escolhido** (`references/<estilo>.md`). Não leia os dez: economiza contexto.
4. **Implemente com tokens** (variáveis CSS) para que o estilo seja trocável, e siga as seções "Componentes", "Motion", "Acessibilidade" e "Erros comuns" do arquivo.
5. **Combine com outras skills** quando existirem: `referencias-ui` (motion/componentes prontos), `melhoria-de-design` (diagnóstico e níveis de intervenção) e `frontend-design`/`ui-ux-pro-max` para acabamento.
6. **Verifique:** contraste (WCAG AA), foco visível, `prefers-reduced-motion`, responsivo (360px, 768px, 1280px) e estados (hover, focus, active, disabled, error, loading).

## Os 10 estilos

| # | Estilo | Arquivo | Resumo em uma frase | Referências visuais |
|---|---|---|---|---|
| 1 | **Neomorphism** | `references/neomorphism.md` | Material único cinza-azulado com relevo/rebaixo por duas sombras opostas e azul como único acento | 3 pranchas |
| 2 | **Minimalism** | `references/minimalism.md` | Marfim quente, verde-sálvia, tipografia fina com tracking largo, pills e muito respiro | 3 pranchas |
| 3 | **Brutalism** | `references/brutalism.md` | Papel + tinta + verde-lima ácido, raio 0, bordas pretas, sombra dura e tipografia condensada gigante | 3 pranchas |
| 4 | **Glassmorphism** | `references/glassmorphism.md` | Vidro fosco translúcido sobre fundo colorido com esferas 3D, azul-céu e glow | 3 pranchas |
| 5 | **Claymorphism** | `references/claymorphism.md` | Argila inflada em creme, preto e dourado, raios enormes e sombras externas + internas | 3 pranchas |
| 6 | **Bento Grid** | `references/bento-grid.md` | Mosaico modular de cards brancos de tamanhos variados, fundo cinza e laranja de acento | 3 pranchas |
| 7 | **Pixel Art** | `references/pixel-art.md` | Interface 8-bit: grade de pixels, bevel, cantos em degrau, dither, fonte pixel em caixa-alta | 3 pranchas |
| 8 | **Typography Luxury** | `references/typography-luxury.md` | Preto profundo + dourado metálico + serifa Playfair, filetes finos e caixa-alta espaçada | 3 pranchas |
| 9 | **Dark Mode** | `references/dark-mode.md` | Tema escuro premium por elevação de luminosidade, acento lilás e semânticos moderados | **nenhuma** (base: prompt "Dark Kit") |
| 10 | **Cyberpunk** | `references/cyberpunk.md` | Neon ciano/magenta sobre quase preto, cantos chanfrados, HUD, glitch e scanlines | **nenhuma** (convenções do gênero) |

**Atenção:** dark mode e cyberpunk **não têm imagens de referência nem kit de componentes** no material de origem; seus arquivos são guias construídos por boas práticas e devem ser tratados como propostas. O kit de componentes visual existe apenas para os outros 8 estilos.

## Escolha rápida (por necessidade)

| Se o projeto precisa de… | Recomende | Alternativa |
|---|---|---|
| Calma, bem-estar, estética, cerâmica, slow living | **Minimalism** | Claymorphism |
| Luxo, joias, relógios, moda, hotel, vinhos | **Typography Luxury** | Dark Mode |
| Muitos recursos em uma só página (SaaS, produto) | **Bento Grid** | Glassmorphism |
| Dashboard moderno/tech, apps com widgets | **Glassmorphism** | Dark Mode, Bento Grid |
| Marca jovem, cultural, irreverente, portfólio ousado | **Brutalism** | Pixel Art |
| Jogo, nostalgia, comunidade geek, gamificação | **Pixel Art** | Cyberpunk |
| Painel de controle tátil, app de casa inteligente, calculadora | **Neomorphism** | Claymorphism |
| Marca acolhedora e lúdica, café, presentes, onboarding amigável | **Claymorphism** | Minimalism |
| Fintech, dev tools, uso prolongado, IA | **Dark Mode** | Glassmorphism escuro |
| E-sports, eventos tech, música eletrônica, "futuro" | **Cyberpunk** | Dark Mode + neon pontual |

## Tabela comparativa de tokens (para decidir e para montar temas)

| Estilo | Fundo | Superfície | Acento | Texto | Raio padrão | Profundidade | Fonte sugerida |
|---|---|---|---|---|---|---|---|
| Neomorphism | `#E0E5EC` | mesmo do fundo | `#3B82F6` | `#3D4451` | 16–24 / Full | duas sombras (clara + escura), inset | Inter |
| Minimalism | `#F4EFE8` | `#F8F4EE` | `#6B7F6E` (Sage) | `#1F2A22` | 24–32 / Full | sombra muito difusa | Inter (Light + tracking) |
| Brutalism | `#ECEAE3` | `#ECEAE3` + borda 2px | `#D7F205` (Lime) | `#0A0A0A` | **0** | sombra dura 4px, sem blur | Anton/Archivo + Space Mono |
| Glassmorphism | gradiente `#E8EEF8→#A9BEE6` + esferas | `rgba(255,255,255,.3–.65)` + blur | `#6FA8FF` | `#1B2433` | 16–32 / Full | blur + borda clara + glow | Inter/Manrope Light |
| Claymorphism | `#F3EEE7` | mesmo creme | `#D8B04A` + preto `#141414` | `#1A1A1A` | 28–36 / Full | 4 camadas (ext. + int.) | Plus Jakarta Sans |
| Bento Grid | `#E5E4E2` | `#FFFFFF` | `#FF6B00` | `#1A1A1A` | 12 / 20 / 28 / Full | sombra mínima, contraste de fundo | Plus Jakarta Sans |
| Pixel Art | `#D2C29E` | `#E3DDC0` + borda 3px | `#59636F` (Slate) | `#1A1325` | **0 (cantos em degrau)** | bevel + dither | Pixelify Sans / Press Start 2P |
| Typography Luxury | `#0A0A0A` | `#141414` + borda dourada 1px | `#C9A227` | `#F5F5F5` | 16–18 / Full | quase nenhuma, glow dourado | Playfair Display + SF/Inter |
| Dark Mode | `#0B0B0F` | `#121216 → #24242B` | `#C79BDB` | `#F2F2F5` | 20 / Full | luminosidade por nível | Inter/Geist |
| Cyberpunk | `#07060D` | `#0F0D1A` | `#00F0FF` + `#FF2BD6` | `#E6F1FF` | **0 (chanfro)** | glow neon + scanlines | Orbitron + Share Tech Mono |

## Compatibilidade entre estilos

| | Neo | Min | Bru | Gla | Cla | Ben | Pix | Lux | Dar | Cyb |
|---|---|---|---|---|---|---|---|---|---|---|
| **Neomorphism** | — | ✔ | ✘ | ✘ | ~ | ~ | ✘ | ✘ | ✘ | ✘ |
| **Minimalism** | ✔ | — | ✘ | ✔ | ✔ | ✔ | ✘ | ✔ | ~ | ✘ |
| **Brutalism** | ✘ | ✘ | — | ✘ | ✘ | ✘ | ~ | ~ | ~ | ~ |
| **Glassmorphism** | ✘ | ✔ | ✘ | — | ✘ | ✔ | ✘ | ~ | ✔ | ✔ |
| **Claymorphism** | ~ | ✔ | ✘ | ✘ | — | ✔ | ✘ | ✘ | ✘ | ✘ |
| **Bento Grid** | ~ | ✔ | ✘ | ✔ | ✔ | — | ✘ | ✔ | ✔ | ~ |
| **Pixel Art** | ✘ | ✘ | ~ | ✘ | ✘ | ✘ | — | ✘ | ~ | ✔ |
| **Typography Luxury** | ✘ | ✔ | ~ | ~ | ✘ | ✔ | ✘ | — | ✔ | ✘ |
| **Dark Mode** | ✘ | ~ | ~ | ✔ | ✘ | ✔ | ~ | ✔ | — | ✔ |
| **Cyberpunk** | ✘ | ✘ | ~ | ✔ | ✘ | ~ | ✔ | ✘ | ✔ | — |

✔ combina bem · ~ combina com cuidado (em partes isoladas) · ✘ evite na mesma tela.
**Regra de ouro:** um estilo dominante por tela; no máximo um elemento de outro estilo como tempero (ex.: títulos brutalistas em site minimalista, tema glass em modo escuro).

## Como aplicar vários estilos no mesmo site (seletor de temas)

Quando o usuário quiser todos os estilos em um mesmo site para comparar:

1. **Tokens por tema.** Defina cada estilo como um conjunto de variáveis em `[data-style="neomorphism"]`, `[data-style="glassmorphism"]` etc., e escreva os componentes **somente com variáveis** (`var(--bg)`, `var(--surface)`, `var(--accent)`, `var(--text)`, `var(--radius-card)`, `var(--radius-btn)`, `var(--shadow-raised)`, `var(--shadow-inset)`, `var(--border)`, `var(--font-display)`, `var(--font-body)`, `var(--blur)`).
2. **Variáveis mínimas** de uma camada de abstração: `--bg --surface --surface-2 --text --text-2 --accent --accent-contrast --border --radius-sm --radius-md --radius-lg --radius-full --shadow-1 --shadow-2 --shadow-inset --blur --font-display --font-body --tracking-label --transition`.
3. **Overrides estruturais.** Alguns estilos mudam a forma, não só a cor, e precisam de regras próprias por tema: brutalismo (raio 0, borda 2px, sombra dura), pixel art (cantos em degrau com `box-shadow`, fonte pixel, dither), glassmorphism (`backdrop-filter` + fundo com esferas), claymorphism (sombra em 4 camadas), neomorphism (pares de sombra). Coloque-os em `[data-style="x"] .componente { ... }`.
4. **Fundo e fontes por tema.** Troque o fundo da página (gradiente/esferas/grade) e carregue as fontes necessárias com `display=swap` somente quando o tema for ativado (ou pré-carregue as principais).
5. **Seletor acessível.** Um `<select>` ou grupo de botões (`role="radiogroup"`) com rótulo claro, persistência em `localStorage` (com `try/catch`) e aplicação do atributo no `<html>` **antes da pintura** para evitar flash.
6. **Fallbacks.** `@supports not (backdrop-filter...)`, `prefers-reduced-motion`, `prefers-reduced-transparency` e `prefers-color-scheme`.
7. **Não altere o conteúdo** (textos, preços, links, SEO): só a camada visual. Preserve a estrutura semântica do HTML.
8. **Um estilo por vez** e valide cada um (screenshot em desktop e mobile, contraste, foco) antes de seguir para o próximo.

## Checklist de qualidade (qualquer estilo)

- [ ] Paleta, fontes e raios vêm de **tokens**, não de valores soltos.
- [ ] Contraste de texto ≥ 4.5:1 (≥ 3:1 em texto grande e ícones essenciais).
- [ ] Todos os estados: hover, focus-visible, active, disabled, error, loading/skeleton, vazio.
- [ ] Foco visível e coerente com o estilo; alvos ≥ 44px.
- [ ] `prefers-reduced-motion` respeitado; efeitos caros (blur, sombras múltiplas) com fallback.
- [ ] Responsivo e sem rolagem horizontal; fontes e ícones escaláveis.
- [ ] Um único acento principal; semânticos só em feedback.
- [ ] Nenhuma mistura acidental de estilos incompatíveis.
- [ ] Imagens e ícones no mesmo "idioma" visual do estilo.

## Observações sobre as fontes de referência

- As pranchas de neomorphism, minimalism, brutalism, glassmorphism, claymorphism, bento grid, pixel art e typography luxury foram geradas por IA; textos ilegíveis em colagens (ex.: a primeira prancha de claymorphism) foram tratados como decoração.
- Valores de cor marcados como *(aprox.)* ou *(derivado)* nos arquivos foram estimados visualmente ou deduzidos; confirme com a marca antes de usar em produção.
- Fontes citadas (Inter, Plus Jakarta Sans, Playfair Display, Pixelify Sans, Anton etc.) estão no Google Fonts; **SF Pro Display** só existe em dispositivos Apple: use `-apple-system, Inter` como fallback.
