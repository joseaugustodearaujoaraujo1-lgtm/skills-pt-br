# 3D leve para sites

## REGRA −1: 3D real e ultrarrealista, molde feito pela skill (atualizada em 2026-11-19)
- **Todo componente 3D do site é 3D de verdade**: geometria em WebGL (three.js/R3F; para **um objeto só**, WebGL2 puro com shader também vale, ver "Objeto único em WebGL puro" abaixo), girável em qualquer ângulo, com material PBR ou shader equivalente (`MeshPhysicalMaterial`: metalness, roughness, clearcoat, transmission para vidro/cristal), iluminação por ambiente (`RoomEnvironment`/HDRI + PMREM), tone mapping ACES/AgX, sombras de contato e antialias. **Proibido** entregar como "3D": PNG recortado, sprite, flip CSS de imagem ou vídeo pré-renderizado sem a cena real.
- **Ultrarrealista**: biselados e chanfros (nada de arestas retas de primitivo), detalhes finos modelados (sulcos, parafusos, índices, gravações), materiais distintos por peça, reflexo coerente com o ambiente e microdetalhe por textura procedural (escovado, granulado). Compare com o molde e corrija até parecer foto.
- **Referências do usuário primeiro:** sempre que o objeto existir, peça ao usuário imagens de referência (fotos, links, prints, vários ângulos). Só dispense se o elemento for inventado (personagem ou objeto de uma história); aí peça descrição ou esboço.
- **A skill gera a imagem-molde ela mesma** a partir dessas referências: use a ferramenta de imagem disponível (ex.: Gemini no navegador do usuário, com a conta dele já logada; anexe as imagens de referência ao prompt), prompt de `prompts-3d.md`, e salve em `referencias-3d/<objeto>/`. Custo, conta nova ou serviço pago continuam pedindo autorização.
- **Portões de aprovação** (`aprovacoes.md`): mostre o molde e pergunte "ficou bom ou precisa alterar?" até aprovar; depois gere o vídeo-prévia do site e pergunte de novo. Sem as duas aprovações, não construa.
- **Caminho padrão: modelar no código** a partir do molde (`LatheGeometry`, `ExtrudeGeometry` com bevel, `TubeGeometry`, CSG simples). Serviço de imagem-para-3D (Meshy, Tripo, Rodin) só com autorização do usuário (custo/login).
- **Pós-processamento sutil** (dá o acabamento de foto): bloom leve nos brilhos, profundidade de campo, grão de filme e aberração cromática mínima (`postprocessing` / `EffectComposer`; desligue tudo no nível de qualidade baixo).
- **Assets pesados comprimidos:** `.glb` com Draco ou Meshopt, texturas em **KTX2** (Basis) e **LOD** (versão simplificada à distância e no celular).
- Plano B obrigatório: pôster renderizado da **própria cena** (não outra imagem) para `prefers-reduced-motion`, sem WebGL ou celular fraco.

## REGRA 0 (vem antes de tudo): molde ultrarrealista, e o 3D é estritamente igual a ele
Antes de modelar **qualquer** elemento 3D, gere um **molde ultrarrealista** do objeto: uma folha com 4 vistas (frente, lado, topo, base) e, se possível, um vídeo giratório de 10 s (Modelo A e B de `prompts-3d.md`, com `/8k /ultra-realistic /ray-traced ...`). O molde é aprovado pelo usuário **antes** de modelar. O elemento 3D do site é então construído **estritamente igual ao molde**: mesma silhueta, proporções, número de partes (facetas, sulcos, dobras), material e luz.

**Portão de igualdade (obrigatório antes de entregar):** renderize o 3D nos mesmos ângulos do molde e compare lado a lado e numericamente: silhueta (IoU) **≥ 95%**, razão largura/altura/profundidade com diferença **≤ 2%**, contagem de partes **idêntica**, diferença média de cor registrada. Se algum item falhar, corrija o 3D (nunca o molde) e repita. Registre a comparação em `referencias-3d/<objeto>/README.md`. Sem molde aprovado, não há 3D.

