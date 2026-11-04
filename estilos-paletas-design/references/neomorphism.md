# Neomorphism (Neumorphism / Soft UI)

> Fonte: 3 pranchas de referência (`Foundations & Navigation`, `Actions & Forms`, `Content, Data and Feedback`), design system "Neumorphism soft UI". Valores marcados com *(derivado)* não aparecem nas imagens: foram deduzidos para completar o sistema.

## 1. Essência

Interface "esculpida" em um único material: fundo e componentes têm **a mesma cor**, e a profundidade vem de **duas sombras opostas** (uma clara no canto superior esquerdo, uma escura no inferior direito). Os elementos parecem extrudados da superfície (relevo) ou pressionados nela (rebaixo). Tudo é suave, arredondado, silencioso e tátil, como plástico fosco ou argila lisa. A única cor viva é o azul de acento, reservada a estados ativos, ações primárias e dados.

Sensação: calma, tátil, "hardware de luxo", painel de controle de eletrodoméstico premium.

## 2. Quando usar e quando evitar

**Bom para:** dashboards de casa inteligente, apps de controle (volumes, temperatura, player de música), calculadoras, painéis com poucos elementos, portfólios de UI, ferramentas de bem-estar e finanças pessoais com visual suave.

**Evitar quando:** o público precisa de contraste forte (acessibilidade crítica), a interface é densa (tabelas enormes, formulários longos), há muitos níveis de hierarquia ou o site é de conversão agressiva. O estilo tem contraste inerentemente baixo; use-o com parcimônia e reforce estados com cor e texto.

## 3. Paleta

| Papel | Hex | Observação |
|---|---|---|
| Superfície / fundo (tudo) | `#E0E5EC` | Cinza-azulado frio; fundo e cards usam o mesmo valor |
| Luz (sombra clara) | `#FFFFFF` | Sombra no canto superior esquerdo |
| Sombra escura / elementos mudos | `#A3B1C6` | Sombra no canto inferior direito, trilhas, ícones inativos, barras de placeholder |
| Acento primário | `#3B82F6` | Botão primário, item ativo, foco, barras e anéis de dados |
| Texto principal | `#3D4451` | Slate escuro, nunca preto puro |
| Texto secundário *(derivado)* | `#5B6475` | Passa 4.5:1 sobre o fundo |
| Desabilitado *(derivado)* | `#A3B1C6` com 70% de opacidade | Sem sombra |
| Sucesso *(aprox. imagem)* | verde `#3F9B5B` | Borda e ícone de check |
| Erro *(aprox. imagem)* | vermelho `#C0504D` | Borda, texto e fundo rosado de alerta |
| Alerta *(aprox. imagem)* | âmbar `#D9941E` | Badge "Pending" e alerta Warning |
| Tint de fundo dos alertas | azul `#B9CDF0`, âmbar `#F0D9AE`, vermelho `#E6C0C2` | Versões claras e opacas do semântico |

Regra: um único acento (azul). Semânticos (verde, âmbar, vermelho) só em feedback.

## 4. Tipografia

- Família: **Inter** (ou sans geométrica/grotesca equivalente: Manrope, DM Sans). Pesos 400, 500, 600, 700.
- Escala vista: *Display* (muito grande, ~64–72px, 600), *Heading 1* (~44px), *Heading 2* (~34px), *Body* (~24px na prancha; 16px em produção), *Caption* (~20px na prancha; 13–14px em produção).
- Títulos em semibold/bold na cor `#3D4451`; corpo em regular. Títulos de seção (ex.: "Color Palette") em regular/medium, tamanho médio, mesma cor.
- Sem caixa-alta nem espaçamento largo entre letras; texto limpo e neutro.
- Números de dados (84%, $29, 72%) em bold grande, sozinhos, com o rótulo pequeno acima.

## 5. Espaçamento, grade e raios

