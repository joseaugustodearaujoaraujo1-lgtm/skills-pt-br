# Status da finalização da skill

Cada sessão lê este arquivo primeiro e o atualiza no fim. Plano em `PROMPT-FINALIZAR-SKILL.md`.

| Sessão | Itens | Modelo | Situação |
|---|---|---|---|
| A | Pacotes dos 9 sites | Sonnet, médio | **Feita.** Os 9 sites têm CLAUDE.md preenchido, cores por papel e `?tema=` (quente, frio, mono), atributos `data-*`, `conceito/` e `PROMPT-DE-USO.md`; 0 FAIL no `verificar-site.mjs` e antes/depois sem diferença visível (ver pendências) |
| B | Juiz, fidelidade, direção criativa | Opus, alto | **Feita.** Juiz (`references/juiz.md` + `scripts/juiz.mjs`) calibrado às cegas: forte 6,45 > média 5,90 > degradado 5,45; nota de fidelidade (`replica/ferramentas/fidelidade.py`) calibrada contra o original da CAIS; direção criativa (`references/direcao-criativa.md` + etapa 3c no SKILL.md) |
| C | Módulos em `starters/` | Sonnet, médio | **Feita (6 módulos).** `starters/modulos/`: giro por quadros, trecho fixo com timeline, galeria horizontal, meio-tom, painel de vidro e cursor; cada um com README, HTML, CSS, JS e exemplo que passa no verificador com 0 FAIL. Cookies, som e pré-carregamento ficaram de fora |
| D | Teste cego | Opus, alto | **Feita.** Quatro sites feitos por agente limpo só com a skill (`teste-cego/`), com 0 FAIL e juiz às cegas. Dermatologia 6,75, joalheria 7,05 e produto 3D 5,40 (nota de produção à vista). Refeito com as regras novas, o produto 3D tirou **7,50: LIBERADO** nos dois juízes. Cada falha virou regra (`references/teste-cego.md`) |
| E | `SKILL.md` enxuto | Opus, alto | Pendente |

## Pendências fora das sessões
- Análise do acervo de 910 sites (computador do usuário).
- Imagens e vídeos essenciais (usuário gera).

## Sessão A: o que foi entregue
- Scripts novos: `scripts/tematizar.mjs` (cores por papel e temas, mesma luminância), `replica/ferramentas/secoes.cjs` (capturas por seção) e `replica/ferramentas/palco.cjs` (sites sem rolagem: GQ Lab e Cartier). `scripts/gerar-pacote.mjs` agora gera também `PROMPT-DE-USO.md` e não sobrescreve CLAUDE.md já preenchido (`--forcar` regera). `verificar-site.mjs` passou a ler `color-mix`.
- Comparação antes/depois (mesmas posições de rolagem): 0,00% de pixels diferentes em BRUMA, TAINÁ e OLEA; até 0,1% em POLPA, AURA, CAIS (letras aleatórias e ruído); as diferenças restantes em ESCUTA e TURMALINA vêm de faixas e cenas 3D que andam por tempo (confirmado: o mesmo código também difere de si mesmo).

