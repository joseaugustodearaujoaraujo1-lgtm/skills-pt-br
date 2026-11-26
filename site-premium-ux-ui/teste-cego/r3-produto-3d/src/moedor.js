// MÓ 01: o moedor em geometria real (three.js), escrito em código a partir do molde (referencias-3d/moedor/).
// Unidade: centímetro. Eixo Y = eixo do moedor; a base fica em y = 0 e o topo da porca em y = 20.
// Seis peças: anel de regulagem, mó cônica de cerâmica, corpo de nogueira, eixo de aço, cabeça de nogueira e porca recartilhada.
// A mesma função monta o site, o molde (4 vistas) e os quadros do plano B: o 3D do site é o molde.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Vector2, Vector3, LatheGeometry, CylinderGeometry, BoxGeometry, PlaneGeometry,
  MeshPhysicalMaterial, MeshBasicMaterial, CanvasTexture, RepeatWrapping, SRGBColorSpace, DoubleSide, PMREMGenerator,
  ACESFilmicToneMapping, DirectionalLight, MathUtils, BackSide, Color,
} from 'three';

// estúdio de produto (ambiente HDR em código): paredes escuras e quentes, softbox grande em cima, duas faixas verticais e um acento quente.
// Metal precisa de reflexo escuro para parecer metal; o RoomEnvironment branco deixava o aço com cara de plástico.
function estudio() {
  const s = new Scene();
  const cor = (r, g, b, k = 1) => new Color(r * k, g * k, b * k);
  const sala = new Mesh(new BoxGeometry(40, 30, 40), new MeshBasicMaterial({ color: cor(.16, .145, .13), side: BackSide })); sala.position.y = 10; s.add(sala);
  const chao = new Mesh(new PlaneGeometry(40, 40), new MeshBasicMaterial({ color: cor(.42, .38, .33) })); chao.rotation.x = -PI / 2; chao.position.y = -4.9; s.add(chao);
  const painel = (w, h, c, x, y, z, ry = 0, rx = 0) => { const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: c, side: DoubleSide })); m.position.set(x, y, z); m.rotation.set(rx, ry, 0); s.add(m); };
  painel(16, 10, cor(1, .98, .95, 5), 0, 24.8, 0, 0, PI / 2);          // softbox de cima
  painel(3, 22, cor(1, 1, 1, 7), -19.8, 9, -4, PI / 2);                 // faixa esquerda
  painel(3, 22, cor(.95, .97, 1, 5), 19.8, 9, 6, -PI / 2);              // faixa direita
  painel(10, 8, cor(1, .97, .92, 2.2), -6, 10, 19.8, PI);               // rebatedor da frente
  painel(4, 4, cor(1, .72, .45, 6), 12, 16, -19.8);                     // acento quente 2700K
  return s;
}

