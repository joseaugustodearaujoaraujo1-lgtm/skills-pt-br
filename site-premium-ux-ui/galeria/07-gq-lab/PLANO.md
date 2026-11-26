# ACORDE Lab × The Extraordinary Lab: plano da réplica

**Marcas:** VÉRTICE (revista de estilo fictícia) × ACORDE (casa de perfumaria autoral brasileira). O objeto é o frasco AC-07, octogonal, de vidro com tampa de aço escovado.
**Narradores:** Luísa Prado, editora de perfumaria da VÉRTICE, e Tomás Reis, colecionador ACORDE (os dois são fictícios).
**Original:** experiência WebGL em tela cheia, sem rolagem nativa. A roda do mouse avança a câmera. O mapa por passos (1 passo = 600 px de roda) está em `replica/estudos/gq-lab-mapa.json`.
**Pilha:** three.js em tempo real, porque o original também é 3D em tempo real. Não há GSAP nem Lenis: a rolagem é virtual e escrita à mão.
**Famílias:** Inter Tight (200, 300, 500, 600) no lugar da GT America, e EB Garamond nas falas.

| Passos | Cena | O que aparece | Movimento e interação | Nosso conteúdo |
|---|---|---|---|---|
| — | Carregamento | as duas marcas com uma linha de progresso entre elas | a linha se preenche e a tela some | VÉRTICE × ACORDE |
| 0–1 | Abertura | título fino de 106 px em 3 linhas, linha de crédito, botão "ativar o som", fone | o clique em qualquer lugar liga o som e libera a rolagem | "O Laboratório Extraordinário" |
| 1–6 | Esboços | laboratório em linhas brancas: mesa, pedestal, bancadas, frascos torneados, folhas manuscritas | a câmera desce em arco até a mesa | geometria nossa em linhas |
| 6–7 | Esboço vira matéria | mesa branca, pedestal preto, papéis com o desenho técnico do frasco | as linhas se apagam enquanto a mesa aparece | papéis desenhados em canvas |
| 7–10 | Céu | céu nublado com horizonte laranja sobre chão escuro | a câmera sobe e recua | shader de céu próprio |
| 10–18,5 | Capítulo I | o frasco no pedestal, mesa, pipeta, silhuetas de arcos; título do capítulo; legendas; ponto "+" | órbita lenta; as palavras da fala acendem | "DNA ACORDE", "Tradição encontra invenção" |
| 18,5–30 | Capítulo II | sala escura com janela em arco para um céu claro, pedestal octogonal, frascos de essência, pinça | aproximações e órbitas; ponto "+" do atomizador | "Design e experiência", "Feito para a pele" |
| 30–42 | Capítulo III | sala escura com arcos de luz, horizonte azul, telas com o atomizador em raio X | a câmera entra na tela até ela encher o quadro | "Inovação", "O que não se vê" |
| 42–46 | Fecho | macro da tampa do frasco com luz de recorte | botão "Continue a jornada" | abre a transcrição |

**Interface fixa:** marcas no topo à esquerda, botão "Som" no topo à direita, dica "Role para avançar", "Pular a introdução", legenda (falante + fala), 3 capítulos sobre uma onda de áudio animada, e o capítulo atual no rodapé.
**Som:** o original tem narração gravada. Nós geramos um ambiente sonoro na hora (Web Audio), porque a narração gravada depende de vozes reais.
**Menos movimento e acessibilidade:** um quadro parado do frasco e a transcrição completa aberta. A transcrição também fica disponível pelo link "Pular para a transcrição" e pelo botão do fim. O teclado avança com as setas, PageDown e a barra de espaço.
**Celular:** a mesma experiência em tela cheia; o toque avança.
