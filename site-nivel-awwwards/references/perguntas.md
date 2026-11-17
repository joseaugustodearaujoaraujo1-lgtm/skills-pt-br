# Perguntas para a identidade visual (antes de construir)

Objetivo: entender a marca o suficiente para propor **opções reais** e deixar o usuário **escolher** design e paleta. Pergunte só o que ainda não foi dito. Use a ferramenta de perguntas do ambiente (no Claude Code, `AskUserQuestion`: até 4 perguntas por vez, 2–4 opções cada, e o usuário sempre tem "Outro" para escrever).

## Rodada 1: entender (texto livre ou opções)
1. **O que é e para quem:** negócio, produto ou pessoa; público principal; aparelho mais usado.
2. **Objetivo da página e ação principal:** vender, agendar, contato, portfólio, lista de espera.
3. **Personalidade em 3 adjetivos** (ex.: elegante, raro, silencioso) e **o que não quer parecer** (ex.: infantil, genérico de IA, corporativo frio).
4. **Material disponível:** logo, fotos, vídeos, textos, objeto 3D (se houver 3D: imagem muito detalhada ou vídeo é obrigatório, ver `3d-leve.md`).
5. **Stack (só estas opções):** **HTML + CSS + JS + GSAP** (recomendado: mais leve, ideal para landing e portfólio) ou **Next.js + GSAP** (quando precisa de React, rotas, CMS ou componentes do reactbits.dev), e o "Outro" para o usuário escrever. Não ofereça outras stacks como opção.
6. **Restrições:** prazo, cores ou fontes obrigatórias da marca.
7. **Modo de trabalho** (de `design-completo`): A · do zero, B · refazer, C · reajustar. Em B e C, faça o diagnóstico antes (`base-design-completo/01-diagnostico.md`).

## Rodada 2: escolher a direção de design (estilo)
Rode `escolher-estilo.mjs` e ofereça 3 estilos dos 10 (`base-estilos/`), cada um com uma linha do porquê, mais a opção recomendada. Exemplo:
- Typography Luxury · Minimalism · Dark Mode · **Recomendado: Typography Luxury** (porquê).

## Rodada 3: escolher a paleta (3 escuras + 3 claras)
Rode `opcoes.mjs` e mostre as duas tabelas:
- **Escuro:** E1 Assinatura · E2 Contida · E3 Ousada.
- **Claro:** C1 Assinatura · C2 Contida · C3 Ousada.
Pergunte: "Qual paleta para o tema escuro? E para o claro?" (o site pode ter os dois temas; se tiver um só, pergunte qual tom primeiro). Sempre deixe o usuário pedir ajuste (outro acento, mais sóbria, cor da marca) e rode de novo com `gerar-paleta.mjs --acento <graus>`.
Mostre as cores **visualmente** quando possível (amostras em uma página HTML ou widget), não só os hex.

## Rodada 4: escolher o site de referência (5 opções, sempre)
Mostre as 5 opções do `opcoes.mjs`, depois de abrir as capturas e confirmar que cada uma é boa (troque a que estiver no preloader ou quebrada):

| Opção | O que é |
|---|---|
| **A, B, C** | Três sites nível Awwwards ou One Page Love, variados entre si (fonte, nicho, abordagem), com o porquê de cada um e a captura |
| **D** | **Campo livre:** o usuário escreve um site, um estilo ou uma ideia e você **pesquisa de novo** (`opcoes.mjs --sugestao "..."` + busca ao vivo) e volta com 3 novas opções |
| **E** | **Recomendada por você:** a melhor para o briefing, com justificativa em 2 frases |

Se o usuário pedir "mostre outros", rode com `--excluir <slugs já mostrados>`. Repita até ele escolher. Na ferramenta de perguntas, A, B e C viram opções, E entra marcada "(Recomendado)" como primeira, e D é o "Outro" (texto livre).

## Depois da escolha
Registre no brief (`montar-brief.mjs`): estilo, paleta escura e clara escolhidas (ids e hex), site de referência e o que pegar dele (composição, ritmo, motion; nunca layout, texto ou imagem copiados). Valide o brief com o usuário antes de construir.
