# Prompts de imagem e vídeo com IA (ultrarrealistas e leves)

Use este guia sempre que o design exigir imagens ou vídeos que a IA deva gerar. O assistente **entrega o prompt estruturado + a descrição da cena**; a geração acontece na ferramenta que o usuário escolher (ou em conector autorizado). Gerar consome créditos: peça confirmação antes de gastar.

## 1. Estrutura do prompt (preencha todos os blocos)

```
[ASSUNTO] O que aparece, com material, cor, escala e estado (novo, usado, aceso).
[CENA] Onde está, o que há ao redor, hora do dia, ambiente.
[CÂMERA] Tipo e lente (ex.: 85 mm macro), abertura (f/2.8), ângulo, distância, altura.
[ILUMINAÇÃO] Fonte, direção, dureza, temperatura de cor (ex.: 5600 K), luzes de recorte (rim light).
[MATERIAIS E TEXTURAS] Metal escovado, vidro, silicone, PCB, ventoinhas, reflexos, micro-riscos, poeira, digitais.
[COR E GRADE] Paleta fechada (ex.: azul-cobalto + grafite + branco-gelo), contraste, grão de filme leve.
[COMPOSIÇÃO] Regra dos terços, espaço negativo para texto, ponto focal, profundidade (primeiro plano, plano médio, fundo).
[PISTAS DE REALISMO] Profundidade de campo real, desfoque de lente, aberração cromática sutil, vinheta suave, reflexos coerentes, sombras de contato.
[FORMATO TÉCNICO] Proporção (16:9, 9:16, 1:1), resolução de geração, fundo (sólido/transparente/gradiente), sem texto.
[ESTILO DE REFERÊNCIA] Fotografia de produto de estúdio / editorial / render fotorrealista.
[NEGATIVO] Evitar: texto, logotipos de marcas reais, marca d'água, mãos deformadas, excesso de brilho, aparência de plástico, ruído, bordas serrilhadas.
```

### Comandos de linha para ultrarrealismo (cole no fim do prompt)

```
photorealistic, ultra-detailed, physically based materials, accurate reflections and refractions,
global illumination, soft contact shadows, subtle film grain, natural depth of field,
shot on full-frame camera, 85mm lens, f/2.8, 8k detail, sharp focus on subject,
no text, no logos, no watermark, no plastic look, no oversaturation
```

> Ajuste a lente à cena: 24–35 mm para ambientes; 50–85 mm para produto; 100 mm macro para detalhes de componentes.

### Segurança jurídica nos prompts

- Não peça "logo da NVIDIA/Intel/AMD" ou marcas de terceiros; use produtos genéricos.
- Não gere pessoas reais identificáveis nem rostos de celebridades; evite *deepfakes*.
- Se aparecerem pessoas, use modelos sintéticos genéricos e verifique os termos da ferramenta quanto a uso comercial.
- Guarde o prompt, a ferramenta, a data e o plano de licença (prova de origem).

## 2. Estrutura do prompt de vídeo

```
[DURAÇÃO E FORMATO] 6 s, 16:9 (ou 9:16), 24 fps, loop sem emenda (primeiro e último quadro compatíveis).
[LINHA DO TEMPO]
  0,0–2,0 s: plano de abertura (o quê, onde, movimento).
  2,0–4,5 s: transição ou revelação (o quê muda).
  4,5–6,0 s: plano final = retorno suave ao quadro inicial (loop) ou pose final estável.
[CÂMERA] Movimento único e suave (dolly-in lento, órbita de 20°, travelling lateral), sem tremor, sem cortes.
[FÍSICA E MOVIMENTO] Peças flutuam e se encaixam com inércia; luzes pulsam em ritmo lento; partículas mínimas.
[ILUMINAÇÃO E COR] Mesma do prompt de imagem; consistência entre quadros.
[CONSISTÊNCIA] Mesmo objeto, mesmos materiais, sem mudanças de forma entre quadros.
[ÁUDIO] Sem áudio (vídeo de fundo).
[NEGATIVO] Texto, logotipos, cortes bruscos, flicker, morphing de formas, mãos, rostos.
```

### Para vídeo controlado por scroll (scrub)

- Movimento **monotônico** (sempre avançando), sem retornos bruscos; o usuário pode rolar para frente e para trás.
- Duração curta (4–8 s) e ritmo uniforme.
- Evite fumaça, líquidos e partículas densas: pesam na compressão e geram *artefatos* ao serem "scrubbed".

## 3. Exemplo completo: onboarding de loja de informática

