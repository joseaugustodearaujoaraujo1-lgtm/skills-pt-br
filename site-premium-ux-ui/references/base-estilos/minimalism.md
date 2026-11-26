# Minimalism (Minimal / Calm Organic)

> Fonte: 3 pranchas "MINIMAL / KIT" (`Foundations & Navigation`, `Content & Feedback`, `Actions & Forms`). Valores com *(derivado)* foram deduzidos para completar o sistema.

## 1. Essência

Interface **silenciosa e orgânica**: fundo marfim quente, **uma** cor de acento (verde-sálvia), tipografia fina e muito espaço em branco. Os elementos são pills e cards suaves com sombras muito difusas, ícones de traço fino e rótulos em caixa-alta com espaçamento largo, como uma loja de cerâmica, um estúdio de yoga ou um caderno japonês. Nada grita; a hierarquia nasce de tamanho, peso e espaço, não de cor ou decoração.

Sensação: calma, artesanal, "quiet luxury", editorial leve.

## 2. Quando usar e quando evitar

**Bom para:** marcas de bem-estar, clínicas de estética, cerâmica/decoração/moda slow, portfólios, apps de meditação/notas/hábitos, landing pages de serviços premium, e-commerce de poucos produtos, blogs e documentação.

**Evitar quando:** a marca precisa de energia, urgência ou contraste forte (promoções agressivas, gaming, fintech "ousada"), ou há muitos dados densos. Cuidado também com o excesso de vazio: pouco conteúdo + muito espaço = página vazia.

## 3. Paleta (naturais, dessaturados)

| Nome | Hex | Papel |
|---|---|---|
| **Sage** | `#6B7F6E` | Acento primário: botões, item ativo, ícone selecionado, gráfico em destaque, foco |
| **Moss** | `#A7B8A7` | Acento secundário: barras de gráfico, trilhas preenchidas, ícones suaves |
| **Mist** | `#D9E1D9` | Fundos de seleção/hover (linha de tabela, opção selecionada), badges leves |
| **Ivory** | `#F4EFE8` | Fundo da página (marfim quente, com leve textura de papel) |
| **Sand** | `#C9BDAF` | Neutro quente: título grande da prancha, imagens placeholder, badge "Pending", botão de lixeira |
| Texto principal *(derivado)* | `#1F2A22` (verde quase preto) | Títulos e corpo |
| Texto secundário *(derivado)* | `#6B6F66` | Rótulos, legendas |
| Painel/card *(derivado)* | `#F8F4EE` com borda `rgba(31,42,34,.06)` | Superfície um degrau acima do Ivory |
| Branco quente *(derivado)* | `#FFFFFF`–`#FBF9F5` | Inputs, toasts, modais |
| Erro *(aprox.)* | terracota `#B5645A` (gradiente p/ `#C98277` no botão Delete) | Erro, destrutivo |
| Alerta *(aprox.)* | ocre `#B98F4B` | Warning |
| Info *(aprox.)* | sage | Info |

Regra: **1 cor de marca (Sage) + neutros quentes**. Vermelho/ocre só para feedback.

## 4. Tipografia

- Família: **Inter** (Light 300, Regular 400, Medium 500, Semibold 600). Alternativas: Manrope, Instrument Sans.
- **Títulos de prancha/hero:** caixa-alta, peso Light, **tracking muito largo (0.2em+)**, cor Sand (suave) — "MINIMAL / KIT". Subtítulo em caixa-alta, peso Regular, tracking largo, cor escura.
- **Rótulos de seção:** "01 · COLOR PALETTE", caixa-alta, ~12px, tracking 0.16–0.2em, cinza-marrom.
- Títulos de card e nomes: Semibold 600 (ex.: "Alex Morgan", "Ceramic Vase").
- Preços e KPIs: números grandes em Semibold/Bold, com a unidade pequena e leve ("/month").
- Corpo 15–16px, entrelinha 1.5–1.6. Sem itálico decorativo; no máximo uma serifada de contraste em hero editorial *(opcional)*.

