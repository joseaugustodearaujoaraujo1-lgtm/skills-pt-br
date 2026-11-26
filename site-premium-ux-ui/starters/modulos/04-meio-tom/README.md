# 04 · Meio-tom em linhas verticais

## Quando usar
Identidade visual gráfica: lua, paisagem, retrato ou textura em barras verticais, na cor do tema. Funciona como máscara CSS (`mask`), então a imagem herda `currentColor` e o `?tema=` troca a paleta sem gerar arquivo novo. Usado na BRUMA (lua, serras, flores, dissolver entre seções).

## Como funciona (medido na BRUMA, `cena/preparar.py`)
Autocontraste com corte de 1%; a imagem vira células de **8 × 6 px** (`cw` × `rh`); cada célula vira uma barra vertical centrada de largura `round((1 − média)^gama × 8)`; células mais claras que `corte` ou com tinta menor que `piso` ficam vazias.

Valores da lua da BRUMA: `inverter`, `gama 1,6`, `corte ,96`, `piso ,12`. Padrão: `gama 1,15`, `corte ,9`.

## Parâmetros (data-* do `.mt`)
`data-mt-src`, `data-mt-largura` (px de origem, 1200 na lua), `data-mt-gama`, `data-mt-corte`, `data-mt-piso`, `data-mt-contraste`, `data-mt-inverter` (a **tinta vai onde a imagem é clara**; sem `inverter`, vai onde é escura).

Funções: `meioTom(src, opções)` → `{ url, proporcao }`; `dissolver({ deCima, semente })` → URL de máscara com barras de comprimento aleatório (para a passagem foto → cor chapada); `iniciarMeioTom()`.

## Armadilhas
- **Fundo da foto**: com `inverter`, fundo claro vira tinta chapada. Use céu/fundo escuro na fonte, ou não inverta.
- A imagem precisa ser do mesmo domínio (ou com CORS): o canvas não lê imagem cruzada.
- Gerar no navegador custa CPU (1200×1200 ≈ 100 a 200 ms): ótimo para protótipo. **Em produção, gere uma vez e sirva um .webp** (a BRUMA usa Python, ~20 KB por máscara) com `style="--mt: url(img/mt-lua.webp)"`.
- Linhas de 1 a 2 px sofrem em tela de baixa densidade: confira em 390 px e em 1440 px.
- Máscara é só forma: dê `role="img"` e `aria-label` quando a imagem informa algo; `aria-hidden` quando é enfeite.

## Exemplo
`exemplo/`: lua com crateras (nossa), em duas cores e dois conjuntos de parâmetros.
