# Claymorphism (Clay Kit / Soft 3D "argila")

> Fonte: 3 pranchas "Clay Kit" (`Foundations & Navigation`, `Actions & Forms`, `Content & Feedback`). A primeira prancha tem uma colagem central de objetos 3D com texto ilegível gerado por IA: trate-a como moodboard de objetos de argila e de conexões em fio dourado, não como conteúdo. Valores com *(derivado)* foram deduzidos para completar o sistema.

## 1. Essência

Interface feita de **massa de modelar inflada**: tudo parece macio, gordinho e levemente brilhante, como peças de argila ou borracha sobre uma mesa clara. Cada elemento tem **raios enormes**, uma **sombra externa suave e grande**, um **realce interno claro no topo** e uma **sombra interna sutil na base**, o que dá volume "inflado". A paleta é **creme quente + preto + dourado (mostarda)**, com objetos 3D de argila (casa, câmera, engrenagens, xícara) como decoração. Mais "vivo" e mais colorido que o neomorfismo, mais suave e tátil que o glassmorphism.

Sensação: acolhedora, lúdica sem ser infantil, premium artesanal, "café e papelaria de luxo".

## 2. Quando usar e quando evitar

**Bom para:** apps de bem-estar, hábitos e produtividade leve, finanças pessoais amigáveis, e-commerce de presentes/decoração/café, onboarding e ilustração de marca, landing pages com mascote/objetos 3D, apps infantis-adultos (educação), widgets (clima, música, tarefas).

**Evitar quando:** o produto precisa de seriedade institucional, alta densidade de dados (tabelas grandes, dashboards técnicos), ou quando o desempenho é crítico (muitas sombras empilhadas pesam). Cuidado com acessibilidade: bordas pouco contrastadas.

## 3. Paleta

| Papel | Hex | Observação |
|---|---|---|
| **Cream (superfície/fundo)** | `#F3EEE7` | Marfim quente; fundo e cards próximos |
| Cream claro (realce) | `#FFFFFF` / `#FBF8F3` | Luz interna e sombra clara |
| Taupe (sombra quente) | `#B9A88F` a 30–40% | Sombras externas quentes, nunca cinza frio |
| Bege médio *(derivado)* | `#D9CFC0` | Trilhas, barras de placeholder, botão desabilitado |
| **Dourado (acento)** | `#D8B04A` (varia `#C9A227`–`#E6C15A`) | Botão Accent, FAB, toggle ativo, sliders, foco, estrelas, gráfico |
| Dourado claro *(derivado)* | `#EBDCA8` | Item ativo (ex.: "Week", "Overview") |
| **Preto** | `#141414` | Botão primário, opção selecionada, ícones preenchidos, tooltip, "+3" |
| Texto principal | `#1A1A1A` | Títulos e corpo |
| Texto mudo *(derivado)* | `#7A7164` | Rótulos de campo, legendas, desabilitado |
| Erro | vermelho `#D93A32` | Borda do campo, ícone Error |
| Alerta | âmbar `#E8A93A` | Ícone Warning |
| Info | cinza `#8E8A84` | Ícone Info |

Regra: **dois protagonistas (preto e dourado)** sobre neutros quentes. Semânticos só em feedback.

## 4. Tipografia

- Família: **geométrica arredondada e amigável**, como *Plus Jakarta Sans*, *Nunito*, *Poppins* ou *DM Sans*. Títulos em **Bold 700**; corpo em Regular/Medium.
- Título da prancha: "Clay Kit" bold grande, subtítulo regular ("Foundations & Navigation").
- Rótulos de seção: "01 · BUTTONS" em caixa-alta, ~14px, semibold, tracking leve (0.04em), cor preta/cinza escuro.
- Números de destaque (23°, 20, $12, 4.8, 75%) em Bold/ExtraBold, grandes; unidade/legenda pequena e leve ("/month", "Sunny").
- Texto preto sobre creme: contraste alto. Nunca branco sobre creme.

## 5. Espaçamento, grade e raios

- Raios **muito generosos**: botões e campos **pill (Full)**, cards **28–36px**, tiles pequenos (OTP, calendário) **14–16px**, FAB e ícones **círculo**.
- Espaçamento em múltiplos de 8; padding interno de cards **24–32px**; gutter 24px. As sombras precisam de espaço: mínimo 20px entre cards vizinhos.
- Cards em **2 colunas** com rótulo numerado acima de cada um ("01 · …"); alturas variam conforme o conteúdo.
- Objetos 3D decorativos podem **sobrepor** a borda do card (casa, câmera, engrenagens saindo por trás/por cima).

