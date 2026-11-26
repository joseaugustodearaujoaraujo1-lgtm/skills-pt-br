# Brutalism (Neo-brutalismo / Brutalist UI)

> Fonte: 3 pranchas "BRUTALIST UI KIT" com a etiqueta "UI/UX KIT" (`Foundations & Navigation`, `Actions & Forms`, `Content & Feedback`). Valores com *(derivado)* foram deduzidos para completar o sistema.

## 1. Essência

Interface **crua, estrutural e barulhenta de propósito**: papel off-white, tinta preta, **verde-lima ácido** como marcador, bordas pretas grossas, **cantos retos (raio 0)**, sombras duras sem blur, tipografia ultra condensada em caixa-alta gigante e rótulos em monoespaçada. A grade e a estrutura ficam expostas, como um formulário impresso ou um cartaz de gráfica. Nada é "suavizado": hierarquia por peso, tamanho e inversão (preto sobre lima, lima sobre preto).

Sensação: editorial radical, anti-polido, honesto, jovem, cultural.

## 2. Quando usar e quando evitar

**Bom para:** portfólios de designers/estúdios, marcas jovens e culturais, moda streetwear, eventos e festivais, lançamentos de produto "com personalidade", editoriais, startups criativas, e-commerce de nicho, apps de fitness/ação com identidade forte.

**Evitar quando:** o público é conservador (bancos, saúde clínica, jurídico), a marca precisa transmitir delicadeza/luxo discreto, ou o conteúdo é longo e denso demais para a tipografia gritante. Cuidado com legibilidade: caixa-alta em parágrafos longos cansa.

## 3. Paleta

| Nome | Hex | Papel |
|---|---|---|
| **Paper** | `#ECEAE3` | Fundo da página e dos painéis claros (off-white quente, nunca branco puro) |
| **Ink** | `#0A0A0A` | Texto, bordas, botões primários, painéis invertidos |
| **Lime** | `#D7F205` | Marcador/acento principal: destaque de texto, botão "Upgrade", estado ativo, foco, barra de progresso |
| **Violet** | `#6C47FF` | Acento secundário **raro** (ex.: badge "+3", detalhes pontuais) |
| **Grey** | `#8A8A85` | Texto auxiliar, estado desabilitado, placeholders, hachuras |
| Erro *(aprox.)* | laranja-vermelho `#FF4A2B` | Campo com erro, alerta Error (fundo cheio) |
| Alerta | Lime com listras diagonais pretas | Warning (padrão "fita de aviso") |

Combinações permitidas: Ink sobre Paper, Ink sobre Lime, Lime sobre Ink, Paper sobre Ink. **Nunca** Lime sobre Paper como texto (contraste ≈1.2:1): Lime só como preenchimento atrás de texto Ink ou como texto sobre preto.

## 4. Tipografia

Três vozes:
1. **Display ultra condensada, caixa-alta, peso máximo** — títulos gigantes ("BRUTALIST UI KIT"), números de KPI, nomes. Sugestões: *Anton*, *Bebas Neue*, *League Gothic*, *Oswald 700*, *Barlow Condensed 800*. Tracking apertado (−0.01em), entrelinha ~0.9.
2. **Grotesca** (Heading/Body) — títulos secundários e corpo: *Archivo*, *Space Grotesk*, *Inter Tight*, *Work Sans*. Pesos 400–700.
3. **Monoespaçada em caixa-alta com espaçamento largo** — rótulos, etiquetas e metadados: *Space Mono*, *JetBrains Mono*, *IBM Plex Mono*. Ex.: "UI/UX KIT", "[01] COLOR PALETTE", "WEEKLY PROGRESS".

Padrões: rótulo de seção = `■ [01] NOME` (quadradinho preto + número entre colchetes + mono caps). Textos de botão, abas e campos em condensada/caixa-alta. Títulos enormes ocupam a largura toda do container.

## 5. Grade, bordas e espaçamento

- **Raio 0 em tudo** (exceção pontual: chips/pílulas de tag, como "Design ×", que podem ser pill com borda de 2px).
- Bordas: **1px** (divisores e detalhes), **2px** (cards, botões, campos), **4px** (foco, destaque). Sempre pretas.
- Espaçamento em múltiplos de 8: 8, 16, 24, 32 (e 48+). Padding interno de painéis ~16–24px.
- Grade **visível**: painéis encostam ou se separam por linhas; cada painel é uma caixa com borda de 2px e rótulo `■ [NN]` no topo. Alternar painéis claros e **painéis invertidos (preto)** cria ritmo.
- Alinhamento rígido, sem centralização "decorativa"; sobreposições são permitidas (imagem passando sobre a borda, rótulo vazando).