- Escala de espaçamento em múltiplos de 4/8 (4, 8, 12, 16, 24, 32, 48).
- Raios: **8px** (chips pequenos, checkbox), **16px** (inputs, tiles), **24px** (cards, painéis, modais), **Full** (botões pill, toggles, avatares). Os raios são generosos: nada tem cantos vivos.
- Muito respiro entre elementos: as sombras precisam de espaço (mínimo ~16–24px entre vizinhos) ou se sobrepõem e "sujam" a tela.
- Cards em grid simples, 2 a 3 colunas, alturas iguais.

## 6. Superfícies, sombras e elevação (o coração do estilo)

Quatro níveis vistos na prancha:

| Nível | Aparência | Uso |
|---|---|---|
| **Flat** | Sem sombra, apenas contorno de 1px quase invisível | Itens inertes, divisores, estado desabilitado |
| **Raised SM** | Relevo pequeno (sombras ~4–6px de deslocamento) | Botões, chips, inputs de seleção, itens de lista |
| **Raised LG** | Relevo grande (sombras ~10–14px) | Cards, modais, painéis, navegação |
| **Inset SM** | Sombras internas, parece pressionado | Campos de texto, trilhas de slider/progresso, estado "pressed", item selecionado |

Variante "moldura": um painel em relevo com o centro rebaixado (anel com miolo inset), usado para displays, knobs e áreas de destaque.

```css
:root {
  --nm-bg: #E0E5EC;
  --nm-light: #FFFFFF;
  --nm-dark: #A3B1C6;
  --nm-accent: #3B82F6;
  --nm-text: #3D4451;

  --nm-raised-sm: 5px 5px 10px rgba(163,177,198,.65), -5px -5px 10px rgba(255,255,255,.9);
  --nm-raised-lg: 12px 12px 24px rgba(163,177,198,.65), -12px -12px 24px rgba(255,255,255,.9);
  --nm-inset-sm:  inset 4px 4px 8px rgba(163,177,198,.65), inset -4px -4px 8px rgba(255,255,255,.9);
  --nm-inset-lg:  inset 8px 8px 16px rgba(163,177,198,.7), inset -8px -8px 16px rgba(255,255,255,.95);
}
body { background: var(--nm-bg); color: var(--nm-text); font-family: Inter, system-ui, sans-serif; }
.nm-card { background: var(--nm-bg); border-radius: 24px; box-shadow: var(--nm-raised-lg); }
```

Sombras sempre em **par** (clara + escura), com a mesma distância e blur. A luz vem do canto superior esquerdo em todo o sistema; nunca misture direções.

## 7. Ícones e imagens

- Ícones de **traço fino (1.5–2px)**, contorno, cantos arredondados, cor `#3D4451` ou o slate mudo: home, settings, user, search, bell, heart (e heart partido), mail, calendar (e calendar-check), cart, menu, close, arrow-right, check.
- Tamanhos 16, 20 e 24px. Agrupados em um painel em relevo; ícones destacados ficam dentro de círculos em relevo (ex.: linhas de lista).
- Avatares: fotos/ilustrações em círculo, em grupo sobreposto com o último círculo "+3" em relevo.
- Sem fotos grandes nem gradientes fortes; imagens (se houver) ficam em molduras inset.

## 8. Componentes

### Botões
- **Default:** pill (raio Full), relevo `raised-sm`, texto `#3D4451`.
- **Hover:** preenchimento levemente mais escuro/azulado (`#C9D1DE`-like) e sombra mais curta.
- **Pressed:** `inset-sm`, fundo ainda mais escuro. É a transição do relevo para o rebaixo.
- **Disabled:** achatado, sem sombra, texto em cinza baixo contraste.
- **Primário (Submit):** preenchimento sólido `#3B82F6`, texto branco, pill. É o único botão "colorido".
- **Secundário (Cancel):** mesmo relevo neutro do default.
- **Circular (ícone):** botões redondos em relevo (heart, plus).
- **Loading:** texto + spinner de traços radiais.
- **Segmented (Day / Week / Month):** container pill; o item ativo fica rebaixado (inset) com texto azul.
- **Split (Save | ˅):** pill com divisor fino vertical e chevron.
- **Active:** pill com **halo azul** (box-shadow azul ~40% com blur 12–16px) e borda azul fina.

