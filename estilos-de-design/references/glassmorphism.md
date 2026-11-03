# Glassmorphism (Glass Kit / Frosted Glass)

> Fonte: 3 pranchas "Glass Kit" (`Foundations & Navigation`, `Actions & Forms`, `Content & Feedback`). Valores com *(derivado)* foram deduzidos para completar o sistema.

## 1. Essência

Painéis de **vidro fosco translúcido** flutuando sobre um **fundo colorido e vivo** (gradiente pastel azul-lavanda com **esferas 3D desfocadas** em azul, violeta e menta). O efeito nasce de quatro ingredientes: **transparência** (branco a 30–50%), **desfoque do que está atrás** (`backdrop-filter`), **borda fina clara** (1px branca semitransparente, simulando a aresta do vidro) e **sombra suave e difusa**. Tipografia leve e limpa, ícones de traço fino, azul-céu como acento com **brilho (glow)** nos estados ativos.

Sensação: leve, aérea, tecnológica, premium, estilo iOS/visionOS/Windows 11 Fluent.

## 2. Quando usar e quando evitar

**Bom para:** dashboards e widgets (clima, música, finanças pessoais), apps mobile com cartões sobrepostos, landing pages de SaaS/IA/tech, telas de login sobre imagem/gradiente, docks e barras flutuantes, painéis de controle (toggles rápidos), hero sections com ilustração 3D ao fundo.

**Evitar quando:** não há nada colorido/visual atrás do vidro (o efeito some em fundo chapado), em dispositivos fracos (blur custa GPU), em textos longos sobre fundos caóticos, ou quando a acessibilidade de contraste é crítica e não há como garantir o que fica atrás.

## 3. Paleta

| Nome | Hex | Papel |
|---|---|---|
| **Mist** | `#DDE6F2` | Base clara do fundo e tint do vidro |
| **Sky** | `#A9C4EA` | Fundo intermediário/tint azul, bordas de ênfase, trilhas |
| **Ink** | `#1B2433` | Texto principal (azul-marinho quase preto), tooltip |
| **Frost** | branco translúcido (gradiente `rgba(255,255,255,.7)` → `.25`) | Superfície de vidro |
| **Blue** | `#6FA8FF` | Acento: botão primário, ativo, foco, sliders, glow |
| Violeta *(fundo)* | `#B9A5F0` | Esferas decorativas |
| Menta *(fundo)* | `#BFE9E2` | Esferas decorativas |
| Semânticos *(aprox.)* | info azul, aviso âmbar `#F2B450`, erro vermelho `#E5484D` | Pílulas tintadas translúcidas (Info/Warning/Error) |

Fundo da página: `linear-gradient(160deg, #E8EEF8 0%, #C9D8F0 50%, #A9BEE6 100%)` + 3–5 esferas desfocadas (blur 2–8px) em azul vivo, violeta e menta nas bordas/cantos.

## 4. Tipografia

- Família: **Inter** / **Manrope** / **SF-like** geométrica leve. Display em **Light 300**; títulos de card em Medium 500; corpo Regular 400.
- Título da prancha: "Glass Kit" em Light grande, cor Ink; subtítulo com **tracking largo** ("Foundations & Navigation").
- Rótulos de seção: "01 · COLOR & GLASS" em caixa-alta, ~13px, semibold, tracking 0.06–0.1em.
- Escala (Display / Title / Body / Caption): display 48–72px light, título 28–32px medium, corpo 16px, legenda 13px.
- Números de dados grandes (45%, 23°, $12) em Medium/Semibold, com unidade pequena e leve ("/month").
- Texto **sempre em Ink** sobre vidro; branco só sobre o azul sólido e em tooltips escuros.

## 5. Espaçamento, grade e raios

- Raios: **16**, **24**, **32** e **Full** (pills). Cards grandes 24–28px; botões e inputs pill; ícones em tiles de 16px.
- Espaçamento: 8/12/16/24/32; padding de cards 20–28px; gutters de 24px.
- Layout em cards modulares (2 colunas) sobrepostos sutilmente a esferas coloridas; barras flutuantes (header/dock) com margem das bordas.
- Hierarquia por **níveis de vidro** (ver abaixo), não por cor.

