// Cena 3D da Fervo 3 (cafeteira de pressão de 12 faces), escrita em código: sem .glb, sem Blender.
// A mesma cena gera o molde (4 vistas), os quadros do plano B (sem GPU) e o 3D ao vivo (com GPU).
// Unidade: centímetro. Eixo Y para cima. Bico em +X, alça em −X.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const LADOS = 12;
const suave = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const mistura = (a, b, t) => a + (b - a) * t;

// ---------- texturas procedurais (canvas) ----------
function ruido(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function texturaEscovada() { // anéis finos de escovado: rugosidade varia ao longo da altura
  const c = document.createElement('canvas'); c.width = 64; c.height = 512; const g = c.getContext('2d'); const r = ruido(7);
  for (let y = 0; y < 512; y++) { const v = 150 + r() * 70 + (r() < .06 ? -50 : 0); g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(0, y, 64, 1); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 3); return t;
}
function texturaGrao() { // café moído: grão escuro irregular
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); const r = ruido(11);
  g.fillStyle = '#3a2417'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 5200; i++) { const v = r(); g.fillStyle = v < .5 ? `rgba(20,11,6,${.5 + r() * .5})` : `rgba(${110 + r() * 40},${70 + r() * 30},${40 + r() * 20},${.35 + r() * .4})`; const s = .8 + r() * 2.2; g.fillRect(r() * 256, r() * 256, s, s); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function texturaFuros() { // placa do filtro: furos de 0,6 mm em grade hexagonal (alfa)
  const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.fillRect(0, 0, 512, 512); g.fillStyle = '#000';
  for (let y = 0, l = 0; y < 512; y += 15, l++) for (let x = (l % 2) * 7.5; x < 512; x += 15) { const dx = x - 256, dy = y - 256; if (dx * dx + dy * dy < 200 * 200) { g.beginPath(); g.arc(x, y, 3.2, 0, 7); g.fill(); } }
  return new THREE.CanvasTexture(c);
}
function texturaSombra() {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(0,0,0,.62)'); gr.addColorStop(.45, 'rgba(0,0,0,.32)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c);
}

