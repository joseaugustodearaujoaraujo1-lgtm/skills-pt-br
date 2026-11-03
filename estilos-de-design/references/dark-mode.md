# Dark Mode (Dark UI premium)

> **Sem imagens de referência** (o material de origem não tinha pranchas deste estilo). Este guia foi escrito a partir de boas práticas de interfaces escuras e de um prompt "DARK KIT" (paleta, superfícies e acentos abaixo). Não há kit visual de componentes para copiar: os componentes herdam as regras desta página.

## 1. Essência

Dark mode não é "inverter as cores": é um sistema próprio em que a **profundidade é comunicada por luminosidade** (superfícies mais altas ficam **mais claras**), o texto é **branco suave**, o acento é **dessaturado** e os contornos são **linhas finas translúcidas**. A versão premium tem base quase preta, um brilho ambiente discreto nos cantos (aubergine), cards arredondados com realce interno no topo, gráficos com linhas luminosas e semânticos usados com moderação.

Sensação: moderna, focada, premium, "painel de controle de fintech / ferramenta de dev".

## 2. Quando usar e quando evitar

**Bom para:** dashboards, fintech, ferramentas de desenvolvimento, apps de mídia/streaming, uso noturno, produtos de IA, portfólios tech, painéis analíticos, qualquer produto em que o usuário passa muito tempo.

**Evitar quando:** o conteúdo é longo e textual para leitura prolongada em ambientes claros, a marca é naturalmente clara e acolhedora (clínicas, infantil), ou impressão/PDF é o destino principal. Ofereça **modo claro/escuro** quando possível, respeitando `prefers-color-scheme`.

## 3. Paleta (base "Dark Kit")

### Superfícies (quanto mais alto, mais claro)
| Nível | Hex | Uso |
|---|---|---|
| Base (página) | `#0B0B0F` | Fundo; quase preto com leve tom azul/violeta |
| Surface | `#121216` | Cards padrão, painéis |
| Raised | `#1A1A20` | Cards sobre cards, inputs, hover de linhas |
| Elevated | `#24242B` | Modais, dropdowns, tooltips, popovers |
| Brilho ambiente | aubergine `rgba(120,60,140,.25)` | Radial gradient nos cantos da página |

### Texto e linhas
| Papel | Valor |
|---|---|
| Texto primário | `#F2F2F5` (branco suave; nunca `#FFF` puro em grandes áreas) |
| Texto secundário | `#A0A0AB` |
| Texto mudo | `#6B6B76` (só decorativo/legendas grandes) |
| Borda sutil | `rgba(255,255,255,.08–.10)` |
| Realce interno do card | `inset 0 1px 0 rgba(255,255,255,.06)` |

### Acento e semânticos
| Papel | Hex |
|---|---|
| **Acento (lilás-malva)** | `#C79BDB` com glow suave `0 0 18px rgba(199,155,219,.35)` |
| Sucesso | `#4ADE80` |
| Erro | `#F87171` |
| Alerta | `#FBBF24` |
| Info | `#60A5FA` *(derivado)* |

Regras: um acento só; semânticos **dessaturados e claros** (os tons -400 do Tailwind funcionam melhor que os -500/-600 no escuro). Fundo da página **nunca** `#000` puro (fica "buraco"), exceto OLED/hero cinematográfico.

## 4. Tipografia

- **Inter** ou **Geist** (sans geométrica limpa); mono opcional (Geist Mono / JetBrains Mono) para números e código.
- Título de página: medium 500–600, 28–40px; títulos de card 16–18px semibold; corpo 15–16px; legendas 12–13px.
- **Aumente levemente** o peso em texto pequeno (400→450/500) e a entrelinha (1.55–1.65): o texto claro sobre fundo escuro parece mais fino ("irradiação").
- Rótulos de seção em caixa-alta pequena (11–12px, tracking .08em) em cinza secundário, com número ("01 · STAT CARDS").
- Números de KPI grandes e em `tabular-nums`.

## 5. Espaçamento e raios

- Escala 4/8/12/16/24/32; padding de cards 20–24px; gutters 16–24px.
- Raios: **cards 20px**, inputs/pills **Full**, botões pill, avatares círculos, tiles pequenos 12–14px.
- Densidade um pouco mais compacta que em temas claros, mas com respiro suficiente para os contornos.

## 6. Superfícies, elevação e brilho

- **Elevação = luminosidade**, não sombra. Sombras escuras quase não aparecem sobre preto: use degrau de superfície + borda de 1px + realce interno.
- Sombras só em elementos flutuantes: `0 12px 32px rgba(0,0,0,.5)`.
- **Glow** (acento) em estados ativos, linhas de gráfico e ponto destacado; nunca em tudo.
- **Vidro escuro** opcional: `rgba(255,255,255,.04)` + `backdrop-filter: blur(16px)` + borda 1px.
- Sem branco puro em grandes áreas; imagens claras devem ser levemente **atenuadas** (`filter: brightness(.9)`) e logotipos escuros trocados por versões claras.