## 6. Níveis de vidro (o coração do estilo)

| Nível | Fundo | Blur | Uso |
|---|---|---|---|
| **Subtle** | `rgba(255,255,255,.18)` | 8px | Elementos recuados, fundos de seção |
| **Light** | `rgba(255,255,255,.30)` | 12–16px | Cards padrão, painéis |
| **Medium** | `rgba(255,255,255,.45)` | 20px | Header, dock, modais, popovers |
| **Heavy** | `rgba(255,255,255,.65)` | 28–32px | Dropdowns, tooltips claros, itens elevados |

Receita comum: borda 1px `rgba(255,255,255,.6)`, realce interno superior `inset 0 1px 0 rgba(255,255,255,.8)`, sombra `0 8px 32px rgba(60,80,140,.15)` e `backdrop-filter: blur(20px) saturate(140%)`.

```css
:root{
  --gl-mist:#DDE6F2; --gl-sky:#A9C4EA; --gl-ink:#1B2433; --gl-blue:#6FA8FF;
  --gl-border:1px solid rgba(255,255,255,.6);
  --gl-shadow:0 8px 32px rgba(60,80,140,.15), inset 0 1px 0 rgba(255,255,255,.8);
  --gl-glow:0 0 0 1px rgba(111,168,255,.55), 0 0 18px rgba(111,168,255,.55);
}
body{min-height:100vh;color:var(--gl-ink);font:400 16px/1.5 Inter,system-ui,sans-serif;
  background:radial-gradient(circle at 8% 22%,#5b9bf5 0 9%,transparent 18%),
             radial-gradient(circle at 88% 6%,#6aa4ff 0 12%,transparent 22%),
             radial-gradient(circle at 80% 18%,#c9b6f5 0 6%,transparent 12%),
             linear-gradient(160deg,#E8EEF8,#C9D8F0 55%,#A9BEE6);}
.glass{background:linear-gradient(135deg,rgba(255,255,255,.55),rgba(255,255,255,.25));
  backdrop-filter:blur(20px) saturate(140%);-webkit-backdrop-filter:blur(20px) saturate(140%);
  border:var(--gl-border);border-radius:24px;box-shadow:var(--gl-shadow);}
.glass--subtle{background:rgba(255,255,255,.18);backdrop-filter:blur(8px);}
.glass--heavy{background:rgba(255,255,255,.65);backdrop-filter:blur(30px);}
@supports not (backdrop-filter:blur(1px)){.glass{background:rgba(238,243,251,.92);}}
```

## 7. Ícones e imagens

- Ícones **de traço fino (1.5px)** em Ink, dentro de **tiles de vidro** quadrados de raio 16px: home, search, user, bell, mail, calendar, settings, camera, heart, phone, chart-bars, folder, message, bluetooth, wifi, flashlight, alarm, mic, volume, brightness, lock, eye, check, info, warning, error, pin, bookmark, shield, credit-card.
- Elementos 3D decorativos: **esferas** com gradiente e leve brilho especular; logotipo como orbe cromado.
- Capas/ilustrações: gradientes azuis com formas suaves (montanhas minimalistas); avatares com silhueta em círculo de vidro azulado e **ponto de status azul**.
- Fotos com cantos de 16–24px; evite fotos muito ocupadas atrás de texto sem um nível de vidro mais forte.

## 8. Componentes

### Navegação
- **Header:** pílula flutuante de vidro Medium com orbe-logo à esquerda, links ("Discover" ativo = pill branca elevada, "Explore", "Pricing"), ícone de busca e botão "Login" em pill de vidro.
- **Sidebar:** card vertical; item ativo "Overview" em pill de vidro azulada com **glow azul**; outros com ícone + rótulo; badge numérico (Messages 3) e avatar em Settings.
- **Tabs:** segmentado em pill; item ativo = pill branca elevada (com glow azul leve no "Week"). Dois exemplos: All/Active/Done e Day/Week/Month.
- **Breadcrumb:** "Start / Library / Detail"; **paginação:** botões circulares (‹ 1 **2** 3), atual com anel azul; **steps:** orbes pequenas conectadas por linha azul (concluídas azuis, futuras cinza-claras), rótulo "Step".
- **Links:** Default (Ink), Hover (fundo de vidro em pill), Active (sublinhado azul), Disabled (cinza claro). **Footer:** links "About · Terms · Help · Contact" + ícones sociais.
- **Dock:** barra pill flutuante com 4 itens (Home ativo = círculo de vidro com glow azul e ponto de notificação, Search, Saved, Profile).