// ---------- geometrias ----------
// Sólido facetado de revolução. perfil: [[r, y], ...] de baixo para cima (r = apótema da face).
// Faces planas na horizontal, normal suave ao longo do perfil. deformar(x, y, z, ang) opcional (bico).
function prisma(perfil, { n = LADOS, fase = 0, deformar } = {}) {
  const pos = [], nor = [], uv = [], idx = [], m = perfil.length, k = 1 / Math.cos(Math.PI / n);
  const tang = perfil.map((_, i) => { const a = perfil[Math.max(0, i - 1)], b = perfil[Math.min(m - 1, i + 1)]; const dr = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dr, dy) || 1; return [dr / l, dy / l]; });
  const acc = [0]; for (let i = 1; i < m; i++) acc.push(acc[i - 1] + Math.hypot(perfil[i][0] - perfil[i - 1][0], perfil[i][1] - perfil[i - 1][1]));
  for (let f = 0; f < n; f++) {
    const a0 = fase + f / n * Math.PI * 2, a1 = fase + (f + 1) / n * Math.PI * 2, am = (a0 + a1) / 2, base = pos.length / 3;
    for (let i = 0; i < m; i++) {
      const [r, y] = perfil[i], [tr, ty] = tang[i];
      for (const [j, a] of [[0, a0], [1, a1]]) {
        let x = Math.cos(a) * r * k, z = -Math.sin(a) * r * k, yy = y;
        if (deformar) [x, yy, z] = deformar(x, yy, z, a);
        pos.push(x, yy, z); nor.push(Math.cos(am) * ty, -tr, -Math.sin(am) * ty); uv.push((f + j) / n, acc[i] / acc[m - 1]);
      }
    }
    for (let i = 0; i < m - 1; i++) { const p0 = base + i * 2, p1 = p0 + 1, p2 = p0 + 2, p3 = p0 + 3; idx.push(p0, p1, p2, p1, p3, p2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
  return g;
}
const torno = (perfil, seg = 64) => new THREE.LatheGeometry(perfil.map(([r, y]) => new THREE.Vector2(r, y)), seg);

// ---------- materiais ----------
function materiais() {
  const escovado = texturaEscovada();
  const inox = new THREE.MeshPhysicalMaterial({ color: 0xd4d7d6, metalness: 1, roughness: .24, roughnessMap: escovado, side: THREE.DoubleSide, envMapIntensity: 1.05 });
  const inoxInterno = new THREE.MeshPhysicalMaterial({ color: 0xa9adab, metalness: 1, roughness: .5, side: THREE.DoubleSide });
  const inoxPolido = new THREE.MeshPhysicalMaterial({ color: 0xe8e9e8, metalness: 1, roughness: .14, side: THREE.DoubleSide });
  const baquelite = new THREE.MeshPhysicalMaterial({ color: 0x151515, metalness: 0, roughness: .42, clearcoat: .55, clearcoatRoughness: .3 });
  const silicone = new THREE.MeshPhysicalMaterial({ color: 0x2a2a28, metalness: 0, roughness: .85, side: THREE.DoubleSide });
  const cafe = new THREE.MeshStandardMaterial({ map: texturaGrao(), roughness: 1, metalness: 0 });
  const filtro = new THREE.MeshPhysicalMaterial({ color: 0xd6d8d7, metalness: 1, roughness: .35, alphaMap: texturaFuros(), alphaTest: .5, side: THREE.DoubleSide });
  return { inox, inoxInterno, inoxPolido, baquelite, silicone, cafe, filtro };
}

// ---------- a cafeteira ----------
// Medidas de conceito (a confirmar): altura montada ≈ 16,8 cm; maior diâmetro ≈ 9,7 cm.
export const PECAS = ['caldeira', 'funil', 'filtro', 'coletor', 'tampa'];
const SUBIDA = { caldeira: 0, funil: 7.6, filtro: 9.8, coletor: 11.4, tampa: 13.6 }; // quanto cada peça sobe na vista explodida
const NIVEIS = { caldeira: 4.8, funil: 7.22, filtro: 7.42, coletor: 13.1 };          // onde a água/café está em cada peça (y local)

function cafeteira(M) {
  const raiz = new THREE.Group(), pecas = {};
  const peca = nome => { const g = new THREE.Group(); g.name = nome; raiz.add(g); pecas[nome] = g; return g; };

  // CALDEIRA: base larga, cintura, rosca; válvula de segurança na face da frente
  const cal = peca('caldeira');
  cal.add(new THREE.Mesh(prisma([[4.32, 0], [4.52, .12], [4.6, .42], [4.42, 2.2], [4.14, 4.6], [3.96, 6.3], [3.9, 6.5], [3.86, 6.58]]), M.inox));
  cal.add(new THREE.Mesh(torno([[3.86, 6.58], [3.78, 6.62], [3.78, 6.7], [3.84, 6.76], [3.78, 6.84], [3.78, 6.92], [3.84, 6.98], [3.78, 7.06], [3.78, 7.24], [3.62, 7.26], [3.6, 7.0], [3.6, .32]]), M.inoxInterno));
  { const fundo = new THREE.Mesh(new THREE.CircleGeometry(4.3, 48), M.inoxPolido); fundo.rotation.x = Math.PI / 2; fundo.position.y = .001; cal.add(fundo);
    const piso = new THREE.Mesh(new THREE.CircleGeometry(3.6, 48), M.inoxInterno); piso.rotation.x = -Math.PI / 2; piso.position.y = .32; cal.add(piso); }
  { const v = new THREE.Group(), a = -Math.PI * 5 / 12; // válvula: corpo + porca sextavada + pino
    const corpo = new THREE.Mesh(new THREE.CylinderGeometry(.36, .4, .32, 24), M.inoxPolido); corpo.rotation.z = Math.PI / 2; corpo.position.x = .16; v.add(corpo);
    const porca = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .2, 6), M.inoxPolido); porca.rotation.z = Math.PI / 2; porca.position.x = .36; v.add(porca);
    const pino = new THREE.Mesh(new THREE.CylinderGeometry(.13, .13, .16, 16), M.inoxInterno); pino.rotation.z = Math.PI / 2; pino.position.x = .52; v.add(pino);
    const r = 4.2 * 1.0; v.position.set(Math.cos(a) * r, 4.95, -Math.sin(a) * r); v.rotation.y = a; cal.add(v); }

  // FUNIL: cesta com café, aba de apoio e tubo que desce até o fundo
  const fun = peca('funil');
  fun.add(new THREE.Mesh(torno([[.42, .75], [.46, .8], [.46, 4.62], [3.18, 5.02], [3.34, 5.16], [3.34, 7.08], [3.9, 7.14], [3.95, 7.2], [3.9, 7.3], [3.3, 7.3]], 64), M.inox));
  { const p = new THREE.Mesh(new THREE.CylinderGeometry(3.28, 3.28, .08, 64), M.cafe); p.position.y = 7.2; fun.add(p);
    const furo = new THREE.Mesh(new THREE.CircleGeometry(.36, 24), M.silicone); furo.rotation.x = Math.PI / 2; furo.position.y = .76; fun.add(furo); }

  // FILTRO + JUNTA: placa perfurada e anel de silicone
  const fil = peca('filtro');
  { const placa = new THREE.Mesh(new THREE.CylinderGeometry(3.32, 3.32, .05, 64), M.filtro); placa.position.y = 7.36; fil.add(placa);
    const aba = new THREE.Mesh(torno([[3.22, 7.33], [3.42, 7.33], [3.42, 7.4], [3.22, 7.4]], 64), M.inoxPolido); fil.add(aba);
    const junta = new THREE.Mesh(torno([[3.3, 7.42], [3.84, 7.42], [3.9, 7.5], [3.9, 7.62], [3.84, 7.7], [3.3, 7.7], [3.26, 7.56], [3.3, 7.42]], 64), M.silicone); fil.add(junta); }

  // COLETOR: saia rosqueada, corpo que abre para cima, bico na aresta da frente, chaminé interna, alça e dobradiça
  const col = peca('coletor');
  const bico = (x, y, z, a) => { const c = Math.cos(a); const s = Math.pow(Math.max(0, c), 14) * suave(13.6, 16.0, y); return [x + 1.05 * s * c, y + .22 * s, z]; };
  col.add(new THREE.Mesh(prisma([[4.12, 7.24], [4.18, 7.34], [4.18, 7.92], [4.06, 8.1], [3.98, 8.6], [4.08, 10], [4.38, 12.6], [4.72, 15.3], [4.84, 15.84], [4.8, 16.0]], { deformar: bico }), M.inox));
  col.add(new THREE.Mesh(prisma([[3.9, 8.46], [4.0, 10], [4.3, 12.6], [4.62, 15.3], [4.7, 15.96]], { deformar: bico }), M.inoxInterno));
  col.add(new THREE.Mesh(torno([[3.86, 7.24], [3.86, 8.3], [0, 8.46]], 64), M.inoxInterno));
  { const ch = new THREE.Mesh(torno([[.46, 8.4], [.46, 12.9], [.62, 13.05], [.62, 13.25], [.44, 13.25], [.4, 12.9]], 32), M.inoxPolido); col.add(ch); }
  { // alça de baquelite: forma em "7" vista de lado, extrudada com chanfro
    const s = new THREE.Shape();
    s.moveTo(0, 15.55); s.lineTo(3.3, 15.9); s.quadraticCurveTo(4.0, 15.95, 3.95, 15.2); s.lineTo(3.35, 10.6); s.quadraticCurveTo(3.25, 10.05, 2.7, 10.1);
    s.lineTo(.2, 10.55); s.lineTo(.2, 11.5); s.lineTo(2.05, 11.35); s.quadraticCurveTo(2.35, 11.35, 2.4, 11.65); s.lineTo(2.85, 14.3); s.quadraticCurveTo(2.9, 14.7, 2.5, 14.7); s.lineTo(0, 14.75); s.lineTo(0, 15.55);
    const g = new THREE.ExtrudeGeometry(s, { depth: 1.0, bevelEnabled: true, bevelThickness: .22, bevelSize: .2, bevelSegments: 4, curveSegments: 16 });
    g.translate(0, 0, -.5); const al = new THREE.Mesh(g, M.baquelite); al.rotation.y = Math.PI; al.position.x = -4.45; col.add(al);
    const pr = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 1.3), M.inoxPolido); pr.position.set(-4.62, 15.1, 0); col.add(pr); // presilha de metal
  }
  { const dob = new THREE.Mesh(new THREE.CylinderGeometry(.24, .24, 1.6, 20), M.inoxPolido); dob.rotation.x = Math.PI / 2; dob.position.set(-4.95, 16.12, 0); col.add(dob); }

  // TAMPA: disco facetado levemente abaulado + pegador de baquelite
  const tam = peca('tampa');
  tam.add(new THREE.Mesh(prisma([[0.001, 16.5], [1.6, 16.48], [3.6, 16.36], [4.62, 16.18], [4.86, 16.06], [4.86, 16.0], [4.6, 15.98]]), M.inox));
  { const peg = new THREE.Mesh(torno([[0, 16.46], [.62, 16.46], [.5, 17.0], [.56, 17.3], [.46, 17.48], [0, 17.52]], 40), M.baquelite); tam.add(peg); }

  // sombra de contato (fica no chão, com a caldeira)
  const sombra = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), new THREE.MeshBasicMaterial({ map: texturaSombra(), transparent: true, depthWrite: false }));
  sombra.rotation.x = -Math.PI / 2; sombra.position.y = -.02; sombra.renderOrder = -1; raiz.add(sombra);
  return { raiz, pecas };
}

