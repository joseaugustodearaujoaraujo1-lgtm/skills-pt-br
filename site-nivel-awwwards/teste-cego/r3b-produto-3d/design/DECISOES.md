# Decisões (sem usuário para responder)

Regra da skill (SKILL.md, topo): sem usuário, em cada pergunta ou aprovação escolhe-se a opção recomendada pela skill e registra-se aqui a escolha e o motivo. Tudo o que é especificação do produto é **de conceito, a confirmar com o cliente**.

| Etapa | Pergunta | Escolha | Motivo |
|---|---|---|---|
| 0 | Modo de trabalho | **A · do zero** | Não há site anterior. |
| — | "Posso começar?" | Sim (recomendado) | Pedido explícito de construir; escopo limitado à pasta `teste-cego/r3b-produto-3d/`. |
| 1.1 | O que é | **Fervo 3**, cafeteira de pressão (tipo moka) em aço inox, 12 faces, 3 xícaras. Marca e produto de conceito. | O briefing diz só "produto físico apresentado com 3D". Escolhi um objeto que tem **peças reais que se separam** (caldeira, funil, filtro e junta, coletor, tampa): o conceito "vista explodida" do banco de conceitos (produto físico com 3D, recomendado) precisa disso. |
| 1.1 | Objetivo e ação principal | Entrar na **lista da primeira fornada** (e-mail). | Produto de conceito ainda sem venda: não se inventa preço nem estoque. |
| 1.1 | Público e aparelho | Quem passa café em casa todo dia, 25–50 anos; celular primeiro. | Padrão de e-commerce de utensílio. |
| 1.1 | Páginas | Uma página: hero + 2 seções (pedido do teste). | Pedido. |
| 1.2 | Material existente | Nenhum (sem logo, foto ou 3D do cliente). | Teste cego. Fotos de referência abertas do tipo de objeto (Wikimedia Commons, CC BY-SA) só como estudo de forma. |
| 1.2 | Provas | Nenhuma avaliação, venda, prêmio ou cliente é citado. Medidas, materiais e capacidade são **especificação do projeto, a confirmar**. | `perguntas.md` 1.2. |
| 1.2 | Adjetivos / evitar | **preciso, tátil, honesto** / evitar "gourmet", vapor de banco de imagem, brilho tech. | Combina com "preciso, técnico, moderno" das opções prontas, ajustado ao objeto de cozinha. |
| 1.2 | Stack | **HTML + CSS + JS + GSAP** (recomendada) + three.js só no 3D. | Mais leve para landing. |
| 2 | Site de referência | **Tenztan** (https://www.tenztan.in/), pesquisa ao vivo. | Acervo local ausente (`opcoes.mjs` avisou). Awwwards bloqueou o acesso (conexão recusada). Tenztan é a referência que o `opcoes.mjs` recomenda para pin+scrub com 3D; capturado em 6 pontos (1440 px, 27 telas). O que se pega: cena fixa longa que "dura" várias telas, fundo marfim, rótulos mono finos em lista técnica, marca gigante no fim. Não se copia: textos, imagens, fontes, código. |
| 3 | Estilo | **Minimalism** (recomendado, 7 pts) | Ranking do `opcoes.mjs`/`escolher-estilo.mjs`. Conferido contra o "não faz": não cai em clichê de produto 3D (glow azul, neon). |
| 3 | Paleta | **Origem do Minimalism**: fundo `#F4EFE8`, superfície `#FBF8F3`, texto `#1F2A22`, acento sálvia `#6B7F6E`; texto do acento escurecido `#4E6152` para 4,5:1 em texto pequeno. | Recomendada pelo `opcoes.mjs`. `--accent-soft` gerado (`#fee0d9`, rosado) trocado por névoa `#D9E1D9` do guia Minimalism, para não haver segundo acento. |
| 3 | Tipografia | Instrument Serif (título) + Inter (corpo) + DM Mono (cotas e rótulos) | Do brief (estilo Minimalism). Mono vira a "língua de desenho técnico" das cotas. |
| 3 | 3D: referências | "Procure você" (sem usuário): 4 fotos abertas em `referencias-3d/cafeteira/`. | `aprovacoes.md`, seção "Sem usuário". |
| 3 | 3D: elemento | A própria cafeteira, geometria em código (three.js), PBR inox escovado + baquelite. | `sugestao3d` do `opcoes.mjs` (o produto em destaque) e Regra −1. |
| 3b | Molde | Sem gerador de imagem autorizado (custo/conta): o molde é o próprio modelo renderizado em 4 vistas (`referencias-3d/cafeteira/molde-4-vistas.png`), conferido contra as fotos. **Aprovado** (recomendado). O molde ultrarrealista gerado por IA fica em `IMAGENS.md`. | `aprovacoes.md`, "Sem usuário", passo 2. |
| 3b | Vídeo-prévia | Protótipo gravado (Playwright → MP4 H.264) em `design/previa/previa-site.mp4`. **Aprovado** (recomendado). | `aprovacoes.md`, seção 3, opção 1. |
| 3 | Scroll | **Pin + scrub** (recomendado com objeto 3D): a cafeteira fica fixa e a rolagem a desmonta na vertical; texto de cada peça troca pelo mesmo índice. | `scroll-avancado.md`. |
| 3c | Ideia central | **"A água sobe"** (recomendada) contra "Na mão / tamanho real". | Ver `DIRECAO.md`. A segunda ideia entra como gesto da seção 2 (cotas em tamanho real). |
| 5 | Plano B do 3D | Sequência de 48 quadros renderizados da própria cena (módulo `01-giro-3d-quadros`, adaptado), trocados pela rolagem. WebGL ao vivo só com GPU real (ou `?gpu=1`). | `3d-leve.md`: verificador e juiz rodam sem GPU e julgam o plano B. |

## Especificação de conceito (a confirmar com o cliente)
- Capacidade: 3 xícaras de 50 ml (150 ml de água até a válvula); 15 g de café moído médio-fino.
- Corpo: aço inox 18/10, 12 faces, acabamento escovado; fundo encapsulado em inox 430 (compatível com indução).
- Alça e pegador: baquelite preta. Junta: silicone alimentar. Filtro: placa de inox perfurada.
- Altura montada ≈ 17,5 cm (com pegador); 14,7 cm da alça ao bico; corpo ≈ 10 cm entre arestas; peso ≈ 720 g.
- Pressão de trabalho típica de cafeteira moka: perto de 1,5 bar (física do tipo de produto, não medição do Fervo).

## Outras decisões durante a construção
- Botão principal em verde quase preto `#1F2A22` (texto marfim) e não em sálvia: branco sobre `#6B7F6E` dá 4,3:1 (abaixo de 4,5). A sálvia ficou só para a água (linha d'água, ponto do menu ativo, foco).
- Vistas extras (frente, 3/4, topo) na ficha: renders da mesma cena; resolvem o aviso "poucas imagens" do verificador sem foto inventada.
- Formulário sem servidor: confirma na tela e diz que é protótipo (nenhum dado enviado).
- `juiz.mjs` não rodou: o modo automático do ambiente bloqueou o comando. Os gestos do `DIRECAO.md` foram conferidos nas minhas capturas em 0, 14, 30, 45, 60, 75, 88 e 100% da página (1440 e 390 px).
