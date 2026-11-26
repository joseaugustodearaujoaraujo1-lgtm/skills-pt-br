# 01 · Giro de objeto 3D por quadros

## Quando usar
Um produto ou objeto que o visitante deve "girar" com a rolagem, sem carregar WebGL: você renderiza N imagens (Blender, three.js offline, foto de mesa giratória) e o canvas troca o quadro conforme o progresso. Funciona igual em qualquer aparelho e não pesa na GPU. Se o objeto precisa reagir ao mouse ou a luz, use 3D em tempo real (`references/3d-leve.md`).

## Parâmetros (no HTML da seção `.giro`)
| Atributo | Padrão | Efeito |
|---|---|---|
| `data-quadros` | 36 | quantidade de arquivos; precisa bater com o que existe |
| `data-caminho` | `img/giro/{n}.webp` | `{n}` vira `00`, `01`... |
| `data-curva` | `linear` | `linear` (volta completa), `vaivem` (gira 27% e volta, como a OLEA), `suave` |

CSS: altura da seção (`400vh`, 900vh na OLEA) = duração do giro; canvas quadrado de `47vw` no desktop e `120vw` no celular (medido na OLEA, origem 900×900).

## Armadilhas
- **Contagem errada**: `data-quadros` diferente do número de arquivos deixa quadros em branco. O módulo desenha o quadro carregado mais próximo, mas o giro fica "travado".
- **Peso**: 48 quadros 900×900 em webp q≈80 = 1,2 MB na OLEA. Passe de ~2 MB e use 36 quadros ou 700 px.
- **Primeiro quadro**: o `<img class="giro-poster">` é o quadro 00; ele aparece antes do JS e com `prefers-reduced-motion`. Mantenha o `alt`.
- **Sticky quebrado**: nenhum ancestral do `.giro` pode ter `overflow: hidden/auto`.
- Quadros são carregados depois do primeiro; em rede lenta o giro começa "áspero" e melhora. Não carregue tudo antes de mostrar a página.
- Para o giro acontecer só em parte da rolagem (texto antes e depois), use `aoAtualizar` ou a curva `vaivem` e monte a timeline à parte (veja o módulo 02).

## Exemplo
`exemplo/`: disco terracota de 36 quadros (procedural, nosso). `npm run build && node servir.mjs`.
