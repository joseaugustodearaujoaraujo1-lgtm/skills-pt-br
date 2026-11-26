// Base do elemento 3D ultrarrealista, só com Three.js (references/pipeline-3d.md).
// Nada de arquivo de modelo, imagem de textura ou HDRI: ambiente, texturas e forma saem de código.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Vistas iguais às de scripts/blender/vistas.py: [azimute a partir da frente (+Z), girando para +X; elevação], em graus.
export const VISTAS = { frente: [0, 0], lado: [90, 0], 'tres-quartos': [45, 20], costas: [180, 0], topo: [0, 89.9] };
const FOV = 2 * Math.atan(18 / 85) * 180 / Math.PI; // lente de 85 mm, como no Blender

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ criar: (ctx: {THREE: typeof THREE, renderer: THREE.WebGLRenderer}) => THREE.Object3D, fundo?: number|null, exposicao?: number, sombra?: boolean }} op
 */
export function iniciarElemento(canvas, op) {
  const url = new URLSearchParams(location.search);
  const captura = url.has('captura');
  const vistaFixa = VISTAS[url.get('vista')] ? url.get('vista') : null;
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: op.fundo == null, preserveDrawingBuffer: captura, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, captura ? 1 : 2));
  renderer.toneMapping = THREE.AgXToneMapping ?? THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = op.exposicao ?? 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const cena = new THREE.Scene();
  if (op.fundo != null) cena.background = new THREE.Color(op.fundo);
  const pmrem = new THREE.PMREMGenerator(renderer);
  cena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; // estúdio gerado em código
  pmrem.dispose();

  const objeto = op.criar({ THREE, renderer });
  const pivo = new THREE.Group(); pivo.add(objeto); cena.add(pivo);
  const esfera = new THREE.Box3().setFromObject(objeto).getBoundingSphere(new THREE.Sphere());
  objeto.position.sub(esfera.center); // centro da esfera na origem, como no Blender

  if (op.sombra !== false) {
    const sombra = sombraDeContato(esfera.radius);
    sombra.position.y = new THREE.Box3().setFromObject(pivo).min.y - esfera.radius * 0.002;
    cena.add(sombra);
  }

  const camera = new THREE.PerspectiveCamera(FOV, 1, esfera.radius / 100, esfera.radius * 50);
  const dist = esfera.radius / Math.sin(FOV * Math.PI / 360) * 1.15;
  const posicionar = (az, el) => {
    const a = az * Math.PI / 180, e = el * Math.PI / 180;
    camera.position.set(Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)).multiplyScalar(dist);
    camera.lookAt(0, 0, 0);
  };
  const [az0, el0] = VISTAS[vistaFixa || 'tres-quartos'];
  posicionar(az0, el0);

  let sujo = true; const pedir = () => { sujo = true; };
  const ajustar = () => {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // mantém a esfera inteira no quadro também em telas largas ou altas
    camera.fov = camera.aspect >= 1 ? FOV : 2 * Math.atan(Math.tan(FOV * Math.PI / 360) / camera.aspect) * 180 / Math.PI;
    camera.updateProjectionMatrix(); pedir();
  };
  addEventListener('resize', ajustar); ajustar();

  // Interação: arrastar gira (com inércia); setas giram; sem animação em captura ou movimento reduzido.
  let giro = 0, incl = 0, vel = 0, arrastando = false, ultimoX = 0, ultimoY = 0, autoAte = performance.now() + 7000;
  if (!captura && !vistaFixa) {
    canvas.style.touchAction = 'pan-y';
    canvas.addEventListener('pointerdown', e => { arrastando = true; ultimoX = e.clientX; ultimoY = e.clientY; canvas.setPointerCapture(e.pointerId); autoAte = 0; });
    canvas.addEventListener('pointermove', e => {
      if (!arrastando) return;
      vel = (e.clientX - ultimoX) * 0.01; giro += vel;
      if (e.pointerType !== 'touch') incl = THREE.MathUtils.clamp(incl + (e.clientY - ultimoY) * 0.006, -1.2, 1.2);
      ultimoX = e.clientX; ultimoY = e.clientY; pedir();
    });
    canvas.addEventListener('pointerup', () => { arrastando = false; });
    canvas.tabIndex = 0;
    canvas.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { giro += e.key === 'ArrowLeft' ? -0.2 : 0.2; autoAte = 0; pedir(); } });
  }

  let visivel = true;
  new IntersectionObserver(([en]) => { visivel = en.isIntersecting; if (visivel) pedir(); }).observe(canvas);
  document.addEventListener('visibilitychange', pedir);

  let antes = performance.now();
  renderer.setAnimationLoop(agora => {
    const dt = Math.min((agora - antes) / 1000, 0.05); antes = agora;
    if (!visivel || document.hidden) return;
    if (!captura && !vistaFixa) {
      if (!reduzido && !arrastando && agora < autoAte) { giro += dt * 0.5; sujo = true; }
      if (!arrastando && Math.abs(vel) > 1e-4) { giro += vel; vel *= Math.pow(0.04, dt); sujo = true; }
      pivo.rotation.set(incl, giro, 0);
    }
    if (!sujo) return; // render sob demanda
    sujo = false;
    renderer.render(cena, camera);
    if (captura) document.documentElement.dataset.pronto = '1';
  });

  return {
    THREE, renderer, cena, camera, objeto, pedir,
    /** Pôster de reserva capturado do próprio render (conta nos 200 KB). */
    poster: (tipo = 'image/webp', q = 0.7) => { renderer.render(cena, camera); return canvas.toDataURL(tipo, q); },
    info: () => ({ chamadas: renderer.info.render.calls, triangulos: renderer.info.render.triangles, geometrias: renderer.info.memory.geometries, texturas: renderer.info.memory.textures }),
  };
}

