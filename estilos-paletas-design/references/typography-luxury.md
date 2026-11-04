# Typography Luxury (Luxury / Black & Gold editorial)

> Fonte: 3 pranchas "LUXURY" (`Foundations & Navigation`, `Actions & Forms`, `Content & Feedback`). Valores com *(derivado)* foram deduzidos para completar o sistema.

## 1. Essência

Interface **escura, silenciosa e editorial**, onde a **tipografia é a estrela**: títulos em **serifa de alto contraste (Playfair Display)** combinados com sans neutra para texto, **dourado metálico** como único acento sobre **preto profundo**, filetes dourados finos de 1px, **caixa-alta com espaçamento largo** nos rótulos e botões, muito espaço negativo e fotografia de produto sobre preto. Os detalhes de joalheria (coroa, moldura dupla, capitular, citação com aspas douradas, numeração em algarismos de estilo antigo) dão o ar de **maison de luxo**.

Sensação: exclusiva, sofisticada, atemporal, calma, "relojoaria / alta costura / hotel cinco estrelas".

## 2. Quando usar e quando evitar

**Bom para:** joalherias, relógios, perfumaria, moda e alta costura, hotéis e resorts, vinícolas, gastronomia premium, imobiliário de alto padrão, automotivo premium, clubes/membros, e-commerce de poucos itens caros, convites e landing pages de lançamento.

**Evitar quando:** o público busca preço/volume (marketplaces, promoções), a marca é jovem/lúdica, ou o produto precisa de muita densidade de informação (dashboards). Cuidado com acessibilidade: texto cinza sobre preto e dourado em tamanhos pequenos exigem verificação de contraste.

## 3. Paleta

| Nome | Hex | Papel |
|---|---|---|
| **Black** | `#0A0A0A` | Fundo da página |
| **Onyx** | `#141414` | Superfície de cards, inputs, painéis (um degrau acima do Black) |
| Onyx elevado *(derivado)* | `#1B1B1B` | Cards internos (stat cards, feature cards, produto) |
| **Ivory** | `#F5F5F5` | Texto principal, títulos em serifa, ícones neutros |
| **Grey** | `#A0A0A0` | Texto secundário, legendas, placeholders, estado desabilitado |
| **Gold** | `#C9A227` | Acento: filetes, ícones, rótulos, botões, foco, estrelas |
| Gold claro *(derivado)* | `#F2D675` | Realce do gradiente metálico, hover |
| Gold escuro *(derivado)* | `#8A6B14` | Sombra do gradiente metálico, pressed |
| Cream *(derivado)* | `#F0E6C8` | Opção selecionada no select (texto preto), knob do toggle |
| Borda dourada *(derivado)* | `rgba(201,162,39,.4)` | Contorno de 1px dos cards |
| Info *(aprox.)* | fundo `#1E2A3A`, ícone azul-aço | Alerta Info |
| Warning *(aprox.)* | fundo `#3A2F14`, ícone dourado | Alerta Warning |
| Erro *(aprox.)* | fundo `#3A1A20`, texto `#D24A4A` | Campo/alerta de erro, "REQUIRED" |

**Gradiente metálico** (botões primários, títulos, sliders): `linear-gradient(135deg,#8A6B14 0%,#C9A227 30%,#F2D675 50%,#C9A227 70%,#8A6B14 100%)`. O mesmo gradiente em `background-clip:text` para o título "LUXURY". Preto → dourado para sliders de cor/valor.

Regra: **preto + marfim + um dourado**. Semânticos só em feedback, sempre **escurecidos** e dessaturados.

## 4. Tipografia (a alma do estilo)

