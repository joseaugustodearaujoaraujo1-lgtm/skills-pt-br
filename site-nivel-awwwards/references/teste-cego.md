# Teste cego da skill (sessão D, 2026-11-23)

Pergunta: **um agente limpo, só com a skill, faz um site de nível Awwwards?** Para manter a skill, não para o agente que constrói.

## Como foi feito
- Para cada briefing, um subagente **novo** (sem contexto) recebeu só o caminho da skill, o briefing de uma linha e o pedido: site de uma página com hero e 2 seções, numa pasta de `teste-cego/` (fora de `galeria/`). Não havia usuário para responder às perguntas.
- Medição: `scripts/verificar-site.mjs` (meta: 0 FAIL) e `scripts/juiz.mjs` + juiz limpo (`references/juiz.md`). O material do juiz foi gerado no scratchpad, com nome neutro ("site K"), para o juiz não saber que era um teste. Com critério perto do corte, rodaram dois juízes e ficou a **menor** média (regra 7).
- Comparação: os sites da galeria julgados na calibração (`juiz-calibracao.md`, rodada 5): TAINÁ 6,45 (melhor), BRUMA 6,00, POLPA 6,15, AURA 5,90 e POLPA degradada 5,45. Meta da sessão: chegar a 6,45 ou mais. Para liberar o site são 7,5.
- Cada falha do verificador, cada nota baixa do juiz e cada trava do processo viraram uma regra curta no arquivo certo, marcada "(teste cego, rodada N)".

## Resultado

| Rodada | Briefing | Pasta | Verificador | Juiz 1 | Juiz 2 | Nota (menor) | × galeria |
|---|---|---|---|---|---|---|---|
| 1 | Clínica de dermatologia em São Paulo | `teste-cego/r1-dermatologia/` | 0 FAIL (1 WARN falso, corrigido no script) | 6,75 | 6,85 | **6,75** | acima da TAINÁ (6,45) |
| 2 | Joalheria de luxo | `teste-cego/r2-joalheria/` | 0 FAIL, 0 WARN | 7,05 | (não precisou: fora da faixa de corte) | **7,05** | acima da TAINÁ |
| 3 | Produto físico com 3D | `teste-cego/r3-produto-3d/` | 0 FAIL na época; com o verificador novo, 3 FAIL (nota de produção) | 5,40 | (não precisou) | **5,40** | abaixo; sem a nota de produção seria ~7,30 |
| 3b | Produto físico com 3D, de novo (agente novo, skill com as regras das rodadas 1 a 3) | `teste-cego/r3b-produto-3d/` | 0 FAIL, 0 WARN | 7,50 | 7,50 | **7,50 · LIBERADO** | 1,05 acima da TAINÁ; o primeiro a chegar ao corte |

Notas por critério (Design / Usabilidade / Criatividade / Conteúdo):
- Rodada 1: juiz 1, 7 / 6,5 / 7 / 6; juiz 2, 7 / 6,5 / 7 / 7.
- Rodada 2: 7 / 7 / 7 / 7,5.
- Rodada 3: 7 / **3** (teto: texto provisório) / 7,5 / **2** (teto: texto provisório). Antes dos tetos, Usabilidade e Conteúdo estavam em 7,5.
- Rodada 3b: os dois juízes deram 7,5 / 7,5 / 7,5 / 7,5.

**Leitura:** com a skill sozinha, um agente limpo fez dois sites acima do melhor da galeria (6,75 e 7,05) e um que perdeu tudo por um único defeito evitável. Nenhum chegou a 7,5. O que segura todos no 7 é o mesmo: seções que repetem o bloco, gestos declarados que não aparecem numa tela parada e acabamento de celular. A rodada 3 mostrou também que **regra escrita não basta**: a regra do placeholder já existia depois da rodada 1 e o agente não a seguiu. Por isso ela virou FAIL no verificador. Com essas regras e as correções nos scripts, a rodada 3b (mesmo briefing, agente novo) foi **LIBERADA com 7,50**, nos dois juízes: 0,45 a 2,10 acima das outras rodadas e 1,05 acima do melhor site da galeria. As correções que os dois juízes pediram coincidem e são todas de acabamento: o botão fixo do celular, os rótulos que colidem, o placeholder que não se lê e a linha d'água fina demais.