## Sessão B: o que foi entregue
- **Juiz Awwwards.** `references/juiz.md` é o prompt do subagente avaliador. Notas de 0 a 10 em Design (40%), Usabilidade (30%), Criatividade (20%) e Conteúdo (10%), com âncoras objetivas por nota, descontos por defeito, tetos e correções ordenadas pelo ganho na média. Libera com média ≥ 7,5 e nenhum critério < 6.
- `scripts/juiz.mjs` captura 6 a 8 telas em 1440×900 e em 390×844 e monta `folha.jpg`, `fatos.md` (fontes, escala, ações na primeira dobra, alvos de toque, console) e `PEDIDO-AO-JUIZ.md`. Fecha o aviso de cookies depois da tela 1. Sites de palco fixo usam `--palco` (chama `replica/ferramentas/palco.cjs`); sem `--palco`, o script detecta o palco e avisa.
- **Calibração** em 5 rodadas às cegas (subagente novo a cada site), descrita em `references/juiz-calibracao.md`. Ela levou a quatro ajustes nas regras: tetos só para casos claros; defeito descontado uma vez e só quando esconde título, ação ou menu; render 3D conta como 3D; tipografia sem caráter limita Criatividade.
- **Nota de fidelidade.** `replica/ferramentas/fidelidade.py` compara o original e o nosso tela por tela, com 40% de SSIM de contraste e estrutura (insensível à paleta) e 60% de bordas a até 8 px. Avisa deslocamento acima de 8 px e acima de 2% da tela, confere a altura da página em 1% e só gera imagem de diferença abaixo do limite, nunca dentro do repositório. Aceite: toda tela ≥ 75. A calibração está no `PROTOCOLO.md`, seção 5.5: nosso × nosso 99,9; tema trocado 99,9; deslocado 8 px 99,0; deslocado 20 px 71,5; outro site 37,7; CAIS × Terminal original 65,7. As capturas do original ficaram no scratchpad.
- **Direção criativa.** `references/direcao-criativa.md` traz o `DIRECAO.md` (ideia em uma frase com cinco testes, gesto por seção visível em tela parada, regra inquebrável, o que NÃO faz, momento "uau"), um banco de conceitos com 16 temas e seus clichês, e exemplos bons e ruins. Ganhou a etapa 3c no `SKILL.md` ("seção sem gesto não está pronta"), um item na rubrica e a opção `--direcao` no juiz.

## Sessão D: o que foi entregue
- **Teste cego** (`references/teste-cego.md`). Cada subagente novo recebeu só o caminho da skill e um briefing de uma linha, e fez hero + 2 seções em `teste-cego/rN-*/` (fora da galeria). A medição usou `verificar-site.mjs` e `juiz.mjs` com juiz limpo e material com nome neutro; perto do corte, dois juízes, e vale a menor nota.

  | Rodada | Briefing | Verificador | Nota |
  |---|---|---|---|
  | 1 | Dermatologia | 0 FAIL | 6,75 |
  | 2 | Joalheria | 0 FAIL | 7,05 |
  | 3 | Produto 3D | 0 FAIL na época, hoje FAIL | 5,40 |
  | 3b | Produto 3D, refeito | 0 FAIL | **7,50, LIBERADO** |

  Melhor da galeria: TAINÁ, 6,45. Na rodada 3, sem o defeito, a nota estaria perto de 7,30.
- **Cerca de 45 regras curtas**, cada uma marcada "(teste cego, rodada N)":
  - `elementos.md`: placeholder sem texto e com cara de imagem final; menu e ação em toda a rolagem; seção ativa; formulário com tratamento próprio; faixas separadas no celular; botão fixo com espaço reservado; rótulos sem colisão; um gatilho por passo; `svh` fora do GSAP.
  - `direcao-criativa.md`: estado-chave parado na tela; seções irmãs diferentes; gesto no celular; gesto com massa visual; gesto no material do objeto; paleta recomendada conferida contra os clichês.
  - `perguntas.md`: provas; CRM/RQE em saúde; especificação de produto de conceito.
  - Também `rubrica.md`, `aprovacoes.md` (modo sem usuário e 3D sem gerador), `3d-leve.md` (WebGL2 puro, plano B julgado sem GPU, metal escovado, exceção do IoU), `anti-cliches.md` e `pesquisa.md`.
  - No topo do `SKILL.md`: caminhos e modo sem usuário.
- **Scripts:**
  - `verificar-site.mjs` reprova **nota de produção à vista** (também dentro de SVG usado como imagem), acha o playwright e o Chromium sozinho, não conta © como emoji, mede texto de SVG na tela e força imagens `lazy` antes da captura.
  - `juiz.mjs` marca nota de produção como texto provisório.
  - `pesquisar-referencias.mjs` segue sem acervo.
  - `criar-projeto.mjs` ganhou `--cores` (paleta escolhida, acento suave e texto do botão com aviso de contraste), baixa a fonte mono e repassa `--ref3d` e `--3d`.
  - O starter respeita `[hidden]`.