Quem gera o molde: o usuário (a skill entrega o prompt) **ou** a skill (com a ferramenta de imagem/vídeo disponível, **só com autorização** por causa do custo). Depois do 3D, a skill sempre sugere o **scroll animado** que o conduz ([scroll-avancado.md](scroll-avancado.md)).

## REGRA OBRIGATÓRIA: todo objeto 3D tem uma referência visual detalhada
Antes de modelar **qualquer** objeto 3D (produto, joia, personagem, cena), exija **uma imagem muito detalhada ou um vídeo** de como ele deve ficar. Sem isso, não comece: sem referência a IA inventa forma, proporção e material, e o resultado fica genérico.

**O que conta como referência suficiente**
- Imagem em alta resolução (ou várias) com **mais de uma vista**: frente, lado, topo e um detalhe de material (reflexo, textura, transparência). Ou um **vídeo** do objeto girando (turntable) ou em uso.
- Mostra a **luz e o fundo** pretendidos, para casar o brilho e a cor.
- Tem **medidas ou proporções** (diagrama técnico, ficha do produto, ou medidas anotadas).

**Onde guardar e o que registrar** — `referencias-3d/<objeto>/` no projeto, com um `README.md`: fonte, licença/direitos (só estudo local, ou uso autorizado), vistas disponíveis, medidas, material e o que **não** copiar.

**Como obter, nesta ordem**
1. O usuário fornece imagem/vídeo (melhor caso).
2. Pesquisa no navegador embutido (Wikimedia Commons, fabricante, ficha técnica); anote a fonte.
3. Se nada servir, proponha gerar uma imagem de referência com uma ferramenta de imagem (**com a autorização do usuário**, pois pode ter custo) e deixe o usuário aprovar a imagem **antes** de modelar.

**Como usar** — modele a partir da referência (silhueta e proporções medidas, não de memória); renderize no mesmo ângulo e **compare lado a lado** (e numericamente, se possível, como no teste da lata); só entregue quando silhueta, proporção, material e luz baterem. Registre a comparação.

`montar-brief.mjs --ref3d "objeto=caminho"` grava a referência no brief e **bloqueia** (campo `tridimensional.bloqueio`) se faltar.

Objetivo: cena 3D que carrega rápido, roda a 60 fps em celular médio e cai bem para uma imagem quando não dá. Inspirada em um vídeo analisado em 2026-11-15 (site de tema Minecraft feito com ajuda de IA) e em práticas conhecidas de Three.js. A seção "Origem" separa o que veio do vídeo do que é conhecimento técnico adicional.

## Origem
**Do vídeo (quadros, legendas e transcrição local do áudio com whisper):**
- Cena 3D de blocos (voxels) numa ilha flutuante, 3 cenas ("Bloco a bloco", "Atravesse", "Terra de fogo"), responsiva. Segundo o autor, **a cena inteira pesa ~200 kB**, menos que algumas imagens.
- Por que é leve: **todos os modelos e toda a geometria foram escritos do zero, em código; nada foi criado no Blender**. A IA escreve geometria rápido, acerta cor, e o resultado fica fácil de manipular.
- Método: (1) pedir ao chat uma imagem-base do cenário; (2) para cada elemento (bloco de grama, pedregulho, portal…), achar uma imagem e passar por uma skill de "imagem → 3D" (nome transcrito/legendado como img2threejs, não verificado) que analisa a imagem e gera o elemento; (3) fazer **um elemento de cada vez**, isolado; (4) mandar a imagem-base para a IA montar a cena com os elementos; (5) animações ligadas à rolagem com **GSAP**; (6) um **shader que reage ao cursor** para dar acabamento.

**Caso testado aqui (2026-11-15): lata a partir de uma única foto** — ver seção "Do objeto real ao 3D leve" abaixo.

**Conhecimento técnico acrescentado (não vem do vídeo):** orçamento, instanciamento, remoção de faces escondidas, renderização sob demanda, níveis de qualidade e plano B.

