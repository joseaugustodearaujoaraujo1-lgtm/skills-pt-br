# Pixel Art (Pixel Kit / 8-bit retro UI)

> Fonte: 3 pranchas "PIXEL KIT" (`Foundations & Navigation`, `Actions & Forms`, `Content & Feedback`). Valores com *(derivado)* ou *(aprox.)* foram estimados a partir das imagens ou deduzidos para completar o sistema.

## 1. Essência

Interface que **assume a grade de pixels**: tudo é construído em blocos retangulares sem anti-aliasing, com **bordas de 3px em tinta escura, cantos "entalhados" (em degrau)**, **bevel** (aresta clara em cima/esquerda e escura embaixo/direita) nos botões, tipografia **pixelada em CAIXA-ALTA**, ícones de 16×16 em 1-bit e **tramado (dither) quadriculado** nos estados desabilitado, erro e carregamento. A paleta é **curta e terrosa** (areia, pedra, ardósia, tinta) com poucos acentos de "HUD de jogo" (verde, âmbar, vermelho-tijolo, moeda dourada). Parece um console portátil clássico, um RPG de 16-bit ou um software de 1990.

Sensação: nostálgica, lúdica, artesanal, "gamer cozy", com personalidade forte.

## 2. Quando usar e quando evitar

**Bom para:** sites de jogos indie, portfólios criativos/dev, comunidades e eventos geek, lojas de moedas/itens (estilo "game shop"), dashboards gamificados (HUD com vidas, moedas, conquistas), apps de hábitos gamificados, landing pages de jogos e ferramentas retrô, páginas 404 e easter eggs.

**Evitar quando:** o público é corporativo/sério (bancos, saúde, jurídico), o conteúdo é longo (a fonte pixel cansa em parágrafos), a acessibilidade para baixa visão é prioridade ou há muito texto em tamanho pequeno. Em apps de uso diário, use o estilo em doses (HUD, badges, ilustração) e mantenha o corpo de texto legível.

## 3. Paleta (curta, terrosa, 8-bit)

| Nome | Hex *(aprox.)* | Papel |
|---|---|---|
| **Sand** | `#D2C29E` | Fundo da página e áreas de contraste (areia/pergaminho) |
| **Light** | `#E3DDC0` | Fundo dos painéis, campos e botões secundários |
| **Stone** | `#A89F8E` | Trilhas, hover/pressed, texto desabilitado, barras de gráfico claras, linhas de placeholder |
| **Slate** | `#59636F` | Botões primários, item ativo, barras de gráfico escuras, preenchimento de progresso, footer |
| **Ink** | `#1A1325` | Texto, bordas, ícones, sombras duras |
| Verde *(HUD)* | `#6F9A63` | Sucesso ("ALL SET!"), badge Active, status online |
| Âmbar | `#C8A15A` | Warning, badge Pending |
| Vermelho-tijolo | `#8E4B3F` (texto `#B03A2E`) | Erro, Delete, tag de desconto, campo com erro |
| Moeda | `#E0A93B` | Moedas, itens de loja |

Regra: **no máximo 5 tons base por tela** + 1 acento semântico. Sem gradientes e sem transparências (tudo é cor chapada); profundidade vem de bevel e dither.

## 4. Tipografia

- **Fonte pixel em CAIXA-ALTA**. Display (título) muito grosso e quadrado; títulos de painel e corpo em pixel condensada.
- Sugestões web: display **"Press Start 2P"** ou **"Silkscreen"**/**"Pixelify Sans" 700**; corpo **"Pixelify Sans"**, **"VT323"** (tamanho grande) ou **"Jersey 10"**/**"Tiny5"**.
- Escala (Display / Title / Body / Tiny): display 48–64px, título 24–32px, corpo **16–20px** (nunca abaixo de 14px para pixel fonts), tiny 12–14px.
- Tamanhos devem ser **múltiplos do tamanho nativo da fonte** (ex.: 8, 16, 24, 32 px) para que os pixels caiam na grade e fiquem nítidos.
- Rótulos de painel: "01 PALETTE", número + nome, seguidos de **linha pontilhada** abaixo.
- `-webkit-font-smoothing: none; font-smooth: never; text-rendering: optimizeSpeed;` (efeito parcial dependendo do navegador).

## 5. Grade, bordas, cantos e espaçamento

- **Unidade-base de pixel**: `--px: 3px` (ou 2px/4px). Todos os tamanhos são múltiplos dela: bordas 1×/2×/3× (1px/2px/3px na prancha), espaçamento **8 / 16 / 24 / 32**.
- **Três tipos de canto** (a prancha mostra "SQUARE", "CUT", "STEP"): reto, **chanfro** (diagonal) e **degrau** (escada). Padrão do kit: **cantos em degrau (notched)** nos painéis e botões.
- Painéis: fundo Light, **borda Ink de 3px**, título com linha pontilhada, padding 16–24px.
- Divisores: linha **pontilhada** de 2px ou sólida de 3px.
- Layout em **colunas de painéis** de larguras variadas (2 colunas), gap de 16–24px, alinhados à grade; sem sobreposição.