## Rodada 1: clínica de dermatologia
**O que o agente fez:** "Estrato Dermatologia". Usou HTML + GSAP e o estilo Minimalism com paleta creme, rosa e musgo. A ideia é "a rolagem desce pelas camadas da pele": o hero é um corte em 3 fatias com a espessura em mm, uma régua de profundidade fixa fica na margem, e o fundo escurece a cada camada. As seções são as queixas por camada e a primeira consulta com formulário. Lighthouse deu 100 nas quatro notas. Passou de primeira: 0 FAIL e 6,75, acima de todos os sites da galeria.

**Falhas e a regra criada para cada uma:**

| # | Falha (fonte) | Regra criada | Onde |
|---|---|---|---|
| 1 | Etiqueta "IMAGEM PROVISÓRIA · arquivo" sobre as imagens: risco de leitura como texto provisório (juízes 1 e 2) | Placeholder de imagem essencial sem texto à vista; o nome vai em `data-imagem` e na lista; desenhado no tamanho, na proporção e nas cores finais | `elementos.md` §3 |
| 2 | As três camadas repetem o mesmo bloco, o que segura o Design no 7 (juízes 1 e 2) | Seções irmãs mudam pelo menos duas coisas: escala, coluna, corte na borda, imagem | `direcao-criativa.md` §2 |
| 3 | Gestos declarados (fatias que se afastam, linha de leitura) não aparecem nas telas paradas, o que segura a Criatividade no 7 (juízes 1 e 2) | O estado-chave dura ≥ 25% da seção e o do hero aparece entre 10% e 15% da página; conferir nas telas do `juiz.mjs` antes de entregar | `direcao-criativa.md` §2 |
| 4 | O cabeçalho some ao rolar e o menu e a ação saem de alcance, o que segura a Usabilidade em 6,5 (juízes 1 e 2) | Barra compacta fixa no desktop e botão fixo no pé no celular, em toda a rolagem | `elementos.md` §8, `rubrica.md` §2 |
| 5 | O celular perde a régua, que é o gesto-assinatura (juízes 1 e 2) | Gesto-assinatura com versão de celular, nunca `display: none` | `direcao-criativa.md` §2 |
| 6 | As fatias do hero ficam abaixo da dobra no celular (juiz 2) | No celular, o protagonista do hero vem logo abaixo do título | `elementos.md` §8 |
| 7 | Mono de 11 px claro demais; rótulos da régua encostam no h1 (juízes 1 e 2) | Rótulo ≥ 12 px (13 no celular) com contraste de leitura; coluna reservada para o elemento fixo da margem | `elementos.md` §8 |
| 8 | Símbolo do logo parece hambúrguer e não abre nada (juiz 1) | Três barras só para menu | `elementos.md` §8 |
| 9 | Faltam provas da clínica: médico, CRM/RQE, endereço, horário (juízes 1 e 2) | Pedir as provas no bloco 1; em saúde, CRM/RQE e endereço são obrigatórios; sem dados, não inventar e listar o que falta | `perguntas.md` 1.2 |
| 10 | Sem o acervo (`~/Documents/acervos-design`), `opcoes.mjs` quebrava com ENOENT (agente) | O script avisa e segue sem os sites do acervo (pesquisa ao vivo) | `scripts/pesquisar-referencias.mjs` |
| 11 | O verificador não achava o playwright-core e o Chromium sem variáveis (agente) | Caminhos comuns (`/opt/node-tools`, `/opt/pw-browsers`) incluídos, como no `juiz.mjs`; o SKILL.md diz quando definir `PLAYWRIGHT_CORE` e `CHROME` | `scripts/verificar-site.mjs`, `SKILL.md` |
| 12 | WARN de emoji falso: o "©" do rodapé (agente) | ©, ®, ™ fora da contagem | `scripts/verificar-site.mjs` |
| 13 | Sem usuário, "Posso começar?" e as aprovações não tinham saída (agente) | Escolher a opção recomendada e registrar em `design/DECISOES.md` | `SKILL.md` (topo) |
| 14 | O 3D foi cortado porque os portões de molde e prévia exigem aprovação do usuário (agente) | Sem usuário: referências abertas, molde = o próprio modelo three.js renderizado em 4 vistas e conferido, prévia gravada; molde e vídeo ultrarrealistas vão para `IMAGENS.md` | `aprovacoes.md` |
| 15 | O caminho `~/.claude/skills/...` citado não era onde a skill estava (agente) | Nota de caminhos no topo do SKILL.md | `SKILL.md` |
| 16 | Imagem com `decoding="async"` e revelação por máscara saiu vazia na captura de página inteira (agente) | Sem `decoding="async"` em imagem que começa escondida | `elementos.md` §3 |

