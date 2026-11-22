# CAIS × Terminal Industries: diferenças medidas e status

O original foi medido com `estudar3.cjs` (passo de 450 px) e com leitura das caixas de texto pela DOM em 30 posições (`medir.cjs`). Também foi medido em 390×844. A nossa versão foi capturada nas mesmas posições.

**Altura total:** desktop 15 766 px nos dois; celular 17 237 px nos dois. Cada seção começa na mesma posição do original (diferença máxima de 1 px).

| Tela | Elemento | Original | Nosso (1º ciclo) | Gravidade | Status |
|---|---|---|---|---|---|
| 6 | Grade de logos | 2 linhas de 9 logos no alto da grade, com linhas finas atravessando a página | 2 linhas de 6, ocupando a altura toda | estrutura | corrigido |
| 14–19 | Mídia dos passos | vídeo escuro em linhas (gêmeo digital) | foto clara | acabamento | corrigido (foto escurecida + grade e vagas desenhadas por cima) |
| 24 | Título "feito pelo setor" | 3 linhas estreitas | 3 linhas largas | layout | corrigido (760 px) |
| 30 | Perguntas | título em y 14 004, todas fechadas, 1ª pergunta em y 14 084 | título 168 px abaixo, a 1ª aberta | layout | corrigido |
| — | Contraste | (o original usa cinza-claro e branco sobre cinza, abaixo do mínimo) | 39 textos abaixo do mínimo | acessibilidade | corrigido (cinzas mais escuros, pílula do topo escura) |
| celular | Alturas das seções | 2 532, 2 076, 2 209, 376, 1 385, 599, 903, 1 309, 456, 755, 844, 1 440, 1 101, 1 252 | 2 400, 1 144, 2 074… (total 17 087) | estrutura | corrigido (total 17 237) |

## Diferenças que ficam por escolha

- **Hero:** o original é uma sequência de quadros de um filme 3D (caminhão ao entardecer → pátio → gêmeo digital). Por enquanto usamos 3 fotos livres que se cruzam, mais o gêmeo digital desenhado em canvas. O filme está na lista de imagens para gerar (CAIS 1).
- **Fotos:** são provisórias, de licença livre (créditos em `public/creditos.json`).
- **Logos:** são marcas fictícias, escritas em texto com ícones nossos.
- **Paleta:** azul-petróleo e laranja no lugar do verde-petróleo e do verde-limão.

## Rodada final de comparação (medida pela DOM nas mesmas posições)

| Elemento | Original | Antes | Status |
|---|---|---|---|
| "Economia anual estimada" no painel | y 5 155 | y 5 142 | corrigido |
| Textos do slide ativo (rótulo, título, descrição) | y 10 067 / 10 091 / 10 229 | 134 px mais abaixo | corrigido |
| Texto do contato | y 13 218 | y 13 263 | corrigido |
| Copyright do rodapé | y 15 708 | y 15 693 | corrigido |

Conferidos dentro de 8 px: títulos das marcas, dos caminhos e do "por que", cartões, calculadora, perguntas e colunas do rodapé.