### Botões
- **Primary:** vidro **azulado** (`rgba(111,168,255,.55)`), texto Ink, **glow azul**.
- **Secondary:** vidro branco fosco. **Ghost:** só contorno translúcido.
- **Pressed:** vidro mais escuro/acinzentado, sombra interna. **Disabled:** quase transparente, texto esmaecido. **Loading:** spinner de traços.
- Login/Sign Up em pills largas de vidro.
- **Quick toggles:** botões circulares grandes (wifi, bluetooth, lanterna **ativa em azul sólido com glow**, alarme).

### Formulários
- **Input:** pill de vidro; **Focus:** borda azul e glow; **Error:** borda vermelha + ícone "!" e "Required" vermelho; **Locked:** esmaecido com cadeado.
- **Search bar:** pill com lupa, placeholder, ícones de microfone/câmera/"…"; estado preenchido com "×".
- **Password** com olho; **OTP:** quadrados de vidro; o ativo com glow azul.
- **Select:** pill + dropdown em vidro Heavy; opção selecionada em vidro azul com glow e check; exemplos aberto/fechado (chevron ↑/↓).
- **Toggle:** trilha azul translúcida ligada / cinza desligada, knob branco; **Checkbox** azul com check; **Radio** com anel.
- **Slider:** trilha cinza-azulada, preenchimento azul, knob de vidro branco, valor "40%" acima; **sliders verticais** em cápsulas de vidro com ícone (volume, brilho); range com dois knobs; **stepper** "− 2 +".
- **Textarea** com contador "0/120"; **Upload** com borda tracejada e ícone de nuvem.
- **Calendar:** grade de pontos, dia selecionado azul com glow; **Voice:** pill de vidro com botão de microfone e **waveform**; **Rating:** estrelas escuras + "4.8".

### Conteúdo e dados
- **Weather widget:** sol outline, "23°" grande, "Sunny / Enjoy your day!", divisor vertical e data ("Monday 20 May").
- **Stat & chart:** "Performance ↗", "Last 7 days", "45%" gigante e **barras de vidro** em cápsula (uma azul destacada).
- **Task list:** "Today's Plan" com botão "+" circular; itens com marcadores (check azul, ponto azul preenchido, pontos cinza).
- **Rings & progress:** anel "75%" com arco branco brilhante sobre trilha translúcida (Battery); barra azul "Storage 72%"; bloco de skeleton com spinner.
- **Music player:** capa gradiente azul com montanhas, título "Peaceful Mind", artista, barra de progresso fina e controles (anterior/pause/próximo).
- **Profile & badges:** avatar de vidro com silhueta, ponto azul, nome, cargo, localização; badges Active/Pending/Draft em pills de vidro; avatares sobrepostos +3.
- **Pricing card:** cartão interno de vidro "Starter $12/month", checklist com barras e botão "Get Started" azul com glow.
- **List/table/accordion:** linhas com ícone, rótulo e chevron (Account, Billing, Security); tabela mini com pontos de status azul/âmbar; accordion "Question" em pill de vidro.

### Feedback
- **Toast:** vidro com círculo azul + check, "All set!" e "Changes saved", "×".
- **Alertas:** pills tintadas translúcidas: Info (azul), Warning (âmbar), Error (vermelho), com ícone circular.
- **Modal:** card de vidro "Delete item?" com linha de texto e **rodapé dividido** (Cancel | Delete, Delete em azul).
- **Tooltip:** bolha **escura translúcida** (`rgba(30,40,58,.85)`) com texto branco sobre botão circular de vidro.

