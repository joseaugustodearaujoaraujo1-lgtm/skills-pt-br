# Réplicas perfeitas

- `PROTOCOLO.md`: prompt-mestre com as regras, o método e as tolerâncias de aceite. Toda sessão lê este primeiro.
- `sites/NN-nome.md`: ficha de cada site, com o original, a nossa marca, a pasta, a porta, o artefato e o que conferir.
- `PROMPTS.md`: prompts prontos para colar numa sessão nova, um site por sessão.

## Ferramentas

Ferramentas usadas para estudar um site original e comparar tela por tela com a nossa versão.
Rodam neste ambiente (Playwright em `/opt/node-tools`, Chromium em `/opt/pw-browsers`).

| Arquivo | Para quê | Uso |
|---|---|---|
| `ferramentas/estudar3.cjs` | Rola o original passo a passo, salva capturas `m-NN.jpg`, `estrutura.json` (caixas de texto e imagem) e `mapa.json` (alturas das seções e elementos fixos) | `LENTO=1 node estudar3.cjs <url> <pasta> <passos> <px/passo> <px inicial>` |
| `ferramentas/telas2.cjs` | Captura a nossa versão com o mesmo passo de rolagem | `ESPERA=4000 node telas2.cjs <url> o <pasta> <telas>` |
| `ferramentas/lado-or.py` | Folha lado a lado: original × nosso | `python3 lado-or.py <pasta-orig> <pasta-nossa> 0,1,2 saida.jpg` |
| `ferramentas/folha-sd.py` | Folha de contato com várias capturas | `python3 folha-sd.py <pasta> m- saida.jpg` |
| `ferramentas/contraste.cjs` | Mede o contraste dos textos | `node contraste.cjs <url>` |
| `ferramentas/alvos.cjs` | Acha alvos de toque menores que 44 px e textos menores que 12 px | `node alvos.cjs <url>` |

`estudos/`: alturas medidas das seções dos originais em 1440×900 (oryzo.ai com 56 691 px; sondaven.com com 33 203 px).

Portão de qualidade: `PLAYWRIGHT_CORE=/opt/node-tools/node_modules/playwright-core node scripts/verificar-site.mjs <url> --espera 4000` precisa dar 0 FAIL.
