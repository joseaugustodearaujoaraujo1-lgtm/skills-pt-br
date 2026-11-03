# Cyberpunk (Neon / HUD futurista)

> **Sem imagens de referência** (o material de origem não tinha pranchas deste estilo). Este guia foi escrito a partir de convenções do gênero (neon sobre preto, HUD, glitch, cantos chanfrados) e **não foi validado contra um kit visual**. Os valores são propostas coerentes, não extraídas de imagens. Não há componentes de referência: construa-os seguindo as regras desta página.

## 1. Essência

Futuro distópico de alta tecnologia: **fundos quase pretos com roxo/azul-noite**, **neon saturado** (ciano, magenta, amarelo-ácido) com **brilho (glow)**, **cantos chanfrados** em vez de arredondados, molduras e **colchetes de HUD**, texto em **caixa-alta com fontes técnicas/monoespaçadas**, **scanlines, ruído, glitch** e **aberração cromática**. A interface parece o display de um implante cibernético ou de um terminal numa cidade chuvosa à noite.

Sensação: elétrica, agressiva, tecnológica, noturna, gamer/sci-fi.

## 2. Quando usar e quando evitar

**Bom para:** jogos e e-sports, landing pages de eventos tech/música eletrônica, portfólios criativos, produtos de cibersegurança/crypto (com moderação), páginas de lançamento, telas de loading/404, dashboards "mission control" temáticos.

**Evitar quando:** o público é geral/corporativo/saúde, o uso é diário e longo (fadiga visual), acessibilidade rigorosa é obrigatória ou há muito texto corrido. Use em doses: títulos, CTAs, painéis de destaque; mantenha áreas de leitura calmas.

## 3. Paleta (proposta)

| Papel | Hex | Uso |
|---|---|---|
| Fundo profundo | `#07060D` | Página (quase preto com tom roxo) |
| Superfície | `#0F0D1A` | Painéis |
| Superfície elevada | `#171428` | Cards internos, modais |
| **Ciano neon** | `#00F0FF` | Acento primário: bordas, links, foco, dados |
| **Magenta/rosa neon** | `#FF2BD6` | Acento secundário: CTAs, destaque, hover |
| **Amarelo ácido** | `#FCEE0A` | Alerta, destaque raro, marcadores |
| **Violeta elétrico** | `#7B2CFF` | Gradientes, sombras luminosas |
| Vermelho neon | `#FF2E4D` | Erro, perigo |
| Verde neon | `#39FF88` | Sucesso, online |
| Texto | `#E6F1FF` | Texto principal (branco-azulado) |
| Texto secundário | `#8B93B8` | Legendas |
| Linha/grade | `rgba(0,240,255,.18)` | Bordas, grade de fundo |

Regra: **fundo escuro + 2 neons principais (ciano e magenta)**; amarelo e verde só como semântica/marcador. Neon em linhas, texto curto e ícones; nunca em grandes preenchimentos.

## 4. Tipografia

- **Display técnico/futurista:** *Orbitron*, *Rajdhani*, *Chakra Petch*, *Audiowide*, *Michroma*; em caixa-alta, tracking 0.04–0.12em.
- **Texto/dados:** *Share Tech Mono*, *JetBrains Mono*, *IBM Plex Mono*, *Space Mono*; corpo em sans técnica (*Rajdhani*, *Exo 2*, *Inter*) com 15–16px.
- Títulos com **glow** (`text-shadow` ciano/magenta) e **glitch** ocasional (cópias deslocadas em ciano e magenta); rótulos em mono caixa-alta com prefixo `//`, `>` ou `[ ]`.
- Números de HUD grandes em display, com `tabular-nums`; cursor de terminal piscando `_`.
- Mantenha parágrafos em cor `#E6F1FF` com boa entrelinha (1.6); neon só em palavras-chave.

## 5. Grade, cantos e espaçamento

- **Cantos chanfrados** (corte de 45°) em painéis, botões e inputs via `clip-path: polygon(...)`, em vez de `border-radius`.
- Espaçamento 4/8/16/24/32; painéis com padding 20–28px; gutters 16–24px.
- Grade de fundo (linhas finas ciano a 6–10%), **colchetes de HUD** nos cantos (`┌ ┐ └ ┘`) e linhas de dados decorativas.
- Layout em módulos tipo console, alinhado, com cabeçalhos de painel em barra (título à esquerda, ID/códigos à direita).

## 6. Superfícies, bordas e efeitos

- **Bordas de 1–2px em neon** (ciano) com **glow** externo: `box-shadow: 0 0 0 1px #00F0FF, 0 0 16px rgba(0,240,255,.45)`.
- **Gradientes** diagonais violeta→magenta→ciano em barras e botões primários.
- **Scanlines** (`repeating-linear-gradient` horizontal a 3–4% de opacidade) e **ruído** sobre o fundo; vinheta nas bordas.
- **Glitch** (clip + translate + cores separadas) em títulos e hover, em animação curta; **aberração cromática** (`text-shadow: 2px 0 #FF2BD6, -2px 0 #00F0FF`).
- Cantos cortados com marca de acento (triângulo neon num canto).