## 6. Superfícies, sombras e profundidade

- **Sombra dura, sem blur**: `box-shadow: 4px 4px 0 #0A0A0A` (cards, modal, botão destacado) ou `6px 6px 0`. No foco, a sombra pode ser **Lime** (`4px 4px 0 #D7F205`) atrás de uma borda de 4px preta.
- Pressed: o elemento "afunda" (translate +4px/+4px e sombra some) ou fica preto com sombra deslocada invertida.
- Sem gradientes, sem transparência, sem glow. Texturas permitidas: **hachura diagonal** (estados desabilitado/bloqueado/skeleton) e listras de aviso (Warning).
- Fotos em **preto e branco/duotone** de alto contraste, dentro de molduras de 2px.

```css
:root{
  --br-paper:#ECEAE3; --br-ink:#0A0A0A; --br-lime:#D7F205; --br-violet:#6C47FF; --br-grey:#8A8A85; --br-danger:#FF4A2B;
  --br-border:2px solid var(--br-ink);
  --br-shadow:4px 4px 0 var(--br-ink);
  --br-shadow-lime:4px 4px 0 var(--br-lime);
  --br-hatch:repeating-linear-gradient(135deg,transparent 0 6px,rgba(10,10,10,.28) 6px 8px);
  --f-display:"Anton","Bebas Neue",Impact,sans-serif;
  --f-body:"Archivo","Space Grotesk",system-ui,sans-serif;
  --f-mono:"Space Mono","JetBrains Mono",ui-monospace,monospace;
}
body{background:var(--br-paper);color:var(--br-ink);font:400 16px/1.45 var(--f-body);}
h1{font:400 clamp(4rem,14vw,12rem)/.88 var(--f-display);text-transform:uppercase;letter-spacing:-.01em;}
.br-label{font:700 12px var(--f-mono);letter-spacing:.14em;text-transform:uppercase;}
.br-panel{border:var(--br-border);padding:20px;background:var(--br-paper);}
.br-panel--ink{background:var(--br-ink);color:var(--br-paper);}
```

## 7. Ícones e imagens

- Ícones **outline grosso (2px), geometria reta**, dentro de **caixas quadradas com borda** (search, user, bell, mail, cart, arrow-up-right ↗, x, send, download/save, share, more "•••", lock, eye, filter, check, warning triangle, clock, pin).
- Setas diagonais ↗ são o ícone "de ação" recorrente (botões, KPIs, links).
- Em painéis pretas: ícones brancos em tiles brancos/limão.
- Fotografia monocromática, recortes retos; silhuetas cinza como avatar (quadrado, com um **pequeno quadrado lima no canto** como status).

## 8. Componentes

### Navegação
- **Header:** logotipo com **quadrado preto + wordmark condensado** ("■ STUDIO") e itens de menu; o item ativo/destaque recebe **fundo Lime** (marca-texto) com texto Ink.
- **Footer:** linha de células com borda (ABOUT | TERMS | HELP | CONTACT) e uma célula final **Lime com seta ↗**.
- **Bottom nav (dark):** barra preta com HOME (ativo: texto Lime + barrinha lima acima), SEARCH, SAVED, PROFILE em condensada caixa-alta.
- **Tabs de busca:** FLIGHTS | **HOTELS** (ativa = preto/branco) | CARS | EXPERIENCES, em células com borda.
- **Sidebar/lista de atividade:** linhas com ícones coloridos em quadrados e valores à direita; seção "RECENT ACTIVITY".

### Botões
- **Primário (BUY NOW):** fundo Ink, texto Paper, seta ↗, borda 2px, sombra dura.
- **Secundário (ADD TO CART):** fundo Paper, borda 2px, texto Ink.
- **Destaque (UPGRADE):** fundo **Lime**, texto Ink, seta ↗.
- **Pressed:** preto com sombra deslocada/`translate`.
- **Disabled:** **hachura diagonal cinza**, texto cinza, borda tracejada.
- **Loading:** outline + spinner de pontos.
- **Action buttons:** tiles **brancos quadrados** sobre painel preto com ícone e rótulo (SEND / SAVE / SHARE / MORE); **FAB** quadrado Lime "+" com sombra preta dura.

