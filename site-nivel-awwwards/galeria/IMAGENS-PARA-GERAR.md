# Imagens e vídeos para gerar

Você gera os arquivos e manda aqui na conversa. Eu converto para WebP, recorto na proporção do original e coloco cada um no lugar certo.

As imagens que estão nos sites hoje são provisórias: fotos de licença livre e renders 3D nossos. Cada linha diz qual arquivo vai ser trocado.

Estilo que vale para todos os prompts: **foto ultra-realista, luz cinematográfica, sem texto e sem logotipo na imagem** (o texto entra pelo site).

---

## 05 · BRUMA ALTA (réplica da Son Daven), pousada na Serra da Mantiqueira

| # | Arquivo (substitui) | Formato | Prompt |
|---|---|---|---|
| 1 | **Vídeo do hero** → `img/voo/` (eu extraio os quadros) | vídeo 16:9, 5 a 10 s | Voo lento de drone no fim da tarde em volta de um hotel de design em madeira escura com ripas verticais e base de pedra com arcos, blocos escalonados com terraços-jardim, janelas acesas em âmbar e piscina iluminada, cercado de araucárias e mata numa encosta da Serra da Mantiqueira. Serras azuladas em camadas, névoa nos vales e sol baixo dourado à direita. A câmera sobe e faz um arco da vista frontal até uma vista aérea alta de três quartos. Sem pessoas. |
| 2 | `img/hero.webp` (pôster do vídeo) | 16:9, mínimo de 1920 px | Primeiro quadro da mesma cena: vista frontal do hotel no fim da tarde, com céu livre no alto para o título. |
| 3 | `img/lugar.webp` | 2:1 | Vista do alto do mesmo hotel: terraços com plantas, araucárias em volta e névoa no vale. |
| 4 | `img/linha.webp` | 1408×868 | Detalhe da fachada pronta: passarela de madeira entre dois blocos, arcos de pedra e jardim. |
| 5 | `img/alto.webp` | 4:5 (1440×1800) | Araucárias altas em primeiro plano, com um canto do hotel entre as árvores, luz suave. |
| 6 a 10 | `img/galeria-1..5.webp` | 1408×868 | Interiores do hotel: (1) sala de estar com lareira e madeira, (2) suíte com janela panorâmica para a névoa, (3) spa de pedra e madeira, (4) restaurante com mesa comprida, (5) deck ao amanhecer. |
| 11 a 18 | `img/cartao-1..8.webp` | 3:4 | (1) spa de ervas, (2) café da manhã da roça, (3) fondue numa adega de pedra, (4) cavalgada ao nascer do sol, (5) biblioteca com lareira, (6) banho de cachoeira, (7) fogueira à noite, (8) jardim de hortênsias. |
| 19 a 22 | `img/suite-1..4.webp` | 567×792 (em pé) | Fotos das suítes: cama com roupa de linho natural, banheiro de pedra, terraço e sauna privativa de madeira. |

## 06 · OLEA (réplica do Oryzo), sabonete de azeite

O sabonete 3D já é nosso (`src/sabonete.js`) e continua. Faltam só as fotos com pessoas e cenários.

| # | Arquivo (substitui) | Formato | Prompt |
|---|---|---|---|
| 1 | `img/vida-1.webp` (a mão do "Feito com IA") | 3:4 | Close de uma mão vindo de baixo segurando um sabonete artesanal redondo cor de marfim-oliva (com borda alta e o centro carimbado), sobre fundo quase preto, luz lateral dramática. A mão tem seis dedos, que é a piada de IA do original. |
| 2 a 8 | `img/vida-2..8.webp` | 3:4 | Estilo de vida com o sabonete redondo: (2) mulher em pose de yoga com o sabonete equilibrado no ombro, (3) homem de boné com o sabonete no ombro, (4) o sabonete sobre fundo vermelho com meio rosto de perfil, (5) rosto sorrindo mordendo o sabonete como um biscoito, (6) o sabonete no bolso de um suéter vermelho, (7) sabonete amarrado com fita como um colar, (8) sabonete na borda de uma banheira. |
| 9 | `img/galeria-noite.webp` | 16:9 | Barraca à noite sob a Via Láctea, com o sabonete redondo numa mesa de camping. |
| 10 | `img/galeria-chuveiro.webp` | cerca de 2:1 | O sabonete redondo em cima de um chuveiro elétrico cromado, fundo laranja (paródia do "roda na RTX"). |
| 11 | `img/galeria-queda.webp` | cerca de 2:1 | O sabonete redondo batendo num piso de concreto em câmera lenta, levantando poeira, fundo verde-oliva escuro. |
| 12 | `img/galeria-legado.webp` | cerca de 2:1 | Objetos antigos (vaso grego, taça romana, vaso egípcio de alabastro), cada um apoiado num sabonete redondo, fundo laranja, estilo museu. |
| 13 a 16 | `img/review-1..4.webp` | 4:3 | Fotos das avaliações: (1) astronauta com o sabonete, (2) pirata das antigas segurando o sabonete, (3) influenciadora com o sabonete no rosto, (4) minimalista com o sabonete sobre os olhos. |
| 17 | (opcional) vídeo da intro | 16:9, 5 s | O sabonete redondo sobre uma base de corte verde, com a câmera se aproximando devagar e fundo desfocado. |
| 18 | `img/review-5.webp` (5ª avaliação, nova) | 4:3 | Mulher cética olhando de lado para o sabonete redondo equilibrado na borda de uma pia de pedra, como se ele fosse cair, luz de banheiro suave. |

## 08 · ESCUTA (réplica do MindMarket), agência de pesquisa qualitativa

