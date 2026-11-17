---
name: site-nivel-awwwards
description: Skill única para criar, refazer ou reajustar sites, landing pages, portfólios e lojas com design, identidade visual, UX/UI, componentes e movimento de nível Awwwards e One Page Love. Faz perguntas para entender a marca, oferece 3 paletas para o tema escuro e 3 para o claro, 3 estilos entre 10, e 5 opções de site de referência (3 sites premiados, um campo livre para o usuário sugerir e reprocurar, e uma recomendada), para o usuário escolher. Inclui todo o conteúdo das skills design-completo (diagnóstico, rubrica, tipografia, cor, layout, componentes, motion, conversão, anti "cara de IA") e estilos-paletas-design (10 estilos com tokens e componentes), pesquisa em 910 sites premiados do acervo local, as plataformas tasteskill.dev, transitions.dev, reactbits.dev, naocodei.com e pinstack.app, brief em JSON com tokens CSS, receitas de código (tipografia, scroll, animação, 3D leve, imagem, vídeo) e portão de qualidade. Use SEMPRE que o pedido envolver site "nível Awwwards", "premiado", "One Page Love", "design incrível/profissional/diferenciado", identidade visual, escolha de paleta, estilo, hero, scroll, animação ou 3D, mesmo sem citar esses nomes.
---

# Site nível Awwwards / One Page Love

Conduz o processo completo, **com o usuário escolhendo** nas decisões de gosto: entender a marca, pesquisar, oferecer opções de estilo, paleta e site de referência, montar o brief, construir com receitas testadas e **medir** antes de entregar.

> Regras do `CLAUDE.md` valem: perguntar "Posso começar?" antes de usar ferramentas, pedir autorização para etapas novas, custos, publicações e operações externas. Esta skill não amplia o escopo autorizado. Nas plataformas externas: sem login, sem conta, sem compra.

## Princípios
1. **O usuário escolhe, você recomenda**: estilo, paleta e referência sempre em opções, com uma recomendada e justificada; nunca decida o gosto sozinho.
2. **Evidência antes de gosto**: as opções vêm do acervo (910 sites), de pesquisa ao vivo e de dados medidos, não do padrão do modelo.
3. **Referência é qualidade, não molde**: nunca copie layout, texto, imagem, logo, fonte paga ou código de um site.
4. **Uma ideia, um gesto**: um conceito claro e **um** efeito de assinatura. Menos efeitos, melhor acabamento.
5. **Todo objeto 3D nasce de uma referência**: imagem muito detalhada (várias vistas) ou vídeo, obtida **antes** de modelar (ver `references/3d-leve.md`).
6. **Medir para declarar**: contraste, Lighthouse, peso e viewports vão no relatório; "nível Awwwards" não se declara.

## Fluxo (siga na ordem)

### 0. Modo de trabalho
Identifique e diga ao usuário: **A · do zero**, **B · refazer** (redesign) ou **C · reajustar** (ajuste fino ou repaginação). Em B e C, capture e diagnostique antes de propor (rubrica de 10 dimensões em `references/base-design-completo/01-diagnostico.md`, níveis 1–3 em `base-design-completo/_SKILL-original.md`, seção 2).

### 1. Perguntas → [references/perguntas.md](references/perguntas.md)
Rodada 1 (entender): o que é, público, objetivo e ação principal, 3 adjetivos, o que não quer parecer, material disponível (logo, fotos, vídeo, objeto 3D), restrições e **stack, só em duas opções: HTML + CSS + JS + GSAP (recomendada) ou Next.js + GSAP** (o "Outro" fica para o usuário escrever). Use `AskUserQuestion` com opções sempre que der; pergunte só o que falta.

