# Imagens a gerar (MÓ 01)

O site já funciona sem elas: o produto é o modelo 3D em código. Abaixo, as essenciais, com placeholder no lugar ou listadas pela skill (`aprovacoes.md`, "sem usuário", item 4).

## 1. Foto "na mão" (essencial: prova de escala na seção da lista)
- **Arquivo:** `public/img/moedor-na-mao.webp` (hoje `public/img/moedor-na-mao.svg` é o placeholder; troque o `src` no `index.html`)
- **Formato:** WebP, 1600 × 2000 px (4:5), qualidade 75, até ~180 KB; `alt` já escrito no HTML.
- **Prompt:**
```
/4k /ultra-realistic /macro-100mm /studio-lighting /sharp-focus /4:5 /no-text /no-watermark
SUBJECT: an adult hand holding a slim walnut pepper mill (20 cm tall, 5.8 cm diameter, cylindrical body with a gentle waist, domed walnut cap, small knurled stainless steel finial, brushed steel base ring with 8 small notches), grinding black pepper over a pale ash cutting board
SCENE: warm ivory linen background (#F4EFE8), a small heap of medium-coarse ground pepper on the board, a few whole peppercorns
LIGHT: soft window light from the left, gentle shadow, warm 4000K
STYLE: quiet editorial product photography, natural skin, no jewelry
NEGATIVE: no text, no logo, no brand, no chef uniform, no flying particles, no splashes, no extra objects
```

## 2. Molde ultrarrealista em 4 vistas (para o portão de igualdade contra um molde fotográfico)
- **Arquivo:** `referencias-3d/moedor/molde-ia-4-vistas.png`
- **Formato:** PNG, 4096 × 1024 px (4 vistas lado a lado), fundo branco liso.
- **Prompt (Modelo A de `prompts-3d.md`):**
```
/8k /ultra-realistic /macro-100mm /studio-lighting /ray-traced /sharp-focus /pure-background /4:1 /no-text /no-watermark /no-hands
SUBJECT: walnut and stainless steel pepper mill, 20 cm tall, 5.8 cm diameter
SHEET: one reference sheet with FOUR views of the same object, evenly spaced on a pure white background: front, side (profile), three-quarter from 20 degrees above, and back, identical scale and lighting
DETAIL: oiled solid walnut body (straight fine grain) with a gentle waist and one thin dark groove 1.4 cm above the base; domed walnut cap separated by a hairline joint; knurled stainless finial with 24 ridges; brushed stainless base ring with 8 evenly spaced vertical notches; one small steel index mark on the body
LIGHT: high-key product studio, two overhead softboxes, two vertical strip lights, one warm 2700K accent spot, white bounce card
MATERIAL: walnut satin clearcoat (roughness ~0.5), brushed steel (anisotropic, roughness ~0.2)
NEGATIVE: no text, no logo, no extra objects, no blur, no cartoon, no changing proportions between views
```

## 3. Vídeo giratório e vista explodida (referência de aparência e movimento)
- **Arquivo:** `referencias-3d/moedor/molde-ia-giro.mp4`
- **Formato:** MP4 H.264, 1080 × 1080, 24 fps, 10 s, laço perfeito.
- **Prompt (Modelo B de `prompts-3d.md`):**
```
/8k /ultra-realistic /macro-100mm /studio-lighting /ray-traced /sharp-focus /locked-camera /turntable-360 /seamless-loop /pure-background /1:1 /no-text /no-watermark /no-hands
FORMAT: 1:1 square, 24 fps, 10 seconds, last frame identical to first
SUBJECT: exactly ONE walnut and stainless steel pepper mill (same object as the 4-view sheet)
MOTION: 0-4 s pure 360-degree turntable rotation; 4-7 s the mill separates vertically along its axis into six parts (finial up, cap up, steel spindle revealed, body stays, ceramic conical burr down, steel ring down); 7-10 s parts come back together, ending identical to the first frame
ANGLE: camera 12 degrees above the base, looking slightly down
LIGHT: high-key studio, two softboxes, two strip lights, warm 2700K accent spot
BACKGROUND: pure seamless warm ivory #F4EFE8, soft contact shadow only
NEGATIVE: no text, no watermark, no hands, no extra objects, no morphing, no changing proportions, no camera shake
```

## Não essenciais
Nenhuma outra imagem foi usada: o hero e "Por dentro" são o 3D (ou os quadros renderizados dele).
