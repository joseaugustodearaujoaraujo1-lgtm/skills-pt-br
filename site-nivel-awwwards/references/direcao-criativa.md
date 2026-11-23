# Direção criativa (antes de qualquer código)

Réplica fiel ensina técnica; o que ganha prêmio é **uma ideia que só aquele site poderia ter**, executada em todas as seções. Esta etapa vem depois do brief e **antes de qualquer linha de código**. Ela termina num arquivo `design/DIRECAO.md`, que o usuário aprova e que o juiz (`references/juiz.md`) usa para conferir o site pronto.

**Regra:** seção sem gesto não está pronta. Se uma seção não tem gesto que derive da ideia, ela é refeita ou cortada, não "enfeitada".

## O que o `DIRECAO.md` tem (as quatro partes são obrigatórias)

```markdown
# Direção criativa: <Marca>

## Ideia central (uma frase)
<assunto> + <o que ele faz com o visitante>. Ex.: "A névoa da serra esconde e revela a pousada conforme você desce."

## Gestos por seção
| Seção | Gesto-assinatura | De onde vem na ideia | Como se vê numa tela parada |
|---|---|---|---|
| Hero | ... | ... | ... |
| ... | ... | ... | ... |

## A regra que o site nunca quebra
<uma regra visual ou de movimento, verificável>. Ex.: "Nada entra de baixo para cima: tudo assenta como névoa, de cima para baixo."

## O que o site NÃO faz
- <3 a 5 itens concretos, os clichês do tema e da técnica que ficam de fora>

## Momento "uau"
<a tela que o visitante vai lembrar amanhã, e por quê>
```

### 1. Ideia central (uma frase)
- **Fórmula:** a matéria, o ritual ou a medida do assunto + o que acontece com o visitante ao rolar. A ideia é um **verbo**, não um adjetivo: "a joia acende conforme você se aproxima" serve; "elegante e sofisticado" não é ideia.
- **Cinco testes** (a ideia passa em todos ou volta para o rascunho):
  1. Cabe em uma frase de até 20 palavras.
  2. **Troca de assunto:** se trocar a marca por outra de outro ramo e a frase continuar valendo, ela é genérica.
  3. Dá para desenhar o hero num guardanapo a partir dela.
  4. Gera um gesto diferente para cada seção (se só gera o hero, é efeito, não ideia).
  5. **Logo coberta:** sem a marca, quem olha as telas adivinha o assunto.

