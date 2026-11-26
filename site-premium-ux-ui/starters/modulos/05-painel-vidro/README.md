# 05 · Painel de vidro

## Quando usar
Texto ou controles sobre foto, vídeo ou cena 3D, quando você quer manter a imagem viva por trás: cartão de destaque, pílula de navegação, topo fixo, detalhe de produto. Não serve sobre fundo liso (o desfoque não aparece).

## Números medidos
| Onde | Desfoque | Tinta | Observação |
|---|---|---|---|
| OLEA, painel lateral | 26 px + `saturate(1.1)` | `rgb(40 38 24 / .34)` | 31,5vw de largura, altura toda |
| OLEA, cartão da intro | 14 px | `rgb(60 66 40 / .28)` | 18,5vw |
| GQ Lab, detalhe | 14 px | `rgb(10 10 12 / .78)` | texto longo pede tinta forte |
| BRUMA, pílula de navegação | 6 px | `rgb(12 18 14 / .42)` | raio 999px |
| Terminal, topo | 16 px | 66% da cor escura (94% claro opaco) | troca de tinta conforme o fundo |

## Parâmetros
`data-desfoque` (px), `data-tinta` (0 a 1), `data-saturacao`; variantes `.pilula` e `.claro`; cor da tinta em `--cor-tinta` (RGB sem vírgula).

## Armadilhas
- **Contraste**: a tinta precisa garantir 4,5:1 com o texto no pior ponto do fundo; ponha uma cor de base atrás da imagem (o `.vidro-cena` já tem).
- `backdrop-filter` não aparece se um ancestral tiver `opacity < 1`, `filter` ou `mix-blend-mode`: o JS avisa no console.
- Prefixo `-webkit-backdrop-filter` (Safari) é obrigatório.
- Desfoque grande sobre vídeo ou cena animada pesa na GPU: no celular o módulo usa 14 px; evite empilhar vários painéis.
- Tem fallback para navegadores sem suporte e para `prefers-reduced-transparency`.
- Aresta clara (`border` e sombra interna) é o que dá o ar de vidro; sem ela vira caixa escura.

## Exemplo
`exemplo/`: duas seções (escura e clara) sobre uma imagem colorida nossa.