```css
:root[data-theme="dark"], .theme-dark{
  --dk-base:#0B0B0F; --dk-surface:#121216; --dk-raised:#1A1A20; --dk-elevated:#24242B;
  --dk-text:#F2F2F5; --dk-text-2:#A0A0AB; --dk-text-3:#6B6B76;
  --dk-line:rgba(255,255,255,.09); --dk-accent:#C79BDB;
  --dk-ok:#4ADE80; --dk-err:#F87171; --dk-warn:#FBBF24;
  --dk-glow:0 0 18px rgba(199,155,219,.35);
  --dk-card-shadow:inset 0 1px 0 rgba(255,255,255,.06);
  color-scheme:dark;
}
body{background:
  radial-gradient(60% 40% at 0% 0%,rgba(120,60,140,.22),transparent 60%),
  radial-gradient(50% 40% at 100% 100%,rgba(120,60,140,.16),transparent 60%),var(--dk-base);
  color:var(--dk-text);font:400 16px/1.6 Inter,Geist,system-ui,sans-serif;}
.dk-card{background:var(--dk-surface);border:1px solid var(--dk-line);border-radius:20px;padding:22px;box-shadow:var(--dk-card-shadow);}
.dk-card--raised{background:var(--dk-raised);} .dk-popover{background:var(--dk-elevated);box-shadow:0 12px 32px rgba(0,0,0,.5);}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){/* repetir os tokens acima */}}
```

## 7. Ícones e imagens

- Ícones **outline de 1.5px**, cantos arredondados, cor `#A0A0AB` (inativo) e `#F2F2F5`/acento (ativo).
- Ícones semânticos pequenos em círculo tingido (check verde, alerta âmbar, erro vermelho).
- Avatares: círculo com anel de 1–2px (lilás para destaque); silhuetas neutras quando sem foto.
- Gráficos: linha **lilás luminosa** com área em gradiente (acento 25% → transparente), grade tênue (`rgba(255,255,255,.06)`), ponto destacado com glow e tooltip em superfície Elevated.

## 8. Componentes (regras para construir)

- **Cards:** Surface + borda sutil + realce interno; título pequeno em cinza, valor grande em branco suave; delta em verde/vermelho; sparkline lilás.
- **Botões:** primário = **preenchimento acento** com texto escuro (`#14101A`) ou "outline + glow"; secundário = Raised com borda; ghost = só texto; destrutivo = vermelho tingido (fundo `rgba(248,113,113,.14)`, texto `#F87171`). Hover clareia 6–8% a superfície.
- **Inputs:** Raised, borda sutil, **foco** = anel acento 2px + glow; erro = borda `#F87171` + texto.
- **Chips/pills:** `rgba(255,255,255,.06)` com borda; ativo = acento tingido (`rgba(199,155,219,.16)` + texto acento).
- **Tabelas:** linhas sem divisor pesado, hover Raised, linha selecionada com tint acento 10%; cabeçalho cinza pequeno.
- **Toast/alertas:** Surface/Elevated com ícone tingido; faixa lateral semântica opcional.
- **Modal:** Elevated, raio 20px, scrim `rgba(0,0,0,.6)`; ações: Cancel (escuro) / Confirm (acento ou vermelho tingido).
- **Tooltip:** Elevated com borda e texto claro 12px.
- **Progress/skeleton:** trilha `rgba(255,255,255,.08)`, preenchimento acento; skeleton com shimmer em Raised.
- **Nav:** item ativo com fundo tingido de acento e barra/ponto; ícone + rótulo em cinza, ativo em branco.

## 9. Motion e interação

- Transições 150–250ms `ease-out`; fade e translate curtos; glow pulsante muito sutil (≤ 2s) apenas em ponto "ao vivo".
- Hover: superfície +1 degrau; foco sempre com anel visível (acento).
- Troca de tema: transição de `background-color`/`color` em 200ms; evite *flash* com script inicial que lê `localStorage`/`prefers-color-scheme` antes de pintar.
- `prefers-reduced-motion`: sem pulsos/parallax.

## 10. Acessibilidade

- Texto primário sobre Surface ≈ 16:1; **secundário `#A0A0AB` ≈ 7:1** (bom); **mudo `#6B6B76` ≈ 3.4:1**: só para texto ≥ 18px ou decorativo.
- Acento `#C79BDB` sobre Base ≈ 9:1 (ótimo para texto/ícone); texto sobre botão acento: use cor escura.
- Não dependa só de cor para delta positivo/negativo (use setas +/−).
- Evite texto branco puro sobre preto puro em parágrafos longos (halação); use `#F2F2F5` e entrelinha 1.6.
- Respeitar `prefers-color-scheme` e oferecer alternância manual persistente.

## 11. Erros comuns

- Preto `#000` puro no fundo e branco `#FFF` no texto (contraste exagerado e cansativo).
- Inverter cores do tema claro: sombras que somem, imagens estouradas, semânticos saturados vibrando.
- Elevação sem diferença de luminosidade (todos os cards da mesma cor).
- Excesso de glow/neon (vira cyberpunk) ou de gradientes.
- Bordas brancas fortes; use 8–10% de opacidade.
- Esquecer ilustrações/logotipos/captchas e `color-scheme: dark` em formulários nativos (scrollbars, inputs).

## 12. Combina com / não misture com

Combina com: **glassmorphism** (vidro escuro), **bento grid** (bento escuro), **typography luxury** (já é uma variante preto + dourado), minimalismo. Evite com: brutalismo claro, claymorphism e neomorfismo (dependem de superfícies claras).
