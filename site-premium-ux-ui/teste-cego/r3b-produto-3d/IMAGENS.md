# Imagens a gerar (essenciais)

O site já usa renders da própria cena 3D (quadros, perfil, vistas). As imagens abaixo estão no site como **placeholder** (desenhado no tamanho, proporção e luz finais, sem texto à vista) ou servem às aprovações do 3D.

## 1. Foto de uso: a Fervo no fogão (essencial, placeholder no site)
- **Arquivo:** `public/img/uso-fogao.webp` (marcado no HTML como `data-imagem="uso-fogao.webp"`, elemento `.uso` na seção Ficha)
- **Formato:** WebP, 1200 × 900 px (4:3), qualidade 80, ≤ 140 KB; trocar o `div.uso` por `<img width="1200" height="900" loading="lazy" alt="A Fervo 3 na boca do fogão, em chama baixa, vista de lado">`
- **Prompt:**
```
/4k /ultra-realistic /studio-lighting /sharp-focus /4:3 /no-text /no-watermark /no-hands
SUBJECT: a 12-faceted brushed stainless steel stovetop moka pot (hourglass body, flared upper chamber with a V spout, black bakelite "7"-shaped handle, small black knob on the lid), NO logo, NO brand
SCENE: on the black cast-iron grate of a gas stove, low warm flame under it, side view at the height of the pot, dark warm kitchen background softly out of focus
LIGHT: low warm light from the flame below plus one soft window light from the left; brushed rings visible on the steel
COLOR: warm charcoal and amber, steel neutral; matches an ivory #F4EFE8 / sage #6B7F6E website
NEGATIVE: no text, no logo, no steam clouds, no coffee beans, no cups, no people, no blue glow
```

## 2. Molde ultrarrealista em 4 vistas (aprovação do 3D)
- **Arquivo:** `referencias-3d/cafeteira/molde-ia-4-vistas.png`
- **Formato:** PNG, 2048 × 2048 (1:1)
- **Prompt:** (modelo A de `references/prompts-3d.md`)
```
/8k /ultra-realistic /macro-100mm /studio-lighting /ray-traced /sharp-focus /pure-background /1:1 /no-text /no-watermark /no-hands
SUBJECT: stovetop moka pot "Fervo 3", brushed stainless steel 18/10, 12 flat facets, hourglass silhouette, 17.5 cm tall, 10 cm across, black bakelite handle and lid knob, no logo
SHEET: one reference sheet with FOUR views of the same object, evenly spaced on a pure white background: front, side (profile, spout right, handle left), top (90 degrees) and three-quarter, identical scale and lighting
DETAIL: exactly 12 facets on boiler, upper chamber and lid; V spout formed by the front edge; safety valve with hex nut on the boiler; visible thread gap at the waist; hinge at the back of the lid
LIGHT: high-key product studio, two overhead softboxes, two vertical strip lights, white bounce card
MATERIAL: brushed steel with fine horizontal brushing rings, roughness medium-low; glossy black bakelite with clearcoat
NEGATIVE: no text, no watermark, no extra objects, no blur, no cartoon, no octagonal Bialetti shape, no changing proportions between views
```

## 3. Vídeo giratório e vista explodida (aprovação do 3D, opcional)
- **Arquivo:** `referencias-3d/cafeteira/molde-ia-giro.mp4`
- **Formato:** MP4 H.264, 1080 × 1080, 24 fps, 10 s, sem áudio
- **Prompt:** (modelo B de `references/prompts-3d.md`)
```
/8k /ultra-realistic /studio-lighting /ray-traced /locked-camera /turntable-360 /seamless-loop /pure-background /1:1 /no-text /no-watermark /no-hands
FORMAT: 1:1 square, 24 fps, 10 seconds, last frame identical to first
SUBJECT: exactly ONE 12-faceted brushed stainless steel moka pot, black bakelite handle and knob, no logo
MOTION: 360-degree turntable rotation; between second 3 and 7 the parts separate straight up (lid, upper chamber, gasket and filter plate, funnel with ground coffee) and come back together, purely vertical
ANGLE: camera 15 degrees above the base
BACKGROUND: pure seamless warm ivory #F4EFE8, soft contact shadow only
NEGATIVE: no text, no hands, no steam, no extra objects, no morphing, no camera shake
```

## 4. Imagem de compartilhamento (Open Graph)
- **Arquivo:** `public/img/og-fervo.jpg` (já citado no `<meta property="og:image">`)
- **Formato:** JPG, 1200 × 630, ≤ 200 KB
- **Como fazer:** não precisa de IA: capture o hero (`http://localhost:3204/`, 1200 × 630) ou monte o quadro `public/img/quadros/760/24.webp` (vista explodida) sobre marfim `#F4EFE8` com "A água sobe." em Instrument Serif.