**Ficou pendente (sessão E):** o `criar-projeto.mjs` grava a paleta gerada do tema e não a "recomendada" do `opcoes.mjs` (a de origem do estilo); também não baixa a fonte mono que o brief define. O starter anima tudo de baixo para cima, o que conflita com a regra de direção de muitos conceitos. A porta 3001 é fixa no starter.

## Rodada 2: joalheria de luxo
**O que o agente fez:** "Vésper". A referência foi a ORE (Site of the Day), achada ao vivo. A ideia é "uma luz só acende a pedra, faceta por faceta". No hero, a marca aparece gigante, com um diamante de 57 facetas em WebGL2 com ray tracing, e o cursor é a única luz. Na lapidação, a pedra fica fixa e gira com a rolagem, com cotas reais (57%, 34,5°, 40,75°). Nas peças, cada uma se revela num círculo de luz, e há formulário de visita. Lighthouse deu 100/100/100/100 no desktop e 99/100/100/100 no celular. Passou de primeira: 0 FAIL e 7,05.

| # | Falha (fonte) | Regra criada | Onde |
|---|---|---|---|
| 1 | Poços de luz das peças vazios nas telas paradas (juiz) | Revelação termina até a peça entrar 30% na tela | `direcao-criativa.md` §2 |
| 2 | Formulário com campos e `select` nativos, sem tratamento (juiz) | Campos no sistema visual; até 5 opções viram opções clicáveis | `elementos.md` §8 |
| 3 | O menu não marca a seção, e no celular só há "Agendar" (juiz) | Seção ativa marcada; botão "Menu" de 44 px no celular | `elementos.md` §8 |
| 4 | Playfair + Inter, "par de luxo muito visto" (juiz) | Trocar por serifado de display com mais caráter e registrar | `anti-cliches.md` |
| 5 | Gesto do hero diferente do declarado (pedra acima da palavra, não na frente) (juiz) | Já coberto: conferir cada gesto nas telas do `juiz.mjs` | `direcao-criativa.md` §2 |
| 6 | Faltam lugar e pessoa (endereço, lapidário) (juiz) | Já coberto: provas no bloco 1 | `perguntas.md` 1.2 |
| 7 | O brief recomendou dourado sobre preto, o clichê do tema (agente) | Conferir a paleta e o estilo recomendados contra o "não faz" | `direcao-criativa.md` §4 |
| 8 | Regra −1 (three.js com PBR) contra "WebGL2 puro" para o diamante (agente) | WebGL2 puro vale para um objeto só | `3d-leve.md` (topo) |
| 9 | Princípio 3 ("quase igual") contra `pesquisa.md` ("nunca molde") (agente) | Molde de estrutura e experiência; o protegido nunca | `pesquisa.md` |
| 10 | Texto de SVG medido em unidade do viewBox, falso "texto pequeno" (agente) | Tamanho na tela pela matriz do SVG | `scripts/verificar-site.mjs` |
| 11 | GSAP não entende `svh` e o objeto saiu do lugar no celular (agente) | `svh` só no CSS; no GSAP, px ou `vh` | `elementos.md` §5 |
| 12 | Sem GPU, o verificador e o juiz só veem o pôster (agente) | O plano B carrega o gesto (quadros da cena); `?gpu=1` força o WebGL | `3d-leve.md` |

