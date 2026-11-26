# TURMALINA × Cartier WAW: diferenças medidas e status

O original foi medido com Playwright em 1440×900: 18 passos de roda, com captura e leitura dos textos dentro do shadow DOM. A página não rola (altura de 900 px); cada gesto da roda troca de sala. A nossa versão foi capturada com os mesmos gestos.

| Sala | Elemento | Original | Nosso (1º ciclo) | Gravidade | Status |
|---|---|---|---|---|---|
| todas | Pulseiras | curtas, curvando para trás | barras compridas e retas dominando o quadro | layout | corrigido |
| todas | Luz | bege quente, sombras suaves | branco estourado | acabamento | corrigido (exposição 0,82 e luz âmbar) |
| 0 | Letreiro | duas linhas em caixa alta, contornadas, dentro do quadro | cortado à direita, serifado | layout/tipo | corrigido |
| 1, 7, 8 | Enquadramento | coluna, fitas e árvore inteiras no quadro | câmera colada no objeto | layout | corrigido (câmeras recuadas) |
| — | Título principal | (o original não tem h1) | h1 invisível | acessibilidade | corrigido (a marca no topo é o h1) |
| — | Contraste | texto branco sobre bege | abaixo do mínimo | acessibilidade | corrigido (carregamento num bege mais escuro) |

## Diferenças que ficam por escolha

- **Peças:** os relógios da Cartier viram joias da TURMALINA, modeladas em three.js. O original usa modelos e texturas muito detalhados, feitos em programa de 3D. Os nossos são mais simples e ficam para a rodada final.
- **Família:** Jost no lugar da Brilliant Cut Pro.
- **Som:** o original tem trilha gravada; o nosso é um ambiente gerado na hora.
- **Textos de interface:** o original usa 9 e 11 px; nós usamos no mínimo 12 px.

## Rodada final de comparação

| Sala | Elemento | Original | Antes | Status |
|---|---|---|---|---|
| todas | Profundidade | névoa e luz suave da cor da sala | fundo chapado | corrigido (névoa por sala) |
| — | Carregamento | rápido, por tempo | lento em máquinas fracas | corrigido (progresso por tempo, 1,8 s) |
| 0 | Arcos do fundo | visíveis | sumiam | corrigido |

Fica para quando houver material próprio: as peças e as salas do original são modelos fotográficos detalhados; as nossas são geometria feita em código.

## Ciclo 3

| Sala | Elemento | Original | Antes | Status |
|---|---|---|---|---|
| 0 | Letreiro | letras serifadas brancas com contorno escuro e placas de luz atrás | letras finas e cinzentas | corrigido |
| 0 | Sala | pêssego quente | bege acinzentado | corrigido |
| celular | Enquadramento | o letreiro e as peças cabem na tela | letreiro cortado | corrigido (câmera recua em telas estreitas) |

## Medição da interface (textos lidos pela DOM, dentro do shadow DOM no original)

Título nas linhas y 651 e 704 com 48 px, "Descobrir" centrado em y 800 e "Som" ficaram iguais ao original (diferença de até 4 px). Corrigidos: "apresenta" em y 124 (estava em 90), "Rolar" em y 757 (estava em 745) e a segunda dica de rolagem no canto inferior direito, que faltava.
3D (só código three.js): as gemas ganharam dispersão de luz (o "fogo" de uma pedra lapidada) e menos absorção, para a turmalina aparecer.