### Campos de formulário
- **Text input:** rebaixado (`inset-sm`), raio ~16px ou Full, texto 16px, ícone à direita (ex.: lupa, olho).
- **Focus:** borda azul 2px + halo azul suave; o campo continua inset.
- **Success:** borda verde + check verde à direita, texto verde.
- **Error:** borda vermelha, texto vermelho e helper "Required field" em vermelho pequeno abaixo.
- **Disabled:** achatado, fundo ligeiramente mais claro, texto cinza.
- **Textarea:** inset, com alça de resize no canto inferior direito; linhas de placeholder em barras cinza-azuladas.
- **Selects:** campo em relevo com chevron; o menu é um painel `raised-lg` e a opção selecionada vira pill azul com texto branco.
- **Checkbox:** quadrado 8px de raio; vazio = contorno/rebaixo; marcado = azul sólido com check branco.
- **Radio:** círculo rebaixado; marcado = anel azul com ponto azul.
- **Toggle:** trilha inset com botão (knob) circular em relevo; ligado = trilha azul e knob branco à direita.
- **Slider:** trilha inset, preenchimento azul, knob em relevo; versão com valor ("40%") acima e versão de intervalo com dois knobs.
- **Knob (dial):** círculo em relevo com marcas radiais e um traço indicador.
- **Rating:** estrelas escuras preenchidas, a última cinza.
- **Number stepper:** pill inset com − valor +.
- **OTP:** quadrados inset de raio 12px.
- **Upload:** zona com borda tracejada fina, ícone de nuvem + "Upload files or drag and drop".

### Navegação
- **Lista de navegação:** card `raised-lg`; cada linha tem círculo de ícone em relevo, rótulo e chevron `›`; a linha **selecionada** fica rebaixada com tom azulado.
- **Paginação:** "Back, 1, [2], 3, Next"; a página atual é um quadrado arredondado azul com número branco; as demais são texto.
- **Steps:** círculos conectados por uma linha; concluídos/atuais em azul sólido com número branco; futuros em relevo cinza com número cinza; a linha fica azul até o passo atual.
- **Estados de link/item:** Default (slate), Hover (slate escuro), Active (azul), Disabled (cinza claro).
- **Header:** barra em relevo com logo à esquerda e ações em botões circulares.

### Conteúdo e dados
- **Profile card:** avatar circular no topo, barras de placeholder (nome/cargo) e botão pequeno "Profile" em relevo.
- **KPI card:** rótulo ("Revenue"), número gigante "84%" e sparkline azul com área translúcida.
- **Pricing card:** rótulo, preço grande "$29" e botão azul largura total (raio ~12px).
- **Tabela:** cabeçalho com divisores verticais finos; linhas de barras cinza; linha em hover levanta (relevo); marcador azul quadrado minúsculo para status.
- **Badges:** *Active* = pill azul sólido/texto branco; *Pending* = pill com contorno e texto âmbar; *Draft* = pill em relevo/contorno cinza. Tags com "×" em pills de relevo.
- **Accordion:** container em relevo; item aberto com chevron para cima e barra de conteúdo; itens fechados separados por linhas finas.
- **Gráfico de barras:** barras finas inset cinza-azuladas, **uma barra em azul** (destaque, em relevo). Sem grade.
- **Progresso circular:** trilha inset, arco azul grosso, número no centro (72% escuro, 60% azul).
- **Gauge semicircular:** arco azul sobre trilha cinza e ponteiro escuro.
- **Barra de progresso:** trilha inset com preenchimento azul e rótulo "50%".

### Feedback
- **Toast "Saved ✓":** painel claro em relevo, check à direita.
- **Alertas:** Info (azul claro com texto azul), Warning (âmbar claro com texto âmbar), Error (vermelho claro com texto vermelho); ícone circular "!" e raio ~10px.
- **Modal:** card `raised-lg`, título, duas barras de texto, botões *Cancel* (plano) e *Save* (relevo).
- **Tooltip:** pequeno painel em relevo acima de um botão "i" circular.
- **Spinner:** traços radiais cinza-azulados.
- **Calendário:** grade de células pequenas arredondadas; dia selecionado em azul sólido.
- **Skeleton:** barras de placeholder cinza-azuladas.

