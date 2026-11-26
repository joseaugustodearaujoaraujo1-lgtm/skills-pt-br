# Prompts de referência para componentes 3D (imagem e vídeo)

Regra da skill: **todo elemento 3D segue [pipeline-3d.md](pipeline-3d.md)**: referências do usuário → imagens molde aprovadas → molde no Blender aprovado → elemento só em Three.js (< 200 KB) aprovado. Esta página dá os prompts do molde e o fluxo da pergunta. Depois do 3D, sugira sempre o scroll animado ([scroll-avancado.md](scroll-avancado.md)).

## A pergunta (sempre que o projeto tiver 3D)
Ofereça duas opções (mais "Outro" para texto livre):
1. **"Eu gero e você me passa o prompt"**: entrego o prompt abaixo preenchido (imagem e/ou vídeo); o usuário gera na ferramenta dele e salva em `referencias-3d/<objeto>/`.
2. **"Você mesmo faz a referência"**: eu produzo uma imagem detalhada por vistas (diagrama, render de perfil, de cima, de baixo) ou um vídeo girando; se houver geração paga, peço autorização antes (custo).

**Sempre sugira também um elemento 3D** do tema (`opcoes.mjs` já traz `sugestao3d`), feito pelo pipeline: só Three.js, < 200 KB, pôster + WebGL carregado tarde, plano B sem GPU.

## Comandos de barra (linhas no começo do prompt)
As linhas que começam com `/` são **instruções de configuração no topo do prompt** para empurrar o resultado ao máximo de qualidade e controle. Não são comandos oficiais de todo gerador: se a ferramenta tiver campos próprios (proporção, duração, resolução), preencha-os com o mesmo valor; senão, deixe as linhas no prompt.

| Comando | Para que serve |
|---|---|
| `/8k` ou `/4k` | resolução e nitidez máximas |
| `/ultra-realistic` | fotorrealismo, material e luz físicos |
| `/macro-100mm` | lente macro, detalhe de superfície |
| `/studio-lighting` | luz de estúdio de produto (softboxes, faixas, contraluz) |
| `/ray-traced` | reflexos e refrações corretos (vidro, metal, gema) |
| `/sharp-focus` | tudo nítido, sem desfoque de profundidade |
| `/seamless-loop` | primeira e última imagem iguais (vídeo) |
| `/turntable-360` | giro constante de 360° em torno do eixo vertical (vídeo) |
| `/locked-camera` | câmera fixa, sem zoom nem corte |
| `/pure-background` | fundo liso, sem chão, sombra ou objetos |
| `/1:1` `/16:9` `/9:16` | proporção |
| `/no-text` `/no-watermark` `/no-hands` | negativos (ver também a linha NEGATIVE) |

## Modelo A — imagem detalhada com várias vistas (folha de referência)
```
/8k
/ultra-realistic
/macro-100mm
/studio-lighting
/ray-traced
/sharp-focus
/pure-background
/1:1
/no-text /no-watermark /no-hands

SUBJECT: <OBJETO>, <material, cor, acabamento, tamanho relativo>
SHEET: one reference sheet with FIVE views of the same object, evenly spaced on a neutral light-grey background: front, side (profile), three-quarter (45 degrees), back and top (90 degrees), identical scale, identical camera height and identical lighting
DETAIL: <partes e proporções que importam: ex. "8 faces principais", "alça com 3 dobras", "tampa rosqueada com 12 sulcos">
LIGHT: high-key product studio, two overhead softboxes, two vertical strip lights, one warm accent spot, white bounce card
MATERIAL: <índice de refração, rugosidade, reflexo, translucidez>
NEGATIVE: no text, no watermark, no extra objects, no blur, no cartoon, no distortion, no changing proportions between views
```

## Modelo B — vídeo girando (referência de aparência e movimento)
```
/8k
/ultra-realistic
/macro-100mm
/studio-lighting
/ray-traced
/sharp-focus
/locked-camera
/turntable-360
/seamless-loop
/pure-background
/1:1
/no-text /no-watermark /no-hands

FORMAT: 1:1 square, 4K, 24 fps, 10 seconds, last frame identical to first
SUBJECT: exactly ONE <OBJETO>, <material e detalhes>
MOTION: pure 360-degree turntable rotation around the vertical axis, constant angular speed, one revolution in 10 seconds, no wobble, no tilt change
ANGLE: camera <25> degrees above the base, looking slightly down
LIGHT: high-key studio, two softboxes, two strip lights, warm 2700K accent spot
BACKGROUND: pure seamless white, no floor, no shadow, no reflection
MATERIAL: <propriedades>
STYLE: ultra-photorealistic, tack-sharp everywhere
NEGATIVE: no text, no watermark, no hands, no extra objects, no morphing, no changing proportions, no camera shake

<Um parágrafo em prosa descrevendo o objeto, o giro e como a luz percorre as superfícies.>
```
Exemplo completo e testado: `~/Documents/acervos-design/teste-skill-lume/referencias-3d/diamante/prompt-video-diamante.md` (diamante em 3 vistas: 3/4, de baixo e de cima).

## Modelo C — close de material (uma imagem por material importante)
```
/8k
/ultra-realistic
/macro-100mm
/studio-lighting
/ray-traced
/sharp-focus
/1:1
/no-text /no-watermark /no-hands

SUBJECT: extreme close-up of the <PEÇA> of the same <OBJETO> shown in the reference sheet
SURFACE: <acabamento: brushed steel with fine circular grain, micro-scratches, slight fingerprint haze...>
EDGES: <chanfros e raios das bordas>
LIGHT: same studio lighting as the reference sheet
NEGATIVE: no text, no watermark, no different object, no stylization
```
Salve como `1-molde/detalhe-<peca>.png`. Se o gerador fizer uma folha única, recorte cada vista em `1-molde/<vista>.png` (`frente`, `lado`, `tres-quartos`, `costas`, `topo`). As imagens molde só valem com as vistas e os detalhes **do mesmo objeto**: confira proporção e número de partes entre elas antes de mostrar ao usuário.

## Depois de receber a referência
1. Salve em `referencias-3d/<objeto>/` (imagens e vídeo) e extraia quadros (`ffmpeg -i video.mp4 -vf fps=2 quadro-%02d.png`).
2. Meça proporções e conte as partes (facetas, sulcos, dobras); o diagrama manda na **estrutura**, o vídeo manda na **aparência**.
3. Siga [pipeline-3d.md](pipeline-3d.md): imagens molde aprovadas → Blender igual a elas → elemento em Three.js igual ao Blender, comparando lado a lado em cada etapa (`comparar-vistas.mjs`).
4. Direitos: o vídeo ou a imagem gerados são referência interna; o 3D do site é geometria própria.
