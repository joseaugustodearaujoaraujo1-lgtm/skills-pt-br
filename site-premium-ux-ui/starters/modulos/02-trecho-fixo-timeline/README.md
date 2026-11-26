# 02 · Trecho fixo com timeline presa à rolagem

## Quando usar
Uma cena que "se conta" enquanto o visitante rola, com a página parada no lugar: o hero que aproxima e encolhe, um palco com vários cartões que atravessam, letras que sobem. É a base do estilo cinematográfico.

## Como funciona (medido na BRUMA)
- Seção alta (`height: 400vh`) com um palco `position: sticky; top: 0; height: 100vh`.
- Uma timeline GSAP com `scrollTrigger: { trigger, start: 'top top', end: 'bottom bottom', scrub: true }`. O progresso 0→1 equivale à altura da seção menos uma janela; **a altura da seção é a velocidade da animação**.
- BRUMA: hero 400vh (aproxima até 55%, depois encolhe num cartão de 433 px em 39% do trajeto, `power2.in`), palco do encanto 896vh, FAQ 196vh, rodapé 200vh.
- Dentro da timeline: `ease: 'none'` nos tweens que andam junto com o dedo; easing só nos "momentos".

## Parâmetros (data-* da seção `.trecho`)
| Atributo | Padrão | Efeito |
|---|---|---|
| `data-aproxima-ate` | .55 | fração da rolagem em que a foto para de aproximar e o cartão começa a encolher |
| `data-cartao-px` | 433 | largura final do cartão, em px de um layout de 1440 |
| `data-cartao-celular` | .6 | escala final no celular (<861 px) |
| `data-cartao-duracao` | .39 | duração do encolhimento (fração) |
| `--trecho-altura` (CSS) | 400vh | altura da seção |

Para outra cena: `trechoFixo(secao, (tl, secao, largo) => tl.to(...))` com posições 0 a 1.

## Armadilhas
- `sticky` não funciona se um ancestral tiver `overflow: hidden/auto` (use `overflow-x: clip` no body).
- Mudar a altura muda a velocidade; ao editar a cena, reajuste junto.
- Mobile: mantenha só o essencial (hero fixo e fades simples); a BRUMA desliga paralaxe e arrasto abaixo de 861 px.
- Com Lenis, ligue `lenis.on('scroll', ScrollTrigger.update)` (ver `starters/html/src/main.js`); com `scrub: true` e rolagem nativa não precisa de nada.
- `prefers-reduced-motion`: o módulo não cria a timeline e o CSS remove a altura extra.
- Não anime `width/height/top/left`; só `transform` e `opacity`.

## Exemplo
`exemplo/`: paisagem em camadas (nossa) que aproxima e vira cartão.
