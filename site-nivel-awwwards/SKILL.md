---
name: site-nivel-awwwards
description: Skill única para criar sites, landing pages, portfólios e lojas do zero com design, identidade visual, UX/UI, componentes e movimento de nível Awwwards e One Page Love. Pergunta, em ordem fixa e com opções (e campo para digitar), qual site de referência o usuário prefere (3 sugestões do acervo de sites premiados + 1 recomendada, com links clicáveis), a stack (HTML+CSS+JS+GSAP ou Next.js+GSAP), o estilo (entre 10, com opção de deixar a escolha para a skill) e a paleta (a recomendada ou a que o usuário escrever); se houver 3D, pergunta se o usuário gera a imagem ou vídeo de referência (com prompt de comandos de barra) ou se a skill faz, e sempre sugere um elemento 3D leve. Sempre usa componentes das plataformas reactbits.dev, transitions.dev e naocodei.com (com pinstack e tasteskill.dev de referência), inclui todo o conteúdo de design-completo e estilos-paletas-design, monta brief em JSON com tokens CSS, tem receitas de código e portão de qualidade. Use SEMPRE que o pedido envolver site nível Awwwards, premiado, One Page Love, design incrível ou profissional, identidade visual, escolha de paleta ou estilo, hero, scroll, animação ou 3D, mesmo sem citar esses nomes.
---

# Site nível Awwwards / One Page Love

Conduz o processo completo, **com o usuário escolhendo** nas decisões de gosto: entender a marca, pesquisar, oferecer opções de estilo, paleta e site de referência, montar o brief, construir com receitas testadas e **medir** antes de entregar.

> **Caminhos:** `~/.claude/skills/site-nivel-awwwards/` é a pasta desta skill (a que tem este arquivo); se ela estiver em outro lugar, use esse caminho. **Sem usuário para responder** (teste, automação): em cada pergunta ou aprovação (inclusive o "Posso começar?" e os portões do 3D, ver `aprovacoes.md`), escolha a opção recomendada pela skill e registre a escolha e o motivo em `design/DECISOES.md`. Os scripts acham o playwright-core e o Chromium sozinhos nos caminhos comuns; se não acharem, defina `PLAYWRIGHT_CORE` e `CHROME`.
>
> Regras do `CLAUDE.md` valem: perguntar "Posso começar?" antes de usar ferramentas, pedir autorização para etapas novas, custos, publicações e operações externas. Esta skill não amplia o escopo autorizado. Nas plataformas externas: sem login, sem conta, sem compra.

## Princípios
1. **O usuário escolhe, você recomenda**: estilo, paleta e referência sempre em opções, com uma recomendada e justificada; nunca decida o gosto sozinho.
2. **Evidência antes de gosto**: as opções vêm do acervo (910 sites), de pesquisa ao vivo e de dados medidos, não do padrão do modelo.
3. **Referência Awwwards é o molde do site**: escolha um site premiado do Awwwards (acervo ou pesquisa ao vivo) e reproduza o site **quase igual** em estrutura e experiência: ordem e proporção das seções, grid, hierarquia tipográfica, ritmo e tipo de scroll, transições e motion (medidos quadro a quadro com a skill `reanimate`). Só não copie o que é protegido: texto, imagens, vídeos, logo, marca, fontes pagas e código-fonte; esses são recriados com o conteúdo e a identidade do cliente.
4. **Uma ideia, um gesto**: um conceito claro e **um** efeito de assinatura. Menos efeitos, melhor acabamento.
5. **Todo componente 3D é 3D de verdade e ultrarrealista**: geometria real em WebGL (three.js ou R3F) com material PBR, iluminação por HDRI/ambiente, reflexos e sombras, girável em qualquer ângulo. Imagem recortada, sprite ou flip de PNG **não conta como 3D**. **A skill pede imagens de referência ao usuário sempre que possível**, gera ela mesma a imagem-molde ultrarrealista (4 vistas, com a ferramenta de imagem disponível), **pergunta se o molde ficou bom ou precisa de ajuste**, depois gera um **vídeo-prévia de como o site vai ficar** e pergunta de novo (seção 3b); o 3D é estritamente igual ao molde aprovado (ver `references/3d-leve.md`, Regra −1 e Regra 0). **Depois do 3D, sempre se sugere um scroll animado avançado** (`references/scroll-avancado.md`).
6. **Medir para declarar**: contraste, Lighthouse, peso e viewports vão no relatório; "nível Awwwards" não se declara.

