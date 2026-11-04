# Bento Grid (Bento Kit / Layout em mosaico modular)

> Fonte: 3 pranchas "Bento Kit." (`Foundations & Navigation`, `Actions & Forms`, `Content & Feedback`), formato paisagem. Valores com *(derivado)* foram deduzidos para completar o sistema.

## 1. Essência

Interface organizada como uma **marmita japonesa (bento)**: um mosaico de **cartões brancos arredondados de tamanhos diferentes**, encaixados numa **grade modular** com espaçamento uniforme sobre um fundo cinza-claro. Cada cartão conta **uma única ideia** (um KPI, um gráfico, um formulário, uma lista), e a hierarquia vem do **tamanho e da posição do bloco**, não de decoração. Uma cor de acento vibrante (**laranja**) e preto/branco/cinza dão o resto. Pequenos **objetos 3D laranja** (casa, cursor, sino, avatar) servem de toque lúdico.

Sensação: moderna, organizada, "produto Apple/Linear/Vercel", clara e escaneável, fácil de responder em qualquer tela.

## 2. Quando usar e quando evitar

**Bom para:** landing pages de SaaS/produto (mostrar vários recursos de uma vez), dashboards, páginas "sobre"/portfólio, apresentações, páginas de recursos, perfis e links hub, apps de produtividade. É o estilo que melhor organiza **muito conteúdo heterogêneo** em pouco espaço.

**Evitar quando:** o conteúdo é um fluxo linear longo (artigos, formulários extensos), ou quando todos os blocos teriam a mesma importância (vira uma grade comum). Cuidado com excesso de tiles com pouco conteúdo ("grade vazia").

## 3. Paleta

| Nome | Hex | Papel |
|---|---|---|
| **Snow** | `#FFFFFF` | Fundo dos cartões, inputs |
| **Fog** | `#E5E4E2` | Fundo da página, trilhas, estados desabilitados (cinza quente) |
| **Ink** | `#1A1A1A` | Texto, botão secundário preto, tooltip, badge "New" |
| **Orange** | `#FF6B00` | Acento: botão primário, item ativo, foco, gráfico, toggle, estrelas |
| **Sand** | `#F3D9C4` | Tint do acento: hover, linha selecionada, alerta Warning, chip de valor |
| Orange escuro *(aprox.)* | `#C9570A` | Estado pressed |
| Cinza médio *(derivado)* | `#B8B6B2` | Ícones/bordas suaves, placeholder |
| Texto secundário *(derivado)* | `#6F6D69` | Legendas, parágrafos de apoio |
| Erro *(aprox.)* | `#C8352B` texto, fundo rosado `#FBE3E1` | Campo/alerta de erro |

Regra: **um acento (laranja) + neutros quentes**. O laranja aparece em 1–2 pontos por cartão.

## 4. Tipografia

- Família: **geométrica moderna, forte e legível**: *Plus Jakarta Sans*, *Manrope*, *Inter Display* ou *Satoshi*. Pesos 400/500/600/700/800.
- **Título da seção:** muito grande, **bold 700–800**, tracking ligeiramente negativo (−0.02em), terminando com **ponto final** ("Bento Kit."). O subtítulo na linha seguinte usa o mesmo tamanho em peso mais leve ("Foundations & Navigation.").
- **Rótulo de cartão:** caixa-alta, semibold/bold ~18px na prancha (14–16px em produção), cor Ink, **sem tracking largo** ("SIDEBAR", "COLOR & RADIUS").
- **Números de KPI/preço:** bold grande (24, 68, 142H, $12, 4.8), com delta pequeno e ícone ↗.
- Corpo 15–16px, cinza `#6F6D69`; parágrafos de apresentação em coluna estreita no canto superior direito do cabeçalho.

## 5. Grade, espaçamento e raios (o coração do estilo)

- **Grade modular** de 12 colunas (ou 4–6 no mobile) com **gap constante** de 16–24px. Os cartões ocupam **spans variados**: 1×1, 2×1, 1×2, 3×1, 2×2; ao menos um bloco **alto** (sidebar/perfil) e um **largo** (header/gráfico).
- Os blocos **alinham-se pelas bordas** da grade: não há "buracos" nem cartões soltos; blocos vazios (um cartão branco sem conteúdo) são aceitáveis como respiro.
- **Raios: 12 / 20 / 28px e Full.** Cartões externos 24–28px; elementos internos 12–20px; botões, tags e inputs pill. **Raio aninhado:** raio interno = raio externo − padding (ex.: externo 28 / padding 12 → interno 16).
- Padding interno de cartões 20–28px; entre rótulo e conteúdo 16px.
- Tiles aninhados: um cartão cinza-claro (Fog) pode conter cartões brancos menores (ex.: 3 stat tiles dentro de um container).
- Objetos 3D laranja podem **vazar para fora do cartão** (casa sobre a borda, sino sobre o toast, cursor sobre os botões).