## 6. Superfícies, sombras e "inflado" (o coração do estilo)

Receita em 4 camadas para cada elemento elevado:

1. **Sombra externa escura quente**, grande e deslocada para baixo/direita.
2. **Sombra/luz externa clara** no canto superior esquerdo (efeito de volume).
3. **Realce interno branco** no topo/esquerda (`inset`).
4. **Sombra interna quente** na base/direita (`inset`), o que "infla" a peça.

Elementos **rebaixados** (inputs, trilhas, display de gráfico, barras de placeholder) invertem: sombra interna escura no topo e luz na base.

```css
:root{
  --cl-bg:#F3EEE7; --cl-ink:#141414; --cl-text:#1A1A1A; --cl-muted:#7A7164;
  --cl-gold:#D8B04A; --cl-gold-soft:#EBDCA8; --cl-beige:#D9CFC0;
  --cl-shadow-warm:rgba(150,128,96,.34); --cl-shadow-warm-2:rgba(190,170,140,.30);

  --cl-raised:
    10px 12px 24px var(--cl-shadow-warm),
    -8px -8px 18px rgba(255,255,255,.95),
    inset 3px 3px 6px rgba(255,255,255,.95),
    inset -5px -6px 10px var(--cl-shadow-warm-2);
  --cl-raised-sm:
    5px 6px 12px var(--cl-shadow-warm),
    -4px -4px 9px rgba(255,255,255,.95),
    inset 2px 2px 4px rgba(255,255,255,.95),
    inset -3px -3px 6px var(--cl-shadow-warm-2);
  --cl-inset:
    inset 5px 5px 10px rgba(150,128,96,.28),
    inset -5px -5px 10px rgba(255,255,255,.9);
}
body{background:var(--cl-bg);color:var(--cl-text);font:500 16px/1.5 "Plus Jakarta Sans",Nunito,system-ui,sans-serif;}
.cl-card{background:var(--cl-bg);border-radius:34px;padding:28px;box-shadow:var(--cl-raised);}
```

Para botões com cor (preto, dourado), acrescente um **brilho especular** suave no topo: `linear-gradient(180deg,rgba(255,255,255,.28),transparent 45%)` sobre a cor base.

## 7. Ícones e objetos 3D

- **Ícones de UI preenchidos e sólidos em preto** (coração, compartilhar, lápis, lixeira, câmera, bússola, nota musical), dentro de **botões redondos de argila**; navegação usa ícones preenchidos (home, search, bookmark, user) em preto.
- Ícones de estado em círculos pequenos (info cinza, warning âmbar, error vermelho).
- **Objetos 3D "clay"** (opcional, decorativos): casa branca, câmera, engrenagens, peça de quebra-cabeça, xícara de café, moeda com "$", folhas secas. Cores: creme, branco e dourado, brilho suave. Use 1–3 por tela, em posição de destaque (canto de um card, hero), nunca sobre texto.
- Conexões entre cards: **fio dourado fino** (1px) com cantos arredondados e nós pretos, para diagramas de fluxo.
- Avatares: círculo de argila com busto neutro e **ponto dourado** de status; grupos sobrepostos com "+3" preto.
- Ilustrações em tons bege com formas orgânicas (colinas), sem contornos duros.

## 8. Componentes

### Navegação
- **Tabs:** segmentado em trilha rebaixada ("All / Open / Done" e "Day / **Week** / Month"); o item ativo vira **pill dourado-claro em relevo** com texto escuro.
- **Sidebar:** itens "Overview" (ativo: faixa dourada-clara), "Analytics", "Projects", "Messages" com **badge preto "3"**, "Settings", todos com ícones outline/preenchidos.
- **Paginação:** botões quadrados arredondados em relevo (‹ **[2 preto, texto branco]** ›).
- **Steps:** círculos conectados por linha dourada; concluídos em **dourado com número branco**, futuros em esferas brancas.
- **Links:** Default (preto), Hover (**pill em relevo**), Active (sublinhado dourado), Disabled (cinza); **footer** com "About · Terms · Help · Contact".
- **Bottom navigation:** barra grande em relevo com 4 itens (ícone preenchido + rótulo); o ativo ganha **tile rebaixado** e um ponto dourado abaixo.
- **Header/logo:** botão circular "Logo" em relevo; menus em pills.

