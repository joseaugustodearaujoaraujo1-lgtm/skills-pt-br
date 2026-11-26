# OLEA × Oryzo: diferenças medidas e status

Medição do original com `estudar3.cjs` (1440×900, 64 telas de 0 a 55 791 px, passo de cerca de 900 px), com leitura das caixas de texto em telas-chave e capturas da nossa versão nas **mesmas posições de rolagem** (`scrollY` registrado pelo estudo).
As alturas das seções estão em `replica/estudos/oryzo-mapa.json`.

Gravidade: **estrutura** · **layout** · **tipo** · **movimento** · **acabamento**. Corrigido na ordem de gravidade.

## Diagnóstico principal

As telas do fim estavam adiantadas, e algumas telas do meio ficavam vazias por um motivo estrutural.
No original, cada palco fixo entrega a tela ao seguinte **no mesmo lugar**: as camadas internas são fixas e uma cena troca pela outra. Na nossa versão, cada palco era `sticky` e, ao terminar, rolava para cima enquanto o próximo entrava por baixo. Isso gastava 900 px por seção e mostrava uma tela vazia (por exemplo, a tela 8, entre "Feito com IA" e "Tão portátil").
O "Escolha a sua" também tinha 1 800 px em vez de 2 918 px, com a tabela por cima do palco. Por isso, tudo depois dele saía cerca de uma tela antes.

Correção: os palcos agora são encadeados (cada seção sobe 100vh e o palco que terminou some). Os trechos fixos ficaram em 0–7 200, 7 200–19 125, 19 125–28 575, 28 575–35 775 e 35 775–40 866 px, e cada linha do tempo foi refeita com o progresso medido no original.

## Tabela

