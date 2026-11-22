// OLEA — sabonete artesanal de azeite em 3D (modelo próprio, three.js). Ocupa o papel do porta-copos de cortiça do Oryzo:
// disco com borda alta arredondada e miolo rebaixado com o carimbo "OLEA" e um ramo de oliveira em baixo-relevo.
// Massa cor de marfim-oliva com pintas de aveia e ervas, microtextura de sabão cortado e brilho acetinado.
// Uso: renderizado em quadros WebP com transparência (gerar-renders.mjs); o site não carrega three.js.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(424242);
const tela = (w, h, fn, cor = true) => {
  const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); if (cor) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
};

// massa do sabão: marfim-oliva com nuvens de tom, pintas de aveia, flocos de ervas e bolhinhas de ar
export const VARIANTES = {
  oliva: { base: '#bdb48a', claro: '#d3cba4', escuro: '#a19867', aveia: '#8a7146', erva: '#4b5824', ar: '#e3dcc0' },
  lavanda: { base: '#a99bb6', claro: '#c2b6cd', escuro: '#8c7d9c', aveia: '#6b5a7e', erva: '#4d3f5c', ar: '#ddd4e4' },
  carvao: { base: '#3a3936', claro: '#4d4c48', escuro: '#2a2927', aveia: '#5c5a55', erva: '#1d1c1a', ar: '#6e6c66' },
  argila: { base: '#c98f78', claro: '#dba892', escuro: '#ad7560', aveia: '#8d5a44', erva: '#6c4030', ar: '#ecc8b6' },
  curcuma: { base: '#d6a842', claro: '#e7c26a', escuro: '#b98c2a', aveia: '#8f6a1c', erva: '#6b4f12', ar: '#f1dc9c' },
};
const PALETA = { base: '#bdb48a', claro: '#d3cba4', escuro: '#a19867', aveia: '#8a7146', erva: '#4b5824', ar: '#e3dcc0' };
export function texturaMassa(pal = PALETA) {
  return tela(1024, 1024, (g, w, h) => {
    g.fillStyle = pal.base; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 220; i++) { const x = rnd() * w, y = rnd() * h, r = 30 + rnd() * 120, rg = g.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, (rnd() > .5 ? pal.claro : pal.escuro) + '40'); rg.addColorStop(1, pal.base + '00'); g.fillStyle = rg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
    for (let i = 0; i < 3200; i++) { g.fillStyle = pal.aveia + (rnd() > .5 ? 'aa' : '66'); const s = .8 + rnd() * 2.2; g.beginPath(); g.ellipse(rnd() * w, rnd() * h, s, s * (.5 + rnd() * .5), rnd() * 3, 0, 7); g.fill(); }
    for (let i = 0; i < 900; i++) { g.save(); g.translate(rnd() * w, rnd() * h); g.rotate(rnd() * 6.28); g.fillStyle = pal.erva + (rnd() > .4 ? 'cc' : '77'); g.fillRect(-2, -.8, 3 + rnd() * 5, 1.4 + rnd()); g.restore(); }
    for (let i = 0; i < 260; i++) { g.fillStyle = pal.ar + '99'; g.beginPath(); g.arc(rnd() * w, rnd() * h, .6 + rnd() * 1.2, 0, 7); g.fill(); }
  });
}
// alturas do miolo: microtextura + carimbo OLEA e ramo de oliveira (claro = alto; o carimbo afunda)
function texturaCarimbo() {
  return tela(1024, 1024, (g, w, h) => {
    g.fillStyle = '#8a8a8a'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 14000; i++) { const v = 120 + rnd() * 30 | 0; g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(rnd() * w, rnd() * h, 2, 2); }
    g.fillStyle = '#3a3a3a'; g.strokeStyle = '#3a3a3a';
    g.font = '600 150px "Instrument Sans", "Helvetica Neue", Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.save(); g.translate(w / 2, h / 2 - 40); g.scale(1.05, 1); g.fillText('OLEA', 0, 0); g.restore();
    g.font = '500 34px "Instrument Sans", Arial, sans-serif'; g.fillText('AZEITE  ·  FEITO À MÃO', w / 2, h / 2 + 70);
    // ramo de oliveira em arco embaixo
    g.lineWidth = 6; g.beginPath(); g.arc(w / 2, h / 2 + 40, 300, Math.PI * .22, Math.PI * .78); g.stroke();
    for (let k = 0; k < 11; k++) { const a = Math.PI * (.24 + k * .05), x = w / 2 + Math.cos(a) * 300, y = h / 2 + 40 + Math.sin(a) * 300;
      for (const lado of [-1, 1]) { g.save(); g.translate(x, y); g.rotate(a + Math.PI / 2 + lado * .9); g.beginPath(); g.ellipse(0, 22, 9, 26, 0, 0, 7); g.fill(); g.restore(); } }
    // anel fino na borda do miolo
    g.lineWidth = 5; g.beginPath(); g.arc(w / 2, h / 2, 470, 0, 7); g.stroke();
  }, false);
}
function texturaMicro() {
  return tela(512, 512, (g, w, h) => {
    g.fillStyle = '#808080'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) { const v = 105 + rnd() * 50 | 0; g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2); }
    g.strokeStyle = 'rgba(70,70,70,.5)'; for (let i = 0; i < 40; i++) { g.lineWidth = .6 + rnd(); g.beginPath(); let x = rnd() * w, y = rnd() * h; g.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (rnd() - .5) * 40; y += (rnd() - .5) * 40; g.lineTo(x, y); } g.stroke(); }
  }, false);
}

