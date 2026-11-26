# Módulos reutilizáveis (starters/modulos)

Seis peças que se repetem nos nossos sites de galeria, extraídas com os números medidos neles. Código reescrito a partir dos nossos sites (BRUMA, OLEA, POLPA, TAINÁ); nada vem de sites de terceiros.

| Pasta | Módulo | Medido em |
|---|---|---|
| `01-giro-3d-quadros` | giro de objeto 3D por quadros, escolhidos pela rolagem | OLEA (48 quadros), BRUMA (voo do hero) |
| `02-trecho-fixo-timeline` | trecho fixo (sticky) com timeline GSAP presa à rolagem | BRUMA (hero 400vh, palco do encanto 896vh) |
| `03-galeria-horizontal` | trilho horizontal fixado (desktop) e faixa com snap (celular) | POLPA (momentos), BRUMA (notícias) |
| `04-meio-tom` | foto em barras verticais, usada como máscara CSS | BRUMA (`cena/preparar.py`) |
| `05-painel-vidro` | painel de vidro (backdrop-filter) | OLEA, GQ Lab, BRUMA, Terminal |
| `06-cursor-customizado` | ponto + anel que seguem o mouse, com rótulo | BRUMA (etiqueta "arraste"), TAINÁ |

Cada pasta tem: `README.md` (quando usar, parâmetros, armadilhas), `modulo.html`, `modulo.css`, `modulo.js` e `exemplo/` (página mínima que roda).

## Como usar um módulo num projeto
1. Copie `modulo.css` e `modulo.js` para `src/` (ou importe-os) e cole o trecho de `modulo.html` na página.
2. Ajuste pelos `data-*` do HTML e pelas variáveis CSS; o JS não precisa mudar.
3. Dependências: `gsap` (e `lenis` se o projeto já usa). O módulo 4 e o 5 não dependem de GSAP.
4. Rode `node ../../scripts/verificar-site.mjs <url>`: 0 FAIL.

## Como rodar os exemplos
```
npm install                       # uma vez, nesta pasta
cd 01-giro-3d-quadros/exemplo
npm run build                     # gera public/app.js e app.css
node servir.mjs                   # http://localhost:3100/
```
Teste de todos de uma vez (constrói, serve e roda o `verificar-site.mjs` em cada um): `node testar-todos.mjs` (precisa de `PLAYWRIGHT_CORE`; usa `/opt/node-tools/node_modules/playwright-core` se existir). Resultado esperado: `0 FAIL` nos seis. Os WARN dos exemplos (poucas imagens, pouco movimento) vêm de serem páginas mínimas.

Os exemplos importam `../../modulo.js` e `../../modulo.css`; `_comum.css` é só a base dos exemplos, não faz parte dos módulos.

## Fora deste lote
Cookies, botão de som e pré-carregamento: ver `ROADMAP`/`STATUS-SKILL.md` (só se sobrar tempo). Referência de código nos sites: `galeria/05-bruma/src/main.js` (cookies e som).
