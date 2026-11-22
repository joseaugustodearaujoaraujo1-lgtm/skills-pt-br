// Prancha de surfe 3D real (three.js): contorno de prancha, bordas arredondadas (bisel), curvatura (rocker) do bico à rabeta,
// 3 quilhas, pintura procedural com resina brilhante (clearcoat), longarina de madeira, ambiente PMREM + ACES.
// Usos: (1) ao vivo no hero; (2) modo manual para renderizar o "hall da fama" (gerar-renders.mjs).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// 8 pinturas (nome, ano, cores, padrão)
export const PRANCHAS = [
  { nome: 'Coral', ano: '2026', cores: ['#ff5b3a', '#fff4e6', '#0f2b2b'], padrao: 'faixas' },
  { nome: 'Maré Baixa', ano: '2025', cores: ['#0f2b2b', '#5fd3c4', '#f3f1ea'], padrao: 'ondas' },
  { nome: 'Saquarema', ano: '2025', cores: ['#f3f1ea', '#ff5b3a', '#ffb02e'], padrao: 'sol' },
  { nome: 'Noturna', ano: '2024', cores: ['#121417', '#ff5b3a', '#3a4048'], padrao: 'riscos' },
  { nome: 'Itacaré', ano: '2024', cores: ['#2e8b57', '#f6e7c1', '#0f2b2b'], padrao: 'folhas' },
  { nome: 'Areia', ano: '2023', cores: ['#e9d8b4', '#a8763e', '#ffffff'], padrao: 'faixas' },
  { nome: 'Título', ano: '2023', cores: ['#ffd23a', '#0f2b2b', '#ff5b3a'], padrao: 'xadrez' },
  { nome: 'Estreia', ano: '2021', cores: ['#ffffff', '#5fd3c4', '#ff8fa3'], padrao: 'ondas' },
];