## Por que voxel/low-poly é leve
- Poucos vértices por objeto (um cubo tem 24 vértices e 12 triângulos).
- Texturas minúsculas (16×16 px por bloco) e sem arquivos de modelo (.glb) de megabytes.
- A cena inteira cabe em dados compactos: uma lista de posições e tipos, em kilobytes.
- Sem sombras em tempo real nem materiais caros: o visual "pixelado" é o estilo, não um defeito.

## Orçamento (valores de partida; meça no aparelho real)
| Item | Celular | Desktop |
|---|---|---|
| Chamadas de desenho (draw calls) | ≤ 60 | ≤ 150 |
| Triângulos na tela | ≤ 100 mil | ≤ 400 mil |
| Textura (atlas único) | ≤ 512×512 | ≤ 1024×1024 |
| Peso do código 3D (gzip, sem contar o `three`) | ≤ 60 KB | ≤ 120 KB |
| Resolução de renderização (DPR) | ≤ 1,5 | ≤ 2 |
Confira com `renderer.info.render.calls` e `renderer.info.render.triangles`.

## Receitas

### 1. Blocos instanciados (uma chamada de desenho por tipo de bloco)
```js
import * as THREE from 'three';

const geo = new THREE.BoxGeometry(1, 1, 1);
function criarBlocos(posicoes, material) {
  const malha = new THREE.InstancedMesh(geo, material, posicoes.length);
  const m = new THREE.Matrix4();
  posicoes.forEach(([x, y, z], i) => { m.setPosition(x, y, z); malha.setMatrixAt(i, m); });
  malha.instanceMatrix.needsUpdate = true;
  return malha;
}
```
Uma `InstancedMesh` por tipo de bloco (grama, terra, pedra, madeira): poucas dezenas de chamadas para milhares de blocos.

### 2. Só desenhe o que aparece (ganho típico de 5 a 10×)
```js
const chave = (x, y, z) => `${x},${y},${z}`;
function expostos(mapa) { // mapa: Map<chave, tipo>
  const vizinhos = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
  const saida = [];
  for (const [k, tipo] of mapa) {
    const [x, y, z] = k.split(',').map(Number);
    if (vizinhos.some(([dx, dy, dz]) => !mapa.has(chave(x + dx, y + dy, z + dz)))) saida.push({ x, y, z, tipo });
  }
  return saida;
}
```
Blocos cercados por outros nunca entram na cena.

### 3. Geometria em código, sem Blender
Descreva a cena como dados e gere a malha no carregamento:
- Terreno: laço sobre x/z com altura por função (ruído simples ou tabela), camadas grama → terra → pedra.
- Objetos (casa, portal, árvore): listas de coordenadas por tipo, em um arquivo JSON de poucos KB.
- Peça a IA para escrever o gerador **e** uma página de teste que mostre cada elemento isolado, girando, antes de compor a cena (como no vídeo).

### 4. Texturas de pixel (leves e nítidas)
```js
const tex = new THREE.TextureLoader().load('/atlas.png');
tex.magFilter = THREE.NearestFilter;
tex.minFilter = THREE.NearestFilter;
tex.generateMipmaps = false;
tex.colorSpace = THREE.SRGBColorSpace;
```
Um **atlas único** (todas as texturas em um PNG de até 512×512) evita trocas de textura. Alternativa sem arquivo: desenhar as texturas em `<canvas>` e usar `THREE.CanvasTexture`.

### 5. Iluminação barata
- `MeshLambertMaterial` ou `MeshBasicMaterial` (com cor de vértice para "oclusão" falsa). Evite `MeshStandardMaterial` e sombras em tempo real.
- No máximo 1 luz direcional + 1 ambiente; `scene.fog` para profundidade e para esconder o limite do mundo.
- Para cada "cena" (dia, portal, fogo): troque cor do céu, da névoa e da luz, e não a geometria inteira.

### 6. Renderer econômico
```js
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
```
Estilo pixelado não precisa de antialias. Reduzir o DPR é o maior ganho de desempenho em celular.

