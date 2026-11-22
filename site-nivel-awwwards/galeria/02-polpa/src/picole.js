// Picolé 3D real (three.js): corpo extrudado com bisel, textura de fruta procedural, marca "POLPA" em relevo,
// palito de madeira com veio, material PBR com brilho de gelo, ambiente PMREM + ACES.
// Usos: (1) ao vivo no hero; (2) modo manual para renderizar os "adesivos" de produto (gerar-renders.mjs).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export const SABORES = {
  morango: { base: '#e3304a', escuro: '#9e1430', claro: '#ff8a9a', pontos: '#f7d36b', tipo: 'sementes' },
  manga: { base: '#ffa514', escuro: '#e0700a', claro: '#ffd36b', pontos: '#ffe7a3', tipo: 'pedacos' },
  maracuja: { base: '#ffcc2e', escuro: '#e89a0c', claro: '#fff0a0', pontos: '#2a1406', tipo: 'sementes' },
  limao: { base: '#8fd64a', escuro: '#4f9a1e', claro: '#d9f7a0', pontos: '#f4ffd8', tipo: 'raspas' },
  coco: { base: '#eadcc4', escuro: '#cdb48e', claro: '#f7efe2', pontos: '#fffaf0', tipo: 'flocos' },
  acai: { base: '#4e1752', escuro: '#2a0a2e', claro: '#8a3a8e', pontos: '#c9a2cf', tipo: 'pedacos' },
};

const rnd = (() => { let s = 11; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
const tela = (w, h, fn, cor = true) => {
  const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); if (cor) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};

function texturaFruta(s) {
  return tela(1024, 1024, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, s.base); gr.addColorStop(.2, s.claro + 'ff'); gr.addColorStop(.45, s.base); gr.addColorStop(1, s.escuro);
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    // nuvens de polpa (variação de cor)
    for (let i = 0; i < 140; i++) { const x = rnd() * w, y = rnd() * h, r = 20 + rnd() * 90; const rg = g.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, (rnd() > .5 ? s.claro : s.escuro) + '55'); rg.addColorStop(1, s.base + '00'); g.fillStyle = rg; g.fillRect(x - r, y - r, r * 2, r * 2); }
    // inclusões
    const n = s.tipo === 'sementes' ? 700 : s.tipo === 'pedacos' ? 90 : s.tipo === 'raspas' ? 400 : 260;
    for (let i = 0; i < n; i++) {
      const x = rnd() * w, y = rnd() * h; g.save(); g.translate(x, y); g.rotate(rnd() * 6.28);
      if (s.tipo === 'sementes') { g.fillStyle = s.pontos; g.beginPath(); g.ellipse(0, 0, 3 + rnd() * 2, 1.6 + rnd(), 0, 0, 7); g.fill(); }
      else if (s.tipo === 'pedacos') { const r = 10 + rnd() * 26; g.fillStyle = s.pontos + 'aa'; g.beginPath(); for (let k = 0; k < 7; k++) { const a = k / 7 * 6.28, rr = r * (.6 + rnd() * .5); g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.fill(); }
      else if (s.tipo === 'raspas') { g.fillStyle = s.pontos + 'cc'; g.fillRect(-6, -1, 12 + rnd() * 10, 2); }
      else { g.fillStyle = s.pontos + 'dd'; g.fillRect(-4, -2, 8 + rnd() * 8, 3 + rnd() * 3); }
      g.restore();
    }
  });
}
// relevo: textura de alturas com a marca e microcristais de gelo
function texturaRelevo() {
  return tela(1024, 1024, (g, w, h) => {
    g.fillStyle = '#808080'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) { const v = 110 + rnd() * 50 | 0; g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(rnd() * w, rnd() * h, 2, 2); }
    g.save(); g.translate(w / 2, h * .46); g.rotate(-Math.PI / 2);
    g.font = '900 170px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#d8d8d8'; g.fillText('POLPA', 0, 0); g.restore();
  }, false);
}
function texturaMadeira() {
  return tela(256, 1024, (g, w, h) => {
    g.fillStyle = '#e2c08c'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 60; i++) { g.strokeStyle = `rgba(${150 + rnd() * 40 | 0},${105 + rnd() * 30 | 0},${60 + rnd() * 20 | 0},${.15 + rnd() * .25})`; g.lineWidth = 1 + rnd() * 3;
      const x = rnd() * w; g.beginPath(); g.moveTo(x, 0); for (let y = 0; y <= h; y += 32) g.lineTo(x + Math.sin(y / 90 + i) * 6, y); g.stroke(); }
  });
}