### Formulários
- **Text input:** retângulo com borda 2px, sem raio; rótulo acima em mono caps.
- **Focus:** borda **4px preta** + sombra dura Lime (bloco lima atrás, deslocado para baixo/direita).
- **Error:** borda laranja-vermelha, texto "REQUIRED" em caixa-alta vermelha logo abaixo.
- **Locked/Disabled:** hachura diagonal + ícone de cadeado.
- **Password:** pontos + olho; **OTP:** quadrados com borda; ativo com borda grossa e sombra Lime.
- **Select:** caixa com chevron; lista de opções em caixas empilhadas; **opção selecionada = fundo preto, texto Lime e check**.
- **Toggle:** (em painel preto) ON = trilha **Lime** com **knob quadrado preto**; OFF = trilha cinza. **Checkbox** marcada = quadrado Lime com check preto; **radio** = anel + ponto Lime.
- **Slider:** trilha preta grossa, preenchimento Lime, **knob quadrado preto**; valor "40%" acima em mono; range com dois knobs; **stepper** "− 1 +" em 3 caixas coladas.
- **Textarea:** caixa com linhas pautadas e contador "0/120"; **Upload:** caixa com **borda tracejada** e ícone ↑.
- **Search & booking:** campo "TYPE TO FIND" com lupa/filtro + botão quadrado preto; campos rotulados (DESTINATION: LISBON, CHECK IN: JUN 15, CHECK OUT, GUESTS: 2 ADULTS) em grade de caixas; botão largo "BOOK NOW ↗" preto.
- **Calendário:** grade de células quadradas com borda; dia selecionado Lime, intervalo preenchido preto; mês em condensada ("JUNE 2024"). **Rating:** estrelas pretas + "4.8 (128)".

### Conteúdo e dados
- **Profile card:** foto quadrada (silhueta cinza) com quadradinho Lime; nome em condensada gigante; cargo em caixa-alta; localização com pin; botão "•••" quadrado.
- **Stat tiles:** caixas 2×2 com rótulo mono (PROJECTS), número enorme (24, 68, 142H, 86%), ícone ↗ e delta (+12%).
- **Line chart:** linha preta grossa suave, área cinza clara, grade horizontal fina, tooltip em caixa ("68%") com ponto Lime; eixo MON–SUN em condensada; seletor "THIS WEEK ⌄" em caixa.
- **Bar chart & ring (painel preto):** barras brancas, **uma Lime**; anel 75% com arco Lime sobre cinza, legenda "WEEKLY PROGRESS".
- **Product card:** imagem P&B, tag preta "−20%", título caixa-alta, estrelas, preço com **preço antigo riscado**, swatches quadrados, stepper e dois botões (ADD TO CART / BUY NOW ↗).
- **Data table & team:** cabeçalho NAME / PROGRESS / DUE com linha grossa; **barras de progresso** (preenchimento preto em contorno); membros como siglas em caixas (AJ, BS, CW) + porcentagens em caixas (90%, 80%, 70%).
- **Badges:** ACTIVE (Lime), PENDING (contorno), DRAFT (hachura), NEW (preto); **tags** com ×; avatares quadrados sobrepostos "+3"; um "+3" em Violet.
- **Progress:** barra preta em contorno com "72%"; **barra segmentada** (10 blocos, 7 Lime); spinner de quadradinhos; skeleton com listras diagonais.
- **Accordion:** cabeçalho preto "QUESTION −" com conteúdo em caixa; item fechado com "+".

### Feedback
- **Toast (em painel preto):** bloco Lime com check preto + texto "ALL SET! / CHANGES SAVED" em cinza escuro e ×.
- **Alertas empilhados:** INFO (barra clara com quadradinho), **WARNING (Lime com listras diagonais)**, **ERROR (laranja-vermelho cheio)**, todos com borda preta.
- **Modal:** caixa com borda 2px e **sombra dura grande**, título "DELETE ITEM?" condensado, 2 linhas de texto, botões CANCEL (contorno) e DELETE (preto).
- **Tooltip:** caixa preta com seta lateral e texto branco em mono.

## 9. Motion e interação