**Descrição do vídeo:** um gabinete gamer em *dark graphite* flutua no centro de um estúdio minimalista cinza-azulado. A câmera faz um *dolly-in* lento. As peças (placa de vídeo, memória RAM, SSD NVMe, cooler) se separam em vista explodida e se reencaixam no gabinete, que acende em azul-cobalto. Fundo liso com leve gradiente, espaço negativo à direita para texto.

**Prompt:**

```
A single premium PC tower in dark graphite with tempered glass side panel floating in a minimalist
blue-grey studio, exploded view where GPU, RAM modules, NVMe SSD and CPU cooler separate in mid-air
and then smoothly re-assemble inside the case, cobalt-blue LED glow. Slow dolly-in, 24 fps, 6 seconds,
seamless loop, continuous motion, smooth easing, no cuts. Soft key light from upper left 5600K, cool rim
light, accurate reflections on glass and brushed aluminium, micro-scratches, subtle dust, natural depth
of field, shot on 85mm f/2.8, photorealistic, ultra-detailed, physically based materials, subtle film
grain, negative space on the right third for text. Palette: cobalt blue, graphite, ice white.
Negative: text, logos, brand names, watermark, flicker, morphing, plastic look, oversaturation.
```

## 4. Peso máximo e compressão (sem perda perceptível)

**Meta:** vídeo de fundo ≤ ~1,4 MB. Calcule o *bitrate* total: `bitrate_kbps ≈ (1,4 × 8192) / duração_s` (para 6 s ≈ 1.900 kbps no total). Como não há áudio, todo o orçamento vai para o vídeo.

Passos (ffmpeg):

```bash
# 1) Inspecionar o original
ffprobe -v error -show_entries format=duration,size,bit_rate -of default=nw=1 entrada.mp4

# 2) H.264, sem áudio, 720p (ou 1080p se couber), CRF alto, otimizado para web
ffmpeg -i entrada.mp4 -an -vf "scale=-2:720,fps=24" \
  -c:v libx264 -preset veryslow -crf 27 -profile:v high -pix_fmt yuv420p \
  -g 12 -movflags +faststart saida.mp4

# 3) Se passar de 1,4 MB: suba o CRF (28, 29...) OU use limite de taxa em duas passagens
#    (na 1ª passagem use "-f null NUL" no Windows e "-f null /dev/null" no Linux/macOS)
ffmpeg -y -i entrada.mp4 -an -vf "scale=-2:720,fps=24" -c:v libx264 -preset veryslow \
  -b:v 1700k -maxrate 2100k -bufsize 3000k -pass 1 -f null NUL
ffmpeg -i entrada.mp4 -an -vf "scale=-2:720,fps=24" -c:v libx264 -preset veryslow \
  -b:v 1700k -maxrate 2100k -bufsize 3000k -pass 2 -pix_fmt yuv420p -g 12 -movflags +faststart saida.mp4

# 4) Alternativa menor (navegadores modernos): VP9 ou AV1 em WebM
ffmpeg -i entrada.mp4 -an -vf "scale=-2:720,fps=24" -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 saida.webm
ffmpeg -i entrada.mp4 -an -vf "scale=-2:720,fps=24" -c:v libsvtav1 -crf 38 -preset 4 saida-av1.mp4

# 5) Verificar tamanho final (em bytes) e qualidade
ffprobe -v error -show_entries format=size,duration -of default=nw=1 saida.mp4
ffmpeg -i saida.mp4 -i entrada.mp4 -lavfi "[0:v][1:v]ssim" -f null -    # SSIM > 0,95 = ótimo
```

Dicas de qualidade com pouco peso: reduzir **resolução e FPS** antes de aumentar a compressão; fundos lisos e gradientes comprimem muito bem; evite grão intenso (aumenta o peso); `-g 12` ajuda o *scrub* mas custa alguns KB (reduza só se sobrar orçamento).

Imagens: converter para WebP/AVIF:

```bash
ffmpeg -i entrada.png -vf "scale=1600:-2" -c:v libwebp -quality 80 saida.webp
# ou: npx @squoosh/cli --webp auto entrada.png   |  cwebp -q 80 entrada.png -o saida.webp
```

Fornecer sempre um `poster.webp` (primeiro quadro) para carregamento instantâneo.

## 5. Checklist de entrega de mídia

- [ ] Prompt estruturado + descrição da cena entregues.
- [ ] Proporção, duração, loop e peso máximo declarados.
- [ ] Sem marcas de terceiros, pessoas reais ou texto embutido.
- [ ] Vídeo final ≤ meta de peso, medido com `ffprobe`.
- [ ] `poster` e versão `webm`/`mp4` quando fizer sentido.
- [ ] Registro de origem (ferramenta, data, licença).