## 6. Superfícies, sombras e bordas

- Cartões **brancos sem borda**, sombra **muito sutil**: `0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.04)`. A separação vem do contraste branco × cinza Fog, não da sombra.
- Elementos internos (inputs, pills) usam **borda 1px** `#D8D6D2` ou fundo Fog; foco com borda laranja + halo `0 0 0 4px rgba(255,107,0,.18)`.
- Ativos laranja podem ter **glow suave**: `0 8px 20px rgba(255,107,0,.3)` (item "Overview", FAB).
- **Sem gradientes** de decoração (exceto o preenchimento do gráfico em área: laranja → transparente).
- Fundo da página: Fog sólido (ou com um leve gradiente `#E8E7E4 → #E2E1DE`).

```css
:root{
  --bt-snow:#fff; --bt-fog:#E5E4E2; --bt-ink:#1A1A1A; --bt-orange:#FF6B00; --bt-sand:#F3D9C4;
  --bt-muted:#6F6D69; --bt-line:#D8D6D2;
  --bt-gap:20px; --bt-r-card:28px; --bt-r-inner:16px;
  --bt-shadow:0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.04);
  --bt-glow:0 8px 20px rgba(255,107,0,.30);
}
body{background:var(--bt-fog);color:var(--bt-ink);font:400 16px/1.5 "Plus Jakarta Sans",Manrope,system-ui,sans-serif;}
.bento{display:grid;grid-template-columns:repeat(12,1fr);gap:var(--bt-gap);}
.tile{background:var(--bt-snow);border-radius:var(--bt-r-card);padding:24px;box-shadow:var(--bt-shadow);min-width:0;}
.tile__label{font:700 .9rem/1 inherit;letter-spacing:0;text-transform:uppercase;margin-bottom:16px;}
.span-3{grid-column:span 3}.span-4{grid-column:span 4}.span-6{grid-column:span 6}.span-8{grid-column:span 8}
.row-2{grid-row:span 2}
@media (max-width:900px){.bento{grid-template-columns:repeat(2,1fr)} .tile{grid-column:span 2} .tile--half{grid-column:span 1}}
@media (max-width:560px){.bento{grid-template-columns:1fr}.tile,.tile--half{grid-column:auto}}
```

## 7. Ícones e imagens

- Ícones **outline 1.75–2px, cantos arredondados**, cor Ink (laranja quando ativos): home, analytics (barras), folder/projects, message, settings, search, user, bell, image-edit, mail, calendar, cart, share/copy, bookmark, credit-card, shield-check, heart, pencil, trash, mic, filter, eye-off, upload-cloud, check, info, warning, redes sociais em círculos pretos.
- **Objetos 3D laranja/branco** com acabamento fosco-brilhante (casa, cursor de mouse, sino de notificação, avatares 3D estilo "boneco"): servem como ilustração de destaque, 1–2 por tela.
- Fotos de produto em fundo cinza neutro com cantos de 16–20px; avatares em círculo.
- Logo: marca simples (letra "S" estilizada) em laranja/preto + wordmark "Studio".

## 8. Componentes

### Navegação
- **Sidebar (cartão alto):** logo, itens com ícone + rótulo; **ativo = pill laranja com texto branco e glow** ("Overview"); demais em Ink; badge **preto** com contagem ("Messages 3"); no rodapé, bloco laranja "Upgrade" com um mini toggle branco.
- **Header (cartão largo):** logo circular laranja, **pill de navegação** com links (Discover ativo em laranja com sublinhado, Pricing, Blog), busca e botão **"Login" preto**. **Header mobile:** hambúrguer, logo, avatar 3D.
- **Tabs:** sublinhadas (Open ativo em laranja com linha) e **segmentado** (Day / **Week preto** / Month sobre trilha Fog).
- **Steps verticais:** nós laranja conectados por linha (Account, Details concluídos; Review com anel; Finish cinza); **paginação:** ‹ 1 **[2 laranja]** 3 ›.
- **Breadcrumb:** "Start / Library / Detail"; **bottom nav:** Home ativo em laranja com barra superior, Search, Saved, Profile.
- **Links:** Default (sublinhado), Hover (**pill Sand**), Active (laranja bold), Disabled (cinza); **footer** com links e ícones sociais pretos.

