# 06 · Cursor customizado

## Quando usar
Reforçar o gesto de uma seção (arrastar, ver, abrir) em sites com mouse. Quase sempre dispensável em site comum: use quando houver gesto específico (galeria arrastável, vídeo, cartões).

## Como funciona
Ponto (8 px) segue na hora (`quickTo`, 0,05 s); anel (36 px) segue com atraso de **0,3 s, `power3.out`** (mesmo valor da etiqueta "arraste" da BRUMA). Estados:
- link/botão/campo: anel vai a 64 px;
- `data-cursor="Texto"`: anel vira disco de 96 px com o texto;
- `data-cursor="ocultar"`: some (vídeo com controles, mapas, campos de texto longos).
Parâmetro: `iniciarCursor({ atraso, seletorLink })`.

## Armadilhas
- **Só com ponteiro fino** e sem `prefers-reduced-motion` (o módulo não cria nada no toque).
- **Não esconda o cursor nativo.** O anel é acompanhante; esconder quebra acessibilidade e quando o JS falha o site fica sem cursor.
- `mix-blend-mode: difference` vira exceção em fundo sem contraste (cinza médio): defina `--cor-cursor` ou remova o blend no CSS.
- Anel animado por `transform` pelo GSAP: efeitos de clique usam a propriedade `scale` do CSS, não `transform`.
- `z-index: 200`; nada na página deve passar disso.
- Atualize a posição só em `pointermove` (nada de `requestAnimationFrame` próprio por elemento).

## Exemplo
`exemplo/`: três áreas (link, rótulo, ocultar).
