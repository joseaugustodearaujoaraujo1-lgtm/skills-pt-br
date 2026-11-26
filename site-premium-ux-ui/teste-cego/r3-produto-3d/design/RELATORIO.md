# Relatório — MÓ 01 (teste cego, rodada 3: produto físico com 3D)

Site: http://localhost:3203/ (`node servir.mjs 3203`). Hero + 2 seções (Por dentro, Regulagem com a lista). Decisões sem usuário em `design/DECISOES.md`; direção em `design/DIRECAO.md`.

## Portão automático (`scripts/verificar-site.mjs --lighthouse`)
**APROVADO · 0 FAIL · 1 WARN** (poucas imagens: o produto é o 3D; a única foto essencial está em `IMAGENS.md`).
Primeira rodada: 1 FAIL (rótulos de cota invisíveis com movimento reduzido) e WARN de texto < 12 px (números do anel, 9 px) e de alvo de toque (link "Início" do rodapé). Corrigidos.

| Lighthouse | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| desktop | 100 | 100 | 100 | 100 | 0,5 s | 0 ms | 0 |
| celular | 99 | 100 | 100 | 100 | 2,3 s | 60 ms | 0 |

Atenção: o Lighthouse e o verificador rodam aqui sem GPU (SwiftShader), então mediram o **plano B** (quadros renderizados), não o WebGL ao vivo.

## 3D
- Geometria real em three.js (`src/moedor.js`): 6 peças, 19 draw calls, 25,8 mil triângulos; `MeshPhysicalMaterial` (clearcoat, anisotropia, sheen), textura procedural de nogueira, estúdio HDR em código via PMREM, ACES, sombra de contato.
- Carga: pôster (quadro 0 da própria cena, 15 KB) é o LCP; o pedaço `cena3d` (three.js + moedor, 139 KB gzip) só baixa com a página ociosa (~2,6 s após o load) ou na 1ª interação. Não liga com `saveData`, memória < 4 GB, < 4 núcleos ou GPU por software; aí usa 24 quadros WebP (428 KB, carregados depois da entrada). Render sob demanda, giro automático só nos primeiros 7 s, pausa fora da tela e com a aba escondida.
- WebGL ao vivo testado à força (`?gpu=1`, SwiftShader): liga, gira, abre com a rolagem e desenha as cotas na borda de cada peça; sem erros de página.
- Molde: folha de 4 vistas + topo, base e explodida em `referencias-3d/moedor/`. Portão de igualdade: IoU 1,000, razão 0 %, 6 = 6 partes (garantido por construção: molde e site usam o mesmo código).
- Vídeo-prévia: `design/previa-site.mp4` (protótipo gravado, H.264).

## Rubrica (autoavaliação, com evidência; o juiz não foi lançado, por pedido)
| Critério | Nota | Evidência |
|---|---|---|
| Design (40 %) | 7,5 | `juiz/folha.jpg`: um protagonista por tela, escala 9,5 rem × corpo 1,05 rem, 1 acento (sálvia), cotas em DM Mono, seções irmãs com escala e recuo diferentes. Fraco: anel da regulagem em SVG chapado ao lado de um 3D realista. |
| Usabilidade (30 %) | 8 | barra fixa com ação principal em todas as telas, alvos ≥ 44 px, foco visível, movimento reduzido mostra o estado final, Lighthouse a11y 100. |
| Criatividade (20 %) | 7,5 | vista explodida com cotas visível parada (D03–D05), régua de 20 cm no hero, anel clique a clique; regra "só no eixo" cumprida. Gesto do hero é estático (régua). |
| Conteúdo (10 %) | 6,5 | texto concreto (materiais, sulcos, usos por regulagem), sem inventar prova; mas medidas e materiais são do conceito, sem preço, prazo nem foto real. |

## Plataformas usadas
Split Text (reactbits.dev, MIT + Commons Clause) reescrito em CSS no hero e com GSAP SplitText nos títulos; Noise (reactbits.dev) em CSS; Spinning counter e Success check (transitions.dev, core MIT) reescritos com GSAP/CSS. three.js (MIT), GSAP (licença padrão), Lenis (MIT). Fontes OFL locais.

## Pendências antes de publicar
Confirmar produto, nome, medidas e materiais; gerar a foto "na mão" e o molde por IA (`IMAGENS.md`) e refazer a igualdade contra ele; ligar o formulário a um serviço de lista.

## Não testado
GPU real (o 3D ao vivo só rodou em SwiftShader forçado), celular real, redes lentas, Safari e Firefox, leitor de tela, navegação completa por teclado, A/B de TBT com e sem 3D numa máquina com GPU.