### Botões
- **Primary:** pill **preta**, texto branco, brilho no topo. **Secondary:** pill creme em relevo. **Accent:** pill **dourada**, texto branco/creme.
- **Pressed:** pill com contorno e sombra interna. **Disabled:** bege esmaecido, sem sombra. **Loading:** texto + spinner pontilhado.
- **Login / Sign Up:** pills de relevo pequenas.
- **Icon buttons:** círculos de relevo com ícone preto sólido; **FAB "+"**: grande, **dourado glossy**, sombra forte e brilho.

### Formulários
- **Text input:** pill **rebaixada**; rótulo pequeno acima; **Focus:** anel dourado de 2px; **Error:** anel vermelho fino + "Required" à direita e asterisco vermelho; **Locked:** esmaecido com cadeado.
- **Search:** pill rebaixada com lupa, placeholder, microfone e filtro (separados por divisor); preenchido "Design|" com "×" em círculo cinza.
- **Password:** pontos + olho; **OTP:** 4 tiles de argila em relevo, o ativo com **borda dourada**.
- **Select:** pill + dropdown em card; **opção selecionada = pill preta com texto dourado e check dourado**.
- **Toggle:** ON = trilha **dourada** com knob branco; OFF = trilha creme. **Checkbox:** marcado = quadrado preto com check branco; vazio = tile em relevo. **Radio:** anel com ponto dourado.
- **Sliders:** trilha rebaixada com preenchimento dourado e **knob branco redondo** com balão de valor ("40%"); **sliders verticais** em cápsulas com ícone (volume, brilho); range com dois knobs; **stepper** "− 2 +" com botões circulares em relevo.
- **Textarea:** campo rebaixado com linhas e contador "0/120"; **Upload:** área tracejada com botão de nuvem em relevo.
- **Calendar:** tiles quadrados em relevo por dia; selecionado = **dourado com número branco**; **Voice:** botão de microfone preto circular + waveform em pill rebaixada; **Rating:** "4.8" + estrelas douradas em pill rebaixada.

### Conteúdo e dados
- **Weather:** sol dourado 3D, "23°" gigante, "Sunny / Enjoy your day!" e data ("Monday **20** May") com divisor vertical.
- **Stat & chart:** tile "Performance ↗ · Last 7 days · 45%" + **barras como cápsulas rebaixadas** com preenchimento dourado em uma.
- **Task list:** "Today's Plan" + botão "+" dourado circular; checkbox quadrado (marcado = dourado com check).
- **Rings & progress:** anel 75% com arco **dourado** sobre trilha rebaixada; barra "Storage 72%" dourada; spinner de traços; skeleton em blocos de relevo.
- **Music player:** capa em tons bege (colinas), título, artista, barra fina dourada, controles circulares (play/pause **dourado**).
- **Profile & badges:** avatar com anel e ponto dourado; badges Active/Pending/Draft como pills rebaixadas; avatares + círculo preto "+3".
- **Pricing:** "Starter", "$12/month", 3 checks com barras, botão preto "Get Started".
- **List/table/accordion:** linhas como **pills em relevo** com ícone preto circular, rótulo e chevron; mini tabela (Name / Status / Date) com pontos bege/dourado; accordion "Question" com chevrons.

### Feedback
- **Toast:** card com **círculo dourado + check branco**, "All set!" bold, "Changes saved" e "×".
- **Alertas:** pills rebaixadas com ícone (Info, Warning, Error) e barra de placeholder.
- **Modal:** card em relevo "Delete item?", duas linhas, botões **Cancel** (relevo) e **Delete** (preto).
- **Tooltip:** bolha **preta** com texto branco, sobre botão dourado circular.

## 9. Motion e interação

