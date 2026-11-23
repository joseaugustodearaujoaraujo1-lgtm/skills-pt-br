# Referências e molde do moedor MÓ 01

## Referências abertas (só forma, material e luz)
| Arquivo | Fonte | Licença | O que se usou | O que NÃO copiar |
|---|---|---|---|---|
| `ref-moedor-madeira.jpg` | [Wikimedia Commons: Wooden manual pepper mill (Philippines)](https://commons.wikimedia.org/wiki/File:Wooden_manual_pepper_mill_(Philippines).jpg), por Obsidian Soul | CC0 | proporção alta e estreita, cabeça em cúpula, porca de aço no topo, junta fina entre cabeça e corpo | o perfil em balaústre (o MÓ é um cilindro com cintura) |
| `ref-mecanismo.jpg` | [Wikimedia Commons: Dreamfarm Ortwo Pepper Grinder Mechanism](https://commons.wikimedia.org/wiki/File:Dreamfarm_Ortwo_Pepper_Grinder_Mechanism.jpg) | CC BY-SA 4.0 | eixo central com mó cônica sulcada e anel de aço em volta | a marca "Dreamfarm" e o desenho do produto (só estudo do mecanismo) |

As duas são referência interna de estudo; nenhuma aparece no site. O MÓ 01 não leva marca de terceiros.

## Molde (gerado pela skill, em código)
Sem gerador de imagem neste ambiente, o molde é o próprio modelo (`src/moedor.js`: `LatheGeometry`, `CylinderGeometry`, `BoxGeometry`, sulcos por deslocamento radial; `MeshPhysicalMaterial` com clearcoat, anisotropia e textura procedural de nogueira; ambiente HDR de estúdio em código com PMREM; tone mapping ACES), renderizado por `ferramentas/gerar-imagens.mjs molde`.

- Folha de 4 vistas na mesma escala: `molde-folha-4-vistas.jpg` (frente, perfil, 3/4, verso).
- Vistas soltas: `molde-frente.png`, `molde-perfil.png`, `molde-tres-quartos.png`, `molde-verso.png`, `molde-topo.png`, `molde-base.png`, `molde-explodida.png`.
- Medidas (cm): altura 20,0; Ø 5,8 (anel); corpo 1,3–15,4 com cintura de Ø 5,0; cabeça 15,5–19,0; porca Ø 1,24, 19,0–20,0.
- Partes: 6 (porca com 24 frisos, cabeça, eixo com rosca, corpo com friso e marca de índice, mó com 12 sulcos, anel com 8 entalhes).
- Versão aprovada: **v2** (v1 tinha aço com cara de plástico e veio ondulado demais). Aprovada pela própria skill, por falta de usuário (ver `design/DECISOES.md`).

## Portão de igualdade (Regra 0)
`node ferramentas/gerar-imagens.mjs igualdade && python3 ferramentas/igualdade.py` renderiza o molde nos estados montado (t = 0) e aberto (t = 1) e compara com o que o site exibe (`public/img/quadros/q00.webp` e `q23.webp`):

| Estado | IoU da silhueta | Razão largura/altura molde × site | Diferença | Partes | Dif. média de cor |
|---|---|---|---|---|---|
| montado | 1,000 | 0,2759 × 0,2759 | 0 % | 6 = 6 | 2,8 / 255 (compressão WebP) |
| aberto | 1,000 | 0,1698 × 0,1698 | 0 % | 6 = 6 | 3,0 / 255 |

Passa (≥ 95 %, ≤ 2 %, partes idênticas). **Limite honesto:** molde e site saem do mesmo código, então a igualdade é garantida por construção; o portão só prova que a compressão e o caminho de exibição não deformam o objeto. A comparação que importaria (contra um molde fotográfico gerado por IA ou contra o produto real) fica para quando houver o molde de `IMAGENS.md`.
