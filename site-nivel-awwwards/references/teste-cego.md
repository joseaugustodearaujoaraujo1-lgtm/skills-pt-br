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

Notas por critério na rodada 1 (Design / Usabilidade / Criatividade / Conteúdo): juiz 1, 7 / 6,5 / 7 / 6; juiz 2, 7 / 6,5 / 7 / 7.

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
