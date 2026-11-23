# Status da finalização da skill

Cada sessão lê este arquivo primeiro e o atualiza no fim. Plano em `PROMPT-FINALIZAR-SKILL.md`.

| Sessão | Itens | Modelo | Situação |
|---|---|---|---|
| A | Pacotes dos 9 sites | Sonnet, médio | **Feita.** Os 9 sites têm CLAUDE.md preenchido, cores por papel e `?tema=` (quente, frio, mono), atributos `data-*`, `conceito/` e `PROMPT-DE-USO.md`; 0 FAIL no `verificar-site.mjs` e antes/depois sem diferença visível (ver pendências) |
| B | Juiz, fidelidade, direção criativa | Opus, alto | Pendente |
| C | Módulos em `starters/` | Sonnet, médio | Pendente |
| D | Teste cego | Opus, alto | Pendente |
| E | `SKILL.md` enxuto | Opus, alto | Pendente |

## Pendências fora das sessões
- Análise do acervo de 910 sites (computador do usuário).
- Imagens e vídeos essenciais (usuário gera).

## Sessão A: o que foi entregue
- Scripts novos: `scripts/tematizar.mjs` (cores por papel e temas, mesma luminância), `replica/ferramentas/secoes.cjs` (capturas por seção) e `replica/ferramentas/palco.cjs` (sites sem rolagem: GQ Lab e Cartier). `scripts/gerar-pacote.mjs` agora gera também `PROMPT-DE-USO.md` e não sobrescreve CLAUDE.md já preenchido (`--forcar` regera). `verificar-site.mjs` passou a ler `color-mix`.
- Comparação antes/depois (mesmas posições de rolagem): 0,00% de pixels diferentes em BRUMA, TAINÁ e OLEA; até 0,1% em POLPA, AURA, CAIS (letras aleatórias e ruído); as diferenças restantes em ESCUTA e TURMALINA vêm de faixas e cenas 3D que andam por tempo (confirmado: o mesmo código também difere de si mesmo).

## Pendências da sessão A
- `?tema=` só recolore o que é CSS. Cores no JS/3D (GQ Lab, TURMALINA, picolé da POLPA, fumaça da TAINÁ, canvas da CAIS, ícones da ESCUTA) não seguem o tema (anotado em cada CLAUDE.md).
- GQ Lab e TURMALINA têm conteúdo em `src/roteiro.js` e `src/capitulos.js`; só limiares e tempos foram para `data-*`.
- Imagens essenciais continuam sendo do usuário (`galeria/IMAGENS-PARA-GERAR.md`); TAINÁ, POLPA, AURA, GQ Lab e TURMALINA não têm seção própria lá (usam renders nossos ou fotos provisórias).
- Avisos (WARN) do verificador mantidos, sem FAIL.
