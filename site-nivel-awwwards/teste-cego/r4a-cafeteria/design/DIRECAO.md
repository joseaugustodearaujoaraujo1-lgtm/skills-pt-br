# Direção criativa: Café Serra

## Ideia central (uma frase)
A página é uma xícara que se enche: ao descer a serra, o nível do café sobe e cada seção é um gole, do grão ao pedido no WhatsApp.

Testes: 19 palavras; troca de assunto (pousada ou joalheria não "enchem"); dá para desenhar no guardanapo (xícara vista de cima); gera gesto por seção; sem a marca, o café aparece na cor, na xícara e na régua.

## Gestos por seção
| Seção | Composição | Gesto-assinatura | De onde vem na ideia | Como se vê numa tela parada |
|---|---|---|---|---|
| Hero | 2 colunas, título gigante à esquerda, xícara vista de cima grande, cortada na borda direita | O café dentro da xícara sobe (o disco escuro cresce até a borda) conforme a rolagem do hero | O nível sobe | Aos ~14% da rolagem a xícara tem café pela metade, crema clara e uma borda de louça visível |
| Manifesto | 1 coluna larga, texto enorme alinhado à esquerda, sem imagem | As palavras "pegam cor": passam de creme a café, como papel absorvendo | O café tinge | Metade do parágrafo escura, metade clara |
| Na bancada (cafés) | Trilho horizontal fixado, cartões de alturas diferentes, imagem pequena | Cada cartão tem uma "linha d'água": faixa de café com altura diferente (intensidade do café) | Nível = intensidade | Quatro faixas de alturas distintas visíveis |
| MOMENTO-ASSINATURA: Devagar | Tela cheia, título único gigante, cortado pelo nível | Um fundo de café torrado sobe de baixo até cobrir toda a tela; a palavra "devagar." é cortada pela linha do nível | O nível chega ao topo: a xícara está cheia | Quadro parado: metade da tela café escuro, metade creme, palavra enorme partida ao meio pela linha |
| Como encomendar | 3 linhas editoriais, número gigante à esquerda, texto à direita, assimetria | Os números 1, 2, 3 são goles: cada um com um círculo de café que preenche ao entrar | Um gole por passo | Três círculos em preenchimentos diferentes |
| Contato / WhatsApp | 2 colunas, título à direita, botão grande | Fundo do rodapé = café cheio; o nível parou, só o botão verde-claro/creme brilha | Xícara cheia | Fundo escuro quente, botão claro, marca gigante embaixo |

Todos os gestos são parentes: um líquido com nível visível. Um gesto por seção.

## A regra que o site nunca quebra
O nível só sobe: nada entra por cima nem desce; tudo entra de baixo para cima (data-entrada="sobe"), como líquido. A cor só escurece ao descer a página (creme, caramelo, café), nunca clareia.
Exceção permitida: a palavra "devagar." no momento-assinatura é cortada por uma linha horizontal.

## O que o site NÃO faz
- Sem fundo preto nem azul-tecnologia: o mais escuro é café torrado `#3a2216`.
- Sem grão de café como ícone, xícara fumegando em clipart nem foto de latte art com fundo escuro.
- Sem cardápio em grade de cards iguais com ícone; sem "experiência única", "o melhor café da serra".
- Sem estética de rede (verde-sereia, copo com logo, balcão de aço); sem depoimentos de estrelas.
- Sem partículas, sem glassmorphism, sem gradiente roxo.

## Momento-assinatura ("uau")
O quadro em que o café sobe e a palavra "devagar." fica partida pela linha do nível: metade creme, metade café torrado, tipografia a ~22vw.
- Onde: seção "Devagar" (3ª tela após o hero e o manifesto) · em ~38-48% da rolagem da página · dura 60% da rolagem da seção (o nível sobe nos primeiros 40% e fica cheio em seguida)
- O que a foto mostra: tela dividida na horizontal, em cima creme com o topo da palavra, embaixo café escuro com o resto da palavra em creme, uma linha fina de crema na divisa.

## Identidade visual
- Tipografia: título serifado de display com caráter (Fraunces, ajuste óptico) e corpo em sans humanista (DM Sans); detalhe em mono pequena para a régua de altitude. Sem Playfair+Inter.
- Cor: creme quente, caramelo, terracota como acento (só no que é clicável e em destaques de uma palavra), café torrado para contraste.
- Forma: raio grande só na xícara e botões em pílula; cartões com cantos retos e uma linha d'água.
- Textura: grão de papel (ruído em CSS) leve.
- Régua de altitude fixa (desktop: lateral; celular: faixa no topo) que acompanha o nível: "1.628 m" no pé e a barra enche com a rolagem. Versão de celular: faixa fina de 6 px no topo.