### 2. Pesquisa e opções
```bash
node ~/.claude/skills/site-nivel-awwwards/scripts/opcoes.mjs --tema "<tema>" --adjetivos "a,b,c" --recursos "3d,scroll,tipografia" [--evitar "x,y"] [--libs gsap]
```
Gera **3 paletas escuras + 3 claras** (contraste AA/AAA conferido) e **5 sites**. Antes de mostrar, **abra as capturas** (`desktop.jpg`, `mobile.jpg`) e troque a que estiver no preloader ou fraca; complemente com pesquisa ao vivo (Awwwards, One Page Love, direções do tasteskill.dev). Detalhes do ranking: [references/pesquisa.md](references/pesquisa.md).

### 3. Escolhas do usuário (sempre nesta forma)
1. **Estilo:** 3 dos 10 (`escolher-estilo.mjs`, `references/estilos.md`, detalhes em `references/base-estilos/<estilo>.md`) + o recomendado.
2. **Paleta:** "Qual para o tema escuro (E1, E2, E3)? E para o claro (C1, C2, C3)?" Mostre as amostras de cor de forma visual. Ajustes: `gerar-paleta.mjs --tom escuro|claro --acento <graus>`.
3. **Site de referência, 5 opções:**
   - **A, B, C**: três sites nível Awwwards ou One Page Love, variados, cada um com o porquê.
   - **D (campo livre)**: o usuário sugere um site, estilo ou ideia; você **reprocura** (`opcoes.mjs --sugestao "..."` + busca ao vivo) e volta com novas opções.
   - **E (recomendada)**: a sua escolha, com justificativa.
   No `AskUserQuestion`: E primeiro com "(Recomendado)", depois A, B, C; o "Outro" é a opção D. "Mostre outros" → `--excluir <slugs já mostrados>`. Repita até a escolha.

### 4. Brief de design (fonte única para quem constrói)
```bash
node ~/.claude/skills/site-nivel-awwwards/scripts/montar-brief.mjs --nome "<Marca>" --tema "<tema>" --adjetivos "a,b,c" --publico "..." --recursos "3d,scroll" [--ref3d "objeto=caminho"] --saida ./design
```
Registre estilo, paletas escolhidas (escura e clara), site de referência e o que pegar dele; preencha `secoes[].referencia`, `componente` e `motion`. **Valide o brief com o usuário antes de construir.**

### 5. Identidade visual própria
Conceito, elementos de assinatura (forma, tratamento de imagem, cursor, transição), tipografia (`base-design-completo/02-tipografia.md`), cor e modo escuro (`03-cor-e-contraste.md`), e como fugir da "cara de IA" (`08-cara-de-ia.md`, `references/anti-cliches.md`). Skill `identidade-visual` para fechar `docs/IDENTIDADE.md`. Logo e ativos-chave antes de estilo fino.

### 6. Construção → [references/elementos.md](references/elementos.md)
Ordem: tokens → tipografia e espaço globais → layout e grid (`04-layout-e-espaco.md`) → componentes com todos os estados (`05-componentes.md`) → imagens e vídeo → motion (`06-motion.md`) → conversão (`07-conversao.md`).
- **Componentes e efeitos:** [references/plataformas.md](references/plataformas.md) (reactbits.dev, transitions.dev, naocodei.com, pinstack.app, tasteskill.dev, com preço, licença e limites), skill `biblioteca-componentes`, código pronto em `base-design-completo/implementacao/` (CSS puro, Tailwind, React: só o da stack).
- **Scroll e animação:** GSAP + ScrollTrigger + SplitText + Lenis (receitas em `elementos.md`).
- **3D:** [references/3d-leve.md](references/3d-leve.md) (referência visual obrigatória, geometria em código, pôster, WebGL tardio, plano B).
Combine com `frontend-design`, `gsap-*`, `scroll-craft`, `motion-design`, `desenvolvedor-de-solucoes` e `karpathy-guidelines`.