- Movimento **seco e curto**: 80–150ms, `steps()` ou `linear`; sem easing suave, sem bounce.
- Hover: **inverter cores** (preto↔lima) ou deslocar o elemento `translate(-2px,-2px)` e aumentar a sombra para 6px.
- Active/pressed: `translate(4px,4px)` e sombra 0 (efeito de botão físico).
- Entradas: corte (clip-path) ou slide reto; marquees e rolagem de texto gigante funcionam bem.
- Foco: borda 4px + sombra Lime (nunca só `outline` padrão).
- `prefers-reduced-motion`: desligar marquees e deslocamentos.

## 10. Receita dos componentes-chave

```css
.br-btn{display:inline-flex;align-items:center;gap:.6rem;padding:.8rem 1.4rem;border:2px solid var(--br-ink);border-radius:0;
  font:400 1.1rem var(--f-display);letter-spacing:.04em;text-transform:uppercase;background:var(--br-paper);color:var(--br-ink);
  box-shadow:var(--br-shadow);cursor:pointer;transition:transform .1s linear,box-shadow .1s linear,background .1s linear;}
.br-btn:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 var(--br-ink);}
.br-btn:active{transform:translate(4px,4px);box-shadow:0 0 0 var(--br-ink);}
.br-btn--primary{background:var(--br-ink);color:var(--br-paper);}
.br-btn--lime{background:var(--br-lime);}
.br-btn[disabled]{background:var(--br-hatch),var(--br-paper);color:var(--br-grey);border-style:dashed;box-shadow:none;cursor:not-allowed;}

.br-input{width:100%;padding:.8rem 1rem;border:2px solid var(--br-ink);border-radius:0;background:var(--br-paper);font:400 1rem var(--f-body);text-transform:uppercase;}
.br-input:focus{outline:0;border-width:4px;padding:calc(.8rem - 2px) calc(1rem - 2px);box-shadow:var(--br-shadow-lime);}
.br-input[aria-invalid="true"]{border-color:var(--br-danger);}
.br-input[disabled]{background:var(--br-hatch);}

.br-tag{display:inline-block;padding:.15rem .6rem;border:2px solid var(--br-ink);font:700 12px var(--f-mono);letter-spacing:.1em;text-transform:uppercase;}
.br-tag--active{background:var(--br-lime);} .br-tag--new{background:var(--br-ink);color:var(--br-paper);} .br-tag--draft{background:var(--br-hatch);}
.br-hl{background:var(--br-lime);padding:0 .2em;}                       /* marca-texto */
.br-modal{border:2px solid var(--br-ink);box-shadow:8px 8px 0 var(--br-ink);background:var(--br-paper);}
```

## 11. Acessibilidade

- Contraste Ink/Paper ≈ 16:1 e Ink/Lime ≈ 15:1 são excelentes: mantenha essas combinações. **Nunca** use Lime ou Grey como cor de texto sobre Paper.
- Caixa-alta em texto longo prejudica a leitura: restrinja a títulos, botões, rótulos e tags; parágrafos em caixa mista.
- Estados não dependem só de cor (hachura, borda tracejada, ícone, texto "REQUIRED").
- Foco forte e visível (borda 4px + sombra); alvos ≥ 44px; animações curtas, com respeito a `prefers-reduced-motion`.
- Tipografia gigante deve usar `clamp()` e quebrar bem em telas pequenas (evite overflow horizontal).

## 12. Erros comuns

- **Suavizar demais**: raio, blur ou gradiente quebram o estilo. Raio 0 e sombra dura.
- Usar Lime em excesso (vira "neon"): é marca-texto, aparece em 1–3 pontos por tela.
- Fotos coloridas em alta saturação sem tratamento (use P&B/duotone).
- Perder estrutura: sem bordas e grade a tipografia gigante vira só barulho.
- Misturar caixa-alta com tracking largo na display condensada (a display é apertada; o tracking largo é do mono).
- Deixar tudo "alinhado demais" sem tensão: o estilo pede ao menos um elemento fora do eixo (sobreposição, rótulo vazando, rotação leve de 1–3°).

## 13. Combina com / não misture com

Combina com: tipografia luxury (como contraponto editorial em grandes títulos) e, com cuidado, dark mode (painéis invertidos). Não misture com: neomorfismo, glassmorphism, claymorphism (suavidade e translucidez contradizem a honestidade crua) nem pixel art (duas estéticas "gráficas" competindo).