As ilustrações seguem o mesmo estilo: **vetorial chapado, cores vivas (caju, açaí, rosa, azul, amarelo, lilás), personagens alegres de proporções exageradas, fundo transparente (PNG ou SVG), sem texto**.

| # | Arquivo (substitui) | Formato | Prompt |
|---|---|---|---|
| 1 | `img/ilustra/grupo.svg` | 737×527, transparente | Quatro amigos de etnias diferentes avançando juntos e animados, inclinados para a frente, a da frente apontando para o horizonte, confetes no ar. Ilustração vetorial chapada. |
| 2 | `img/ilustra/corredora.svg` | 420×600, transparente | Mulher correndo de braços abertos, cabelo ruivo, roupa azul e calça lilás, papéis voando em volta. |
| 3 | `img/ilustra/musico.svg` | 560×680, transparente | Homem negro tocando trompete com alegria, roupa amarela, notas musicais saindo do instrumento. |
| 4 | `img/ilustra/gamer.svg` | 480×600, transparente | Jovem de boné jogando videogame com um controle azul, concentrado e sorrindo. |
| 5 | `img/ilustra/jogador.svg` | 620×640, transparente | Pessoa chutando uma bola de futebol em pleno salto, camiseta laranja e calça rosa. |
| 6 | `img/ilustra/ciclistas.svg` | 806×640, transparente | Três amigos numa bicicleta e correndo ao lado, comemorando, para atravessar uma colina com flores. |
| 7 | `img/publico.webp` | 2016×1200 (cerca de 5:3) | Pai e filha lendo um livro juntos no sofá, luz natural suave de sala, cores quentes, a criança sorrindo e apontando para a página. |
| 8 | `img/artigo-1.webp` | 902×1295 (em pé) | Mulher lendo um relatório impresso numa mesa de madeira, luz de janela, tons neutros. |
| 9 | `img/artigo-2.webp` | 1202×1030 | Duas mulheres latino-americanas conversando numa mesa de cozinha, uma entrevistando a outra, com caderno e frutas na mesa. |
| 10 | `img/artigo-3.webp` | 582×498 | Grupo focal de cinco pessoas sentadas em roda numa sala clara, uma moderadora com prancheta. |
| 11 | `img/artigo-4.webp` | 582×498 | Pesquisadora fazendo uma entrevista por vídeo no notebook, mesa organizada, luz suave. |

## 09 · CAIS (réplica do Terminal Industries), tecnologia para pátios de carga

| # | Arquivo (substitui) | Formato | Prompt |
|---|---|---|---|
| 1 | **Filme do hero** → `img/hero/` (eu extraio os quadros) | vídeo 16:9, 8 a 12 s | Plano contínuo: um caminhão-baú branco atravessa a tela ao entardecer, em silhueta contra um céu laranja; a câmera sobe e revela um pátio de carretas visto do alto ao anoitecer, com luzes acesas; no fim o pátio vira um "gêmeo digital" escuro, com linhas finas azuladas desenhando as vagas e as carretas. Sem texto. |
| 2 | `img/card-1..3.webp` | 668×416 | (1) portão de um centro de distribuição com caminhão parado, (2) um pátio de carretas visto do alto, (3) uma rede de armazéns vista de avião. |
| 3 | `img/passo-1..4.webp` | 1000×1194 (em pé) | Vistas aéreas escuras, quase noturnas, de um pátio de carretas: (1) portão, (2) fila de carretas, (3) docas, (4) estacionamento de cavalos mecânicos. Tons frios. |
| 4 | `img/slide-1..4.webp` | 1400×1140 e 1000×1250 | (1) cabine de portão com leitura automática, (2) pátio à noite com holofotes, (3) fileira de docas com carretas encostadas, (4) torre de controle com telas. |
| 5 | `img/citacao.webp` | 16:9 | Caminhão subindo uma estrada com neve no meio de um pinheiral, ao amanhecer, faróis acesos. |

## Teste cego (sessão D): sites feitos por um agente limpo só com a skill

Ficam em `teste-cego/`, fora da galeria. Hoje usam placeholders desenhados por script.

### R1 · ESTRATO, clínica de dermatologia em São Paulo (`teste-cego/r1-dermatologia/`)

| # | Arquivo (substitui) | Formato | Prompt |
|---|---|---|---|
| 1 | `public/img/hero-corte-pele.webp` (o site divide em 3 fatias, cortes em 30% e 70% da altura) | 4:5, 1440×1800 | Corte transversal macro da pele humana, como uma lâmina de histologia fotografada de lado, preenchendo todo o quadro na vertical. Faixa de cima (30% da altura): epiderme rosada-clara, com a linha ondulada da junção com a derme. Faixa do meio (40%): derme rosa mais profunda, com fibras finas de colágeno e pequenos vasos. Faixa de baixo (30%): hipoderme, com células de gordura arredondadas cor de areia. Luz de estúdio difusa, cores quentes e dessaturadas, textura nítida, sem fundo e sem rótulos. |
| 2 | `public/img/consulta-dermatoscopia.webp` | 14:9, 2100×1350 | Imagem dermatoscópica real de uma pinta benigna em pele clara-média, vista de cima pela lente do dermatoscópio, com rede pigmentar marrom simétrica no centro-direita do quadro e a textura fina da pele em volta. Luz polarizada uniforme, tons rosados e quentes, foco nítido no quadro todo, sem borda da lente, régua ou texto. |

---

**Como mandar:** anexe os arquivos aqui com o número da tabela (por exemplo, "OLEA 1" ou "BRUMA 1"). Basta cada arquivo vir com o número; eu cuido do resto.
