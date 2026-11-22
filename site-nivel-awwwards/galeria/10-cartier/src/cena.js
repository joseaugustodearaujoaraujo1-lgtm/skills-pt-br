// Exposição TURMALINA em three.js: nove dioramas, um por capítulo, com joias modeladas aqui.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const tela = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
const semente = s => () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };

// ---------- materiais ----------
const ouro = new THREE.MeshPhysicalMaterial({ color: '#e8c27a', metalness: 1, roughness: .16, clearcoat: .4 });
const ouroRose = new THREE.MeshPhysicalMaterial({ color: '#e9b49a', metalness: 1, roughness: .18 });
const aco = new THREE.MeshPhysicalMaterial({ color: '#d7dadf', metalness: 1, roughness: .22 });
const couro = new THREE.MeshStandardMaterial({ color: '#1c1512', roughness: .55 });
const gema = (cor, atenua) => new THREE.MeshPhysicalMaterial({ color: cor, metalness: 0, roughness: 0, transmission: 1, thickness: .6, ior: 1.62, attenuationColor: new THREE.Color(atenua || cor), attenuationDistance: .25, iridescence: .3, specularIntensity: 1, envMapIntensity: 2.2, flatShading: true });

// lapidação brilhante: coroa + pavilhão em torno (faces chapadas)
function brilhante(r = .3, cor = '#2fb39a') {
  const pts = [V(0, -r * .86, 0), V(r * .98, -r * .02, 0), V(r, 0, 0), V(r * .62, r * .3, 0), V(0, r * .32, 0)].map(v => new THREE.Vector2(v.x, v.y));
  const g = new THREE.LatheGeometry(pts, 16); g.computeVertexNormals();
  return new THREE.Mesh(g, gema(cor));
}
// relógio-joia retangular
function relogioRet({ w = .5, h = .66, metal = ouro, mostrador = '#f3efe6', pulseira = couro, janelas = false, pedra = null } = {}) {
  const g = new THREE.Group();
  const caixa = new THREE.Mesh(new RoundedBoxGeometry(w, h, .1, 3, .03), metal); g.add(caixa);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w * .78, h * .8), new THREE.MeshPhysicalMaterial({ map: tela(256, 330, (c, W, H) => {
    c.fillStyle = mostrador; c.fillRect(0, 0, W, H);
    c.strokeStyle = '#1b1b1b'; c.lineWidth = 2; c.strokeRect(14, 14, W - 28, H - 28);
    if (janelas) { c.fillStyle = '#111'; c.fillRect(W * .2, H * .38, W * .25, H * .14); c.fillRect(W * .55, H * .38, W * .25, H * .14); c.fillStyle = '#fff'; c.font = '600 30px serif'; c.fillText('10', W * .23, H * .49); c.fillText('08', W * .58, H * .49); }
    else { c.fillStyle = '#1b1b1b'; c.font = '28px serif'; c.textAlign = 'center'; ['XII', 'III', 'VI', 'IX'].forEach((t, i) => { const a = i * Math.PI / 2 - Math.PI / 2; c.fillText(t, W / 2 + Math.cos(a) * W * .32, H / 2 + Math.sin(a) * H * .36 + 10); }); c.beginPath(); c.moveTo(W / 2, H / 2); c.lineTo(W / 2 + 30, H / 2 - 60); c.moveTo(W / 2, H / 2); c.lineTo(W / 2 - 50, H / 2 + 10); c.lineWidth = 4; c.stroke(); }
  }), roughness: .3, clearcoat: 1 }));
  face.position.z = .051; g.add(face);
  const coroa = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .05, 12), metal); coroa.rotation.z = Math.PI / 2; coroa.position.x = w / 2 + .02; g.add(coroa);
  if (pedra) { const p = brilhante(.035, pedra); p.rotation.z = -Math.PI / 2; p.position.x = w / 2 + .06; g.add(p); }
  [1, -1].forEach(s => { const pul = new THREE.Mesh(new RoundedBoxGeometry(w * .72, h * .62, .035, 2, .012), pulseira); pul.position.set(0, s * (h / 2 + h * .26), -.06); pul.rotation.x = s * .55; g.add(pul); });
  return g;
}
// bracelete de contas trançado
function bracelete(r = .42, cont = 26) {
  const g = new THREE.Group();
  const aro = new THREE.Mesh(new THREE.TorusGeometry(r, .05, 16, 80), new THREE.MeshPhysicalMaterial({ color: '#0d0d0f', roughness: .08, clearcoat: 1 })); g.add(aro);
  for (let i = 0; i < cont; i++) { const a = i / cont * Math.PI * 2; [1, -1].forEach(s => { const b = new THREE.Mesh(new THREE.SphereGeometry(.03, 16, 12), ouro); b.position.set(Math.cos(a) * r, Math.sin(a) * r, s * .055); g.add(b); }); }
  return g;
}
// anel com gema
function anel(cor = '#25c6c0') { const g = new THREE.Group(); const aro = new THREE.Mesh(new THREE.TorusGeometry(.26, .035, 20, 90), ouro); g.add(aro); const p = brilhante(.17, cor); p.position.y = .34; g.add(p); [0, 1, 2, 3].forEach(i => { const garra = new THREE.Mesh(new THREE.CylinderGeometry(.012, .016, .12, 8), ouro); const a = i * Math.PI / 2 + Math.PI / 4; garra.position.set(Math.cos(a) * .14, .32, Math.sin(a) * .14); g.add(garra); }); return g; }