/** Sombra de contato suave, gerada em canvas (sem arquivo de imagem). */
export function sombraDeContato(raio) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d'), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(0.45, 'rgba(0,0,0,.22)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(raio * 2.2, raio * 2.2), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false }));
  m.rotation.x = -Math.PI / 2; m.renderOrder = -1;
  return m;
}

/** Mapa de rugosidade de metal escovado (circular ou reto), gerado em código. */
export function texturaEscovada({ tamanho = 512, circular = true, base = 0.32, variacao = 0.18, semente = 7 } = {}) {
  let s = semente; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const linhas = Array.from({ length: tamanho * 2 }, () => rnd());
  const dados = new Uint8Array(tamanho * tamanho * 4);
  for (let y = 0; y < tamanho; y++) for (let x = 0; x < tamanho; x++) {
    const u = x / tamanho - 0.5, v = y / tamanho - 0.5;
    const t = circular ? Math.hypot(u, v) * 2 : v + 0.5;
    const i = Math.floor(t * tamanho * 2) % (tamanho * 2);
    const r = base + (linhas[i] - 0.5) * variacao + (rnd() - 0.5) * 0.04; // grão fino + ruído
    const k = (y * tamanho + x) * 4, val = Math.round(THREE.MathUtils.clamp(r, 0, 1) * 255);
    dados[k] = dados[k + 1] = dados[k + 2] = val; dados[k + 3] = 255;
  }
  const tex = new THREE.DataTexture(dados, tamanho, tamanho, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.anisotropy = 8; tex.needsUpdate = true;
  return tex;
}

/** Perfil de revolução com chanfros: pontos [raio, altura] → LatheGeometry suave, sem aresta viva. */
export function revolucao(pontos, { segmentos = 128, chanfro = 0.004, passos = 3 } = {}) {
  const P = pontos.map(([r, y]) => new THREE.Vector2(r, y)), saida = [];
  P.forEach((p, i) => {
    const a = P[i - 1], b = P[i + 1];
    if (!a || !b || chanfro <= 0) { saida.push(p); return; }
    const d1 = a.clone().sub(p), d2 = b.clone().sub(p);
    const c = Math.min(chanfro, d1.length() / 2, d2.length() / 2);
    const p1 = p.clone().add(d1.normalize().multiplyScalar(c)), p2 = p.clone().add(d2.normalize().multiplyScalar(c));
    for (let k = 0; k <= passos; k++) { // curva de Bézier quadrática no canto
      const t = k / passos;
      saida.push(new THREE.Vector2(
        (1 - t) ** 2 * p1.x + 2 * (1 - t) * t * p.x + t * t * p2.x,
        (1 - t) ** 2 * p1.y + 2 * (1 - t) * t * p.y + t * t * p2.y));
    }
  });
  const geo = new THREE.LatheGeometry(saida, segmentos);
  geo.computeVertexNormals();
  return geo;
}