## 5. Espaçamento, grade e raios

- Escala: **4, 8, 16, 24, 32** (visual da prancha) + 48/64/96 para seções.
- Raios: **8px** (inputs pequenos, OTP, tooltips), **16px** (cards internos, dropdown), **24px** (cards), **Full** (botões, pills, header, bottom nav). Os painéis grandes usam ~28–32px.
- Layout em grid de 2 colunas (cards iguais) no desktop; 1 coluna no mobile.
- **Respiro generoso**: padding interno dos cards 24–32px; entre cards 24px; seções com 96px+.
- Alinhamento rígido à esquerda; texto em colunas estreitas (50–65 caracteres).

## 6. Superfícies, sombras e bordas

- Cards em **ivory um pouco mais claro** que o fundo, com sombra **muito difusa e baixa**: `0 8px 24px rgba(60,50,40,.08)` + realce interno sutil `inset 0 1px 0 rgba(255,255,255,.7)`.
- Borda de 1px quase invisível (`rgba(31,42,34,.06–.1)`) ou nenhuma.
- Inputs e itens "elevados" (toast, modal, dropdown) em branco quente com sombra um pouco maior.
- **Sem gradientes** (exceto o botão destrutivo, bem sutil), sem glow, sem blur.
- Divisores: hairline de 1px em Sand a 40%.

```css
:root{
  --mn-bg:#F4EFE8; --mn-panel:#F8F4EE; --mn-white:#FFFFFF;
  --mn-ink:#1F2A22; --mn-ink-2:#6B6F66;
  --mn-sage:#6B7F6E; --mn-moss:#A7B8A7; --mn-mist:#D9E1D9; --mn-sand:#C9BDAF;
  --mn-danger:#B5645A;
  --mn-line:rgba(31,42,34,.08);
  --mn-shadow:0 8px 24px rgba(60,50,40,.08), inset 0 1px 0 rgba(255,255,255,.7);
  --mn-shadow-pop:0 12px 32px rgba(60,50,40,.14);
  --mn-r-sm:8px; --mn-r-md:16px; --mn-r-lg:24px; --mn-r-full:999px;
}
body{background:var(--mn-bg);color:var(--mn-ink);font:400 16px/1.6 Inter,system-ui,sans-serif;}
.mn-card{background:var(--mn-panel);border:1px solid var(--mn-line);border-radius:28px;padding:28px;box-shadow:var(--mn-shadow);}
.mn-eyebrow{font:500 12px/1 Inter,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:var(--mn-ink-2);}
```

## 7. Ícones e imagens

- Ícones **outline de 1.5px**, cantos arredondados, cor tinta escura (ou Sage quando ativos): Home, Search, User, Bell, Heart, Mail, Calendar, Settings, Cart, Arrow-right; também share, pencil, trash, upload, filter/sliders, eye, check, info, warning, error, location pin, credit-card, shield-check, menu.
- Tamanho 20–24px; sempre com rótulo em navegação.
- Imagens: tiles em Sand/Mist com ilustração mínima (ex.: vaso em traço fino); fotos devem ser dessaturadas/quentes. Avatares circulares com silhueta e um **ponto verde-sálvia** de status.
- Moldura de imagem com raio 16–24px.

## 8. Componentes

### Navegação
- **Header:** pill flutuante (raio Full) em marfim claro com sombra suave: logo (círculo Sand + "LOGO"), links (Home ativo com sublinhado Sage de 2px, Pricing, Contact) e **CTA "Login"** em pill Sage com texto branco.
- **Menu mobile:** barra com hambúrguer, "Logo" central e avatar com ponto de status; dropdown em card branco com itens (o ativo em semibold).
- **Tabs:** (a) sublinhadas: item ativo semibold com barra Sage de 3px, resto regular; (b) segmentado pill (Day / **Week** / Month) com contorno fino e o ativo preenchido Sage com texto branco.
- **Breadcrumb:** "Home / Library / Detail" com barras como separadores, último em tinta.
- **Paginação:** "‹ Back  1  (2)  3  Next ›"; a atual é círculo Sage com número branco.
- **Steps:** círculos conectados; concluídos em Sage com número branco, futuros com contorno cinza; linha Sage nos trechos concluídos.
- **Links:** Default (tinta, sublinhado), Hover (sublinhado mais grosso), Active (Sage, semibold), Disabled (cinza claro).
- **Footer:** hairline no topo, logo pequeno, links separados por "·" e "© 2026".
- **Bottom navigation:** pill flutuante com 4 itens ícone+rótulo; o ativo em Sage com um ponto abaixo.

