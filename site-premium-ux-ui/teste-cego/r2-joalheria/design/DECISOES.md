# Decisões tomadas sem usuário (teste cego, rodada 2)

Não havia usuário para responder nem aprovar. Seguindo o `SKILL.md` ("Sem usuário para responder"), em cada pergunta escolhi a opção recomendada pela skill e registro aqui a escolha e o motivo.

## Modo de trabalho
**A · do zero.** Briefing: "uma joalheria de luxo". Pedido: uma página com hero e 2 seções.

## Bloco 1: entender o sistema
| Pergunta | Escolha | Motivo |
|---|---|---|
| O que é e assunto | Joalheria de alta joalheria, marca fictícia **Vésper** (estrela da tarde: a primeira luz no escuro) | Briefing não traz nome; o nome nasce da ideia central (uma luz só). |
| Objetivo e ação principal | **Agendar visita ao ateliê** | Em alta joalheria a venda é presencial e sob encomenda; é a ação típica do ramo. |
| Público e aparelho | Adultos de alta renda (joia de noivado e de herança); celular e computador | Padrão do ramo; o site é testado em 1440, 768 e 390 px. |
| Seções | Hero + "A lapidação" + "Peças e visita" | Pedido do usuário (hero e 2 seções). |
| Material existente | Nenhum: sem logo, fotos, endereço, gemólogo ou preços | Não invento provas. As fotos são placeholders (lista em `IMAGENS.md`); provas que faltam estão no relatório. |
| 3 adjetivos / evitar | raro, silencioso, preciso / evitar "dourado em tudo", partículas, fonte script | Combinação pronta da skill ("elegante, raro, silencioso") ajustada; evitar = clichês do banco de conceitos (joalheria). |
| Stack | **HTML + CSS + JS + GSAP** | Recomendada pela skill para landing de uma página (mais leve). |

## Bloco 2: site de referência
O acervo local (`~/Documents/acervos-design`) **não existe nesta máquina**; `opcoes.mjs` voltou sem sites. Segui `pesquisa.md`, camada 2: pesquisa ao vivo em https://www.awwwards.com/websites/jewelry/ e captura (Playwright, 1440 px, 4 pontos de rolagem) dos candidatos. Folhas em `design/referencias/`.

| Opção | Site | Por que encaixa |
|---|---|---|
| **E (recomendada, escolhida)** | [ORE Bespoke Diamond Jewelry](https://ore.co) (Site of the Day, 28/07/2022) | Diamante como protagonista, fundo escuro e quente, marca gigante na base do hero, microtexto em caixa alta, serifa grande em itálico. Vitrine de produto com poucas palavras, exatamente o perfil "vitrine" da skill. |
| A | [Aroz Jewelry](https://arozjewelry.com/en/) (SOTD 15/06/2021) | Claro e editorial; mais e-commerce (grade de produtos) do que ateliê. |
| B | [Juri jewelry](https://jurijewelry.com) (Menção Honrosa 17/03/2026) | Galeria solta de fotos de moda; exige fotografia autoral que não temos. |
| C | [Floema Jewelry](https://floema.jewelry) (SOTD 30/07/2021) | Não abriu pelo proxy (ERR_TUNNEL); fica só como citação. |

O que pegar da ORE (técnica, não cópia): marca gigante cortando a base do hero; microtexto em caixa alta em colunas; serifa de alto contraste com itálico; transição do hero para a seção de produto sem quebra. Não copiar: texto, fotos, logo, fonte, código.

## Bloco 3: montagem do design
| Pergunta | Escolha | Motivo |
|---|---|---|
| Estilo | **Typography Luxury** (recomendado, 9 pts) com Minimalism de secundário | 1º do ranking para "luxo" e para "raro". |
| Paleta | **E1 Assinatura (escura)**: fundo `#110c08`, superfície `#1b1611`, texto `#f7f1e9`, mudo `#aca39a`, acento `#dbb155` | Paleta recomendada (a de origem do estilo ajustada ao tema pela skill). Para fugir do clichê "dourado em tudo", o acento só aparece no que é clicável e no foco da luz. |
| Tipografia | Playfair Display (títulos, com itálico) + Inter (corpo e microtexto em caixa alta) | Saída do brief; 2 famílias. Jost (detalhe) não foi baixada e não é usada. |
| 3D: referências | **"Procure você"** (sem usuário): o objeto é um diamante de lapidação brilhante redonda, objeto real e padronizado | Referências abertas (proporções de Tolkowsky e diagrama de facetas) em `referencias-3d/diamante/README.md`. |
| 3D: elemento | **Diamante lapidação brilhante (57 facetas) em WebGL2 com ray tracing** | É a `sugestao3d` do `opcoes.mjs` para luxo e o produto da casa. |
| Molde | Sem gerador de imagem: **o molde é o próprio modelo**, renderizado em 4 vistas com Playwright (`aprovacoes.md`, "Sem usuário") | Portão de igualdade feito contra as proporções de referência (ver README). |
| Vídeo-prévia | Protótipo gravado do hero e da lapidação (`design/previa.mp4`) | Opção 1 de `aprovacoes.md`. |
| Scroll | **Pin + scrub** (recomendado quando há 3D): a rolagem gira a pedra e leva a luz de uma parte a outra, com texto que acende | Tabela de `scroll-avancado.md`: "Há objeto 3D" e "Produto com história (joia)". |
| Direção criativa | **"Uma luz só"** (recomendada) contra "Lupa" | Ver `DIRECAO.md`. |
| Aprovação do brief e do `DIRECAO.md` | Aprovados por mim, por regra | Sem usuário. |

## Componentes das plataformas (regra permanente)
Ver tabela no fim do `DIRECAO.md`.

## Portão de qualidade (rodada final)
- `verificar-site.mjs --lighthouse`: **APROVADO, 0 FAIL, 0 WARN**. Lighthouse desktop 100/100/100/100 (LCP 0,4 s, TBT 0), celular 99/100/100/100 (LCP 2,1 s, TBT 60 ms, CLS 0). Atenção: o Chromium de teste não tem GPU, então o Lighthouse mediu o caminho de reserva (pôster + quadros), não o 3D ao vivo.
- 1ª rodada tinha 3 WARN de texto < 12 px (legendas SVG das cotas e microtexto no celular): corrigido.
- Juiz (subagente): não lançado, como pedido; o `juiz.mjs` também não rodou (bloqueado pela permissão do ambiente). Os gestos foram conferidos com `ferramentas/capturar.mjs` em 1440 e 390 px, incluindo o ponto de 14% da rolagem (hero ainda visível).
- Autoavaliação pela rubrica (sem juiz, então é a nota de quem construiu): Design 8 (marca gigante + pedra, uma serifa e uma sans, acento só no clicável); Usabilidade 8 (menu e CTA fixos em toda tela, foco visível, movimento reduzido mostra tudo); Criatividade 8 (luz conduzida pelo cursor + pedra calculada por ray tracing, cotas reais de lapidação); Conteúdo 6 (sem fotos reais das peças, sem endereço, gemólogo, certificado nem preços: faltam provas do cliente).
- Não testado: celular real, GPU real de celular (custo do shader), redes lentas, Safari/Firefox, leitor de tela. O formulário não tem servidor (só mostra a confirmação).
- Vídeo-prévia: `design/previa.mp4` (protótipo gravado, 8,5 s).