### 7. Renderize só quando mudar
```js
let sujo = true;
const pedir = () => { sujo = true; };
renderer.setAnimationLoop(() => { if (!sujo) return; sujo = false; renderer.render(scene, camera); });
// ScrollTrigger, resize e interação chamam pedir()
```
Em React Three Fiber: `frameloop="demand"` e `invalidate()`. Pause também fora da tela (`IntersectionObserver`) e com a aba escondida (`visibilitychange`).

### 8. Câmera guiada pelo scroll (várias cenas na mesma página)
```js
gsap.timeline({ scrollTrigger: { trigger: '#palco', start: 'top top', end: '+=3000', scrub: 1, pin: true, onUpdate: pedir } })
  .to(camera.position, { x: 6, y: 3, z: 8, onUpdate: () => camera.lookAt(alvo) })
  .to(camera.position, { x: -4, y: 2, z: 5, onUpdate: () => camera.lookAt(alvo) });
```
Cada seção do texto é um ponto de passagem da câmera. Descarte (`dispose()`) geometrias e texturas de cenas que já saíram.

### 9. Níveis de qualidade e plano B
- **Baixo** (celular fraco, `navigator.hardwareConcurrency <= 4`, `deviceMemory <= 4`, `pointer: coarse`): DPR 1, menos blocos (distância de render menor), sem partículas, sem névoa animada.
- **Movimento reduzido** (`prefers-reduced-motion`): renderize um quadro fixo; sem câmera animada.
- **Sem WebGL ou falha de carregamento:** troque o canvas por uma imagem (WebP) da cena. Gere essa imagem com uma captura da própria cena.
- Carregue o 3D **depois** do conteúdo principal (`import()` dinâmico) para não prejudicar o LCP.

### 10. Alternativas ainda mais leves ao 3D real
| Técnica | Peso | Quando usar |
|---|---|---|
| Camadas 2D com paralaxe (CSS/GSAP) | muito baixo | profundidade sem WebGL |
| CSS 3D transforms (cubos, cartões inclinados) | muito baixo | objetos simples |
| Shader de gradiente em 1 plano | baixo | fundos vivos |
| Low-poly com sombreamento chapado | baixo a médio | objetos estilizados |
| Modelo .glb comprimido (Draco/meshopt) | médio a alto | só quando o objeto é o produto |

## Do objeto real ao 3D leve (método testado com uma lata, 2026-11-15)
Projeto de referência: `~/Documents/acervos-design/teste-3d-lata` (`src/gerar-textura.mjs`, `src/main.js`; página em `http://localhost:3000/lata-3d/`).

**Passos**
1. **Medir a foto pixel a pixel** (script em Node + ffmpeg, sem dependências): silhueta linha a linha (borda esquerda/direita), onde começa o rótulo, onde fica a base (cintura mais estreita antes do reflexo), cor do metal.
2. **Suavizar a medição**: centro constante e raio por mediana de 7 + média de 9 linhas. Sem isso, o ruído de ±1–2 px vira borda ondulada e logo entortado quando ampliado.
3. **Geometria em código**: sólido de revolução escrito à mão a partir do perfil medido (sem Blender, sem .glb). Aro e tampa com medidas proporcionais a uma lata real (pesquisadas: 473 ml ≈ 66 mm × 157 mm).
4. **Textura "desenrolada" da própria foto**: para cada ângulo φ em volta da lata, amostrar a foto em `x = centro + raio·sen(φ)`. Até ~74° é a foto real; o verso (que a foto não mostra) vira continuação espelhada e depois cor lisa. WebP de 512 px: ~42 KB.
5. **Shader mínimo**: cor da textura **sem iluminar de novo** (a luz já está na foto) + brilho especular que segue o cursor (só aparece enquanto o mouse mexe). Reflexo no chão = a mesma malha espelhada, com opacidade por altura **medida na foto** (100% até ~0,35 raio, depois cai em exponencial).
6. **Câmera igual à da foto**: teleobjetiva (FOV 5°) e elevação medida. Com 20° de FOV a face da frente ampliava 5%; com 6° de elevação o rótulo descia 7 px. A medição mostrou câmera na altura da lata (0,5°).
7. **Comparar com a foto, numericamente**: renderizar no mesmo tamanho, medir sobreposição da silhueta (IoU), diferença média de cor e o deslocamento que melhor alinha o conteúdo. Corrigir a causa e repetir.
8. **Interação 360°**: arrastar com o mouse ou o dedo gira com inércia (velocidade do arrasto, perde ~96% em 1 s); parada por 2,5 s gira sozinha (~0,6 rad/s, desligado com `prefers-reduced-motion`); setas do teclado giram; rolar a página dá uma volta ao longo dela; o brilho especular e uma leve inclinação seguem o cursor. No celular use `touch-action: pan-y` para a rolagem vertical continuar funcionando.
9. **O verso inventado**: a foto só mostra a frente (~148°). O resto é continuação em código: vermelho médio só dos pixels realmente vermelhos da lateral (a média de todos os pixels deixa o verso rosado por causa dos brilhos brancos) e estrelas/gotas desenhadas por um gerador pseudoaleatório de semente fixa. É arte nova, não a do produto: avise o cliente. Uma segunda foto (verso) dispensaria isso.