function formaArredondada(w, h, rTopo, rBase) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + rBase, y); s.lineTo(x + w - rBase, y); s.quadraticCurveTo(x + w, y, x + w, y + rBase);
  s.lineTo(x + w, y + h - rTopo); s.quadraticCurveTo(x + w, y + h, x + w - rTopo, y + h);
  s.lineTo(x + rTopo, y + h); s.quadraticCurveTo(x, y + h, x, y + h - rTopo);
  s.lineTo(x, y + rBase); s.quadraticCurveTo(x, y, x + rBase, y); return s;
}
// UV planar (frente/verso) para as faces extrudadas
function uvPlanar(geo, w, h) {
  const p = geo.attributes.position, uv = geo.attributes.uv; geo.computeVertexNormals(); const n = geo.attributes.normal;
  // frente/verso: projeção XY; laterais: projeção ZY (evita listras esticadas)
  for (let i = 0; i < p.count; i++) { const lado = Math.abs(n.getZ(i)) < .6; uv.setXY(i, lado ? .5 + p.getZ(i) * 1.4 + p.getX(i) * .15 : p.getX(i) / w + .5, p.getY(i) / h + .5); }
  uv.needsUpdate = true;
}

export function montarPicole(canvas, { sabor = 'morango', manual = false, aoPronto } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: manual });
  renderer.setPixelRatio(manual ? 1 : Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .9;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const cena = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  cena.environment = pm.fromScene(new RoomEnvironment(), .04).texture; pm.dispose();
  const camera = new THREE.PerspectiveCamera(28, 1, .1, 50); camera.position.set(0, .2, 7.2); camera.lookAt(0, -.2, 0);
  const luz = new THREE.DirectionalLight(0xffffff, 2.2); luz.position.set(3, 4, 5); cena.add(luz);
  const contra = new THREE.DirectionalLight(0xffe0f0, 1.2); contra.position.set(-4, 1, -3); cena.add(contra);

  const W = 1.15, H = 1.75, D = .34;
  const corpoGeo = new THREE.ExtrudeGeometry(formaArredondada(W, H, .52, .16), { depth: D, bevelEnabled: true, bevelThickness: .09, bevelSize: .08, bevelSegments: 8, curveSegments: 48 });
  corpoGeo.translate(0, 0, -D / 2); uvPlanar(corpoGeo, W + .2, H + .2);
  const relevo = texturaRelevo();
  const mat = new THREE.MeshPhysicalMaterial({ roughness: .42, clearcoat: .55, clearcoatRoughness: .35, sheen: .4, sheenRoughness: .6, bumpMap: relevo, bumpScale: 4 });
  const corpo = new THREE.Mesh(corpoGeo, mat); corpo.position.y = .35;

  const pW = .26, pH = 1.3, pD = .06;
  const palitoGeo = new THREE.ExtrudeGeometry(formaArredondada(pW, pH, .13, .13), { depth: pD, bevelEnabled: true, bevelThickness: .012, bevelSize: .012, bevelSegments: 2, curveSegments: 16 });
  palitoGeo.translate(0, 0, -pD / 2); uvPlanar(palitoGeo, pW, pH);
  const palito = new THREE.Mesh(palitoGeo, new THREE.MeshStandardMaterial({ map: texturaMadeira(), roughness: .8 }));
  palito.position.y = -.9;

  const picole = new THREE.Group(); picole.add(palito, corpo); cena.add(picole);
  const texturas = {};
  const trocar = s => { mat.map = texturas[s] ||= texturaFruta(SABORES[s]); mat.needsUpdate = true; };
  trocar(sabor);

  const tamanho = () => { const w = canvas.clientWidth || canvas.width, h = canvas.clientHeight || canvas.height; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  tamanho();

  const quadro = (ry, rx = 0, rz = 0) => { picole.rotation.set(rx, ry, rz); renderer.render(cena, camera); };
  if (manual) return { quadro, trocar, tamanho };

  new ResizeObserver(tamanho).observe(canvas);
  const alvo = { x: 0, y: 0 }, at = { x: 0, y: 0 }; let visivel = true, rodando = false, t0 = performance.now(), primeiro = true, giroExtra = 0;
  const loop = agora => {
    if (!visivel || document.hidden) { rodando = false; return; }
    const t = (agora - t0) / 1000; at.x += (alvo.x - at.x) * .07; at.y += (alvo.y - at.y) * .07;
    quadro(Math.sin(t * .6) * .45 + at.x * .7 + giroExtra, at.y * .25, Math.sin(t * .9) * .06);
    picole.position.y = Math.sin(t * 1.3) * .05;
    if (primeiro) { primeiro = false; aoPronto && aoPronto(); }
    requestAnimationFrame(loop);
  };
  const ligar = () => { if (!rodando && visivel && !document.hidden) { rodando = true; requestAnimationFrame(loop); } };
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; ligar(); }).observe(canvas);
  document.addEventListener('visibilitychange', ligar);
  (renderer.compileAsync ? renderer.compileAsync(cena, camera) : Promise.resolve()).then(ligar);
  return { inclinar: (x, y) => { alvo.x = x; alvo.y = y; }, trocar, girar: g => { giroExtra = g; } };
}