- **Heading:** **Playfair Display** (alternativas: *Cormorant Garamond*, *Bodoni Moda*, *DM Serif Display*). Display grande, títulos de card e valores em marfim; **itálico em dourado** para a palavra de ênfase ("Every Detail Shapes Your *Legacy.*", "Subheading").
- **Body:** **SF Pro Display** na prancha; na web use `-apple-system, "SF Pro Display", Inter, system-ui, sans-serif`.
- **Escala:** Display (serifa 56–96px) · Heading (serifa 32–44px) · *Subheading* (serifa itálica dourada 24–28px) · Body (sans 16px, marfim) · **OVERLINE** (caps, dourado, 12px, tracking 0.18em) · Caption (sans 13px, cinza).
- **Caixa-alta com tracking largo** (0.12–0.25em) em: rótulos de seção ("01 · COLOR PALETTE" em dourado), navegação (SHOP, STORY, CONTACT), botões, abas, rodapés, subtítulos ("FOUNDATIONS & NAVIGATION" em cinza).
- **Detalhes editoriais:** **capitular** dourada ("L" grande ao lado do texto), **citação** com aspas douradas “ e itálico ("Less is more." seguida de filete dourado), **numeração** em algarismos de estilo antigo "01", "03" em serifa.
- Números de dados (R$/$, %) em serifa marfim, grandes; variação ("+12.5%") em sans cinza pequeno.
- Título principal com gradiente metálico e leve glow: `text-shadow: 0 0 24px rgba(201,162,39,.25)`.

## 5. Espaçamento, grade e raios

- **Muito espaço negativo**: padding de cards 24–32px, seções com 96–160px.
- **Raios contidos**: cards e painéis **16–18px**; botões **Full (pill)**; inputs **6–8px** (quase retos); chips pill; fotos 4–8px (ou retas).
- Grade editorial: 12 colunas, cards alinhados, alturas iguais em linhas; hero assimétrico (texto à esquerda, imagem à direita em moldura circular com anel dourado).
- Filetes horizontais de 1px dourado separam blocos (título/conteúdo, rodapé).
- Alinhamento centralizado para cabeçalhos de marca, à esquerda para conteúdo.

## 6. Superfícies, bordas e brilho

- Cards em **Onyx com contorno dourado de 1px** (a assinatura do estilo), sem sombra pesada; opcional `inset 0 1px 0 rgba(255,255,255,.04)`.
- **Moldura dupla** em cartões premium (card de plano "Signature": borda externa fina + moldura interna dourada) e **fita "MOST POPULAR"** dourada no topo.
- **Glow dourado** discreto no foco e no hero (`0 0 0 1px #C9A227, 0 0 18px rgba(201,162,39,.35)`).
- Fotografia de produto em **fundo preto**, alto contraste, sem cores extras; anel dourado ao redor de bustos/retratos.
- Textura sutil de ruído/vinheta no fundo (opcional).

```css
:root{
  --lx-black:#0A0A0A; --lx-onyx:#141414; --lx-onyx-2:#1B1B1B; --lx-ivory:#F5F5F5; --lx-grey:#A0A0A0;
  --lx-gold:#C9A227; --lx-gold-hi:#F2D675; --lx-gold-lo:#8A6B14; --lx-cream:#F0E6C8;
  --lx-line:1px solid rgba(201,162,39,.4);
  --lx-metal:linear-gradient(135deg,#8A6B14 0%,#C9A227 30%,#F2D675 50%,#C9A227 70%,#8A6B14 100%);
  --lx-serif:"Playfair Display","Cormorant Garamond",Georgia,serif;
  --lx-sans:-apple-system,"SF Pro Display",Inter,system-ui,sans-serif;
}
body{background:var(--lx-black);color:var(--lx-ivory);font:400 16px/1.65 var(--lx-sans);}
h1,h2,h3{font-family:var(--lx-serif);font-weight:500;letter-spacing:.01em;}
h1.lx-brand{font-size:clamp(3.5rem,10vw,7rem);background:var(--lx-metal);-webkit-background-clip:text;background-clip:text;color:transparent;}
.lx-em{font-style:italic;color:var(--lx-gold);}
.lx-overline{font:500 12px var(--lx-sans);letter-spacing:.2em;text-transform:uppercase;color:var(--lx-gold);}
.lx-card{background:var(--lx-onyx);border:var(--lx-line);border-radius:18px;padding:28px;}
.lx-rule{height:1px;background:linear-gradient(90deg,transparent,var(--lx-gold),transparent);border:0;}
```

