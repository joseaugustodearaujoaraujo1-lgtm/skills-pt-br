# Diamante (lapidação brilhante redonda): referências, molde e portão de igualdade

## Referências (sem usuário: "procure você")
O objeto é um padrão da gemologia, não um produto de marca: não há marca de terceiros a evitar.
- Proporções "ideais" de Marcel Tolkowsky (1919, domínio público): mesa ~53–57%, coroa 34,5°, pavilhão 40,75°, profundidade do pavilhão ~43,1%, profundidade total ~59–61%. Fonte de consulta: https://en.wikipedia.org/wiki/Diamond_cut (CC BY-SA, só para os números).
- Estrutura de facetas da brilhante redonda: 57 facetas = coroa 33 (mesa 1 + estrelas 8 + coroa principal 8 + metades superiores 16) + pavilhão 24 (principais 8 + metades inferiores 16), sem culaça. Mesma fonte.
- Nenhuma imagem de terceiros foi copiada; o modelo foi feito só a partir dos números.

## Molde
Sem gerador de imagem nesta sessão, o molde é o próprio modelo (`aprovacoes.md`, "Sem usuário"): `src/gema.js` (planos das facetas + ray tracing no fragment shader), renderizado em 4 vistas por `ferramentas/molde.mjs` (Playwright + SwiftShader).
- `molde-frente.png`, `molde-tres-quartos.png`, `molde-topo.png`, `molde-base.png` e a folha `molde-4-vistas.jpg`.
- Aprovado por mim (sem usuário), conferindo com as referências: vista de topo mostra a estrela de 8 pontas e as 16 metades; base mostra as 8 principais até a culaça.
- Para o molde ultrarrealista gerado por IA e o vídeo giratório, ver `IMAGENS.md` (prompts prontos).

## Portão de igualdade (modelo x referência)
| Item | Referência | Modelo | Diferença | Resultado |
|---|---|---|---|---|
| Facetas | 57 (33 + 24) | 57 (1+8+8+16 / 8+16) + cintura em 32 planos | 0 | ok |
| Ângulo da coroa | 34,5° | 34,5° (exato, por construção) | 0 | ok |
| Ângulo do pavilhão | 40,75° | 40,75° | 0 | ok |
| Mesa | 53–57% | 57% (canto a canto) | dentro da faixa | ok |
| Profundidade do pavilhão | 43,1% | 43,1% | 0 | ok |
| Profundidade total (geometria) | 59–61% | 60,9% (coroa 14,8% + cintura 3% + pavilhão 43,1%) | dentro da faixa | ok |
| Profundidade total (medida no render de frente, alfa) | — | 62,6% (243/388 px) | +1,7 p.p. sobre a geometria, efeito da perspectiva (câmera a 7,2 raios) | registrado |
| Silhueta de topo x círculo ideal (IoU) | 100% | **99,65%** | 0,35% | ok (≥ 95%) |

Não medido: diferença de cor contra foto (não há foto de referência própria; o material é físico: IOR 2,417, dispersão ±0,045, Fresnel).

## No site
- WebGL2 puro, sem three.js: `js/gema-*.js` ≈ 6,7 KB (sem gzip), baixado só ao ligar (depois da entrada, com a página ociosa, ou no primeiro toque/tecla).
- Pôster do hero (`img/gema/poster.webp`, 18 KB) e de perfil (`perfil.webp`, 16 KB) renderizados da própria cena.
- Sem GPU (SwiftShader/llvmpipe), pouca memória ou economia de dados: fica o pôster e, ao rolar, 16 quadros pré-renderizados da própria cena (`q-00..15.webp`, ~200 KB, baixados só na primeira rolagem).
- Para ver o 3D ao vivo num navegador sem GPU (teste): `http://localhost:3202/?3d=forcar`.
- Limite honesto: a regra −1 pede three.js/R3F com PBR e HDRI; aqui foi usado ray tracing próprio em WebGL2 (caminho do "Diamante com ray tracing" do `3d-leve.md`), com ambiente procedural de uma luz só, sem sombra de contato.