### Botões
- **Primary:** pill **laranja**, texto branco, ícone ↗. **Secondary:** pill **preta**, texto branco. **Outline:** pill branca com borda preta. **Ghost:** só texto.
- **Pressed:** laranja escuro. **Disabled:** cinza Fog, texto cinza. **Loading:** cinza com spinner laranja parcial.
- **Login & Sign Up:** pills com contorno.
- **Icon buttons:** círculos brancos com borda (heart, share, pencil, trash) e **FAB "+" laranja com glow**.

### Formulários
- **Text input:** pill com borda 1px cinza; **Focus:** borda laranja + halo; **Filled:** rótulo pequeno acima do valor ("Filled / Alex") em fundo Fog; **Error:** fundo rosado, borda vermelha, texto "Required" pequeno; **Locked:** Fog com texto cinza.
- **Search:** pill cinza com lupa, microfone e filtro; **Password:** pontos + olho cortado; **OTP:** quadrados Fog de raio 12px, ativo com borda laranja.
- **Select:** pill com borda preta e chevron; menu branco; **opção selecionada = laranja com texto branco e check**.
- **Search & booking:** campos retangulares de raio 12 com rótulo pequeno e valor grande (Destination: Lisbon, Check in: Jun 15, Check out, Guests: 2 adults) + botão preto "Book Now ↗".
- **Toggle:** laranja ligado/cinza desligado; **checkbox** laranja com check; **radio** com anel e ponto laranja.
- **Sliders:** trilha Fog, preenchimento laranja, knob branco com sombra; valor em **chip Sand** ("40%"); range de dois knobs; **stepper** "− 2 +" circular.
- **Textarea:** área Fog com contador "0/120"; **Upload:** área tracejada com ícone de nuvem.
- **Calendar:** grade limpa, dia selecionado **círculo laranja**; **Rating:** "4.8" enorme + estrelas laranja (com meia estrela).

### Conteúdo e dados
- **Profile card:** avatar 3D laranja, nome, cargo, localização, estatísticas em 3 colunas (Posts 128 | Followers 4.2K | Following 310) e botões **Follow** (laranja) / **Message** (contorno).
- **Stat tiles:** três cartões brancos dentro de um container Fog: rótulo, número grande, ícone ↗ e delta "+12%".
- **Line chart:** linha **laranja suave** com **área em gradiente laranja→transparente**, grade horizontal fina, **tooltip escuro** ("68%") com ponto laranja, eixo Mon–Sun, seletor "This week ⌄".
- **Pricing:** título centralizado ("Starter"), divisor, "**$12**/month", checklist com barras, botão laranja largura total.
- **Progress:** anel 75% laranja sobre trilha Fog, barra "Storage 72%", spinner de traços e skeleton em barras cinza.
- **List & table:** lista (Account selecionado em Fog, Billing, Security, com chevron) + tabela (Name / Status com ponto laranja / Date) com **linha selecionada em Sand**.
- **Product card:** foto em fundo cinza (poltrona com almofada laranja), chip preto "−20%", nome, estrelas laranja + "4.8 (128)", **$199.99 com preço antigo riscado**, swatches (laranja, cinza, ardósia), stepper, botões "Add to Cart" (contorno) e "Buy Now ↗" (preto).
- **Badges:** Active (laranja), Pending (contorno), Draft (cinza), New (preto); chips com "×" nos dois lados; **avatares 3D** sobrepostos + "+3".

### Feedback
- **Toast:** fundo **Sand**, círculo laranja com check, "All set!" bold, "Changes saved" e "×" (sino 3D laranja sobreposto como ornamento).
- **Alertas:** Info (cinza), Warning (**Sand/pêssego**), Error (**rosa claro**), com ícone outline e rótulo.
- **Modal:** cartão branco sobre scrim cinza-escuro suave, "Delete item?", duas linhas, **Cancel** (cinza) e **Delete** (preto).
- **Tooltip:** bolha **escura** com seta, sobre círculo cinza. **Accordion:** "Question" com chevron.