const PI = Math.PI;
const suave = (a, b, x) => { const t = MathUtils.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// ---------- texturas procedurais (sem arquivo) ----------
function texturaNogueira(seme = 7) {
  const W = 512, H = 512, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'), img = g.createImageData(W, H), d = img.data;
  let s = seme; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const fase = Array.from({ length: 6 }, () => rnd() * PI * 2);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const u = x / W, v = y / H;
    // veios quase retos ao longo da altura (u: volta; frequências inteiras emendam), poucos desvios largos
    const desvio = Math.sin(v * PI * 2 + fase[0] + u * PI * 4) * .018 + Math.sin(v * PI * 6 + fase[1]) * .006;
    const uu = u + desvio;
    let veio = Math.pow(Math.abs(Math.sin(uu * PI * 2 * 53 + fase[2])), 6) * .55      // linhas finas escuras (anéis)
      + Math.pow(Math.abs(Math.sin(uu * PI * 2 * 17 + fase[3])), 3) * .35
      + (Math.sin(uu * PI * 2 * 3 + fase[4]) * .5 + .5) * .45;                       // faixas largas de cerne
    veio = 1 - MathUtils.clamp(veio, 0, 1);
    const poros = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
    const k = MathUtils.clamp(.12 + veio * .62 + Math.abs(poros) * .05, 0, 1);
    // nogueira: de #2f1d12 a #7a5236
    d[(y * W + x) * 4] = 47 + k * 75; d[(y * W + x) * 4 + 1] = 29 + k * 53; d[(y * W + x) * 4 + 2] = 18 + k * 36; d[(y * W + x) * 4 + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new CanvasTexture(c); t.wrapS = t.wrapT = RepeatWrapping; t.colorSpace = SRGBColorSpace; t.anisotropy = 4;
  return t;
}
function texturaSombra() {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  r.addColorStop(0, 'rgba(31,26,20,.55)'); r.addColorStop(.35, 'rgba(31,26,20,.28)'); r.addColorStop(1, 'rgba(31,26,20,0)');
  g.fillStyle = r; g.fillRect(0, 0, 256, 256); return new CanvasTexture(c);
}

// ---------- perfis (r, y) das peças ----------
const P = pts => pts.map(([r, y]) => new Vector2(r, y));
function perfilCorpo() {
  const pts = [[2.2, 1.3], [2.72, 1.3], [2.8, 1.38], [2.8, 2.6], [2.74, 2.66], [2.74, 2.84], [2.8, 2.9]];
  for (let i = 0; i <= 40; i++) { const y = 2.95 + (14.55 - 2.95) * i / 40; const k = Math.max(0, Math.sin(PI * (y - 2.95) / 11.6)); pts.push([2.8 - .3 * Math.pow(k, 1.6), y]); }
  pts.push([2.8, 15.25], [2.73, 15.4], [2.2, 15.4]);
  pts.push([2.2, 1.3]);
  return P(pts);
}
function perfilCabeca() {
  const pts = [[0, 15.5], [2.66, 15.5], [2.76, 15.58], [2.78, 16.2]];
  for (let i = 1; i <= 28; i++) { const a = i / 28 * PI / 2; const r = 2.78 * Math.pow(Math.cos(a), .72); const y = 16.2 + 2.75 * Math.sin(a); if (r < .64) { pts.push([.64, 18.98]); break; } pts.push([r, y]); }
  pts.push([.64, 19.0], [0, 19.0]);
  return P(pts);
}
const perfilAnel = () => P([[.72, 1.3], [.72, 0], [2.74, 0], [2.86, .07], [2.9, .2], [2.9, 1.12], [2.84, 1.25], [2.74, 1.3], [.72, 1.3]]);
const perfilMo = () => P([[0, .5], [.5, .5], [.62, .58], [1.36, 2.3], [1.3, 2.5], [1.1, 2.6], [0, 2.6]]);
function perfilPorca() {
  const pts = [[0, 19.0], [.58, 19.0], [.62, 19.06], [.62, 19.58]];
  for (let i = 1; i <= 10; i++) { const a = i / 10 * PI / 2; pts.push([.62 * Math.cos(a) + .001, 19.58 + .42 * Math.sin(a)]); }
  pts.push([0, 20.0]);
  return P(pts);
}

// desloca o raio da malha (sulcos da mó, recartilhado da porca) e refaz as normais
function sulcar(geo, fn) {
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), r = Math.hypot(x, z); if (r < 1e-4) continue;
    const th = Math.atan2(z, x), f = fn(th, y, r); p.setX(i, x * f); p.setZ(i, z * f);
  }
  geo.computeVertexNormals(); return geo;
}

// ---------- montagem ----------
export const PECAS = ['porca', 'cabeca', 'eixo', 'corpo', 'mo', 'anel'];
// deslocamento máximo de cada peça ao longo do eixo (cm) e a janela da explosão em que ela se move
const EXPLODE = { porca: [7.4, 0, .55], cabeca: [4.4, .08, .62], eixo: [.6, .2, .7], corpo: [0, 0, 1], mo: [-3.2, .3, .82], anel: [-6.4, .38, 1] };
const CENTRO = { porca: 19.5, cabeca: 17.3, eixo: 16.6, corpo: 8.4, mo: 1.55, anel: .65 };

