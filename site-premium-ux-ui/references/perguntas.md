# Perguntas da skill: três blocos, nesta ordem

Use a ferramenta de perguntas do ambiente (no Claude Code, `AskUserQuestion`: até 4 perguntas por vez, 2–4 opções cada; o usuário sempre pode escolher "Outro" e **digitar**). Pergunte só o que ainda não foi respondido. **Não mostre sites, estilos nem paletas antes do bloco 1 terminar**: as opções só fazem sentido depois de conhecer o sistema.

## Bloco 1 — Conhecer e entender o sistema (duas rodadas curtas)
Objetivo: saber o que é, para quem e o que precisa existir, para escolher referências e design certos.

**Rodada 1.1**
1. **O que é e qual o assunto?** (tipo de negócio ou projeto, nome, cidade ou público local). Texto livre; ofereça exemplos como opções.
2. **Qual o objetivo e a ação principal do visitante?** (vender, agendar, pedir orçamento, ver portfólio, cadastrar na lista de espera).
3. **Quem é o público e em que aparelho acessa?** (idade, interesse; celular ou computador).
4. **Que páginas ou seções e funcionalidades precisa?** (uma página só ou várias; formulário, loja, agendamento, login, blog, galeria).

**Rodada 1.2**
5. **Que material já existe?** (logo, fotos, vídeos, textos, objeto 3D). Isso decide imagens reais x geradas e se haverá 3D. Peça junto as **provas concretas**: nome e registro do responsável, endereço ou bairro, horário, preço ou prazo, números reais. Em saúde, o nome do responsável técnico com CRM e RQE e o endereço são obrigatórios (CFM) e são a prova que o juiz cobra em Conteúdo (teste cego, rodada 1). Sem esses dados, não invente: planeje o lugar da prova no layout e liste o que falta no relatório. Produto de conceito (ainda não existe): medidas, materiais e peças são **especificação do projeto**, podem aparecer no site e ficam em `design/DECISOES.md` como "a confirmar com o cliente". Avaliações, vendas, prêmios e clientes nunca são inventados (teste cego, rodada 3).
6. **Personalidade em 3 adjetivos e o que NÃO quer parecer.** Ofereça combinações prontas (ex.: "elegante, raro, silencioso"; "ousado, jovem, irreverente"; "acolhedor, artesanal, natural"; "preciso, técnico, moderno").
7. **Qual stack?** Só duas opções: **HTML + CSS + JS + GSAP** (recomendada: mais leve, ideal para landing e portfólio) ou **Next.js + GSAP** (rotas, CMS, componentes React do reactbits.dev). "Outro" para texto livre.

Com as respostas, rode: `node ~/.claude/skills/site-premium-ux-ui/scripts/opcoes.mjs --tema "<assunto>" --adjetivos "a,b,c" --recursos "..." [--tipo vitrine|portfólio|saas|institucional|editorial|evento] [--evitar "x"]`.

## Bloco 2 — Qual destes sites você mais gosta? (depois de entender o sistema)
Regras da sugestão:
- **Base inteira:** o script considera **todos os sites válidos** da base (hoje ~884 únicos; 1.819 coletados no total, o resto é erro, bloqueio ou site fora do ar), não só os mais pontuados.
- **O layout precisa encaixar no tema e no assunto:** cada site é comparado com o perfil de layout do tipo de página (vitrine de produto, portfólio, produto digital, institucional, editorial, evento): número de seções, quantidade de texto, imagens, tipo de hero e rolagem. Um site de café recebe referências de vitrine, não de painel de SaaS. Cada opção mostra **"por que encaixa"** (assunto + layout).
- Mostre **4 opções** e "Outro": **A, B, C** (variados) e **E recomendada** (primeira, "(Recomendado)", com justificativa em duas frases). **Outro** = o usuário digita um site, estilo ou ideia; rode `opcoes.mjs --sugestao "..."` e a busca ao vivo.
- **Links clicáveis:** escreva cada site como `[Nome](https://url)` **na mensagem**, antes da pergunta, e repita a URL na descrição de cada opção. Antes de mostrar, **abra as capturas** (`desktop.jpg`, `mobile.jpg`) e troque as que estiverem no preloader ou fracas. "Mostre outros" → `--excluir <slugs já mostrados>`.
- Sites sem layout medido aparecem marcados ("layout ainda não medido"): confira a captura com mais cuidado.

