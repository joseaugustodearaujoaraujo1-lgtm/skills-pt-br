# 07 · Elemento 3D em Three.js

Base da etapa 3 do [pipeline 3D](../../../references/pipeline-3d.md): o elemento ultrarrealista feito **só com código Three.js**, com menos de 200 KB.

## Quando usar
Sempre que a experiência tem um elemento 3D. Comece aqui **depois** de o usuário aprovar as imagens molde e o molde no Blender (`estado-3d.mjs ... exigir --etapa threejs`).

## O que já vem pronto (`modulo.js`)
| Peça | Para quê |
|---|---|
| `iniciarElemento(canvas, { criar, fundo, exposicao, sombra })` | renderer com antialias, tone mapping AgX (ou ACES), sRGB, ambiente de estúdio `RoomEnvironment` gerado em código, sombra de contato, câmera de 85 mm, render sob demanda, arrastar com inércia, setas, giro automático só nos primeiros 7 s, pausa fora da tela, `prefers-reduced-motion` |
| `?vista=frente\|lado\|tres-quartos\|costas\|topo` | mesmas vistas e enquadramento de `scripts/blender/vistas.py`, para comparar as etapas |
| `?captura=1` | sem animação, fundo neutro opcional; usado por `capturar-vistas-three.mjs` |
| `revolucao(pontos, { chanfro })` | perfil de revolução com cantos chanfrados (nada de aresta viva) |
| `texturaEscovada({ circular })` | mapa de rugosidade de metal escovado, gerado em código |
| `sombraDeContato(raio)` | sombra suave em canvas, sem imagem |
| `el.poster()` / `el.info()` | pôster do próprio render (plano B, entra nos 200 KB) e contagem de chamadas e triângulos |

## Como fazer o seu elemento
1. Copie `modulo.js` e `exemplo/src/elemento/` para o projeto (ex.: `src/elemento/`).
2. Reescreva `objeto.js` igual ao molde do Blender: mesmas medidas (em metros), mesmas peças e os mesmos valores de material anotados no `README.md` do objeto. A forma sai de **parâmetros**: perfis com poucos pontos, curvas, laços e instâncias. Não cole vértices exportados do Blender.
3. Microdetalhe (riscos, granulado, gravação) com `CanvasTexture`/`DataTexture` gerados em código ou `onBeforeCompile`.
4. Compare e verifique:
   ```bash
   node <skill>/scripts/capturar-vistas-three.mjs --url http://localhost:3107/ --saida referencias-3d/<obj>/3-threejs/vistas
   node <skill>/scripts/comparar-vistas.mjs --pastas referencias-3d/<obj>/1-molde,referencias-3d/<obj>/2-blender/vistas,referencias-3d/<obj>/3-threejs/vistas --saida referencias-3d/<obj>/comparacao.png
   node <skill>/scripts/verificar-3d.mjs src/elemento --poster public/poster-elemento.webp
   ```
5. Mostre ao usuário e peça aprovação.

## Exemplo
```bash
cd starters/modulos && npm install            # uma vez (esbuild, three)
cd 07-elemento-threejs/exemplo && npm run build && npm run serve   # http://localhost:3107/
```
O exemplo (peça de aço escovado com cúpula de cristal) é uma **base técnica**, não um elemento aprovado: ele mostra o encanamento, não o teto de realismo.

## Medido (2026-11-26)
- `verificar-3d.mjs` sobre `modulo.js` + `exemplo/src`: **12,0 KB**, 0 FAIL.
- A biblioteca `three` 0.187, minificada no pacote do exemplo, fica em ~740 KB sem compressão (~190 KB gzip). Ela não entra nos 200 KB do elemento, mas pesa no site: carregue o 3D depois do conteúdo principal (`import()`).
- Vistas capturadas no Chrome headless sem GPU (renderizador de software): transmissão do cristal e reflexos saem mais pobres que com GPU real.

## Armadilhas
- `transmission` (vidro) renderiza a cena duas vezes: use em poucas peças.
- Não use `TextureLoader`, `GLTFLoader` nem `RGBELoader`: o verificador reprova.
- Objeto achatado fica pequeno no quadro das vistas (o enquadramento é pela esfera que o envolve, igual no Blender). No site, ajuste a câmera à composição; nas vistas, mantenha o padrão.