const rnd = (() => { let s = 5; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
function pintura({ cores: [a, b, c], padrao }) {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 2048; const g = cv.getContext('2d'), w = 512, h = 2048;
  g.fillStyle = a; g.fillRect(0, 0, w, h);
  if (padrao === 'faixas') { g.fillStyle = b; g.fillRect(0, h * .55, w, h * .1); g.fillStyle = c; g.fillRect(0, h * .67, w, h * .035); }
  if (padrao === 'ondas') { for (let k = 0; k < 9; k++) { g.strokeStyle = k % 2 ? b : c; g.lineWidth = 26; g.beginPath(); for (let x = 0; x <= w; x += 8) g.lineTo(x, h * .35 + k * 70 + Math.sin(x / 40 + k) * 24); g.stroke(); } }
  if (padrao === 'sol') { const r = g.createRadialGradient(w / 2, h * .42, 10, w / 2, h * .42, 260); r.addColorStop(0, c); r.addColorStop(.6, b); r.addColorStop(1, a); g.fillStyle = r; g.fillRect(0, 0, w, h); }
  if (padrao === 'riscos') { for (let k = 0; k < 40; k++) { g.strokeStyle = rnd() > .5 ? b : c; g.lineWidth = 3 + rnd() * 10; g.beginPath(); g.moveTo(rnd() * w, rnd() * h); g.lineTo(rnd() * w, rnd() * h); g.stroke(); } }
  if (padrao === 'folhas') { for (let k = 0; k < 26; k++) { g.save(); g.translate(rnd() * w, rnd() * h); g.rotate(rnd() * 6.3); g.fillStyle = k % 3 ? b : c; g.beginPath(); g.ellipse(0, 0, 30, 90, 0, 0, 7); g.fill(); g.restore(); } }
  if (padrao === 'xadrez') { const q = 64; for (let y = h * .5; y < h * .7; y += q) for (let x = 0; x < w; x += q) if (((x + y) / q) % 2 === 0) { g.fillStyle = b; g.fillRect(x, y, q, q); } g.fillStyle = c; g.fillRect(0, h * .72, w, 30); }
  // longarina (madeira) e marca
  g.fillStyle = '#c99a5b'; g.fillRect(w / 2 - 3, 0, 6, h);
  g.save(); g.translate(w / 2, h * .28); g.rotate(-Math.PI / 2); g.font = '800 64px "Mona Sans", sans-serif'; g.textAlign = 'center'; g.fillStyle = c; g.fillText('TR', 0, 22); g.restore();
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

function contorno(L, W) {
  // meia-largura ao longo do comprimento: bico fino, maior largura ~42%, rabeta squash
  const s = new THREE.Shape(); const pts = [];
  for (let i = 0; i <= 60; i++) { const t = i / 60, y = -L / 2 + t * L; const lar = W / 2 * Math.pow(Math.sin(Math.PI * Math.pow(1 - t, .85)), .62) * (t < .06 ? .55 + t * 7.5 : 1); pts.push([Math.max(lar, t > .98 ? .0 : .055), y]); }
  s.moveTo(-pts[0][0], pts[0][1]); pts.forEach(([x, y]) => s.lineTo(x, y)); [...pts].reverse().forEach(([x, y]) => s.lineTo(-x, y)); return s;
}

export function montarPrancha(canvas, { pintura: indice = 0, manual = false, aoPronto, distancia = 11 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: manual });
  renderer.setPixelRatio(manual ? 1 : Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .85; renderer.outputColorSpace = THREE.SRGBColorSpace;
  const cena = new THREE.Scene(); const pm = new THREE.PMREMGenerator(renderer);
  cena.environment = pm.fromScene(new RoomEnvironment(), .04).texture; pm.dispose();
  const camera = new THREE.PerspectiveCamera(26, 1, .1, 60); camera.position.set(0, 0, distancia); camera.lookAt(0, 0, 0);
  const luz = new THREE.DirectionalLight(0xffffff, 2); luz.position.set(4, 6, 6); cena.add(luz);

  const L = 6, W = 1.55, E = .14;
  const geo = new THREE.ExtrudeGeometry(contorno(L, W), { depth: E, bevelEnabled: true, bevelThickness: .07, bevelSize: .06, bevelSegments: 8, curveSegments: 4, steps: 1 });
  geo.translate(0, 0, -E / 2);
  // UV de cima: x pela largura, y pelo comprimento
  const p = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / W + .5, p.getY(i) / L + .5);
  // rocker: curva o bico e a rabeta para "cima" (z)
  for (let i = 0; i < p.count; i++) { const t = p.getY(i) / (L / 2); p.setZ(i, p.getZ(i) + Math.pow(Math.max(0, t), 2.6) * .55 + Math.pow(Math.max(0, -t), 2.2) * .18); }
  geo.computeVertexNormals();
  const mat = new THREE.MeshPhysicalMaterial({ roughness: .35, clearcoat: 1, clearcoatRoughness: .1, envMapIntensity: .55 });
  const prancha = new THREE.Mesh(geo, mat);
  // 3 quilhas
  const qForma = new THREE.Shape(); qForma.moveTo(0, 0); qForma.quadraticCurveTo(.05, .35, .3, .42); qForma.quadraticCurveTo(.2, .2, .32, 0); qForma.lineTo(0, 0);
  const qGeo = new THREE.ExtrudeGeometry(qForma, { depth: .02, bevelEnabled: true, bevelThickness: .008, bevelSize: .008, bevelSegments: 2 });
  const qMat = new THREE.MeshPhysicalMaterial({ color: 0x1b1d20, roughness: .25, clearcoat: 1 });
  [[0, -2.45], [-.42, -2.1], [.42, -2.1]].forEach(([x, y]) => { const q = new THREE.Mesh(qGeo, qMat); q.rotation.set(Math.PI / 2, Math.PI / 2, 0); q.position.set(x, y, -E / 2 - .05); q.scale.setScalar(x ? .85 : 1); prancha.add(q); });
  const grupo = new THREE.Group(); grupo.add(prancha); cena.add(grupo);
  const tex = {}; const trocar = k => { mat.map = tex[k] ||= pintura(PRANCHAS[k]); mat.needsUpdate = true; }; trocar(indice);

  const tamanho = () => { const w = canvas.clientWidth || canvas.width, h = canvas.clientHeight || canvas.height; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  tamanho();
  const quadro = (rx, ry, rz) => { grupo.rotation.set(rx, ry, rz); renderer.render(cena, camera); };
  if (manual) return { quadro, trocar, tamanho };

  new ResizeObserver(tamanho).observe(canvas);
  const alvo = { x: 0, y: 0 }, at = { x: 0, y: 0 }; let visivel = true, rodando = false, t0 = performance.now(), primeiro = true, prog = 0;
  const loop = agora => {
    if (!visivel || document.hidden) { rodando = false; return; }
    const t = (agora - t0) / 1000; at.x += (alvo.x - at.x) * .06; at.y += (alvo.y - at.y) * .06;
    quadro(-.95 + at.y * .25 + prog * .6, Math.sin(t * .5) * .25 + at.x * .5 + prog * 2.2, -.62 + Math.sin(t * .7) * .04);
    grupo.position.y = Math.sin(t * 1.1) * .08;
    if (primeiro) { primeiro = false; aoPronto && aoPronto(); }
    requestAnimationFrame(loop);
  };
  const ligar = () => { if (!rodando && visivel && !document.hidden) { rodando = true; requestAnimationFrame(loop); } };
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; ligar(); }).observe(canvas);
  document.addEventListener('visibilitychange', ligar);
  (renderer.compileAsync ? renderer.compileAsync(cena, camera) : Promise.resolve()).then(ligar);
  return { inclinar: (x, y) => { alvo.x = x; alvo.y = y; }, progresso: v => { prog = v; } };
}