| Tela | Elemento | Original | Nosso (antes) | Gravidade | Status |
|---|---|---|---|---|---|
| todas | Altura total | 56 691 px | 55 662 px | estrutura | corrigido (56 691) |
| 57–60 | "Escolha a sua" | 2 918 px: palco fixo de 2 184 px e tabela de 734 px no fluxo | 1 800 px, com a tabela sobreposta ao palco | estrutura | corrigido |
| 60–61 | Artigo | 1 109 px | 1 194 px | estrutura | corrigido (1 109) |
| 8, 21, 40 | Troca de palco | troca no lugar, sem tela vazia | palco rolando para cima, com tela vazia | estrutura | corrigido (palcos encadeados) |
| 26–31 | Ordem das cenas em Recursos | bancada → térmica → vista de cima → croqui → letras | bancada → térmica → croqui → letras → vista de cima | estrutura | corrigido |
| 32 | Início da criptografia | mesa vista de cima | mesa flutuando | estrutura | corrigido (nova cena) |
| 39–41 | Casca que se abre | as metades se afastam e revelam "sustentabilidade" (já dentro da sustentabilidade) | a casca ficava na criptografia e sumia antes da palavra | estrutura | corrigido (casca no palco da sustentabilidade) |
| 45–46 | Cartões da sustentabilidade | 3 cartões com título, o 1º estreito (325 px), margens de 45 px e altura de 450 px | 3 colunas iguais de ponta a ponta, sem título | estrutura | corrigido |
| 47–48 | Avaliações | 5 avaliações | 4 | estrutura | corrigido (5ª avaliação; a foto entra na lista de imagens) |
| 0 | Abertura | pré-carregamento com anel vetorial que se preenche → mesa vista de cima, marca gigante no alto à esquerda, frase no topo, texto à direita, cartão de vidro, miniatura do vídeo | imagem desfocada com alças | estrutura | corrigido |
| todas | "Role para continuar" | indicador no rodapé da tela nos palcos fixos | não existia | estrutura | corrigido |
| 1–3 | Texto à direita do giro | 28,5 px com entrelinha de 36 px, palavras que acendem com a rolagem | 18 px, estático | tipo/movimento | corrigido |
| 1 | Sabonete do giro | cerca de 500 px de diâmetro, centro em y = 490 | 590 px | layout | corrigido |
| 2 | Giro do objeto | inclina e volta de frente | ficava de perfil | movimento | corrigido |
| 4–8 | "Feito com IA" | letras entram em sequência; o objeto diminui e cai na mão; a piada entra; as letras saem uma a uma; a mão fica até o fim | bloco inteiro de uma vez, tela 8 vazia | movimento | corrigido |
| 6–7 | Brilho de arco-íris | luz suave nas bordas da tela, só com o cursor sobre a mão | elipse saturada fixa o tempo todo | acabamento/interação | corrigido |
| 5 | "OLEA-1" sob o título | 24 px, alinhado ao fim de "IA" | 18 px, deslocado | tipo | corrigido |
| 9–13 | Tão portátil | moldura quadrada → embalagem + letreiro gigante → moldura retrato com o objeto no alto e brilho no texto → foto → rótulo de duas linhas | uma tela atrasado; letreiro curto ("é de bolso") | movimento/tipo | corrigido ("dá pra vestir", com o mesmo comprimento de "it's wearable") |
| 9–13 | Rótulo "Tão portátil," | 24 px, sobe de y 450 para 289 e depois para 240 | 18 px, fixo | tipo/layout | corrigido |
| 14–20 | Faixa de miniaturas | passa dos dois lados da moldura central e some na revista | só entrava pela direita, tarde | movimento | corrigido |
| 21–22 | Revista → bancada | a revista perde os textos, a foto dá zoom e a moldura se abre até a tela cheia já em Recursos | abria cedo (tela 21) | movimento | corrigido |
| 22–28 | Painel de vidro | 454 px de largura, ícone em y 130, título de 18 px em y 201, texto de 18/24 px em y 235, frase grande de 33,75 px em y 758 | 360 px, textos de 16 px | layout/tipo | corrigido |
| 24 | Câmera térmica | entra pela direita, com desfoque | entrava pela esquerda | movimento | corrigido |
| 30–31 | Letras gigantes | cheias e escuras, com alças vetoriais no "O"; depois diminuem | só contorno, sem alças | acabamento | corrigido |
| 33–38 | Criptografia e antiescorregão | rótulo de 18 px, título de 51 px, texto de 18/24 px; o close da borda passa de colorido para preto e branco | título de 45 px, texto de 15 px, sem a passagem para P&B | tipo/movimento | corrigido |
| 42–44 | Sustentabilidade | palavra com brilho no escuro, rótulo de 24 px, texto de 18/24 px, sombra de folhas só à direita | palavra chapada, rótulo de 12 px, sombra em tela cheia | tipo/acabamento | corrigido |
| 46–48 | Avaliações | o título rola; o objeto fica fixo e gira, passando para a direita e depois para o centro; citações de 22,5/27 px em 324 px; a avaliação ativa acesa e as outras apagadas | título fixo, citações de 18 px, todas acesas | layout/movimento/tipo | corrigido |
| 49–56 | Faixa do produto | 9 cartões, sobreposição de 117 px, 1 px de faixa por 1 px de rolagem | sobreposição de 150 px, cerca de 2% mais rápida | layout/movimento | corrigido |
| 57 | Objeto do "Escolha a sua" | desce de cima até o palco | aparecia já no lugar | movimento | corrigido |
| 58–59 | Escolha | rótulo de 24 px; título de 207 px que diminui; abas de 53 px que sobem de 512 para 304 px; descrição (24 e 18 px) e lista (18/45 px) | tudo em fluxo de grade, tamanhos menores | layout/tipo | corrigido |
| 59–60 | Tabela | nomes de 24 px, frases de 13,5 px a 50%, linhas de 68 px | linhas de 45 px | layout/tipo | corrigido |
| 62–63 | Rodapé | frases de 40,8/36,7 px em 700 px; botão em 442 px; caixa, newsletter e contatos nas posições medidas | frases de 41 px sobrepostas (3 linhas), posições erradas | layout/tipo | corrigido |
| 62 | Fundo do rodapé | faixa diagonal de grãos | azeitonas na tela toda | acabamento | corrigido (máscara em faixa) |

## O que ainda depende de imagem (lista em `galeria/IMAGENS-PARA-GERAR.md`)

- **OLEA 1**: a mão do "Feito com IA". O original usa uma mão em 3D em tempo real. Por enquanto, o sabonete 3D fica sobre uma foto escura provisória.
- **OLEA 2 a 8**: as fotos de estilo de vida da galeria do "Tão portátil" (no original são pessoas usando o objeto).
- **OLEA 9 a 12**: os cartões da faixa do produto.
- **OLEA 13 a 16 e 18**: as fotos das avaliações (a 18 é a da 5ª avaliação, nova).

## Diferenças que ficam por escolha (conteúdo, não estrutura)

- Paleta: preto-oliva e creme no lugar do marrom com laranja.
- Família: Instrument Sans no lugar de Halyard Display (paga). Os tamanhos e as entrelinhas seguem o original. Como as larguras das letras mudam um pouco, as posições dos textos ficaram dentro de 8 px, mas as larguras das linhas podem variar.
- O objeto 3D é renderizado offline em quadros, não em tempo real. O giro e as poses seguem o original.