## 9. Motion e interação

- Transições de **150–220ms**, `ease-out`, em `box-shadow`, `background` e `transform`.
- O gesto principal é **relevo → rebaixo** ao pressionar (`:active`), em vez de mudar de cor.
- Hover: reduz levemente a sombra e escurece 3–4% o fundo; nunca "pula" o elemento.
- Foco por teclado: halo azul 2–3px (obrigatório; a sombra sozinha não basta).
- Respeite `prefers-reduced-motion`: troque transições por mudança instantânea.

## 10. Receita dos componentes-chave

```css
.nm-btn { padding:.75rem 1.5rem; border:0; border-radius:999px; background:var(--nm-bg);
  color:var(--nm-text); font:600 1rem Inter,sans-serif; box-shadow:var(--nm-raised-sm);
  transition:box-shadow .18s ease-out, background .18s ease-out; cursor:pointer; }
.nm-btn:hover { background:#d6dce6; box-shadow:3px 3px 6px rgba(163,177,198,.65), -3px -3px 6px rgba(255,255,255,.9); }
.nm-btn:active { box-shadow:var(--nm-inset-sm); background:#cfd6e2; }
.nm-btn:focus-visible { outline:0; box-shadow:var(--nm-raised-sm), 0 0 0 3px rgba(59,130,246,.45); }
.nm-btn--primary { background:var(--nm-accent); color:#fff; }
.nm-btn[disabled] { box-shadow:none; color:#a3b1c6; cursor:not-allowed; }

.nm-input { width:100%; padding:.85rem 1.1rem; border:2px solid transparent; border-radius:16px;
  background:var(--nm-bg); color:var(--nm-text); box-shadow:var(--nm-inset-sm); font:400 1rem Inter,sans-serif; }
.nm-input:focus { outline:0; border-color:var(--nm-accent); box-shadow:var(--nm-inset-sm), 0 0 0 4px rgba(59,130,246,.18); }
.nm-input[aria-invalid="true"] { border-color:#c0504d; }

.nm-toggle { width:56px; height:30px; border-radius:999px; background:var(--nm-bg); box-shadow:var(--nm-inset-sm); position:relative; }
.nm-toggle::after { content:""; position:absolute; top:3px; left:3px; width:24px; height:24px; border-radius:50%;
  background:var(--nm-bg); box-shadow:2px 2px 5px rgba(163,177,198,.8), -2px -2px 5px #fff; transition:transform .2s; }
.nm-toggle[aria-checked="true"] { background:var(--nm-accent); }
.nm-toggle[aria-checked="true"]::after { transform:translateX(26px); background:#fff; }
```

## 11. Acessibilidade

- O contraste das **bordas/sombras** é baixo por natureza: não use só a sombra para indicar estado. Combine com cor (azul), texto, ícone ou borda.
- Texto sempre `#3D4451` (≈7:1) ou o secundário `#5B6475`; nunca cinza claro sobre o fundo `#E0E5EC` (reprova WCAG).
- Foco visível obrigatório; alvos de toque ≥ 44px.
- Estados de erro/sucesso precisam de texto e ícone além da cor.

## 12. Erros comuns

- Sombras com direções diferentes, ou só uma sombra (vira "drop shadow" comum).
- Fundo do card diferente do fundo da página (quebra a ilusão de material único).
- Sombras escuras demais (sujas) ou claras demais (somem); ajuste a opacidade em vez de aumentar o blur.
- Aplicar relevo em **tudo**: reserve o relevo para o que é interativo e use o plano para o que é informativo.
- Excesso de azul: o acento deve ocupar pouquíssima área.
- Fundo branco ou escuro: o efeito só funciona em tons médio-claros (L ≈ 88–92%); no escuro exige reescrever os pares de sombra.

## 13. Combina com / não misture com

Combina com: minimalismo (mesma calma), tipografia limpa. Não misture com: brutalismo, pixel art, cyberpunk (a lógica de profundidade e de contraste é oposta). Glassmorphism e claymorphism disputam o mesmo "volume": escolha um por tela.