### 7. Portão de qualidade → [references/rubrica.md](references/rubrica.md)
Notas Awwwards (Design, Usabilidade, Criatividade, Conteúdo) com evidência + rubrica de 10 dimensões do `01-diagnostico.md` (antes e depois em B/C). Lighthouse, contraste, 1440/768/390 px, `prefers-reduced-motion`, foco visível, console limpo, sem rolagem horizontal. Checagens extras do inspetor do tasteskill.dev (título legível em 1,2 s, margens iguais, ≥ 4 imagens reais, sem gradiente/glass/emoji genéricos). Corrija o que ficar abaixo de 7 e repita. Relate o que **não** foi testado. Formato do relatório: `base-design-completo/_SKILL-original.md`, seção 6.

## Regras de ouro (de design-completo)
Uma ação principal por tela · hierarquia antes de estética · poucas decisões repetidas com consistência (1–2 fontes, uma escala, um acento, um raio) · espaço é estrutura · contraste 4,5:1 (3:1 texto grande) · celular primeiro · identidade vem do assunto · motion com propósito (só `transform`/`opacity`) · conteúdo real, sem números ou depoimentos inventados · prove com antes e depois.

## O que os dados mostram (resumo)
Ver [references/padroes.md](references/padroes.md). A primeira dobra tem **um protagonista** (tipografia, cena WebGL em 42% no Awwwards, imagem ou vídeo); título de hero ≥ 72 px em ~25% (Awwwards) e ~37% (OPL); 2 famílias de fonte; um acento (ou nenhum); fundo escuro em ~51% dos premiados; GSAP + ScrollTrigger (+ Lenis) como base.

## Arquivos
| Arquivo | Função |
|---|---|
| `scripts/opcoes.mjs` | 3 paletas escuras + 3 claras e 5 sites (A–C, D reprocura, E recomendada) |
| `scripts/pesquisar-referencias.mjs` | ranking de referências no acervo por tema, recursos e libs |
| `scripts/escolher-estilo.mjs` | estilo principal e secundário (10 estilos) |
| `scripts/gerar-paleta.mjs` | paleta OKLCH com contraste, por tema e tom |
| `scripts/montar-brief.mjs` | `brief.json` + `tokens.css` do projeto |
| `scripts/gerar-padroes.mjs` | regera `references/padroes.md` a partir do acervo |
| `scripts/baixar-fontes.mjs` | fontes do Google no próprio site (woff2 latin + fonts.css + preload) |
| `scripts/qualidade.mjs` | filtro de capturas inválidas |
| `scripts/temas.json` | ~25 temas: palavras, nichos do acervo, cor, estilos |
| `references/perguntas.md` | roteiro de perguntas e formato das escolhas |
| `references/plataformas.md` | tasteskill, transitions, reactbits, naocodei, pinstack: preço, licença, limites e uso |
| `references/base-design-completo/` | conteúdo completo da skill design-completo (diagnóstico, tipografia, cor, layout, componentes, motion, conversão, cara de IA, referências, catálogo naocodei, implementação) |
| `references/base-estilos/` | os 10 estilos completos da skill estilos-paletas-design (+ tabela comparativa e compatibilidade em `_SKILL-original.md`) |
| `references/*.md` | pesquisa, estilos, paletas, elementos, 3D leve, padrões, rubrica, anti-clichês |
Acervo: `~/Documents/acervos-design` (galeria: `node servidor.mjs 3000`; busca: `node buscar.mjs`; recaptura: `recapturar.mjs`).

## Limites conhecidos
- Acervo: 910 sites válidos (Awwwards 146, One Page Love 764); algumas capturas mostram o preloader: confira antes de oferecer.
- O ranking do `opcoes.mjs` é heurístico (nicho, recursos, ano): a curadoria final das opções A–E é sua, olhando as capturas.
- Preços das plataformas verificados em 2026-11-16; os do pinstack não aparecem sem login.
- Cenas 3D complexas exigem análise caso a caso; a receita cobre o 3D leve.
- Direitos: marcas, fotos e texturas de terceiros só como estudo; em projeto de cliente use material próprio ou licenciado.