**Resultado medido**: silhueta 95,2% igual à foto; diferença média de cor 25,6/255 na lata (vista de frente); 4 draw calls; 32,6 mil triângulos; ~4,3 ms por quadro; **página inteira ≈ 198 KB** (código 137 KB gzip, quase todo Three.js; textura 59,6 KB com o verso; HTML 1,1 KB). Com o giro automático ligado ela renderiza continuamente; só fica sem custo se o giro automático for desligado.

**Armadilhas encontradas**
- Comentário `//` dentro de uma linha de GLSL comentou a chave `}` e o shader deixou de compilar (o rótulo sumiu): comentários sempre em linha própria.
- Cache do navegador servindo `app.js` antigo: versionar os arquivos (`app.js?v=N`).
- `<link rel="preload">` de imagem sem `crossorigin="anonymous"` faz o Three.js baixar a textura duas vezes.
- `<img>` escondida com `display:none` ainda baixa; a imagem de reserva só recebe `src` se o WebGL falhar.
- Servidor sem gzip mostra peso falso (o `app.js` sai com 535 KB em vez de 137 KB).

**Limite honesto**: a nitidez fica presa à resolução da foto (aqui a lata tem 139 px de largura). Em telas grandes, use uma foto maior do mesmo produto, ou exiba a lata perto do tamanho original.

## Objeto único em WebGL puro: o diamante (testado em 2026-11-16)
Quando o 3D é **um objeto só** (joia, produto), dispense o Three.js: WebGL2 puro + shader cabe em ~3 KB (o `three` custa ~135 KB gzip). Código de referência: `acervos-design/teste-skill-lume/src/gema3d.js`; página: http://localhost:3000/lume/.

**Fluxo seguindo a regra de referência**
1. Referência detalhada em `referencias-3d/diamante/` (diagrama de facetas, render de perfil, padrão hearts-and-arrows, foto; CC BY, com README de fonte/licença/medidas).
2. Estrutura vinda da referência: **73 facetas** (coroa 33 = mesa + 8 estrelas + 8 bezels + 16 metades superiores; cintura 16; pavilhão 24 = 8 principais + 16 metades inferiores). Proporções medidas no render de perfil: coroa 16,5%, cintura 3,8%, pavilhão ~42%, profundidade ~63% da largura.
3. Geometria em código: 112 triângulos. **Truque de planaridade**: estrelas e pontos do pavilhão ficam na altura que torna cada bezel e cada faceta principal um plano (a altura vem da reta eixo, projetada na direção do vértice).
4. Shader sem textura: normal plana por faceta via `dFdx/dFdy`; reflexo + luz que entra (`refract`, IOR 2,42), bate no pavilhão e sai; **dispersão** amostrando R, G e B em ângulos ligeiramente diferentes; ambiente procedural (caixas de luz + 12 luzes pequenas em esfera de Fibonacci para muitas faíscas ao girar).
5. Comparação com a referência: facetas 73 = 73; razão profundidade/largura do perfil **0,639 contra 0,636** da referência (0,5%); vista de cima reproduz o diagrama; aparência: corpo escuro e neutro, facetas brancas nítidas e flashes coloridos.
6. Interação: giro automático (para com arrasto), arrastar com inércia, leve inclinação com o cursor, rolagem dá giro; pausa fora da tela e com a aba escondida; plano B é a gema em CSS.