### Botões
- **Primary:** pill Sage, texto branco, ícone → opcional.
- **Secondary:** pill transparente com borda Sage 1.5px e texto tinta.
- **Ghost:** só texto.
- **Pressed:** Sage mais escuro (`#586B5B`); **Disabled:** cinza claro, texto cinza.
- **Icon buttons:** círculos com contorno (heart, edit, upload), um preenchido Sage (share), um Sand (lixeira), um desabilitado, um com "Loading" + spinner, e **FAB "+"** circular Sage com sombra.

### Formulários
- **Text input:** pill branca com borda hairline; **Focused:** borda Sage 2–2.5px; **Error:** borda terracota + helper "Required" pequeno; **Disabled:** cinza, sem borda.
- **Search:** pill com lupa, placeholder claro, divisor vertical e ícone de filtros; estado preenchido com "×" para limpar e cursor visível.
- **Password:** pontos e ícone de olho; **OTP:** 4 caixas (raio 8px), a ativa com borda Sage grossa.
- **Select:** pill com chevron; dropdown em card branco, opção selecionada em Mist com check Sage.
- **Toggle:** trilha Sage ligada / cinza desligada, knob branco; **Checkbox:** quadrado arredondado Sage com check; **Radio:** anel Sage com ponto.
- **Slider:** trilha fina Moss/Sand com preenchimento Sage e knob branco com borda; versão de intervalo (2 knobs); **Stepper:** "− 2 +" em caixa com borda.
- **Textarea:** campo branco com contador "0/120"; **Upload:** área com borda **tracejada** fina e ícone de upload.
- **Date picker:** card branco com mini calendário; dia selecionado = círculo Sage. **Rating:** estrelas Sage (com meia estrela).

### Conteúdo
- **Profile card:** avatar circular com ponto de status, nome em semibold, cargo, localização com pin e botão "…" circular; abaixo, barras de placeholder.
- **Product card:** tile Sand com ícone/ilustração, coração no canto, título, estrelas Sage, preço grande e pill "Add to cart".
- **Pricing card:** plano ("Starter"), preço grande + "/month", 3 itens com check e botão Sage de largura total.
- **Stats & chart:** tile branco com "Revenue 84%" e sparkline Sage; barras finas arredondadas em Moss com **uma barra Sage escura** de destaque.
- **List:** linhas com ícone outline, rótulo e chevron, separadas por hairline. **Accordion:** "Question" aberto (chevron para baixo, texto em barras), "Collapsed" fechado.
- **Data table:** cabeçalho em cinza (Name, Status, Date ⌄), linhas separadas por hairline, bolinhas de status, linha selecionada com fundo **Mist** (raio 8px) e barra Sage de 3px na esquerda.
- **Badges:** *Active* Sage sólido/branco, *Pending* Sand, *Draft* cinza claro; **chips** com "×" e contorno; **avatares** sobrepostos com círculo "+3".
- **Progress:** barra fina Sage sobre trilha cinza com "72%"; anel 60% Sage; spinner de traços; **skeleton** com barras cinza arredondadas.

### Feedback
- **Toast:** card branco com círculo Sage + check, título "All set!" semibold, texto menor e "×".
- **Alertas:** linha slim com ícone circular (Info em Sage, Warning em ocre, Error em terracota) e rótulo.
- **Modal:** card branco com título, 2 barras, *Cancel* (texto) e *Delete* (pill terracota com gradiente sutil).
- **Tooltip:** bolha **escura** (quase preta) com texto branco e seta, sobre ícone "i" em círculo cinza.

