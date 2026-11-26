// Roteiro da experiência: passos de rolagem (1 passo = 600 px de rolagem), capítulos, falas e pontos de exploração.
export const TOTAL = 46;

export const FALANTES = {
  L: 'Luísa Prado · editora de perfumaria da VÉRTICE',
  T: 'Tomás Reis · colecionador ACORDE',
};

export const CAPITULOS = [
  { nome: 'DNA ACORDE', titulo: 'Tradição encontra invenção', inicio: 10, fim: 18.5 },
  { nome: 'Design e experiência', titulo: 'Feito para a pele', inicio: 18.5, fim: 30 },
  { nome: 'Inovação', titulo: 'O que não se vê', inicio: 30, fim: 42 },
];

// [passo inicial, falante, texto]
export const FALAS = [
  [10.2, 'L', 'Vamos lá.'],
  [12, 'L', 'Ela não se contenta em seguir a tradição: quer resolver problemas para a perfumaria inteira.'],
  [13.4, 'T', 'O AC-07 é único.'],
  [14.2, 'T', 'Até o clique do atomizador parece um salto para a frente.'],
  [15.2, 'T', 'Ele resume a ACORDE por completo.'],
  [16.2, 'L', 'Ousa. Mostra até onde um frasco-conceito pode ir.'],
  [17.2, 'T', 'Olha para a frente, e não só para o que já foi feito.'],
  [19.8, 'L', 'É um perfume muito complexo, mas ao mesmo tempo é diferente de tudo.'],
  [21, 'L', 'Foi desenhado para ser uma extensão de quem usa.'],
  [22, 'L', 'Tomás, qual é a sensação de usar?'],
  [23, 'T', 'Quando peguei o frasco, achei que ia pesar.'],
  [24, 'T', 'Mas não.'],
  [25, 'T', 'Tem uma leveza e uma familiaridade difíceis de explicar.'],
  [26, 'T', 'Sem falar do toque do atomizador. Impressionante.'],
  [27, 'L', 'É uma pequena maravilha mecânica, sinceramente.'],
  [28, 'L', 'Pensaram de verdade na pessoa que vai usar esse perfume todo dia.'],
  [31, 'T', 'Tenho frascos lindos, mas que parecem um tijolo na mão.'],
  [32, 'T', 'Este? Às vezes você esquece que está com ele.'],
  [33, 'L', 'Dá para ver que foram cinco anos de pesquisa,'],
  [34, 'L', 'e mostra o tamanho do domínio técnico que cabe num único frasco.'],
  [35, 'L', 'Uma bomba de micro-névoa e uma câmara de maceração na mesma peça:'],
  [36, 'L', 'é simplesmente extraordinário.'],
  [37, 'T', 'É incrível terem colocado tanta técnica e tanta complicação em algo que parece'],
  [39, 'T', 'uma extensão de você.'],
  [40, 'T', 'e eu nunca tinha sentido nada parecido.'],
];

export const PONTOS = [
  { passo: [15.6, 17.4], rotulo: 'Detalhe 01', titulo: 'A tampa facetada', texto: 'Oito faces escovadas à mão, com quatro parafusos de aço aparentes. O mesmo octógono do frasco, cortado em latão maciço e banhado a ródio.' },
  { passo: [27.6, 29.4], rotulo: 'Detalhe 02', titulo: 'O atomizador', texto: 'Uma bomba de micro-névoa com 0,06 ml por toque, que solta a fragrância em nuvem fina e regular, sem gotejar na pele.' },
];