```css
:root{
  --cp-bg:#07060D; --cp-surface:#0F0D1A; --cp-raised:#171428;
  --cp-cyan:#00F0FF; --cp-magenta:#FF2BD6; --cp-yellow:#FCEE0A; --cp-violet:#7B2CFF;
  --cp-text:#E6F1FF; --cp-text-2:#8B93B8; --cp-line:rgba(0,240,255,.18);
  --cp-cut:polygon(0 12px,12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%);
  --cp-glow:0 0 16px rgba(0,240,255,.45);
}
body{background:
  repeating-linear-gradient(0deg,rgba(255,255,255,.03) 0 1px,transparent 1px 3px),
  linear-gradient(rgba(0,240,255,.06) 1px,transparent 1px) 0 0/40px 40px,
  linear-gradient(90deg,rgba(0,240,255,.06) 1px,transparent 1px) 0 0/40px 40px,var(--cp-bg);
  color:var(--cp-text);font:400 16px/1.6 "Rajdhani","Share Tech Mono",system-ui,sans-serif;}
.cp-panel{position:relative;background:var(--cp-surface);padding:24px;clip-path:var(--cp-cut);
  box-shadow:inset 0 0 0 1px var(--cp-line);}
.cp-title{font:700 clamp(2rem,6vw,4.5rem)/1 "Orbitron",sans-serif;text-transform:uppercase;letter-spacing:.06em;
  text-shadow:2px 0 var(--cp-magenta),-2px 0 var(--cp-cyan),0 0 24px rgba(0,240,255,.4);}
```

## 7. Ícones e imagens

- Ícones **linha fina geométrica (1.5–2px)** com cantos retos/chanfrados, em ciano; versões preenchidas em neon para estados ativos; ícones de HUD (alvo, radar, chip, cadeado, escudo, bateria, wifi, terminal).
- Imagens com **duotone** (magenta/ciano), grão e scanlines; fotos noturnas urbanas com chuva e neon; retratos com sobreposição de glitch.
- Ornamentos: códigos hex, barras de carregamento, QR/barcode, setas `>>`, marcadores `//`.

## 8. Componentes (regras para construir)

- **Botão primário:** corte diagonal, fundo gradiente ciano→violeta/magenta, texto escuro ou branco em caixa-alta mono; hover com glitch curto + glow; pressed com deslocamento e brilho reduzido. **Secundário:** contorno neon + texto neon + fundo transparente. **Perigo:** vermelho neon.
- **Inputs:** fundo `#0A0914`, borda ciano 1px com cantos chanfrados, **foco** com glow e cursor `_` piscando; erro em vermelho neon com mensagem `// ERROR`.
- **Toggle/checkbox/radio:** formas retas/chanfradas, ligado em ciano/magenta com glow; slider com trilha em segmentos e knob losango.
- **Cards/painéis:** cabeçalho em barra com código (`ID-0427`), colchetes nos cantos, linhas de dados; hover com varredura de luz.
- **Tabela:** cabeçalho mono caixa-alta ciano, linhas com divisor tênue, linha ativa com barra neon à esquerda.
- **Badges/tags:** contorno neon com fundo translúcido (`rgba(0,240,255,.1)`), cantos cortados; status com ponto luminoso.
- **Progress:** barra segmentada (blocos) com preenchimento neon e glow; anel/radar para métricas; loader com texto `LOADING…` e % crescente.
- **Alertas/toasts:** painéis com borda lateral semântica (ciano info, amarelo alerta, vermelho erro, verde sucesso), ícone neon e mensagem em mono.
- **Modal:** moldura com colchetes de HUD, scrim com desfoque e ruído, título com glitch.
- **Navegação:** barra superior com itens em mono caixa-alta, ativo com sublinhado/brilho neon; sidebar com ícones e indicadores luminosos; breadcrumbs `> HOME > MODULE > TARGET`.
- **Gráficos:** linhas neon com glow sobre grade tênue, áreas em gradiente translúcido, tooltips com cantos cortados.

## 9. Motion e interação

- **Glitch** curto (80–200ms) em hover e na entrada de títulos (`steps()` e deslocamentos de 2–4px com `clip-path`); **flicker** de neon ocasional (opacidade 0.85–1, rápido).
- Varredura de scanline e texto digitado (typewriter) em painéis; contadores "decodificando" (embaralhar caracteres e fixar).
- Transições 120–200ms, `linear`/`steps` para ar mecânico; barras e anéis animam com `ease-out`.
- `prefers-reduced-motion`: **desligar glitch, flicker e scanlines animadas** (obrigatório); manter só mudança de cor/brilho estática.

## 10. Acessibilidade

- Neon sobre escuro costuma ter bom contraste (ciano `#00F0FF` sobre `#07060D` ≈ 14:1; magenta `#FF2BD6` ≈ 6:1), mas **texto longo em neon cansa**: parágrafos em `#E6F1FF`.
- **Efeitos que causam desconforto:** flicker e glitch rápidos podem desencadear sensibilidade (WCAG 2.3.1: sem mais de 3 flashes por segundo). Mantenha-os sutis, curtos e desativáveis.
- Não dependa só de cor (vermelho/verde): use ícones e texto (`// ERROR`).
- Foco visível (glow + contorno), alvos ≥ 44px, fonte mono ≥ 14px.
- Evite texto sobre imagens com glitch/ruído sem camada de contraste.

## 11. Erros comuns

- **Neon por toda a tela**: perde hierarquia e cansa; use neon como acento e deixe áreas escuras/calmas.
- Cores demais (arco-íris): limite a 2 neons principais + semânticos.
- Border-radius suave (quebra o visual de HUD): use chanfros e ângulos retos.
- Glow exagerado (borrão ilegível) ou fontes finas demais sob glow.
- Animações constantes e simultâneas (parece quebrado), sem opção de reduzir movimento.
- Estética de "cartaz" em tela de produto: preserve a usabilidade (contraste, alvos, tamanhos).

## 12. Combina com / não misture com

Combina com: **dark mode** (base técnica), glassmorphism escuro (painéis translúcidos com borda neon) e pixel art em temas de jogo. Evite com: minimalismo claro, claymorphism, neomorfismo, tipografia luxury (dourado × neon se anulam) e bento claro.