// texto em relevo a partir de canvas (camadas para dar espessura)
function letreiro(linhas, w = 6, h = 2.4) {
  const g = new THREE.Group();
  // letras em caixa alta, serifadas, brancas com contorno escuro; placas de luz atrás de cada linha; camadas para a espessura
  const tex = (modo) => tela(1600, 640, (c, W, H) => {
    c.clearRect(0, 0, W, H); c.font = '500 205px "Cormorant Garamond", Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    linhas.forEach((l, i) => {
      const y = H / 2 + (i - (linhas.length - 1) / 2) * 225, lw = c.measureText(l).width;
      if (modo === 'placa') { c.fillStyle = 'rgba(255,252,246,.55)'; c.fillRect(W / 2 - lw / 2 - 30, y - 95, lw + 60, 190); return; }
      if (modo === 'frente') { c.fillStyle = '#ffffff'; c.fillText(l, W / 2, y); c.lineWidth = 6; c.strokeStyle = '#5e4d3a'; c.strokeText(l, W / 2, y); }
      else { c.fillStyle = '#b7a385'; c.fillText(l, W / 2, y); }
    });
  });
  const placa = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex('placa'), transparent: true, depthWrite: false, toneMapped: false, fog: false })); placa.position.z = -.25; g.add(placa);
  const lado = tex('lado'), frente = tex('frente');
  for (let k = 0; k < 8; k++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: k === 7 ? frente : lado, transparent: true, depthWrite: false, toneMapped: false, fog: false })); m.position.set(-k * .004, -k * .004, k * .014); g.add(m); }
  return g;
}

