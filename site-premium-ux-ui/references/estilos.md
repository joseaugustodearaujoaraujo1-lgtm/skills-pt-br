# Escolha do estilo visual (10 estilos)

Os 10 estilos estão detalhados na skill `estilos-paletas-design` (`~/.claude/skills/estilos-paletas-design/references/<estilo>.md`). Esta página diz **como escolher** o melhor para o tema e **como combinar** com o nível Awwwards / One Page Love.

## Procedimento
1. Rode o seletor (usa tema + adjetivos + o que evitar):
   ```bash
   node ~/.claude/skills/site-premium-ux-ui/scripts/escolher-estilo.mjs --tema "joalheria" --adjetivos "elegante,sofisticado,raro" --evitar "neon,infantil"
   ```
   Ele devolve um **estilo principal**, um **secundário compatível** e o ranking, com os motivos.
2. Leia **só** o arquivo do estilo principal (e do secundário, se for usar). Não carregue os dez.
3. Apresente ao usuário 2 ou 3 direções (segura, ousada, fora da caixa) com um parágrafo cada e a captura de 1 ou 2 referências do acervo; peça a escolha.
4. Aplique o estilo por **tokens** do `brief.json` (cor, fonte, raio, sombra, motion), e não por classes soltas.

## Como o estilo se encaixa no que os premiados fazem
| Estilo | Quando funciona em nível Awwwards/OPL | Cuidado |
|---|---|---|
| Typography Luxury | Moda, joias, hotéis, editorial. Título serifado enorme + muito respiro | Não vire "preto e dourado de template": escolha o dourado do tema e uma serifa com personalidade |
| Minimalism | Bem-estar, arquitetura, ceramistas. Foto grande, tipografia leve | Fácil de ficar genérico: precisa de **um** gesto de movimento e boa fotografia |
| Brutalism | Agências, portfólios, cultura. Tipografia condensada gigante, bordas, cor ácida | Mantenha a legibilidade e o contraste; ousado ≠ confuso |
| Dark Mode | Tecnologia, IA, automotivo, música. Mais de metade dos premiados é escuro | Sem imagens de referência na skill de estilos: valide com protótipo; elevação por luminosidade, não por sombra |
| Glassmorphism | Dashboards, produtos tech. Vidro fosco sobre fundo colorido | Só funciona com fundo rico por trás; cuide do desempenho (backdrop-filter) |
| Bento Grid | SaaS e produtos com vários recursos | Os cards precisam de **tamanhos diferentes** e conteúdo real |
| Claymorphism | Marcas acolhedoras, café, infantil | Raios enormes e sombras duplas exigem disciplina de tokens |
| Pixel Art | Jogos, nostalgia | Arte própria; não use assets de jogos de terceiros |
| Cyberpunk | E-sports, eventos tech, música eletrônica | Sem referências na skill de estilos; evite excesso de neon e glitch |
| Neomorphism | Painéis táteis, calculadoras, casa inteligente | Contraste fraco por natureza: conferir AA e dar bordas nos estados de foco |

## Combinações que funcionam
`dark-mode + typography-luxury` · `dark-mode + glassmorphism` · `bento-grid + dark-mode` · `minimalism + typography-luxury` · `brutalism + dark-mode` · `claymorphism + minimalism`.
O secundário entra como **detalhe** (um componente, um tratamento de imagem), não como segundo tema.

## Estilo não é identidade
O estilo define o vocabulário visual. A **identidade** (paleta por tema, fontes, elementos de assinatura) é o que diferencia a marca. Dois sites no mesmo estilo devem parecer de marcas diferentes: use a paleta de `gerar-paleta.mjs` com acento próprio e invente 1 ou 2 elementos de assinatura (forma, tratamento de imagem, cursor, transição).