## 9. Motion e interação

- Transições **200–300ms**, `cubic-bezier(.2,.8,.2,1)`. Hover de cartão: `translateY(-4px)` + sombra um pouco maior; imagens internas dão `scale(1.03)`.
- **Entrada em cascata:** os tiles entram em sequência (fade + `translateY(16px)`, delay de 40–60ms por tile).
- Cartões interativos ("bento interativo"): cursor-spotlight (radial-gradient seguindo o mouse), contadores animados nos KPIs, gráficos que "desenham" a linha.
- Ao reordenar, use `FLIP`/`View Transitions` para suavizar mudanças de span.
- `prefers-reduced-motion`: remover cascata e contadores; manter estados de hover simples.

## 10. Receita dos componentes-chave

```css
.bt-btn{display:inline-flex;align-items:center;gap:.5rem;padding:.8rem 1.6rem;border:1.5px solid transparent;border-radius:999px;font:600 1rem inherit;cursor:pointer;transition:transform .2s,background .2s,box-shadow .2s;}
.bt-btn--primary{background:var(--bt-orange);color:#fff;} .bt-btn--primary:hover{transform:translateY(-1px);box-shadow:var(--bt-glow);}
.bt-btn--secondary{background:var(--bt-ink);color:#fff;}
.bt-btn--outline{background:#fff;border-color:var(--bt-ink);color:var(--bt-ink);}
.bt-btn:active{background:#C9570A;transform:none;}
.bt-btn[disabled]{background:var(--bt-fog);color:#a9a7a3;cursor:not-allowed;}
.bt-btn:focus-visible{outline:3px solid rgba(255,107,0,.45);outline-offset:2px;}

.bt-input{width:100%;padding:.8rem 1.2rem;border:1px solid var(--bt-line);border-radius:999px;background:#fff;font:500 1rem inherit;}
.bt-input:focus{outline:0;border-color:var(--bt-orange);box-shadow:0 0 0 4px rgba(255,107,0,.18);}
.bt-input[aria-invalid="true"]{background:#FBE3E1;border-color:#C8352B;}

.bt-nav__item[aria-current="page"]{background:var(--bt-orange);color:#fff;border-radius:999px;box-shadow:var(--bt-glow);}
.bt-badge{padding:.25rem .8rem;border-radius:999px;font:600 .85rem inherit;} .bt-badge--active{background:var(--bt-orange);color:#fff;}
.bt-badge--pending{border:1.5px solid var(--bt-ink);} .bt-badge--draft{background:var(--bt-fog);} .bt-badge--new{background:var(--bt-ink);color:#fff;}
.bt-row--selected{background:var(--bt-sand);border-radius:12px;}
```

## 11. Acessibilidade

- Texto branco sobre `#FF6B00` ≈ **3:1**: aceitável apenas para texto grande/semibold ≥ 18px ou 14px bold; para texto pequeno, use laranja mais escuro (`#D95A00`, ≈4.5:1) ou texto Ink sobre laranja.
- Não dependa só de cor: item ativo = laranja **e** peso/forma; erro = cor **e** texto "Required".
- Ordem de leitura/DOM deve seguir a ordem visual esperada (a grade pode reordenar visualmente); use `grid-auto-flow: row` e evite `order` que desalinhe foco e leitura.
- Cada cartão precisa de título/rótulo programático (`aria-labelledby`); alvos ≥ 44px.
- No mobile, **colapse para 1–2 colunas** mantendo a prioridade do conteúdo.

## 12. Erros comuns

- Gap inconsistente entre blocos ou blocos sem alinhamento: o mosaico perde a graça.
- Todos os tiles do mesmo tamanho: vira grid comum; varie spans e crie **um bloco herói**.
- Conteúdo demais por tile: cada cartão deve ter **uma ideia**.
- Raios diferentes sem lógica; use a escala 12/20/28/Full e o raio aninhado.
- Sombras fortes: o estilo é plano e limpo.
- Laranja em tudo: use como acento, não como cor de fundo.
- Esquecer o responsivo: sem reflow planejado, o mosaico quebra no mobile.

## 13. Combina com / não misture com

Combina com: **glassmorphism** (tiles de vidro), **dark mode** (bento escuro), minimalismo, claymorphism (objetos 3D) e tipografia luxury. Não misture com: brutalismo (grade exposta × grade suave) e pixel art, salvo para um bloco decorativo isolado.
