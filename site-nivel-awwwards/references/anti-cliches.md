# Anti-clichês: o que faz um site parecer "feito por IA" (e o que fazer no lugar)

Use como lista de verificação **antes de entregar** e como filtro ao propor direções. Cada item tem a alternativa.

| Clichê | Por que denuncia | Em vez disso |
|---|---|---|
| Gradiente roxo → azul no fundo e nos botões | É o padrão-padrão de geradores; não diz nada da marca | Um acento só, tirado do tema (`gerar-paleta.mjs`), em área pequena |
| Hero centralizado: título + subtítulo + 2 botões + 3 cards iguais | Estrutura de template | Hero assimétrico, título enorme alinhado a uma coluna, um único gesto de assinatura |
| Inter/Roboto em tudo, mesmo peso | Sem voz tipográfica | Par de fontes com personalidade (título expressivo + corpo neutro) e escala dramática |
| Cards idênticos com ícone, título e frase | Conteúdo "preenchido", não pensado | Itens com tamanhos diferentes (bento), lista editorial numerada ou galeria com hover |
| Cantos arredondados e sombra suave em tudo | Falta de decisão de forma | Um raio consistente por estilo (ou zero, no brutalismo) e sombra só onde há elevação real |
| Emojis e ícones de biblioteca no lugar de imagem | Visual genérico | Fotografia/ilustração própria, ou tipografia como imagem |
| Textos "Soluções inovadoras para o seu negócio" | Copy vazia | Frase concreta, específica, com ponto de vista; números reais |
| Animação em tudo (fade-up em cada bloco com o mesmo atraso) | Ruído sem hierarquia | 1 padrão de revelação + 1 efeito de assinatura; resto estático |
| Foto de banco com pessoas apertando as mãos | Falta de autenticidade | Fotos reais do cliente, tratamento de cor único, ou ilustração |
| Fundo branco + cinza + azul "corporativo" sem tom | Neutro sem intenção | Neutros tingidos na direção do tema (nunca #000/#fff puros) |
| Seção de "depoimentos" com 3 cards de 5 estrelas | Prova falsa/genérica | Prova específica: números, nomes, logos reais, prêmio, estudo de caso |
| Rodapé com 4 colunas de links e nada mais | Final sem marca | Rodapé como último "momento": marca gigante, chamada, detalhe animado |
| Tudo centralizado | Sem tensão visual | Alinhamento à esquerda com assimetria controlada, respiro grande |
| Glassmorphism/neon "porque está na moda" | Estilo sem conceito | Escolha de estilo justificada pelo tema (`escolher-estilo.mjs`) |
| Scroll "snap" na página toda | Quebra o controle do usuário | Snap só em carrosséis |

## Sinais de que passou do ponto
- **Playfair Display + Inter em site de luxo**: é o par mais visto do tema, e o juiz o chama de "muito visto" (teste cego, rodada 2). Prefira um serifado de display com mais caráter (Bodoni Moda, Fraunces com ajuste óptico, Gloock) e registre a troca em `design/DECISOES.md`.
- Mais de 2 famílias de fonte e mais de 1 acento de cor.
- Mais de 1 efeito "de impacto" visível ao mesmo tempo.
- Contraste de texto abaixo de AA; texto sobre imagem sem proteção.
- A página só funciona com JS/WebGL (sem plano B) ou pesa mais de ~3 MB na primeira dobra.
- Não dá para dizer, em uma frase, **qual é a ideia** do site.

## Teste final
Cubra a logo. Alguém reconhece de qual marca/tema é só pelo visual e pelo texto? Se o site serve para qualquer empresa do ramo, ainda está genérico.