export function montarMoedor({ segmentos = 96 } = {}) {
  const madeira = texturaNogueira();
  const mNogueira = new MeshPhysicalMaterial({ map: madeira, bumpMap: madeira, bumpScale: 1.2, roughness: .55, clearcoat: .4, clearcoatRoughness: .35, side: DoubleSide });
  const mNogueiraDentro = new MeshPhysicalMaterial({ color: 0x2a1a10, roughness: .85, side: DoubleSide });
  const mAco = new MeshPhysicalMaterial({ color: 0xb4b2ad, metalness: 1, roughness: .2, anisotropy: .7 });
  const mAcoEscuro = new MeshPhysicalMaterial({ color: 0x6f6d69, metalness: 1, roughness: .42 });
  const mCeramica = new MeshPhysicalMaterial({ color: 0xe4dfd6, roughness: .45, clearcoat: .25, clearcoatRoughness: .3, sheen: .3, sheenColor: 0xffffff });

  const grupo = new Group(); const pecas = {};
  const nova = (nome, ...malhas) => { const g = new Group(); g.name = nome; malhas.forEach(m => g.add(m)); grupo.add(g); pecas[nome] = g; return g; };

  // corpo: superfície externa de nogueira; parede interna escura (aparece quando a cabeça e o anel saem)
  const corpo = new Mesh(new LatheGeometry(perfilCorpo(), segmentos), mNogueira);
  const dentro = new Mesh(new CylinderGeometry(2.18, 2.18, 14.08, segmentos, 1, true), mNogueiraDentro); dentro.position.y = 8.35;
  const frisoGeo = new CylinderGeometry(2.745, 2.745, .16, segmentos, 1, true); const friso = new Mesh(frisoGeo, new MeshPhysicalMaterial({ color: 0x1c120b, roughness: .7 })); friso.position.y = 2.75;
  nova('corpo', corpo, dentro, friso);

  nova('cabeca', new Mesh(new LatheGeometry(perfilCabeca(), segmentos), mNogueira));

  // porca: 24 frisos de recartilhado entre y 19,1 e 19,55
  nova('porca', new Mesh(sulcar(new LatheGeometry(perfilPorca(), 144), (th, y) => (y > 19.1 && y < 19.56) ? 1 - .07 * Math.pow(.5 + .5 * Math.cos(24 * th), 2) : 1), mAco));

  // eixo de aço com ponta rosqueada (anéis finos)
  const eixo = new Mesh(new CylinderGeometry(.16, .16, 18.4, 24), mAco); eixo.position.y = 10.0;
  const rosca = new Mesh(sulcar(new CylinderGeometry(.2, .2, .8, 48, 16), (th, y) => 1 - .12 * (.5 + .5 * Math.cos(y * PI * 2 / .1 + th))), mAco); rosca.position.y = 18.8;
  nova('eixo', eixo, rosca);

  // mó cônica de cerâmica: 12 sulcos helicoidais
  nova('mo', new Mesh(sulcar(new LatheGeometry(perfilMo(), 192), (th, y, r) => r < .45 ? 1 : 1 - .1 * Math.pow(.5 + .5 * Math.cos(12 * th + y * 2.4), 6)), mCeramica));

  // anel de regulagem: aço escovado com 8 entalhes (as 8 regulagens) e uma marca de índice no corpo
  const anel = new Mesh(new LatheGeometry(perfilAnel(), segmentos), mAco);
  const entalhes = [];
  for (let i = 0; i < 8; i++) {
    const e = new Mesh(new BoxGeometry(.14, .62, .12), mAcoEscuro); const a = i / 8 * PI * 2;
    e.position.set(Math.cos(a) * 2.86, .66, Math.sin(a) * 2.86); e.rotation.y = -a; entalhes.push(e);
  }
  nova('anel', anel, ...entalhes);
  const indice = new Mesh(new BoxGeometry(.08, .5, .06), mAcoEscuro); indice.position.set(2.79, 1.75, 0); pecas.corpo.add(indice);

  // sombra de contato (não é luz em tempo real: textura radial que acompanha a peça mais baixa)
  const sombra = new Mesh(new PlaneGeometry(13, 13), new MeshBasicMaterial({ map: texturaSombra(), transparent: true, depthWrite: false }));
  sombra.rotation.x = -PI / 2; sombra.position.y = -.02; grupo.add(sombra);

  function explodir(e) {
    for (const nome of PECAS) {
      const [dy, a, b] = EXPLODE[nome]; const k = suave(a, b, e);
      pecas[nome].position.y = dy * k;
      pecas[nome].rotation.y = (nome === 'cabeca' ? .5 : nome === 'anel' ? -.6 : nome === 'porca' ? 1.2 : 0) * k;
    }
    sombra.position.y = Math.min(0, pecas.anel.position.y) - .02;
    sombra.material.opacity = 1 - .35 * e;
    sombra.scale.setScalar(1 + .25 * e);
  }
  return { grupo, pecas, explodir };
}