**Desempenho do 3D (medido com Lighthouse e A/B, 2026-11-16)** — a primeira versão derrubou o Desempenho de 86 para 62 (TBT de 210 para 1.960 ms). Causas e regras:
- **Criar o contexto WebGL é caro no carregamento**: `canvas.getContext('webgl2')` bloqueou a thread principal por 250 a 750 ms enquanto a página ainda animava (em página em branco leva só 25–75 ms: a chamada espera a GPU, ocupada com a própria página). Regra: **mostre um PÔSTER** (imagem do próprio render, WebP com alfa, ~11 KB; gere com `canvas.toDataURL('image/webp')` logo após `desenhar()`) e **só ligue o WebGL depois da animação de entrada** (≈3 s) com a página ociosa (`requestIdleCallback`), ou na primeira interação (`pointerenter`/`pointerdown`). O pôster vira o LCP e a troca é invisível (mesmo visual).
- **Compile o shader em paralelo**: `gl.getExtension('KHR_parallel_shader_compile')` e espere `COMPLETION_STATUS_KHR` por `requestAnimationFrame` antes do primeiro desenho (sem isso `getProgramParameter` bloqueia até o fim da compilação).
- **Shader barato**: `dot` no lugar de `acos` nas luzes; poucas luzes (8 pequenas + 5 grandes); DPR ≤ 1,25 em objeto pequeno.
- **Sem GPU, sem 3D**: se `UNMASKED_RENDERER_WEBGL` contiver SwiftShader/llvmpipe/Software, mantenha o pôster (renderização por software trava a página).
- **O verificador e o juiz rodam sem GPU, então julgam o plano B** (teste cego, rodadas 2 e 3). O plano B tem que carregar o gesto: quadros renderizados da própria cena, trocados pela rolagem (`starters/modulos/01-giro-3d-quadros`), com os mesmos ângulos e estados do WebGL; nunca um pôster parado só. Aceite `?gpu=1` na URL para forçar o WebGL nos testes e confira as telas do `juiz.mjs` com e sem ele.
- **Gire pouco**: giro automático só nos primeiros ~7 s (e quando o mouse passa/arrasta); depois **renderize apenas sob demanda** (`sujo`), pausando fora da tela e com a aba escondida.
- **Marque as etapas** com `performance.mark` (contexto, link, compilado, primeiro desenho) para achar o gargalo; e faça **A/B** (mesma página com `getContext('webgl2')` retornando `null`) várias vezes, porque o TBT varia muito entre rodadas.
- Resultado do A/B depois das correções: com 3D e sem 3D ficaram equivalentes (480/954/554 ms contra 947/853/379 ms, ruído da máquina), e o 3D ficou ativo nas três rodadas.

**Lições**
- Primeira versão ficou marrom e lamacenta: o ambiente quente tingia tudo. Corpo neutro escuro + luzes brancas pontuais é o que lê como diamante.
- A referência manda no resultado: sem ela a estrutura (8 estrelas, 16 metades) e as proporções seriam chutadas.
- Meça o perfil: `readPixels` do canvas e caixa dos pixels com alfa > 0, contra a caixa da imagem de referência.

## Diamante com ray tracing (versão final, 2026-11-17): ultrarrealista em ~23 KB
Partindo do diamante por faceta (acima), o resultado final usa **ray tracing dentro do cristal** no fragment shader, e ficou muito próximo de um vídeo de referência gerado a partir do prompt de `referencias-3d/diamante/prompt-video-diamante.md`.

