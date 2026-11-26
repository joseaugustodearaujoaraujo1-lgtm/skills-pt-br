# Preparação no primeiro uso (instalar só com permissão)

Copiar a skill não instala programas. **No primeiro uso numa máquina** (e quando um script avisar que falta algo), antes de começar o projeto:

1. Rode `node <skill>/scripts/preparar.mjs`. Ele só confere; não instala nada. Se não faltar nada, siga em frente sem perguntar.
2. Se faltar algo, **pergunte ao usuário** com `AskUserQuestion` (várias escolhas), dizendo para cada item: para que serve, se é obrigatório, o tamanho, que é gratuito o comando que vai rodar e, no `winget`, que o comando **aceita os termos do pacote** em nome dele. Sempre ofereça "não instalar nada".
3. Instale **somente os itens que ele escolher**, com a resposta dele:
   ```bash
   node <skill>/scripts/preparar.mjs --instalar blender,ffmpeg --autorizado "<resposta do usuário>"
   ```
4. Rode o passo 1 de novo para conferir. Para cada item recusado, diga uma vez o que deixa de funcionar e não insista.

**Nunca:** instalar sem resposta do usuário nesta conversa, ampliar a autorização para outro item, confirmar a janela de administrador por ele, nem usar `sudo`. Sem usuário para responder, não instale.

**Se faltar o Node** (o script não roda): peça permissão e use `winget install OpenJS.NodeJS.LTS` (Windows) ou `brew install node` (macOS); no Linux, oriente a instalação manual.

## O que o script não instala (só avise quando for preciso)
| Item | O que fazer |
|---|---|
| Acervo de sites premiados | opcional; montar com [acervo-do-zero.md](acervo-do-zero.md), com permissão (baixa páginas e capturas). Sem ele a pesquisa é ao vivo |
| Gerador de imagens pago, contas, créditos, logins | não é necessário: o molde é feito por você ([pipeline-3d.md](pipeline-3d.md)). Quem cria conta e paga é o usuário |
| MCP do Blender | não é necessário (usa a linha de comando; o MCP gasta mais tokens). Só se o usuário pedir, com permissão própria |
| Outras skills citadas (`reanimate`, `frontend-design`, `gsap-*`, `scroll-craft`, `desenvolvedor-de-solucoes`, `karpathy-guidelines`) | opcionais: siga sem elas; instalar só se o usuário pedir |
| `CLAUDE.md` e configurações pessoais | nunca criar nem alterar sem o usuário pedir |
| Componentes de reactbits, transitions.dev, naocodei, pinstack | consultados na internet; sem login nem compra |

## Instalações que acontecem durante o projeto (peça permissão antes)
- `criar-projeto.mjs --instalar`: roda `npm install` na pasta do projeto.
- `verificar-site.mjs --lighthouse`: baixa e executa `lighthouse@latest` com `npx`. Sem permissão, rode o verificador sem `--lighthouse` e diga que o Lighthouse não foi medido.