// ---------- cena completa ----------
export function criarCena(canvas, { dpr = 1.5, alpha = true, preservar = false } = {}) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha, powerPreference: 'high-performance', preserveDrawingBuffer: preservar });
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  const scene = new Scene();
  const pm = new PMREMGenerator(renderer); scene.environment = pm.fromScene(estudio(), .02).texture; scene.environmentIntensity = 1;
  const luz = new DirectionalLight(0xfff1e0, 1.6); luz.position.set(-6, 14, 9); scene.add(luz);
  const recorte = new DirectionalLight(0xe8f0ff, .7); recorte.position.set(8, 6, -10); scene.add(recorte);
  const camera = new PerspectiveCamera(26, 1, 1, 400);
  const m = montarMoedor(); scene.add(m.grupo);
  const alvo = new Vector3();
  const estado = { e: 0, rot: 0, elev: 12, dist: 60, alvoY: 10, desvioY: 0, w: 1, h: 1 };

  function tamanho(w, h) { estado.w = w; estado.h = h; renderer.setSize(w, h, false); camera.aspect = w / h; aplicarCamera(); }
  function aplicarCamera() {
    const el = MathUtils.degToRad(estado.elev);
    alvo.set(0, estado.alvoY, 0);
    // no retrato a distância cresce para o objeto caber na largura
    const ajuste = Math.max(1, .62 / camera.aspect);
    const d = estado.dist * ajuste;
    camera.position.set(0, alvo.y + Math.sin(el) * d, Math.cos(el) * d); camera.lookAt(alvo);
    if (estado.desvioY) camera.setViewOffset(estado.w, estado.h, 0, estado.desvioY * estado.h, estado.w, estado.h); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }
  // e: explosão 0..1; rot: giro em torno do eixo (rad); desvioY: desloca o objeto para cima (fração da altura)
  function definir({ e = estado.e, rot = estado.rot, elev = estado.elev, desvioY = estado.desvioY } = {}) {
    Object.assign(estado, { e, rot, elev, desvioY });
    estado.dist = MathUtils.lerp(56, 90, suave(0, 1, e)); estado.alvoY = MathUtils.lerp(10, 10.4, e);
    m.explodir(e); m.grupo.rotation.y = rot; aplicarCamera();
  }
  // posição na tela (px do canvas) do centro de cada peça, para as linhas de cota
  const v = new Vector3();
  function ancoras() {
    const out = {}; m.grupo.updateMatrixWorld(true);
    for (const nome of PECAS) {
      v.set(0, CENTRO[nome], 0); m.pecas[nome].localToWorld(v); v.project(camera);
      out[nome] = [(v.x * .5 + .5) * estado.w, (-v.y * .5 + .5) * estado.h];
    }
    return out;
  }
  const render = () => renderer.render(scene, camera);
  return { renderer, scene, camera, moedor: m, tamanho, definir, render, ancoras, estado };
}