## Fluxo (siga na ordem)

### 0. Modo de trabalho
Identifique e diga ao usuário: **A · do zero**, **B · refazer** (redesign) ou **C · reajustar** (ajuste fino ou repaginação). Em B e C, capture e diagnostique antes de propor (rubrica de 10 dimensões em `references/base-design-completo/01-diagnostico.md`, níveis 1–3 em `base-design-completo/_SKILL-original.md`, seção 2).

### 1. Perguntas em três blocos → [references/perguntas.md](references/perguntas.md)
Use `AskUserQuestion` (sempre com "Outro" para o usuário digitar). **Não mostre sites, estilos nem paletas antes de entender o sistema.**
1. **Conhecer e entender o sistema** (2 rodadas): o que é e o assunto, objetivo e ação principal, público e aparelho, páginas e funcionalidades, material existente, 3 adjetivos e o que evitar, e a **stack** (só HTML + CSS + JS + GSAP ou Next.js + GSAP).
2. **Qual destes sites você mais gosta?** Sugestão tirada de **toda a base** (~884 sites válidos), escolhendo layouts que **encaixam no tema e no assunto**: **A, B, C** + **E recomendada**, com link clicável `[Nome](url)` e "por que encaixa"; "Outro" = o usuário sugere e você reprocura.
3. **Montagem do design, com recomendação sempre** (a 1ª opção é "(Recomendado)" com o motivo): **estilo** (3 dos 10 de `references/base-estilos/` com a paleta de origem, "você escolhe por mim" ou digitar), **paleta** (a recomendada, as geradas 3 escuras + 3 claras, ou escrever a sua) e, se houver 3D, **peça ao usuário imagens de referência do elemento** (fotos, links, prints; dispensável só se o elemento for inventado, como um personagem de história); o molde é gerado pela skill a partir delas (`prompts-3d.md`). **Sempre sugira um elemento 3D leve** do tema (`sugestao3d`, método de `3d-leve.md`). **Antes de fazer o 3D, gere o molde ultrarrealista** (4 vistas e/ou vídeo giratório) e faça o elemento **estritamente igual a ele** (`3d-leve.md`, Regra 0, com portão de igualdade). **Logo depois do 3D, sempre sugira um scroll animado extremamente sofisticado e avançado**, no nível de Era Residence, Rectangles FM, Zentry, Tenztan, The Art of Cinema, Diego Liv e Collab Capitolium (`references/scroll-avancado.md`; `sugestaoScroll` no `opcoes.mjs`).

**Regra permanente:** todo site usa componentes ou transições das plataformas (reactbits.dev, transitions.dev, naocodei.com; pinstack e tasteskill como referência), com o que veio de onde e a licença no relatório (`references/plataformas.md`).

### 2. Pesquisa e opções (rode depois do bloco 1, antes do bloco 2)
```bash
node ~/.claude/skills/site-nivel-awwwards/scripts/opcoes.mjs --tema "<assunto>" --adjetivos "a,b,c" --recursos "3d,scroll,tipografia" [--tipo vitrine|portfólio|saas|institucional|editorial|evento] [--evitar "x,y"] [--excluir "slugs"] [--sugestao "..."]
```
Considera **todos os sites válidos** e pontua o **encaixe de layout** (`scripts/layout.mjs`: seções, texto, imagens, hero e rolagem do site medido contra o perfil do tema). Gera sites (A, B, C, E, com links e "por que encaixa"), 3 estilos com paleta de origem, paletas por tom, paleta recomendada e sugestão de 3D. **Abra as capturas** e troque sites no preloader ou fracos; complemente com pesquisa ao vivo (Awwwards, One Page Love, tasteskill.dev). Ranking: [references/pesquisa.md](references/pesquisa.md).