**Como funciona**
- O cristal é convexo: basta o conjunto de **planos das facetas** (73, deduplicados a partir dos triângulos) em um array `uniform vec4 uPl[73]` (normal para fora + distância).
- Cada pixel: refrata o raio de entrada (Fresnel para o reflexo externo), segue **um caminho** dentro do cristal (encontra o plano de saída mais próximo com `t = (h - n·p)/(n·d)`, `nd > 0`), e a cada plano **refrata para fora ou reflete (reflexão total)**, somando `(1-F)·ambiente(saída)`; até 8 quebras.
- **Dispersão (fogo)** só na saída: R, G e B saem com índices `IOR ± uDsp` (≈ 0,10). Um caminho por pixel custa 3× menos que seguir 3 raios e o resultado é muito parecido.
- Ambiente HDR procedural (sem textura): claro em cima, escuro embaixo, painéis claros/escuros em volta, softboxes, faixas e duas luzes quentes. Tone mapping `1 - exp(-c)`.

**Desempenho e peso (medidos nesta máquina, GPU integrada AMD Vega 10)**
- v1 com 3 raios por pixel e 7 quebras: **178 ms por quadro** e 4,4 s de compilação. v2 com um caminho: compilação 1,7 s; cada quebra ≈ 10 ms a 518 px.
- **Qualidade dupla**: em movimento, menos quebras (`Qmov`, adaptativo 4 a 3) e 72% da resolução; **parado**, depois de 160 ms, um quadro nítido com 8 quebras e DPR até 1,5. O quadro por segundo medido por contagem de `requestAnimationFrame` **não é confiável** (a GPU aceita comandos mais rápido do que executa): decida pela cadência real (`dt` do rAF) e por A/B.
- Peso: JS 4,5 KB gzip **em arquivo separado baixado só ao ligar** (`import()` depois da entrada, ocioso ou na 1ª interação) + pôster WebP 18,8 KB (q60, 648 px, alfa; q80 dava 25 KB, 31,8 KB no padrão do navegador) = **≈ 23 KB**.
- Economia: não liga em `saveData`, `deviceMemory < 4` ou `hardwareConcurrency < 4` (fica o pôster); sem GPU (SwiftShader/llvmpipe) também; render sob demanda; giro automático só nos primeiros 7 s; pausa fora da tela e com a aba escondida.
- Interação: arrastar na horizontal gira, na vertical inclina até 88° (**frente, verso e baixo**); setas do teclado; em toque só gira na horizontal (`touch-action: pan-y`) para a página continuar rolando.

**Armadilhas**
- `readPixels` para medir tempo mede também a espera síncrona (custo fixo de ~30 ms): meça pelo cadência do rAF.
- Compilar o shader com laços de limite constante grande pode levar segundos: use limites dinâmicos (`uN`, `uQ`) e `KHR_parallel_shader_compile`.

## Cuidados
- **Propriedade intelectual:** o vídeo usa elementos do Minecraft (marca e texturas da Mojang/Microsoft), e o teste da lata usa a foto e a marca de um produto real. Isso vale **só como estudo local**. Em projeto de cliente, **não use** texturas, logos, nomes ou personagens de terceiros: crie arte própria no mesmo estilo, ou use fotos com autorização da marca.
- Verifique a licença de qualquer ferramenta, modelo ou textura antes de usar (por exemplo, "img2threejs" ainda não foi verificada).
- Teste em celular de verdade, em 1440/768/390 px, e meça: LCP, fps e consumo de bateria.

## Referência visual e prompts
Antes de modelar qualquer objeto: imagem detalhada (várias vistas) ou vídeo. Prompts com comandos de barra (`/8k /ultra-realistic /ray-traced ...`), modelos de imagem e de vídeo e a pergunta "quem gera a referência" estão em [prompts-3d.md](prompts-3d.md). `opcoes.mjs` sempre traz um elemento 3D leve sugerido para o tema.