- Transições **200–300ms**, `cubic-bezier(.34,1.56,.64,1)` (leve overshoot) para dar sensação de "borracha" em press/toggle; hover com `scale(1.02)` e `translateY(-2px)`.
- **Press:** o elemento "afunda" (`scale(.97)` + troca para `--cl-inset`) e volta com mola curta.
- Toggle e knobs deslizam com leve "squish" (scaleX 1.1 no meio do movimento).
- Entradas: fade + `translateY(12px)` + scale .98→1; objetos 3D flutuam muito sutilmente (±4px, 6–8s).
- `prefers-reduced-motion`: sem overshoot e sem flutuação.

## 10. Receita dos componentes-chave

```css
.cl-btn{padding:.8rem 1.7rem;border:0;border-radius:999px;background:var(--cl-bg);color:var(--cl-text);font:700 1rem "Plus Jakarta Sans",sans-serif;
  box-shadow:var(--cl-raised-sm);cursor:pointer;transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .22s;}
.cl-btn:hover{transform:translateY(-2px) scale(1.02);}
.cl-btn:active{transform:scale(.97);box-shadow:var(--cl-inset);}
.cl-btn--primary{background:linear-gradient(180deg,rgba(255,255,255,.22),transparent 45%),var(--cl-ink);color:#fff;}
.cl-btn--accent{background:linear-gradient(180deg,rgba(255,255,255,.35),transparent 45%),var(--cl-gold);color:#fff;}
.cl-btn[disabled]{background:var(--cl-beige);color:#a89e8e;box-shadow:none;cursor:not-allowed;}
.cl-btn:focus-visible{outline:3px solid var(--cl-gold);outline-offset:3px;}

.cl-input{width:100%;padding:.85rem 1.3rem;border:2px solid transparent;border-radius:999px;background:var(--cl-bg);box-shadow:var(--cl-inset);font:500 1rem inherit;color:var(--cl-text);}
.cl-input:focus{outline:0;border-color:var(--cl-gold);}
.cl-input[aria-invalid="true"]{border-color:#D93A32;}

.cl-toggle{width:60px;height:34px;border-radius:999px;background:var(--cl-bg);box-shadow:var(--cl-inset);position:relative;transition:background .25s;}
.cl-toggle::after{content:"";position:absolute;top:4px;left:4px;width:26px;height:26px;border-radius:50%;background:#fff;box-shadow:2px 3px 6px rgba(150,128,96,.45);transition:transform .25s cubic-bezier(.34,1.56,.64,1);}
.cl-toggle[aria-checked="true"]{background:var(--cl-gold);} .cl-toggle[aria-checked="true"]::after{transform:translateX(26px);}
.cl-badge{padding:.2rem .8rem;border-radius:999px;background:var(--cl-bg);box-shadow:var(--cl-inset);font:600 .85rem inherit;color:var(--cl-muted);}
.cl-tooltip{background:var(--cl-ink);color:#fff;border-radius:14px;padding:.5rem 1rem;box-shadow:0 8px 18px rgba(0,0,0,.25);}
```

## 11. Acessibilidade

- O contraste das **formas** (bordas/sombras) é baixo: complemente com ícones, rótulos, cor dourada/preta e anéis de foco explícitos (anel dourado 3px).
- Texto preto `#1A1A1A` sobre creme (≈15:1); evite texto dourado sobre creme (≈2:1). Dourado só como preenchimento atrás de texto **branco em semibold** *e* com verificação de contraste, ou texto preto sobre dourado.
- Texto mudo `#7A7164` ≈ 4.5:1: use apenas para legendas ≥ 14px.
- Alvos ≥ 44px; estados de erro com texto + ícone.
- Animações de mola são curtas e opcionais.

## 12. Erros comuns

- Sombras só externas: sem o realce/sombra **interna** a peça fica achatada e vira "card com sombra".
- Sombras frias (cinza-azuladas): em argila elas devem ser **quentes** (taupe).
- Mistura de cantos retos com pills: mantenha raios grandes em tudo.
- Dourado demais: ele é acento (FAB, ativo, foco), não cor de fundo.
- Objetos 3D em excesso ou sobre texto; use poucos, com função de ilustração.
- Fundo branco puro: perde o calor do creme.
- Esquecer o estado rebaixado nos campos (o campo precisa parecer "afundado").

## 13. Combina com / não misture com

Combina com: minimalismo (mesma temperatura quente), tipografia luxury (para títulos), bento grid (organização em blocos). Não misture com: brutalismo e pixel art (oposição de linguagem), nem com neomorfismo azulado na mesma tela (dois tipos de relevo).