## 9. Motion e interação

- Transições de **200–300ms**, `ease-out`/`cubic-bezier(.2,.7,.2,1)`; movimentos pequenos (translateY 2–4px, opacity).
- Hover: escurecer 6–8% o Sage, elevar o card em 2px com sombra ligeiramente maior; links sublinham.
- Entrada de seções com fade+slide de 12–16px, escalonada; nada de bounce, parallax pesado ou loops.
- Foco: anel Sage de 2px com offset 2px.
- `prefers-reduced-motion`: remover slide, manter fade curto ou nenhum.

## 10. Receita dos componentes-chave

```css
.mn-btn{display:inline-flex;align-items:center;gap:.5rem;padding:.8rem 1.6rem;border-radius:999px;border:1.5px solid transparent;
  font:500 15px Inter,sans-serif;cursor:pointer;transition:background .2s,box-shadow .2s,transform .2s;}
.mn-btn--primary{background:var(--mn-sage);color:#fff;}
.mn-btn--primary:hover{background:#5d705f;transform:translateY(-1px);box-shadow:0 6px 16px rgba(107,127,110,.28);}
.mn-btn--secondary{background:transparent;border-color:var(--mn-sage);color:var(--mn-ink);}
.mn-btn--ghost{background:transparent;color:var(--mn-ink);}
.mn-btn:focus-visible{outline:2px solid var(--mn-sage);outline-offset:2px;}
.mn-btn[disabled]{background:#e6e1da;color:#a6a49d;box-shadow:none;cursor:not-allowed;}

.mn-input{width:100%;padding:.8rem 1.2rem;border:1px solid var(--mn-line);border-radius:999px;background:#fff;font:400 16px Inter,sans-serif;color:var(--mn-ink);}
.mn-input:focus{outline:0;border:2px solid var(--mn-sage);padding:calc(.8rem - 1px) calc(1.2rem - 1px);}
.mn-input[aria-invalid="true"]{border-color:var(--mn-danger);}

.mn-header{display:flex;align-items:center;gap:2rem;padding:.6rem .8rem .6rem 1.2rem;border-radius:999px;background:var(--mn-panel);box-shadow:var(--mn-shadow);}
.mn-badge{padding:.25rem .8rem;border-radius:999px;font:500 13px Inter,sans-serif;}
.mn-badge--active{background:var(--mn-sage);color:#fff;} .mn-badge--pending{background:var(--mn-sand);color:var(--mn-ink);} .mn-badge--draft{background:#e9e5de;color:var(--mn-ink-2);}
```

## 11. Acessibilidade

- Sage `#6B7F6E` sobre branco dá ≈4.3:1: use texto branco **semibold/16px+** nos botões ou escureça para `#5D705F` (≥ 5:1) quando o texto for pequeno.
- Texto de apoio em `#6B6F66` sobre Ivory ≈4.6:1; não vá mais claro.
- Rótulos em caixa-alta com tracking largo precisam de ≥ 12px e boa cor; não use Sand (#C9BDAF) para texto informativo (só decorativo).
- Foco sempre visível; alvos ≥ 44px; não dependa só de cor para estados (use ícones/texto).

## 12. Erros comuns

- Adicionar uma segunda cor de acento ou gradientes "para dar vida": quebra a calma.
- Sombras fortes e escuras; elas devem quase não ser percebidas.
- Pouco peso de tipografia (tudo Light): mantenha contraste de peso (Light para display, Medium/Semibold para dados).
- Vazio sem intenção: espaço em branco precisa de alinhamento e ritmo.
- Ícones de preenchimento sólido misturados com outline.
- Caixa-alta em parágrafos (só rótulos e eyebrows).

## 13. Combina com / não misture com

Combina com: tipografia luxury (mais editorial), neomorfismo suave (mesma calma), bento grid (para organizar blocos). Não misture com: brutalismo, pixel art, cyberpunk, dark mode saturado (opostos de tom).