## Bloco 3 — Montagem do design (eu **sempre recomendo**; o usuário aceita, escolhe outra ou digita)
Em toda pergunta deste bloco a **primeira opção é "(Recomendado)"**, com o motivo em uma frase, ligada às respostas dos blocos 1 e 2.

**Estilo.** Base: os 10 estilos de `references/base-estilos/` (antiga skill estilos-paletas-design). Mostre 3 estilos do ranking com a **paleta de origem** de cada um (fundo, acento, texto, fonte). Opções: **estilo recomendado** · outros 2 estilos · **"você escolhe por mim"** · **Outro** (digitar; misturas só pela matriz de compatibilidade de `base-estilos/_SKILL-original.md`). Leia só o guia do estilo escolhido.

**Paleta.** Base: a paleta de origem do estilo escolhido e as geradas para o tema (3 escuras e 3 claras, contraste AA/AAA conferido). Opções: **paleta recomendada** (a do estilo ajustada ao tema) · alternativas (Assinatura, Contida, Ousada) no tom escolhido · **Outro** (o usuário escreve hex ou descreve, ex. "verde-musgo com creme"; rode `gerar-paleta.mjs --acento <graus>` e confira o contraste). Mostre **amostras visuais**, não só hex. Pergunte o tom (escuro, claro ou ambos) se não estiver claro.

**3D (se houver).** Primeiro **peça imagens de referência do elemento** (fotos, links ou prints, de preferência em vários ângulos). Opções: **"Vou enviar as imagens"** (recomendado sempre que o objeto existe) · **"É um elemento inventado"** (personagem ou objeto de história, sem imagem na internet: peça descrição, esboço ou referências de estilo) · **"Procure você"** (pesquise referências abertas e mostre antes de usar). Depois siga o pipeline de [pipeline-3d.md](pipeline-3d.md): imagens molde, molde no Blender e elemento em Three.js com menos de 200 KB, com aprovação em cada etapa. **Sempre sugira** um elemento 3D do tema (`sugestao3d`), mesmo que o usuário não tenha pedido 3D: a experiência gira em torno dele.

**Scroll animado (sempre, logo depois do 3D).** Mesmo sem 3D, pergunte. Base: [scroll-avancado.md](scroll-avancado.md), com os 7 sites de referência (Era Residence, Rectangles FM, Zentry, Tenztan, The Art of Cinema, Diego Liv, Collab Capitolium) e os padrões medidos na base. Opções: **scroll recomendado** (ligado ao tema e ao 3D: com objeto 3D, "pin + scrub" que gira o objeto e troca o texto) · 2 alternativas (pilha sticky, revelação por clip-path, vídeo ligado ao scroll, texto que acende, trilho horizontal) · **"você escolhe por mim"** · **Outro** (digitar). Mostre cada padrão com o link do site que o usa. Um scroll de assinatura por página.

**Molde do 3D e prévia do site.** Se houver 3D, quatro aprovações, nesta ordem: imagens molde → molde no Blender → elemento em Three.js → vídeo-prévia do site. Em cada uma, pergunte "o que precisa alterar?" até aprovar. Só então construa. Detalhes em [aprovacoes.md](aprovacoes.md) e [pipeline-3d.md](pipeline-3d.md).

## Regra permanente (não é pergunta)
Todo site usa componentes ou transições das plataformas (reactbits.dev, transitions.dev, naocodei.com; pinstack e tasteskill como referência), com o que veio de onde e a licença no relatório (`plataformas.md`). Nada de login, conta ou compra: itens PRO ficam com o usuário.

## Depois das escolhas
```bash
node <skill>/scripts/montar-brief.mjs --nome "<Marca>" --tema "<tema>" --adjetivos "a,b,c" --publico "..." --recursos "3d,scroll" [--ref3d "objeto=caminho"] --saida ./design
```
Registre no brief: resumo do sistema (bloco 1), sites escolhidos, stack, estilo, paleta (ids e hex), decisão de 3D; preencha `secoes[].referencia`, `componente` e `motion` (o estudo do passo 3 completa a referência por seção). **Valide o brief com o usuário antes de construir.**