## 6. Profundidade: bevel, sombra dura e dither

- **Bevel** (botões, inputs elevados, setas de paginação): aresta **clara** em cima/esquerda (Light), **escura** embaixo/direita (Stone ou Ink) com 3px. Pressed inverte (a aresta escura passa para cima/esquerda) e o botão desce 3px.
- **Sombra dura** de 3–6px em Ink, sem blur (modais, tooltips).
- **Dither (tramado quadriculado)** em Stone sobre Light para: Disabled, Locked, Error (com borda vermelha), skeleton.
- **Ícones/imagens:** `image-rendering: pixelated`; sprites escalados em múltiplos inteiros (2×, 3×, 4×).

```css
:root{
  --px:3px;
  --px-sand:#D2C29E; --px-light:#E3DDC0; --px-stone:#A89F8E; --px-slate:#59636F; --px-ink:#1A1325;
  --px-green:#6F9A63; --px-amber:#C8A15A; --px-red:#8E4B3F; --px-coin:#E0A93B;
  --f-px:"Pixelify Sans","VT323",monospace; --f-px-display:"Press Start 2P","Silkscreen",monospace;
}
html{image-rendering:pixelated;}
body{background:var(--px-sand);color:var(--px-ink);font:400 18px/1.3 var(--f-px);text-transform:uppercase;-webkit-font-smoothing:none;}
/* borda com cantos entalhados */
.px-box{background:var(--px-light);
  box-shadow:0 calc(var(--px)*-1) 0 0 var(--px-ink),0 var(--px) 0 0 var(--px-ink),
             calc(var(--px)*-1) 0 0 0 var(--px-ink),var(--px) 0 0 0 var(--px-ink);}
/* bevel */
.px-bevel{box-shadow:
  inset var(--px) var(--px) 0 0 #fff8,inset calc(var(--px)*-1) calc(var(--px)*-1) 0 0 var(--px-stone),
  0 calc(var(--px)*-1) 0 0 var(--px-ink),0 var(--px) 0 0 var(--px-ink),
  calc(var(--px)*-1) 0 0 0 var(--px-ink),var(--px) 0 0 0 var(--px-ink);}
/* dither 2x2 */
.px-dither{background-color:var(--px-light);
  background-image:conic-gradient(var(--px-stone) 25%,transparent 0 50%,var(--px-stone) 0 75%,transparent 0);
  background-size:4px 4px;}
.px-title{font:400 clamp(2rem,6vw,4rem)/1 var(--f-px-display);}
.px-label{border-bottom:2px dotted var(--px-ink);padding-bottom:6px;margin-bottom:12px;}
```

## 7. Ícones

- **Ícones pixel de 16×16** (renderizados 2–3×), **monocromáticos em Ink** com sombreado opcional em Stone: coração, moeda, engrenagem, cadeado, wifi, raio, carrinho, pause, mão (cursor), gráfico de barras, compartilhar, lápis, lixeira, "+", setas de **D-pad** (cima/baixo/esquerda/direita), nuvem de upload, lupa, documento, pasta, envelope, troféu, estrela, X, interrogação, triângulo de aviso.
- **HUD:** contador de moedas ("● 6"), **vidas em corações** (cheios, cinza para perdidos, meio coração), botão pause em **colchetes tracejados** (moldura de seleção).
- Avatares: retratos em pixel art dentro de moldura quadrada com borda Ink; grupos sobrepostos com "+3".

## 8. Componentes

### Navegação
- **Header & HUD:** ícone-logo quadrado + links WORK / PRICING / BLOG + lupa + botão **LOGIN** (Slate com texto Light). Abaixo, faixa HUD com moedas, corações e botão de pausa.
- **Sidebar:** itens com ícone pixel + rótulo (OVERVIEW, STATS, PROJECTS, MESSAGES com **badge Ink "3"**, SETTINGS); o item ativo tem uma **barrinha Ink** na borda esquerda.
- **Tabs:** estilo **pasta** com cantos entalhados (ALL ativa em Light "elevada", OPEN e DONE em Stone) e **segmentado** (DAY selecionado em Slate, WEEK, MONTH com bordas).
- **Breadcrumb:** `START > LIBRARY > DETAIL`; **paginação:** botões de seta com bevel e números (1 selecionado em Stone); **steps:** quadrados conectados por linha (preenchido Slate / Stone / vazios).
- **Links:** DEFAULT, HOVER (sublinhado), ACTIVE (sublinhado + negrito), DISABLED (Stone). **Footer:** barra Slate com ABOUT, TERMS, HELP, CONTACT em Light.
- **Bottom nav:** HOME (ativo: fundo Sand + barra Ink acima), SEARCH, SAVED (selo), PROFILE.