### 2. Gesto-assinatura por seção
- Um gesto é **uma decisão visual ou de movimento que deriva da ideia**: um recorte, uma transição, um objeto que atravessa, uma régua, uma textura, uma forma de revelar texto. Componentes de catálogo (fade-up, cartões que sobem, marquee genérico) **não são gesto** sozinhos; podem ser o veículo, se ganharem o motivo da ideia.
- Todos os gestos são **parentes**: mesma origem, variações diferentes. Um gesto por seção, não três.
- Cada gesto precisa **aparecer numa captura parada** (o juiz olha fotos). Descreva o quadro: "no meio da seção, o título está metade coberto pela névoa".
- **O estado-chave do gesto fica parado na tela** (teste cego, rodada 1): ele precisa durar pelo menos 25% da rolagem da seção, e o do hero já tem que aparecer entre 10% e 15% da rolagem da página (o `juiz.mjs` fotografa por volta de 14%). Antes de entregar, abra as telas do `juiz.mjs` e confira cada gesto do `DIRECAO.md`. Gesto declarado que não aparece nelas não conta e vira correção.
- **Revelação completa cedo:** máscara, círculo de luz ou recorte terminam até a peça entrar 30% na tela. Um poço ou quadro vazio numa tela parada é lido como bloco vazio (teste cego, rodada 2).
- **O gesto tem massa visual:** uma linha de 1 px ou um degradê leve não aparece numa tela parada. Dê área ao gesto (véu, preenchimento, faixa) para ele ser visto na foto (teste cego, rodada 3b: a linha d'água "quase invisível" tirou o "uau").
- **O gesto fala a língua do objeto:** um elemento derivado do 3D (anel de regulagem, peça destacada, cota) usa o mesmo render e material do objeto, nunca uma ilustração plana no meio do site (teste cego, rodada 3).
- **Seções irmãs não repetem o mesmo bloco** (camadas, passos, serviços, capítulos): cada uma muda pelo menos duas destas coisas: escala do título, coluna ou alinhamento, título cortado na borda, posição e tamanho da imagem. Três blocos iguais seguram o Design no 7.
- **O gesto-assinatura tem versão de celular** (faixa no topo, régua horizontal, rótulo fixo). Esconder o gesto no celular (`display: none`) tira o 8 de Criatividade e de Usabilidade.
- Use pelo menos um gesto do repertório técnico medido (`references/scroll-avancado.md`, `references/elementos.md`, `references/3d-leve.md`) e um que seja **do tema** (do banco abaixo).

### 3. A regra que o site nunca quebra
Uma regra só, verificável olhando as telas ou o código: direção do movimento, um único ângulo, uma única curva, uma cor que só aparece em um papel, uma grade que nada atravessa (ou que tudo atravessa). Ela dá coerência; quebrar a regra uma única vez, no momento "uau", é permitido se estiver escrito aqui.

### 4. O que o site NÃO faz
De 3 a 5 itens **concretos** do tema e da técnica (não "nada genérico"). **Confira a paleta e o estilo recomendados pelos scripts contra esta lista** (teste cego, rodada 2: para joalheria, o brief recomendou dourado sobre preto, que é o clichê do tema). Se caírem num clichê, use a alternativa e registre o motivo. Comece pelos clichês do tema no banco abaixo e pelos de `references/anti-cliches.md`. O juiz desconta quando um item proibido aparece.

## Como conduzir com o usuário
1. Proponha **duas ideias** do banco de conceitos (ou novas, do mesmo jeito), cada uma com a frase, o gesto do hero e o momento "uau". Pergunte com `AskUserQuestion` (com "Outro"), recomendando uma e dizendo por quê.
2. Com a ideia escolhida, preencha os gestos por seção, a regra e o "não faz", e mostre o `DIRECAO.md` para aprovação antes de construir.
3. Na construção, cada seção é feita com o gesto dela. No portão final, rode o juiz com `--direcao design/DIRECAO.md`.

## Identidade visual (depois do `DIRECAO.md` aprovado)
A identidade sai da ideia central, não de tendência. Feche, nesta ordem: logo e ativos-chave; elementos de assinatura (forma, tratamento de imagem, cursor, transição); tipografia ([base-design-completo/02-tipografia.md](base-design-completo/02-tipografia.md)); cor e modo escuro ([base-design-completo/03-cor-e-contraste.md](base-design-completo/03-cor-e-contraste.md)); e a fuga da "cara de IA" ([base-design-completo/08-cara-de-ia.md](base-design-completo/08-cara-de-ia.md), [anti-cliches.md](anti-cliches.md)). A skill `identidade-visual`, se instalada, fecha o `docs/IDENTIDADE.md`. Só depois disso o estilo fino.

---

## Banco de conceitos: o que o tema permite que ninguém fez

Para cada tema: a **matéria** do assunto (o que dá para transformar em forma e movimento), conceitos prontos para adaptar e os **clichês** que entram no "não faz". Os conceitos são pontos de partida: combine com o briefing real.

| Tema | Matéria do assunto | Conceitos (ideia → gesto do hero) | Clichês (o que NÃO fazer) |
|---|---|---|---|
| Pousada, hotel de natureza | névoa, altitude, luz do dia, silêncio, trilha | **Descer a serra:** a rolagem é a descida; a névoa (meio-tom ou desfoque) cobre e revela as seções. **Hora do dia:** cada seção é uma hora; a luz e a cor do fundo mudam de manhã à noite. **Pegada:** um caminho tracejado que liga as seções como trilha. | foto aérea com título centralizado, ícones de comodidades em grade, "experiência única" |
| Restaurante, café | fogo, tempo de preparo, mesa, fermentação, mão | **Tempo de forno:** um contador ou régua de minutos guia a rolagem (o prato "fica pronto" no fim). **Vista de cima da mesa:** composição de cima, os pratos entram como se fossem servidos. **Fermentação:** formas que crescem e respiram com a rolagem. | foto de prato em close com fundo preto, cardápio em PDF, garfo e faca como ícone |
| Joalheria | luz, facetas, lupa, peso, raridade | **Lupa:** o cursor ou um círculo amplia a peça e revela a lapidação. **Uma luz só:** o site é escuro e uma fonte de luz que se move acende cada peça. **Quilate como medida:** a escala tipográfica segue o peso das pedras. | fundo preto com dourado em tudo, partículas brilhando, fonte script de convite |
| Clínica, dermatologia, saúde | camadas da pele, luz, tempo de tratamento, precisão | **Camadas:** a rolagem atravessa as camadas (epiderme, derme), cada seção é uma profundidade, com cortes em recorte. **Antes e depois honesto:** um divisor que o visitante arrasta, com o tempo do tratamento como régua. **Luz clínica:** paleta que vai da luz dura à luz suave, com tipografia de bula bem desenhada. | modelo sorrindo de jaleco, azul hospitalar com cruz, ícones de coração e escudo, depoimentos com estrela |
| Imobiliário, condomínio | planta, terreno, sol ao longo do dia, escala humana | **Planta que vira casa:** a linha da planta se ergue em volume (3D leve ou recorte) ao rolar. **Trajetória do sol:** sombras que giram sobre a fachada conforme a rolagem. **Vizinhança em distâncias:** a régua de minutos a pé estrutura as seções. | carrossel de fotos de render, "alto padrão" em dourado, mapa do Google solto |
| Moda | tecido, caimento, molde, passarela, costura | **Molde de costura:** linhas tracejadas e marcações de corte organizam a grade; as fotos entram recortadas pelo molde. **Caimento:** o tecido (imagem) cai e assenta com física ao rolar. **Etiqueta:** a tipografia de etiqueta interna guia preço e composição. | grade de produtos com hover de zoom, modelo em fundo branco sem direção |
| Produto físico com 3D | engenharia, peças, uso, escala | **Vista explodida:** o objeto se desmonta ao rolar e cada peça abre uma seção. **Na mão:** a escala real (o objeto ao lado de uma mão, moeda ou régua) em todas as telas. **Giro de vitrine:** o objeto gira preso à rolagem e cada ângulo mostra um benefício. | objeto flutuando com glow azul, partículas, "next level" |
| SaaS, tecnologia | dado, fluxo, tempo poupado, interface | **O antes bagunçado vira ordem:** a rolagem organiza elementos espalhados numa interface limpa. **Linha do tempo de um dia de trabalho:** cada seção é uma hora que o produto economiza. **Interface como palco:** a própria interface, grande, é o cenário, com zoom em cada recurso. | gradiente roxo-azul, ilustração de pessoas 3D genéricas, mockup de notebook inclinado, logos de clientes em cinza |
| Arquitetura, escritório | corte, planta, material, luz, escala | **Corte de projeto:** cada seção é um corte (como desenho técnico) com cotas tipográficas. **Material bruto:** texturas de concreto, madeira e pedra como fundos que mudam por seção. **Escala 1:100:** a grade do site segue uma prancha técnica. | foto de prédio com título por cima, grade de projetos com hover, preto e branco sem ideia |
| Advocacia, consultoria | documento, prazo, argumento, peso | **Documento anotado:** o site é uma peça com notas na margem e grifos que aparecem ao rolar. **Prazo:** um calendário que corre com a rolagem mostra o caso andando. **Argumento em camadas:** cada seção é uma tese, com o contra-argumento riscado. | balança da justiça, martelo, biblioteca de fundo, azul-marinho com dourado |
| Educação, curso | progresso, caderno, erro e acerto, turma | **Caderno:** pauta, margem e correções à mão como sistema; a rolagem "preenche" o caderno. **Barra de progresso real:** o site inteiro é uma trilha com etapas, e o visitante vê onde está. | estudante sorrindo com notebook, chapéu de formatura, ícones de lâmpada |
| Evento, festival | contagem regressiva, palco, multidão, som | **Fila de entrada:** a rolagem é a chegada ao evento (portão, palco, multidão). **Ingresso como interface:** o ingresso é o componente central, picotado e carimbado ao rolar. **Volume:** a tipografia cresce como o som. | contagem regressiva genérica, fotos de multidão com luzes, gradiente neon em tudo |
| Alimento, bebida de marca | ingrediente, temperatura, embalagem, gesto de consumo | **Ingrediente atravessa a palavra:** o produto passa na frente da tipografia gigante (ex. da galeria: POLPA). **Temperatura:** a cor e a forma derretem ou condensam com a rolagem. **Embalagem como interface:** abas, picotes e selos viram menu e botões. | foto de produto com respingos, "sabor irresistível", ícones de folhinha |
| Portfólio criativo | processo, rascunho, ferramenta, assinatura | **Rascunho que vira peça:** cada projeto começa em esboço e termina finalizado ao rolar. **A ferramenta do autor:** o cursor é a ferramenta (pincel, régua, câmera). | grade de miniaturas com hover, "olá, eu sou", foto de perfil em círculo |
| Causa, ONG | número, pessoa, território, tempo | **Um número que cresce:** a rolagem acumula o impacto (árvores, refeições) visualmente. **Território:** o mapa é o fio condutor e cada seção é um ponto real. | mãos dadas, globo, foto triste com título "faça a diferença" |
| Indústria, logística | escala, fluxo, vaga, horário | **Pátio em grade:** a grade de vagas e rotas organiza o site (ex. da galeria: CAIS). **Fluxo contínuo:** uma linha de esteira atravessa todas as seções. | foto de caminhão com filtro azul, ícones de engrenagem |

---

## Exemplos bons e ruins

### Ideia central
| Ruim | Por quê | Bom |
|---|---|---|
| "Um site moderno e elegante para a pousada." | adjetivos; passa na troca de assunto | "A névoa da serra cobre e revela a pousada conforme você desce." |
| "Mostrar a qualidade dos nossos picolés." | é objetivo de negócio, não ideia | "O picolé atravessa cada momento do dia, e a palavra gigante é o momento." |
| "Tecnologia que transforma a sua clínica." | serve para qualquer software | "A pele em camadas: cada seção desce um nível, do tratamento ao resultado." |
| "Luxo e exclusividade em cada detalhe." | clichê do tema | "Uma luz só percorre o escuro e acende uma joia por vez." |

### Gesto por seção
| Ruim | Por quê | Bom |
|---|---|---|
| "Os textos aparecem com fade ao rolar." | catálogo; não vem da ideia | "Os títulos saem da névoa: meio-tom que vai de denso a limpo." |
| "Galeria em carrossel." | componente, não gesto | "As suítes passam como janelas de um trem subindo a serra (trilho horizontal com moldura de janela)." |
| "Seção de números com contador." | todo site tem | "Os números são cotas da planta, desenhados com linha de cota e seta." |
| "Rodapé com links." | sem gesto: a seção não está pronta | "O rodapé é o vale: a névoa se fecha de novo e só o contato fica nítido." |

### A regra que nunca quebra
| Ruim | Bom |
|---|---|
| "Manter a consistência." | "Toda imagem entra por um recorte vertical, nunca por fade." |
| "Usar a paleta da marca." | "O acento vermelho só aparece no que é clicável." |

### O que o site NÃO faz
| Ruim | Bom |
|---|---|
| "Nada genérico." | "Sem foto de modelo de jaleco; sem ícone de cruz; sem azul hospitalar; sem depoimento com estrelas." |
| "Evitar exageros." | "Sem partículas, sem brilho dourado, sem fonte script; um efeito por seção, no máximo." |

---

## Checklist de saída (antes de escrever código)
- [ ] A ideia passou nos cinco testes.
- [ ] Toda seção do brief tem um gesto, com "como se vê numa tela parada".
- [ ] Os gestos são parentes (mesma origem) e não há dois gestos na mesma seção.
- [ ] A regra é verificável e está escrita.
- [ ] O "não faz" tem de 3 a 5 itens concretos, incluindo os clichês do tema.
- [ ] O usuário aprovou o `DIRECAO.md`.