### 3. Brief de design (fonte única para quem constrói)
```bash
node ~/.claude/skills/site-nivel-awwwards/scripts/montar-brief.mjs --nome "<Marca>" --tema "<tema>" --adjetivos "a,b,c" --publico "..." --recursos "3d,scroll" [--ref3d "objeto=caminho"] --saida ./design
```
Registre sites escolhidos, stack, estilo, paleta (ids e hex), decisão de 3D e o que pegar de cada referência; preencha `secoes[].referencia`, `componente` e `motion`. **Valide o brief com o usuário antes de construir.**

### 3b. Portões de aprovação do 3D e da prévia (obrigatórios, nesta ordem) → [references/aprovacoes.md](references/aprovacoes.md)
1. **Pedir imagens de referência do elemento 3D ao usuário, sempre que possível.** Fotos, links ou prints do objeto real (vários ângulos ajudam). Só dispense quando o elemento for **inventado** (personagem ou objeto de uma história, mascote, peça que não existe na internet): aí peça descrição, esboço ou referências de estilo e diga que o molde será criado do zero.
2. **Gerar o molde** (4 vistas ultrarrealistas) a partir das referências e **perguntar com `AskUserQuestion`**: "Ficou bom ou precisa alterar algo?" (Aprovar · Alterar: descrever). Repita até aprovar. Sem aprovação, não modele.
3. **Gerar o vídeo-prévia de como o SITE vai ficar** (hero, scroll e o objeto 3D em ação, com a paleta e o estilo escolhidos) e **perguntar de novo**: "Ficou bom ou precisa alterar algo?". Repita até aprovar. Só então construa.

Marcas de terceiros nas referências (logotipo, nome, emblema, desenho registrado): o molde e o site **não** levam a marca, a menos que o usuário seja o dono ou tenha licença; use a referência só para forma, material e luz.

### 3c. Direção criativa (obrigatória, antes de qualquer código) → [references/direcao-criativa.md](references/direcao-criativa.md)
Escreva `design/DIRECAO.md` e aprove com o usuário antes de construir: (1) **ideia central em uma frase** (um verbo, não adjetivos; passa nos cinco testes, incluindo a troca de assunto e a logo coberta); (2) **gesto-assinatura por seção**, todos derivados da ideia e visíveis numa tela parada; (3) **uma regra que o site nunca quebra**; (4) **o que o site NÃO faz** (3 a 5 clichês do tema e da técnica). Ofereça duas ideias do banco de conceitos com `AskUserQuestion` (uma recomendada). **Seção sem gesto não está pronta.**

### 4. Identidade visual própria
Conceito, elementos de assinatura (forma, tratamento de imagem, cursor, transição), tipografia (`base-design-completo/02-tipografia.md`), cor e modo escuro (`03-cor-e-contraste.md`), e como fugir da "cara de IA" (`08-cara-de-ia.md`, `references/anti-cliches.md`). Skill `identidade-visual` para fechar `docs/IDENTIDADE.md`. Logo e ativos-chave antes de estilo fino.

### 5. Construção → [references/elementos.md](references/elementos.md)
**Comece pelo projeto-base** (HTML + CSS + JS + GSAP ou Next.js + GSAP), que já traz hero em CSS, menu, manifesto, trilho horizontal, números, passos, contato, rodapé, acessibilidade e as lições de desempenho medidas:
```bash
node ~/.claude/skills/site-nivel-awwwards/scripts/criar-projeto.mjs --stack html|next --nome "<Marca>" --tema "<assunto>" --adjetivos "a,b,c" --publico "..." --descricao "<até 155 caracteres>" --saida ./meu-site --cores "fundo=#..,superficie=#..,texto=#..,acento=#.." --instalar
```
`--cores` grava a paleta escolhida no bloco 3; sem ela fica a paleta gerada para o tema. Ele gera o brief e os tokens, baixa as fontes locais, escreve a paleta escura da seção de contraste, copia o projeto-base e instala. Depois: (1) troque todo texto **[entre colchetes]** por conteúdo real; (2) aplique estilo e paleta escolhidos e os **componentes das plataformas** ([references/componentes-plataformas.md](references/componentes-plataformas.md) tem nomes reais, peso e combinação por tipo de página); (3) ajuste as seções ao layout do site de referência escolhido (sem copiar); (4) imagens reais (do cliente ou abertas com crédito), vídeo com poster, 3D leve se o conceito pedir.
Receitas: tipografia, scroll, animação, cursor, preloader, imagem e vídeo em `elementos.md`; **desempenho no celular** em `elementos.md` seção 9. 3D: [references/3d-leve.md](references/3d-leve.md) e [references/prompts-3d.md](references/prompts-3d.md).
Combine com `frontend-design`, `gsap-*`, `scroll-craft`, `motion-design`, `desenvolvedor-de-solucoes` e `karpathy-guidelines`.