## 7. Ícones e ornamentos

- Ícones **outline finíssimos (1.25–1.5px), em dourado**, geometria elegante e consistente: home, search, user, **shopping bag**, heart, bell (com ponto dourado de notificação), **shield / shield-check**, lock, gift, star, compass, target, share, truck (entrega), headset (concierge), pin, documento/pedidos, crown (coroa), diamond (losango).
- **Coroa** como logo/ornamento (acima do wordmark, no footer, em badges "GOLD MEMBER"); losango dourado como marcador.
- Ícones circulares com **contorno dourado** para destaque (feature cards).
- Ornamentos tipográficos: filetes, capitular, aspas, numeração; evitar ilustrações infantis ou 3D coloridas.
- Estátuas/bustos clássicos em preto com anel dourado como imagem-herói.

## 8. Componentes

### Navegação
- **Header:** wordmark **LUXURY** (serifa dourada, centralizado, com mini coroa) entre os links à esquerda (SHOP, STORY, CONTACT em caps) e ações à direita (lupa, sacola com ponto dourado, botão **SIGN IN** pill com contorno). Mobile: hambúrguer de linhas finas, coroa central, sacola.
- **Sidebar compacta (rail):** ícone + rótulo em caps pequeno (OVERVIEW ativo com **contorno dourado arredondado**, CATALOG, ORDERS, WISHLIST, SETTINGS) e um losango dourado no rodapé.
- **Tabs:** ALL (sublinhado dourado), WATCHES, BAGS, PERFUME; **pills** MONTHLY (contorno dourado) / YEARLY; **breadcrumb** "HOME / ATELIER / DETAIL" em caps cinza.
- **Paginação:** "‹ 1 **(2)** 3 ›" com a atual em **anel dourado**; **steps:** pontos dourados conectados por filete (CART, SHIPPING, PAYMENT, DONE; o último cinza).
- **Links:** Default (marfim), Hover (dourado), Active (dourado + sublinhado), Disabled (cinza).
- **Bottom nav:** DISCOVER (ativo: bússola dourada), SEARCH, BAG, ACCOUNT em caps minúsculas; **footer:** coroa + ABOUT / PRIVACY / SHIPPING / CARE com filete dourado abaixo.

### Botões
- **Primary:** pill com **gradiente metálico dourado**, texto **preto em caixa-alta tracking largo**. **Secondary:** pill cinza-escuro com texto marfim. **Outline:** pill com contorno e texto dourados.
- **Pressed:** dourado fosco/escuro; **Disabled:** cinza chapado; **Loading:** escuro com spinner fino dourado.
- **SHOP NOW:** botão largo dourado + botão circular de seta (contorno).
- **Icon buttons:** círculos de **contorno dourado** (heart, share, bell com ponto, bag, target) e **"+" dourado preenchido**.

### Formulários
- **Inputs:** retângulo escuro de raio 6–8px, borda 1px cinza escuro, rótulo em caps pequeno acima ("DEFAULT", "FOCUS" dourado, "FILLED"); **Focus:** borda dourada + glow; **Error:** borda vermelha, "ERROR *" e "REQUIRED" em vermelho; **Locked:** esmaecido.
- **Search:** input com lupa; **Newsletter:** filete dourado, título serifa "Join the Circle", campo "EMAIL ADDRESS" e botão **SUBSCRIBE** dourado.
- **Select:** campo escuro com chevron; lista cinza-escuro; **opção selecionada = fundo Cream com texto preto e check**.
- **Toggle:** ON trilha dourada + knob Cream; OFF trilha cinza-escuro com knob cinza. **Checkbox** dourado com check preto; **radio** com anel e ponto dourados; **OTP:** caixas escuras com borda cinza, ativa com **brilho dourado**.
- **Sliders:** trilha com **gradiente preto→dourado** e knob dourado (valores "#000000" / "#C9A227"); **range de preço** ($0 – $5,000) com dois knobs dourados; **stepper** com borda dourada.
- **Textarea:** "MESSAGE", linhas, contador "0/200"; **Upload:** borda **tracejada dourada**.
- **Date & size:** "June 2024" em serifa, dias cinza, selecionado com **círculo dourado**; seletor de tamanho **S / M(dourado) / L / XL**; amostras de cor (preto, dourado, cinza); estrelas douradas "4.8".