export function criarCena(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .82;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer); scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
  const camera = new THREE.PerspectiveCamera(36, 1, .05, 200);
  const hemi = new THREE.HemisphereLight('#ffe9cc', '#7d6248', 1.0); scene.add(hemi);
  const sol = new THREE.DirectionalLight('#ffe2b8', 2.2); sol.position.set(-3, 5, 4); scene.add(sol);
  const recorte = new THREE.PointLight('#ffffff', 8, 6); recorte.position.set(1.2, 1.4, 1.2); scene.add(recorte);

  const grupos = [];
  const novo = () => { const g = new THREE.Group(); g.visible = false; scene.add(g); grupos.push(g); return g; };
  const sala = (g, cor, piso, w = 14, d = 16, h = 7) => {
    const m = new THREE.MeshStandardMaterial({ color: cor, roughness: .92, side: THREE.BackSide });
    const caixa = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); caixa.position.set(0, h / 2 - 1.2, -d / 2 + 4); g.add(caixa);
    const chao = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ color: piso, roughness: .85 })); chao.rotation.x = -Math.PI / 2; chao.position.set(0, -1.19, -d / 2 + 4); g.add(chao);
  };
  const arco = (w, h) => { const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(-w / 2, h - w / 2); s.absarc(0, h - w / 2, w / 2, Math.PI, 0, true); s.lineTo(w / 2, 0); return new THREE.ShapeGeometry(s, 24); };

  // 0. abertura: sala bege com três arcos de luz e o letreiro
  const g0 = novo(); sala(g0, '#e2c9a8', '#cfb08a');
  [-3.2, 0, 3.2].forEach(x => { const a = new THREE.Mesh(arco(2.2, 4.2), new THREE.MeshBasicMaterial({ color: '#fff1dc', toneMapped: false })); a.position.set(x, -1.18, -11.9); g0.add(a); });
  [-6.9, 6.9].forEach(x => { for (let z = -2; z > -10; z -= 3) { const a = new THREE.Mesh(arco(1.6, 3.6), new THREE.MeshStandardMaterial({ color: '#dccdb6', roughness: .9 })); a.position.set(x, -1.18, z); a.rotation.y = x > 0 ? -Math.PI / 2 : Math.PI / 2; g0.add(a); } });
  const placa = letreiro(['GEMAS', '& MARAVILHAS'], 5.2, 2.08); placa.position.set(0, .35, -5); g0.add(placa);

  // 1. onça: corredor com cortinas e coluna de quadrados de ouro
  const g1 = novo(); sala(g1, '#e9d8bd', '#d9c4a3', 10, 22);
  const cortina = new THREE.MeshStandardMaterial({ color: '#f3e6d2', roughness: .95, side: THREE.DoubleSide, transparent: true, opacity: .92 });
  [-3.4, 3.4].forEach(x => { const geo = new THREE.PlaneGeometry(18, 7, 160, 1); const p = geo.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 4.2) * .12); geo.computeVertexNormals(); const m = new THREE.Mesh(geo, cortina); m.rotation.y = x > 0 ? -Math.PI / 2 : Math.PI / 2; m.position.set(x, 2.3, -6); g1.add(m); });
  for (let r = 0; r < 9; r++) for (let c = 0; c < 2; c++) { if ((r + c) % 2) continue; const q = new THREE.Mesh(new RoundedBoxGeometry(.42, .42, .08, 2, .04), ouro); q.position.set(c * .46 - .23, -1 + r * .46, -2.2); g1.add(q); }
  const j1 = relogioRet({ w: .3, h: .36, mostrador: '#e9f2ea', pulseira: ouro, pedra: '#2fb36b' }); j1.scale.setScalar(.8); j1.position.set(0, .2, -1.9); g1.add(j1);

  // 2. baguete: coluna de placas de ouro arredondadas
  const g2 = novo(); sala(g2, '#e6d4b8', '#d5c09f');
  [[-0.55, 2.2], [0, 2.6], [.55, 2.2], [-.55, .9], [0, 1.3], [.55, .9], [-.55, -.4], [0, 0], [.55, -.4]].forEach(([x, y]) => { const t = new THREE.Mesh(new RoundedBoxGeometry(.46, .9, .07, 3, .08), ouro); t.position.set(x, y - .3, -2.6); g2.add(t); });
  const j2 = relogioRet({ w: .22, h: .3, metal: ouroRose, mostrador: '#f6d8de' }); j2.position.set(0, .05, -2.45); j2.scale.setScalar(.8); g2.add(j2);

  // 3. molduras: sala escura e molduras de ouro concêntricas
  const g3 = novo(); sala(g3, '#2a170c', '#3a2112');
  for (let k = 0; k < 7; k++) { const w = 1 + k * .42, h = 1.5 + k * .5, r = .2 + k * .04; const s = new THREE.Shape(); s.moveTo(-w / 2 + r, -h / 2); s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r); s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); s.lineTo(-w / 2 + r, h / 2); s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    const curva = new THREE.CatmullRomCurve3(s.getSpacedPoints(120).map(p => V(p.x, p.y, 0)), true);
    const tubo = new THREE.Mesh(new THREE.TubeGeometry(curva, 240, .018, 8, true), new THREE.MeshPhysicalMaterial({ color: '#f1cf8e', metalness: 1, roughness: .2, emissive: '#5a3a10', emissiveIntensity: .6 })); tubo.position.set(0, .4, -2.4 - k * .55); g3.add(tubo); }
  const j3 = relogioRet({ w: .34, h: .44 }); j3.position.set(0, .4, -2); g3.add(j3);

  // 4. janelas: sala bege com cartões curvos flutuando
  const g4 = novo(); sala(g4, '#d8c9b2', '#cbb79a');
  const r4 = semente(9);
  for (let i = 0; i < 4; i++) { const geo = new THREE.PlaneGeometry(1.2, .8, 20, 1); const p = geo.attributes.position; for (let k = 0; k < p.count; k++) p.setZ(k, Math.pow(p.getX(k), 2) * .5); const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, map: tela(512, 340, (c, W, H) => { c.fillStyle = '#e8e4dd'; c.fillRect(0, 0, W, H); c.strokeStyle = '#444'; c.lineWidth = 2; for (let n = 0; n < 40; n++) { c.globalAlpha = .2 + r4() * .5; c.strokeRect(r4() * W, r4() * H, 20 + r4() * 120, 10 + r4() * 80); } c.globalAlpha = 1; c.strokeStyle = '#111'; c.lineWidth = 10; c.strokeRect(0, 0, W, H); }), roughness: .7 })); m.position.set([-1.6, 1.6, -1.1, 1.3][i], [1.2, .5, -.3, 1.6][i], -3 - i * .3); m.rotation.set(.2 * (i % 2 ? 1 : -1), (i % 2 ? -.5 : .5), (i - 1.5) * .3); g4.add(m); }
  const j4 = relogioRet({ w: .3, h: .42, metal: aco, janelas: true }); j4.position.set(0, .4, -2.6); g4.add(j4);

  // 5. vitrine: sala cinza com um nicho iluminado
  const g5 = novo(); sala(g5, '#cbc4bb', '#c2bab0');
  const nicho = new THREE.Mesh(new THREE.BoxGeometry(.9, .55, .5), new THREE.MeshStandardMaterial({ color: '#8f877c', roughness: .8, side: THREE.BackSide })); nicho.position.set(0, .5, -3); g5.add(nicho);
  const topoN = new THREE.Mesh(new THREE.BoxGeometry(1, .04, .6), new THREE.MeshStandardMaterial({ color: '#f4f1ec' })); topoN.position.set(0, .8, -3); g5.add(topoN);
  const j5 = relogioRet({ w: .12, h: .14, pedra: '#2fa84a' }); j5.scale.setScalar(.9); j5.position.set(0, .45, -2.9); g5.add(j5);

  // 6. noite: céu estrelado com lua
  const g6 = novo();
  const estrelas = new THREE.BufferGeometry(); const pos = []; const r6 = semente(3); for (let i = 0; i < 2500; i++) { const a = r6() * Math.PI * 2, b = r6() * 1.2 - .2, R = 40; pos.push(Math.cos(a) * R * Math.cos(b), Math.sin(b) * R, Math.sin(a) * R * Math.cos(b) - 10); }
  estrelas.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g6.add(new THREE.Points(estrelas, new THREE.PointsMaterial({ color: '#fff', size: .06 })));
  const lua = new THREE.Mesh(new THREE.CircleGeometry(.35, 48), new THREE.MeshBasicMaterial({ color: '#f5efe2', toneMapped: false })); lua.position.set(0, .4, -6); g6.add(lua);
  const halo = new THREE.Mesh(new THREE.CircleGeometry(1.4, 48), new THREE.MeshBasicMaterial({ color: '#8fa0c8', transparent: true, opacity: .12, depthWrite: false })); halo.position.set(0, .4, -6.05); g6.add(halo);
  const dunas = new THREE.Mesh(new THREE.PlaneGeometry(60, 30, 80, 40), new THREE.MeshStandardMaterial({ color: '#2a2219', roughness: 1 })); { const p = dunas.geometry.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * .4) * .3 + Math.cos(p.getY(i) * .5) * .2); dunas.geometry.computeVertexNormals(); } dunas.rotation.x = -Math.PI / 2; dunas.position.y = -1.2; g6.add(dunas);

  // 7. trançado: rochas brancas e fitas de ouro e prata enroladas
  const g7 = novo(); sala(g7, '#e4ddd2', '#dcd3c6', 16, 18);
  const fita = (mat, fase, raio) => { const pts = []; for (let i = 0; i <= 160; i++) { const t = i / 160; pts.push(V(Math.sin(t * Math.PI * 3 + fase) * raio + (t - .5) * 5, 3.2 - t * 5.2, Math.cos(t * Math.PI * 3 + fase) * raio - 2.4)); } return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 400, .11, 20), mat); };
  g7.add(fita(ouro, 0, .6)); g7.add(fita(new THREE.MeshPhysicalMaterial({ color: '#f6f3ee', roughness: .35, clearcoat: 1 }), Math.PI, .6)); g7.add(fita(aco, Math.PI / 2, .9));
  const r7 = semente(5); for (let i = 0; i < 14; i++) { const pedra = new THREE.Mesh(new THREE.DodecahedronGeometry(.2 + r7() * .5, 0), new THREE.MeshStandardMaterial({ color: '#f1efea', roughness: .9, flatShading: true })); pedra.position.set((r7() - .5) * 7, -1.1, -1 - r7() * 5); pedra.scale.y = .5; g7.add(pedra); }
  const j7 = bracelete(.2, 22); j7.position.set(0, .45, -2.1); j7.rotation.y = .3; g7.add(j7);

  // 8. ícones: árvore escura, lua grande e o anel
  const g8 = novo(); sala(g8, '#4a3624', '#6b5440', 14, 16);
  const tronco = (x, z, s) => { const pts = []; for (let i = 0; i <= 30; i++) { const t = i / 30; pts.push(V(x + Math.sin(t * 3 + s) * .8, -1.2 + t * 6, z + Math.cos(t * 2 + s) * .3)); } return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, .09, 10), new THREE.MeshStandardMaterial({ color: '#3b2516', roughness: .9 })); };
  g8.add(tronco(-1.3, -2.8, 0)); g8.add(tronco(1.6, -1.6, 2));
  const lua8 = new THREE.Mesh(new THREE.CircleGeometry(1.4, 64), new THREE.MeshBasicMaterial({ color: '#fffaf0', toneMapped: false })); lua8.position.set(2.2, 1.2, -5.5); g8.add(lua8);
  const disco = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, .06, 96), new THREE.MeshStandardMaterial({ color: '#cbb89c', roughness: .6 })); disco.position.set(0, -1.16, -2.6); g8.add(disco);
  const j8 = anel('#22c7c3'); j8.position.set(0, .2, -2); g8.add(j8);

  const PECAS = [placa, j1, j2, j3, j4, j5, lua, j7, j8];
  // câmera por capítulo: [posição, alvo, fov]
  const CAM = [
    [V(0, .4, 4.2), V(0, .5, -6), 40], [V(0, .45, 3.4), V(0, .55, -2.2), 34], [V(0, .4, 1.4), V(0, .4, -2.6), 34], [V(0, .4, 1.6), V(0, .4, -2.4), 34],
    [V(0, .45, 1.6), V(0, .45, -2.6), 36], [V(0, .5, .2), V(0, .45, -3), 30], [V(0, .2, 2), V(0, .3, -6), 40], [V(0, .5, 2.6), V(0, .55, -2.2), 38], [V(0, .4, 2.2), V(0, .5, -2.4), 38],
  ];
  let atual = 0;
  function tamanho() { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
  addEventListener('resize', tamanho); tamanho();
  const tmp = V(0, 0, 0);
  // k: índice do capítulo; u: 0 → câmera chegando (afastada), 1 → no lugar; ponteiro desloca levemente
  function quadro(k, u, t, ptr) {
    if (k !== atual || !grupos[k].visible) { grupos.forEach((g, i) => { g.visible = i === k; }); atual = k; const nev = ['#d6bb97', '#e2cfb1', '#dcc7a6', '#1c0f08', '#cdbda4', '#bdb5ab', '#07080c', '#ddd6cb', '#3a2a1c'][k]; scene.background = new THREE.Color(nev); scene.fog = new THREE.Fog(nev, k === 6 ? 20 : 7, k === 6 ? 60 : 30); }
    const [p, a, fov] = CAM[k], e = 1 - Math.pow(1 - u, 3);
    camera.position.set(p.x + ptr.x * .12, p.y + ptr.y * .08 + (1 - e) * .3, p.z + (1 - e) * 1.6);
    const rec = Math.max(1, 1.25 / camera.aspect); if (rec > 1) camera.position.sub(a).multiplyScalar(rec).add(a);
    camera.fov = fov; camera.updateProjectionMatrix(); tmp.copy(a); camera.lookAt(tmp);
    const peca = PECAS[k]; if (peca && k !== 0 && k !== 6) { peca.rotation.y = Math.sin(t * .4) * .35 + (k === 7 ? .3 : 0); peca.position.y += (CAM[k][1].y + Math.sin(t * .8) * .02 - peca.position.y) * .1; }
    hemi.intensity = k === 3 ? .35 : k === 6 ? .15 : k === 8 ? .55 : 1.1; sol.intensity = k === 3 ? .6 : k === 6 ? .2 : 2.4;
    recorte.position.set(k === 8 ? 1.8 : 1.2, 1.4, k === 3 ? -1.2 : 1.2); recorte.intensity = k === 3 ? 14 : 8;
    renderer.render(scene, camera);
  }
  return { quadro, total: grupos.length };
}