## Rodada 3: produto físico com 3D
**O que o agente fez:** "MÓ 01", um moedor de pimenta de nogueira e aço. A ideia é "role e o moedor se abre, peça por peça, ao longo do eixo". O hero tem uma régua de 20 cm ao lado do moedor. Na rolagem vem a vista explodida das seis peças com linhas de cota, depois a regulagem clique a clique e a lista de espera. O 3D é three.js com geometria em código e materiais PBR. Sem GPU, a página mostra 24 quadros renderizados da própria cena. Lighthouse deu 100/100/100/100 e 99/100/100/100. O juiz deu 5,40: o placeholder da foto "na mão" era um SVG com o texto "FOTO A GERAR · moedor-na-mao.webp · ver IMAGENS.md", e isso conta como texto provisório, com tetos de 3 e 2.

| # | Falha (fonte) | Regra criada | Onde |
|---|---|---|---|
| 1 | Nota de produção à vista, dentro de um SVG de placeholder (juiz) | **FAIL no verificador**: "imagem provisória", "a gerar", "placeholder", "IMAGENS.md" ou nome de arquivo à vista, também dentro de SVG usado como `<img>`; o `juiz.mjs` também marca | `scripts/verificar-site.mjs`, `scripts/juiz.mjs` |
| 2 | Cota acesa de um passo com o texto de outro (juiz) | Um gatilho só para cada passo (mesmo índice) | `elementos.md` §5 |
| 3 | No celular, o cartão cobre o objeto e a metade de baixo fica vazia (juiz) | Objeto e texto em faixas separadas no celular | `elementos.md` §8 |
| 4 | Disco da regulagem desenhado plano, sem relação com o anel 3D (juiz) | O gesto usa o render e o material do objeto | `direcao-criativa.md` §2 |
| 5 | Rótulo dinâmico contradiz a legenda ("para peixes" × "saladas, ovos, legumes") (juiz) | Conferir textos que mudam com a rolagem | `rubrica.md` §4 |
| 6 | D03 a D05 com a mesma composição (juiz) | Já coberto: seções irmãs não repetem o bloco | `direcao-criativa.md` §2 |
| 7 | O `criar-projeto.mjs` gravou a paleta gerada, não a escolhida (2ª vez) e não baixou a mono (agente) | `--cores` grava a paleta escolhida; a mono do brief é baixada; sem `--cores`, aviso | `scripts/criar-projeto.mjs`, `SKILL.md` §5 |
| 8 | Sem gerador, o portão de igualdade dá IoU 1,0 sempre (molde e site do mesmo código) (agente) | Nesse caso a prova é a comparação com as referências reais | `aprovacoes.md` |
| 9 | Dúvida entre "sem números inventados" e as medidas de um produto de conceito (agente) | Medidas e materiais são especificação a confirmar; avaliações, vendas e prêmios nunca | `perguntas.md` 1.2 |