### Conteúdo e dados
- **Stat cards:** BALANCE $24,850, ORDERS 1,248, REVENUE $48,650 em serifa marfim, variação pequena, e **sparkline/barras douradas** com leve preenchimento.
- **Profile:** avatar silhueta em **anel dourado**, nome em serifa ("Alexander Reed"), badge **GOLD MEMBER** (coroa + contorno dourado), tags NEW / LIMITED / SOLD OUT (contorno) e chips WATCHES × / BAGS × (preenchidos escuros); botão "…".
- **Feature cards:** ícone em círculo dourado + rótulo serifa (Membership, Secure Checkout, Fast Delivery, Concierge) + barras de placeholder.
- **Product cards:** foto sobre preto, coração dourado, nome em serifa ("Luxury Watch"), preço em sans, botão **ADD TO BAG** com contorno dourado.
- **Membership card:** fita "MOST POPULAR", **moldura dupla dourada**, "Signature", "$49/month", checklist com barras douradas, botão **JOIN NOW** metálico.
- **Hero statement:** título serifa com palavra em *itálico dourado*, texto, botão **EXPLORE →** + círculo, e busto clássico preto com anel dourado luminoso.
- **List, table & accordion:** linhas em serifa com ícone dourado e chevron (Orders, Wishlist, Addresses); tabela ORDER / STATUS / TOTAL com pontos dourados; accordion "Question" com −/+.
- **Progress & loading:** anel fino 75% dourado ("PROFILE"), barra "STORAGE 72%" fina dourada, spinner de arco fino e **skeleton** com shimmer cinza.

### Feedback
- **Toast:** "Order Confirmed / Thank you" em serifa, círculo dourado com check e "×".
- **Alertas:** barras escuras tingidas: INFO (azul-aço), WARNING (dourado-escuro), ERROR (vinho), ícones de traço fino.
- **Modal:** moldura dourada, "Remove item?" em serifa, duas linhas, **CANCEL** (contorno) e **REMOVE** (dourado preenchido).
- **Tooltip:** pill escuro "TOOLTIP" sobre círculo de contorno.

## 9. Motion e interação

- Movimento **lento e elegante**: 400–700ms, `cubic-bezier(.22,.61,.36,1)`; fade + `translateY(24px)` com leve blur na entrada; escalonamento de 80–120ms.
- **Shimmer dourado** nos botões primários no hover (gradiente deslizando 600ms); hover em imagens: `scale(1.04)` em 800ms; sublinhados que crescem do centro.
- Parallax sutil no hero; revelação de texto linha a linha (máscara) nos títulos serifados.
- Cursor customizado discreto (anel dourado) é opcional.
- `prefers-reduced-motion`: sem parallax/máscaras; apenas fades curtos.

## 10. Receita dos componentes-chave