### 6. Portão de qualidade → [references/rubrica.md](references/rubrica.md)
```bash
node ~/.claude/skills/site-nivel-awwwards/scripts/verificar-site.mjs http://localhost:3001/ --saida ./verificacao --lighthouse
```
O verificador abre o site em **1440, 768 e 390 px** e reprova (FAIL) rolagem horizontal, erros no console, requisições falhas, texto de modelo `[entre colchetes]`, lorem ipsum, `<h1>` ausente ou duplicado, **contraste abaixo de 4,5:1 (3:1 em texto grande)**, imagens sem `alt` ou quebradas, texto invisível com `prefers-reduced-motion` e acessibilidade Lighthouse < 95. Avisa (WARN) sobre fontes demais, texto pequeno, alvos de toque < 44 px, pouco movimento, gradiente em texto, emoji, poucas imagens e desempenho abaixo da meta (90 desktop, 75 celular). Gera `relatorio.md`, capturas da primeira dobra (com movimento) e da página inteira (estado final). **Depois olhe as capturas** e aplique a rubrica Awwwards (Design, Usabilidade, Criatividade, Conteúdo) com evidência. Corrija o que ficar abaixo de 7 e repita.
**Juiz Awwwards (portão final, obrigatório):** `node scripts/juiz.mjs <url> --saida ./juiz --direcao design/DIRECAO.md` (site sem rolagem: `--palco ...`) e lance um subagente limpo com `juiz/PEDIDO-AO-JUIZ.md` ([references/juiz.md](references/juiz.md)). Só entrega com **média ponderada ≥ 7,5 e nenhum critério abaixo de 6**; corrija na ordem de impacto devolvida e chame um juiz novo a cada rodada. Em réplica, rode também a nota de fidelidade (`replica/ferramentas/fidelidade.py`, toda tela ≥ 75; `replica/PROTOCOLO.md` 5.5). Relate o que **não** foi testado (celular real, redes lentas, outros navegadores, leitor de tela). Formato do relatório: `base-design-completo/_SKILL-original.md`, seção 6.

## Regras de ouro (de design-completo)
Uma ação principal por tela · hierarquia antes de estética · poucas decisões repetidas com consistência (1–2 fontes, uma escala, um acento, um raio) · espaço é estrutura · contraste 4,5:1 (3:1 texto grande) · celular primeiro · identidade vem do assunto · motion com propósito (só `transform`/`opacity`) · conteúdo real, sem números ou depoimentos inventados · prove com antes e depois.

## O que os dados mostram (resumo)
Ver [references/padroes.md](references/padroes.md). A primeira dobra tem **um protagonista** (tipografia, cena WebGL em 43% no Awwwards, imagem ou vídeo); título de hero ≥ 72 px em ~25% (Awwwards) e ~39% (OPL); 2 famílias de fonte; um acento (ou nenhum); fundo escuro em ~51% dos premiados; GSAP + ScrollTrigger (+ Lenis) como base.