- Imagens essenciais das 4 rodadas em `galeria/IMAGENS-PARA-GERAR.md`, seção "Teste cego".

## Pendências da sessão D
- Nenhum site passou de 7,5. Para chegar a 8, os juízes pedem sempre o mesmo: composição própria em cada seção irmã e um "uau" que apareça na foto.
- O bloco 2 (sites de referência) depende do acervo local. Sem ele, a pesquisa ao vivo dá uma referência só, e o Awwwards recusou a conexão em 3 de 4 rodadas.
- O juiz só vê o plano B do 3D (sem GPU).
- O mapa de fontes de `typography-luxury` ainda é Playfair + Inter. O starter ainda anima de baixo para cima e usa a porta 3001 fixa (sessão E).

## Sessão C: o que foi entregue
- `starters/modulos/` (ver o `README.md` dessa pasta): 6 módulos, cada um com `README.md` (quando usar, parâmetros, armadilhas), `modulo.html`, `modulo.css`, `modulo.js` e `exemplo/` (`npm run build` + `node servir.mjs`). Números tirados da OLEA (48 quadros, canvas 47vw), BRUMA (hero 400vh, cartão 433 px, meio-tom 8×6 px, rótulo com atraso 0,3 s), POLPA (trilho com `scrub: 1`) e dos painéis de vidro de OLEA, GQ Lab, BRUMA e Terminal. Código reescrito; nada de terceiros.
- `starters/modulos/testar-todos.mjs` constrói, serve e roda o `verificar-site.mjs` nos 6 exemplos: 0 FAIL em todos (WARN de página mínima: poucas imagens e pouco movimento). Comportamento conferido com Playwright: quadro muda com a rolagem, trilho fica preso e anda 2141 px, classes do cursor mudam por estado.
- Dependências dos exemplos: `npm install` uma vez em `starters/modulos/` (esbuild, gsap, lenis). `public/app.js` e `app.css` dos exemplos não são versionados.

## Pendências da sessão C
- Faltam os módulos de cookies, botão de som e pré-carregamento (referência: `galeria/05-bruma/src/main.js`).
- O meio-tom roda no navegador (protótipo); para produção, gerar a máscara uma vez (script Python da BRUMA em `galeria/05-bruma/cena/preparar.py`).
- Os módulos ainda não estão ligados ao `SKILL.md` nem ao `criar-projeto.mjs` (sessão E).

## Pendências da sessão B
- Nenhum site da galeria passa no juiz (melhor nota: 6,45, TAINÁ). As correções devolvidas estão em `references/juiz-calibracao.md` e podem virar tarefa depois da sessão D.
- O juiz não vê movimento. `fatos.md` mede o maior texto mesmo quando ele está escondido.
- Variação entre juízes de cerca de ±0,3: perto do corte, rodar dois juízes e ficar com a menor nota (regra 7 do `juiz.md`).

## Pendências da sessão A
- `?tema=` só recolore o que é CSS. Cores no JS/3D (GQ Lab, TURMALINA, picolé da POLPA, fumaça da TAINÁ, canvas da CAIS, ícones da ESCUTA) não seguem o tema (anotado em cada CLAUDE.md).
- GQ Lab e TURMALINA têm conteúdo em `src/roteiro.js` e `src/capitulos.js`; só limiares e tempos foram para `data-*`.
- Imagens essenciais continuam sendo do usuário (`galeria/IMAGENS-PARA-GERAR.md`); TAINÁ, POLPA, AURA, GQ Lab e TURMALINA não têm seção própria lá (usam renders nossos ou fotos provisórias).
- Avisos (WARN) do verificador mantidos, sem FAIL.