## Rodada 3b: produto físico com 3D, de novo
**O que o agente fez:** "Fervo 3", uma cafeteira moka de inox com 12 faces. A ideia é "a água sobe". No hero, a cafeteira fica entre as palavras do título e uma linha d'água marca o nível máximo. Em "Por dentro", ela se desmonta na vertical e a linha sobe de peça em peça, com uma cota por passo. Na ficha vêm as cotas de engenharia e a lista de espera, com chips de fogão no lugar de um `select`. O 3D é three.js com geometria em código. Sem GPU, a página mostra 48 quadros da mesma cena, e `?gpu=1` força o WebGL. As referências vieram de 4 fotos abertas do Wikimedia Commons. Lighthouse deu 100 em tudo no desktop e 96/100/100/100 no celular. Desta vez o agente usou as regras novas: placeholder sem texto, menu fixo com a seção ativa marcada, botão "Menu" no celular, objeto e texto em faixas separadas e um gatilho só para cada passo.

| # | Falha (fonte) | Regra criada | Onde |
|---|---|---|---|
| 1 | O botão fixo do celular cobre títulos de passo (juízes 1 e 2) | O botão reserva ~96 px e vira pílula na seção fixa | `elementos.md` §8 |
| 2 | Rótulo atrás do objeto e numeral sobre o rótulo (juízes 1 e 2) | Rótulo sobre cena 3D nunca atrás do objeto nem sob texto | `elementos.md` §8 |
| 3 | Placeholder de foto (bloco escuro com brilho) não se lê; miniaturas cortadas (juízes 1 e 2) | Placeholder com a cara da imagem final (render da cena); miniaturas com o objeto inteiro | `elementos.md` §3 |
| 4 | Linha d'água de 1 px quase invisível, sem "uau" (juízes 1 e 2) | O gesto tem massa visual (véu, área, faixa) | `direcao-criativa.md` §2 |
| 5 | Metal escovado com textura esticada e faces chapadas (juiz 1) | Repetição da textura pela dimensão real e mapa de ambiente com fonte clara; quadros em 2× | `3d-leve.md` |
| 6 | "4 peças" com 5 na tela; a sequência não tem fim (juízes 1 e 2) | Contagens batem com a imagem e a sequência tem fim visível | `rubrica.md` §4 |
| 7 | Hero diferente do declarado (objeto entre as palavras, não na frente) (juiz 2) | Já coberto: conferir cada gesto nas telas do `juiz.mjs` | `direcao-criativa.md` §2 |
| 8 | `--cores` não trocava o `--accent-soft`, e o branco sobre sálvia dá 4,3:1 (agente) | `--cores` gera o acento suave e escolhe o texto do botão, avisando abaixo de 4,5 | `scripts/criar-projeto.mjs` |
| 9 | `criar-projeto.mjs` não aceitava `--ref3d` (agente) | `--ref3d` e `--3d` repassados ao brief | `scripts/criar-projeto.mjs` |
| 10 | `img, svg, video {display:block}` do starter anula o `hidden` (agente) | `[hidden] { display: none !important }` no starter | `starters/html/public/estilo.css` |
| 11 | Imagem `loading="lazy"` vazia na captura de página inteira (agente) | O verificador força o carregamento antes da captura | `scripts/verificar-site.mjs` |
| 12 | Regra 0 (IoU ≥ 95%) contra o caso sem usuário (agente) | Exceção escrita na Regra 0 | `3d-leve.md` |

## Pendências (para a sessão E e depois)
- Sem o acervo local, o bloco 2 (sites de referência) depende de pesquisa ao vivo, e o Awwwards recusou a conexão em 3 das 4 rodadas. O `opcoes.mjs` avisa e segue, mas o resultado é uma referência só.
- O juiz só vê o plano B (sem GPU). O `?gpu=1` é convenção do site, não do `juiz.mjs`.
- O mapa de fontes do `montar-brief.mjs` para `typography-luxury` continua Playfair + Inter + Jost (regra em `anti-cliches.md`, mas o mapa de fontes não mudou).
- O starter ainda anima tudo de baixo para cima, e a porta 3001 é fixa.
- Nenhuma rodada passou de 7,5. Para subir para 8, os juízes pedem sempre a mesma coisa: composição própria em cada seção irmã e um momento "uau" que apareça na foto.