## 9. Motion e interação

- Transições de **250–350ms**, `cubic-bezier(.2,.8,.2,1)`; animar `opacity`, `transform`, `box-shadow`, não o `backdrop-filter` (caro).
- Hover: o vidro clareia (+8% de branco), levanta 2px e ganha leve glow; ativos têm glow azul persistente.
- Entradas: fade + scale 0.98→1 e slide curto; esferas do fundo flutuam muito devagar (20–40s, amplitude pequena).
- Parallax sutil entre fundo e cards reforça a profundidade.
- `prefers-reduced-motion`: parar flutuação das esferas e parallax.
- Provide fallback: `prefers-reduced-transparency` → fundo sólido.

## 10. Receita dos componentes-chave

```css
.gl-btn{padding:.75rem 1.6rem;border:var(--gl-border);border-radius:999px;color:var(--gl-ink);font:500 1rem Inter,sans-serif;cursor:pointer;
  background:rgba(255,255,255,.55);backdrop-filter:blur(12px);box-shadow:var(--gl-shadow);transition:transform .25s,box-shadow .25s,background .25s;}
.gl-btn:hover{transform:translateY(-2px);background:rgba(255,255,255,.7);}
.gl-btn--primary{background:linear-gradient(180deg,rgba(150,196,255,.8),rgba(111,168,255,.6));box-shadow:var(--gl-shadow),var(--gl-glow);}
.gl-btn[disabled]{opacity:.45;box-shadow:none;cursor:not-allowed;}
.gl-btn:focus-visible{outline:2px solid var(--gl-blue);outline-offset:3px;}

.gl-input{width:100%;padding:.8rem 1.2rem;border-radius:999px;border:var(--gl-border);background:rgba(255,255,255,.5);
  backdrop-filter:blur(12px);color:var(--gl-ink);font:400 1rem Inter,sans-serif;}
.gl-input:focus{outline:0;border-color:var(--gl-blue);box-shadow:var(--gl-glow);}
.gl-input[aria-invalid="true"]{border-color:#E5484D;}

.gl-pill{padding:.2rem .8rem;border-radius:999px;border:var(--gl-border);background:rgba(255,255,255,.5);font:500 .85rem Inter,sans-serif;}
.gl-dock{display:flex;gap:.5rem;padding:.6rem;border-radius:999px;} /* + classe .glass */
.gl-tooltip{background:rgba(30,40,58,.88);color:#fff;border-radius:12px;padding:.5rem .9rem;backdrop-filter:blur(8px);}
```

## 11. Acessibilidade

- **O contraste depende do que está atrás.** Use texto Ink (≈12:1 sobre vidro claro) e nunca branco sobre vidro claro. Para texto pequeno, suba o nível de vidro (Heavy) ou adicione fundo semi-sólido.
- Bordas/estados não podem depender só de transparência: use glow azul, ícones e texto.
- Ofereça fallback sólido via `@supports not (backdrop-filter)` e `@media (prefers-reduced-transparency: reduce)`.
- Foco visível (outline azul 2px com offset); alvos ≥ 44px.
- Evite cards de vidro sobre fotos com texto/detalhe forte: reduz legibilidade.

## 12. Erros comuns

- Aplicar vidro sobre **fundo chapado**: o blur não tem o que desfocar e o efeito some. Sempre coloque cor/formas atrás.
- Transparência demais (texto ilegível) ou de menos (vira um card branco comum).
- Esquecer a borda clara e o realce interno: sem a "aresta" o vidro parece um bloco cinza.
- Empilhar muitos `backdrop-filter` aninhados: custo de GPU e artefatos; limite a 2 níveis por viewport.
- Sombras escuras e duras (quebram a leveza); use sombras azuladas e difusas.
- Cores saturadas demais no fundo, brigando com o conteúdo.

## 13. Combina com / não misture com

Combina com: dark mode (versão vidro escuro), bento grid (cards em mosaico) e minimalismo (calma). Não misture com: brutalismo, pixel art (opostos), nem com neomorfismo/claymorphism na mesma tela (disputam a noção de volume).