### Botões
- **PRIMARY:** Slate com texto Light, borda Ink, bevel. **SECONDARY/ENTER:** Light com borda Ink e bevel. **PRESSED:** Stone com bevel invertido. **DISABLED:** dither/Stone claro, texto Stone. **LOADING:** contorno + spinner de pontos pixel. **LOGIN / SIGN UP:** botões pequenos com bevel.
- **Icon buttons:** quadrados com bevel (coração, share, lápis, lixeira, "+"), versão pressionada em Stone; **D-pad** de 4 botões.

### Formulários
- **Inputs:** DEFAULT (borda Stone), **FOCUS** (borda Slate grossa + cursor piscante), **FILLED** (fundo Stone, texto Ink), **ERROR** (dither + borda vermelha + texto "REQUIRED" vermelho à direita), **LOCKED** (dither + cadeado).
- **Search:** campo com lupa + botão **GO** (Slate); chip "DESIGN" em Stone. **Password:** asteriscos "*****"; **OTP:** caixas com bevel, a vazia em Stone.
- **Select:** cabeçalho Stone com seta ▼; lista de opções em Light; **opção selecionada = linha Slate com texto Light**.
- **Toggle:** trilha Slate (ON) / Stone (OFF) com knob Light e borda Ink; **checkbox** quadrado com check; **radio** com anel e ponto.
- **Sliders:** VOLUME / BRIGHT com trilha Stone, preenchimento Slate e knob retangular; ícone de sol; **stepper** "− 2 +" com bevel.
- **Textarea:** caixa com linhas tracejadas de placeholder e contador "0/120"; **Upload:** botão Slate "UPLOAD" + ícone de documento + nuvem ↑.
- **Date:** "< JUNE 2024 >" com setas; **Rating:** "4.8" + estrelas pixel.

### Conteúdo e dados
- **Profile card:** retrato pixel, nome em CAIXA-ALTA grande, cargo, cidade, **ponto verde** de status e "…" (3 pontos).
- **Stat tiles:** 2×2 caixas com bevel: rótulo, número grande (24, 68, 142H, 86%), seta de tendência e delta (+12%).
- **Charts:** barras **alternando Stone e Slate** com contorno Ink, **linha tracejada** de tendência, eixo MON–SUN, título "OVERVIEW / THIS WEEK".
- **Progress & loading:** barras com contorno (BATTERY 75% Stone, STORAGE 72% Slate, valor dentro da barra); **spinner em fases** (4 círculos "pizza" de cheio a vazio); loader de **traços** progressivos.
- **Product card:** sprite do produto (poltrona), **tag vermelha "−20%"**, nome, estrela + "4.8 (128)", preço **vermelho** + preço antigo riscado, botões ADD TO CART / BUY NOW (Slate).
- **Pricing (loja de moedas):** 3 pacotes com pilhas de moedas (100 / 250 / 400), botões de preço ($0.99 / $1.99 / $2.99) e botão largo **RESTORE**.
- **List & table:** lista (ACCOUNT em destaque Stone, BILLING, SECURITY) e tabela NAME / STATUS / DATE com datas "3/3/24".
- **Badges:** marcador ● + texto (ACTIVE verde, PENDING âmbar, DRAFT cinza, NEW vermelho, DESIGN, WEB); avatares pixel + "+3".

### Feedback
- **Notificações:** barras cheias com borda: **ALL SET! / CHANGES SAVED (verde, check)**, **INFO (Stone, ícone "i")**, **WARNING (âmbar, triângulo)**, **ERROR (vermelho-tijolo, X)**, e **BONUS** (moldura de conquista com troféu e número).
- **Modal:** caixa com borda grossa, botão X quadrado, título "DELETE ITEM?", botões **CANCEL** (contorno) e **DELETE** (vermelho-tijolo).
- **Tooltip:** balão com cauda em degrau; **"? QUESTION"** como ajuda/FAQ.

## 9. Motion e interação

- **Animação em quadros (`steps()`)**, nunca easing suave: `animation-timing-function: steps(4)`; 8–12 fps. Sprites com `background-position` em sprite sheet; cursor piscante (`steps(2)` a 1s); spinner em fases.
- Hover: troca de cor para Stone ou deslocamento de 3px (um "pixel" inteiro); pressed: botão desce 3px e inverte o bevel.
- Transições entre telas: wipe/dither (máscara quadriculada) ou corte seco; textos podem aparecer letra a letra (typewriter com `steps(n)`).
- Som opcional (bleep curto) em cliques, com mute por padrão e controle visível.
- `prefers-reduced-motion`: desligar piscar, typewriter e sprites animados.