```css
.lx-btn{display:inline-flex;align-items:center;gap:.6rem;padding:.9rem 2rem;border:1px solid transparent;border-radius:999px;cursor:pointer;
  font:600 .8rem var(--lx-sans);letter-spacing:.18em;text-transform:uppercase;transition:filter .4s,box-shadow .4s,background-position .6s;}
.lx-btn--primary{background:var(--lx-metal);background-size:200% 100%;color:#0A0A0A;}
.lx-btn--primary:hover{background-position:100% 0;box-shadow:0 0 24px rgba(201,162,39,.35);}
.lx-btn--secondary{background:#2a2a2a;color:var(--lx-ivory);border-color:#3a3a3a;}
.lx-btn--outline{background:transparent;border-color:var(--lx-gold);color:var(--lx-gold);}
.lx-btn--outline:hover{background:rgba(201,162,39,.12);}
.lx-btn:focus-visible{outline:2px solid var(--lx-gold);outline-offset:3px;}
.lx-btn[disabled]{background:#333;color:#777;cursor:not-allowed;box-shadow:none;}

.lx-input{width:100%;padding:.85rem 1rem;border:1px solid #3a3a3a;border-radius:6px;background:#0f0f0f;color:var(--lx-ivory);font:400 1rem var(--lx-sans);}
.lx-input::placeholder{color:#777;letter-spacing:.08em;text-transform:uppercase;}
.lx-input:focus{outline:0;border-color:var(--lx-gold);box-shadow:0 0 0 1px var(--lx-gold),0 0 18px rgba(201,162,39,.3);}
.lx-input[aria-invalid="true"]{border-color:#D24A4A;}

.lx-tab[aria-selected="true"]{color:var(--lx-gold);box-shadow:inset 0 -1px 0 var(--lx-gold);}
.lx-badge{padding:.25rem .8rem;border:1px solid rgba(201,162,39,.6);border-radius:999px;color:var(--lx-gold);font:500 .7rem var(--lx-sans);letter-spacing:.14em;text-transform:uppercase;}
.lx-plan{border:var(--lx-line);border-radius:18px;padding:6px;} .lx-plan>div{border:1px solid var(--lx-gold);border-radius:14px;padding:28px;} /* moldura dupla */
```

## 11. Acessibilidade

- Marfim `#F5F5F5` sobre Black ≈ 18:1 (excelente); **Gold `#C9A227` sobre Black ≈ 8:1** (bom para texto ≥ 14px e ícones); **Grey `#A0A0A0` sobre Onyx ≈ 7:1**: mantenha os cinzas a partir de `#A0A0A0` (não use `#777` para texto necessário; só para placeholder decorativo ≥ 3:1).
- Texto preto sobre dourado ≈ 8:1: use sempre **texto preto** em botões dourados.
- Caixa-alta com tracking largo prejudica a leitura em textos longos: limite a rótulos curtos (≤ 4 palavras) e use caixa mista no corpo.
- Foco visível (anel dourado); alvos ≥ 44px; estados de erro com texto e ícone, não só cor.
- Texto sobre imagens: use gradiente escuro por baixo; não coloque serifa fina (Playfair 400) em tamanhos < 18px sobre fundo texturizado.

## 12. Erros comuns

- **Dourado demais**: ele deve ser filete, ícone, rótulo e CTA; áreas grandes douradas parecem "cafona". Máx. ~5% da área.
- Dourado **chapado e amarelado** (`#FFD700`): use o tom desaturado `#C9A227` e o gradiente metálico com realce.
- Serifa em tamanho pequeno ou peso muito fino (perde a elegância e a legibilidade).
- Tracking largo em tudo (inclusive parágrafos) ou caixa-alta longa.
- Falta de espaço negativo: luxo é vazio bem calibrado.
- Misturar mais de duas famílias; manter serifa + sans.
- Fundo cinza (#222) em vez de preto profundo: perde o contraste dramático.
- Sombras brancas/azuladas; use apenas glow dourado discreto.

## 13. Combina com / não misture com

Combina com: dark mode (é uma versão específica dele), minimalismo (para a calma e o espaço), brutalismo apenas em **grandes títulos** editoriais, glassmorphism escuro em hero. Não misture com: pixel art, claymorphism, neomorfismo azulado e bento colorido (informalidade e cores vivas desfazem a exclusividade).