// ---------- estado pela rolagem ----------
// p (0..1): 0 = montada (hero); a explosão vai de ~.07 a ~.42; depois fica aberta e gira devagar.
export function estado(p) {
  const e = {
    tampa: suave(.06, .34, p), coletor: suave(.07, .36, p), filtro: suave(.08, .39, p), funil: suave(.09, .42, p), caldeira: 0,
  };
  const E = suave(.05, .42, p);
  return {
    e, E,
    giro: -.55 + 1.05 * suave(0, 1, p),
    alvoY: mistura(9.0, 16.4, E), dist: mistura(57, 86, E), elev: mistura(.16, .22, E),
  };
}

// ---------- montagem do renderizador ----------
export function montar(canvas, { largura, altura, dpr = 1, alpha = true, preservar = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha, preserveDrawingBuffer: preservar, powerPreference: 'high-performance' });
  renderer.setPixelRatio(dpr); renderer.setSize(largura, altura, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0; renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  const cena = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer); cena.environment = pm.fromScene(new RoomEnvironment(), .03).texture; pm.dispose();
  const luz = new THREE.DirectionalLight(0xfff6ea, .7); luz.position.set(6, 18, 12); cena.add(luz);
  const recorte = new THREE.DirectionalLight(0xe6efe8, .8); recorte.position.set(-10, 8, -6); cena.add(recorte);
  const M = materiais(); const { raiz, pecas } = cafeteira(M); cena.add(raiz);
  const camera = new THREE.PerspectiveCamera(24, largura / altura, 1, 400);
  const caixa = new THREE.Box3(), v = new THREE.Vector3();

  let giroExtra = 0, inclinar = 0;
  function aplicar(p, { giro = null } = {}) {
    const s = estado(p);
    for (const n of PECAS) pecas[n].position.y = SUBIDA[n] * s.e[n];
    raiz.rotation.y = (giro ?? s.giro) + giroExtra;
    const el = s.elev + inclinar;
    camera.position.set(0, s.alvoY + Math.sin(el) * s.dist, Math.cos(el) * s.dist); camera.lookAt(0, s.alvoY, 0); camera.updateMatrixWorld();
    raiz.updateMatrixWorld(true);
    return s;
  }
  // posições na tela (0..1) de cada peça e dos níveis da água, para as cotas e a linha d'água em HTML
  function pontos() {
    const tela = p3 => { v.copy(p3).project(camera); return [(v.x + 1) / 2, (1 - v.y) / 2]; };
    const out = { pecas: {}, agua: {} };
    for (const n of PECAS) {
      caixa.setFromObject(pecas[n]);
      let x0 = 1, x1 = 0, y0 = 1, y1 = 0;
      for (const cx of [caixa.min.x, caixa.max.x]) for (const cy of [caixa.min.y, caixa.max.y]) for (const cz of [caixa.min.z, caixa.max.z]) { const [x, y] = tela(v.set(cx, cy, cz)); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
      out.pecas[n] = [x0, y0, x1, y1].map(q => +q.toFixed(4));
    }
    for (const [n, y] of Object.entries(NIVEIS)) out.agua[n] = +tela(new THREE.Vector3(0, y + pecas[n].position.y, 0))[1].toFixed(4);
    return out;
  }
  const render = () => renderer.render(cena, camera);
  const redimensionar = (w, h, d = dpr) => { renderer.setPixelRatio(d); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  // vistas do molde e da ficha (câmera quase ortográfica)
  function vista(nome) {
    for (const n of PECAS) pecas[n].position.y = 0;
    const cfg = { frente: [-Math.PI / 2, .0], perfil: [0, .0], tresquartos: [-.55, .3], topo: [-.55, 1.45] }[nome];
    raiz.rotation.y = cfg[0];
    const d = 160, el = cfg[1]; camera.fov = 7.8; camera.updateProjectionMatrix();
    const cx = nome === 'perfil' ? -1.3 : 0; camera.position.set(cx, 8.4 + Math.sin(el) * d, Math.cos(el) * d); camera.lookAt(cx, 8.4, 0); camera.updateMatrixWorld(); raiz.updateMatrixWorld(true);
  }
  const normal = () => { camera.fov = 24; camera.updateProjectionMatrix(); };
  return {
    renderer, cena, camera, aplicar, pontos, render, redimensionar, vista, normal,
    set giroExtra(v) { giroExtra = v; }, get giroExtra() { return giroExtra; },
    set inclinar(v) { inclinar = v; },
    info: () => renderer.info.render,
  };
}