## 10. Receita dos componentes-chave

```css
.px-btn{display:inline-block;padding:10px 20px;border:0;cursor:pointer;font:400 18px var(--f-px);text-transform:uppercase;
  background:var(--px-slate);color:var(--px-light);
  box-shadow:inset 3px 3px 0 #ffffff33,inset -3px -3px 0 #00000055,
             0 -3px 0 0 var(--px-ink),0 3px 0 0 var(--px-ink),-3px 0 0 0 var(--px-ink),3px 0 0 0 var(--px-ink);
  transition:none;}
.px-btn--secondary{background:var(--px-light);color:var(--px-ink);}
.px-btn:hover{background:#6a7480;}
.px-btn:active{transform:translateY(3px);box-shadow:inset 3px 3px 0 #00000055,inset -3px -3px 0 #ffffff22,
  0 -3px 0 0 var(--px-ink),0 3px 0 0 var(--px-ink),-3px 0 0 0 var(--px-ink),3px 0 0 0 var(--px-ink);}
.px-btn:focus-visible{outline:3px dashed var(--px-ink);outline-offset:4px;}
.px-btn[disabled]{background-color:var(--px-light);color:var(--px-stone);cursor:not-allowed;
  background-image:conic-gradient(var(--px-stone) 25%,transparent 0 50%,var(--px-stone) 0 75%,transparent 0);background-size:4px 4px;}

.px-input{width:100%;padding:8px 12px;border:0;background:var(--px-light);color:var(--px-ink);font:400 18px var(--f-px);text-transform:uppercase;
  box-shadow:0 -3px 0 0 var(--px-stone),0 3px 0 0 var(--px-stone),-3px 0 0 0 var(--px-stone),3px 0 0 0 var(--px-stone);}
.px-input:focus{outline:0;box-shadow:0 -3px 0 0 var(--px-slate),0 3px 0 0 var(--px-slate),-3px 0 0 0 var(--px-slate),3px 0 0 0 var(--px-slate);caret-color:var(--px-ink);}
.px-input[aria-invalid="true"]{box-shadow:0 -3px 0 0 var(--px-red),0 3px 0 0 var(--px-red),-3px 0 0 0 var(--px-red),3px 0 0 0 var(--px-red);}

.px-bar{height:24px;background:var(--px-light);box-shadow:0 -3px 0 0 var(--px-ink),0 3px 0 0 var(--px-ink),-3px 0 0 0 var(--px-ink),3px 0 0 0 var(--px-ink);}
.px-bar>i{display:block;height:100%;background:var(--px-slate);width:72%;}
@keyframes px-blink{50%{opacity:0}} .px-caret{animation:px-blink 1s steps(2) infinite;}
@media (prefers-reduced-motion:reduce){.px-caret{animation:none}}
```

## 11. Acessibilidade

- Ink `#1A1325` sobre Light/Sand tem contraste altíssimo (≈13:1); **Stone sobre Light** ≈ 2:1: use só para estados desabilitados e elementos decorativos, nunca para texto necessário.
- Fonte pixel em caixa-alta **reduz a legibilidade**: corpo ≥ 16px, entrelinha ≥ 1.3, e parágrafos longos em fonte sans neutra de apoio (ex.: "VT323" não serve para textos longos).
- Não dependa só do dither/cor: erro = borda vermelha **+ "REQUIRED"**; estados com ícone/texto.
- Foco visível: contorno tracejado de 3px (coerente com o estilo); alvos ≥ 44px (escale os sprites).
- Respeitar `prefers-reduced-motion`; ofereça mute de som.

## 12. Erros comuns

- **Anti-aliasing e blur:** sombras suaves, gradientes, `border-radius` arredondado e imagens redimensionadas com interpolação quebram o estilo. Use `image-rendering: pixelated`, cores chapadas e cantos em degrau.
- **Escala fracionária:** pixels de tamanhos inconsistentes (1px, 1.5px, 3px) na mesma tela; use um único `--px`.
- Paleta grande demais ou cores muito saturadas; o charme está na limitação.
- Ícones vetoriais finos misturados com ícones pixel.
- Fontes pixel em tamanhos que não casam com a grade (borram).
- Esquecer os estados (pressed/disabled/error) com bevel e dither.
- Usar pixel art em **todo** o texto longo: mantenha legibilidade.

## 13. Combina com / não misture com

Combina com: minimalismo de paleta terrosa (para equilibrar) e, em doses, dark mode (tema "noite do console"). Não misture com: glassmorphism, neomorfismo, claymorphism, tipografia luxury e bento grid (linguagens suaves/refinadas contradizem o bloco chapado) nem com brutalismo (duas estéticas gráficas fortes competem).
