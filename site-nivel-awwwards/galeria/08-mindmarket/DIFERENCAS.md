# ESCUTA × MindMarket: diferenças medidas e status

O original foi medido com `estudar3.cjs` em 1440×900 (48 telas com passo de 300 px) e em 390×844, com leitura das caixas de texto pela DOM em posições-chave (`medir.cjs`). A nossa versão foi capturada nas mesmas posições.

Altura total: original 13 732 px, nosso 13 732 px. As seções começam nas mesmas posições: 0, 900, 6 196, 7 398, 8 256, 10 722, 11 931 e 12 831.

| Tela | Elemento | Original | Nosso (1º ciclo) | Gravidade | Status |
|---|---|---|---|---|---|
| todas | Altura total | 13 732 | 13 681 (rodapé subia 50 px por cima da seção areia) | estrutura | corrigido |
| 0 | Título do hero | 2 linhas: "Real human / insights" | quebrava em "Escuta de gente / real" | tipo | corrigido (quebra fixa) |
| 0 | Botão do topo | "Get a quote" numa linha | "Pedir orçamento" quebrava em 2 linhas | layout | corrigido ("Orçamento") |
| 0–3 | Grupo de personagens | ocupa 737×527 e é cortado pela borda de baixo | menor, com sobra embaixo | layout | corrigido (escala 1,16) |
| 3 | Intro da linha do tempo | texto de 6 linhas, botão em y 1 280 | 5 linhas, botão em y 1 244 | layout | corrigido (y 1 284) |
| 6–15 | Cartões | textos de 6 e 7 linhas, botões em y +272 do título | 5 e 6 linhas | layout | corrigido (mesmo número de linhas) |
| 17 | Nuvem do fim | nuvem branca | retângulo branco (desenho quebrado) | acabamento | corrigido |
| 17–22 | Ciclistas | passam pelos morros e não cobrem o título da chamada | ficavam fixos por cima do título | movimento | corrigido (atravessam a tela com a rolagem) |
| 22 | Itens da chamada | y 7 206 | y 7 222 | layout | corrigido |
| 27–33 | Título dos números | 3 linhas | 4 linhas | tipo | corrigido (3 linhas) |
| 27–35 | Cartões dos números | entram 1:1, ficam quase parados e se empilham com 59 px de degrau | igual (pontos medidos) | movimento | ok |
| 36–38 | Título do artigo grande | 601 px de largura | 547 | layout | corrigido |
| 44 | Rodapé | texto em y 135, endereços em x 908, cidade 2 em y 619 | texto em 185, endereços em 996, cidade 2 em 627 | layout | corrigido |
| celular | Topo | marca + "Get a quote" + botão de menu na mesma barra | sem o botão de orçamento | estrutura | corrigido |
| celular | Rodapé | texto, links, endereços e, por último, "Let's Connect" | "Vamos conversar" antes dos endereços | estrutura | corrigido |

## Diferenças que ficam por escolha (conteúdo, não estrutura)

- **Paleta:** caju no lugar do verde, azul-piscina no lugar do amarelo, açaí no cartão coral.
- **Ilustrações:** o original usa personagens animados (Rive). Os nossos são vetoriais próprios e provisórios, com a mesma posição e a mesma escala, e vão ser trocados pelas ilustrações da lista (`IMAGENS-PARA-GERAR.md`, seção ESCUTA).
- **Fotos:** são provisórias, de licença livre (créditos em `public/creditos.json`). A foto do público e as dos artigos estão na lista de imagens para gerar.
- **Marcas do trilho:** nomes e ícones de empresas fictícias, no lugar das marcas reais.
