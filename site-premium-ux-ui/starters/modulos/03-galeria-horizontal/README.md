# 03 · Galeria horizontal

## Quando usar
Uma sequência de peças (fotos, depoimentos, produtos, palavras gigantes) que o visitante percorre de lado, ritmando a página. Para 5 a 10 itens. Mais que isso, use grade.

## Como funciona (medido na POLPA e na BRUMA)
- **Desktop (≥ 861 px)**: ScrollTrigger com `pin: true`, `scrub: 1` e `end: '+=' + dist`, onde `dist = trilho.scrollWidth − innerWidth`. O trilho anda `x: -dist`. `invalidateOnRefresh: true` recalcula quando as imagens terminam de carregar ou a janela muda.
- **Celular**: sem pin. `overflow-x: auto` com `scroll-snap-type: x mandatory` e cada passo com `scroll-snap-align: center` (78vw). Arraste nativo, sem JS.
- BRUMA (notícias): variante sem pin, com arraste do mouse (multiplicador 1,3, `duration .6`, `power3.out`, limite = largura do trilho − lista − 6vw) e teclas ← →. Etiqueta "arraste" segue o mouse (veja módulo 06).
- Paralaxe por passo com `containerAnimation` (POLPA: palavras ±40° e ±30%; para fotos use ±12° e ±8%).

## Parâmetros
`galeriaHorizontal(secao, { suavizar = 1, voa = true })`. CSS: largura do passo `min(38vw, 520px)`, espaço `4vw`, passos pares descem `12vh`.

## Armadilhas
- Pin exige que os ancestrais não tenham `overflow` e que a janela tenha altura (`100vh`).
- Imagens sem `width/height` fazem o `scrollWidth` mudar depois do cálculo: sempre declare o tamanho (ou use `invalidateOnRefresh`, já ligado).
- Só um `pin` com `containerAnimation` por vez; não coloque outro trecho fixo dentro.
- Teclado: o trilho vira só rolagem vertical no desktop; links dentro dos passos continuam focáveis. Se os itens forem só decorativos, `aria-hidden`; se forem conteúdo, mantenha `<ul>`/`<figure>`.
- Sem scroll horizontal da página (medido 0): o trilho deve ficar dentro da `.galeria-h-janela` com `overflow: hidden`.

## Exemplo
`exemplo/`: seis peças abstratas (nossas).
