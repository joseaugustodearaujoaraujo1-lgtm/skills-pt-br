# Relatório: Fervo 3 (hero + 2 seções)

**Site:** http://localhost:3204/ (`node servir.mjs 3204`, pasta `public/`). **Stack:** HTML + CSS + JS + GSAP (ScrollTrigger, SplitText, Lenis) + three.js só no 3D ao vivo.
**Ideia:** "A água sobe pela Fervo, e a cafeteira se abre peça por peça no caminho dela" (`design/DIRECAO.md`). Decisões sem usuário: `design/DECISOES.md`.

## Verificador (`scripts/verificar-site.mjs --lighthouse`)
**APROVADO: 0 FAIL, 0 WARN** em 1440, 768 e 390 px (`verificacao/relatorio.md`).
| | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| desktop | 100 | 100 | 100 | 100 | 0,5 s | 0 ms | 0,003 |
| celular | 96 | 100 | 100 | 100 | 2,7 s | 60 ms | 0,001 |
Primeira rodada: 1 FAIL (rótulo "arraste para girar" com opacidade 0 em movimento reduzido) e 1 WARN (poucas imagens). Corrigidos: rótulo só existe no modo 3D ao vivo; vistas frente/3/4/topo renderizadas da cena entraram na ficha.

## 3D
- Geometria em código (`src/cena.js`): sólidos facetados de revolução (12 faces), tornos, extrusão com chanfro na alça; PBR (`MeshPhysicalMaterial`) inox escovado por textura procedural, baquelite com verniz, silicone, café moído, placa perfurada por alfa; `RoomEnvironment` + PMREM, ACES, sombra de contato. 23 draw calls, 7,8 mil triângulos.
- **Plano B (sem GPU, o que o verificador vê):** 48 quadros da própria cena (760 e 440 px, 1,1 MB e 0,5 MB, carregados depois do primeiro) trocados pela rolagem + `dados.json` com a posição de cada peça e de cada nível de água por quadro (a linha d'água e a cota em HTML seguem a peça certa).
- **Ao vivo (GPU real ou `?gpu=1`):** `public/cena.js` (≈ 135 KB gzip) carregado 2,6 s depois da entrada, com a página ociosa; render sob demanda, pausa fora da tela; arrastar gira com inércia. Testado com `?gpu=1` (SwiftShader): liga, gira, sem erros.
- Molde = o modelo renderizado em 4 vistas (`referencias-3d/cafeteira/molde-4-vistas.png`); comparação com fotos abertas em `referencias-3d/cafeteira/README.md`. Prévia gravada: `design/previa/previa-site.mp4` (H.264, 11 s).

## Rubrica (autoavaliação; o juiz independente não foi lançado, por pedido)
| Critério | Nota | Evidência |
|---|---|---|
| Design (40%) | 7,5 | Um protagonista por dobra; título 14vw atravessado pela cafeteira; 2 famílias + mono; um acento (sálvia = água). Limite: render limpo demais perto de foto real. |
| Usabilidade (30%) | 7,5 | Barra fixa com seção ativa; no celular, Menu de 44 px e botão fixo no pé (some sobre o formulário); objeto nos 57% de cima e texto fixo na faixa de baixo; formulário com rádios próprios, erro com tremor e confirmação. |
| Criatividade (20%) | 7,5 | Vista explodida vertical ligada à rolagem + linha d'água que sobe de peça em peça + cota que aponta a peça do passo; cotas em tamanho real na ficha. Gesto do hero já visível a 14% (tampa e coletor descolados). |
| Conteúdo (10%) | 7 | Texto concreto do funcionamento real da moka; sem prova inventada; ficha marcada como "em desenvolvimento". Falta foto de uso real (placeholder, `IMAGENS.md`). |

## Componentes das plataformas (reescritos em GSAP/CSS, sem login)
| Componente | Plataforma | Onde | Licença |
|---|---|---|---|
| Split Text (linhas com máscara) | reactbits.dev/text-animations/split-text | h2 das seções e do formulário | MIT + Commons Clause |
| Count Up | reactbits.dev/text-animations/count-up | medidas dos passos (150 ml, 15 g, 0,6 mm) | MIT + Commons Clause |
| Magnet | reactbits.dev/animations/magnet | botões (só com mouse) | MIT + Commons Clause |
| Error state shake | transitions.dev | e-mail inválido (tremor vertical, regra do site) | MIT (core) |
| Success check | transitions.dev | botão "Anotado" | MIT (core) |

Referência de estrutura (pesquisa ao vivo, acervo ausente): Tenztan (https://www.tenztan.in/): cena fixa longa, fundo marfim, rótulos mono em lista técnica, marca gigante no fim.

## Não testado
Celular e tablet reais, rede lenta real, Safari e Firefox, leitor de tela, teclado completo, 3D ao vivo em GPU real (só SwiftShader), juiz independente (`juiz.mjs` bloqueado pelo modo automático do ambiente).