## Arquivos
| Arquivo | Função |
|---|---|
| `scripts/opcoes.mjs` | sites (A, B, C, E com links, Outro reprocura), estilos com paleta de origem, paletas 3+3, sugestão 3D |
| `scripts/pesquisar-referencias.mjs` | ranking de referências em toda a base por tema, recursos, libs e encaixe de layout (`--todos`, `--tipo`) |
| `scripts/criar-projeto.mjs` | cria o projeto do zero (brief, tokens, fontes, paleta escura, projeto-base HTML+GSAP ou Next.js+GSAP) |
| `scripts/verificar-site.mjs` | portão de qualidade automático: 3 larguras, contraste, placeholders, imagens, console, movimento reduzido, Lighthouse |
| `scripts/juiz.mjs` + `references/juiz.md` | juiz Awwwards: 6 a 8 telas em 1440 e 390 px numa folha única, fatos medidos e o prompt do subagente avaliador (nota mínima para liberar) |
| `replica/ferramentas/fidelidade.py` | nota de fidelidade da réplica por tela (SSIM + bordas a 8 px), com imagem de diferença só abaixo do limite |
| `references/direcao-criativa.md` | etapa antes do código: ideia central, gesto por seção, regra inquebrável, o que não faz; banco de conceitos por tema |
| `starters/html`, `starters/next` | projetos-base com os padrões e as lições de desempenho |
| `references/componentes-plataformas.md` | catálogo real de componentes (reactbits, transitions.dev) por necessidade, peso e tipo de página |
| `scripts/layout.mjs` | perfis de layout por tipo de página e cálculo do encaixe com a estrutura medida de cada site |
| `scripts/escolher-estilo.mjs` | estilo principal e secundário (10 estilos) |
| `scripts/gerar-paleta.mjs` | paleta OKLCH com contraste, por tema e tom |
| `scripts/montar-brief.mjs` | `brief.json` + `tokens.css` do projeto |
| `scripts/gerar-padroes.mjs` | regera `references/padroes.md` a partir do acervo |
| `scripts/baixar-fontes.mjs` | fontes do Google no próprio site (woff2 latin + fonts.css + preload) |
| `scripts/qualidade.mjs` | filtro de capturas inválidas |
| `scripts/temas.json` | ~25 temas: palavras, nichos do acervo, cor, estilos |
| `references/perguntas.md` | os 3 blocos de perguntas (entender, sites, design) e o formato das opções |
| `references/padroes-ux.md` + `scripts/gerar-padroes-ux.mjs` | padrões de UX/UI medidos em 830 sites da base (scroll, 3D, animação, efeitos, menu, tipografia), com % por fonte |
| `references/aprovacoes.md` | portões obrigatórios: pedir referências do 3D, aprovar o molde, aprovar o vídeo-prévia do site |
| `references/scroll-avancado.md` | 7 sites de referência de scroll, padrões (pin+scrub, pilha sticky, clip-path, vídeo no scroll) e receitas GSAP |
| `references/prompts-3d.md` | prompts de imagem e vídeo 3D com comandos de barra e a pergunta de quem gera |
| `references/plataformas.md` | tasteskill, transitions, reactbits, naocodei, pinstack: preço, licença, limites e uso |
| `references/base-design-completo/` | conteúdo completo da skill design-completo (diagnóstico, tipografia, cor, layout, componentes, motion, conversão, cara de IA, referências, catálogo naocodei, implementação) |
| `references/base-estilos/` | os 10 estilos completos da skill estilos-paletas-design (+ tabela comparativa e compatibilidade em `_SKILL-original.md`) |
| `references/*.md` | pesquisa, estilos, paletas, elementos, 3D leve, padrões, rubrica, anti-clichês |
Acervo: `~/Documents/acervos-design` (galeria: `node servidor.mjs 3000`; busca: `node buscar.mjs`; recaptura: `recapturar.mjs`).

## Limites conhecidos
- **Base:** 1.819 sites coletados, ~884 válidos e únicos (Awwwards 150, One Page Love ~734; o resto é erro, bloqueio ou site fora do ar). A estrutura (seções, texto, hero, rolagem) é medida por heurística de DOM em 1440 px; sites ainda sem medida aparecem como "layout ainda não medido". A base **não cresce sozinha**: para somar sites novos é preciso listar e capturar (`coletar.mjs` e `extrair-estrutura.mjs`).
- O ranking e o encaixe de layout são heurísticos: a curadoria final das opções A–E é sua, **olhando as capturas** (algumas mostram só o preloader).
- O verificador automático não julga hierarquia, composição nem originalidade, e não testa celular real, redes lentas, leitor de tela nem outros navegadores.
- O projeto-base é um ponto de partida genérico (sem fotos): a identidade vem do conteúdo real, do estilo escolhido e do gesto de assinatura.
- Preços das plataformas verificados em 2026-11-16; os do pinstack não aparecem sem login.
- Cenas 3D complexas exigem análise caso a caso; a receita cobre o 3D leve.
- Direitos: marcas, fotos e texturas de terceiros só como estudo; em projeto de cliente use material próprio ou licenciado.