// perfil do torno (raio, altura): base com bisel, parede levemente abaulada, borda arredondada e rebaixo
function perfil() {
  const p = [];
  p.push([0, 0], [.9, 0]);
  for (let i = 0; i <= 6; i++) { const a = -Math.PI / 2 + i / 6 * Math.PI / 2; p.push([.9 + Math.cos(a) * .08, .08 + Math.sin(a) * .08]); }
  for (let i = 1; i <= 8; i++) { const t = i / 8; p.push([.98 + Math.sin(t * Math.PI) * .012, .08 + t * .26]); }
  for (let i = 1; i <= 12; i++) { const a = i / 12 * Math.PI; p.push([.9 + Math.cos(a) * .08, .34 + Math.sin(a) * .07]); } // lábio arredondado
  for (let i = 1; i <= 6; i++) { const t = i / 6; p.push([.82 - t * .03, .34 - Math.sin(t * Math.PI / 2) * .09]); }      // desce para o miolo
  p.push([.78, .25]);
  return p.map(([x, y]) => new THREE.Vector2(x, y));
}

export function montarSabonete(canvas, { manual = true } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: manual });
  renderer.setPixelRatio(1); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .72; renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  const cena = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer); cena.environment = pm.fromScene(new RoomEnvironment(), .04).texture; pm.dispose(); cena.environmentIntensity = .38;
  const camera = new THREE.PerspectiveCamera(24, 1, .1, 50);
  const chave = new THREE.DirectionalLight(0xfff1dc, 1.5); chave.position.set(-3, 5, 4); cena.add(chave);
  const recorte = new THREE.DirectionalLight(0xffc98a, 2.2); recorte.position.set(4, 1.5, -3); cena.add(recorte);
  const baixo = new THREE.DirectionalLight(0x9fb0a0, .35); baixo.position.set(0, -4, 2); cena.add(baixo);

  const massa = texturaMassa(), micro = texturaMicro();
  massa.repeat.set(2, 1); micro.repeat.set(6, 2);
  const matCorpo = new THREE.MeshPhysicalMaterial({ map: massa, roughness: .58, sheen: .5, sheenColor: new THREE.Color('#fff6dc'), sheenRoughness: .5, clearcoat: .08, clearcoatRoughness: .6, bumpMap: micro, bumpScale: 2.2 });
  const corpo = new THREE.Mesh(new THREE.LatheGeometry(perfil(), 160), matCorpo);
  // miolo: disco com UV planar (carimbo centrado)
  const miolo = new THREE.Mesh(new THREE.CircleGeometry(.785, 160), new THREE.MeshPhysicalMaterial({ map: texturaMassa(), roughness: .62, sheen: .45, sheenColor: new THREE.Color('#fff6dc'), clearcoat: .06, bumpMap: texturaCarimbo(), bumpScale: 14 }));
  miolo.rotation.x = -Math.PI / 2; miolo.position.y = .251;
  const sab = new THREE.Group(); sab.add(corpo, miolo); sab.position.y = -.17; // centro de massa na origem
  const pivo = new THREE.Group(); pivo.add(sab); cena.add(pivo);

  const tamanho = (w = canvas.width, h = canvas.height) => { renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  tamanho();
  // inclinação: rx 0 = visto de cima (como o primeiro plano do original); rx ~1.2 = de lado
  const quadro = ({ rx = 0, ry = 0, rz = 0, dist = 6.4, alvoY = 0 } = {}) => {
    camera.position.set(0, dist, .001); camera.lookAt(0, alvoY, 0);
    pivo.rotation.set(rx, ry, rz); renderer.render(cena, camera);
  };
  const trocarCor = nome => { const t = texturaMassa(VARIANTES[nome]); t.repeat.set(2, 1); matCorpo.map = t; matCorpo.needsUpdate = true; miolo.material.map = texturaMassa(VARIANTES[nome]); miolo.material.needsUpdate = true; };
  return { quadro, tamanho, cena, pivo, renderer, camera, trocarCor };
}
