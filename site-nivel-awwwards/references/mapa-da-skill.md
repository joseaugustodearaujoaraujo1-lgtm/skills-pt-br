# Mapa da skill: arquivos e limites

Índice para achar um arquivo. O fluxo e a ordem de uso estão no [SKILL.md](../SKILL.md).

## Por passo do fluxo
| Passo | Arquivo de detalhe | Scripts |
|---|---|---|
| 1. Briefing | [perguntas.md](perguntas.md), [pesquisa.md](pesquisa.md) (ranking e encaixe de layout), [estilos.md](estilos.md), [base-estilos/](base-estilos/), [paletas-por-tema.md](paletas-por-tema.md), [scroll-avancado.md](scroll-avancado.md), [prompts-3d.md](prompts-3d.md) | `opcoes.mjs`, `montar-brief.mjs`, `pesquisar-referencias.mjs`, `layout.mjs`, `escolher-estilo.mjs`, `gerar-paleta.mjs`, `temas.json` |
| 2. Direção criativa | [direcao-criativa.md](direcao-criativa.md), [anti-cliches.md](anti-cliches.md), [base-design-completo/](base-design-completo/) | |
| 3. Estudo de referências | [pesquisa.md](pesquisa.md) (camadas 2 e 3), [../replica/PROTOCOLO.md](../replica/PROTOCOLO.md) (réplica), [../replica/README.md](../replica/README.md) (ferramentas) | `replica/ferramentas/estudar3.cjs`, `secoes.cjs`, `palco.cjs` |
| 4. Construção | [construcao.md](construcao.md), [elementos.md](elementos.md), [componentes-plataformas.md](componentes-plataformas.md), [plataformas.md](plataformas.md), [3d-leve.md](3d-leve.md), [aprovacoes.md](aprovacoes.md), [padroes.md](padroes.md), [padroes-ux.md](padroes-ux.md), [../starters/modulos/README.md](../starters/modulos/README.md) | `criar-projeto.mjs`, `baixar-fontes.mjs`, `tematizar.mjs`, `buscar-fotos-livres.mjs` |
| 5. Portões | [rubrica.md](rubrica.md), [juiz.md](juiz.md), [juiz-calibracao.md](juiz-calibracao.md) (não passar ao juiz), [../replica/PROTOCOLO.md](../replica/PROTOCOLO.md) §5.5 | `verificar-site.mjs`, `juiz.mjs`, `replica/ferramentas/fidelidade.py` |
| 6. Entrega e imagens | [entrega.md](entrega.md), [../galeria/IMAGENS-PARA-GERAR.md](../galeria/IMAGENS-PARA-GERAR.md) | |

## Scripts (`scripts/`)
| Arquivo | Função |
|---|---|
| `opcoes.mjs` | sites (A, B, C, E com links; Outro reprocura), estilos com paleta de origem, paletas 3+3, sugestão de 3D e de scroll |
| `pesquisar-referencias.mjs` | ranking de referências em toda a base por tema, recursos, libs e encaixe de layout (`--todos`, `--tipo`); segue sem o acervo |
| `layout.mjs` | perfis de layout por tipo de página e encaixe com a estrutura medida de cada site |
| `escolher-estilo.mjs` | estilo principal e secundário (10 estilos) |
| `gerar-paleta.mjs` | paleta OKLCH com contraste, por tema e tom |
| `montar-brief.mjs` | `brief.json` + `tokens.css` + fontes por estilo |
| `criar-projeto.mjs` | projeto do zero: brief, tokens, `--cores`, fontes locais, paleta escura, projeto-base, `--entrada`, `--porta` |
| `baixar-fontes.mjs` | fontes do Google no próprio site (woff2 latin + `fonts.css` + preload) |
| `verificar-site.mjs` | portão automático em 1440, 768 e 390 px (lista em `rubrica.md` §6) |
| `juiz.mjs` | material do juiz: folha de 6 a 8 telas, fatos medidos e `PEDIDO-AO-JUIZ.md` |
| `tematizar.mjs` | cores por papel e temas `?tema=` com a mesma luminância |
| `gerar-pacote.mjs` | pacote liberável de um site da galeria (CLAUDE.md, `PROMPT-DE-USO.md`) |
| `buscar-fotos-livres.mjs` | fotos de licença aberta, com crédito |
| `gerar-padroes.mjs`, `gerar-padroes-ux.mjs` | regeram `padroes.md` e `padroes-ux.md` a partir do acervo |
| `qualidade.mjs` | filtro de capturas inválidas do acervo |
| `temas.json` | ~25 temas: palavras, nichos do acervo, cor, estilos |

## Outras pastas
| Pasta | O que tem |
|---|---|
| `starters/html`, `starters/next` | projetos-base (HTML + CSS + JS + GSAP; Next.js + GSAP) |
| `starters/modulos/` | 6 módulos medidos (giro por quadros, trecho fixo, galeria horizontal, meio-tom, vidro, cursor) |
| `galeria/` | 9 sites de estudo, cada um com `CLAUDE.md`, `PROMPT-DE-USO.md`, `conceito/` e `?tema=` |
| `replica/` | protocolo de réplica, fichas dos sites, ferramentas de estudo e de fidelidade |
| `teste-cego/` | os 4 sites feitos por agente limpo só com a skill; registro em [teste-cego.md](teste-cego.md) |
| `references/base-design-completo/` | conteúdo da skill design-completo (diagnóstico, tipografia, cor, layout, componentes, motion, conversão, cara de IA, referências, implementação) |
| `references/base-estilos/` | os 10 estilos completos (tabela comparativa e compatibilidade em `_SKILL-original.md`) |

Acervo (computador do usuário; para refazer do zero veja [acervo-do-zero.md](acervo-do-zero.md)): `~/Documents/acervos-design` (galeria: `node servidor.mjs 3000`; busca: `node buscar.mjs`; recaptura: `recapturar.mjs`; coleta: `coletar.mjs` e `extrair-estrutura.mjs`).

## Limites conhecidos
- **Base:** 1.819 sites coletados, ~884 válidos e únicos (Awwwards 150, One Page Love ~734; o resto é erro, bloqueio ou site fora do ar). A estrutura é medida por heurística de DOM em 1440 px; sites sem medida aparecem como "layout ainda não medido". A base não cresce sozinha.
- **Sem o acervo** (nuvem, outro computador), o bloco 2 depende da pesquisa ao vivo, e o Awwwards recusou a conexão em 3 de 4 rodadas do teste cego: o resultado costuma ser uma referência só.
- O ranking e o encaixe de layout são heurísticos: a curadoria final das opções é sua, olhando as capturas (algumas mostram só o preloader).
- O verificador não julga hierarquia, composição nem originalidade, e não testa celular real, redes lentas, leitor de tela nem outros navegadores. O juiz não vê movimento e, sem GPU, só vê o plano B do 3D.
- O projeto-base é genérico (sem fotos): a identidade vem do conteúdo real, do estilo e do gesto.
- Preços das plataformas verificados em 2026-11-16; os do pinstack não aparecem sem login.
- Cenas 3D complexas exigem análise caso a caso; a receita cobre o 3D leve.
- Direitos: marcas, fotos e texturas de terceiros só como estudo; em projeto de cliente, material próprio ou licenciado.
