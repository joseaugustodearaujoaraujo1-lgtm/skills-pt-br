// Mundo 3D do laboratório ACORDE (three.js): esboços em linha, laboratório com céu, sala dos arcos, sala escura e o fecho.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);

// ---------- texturas desenhadas em canvas ----------
function tela(w, h, desenhar) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  desenhar(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function rabisco(g, x, y, larg, linhas, alt = 22, rnd = Math.random) {
  for (let l = 0; l < linhas; l++) {
    g.beginPath(); let cx = x; const cy = y + l * alt;
    g.moveTo(cx, cy);
    while (cx < x + larg * (0.6 + rnd() * .4)) { const p = 6 + rnd() * 14; g.quadraticCurveTo(cx + p / 2, cy - 6 - rnd() * 6, cx + p, cy + (rnd() - .5) * 3); cx += p; if (rnd() < .12) { cx += 10; g.moveTo(cx, cy); } }
    g.stroke();
  }
}
function semente(s) { return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
const papel = (seed, fundo = '#f4f2ee', tinta = '#3b3a36') => tela(512, 640, (g, w, h) => {
  const r = semente(seed);
  g.fillStyle = fundo; g.fillRect(0, 0, w, h);
  g.strokeStyle = tinta; g.lineWidth = 1.6; g.globalAlpha = .75;
  // frasco octogonal em vista técnica
  g.save(); g.translate(w * .5, h * .38); const R = 90;
  g.beginPath(); for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; g.lineTo(Math.cos(a) * R, Math.sin(a) * R); } g.closePath(); g.stroke();
  g.beginPath(); for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; g.lineTo(Math.cos(a) * R * .7, Math.sin(a) * R * .7); } g.closePath(); g.stroke();
  g.beginPath(); g.arc(0, 0, R * .32, 0, Math.PI * 2); g.stroke();
  g.setLineDash([4, 6]); g.beginPath(); g.moveTo(-R * 1.3, 0); g.lineTo(R * 1.3, 0); g.moveTo(0, -R * 1.3); g.lineTo(0, R * 1.3); g.stroke(); g.setLineDash([]);
  g.restore();
  g.lineWidth = 1.2; rabisco(g, 50, h * .7, w - 100, 6, 24, r);
  g.globalAlpha = .5; g.font = '16px Georgia'; g.fillStyle = tinta; g.fillText('AC-07 · âmbar, íris, cedro', 50, h * .64);
});
const manuscrito = (seed) => tela(512, 512, (g, w, h) => {
  const r = semente(seed); g.clearRect(0, 0, w, h);
  g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 1.5; rabisco(g, 30, 50, w - 60, 16, 27, r);
});
const raioX = (seed) => tela(1024, 768, (g, w, h) => {
  const r = semente(seed);
  const grd = g.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w * .7); grd.addColorStop(0, '#e9f4fb'); grd.addColorStop(1, '#9fc2db');
  g.fillStyle = grd; g.fillRect(0, 0, w, h);
  g.globalCompositeOperation = 'multiply';
  const azul = a => `rgba(30,80,150,${a})`;
  g.translate(w / 2, h / 2);
  // câmara, mola, tubo e engrenagens do atomizador em "raio X"
  for (let i = 0; i < 9; i++) { g.strokeStyle = azul(.25 + r() * .4); g.lineWidth = 2 + r() * 8; g.beginPath(); g.arc((r() - .5) * 360, (r() - .5) * 240, 30 + r() * 130, 0, Math.PI * 2); g.stroke(); }
  g.strokeStyle = azul(.7); g.lineWidth = 6; g.beginPath(); for (let i = 0; i < 18; i++) g.lineTo(-40 + (i % 2) * 80, -220 + i * 26); g.stroke();
  g.lineWidth = 16; g.strokeStyle = azul(.45); g.beginPath(); g.moveTo(0, -300); g.lineTo(0, 300); g.stroke();
  for (let k = 0; k < 3; k++) { const cx = (k - 1) * 230, cy = (k % 2 ? 1 : -1) * 120, R = 70 + k * 18; g.lineWidth = 4; g.strokeStyle = azul(.6); g.beginPath(); for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2, rr = R + (i % 2 ? 10 : 0); g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } g.closePath(); g.stroke(); g.beginPath(); g.arc(cx, cy, 12, 0, Math.PI * 2); g.fillStyle = azul(.7); g.fill(); }
  g.globalCompositeOperation = 'source-over';
});

// ---------- céu: gradiente com nuvens procedurais ----------
const ceuVert = `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`;
const ceuFrag = `
uniform vec3 uAlto; uniform vec3 uMeio; uniform vec3 uHorizonte; uniform vec3 uChao; uniform float uTempo; uniform float uNuvem;
varying vec3 vDir;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*n(p); p*=2.03; a*=.5; } return v; }
void main(){
  vec3 d = normalize(vDir); float y = d.y;
  vec3 c = mix(uHorizonte, uMeio, smoothstep(-0.02, .12, y));
  c = mix(c, uAlto, smoothstep(.35, 1.0, y));
  vec2 q = d.xz / (y + .35) * 1.6 + vec2(uTempo * .01, 0.);
  float nu = smoothstep(.38, .95, fbm(q * .7)) * smoothstep(0.0, .3, y) * uNuvem;
  c = mix(c, mix(uMeio, vec3(1.), .35), nu * .55);
  float brilho = exp(-abs(y) * 14.) * .5;
  c += uHorizonte * brilho * .15;
  c = mix(c, uChao, 1.0 - smoothstep(-.06, 0.0, y));
  gl_FragColor = vec4(c, 1.);
}`;

export function criarCena(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .86;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#000');
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
  const camera = new THREE.PerspectiveCamera(38, 1, .05, 200);

  // luzes
  const hemi = new THREE.HemisphereLight('#dfe6ee', '#1b1a18', .7); scene.add(hemi);
  const chave = new THREE.DirectionalLight('#fff3e2', 2.2); chave.position.set(3, 6, 4); scene.add(chave);
  const foco = new THREE.SpotLight('#ffffff', 18, 12, .45, .6, 1.4); foco.position.set(0, 4.2, .6); foco.target.position.set(0, .1, 0); scene.add(foco, foco.target);
  const contra = new THREE.PointLight('#9cc4ff', 6, 6); contra.position.set(-1.5, 1.4, -1.6); scene.add(contra);

  // ---------- céu e chão comuns ----------
  const ceuMat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, uniforms: { uAlto: { value: new THREE.Color('#2a3442') }, uMeio: { value: new THREE.Color('#8e9aa8') }, uHorizonte: { value: new THREE.Color('#e48a45') }, uChao: { value: new THREE.Color('#0c0c0d') }, uTempo: { value: 0 }, uNuvem: { value: 1 } }, vertexShader: ceuVert, fragmentShader: ceuFrag });
  const ceu = new THREE.Mesh(new THREE.SphereGeometry(80, 48, 24), ceuMat); scene.add(ceu);
  const cicloGeo = new THREE.CylinderGeometry(18, 18, 16, 96, 1, true, Math.PI * .62, Math.PI * .76); cicloGeo.translate(0, 6.8, 0);
  const ciclorama = new THREE.Mesh(cicloGeo, ceuMat); ciclorama.position.z = 2; scene.add(ciclorama);
  // chão espelhado escuro (reflexo em meia resolução, misturado ao preto)
  const espelho = new Reflector(new THREE.CircleGeometry(40, 64), { textureWidth: 640, textureHeight: 400, color: '#3a3a3c', clipBias: .003 });
  espelho.rotation.x = -Math.PI / 2; espelho.position.y = -1.205; scene.add(espelho);
  const chao = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.MeshBasicMaterial({ color: '#060607' }));
  chao.rotation.x = -Math.PI / 2; chao.position.y = -1.2; scene.add(chao);

  // ---------- o frasco AC-07 ----------
  const frasco = new THREE.Group();
  const vidro = new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 0, roughness: .03, transmission: 1, thickness: .22, ior: 1.52, dispersion: .6, attenuationColor: new THREE.Color('#f3efe6'), attenuationDistance: 2, clearcoat: 1, clearcoatRoughness: .05, envMapIntensity: 1.4, specularIntensity: 1 });
  const liquido = new THREE.MeshPhysicalMaterial({ color: '#c9772a', roughness: .12, clearcoat: 1, clearcoatRoughness: .1, sheen: .3, sheenColor: new THREE.Color('#ffcf8a') });
  const aco = new THREE.MeshStandardMaterial({ color: '#c9ccd1', metalness: 1, roughness: .28 });
  const latao = new THREE.MeshStandardMaterial({ color: '#d4a35a', metalness: 1, roughness: .22 });
  const corpo = new THREE.Mesh(new THREE.CylinderGeometry(.33, .35, .62, 8, 1), vidro); corpo.position.y = .31; corpo.rotation.y = Math.PI / 8; frasco.add(corpo);
  const fundoGrosso = new THREE.Mesh(new THREE.CylinderGeometry(.35, .35, .06, 8), vidro); fundoGrosso.position.y = .03; fundoGrosso.rotation.y = Math.PI / 8; frasco.add(fundoGrosso);
  const suco = new THREE.Mesh(new THREE.CylinderGeometry(.27, .29, .46, 8), liquido); suco.position.y = .3; suco.rotation.y = Math.PI / 8; frasco.add(suco);
  const gargalo = new THREE.Mesh(new THREE.CylinderGeometry(.07, .08, .08, 24), latao); gargalo.position.y = .66; frasco.add(gargalo);
  const colar = new THREE.Mesh(new THREE.TorusGeometry(.09, .018, 12, 32), latao); colar.rotation.x = Math.PI / 2; colar.position.y = .7; frasco.add(colar);
  const tampa = new THREE.Mesh(new THREE.CylinderGeometry(.21, .21, .26, 8), aco); tampa.position.y = .84; tampa.rotation.y = Math.PI / 8; frasco.add(tampa);
  const topoTampa = new THREE.Mesh(new THREE.CylinderGeometry(.16, .21, .03, 8), aco); topoTampa.position.y = .985; topoTampa.rotation.y = Math.PI / 8; frasco.add(topoTampa);
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; const p = new THREE.Mesh(new THREE.CylinderGeometry(.022, .022, .012, 6), latao); p.position.set(Math.cos(a) * .12, 1.0, Math.sin(a) * .12); frasco.add(p); }
  const placa = new THREE.Mesh(new THREE.PlaneGeometry(.16, .07), new THREE.MeshStandardMaterial({ map: tela(256, 112, (g, w, h) => { g.fillStyle = '#1b1b1d'; g.fillRect(0, 0, w, h); g.fillStyle = '#e8d7b5'; g.font = '600 46px sans-serif'; g.textAlign = 'center'; g.fillText('AC-07', w / 2, 72); }), metalness: .4, roughness: .4 }));
  placa.position.set(0, .34, .34); frasco.add(placa);
  frasco.scale.setScalar(.5); frasco.position.y = .12; scene.add(frasco);
  // sombra de contato: um degradê radial sob o frasco (barato e convincente)
  const sombraTex = tela(128, 128, (g, w, h) => { const rg = g.createRadialGradient(64, 64, 4, 64, 64, 64); rg.addColorStop(0, 'rgba(0,0,0,.75)'); rg.addColorStop(.5, 'rgba(0,0,0,.3)'); rg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(0, 0, w, h); });
  const sombra = new THREE.Mesh(new THREE.PlaneGeometry(.62, .62), new THREE.MeshBasicMaterial({ map: sombraTex, transparent: true, depthWrite: false }));
  sombra.rotation.x = -Math.PI / 2; sombra.position.y = .1215; scene.add(sombra);

  // ---------- 1. esboços em linha (abertura) ----------
  const esboco = new THREE.Group(); scene.add(esboco);
  const linhaMat = new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: .5 });
  const caixaLinhas = (w, h, d, x, y, z) => { const l = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), linhaMat); l.position.set(x, y, z); esboco.add(l); return l; };
  caixaLinhas(6, .24, 3.2, 0, -.12, 0);
  caixaLinhas(1.2, .12, 1.2, 0, .06, 0);
  caixaLinhas(3, 1.2, .8, -5, -.6, -3); caixaLinhas(2.2, .9, .8, 5, -.75, -2.6); caixaLinhas(1.4, 2.2, 1.4, 4.6, -.1, 3.2);
  [[-1.8, .0, .6], [1.9, .0, -.7], [-1.2, 0, -.9], [1.4, 0, .9]].forEach(([x, y, z], i) => {
    const pts = []; const r = .12 + i * .03; for (let k = 0; k <= 12; k++) { const t = k / 12; pts.push(new THREE.Vector2(t < .7 ? r : r * (1 - (t - .7) * 2.4), t * (.5 + i * .1))); }
    const lat = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.LatheGeometry(pts, 8), 20), linhaMat); lat.position.set(x, y, z); esboco.add(lat);
  });
  const folhas = [];
  for (let i = 0; i < 9; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), new THREE.MeshBasicMaterial({ map: manuscrito(i + 3), transparent: true, opacity: .55, depthWrite: false, side: THREE.DoubleSide }));
    const a = i / 9 * Math.PI * 2; m.position.set(Math.cos(a) * (4 + i % 3), .8 + (i % 4) * .7, Math.sin(a) * (3.5 + i % 2)); m.lookAt(0, m.position.y, 0); esboco.add(m); folhas.push(m);
    const moldura = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.7, 1.7)), linhaMat); moldura.position.copy(m.position); moldura.quaternion.copy(m.quaternion); esboco.add(moldura);
  }
  const eixos = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([V(-12, -.24, 0), V(12, -.24, 0), V(0, -.24, -12), V(0, -.24, 12), V(-8, 6, -8), V(8, -1, 8), V(8, 6, -8), V(-8, -1, 8)]), new THREE.LineBasicMaterial({ color: '#fff', transparent: true, opacity: .18 }));
  esboco.add(eixos);

  // ---------- 2. laboratório (capítulo I) ----------
  const lab = new THREE.Group(); scene.add(lab);
  const branco = new THREE.MeshPhysicalMaterial({ color: '#d6d6d3', roughness: .32, clearcoat: .6, clearcoatRoughness: .2 });
  const preto = new THREE.MeshPhysicalMaterial({ color: '#0a0a0b', roughness: .18, metalness: .2, clearcoat: 1 });
  const mesa = new THREE.Mesh(new RoundedBoxGeometry(6, .24, 3.2, 4, .08), branco); mesa.position.y = -.12; lab.add(mesa);
  const base = new THREE.Mesh(new RoundedBoxGeometry(6.02, 1.0, 3.22, 2, .04), preto); base.position.y = -.74; lab.add(base);
  const luzBase = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 3.6), new THREE.MeshBasicMaterial({ color: '#cfe0ff', transparent: true, opacity: .25, blending: THREE.AdditiveBlending, depthWrite: false }));
  luzBase.rotation.x = -Math.PI / 2; luzBase.position.y = -1.19; lab.add(luzBase);
  const pedestal = new THREE.Mesh(new RoundedBoxGeometry(1.2, .12, 1.2, 2, .02), preto); pedestal.position.y = .06; lab.add(pedestal);
  const papeis = [];
  [[-1.8, .3, -.15, 1], [1.7, -.6, .2, 2], [-1.1, -.9, .3, 3], [1.2, .85, -.25, 4], [2.4, .3, .1, 5], [-2.3, -.5, -.2, 6]].forEach(([x, z, rot, s]) => {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(.62, .78), new THREE.MeshStandardMaterial({ map: papel(s), roughness: .9 }));
    p.rotation.x = -Math.PI / 2; p.rotation.z = rot; p.position.set(x, .003, z); lab.add(p); papeis.push(p);
  });
  const pipeta = new THREE.Group();
  const tubo = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .9, 12), vidro); tubo.rotation.z = Math.PI / 2; pipeta.add(tubo);
  const bulbo = new THREE.Mesh(new THREE.SphereGeometry(.045, 16, 12), preto); bulbo.position.x = .47; pipeta.add(bulbo);
  pipeta.position.set(-1.4, .03, .9); pipeta.rotation.y = .5; lab.add(pipeta);
  const arcoForma = (w, h) => { const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(-w / 2, h - w / 2); s.absarc(0, h - w / 2, w / 2, Math.PI, 0, true); s.lineTo(w / 2, 0); s.lineTo(-w / 2, 0); return new THREE.ShapeGeometry(s, 32); };
  const silhueta = new THREE.MeshBasicMaterial({ color: '#050505' });
  [[5.5, -7, 3, 7, -.4], [-6.5, -6, 2.6, 6, .5], [9, -3, 3.4, 8, -1.1]].forEach(([x, z, w, h, r]) => { const a = new THREE.Mesh(arcoForma(w, h), silhueta); a.position.set(x, -1.2, z); a.rotation.y = r; lab.add(a); });

  // ---------- 3. sala dos arcos (capítulo II) ----------
  const sala = new THREE.Group(); scene.add(sala);
  const mesa2 = new THREE.Mesh(new RoundedBoxGeometry(4.6, .2, 2.6, 4, .08), branco); mesa2.position.y = -.1; sala.add(mesa2);
  const pe2 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1, 2.2), preto); pe2.position.y = -.7; sala.add(pe2);
  const octo = new THREE.Mesh(new THREE.CylinderGeometry(.75, .75, .12, 8), preto); octo.position.y = .06; octo.rotation.y = Math.PI / 8; sala.add(octo);
  const parede = new THREE.Mesh(new THREE.PlaneGeometry(40, 16), new THREE.MeshStandardMaterial({ color: '#050506', roughness: .9 }));
  parede.position.set(0, 6, -7);
  // a janela é um vão: a parede tem um recorte em arco
  const paredeForma = new THREE.Shape(); paredeForma.moveTo(-20, -1.4); paredeForma.lineTo(20, -1.4); paredeForma.lineTo(20, 15); paredeForma.lineTo(-20, 15); paredeForma.lineTo(-20, -1.4);
  const furo = new THREE.Path(); furo.moveTo(-2.5, -1.2); furo.lineTo(-2.5, 3.8); furo.absarc(0, 3.8, 2.5, Math.PI, 0, true); furo.lineTo(2.5, -1.2); furo.lineTo(-2.5, -1.2); paredeForma.holes.push(furo);
  const paredeArco = new THREE.Mesh(new THREE.ShapeGeometry(paredeForma, 32), new THREE.MeshStandardMaterial({ color: '#060607', roughness: .95, side: THREE.DoubleSide })); paredeArco.position.z = -7; sala.add(paredeArco);
  const lateral = new THREE.Mesh(new THREE.ShapeGeometry(paredeForma, 32), paredeArco.material); lateral.position.set(-8, 0, -1); lateral.rotation.y = Math.PI / 2; sala.add(lateral);
  const lateral2 = lateral.clone(); lateral2.position.x = 8; lateral2.rotation.y = -Math.PI / 2; sala.add(lateral2);
  const frente = new THREE.Mesh(new THREE.PlaneGeometry(40, 16), paredeArco.material); frente.position.set(0, 6, 9); frente.rotation.y = Math.PI; sala.add(frente);
  const pinca = new THREE.Group(); [1, -1].forEach(s => { const b = new THREE.Mesh(new THREE.BoxGeometry(.5, .012, .03), aco); b.position.z = s * .02; b.rotation.y = s * .04; pinca.add(b); });
  pinca.position.set(1.1, .02, .5); pinca.rotation.y = -.6; sala.add(pinca);
  const frascos = []; [[-1.4, -.6, '#7a2c1d'], [-1.15, -.75, '#2e4a2a'], [-1.65, -.8, '#a77a2d']].forEach(([x, z, c]) => { const f = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, .22, 16), new THREE.MeshPhysicalMaterial({ color: c, transmission: .7, roughness: .05, thickness: .2 })); f.position.set(x, .11, z); sala.add(f); frascos.push(f); });
  sala.add(new THREE.Mesh(new THREE.PlaneGeometry(.7, .9), new THREE.MeshStandardMaterial({ map: papel(9), roughness: .9 })).translateY(.003).rotateX(-Math.PI / 2).translateX(1.4).translateY(.2));

  // ---------- 4. sala escura (capítulo III) ----------
  const escuro = new THREE.Group(); scene.add(escuro);
  const arcoLuz = new THREE.MeshBasicMaterial({ color: '#dfe9ff' });
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 1.6 - Math.PI * .8 - Math.PI / 2, r = 5.5 + (i % 3) * .6;
    const x = Math.cos(a) * r, z = Math.sin(a) * r, w = 1.8 + (i % 2) * .6, h = 5 + (i % 3);
    const pts = []; for (let k = 0; k <= 40; k++) { const t = k / 40; const ang = Math.PI * t; pts.push(V(Math.cos(ang) * w / 2, t < 0 ? 0 : (h - w / 2) + Math.sin(ang) * w / 2, 0)); }
    const curva = new THREE.CatmullRomCurve3([V(w / 2, -1.2, 0), V(w / 2, h - w / 2, 0), ...pts, V(-w / 2, h - w / 2, 0), V(-w / 2, -1.2, 0)]);
    const tuboArco = new THREE.Mesh(new THREE.TubeGeometry(curva, 120, .012, 6, false), arcoLuz);
    tuboArco.position.set(x, 0, z); tuboArco.lookAt(0, 0, 0); escuro.add(tuboArco);
  }
  const bloco = new THREE.Mesh(new RoundedBoxGeometry(2.6, 1.4, 1.6, 2, .03), preto); bloco.position.y = -.6; escuro.add(bloco);
  const telaMat = new THREE.MeshBasicMaterial({ map: raioX(11), toneMapped: false });
  const telaRx = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.12), telaMat); telaRx.position.set(0, 1.12, -.35); escuro.add(telaRx);
  const telaRx2 = new THREE.Mesh(new THREE.PlaneGeometry(.9, .68), new THREE.MeshBasicMaterial({ map: raioX(5), toneMapped: false })); telaRx2.position.set(-1.6, 1.3, -1.2); telaRx2.rotation.y = .6; escuro.add(telaRx2);
  const telaRx3 = new THREE.Mesh(new THREE.PlaneGeometry(.9, .68), new THREE.MeshBasicMaterial({ map: raioX(23), toneMapped: false })); telaRx3.position.set(1.7, 1.25, -1.1); telaRx3.rotation.y = -.6; escuro.add(telaRx3);
  const anelHorizonte = new THREE.Mesh(new THREE.RingGeometry(14, 30, 96), new THREE.MeshBasicMaterial({ color: '#3d6aa8', transparent: true, opacity: .35, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
  anelHorizonte.rotation.x = -Math.PI / 2; anelHorizonte.position.y = -1.18; escuro.add(anelHorizonte);

  // ---------- trajetória da câmera: chaves por passo ----------
  const C = (p, pos, alvo, fov = 38) => ({ p, pos: V(...pos), alvo: V(...alvo), fov });
  const CHAVES = [
    C(0, [0, 9, 13], [0, 0, 0], 42), C(2, [2.5, 6, 9], [0, 0, 0], 40), C(4, [1.6, 3.8, 5.6], [0, .1, 0], 38), C(6, [2.2, 4.2, 5.2], [-.3, 0, 0], 36),
    C(6.6, [2.0, 3.9, 4.9], [-.3, 0, 0], 36), C(8, [0, 1.4, 4.2], [0, 2.6, -10], 40), C(9.4, [0, 1.0, 9.5], [0, 1.4, -10], 42), C(10.6, [3.4, .45, 6.4], [0, .1, 0], 34),
    C(12, [1.25, .95, 3.4], [0, .38, 0], 30), C(13.5, [-.75, .8, 2.6], [0, .4, 0], 30), C(15, [.6, .72, 2.5], [0, .42, 0], 28), C(16.5, [.4, 3.4, 1.7], [0, .2, 0], 34), C(18.4, [-1.7, .85, 2.4], [0, .4, 0], 32),
    C(18.6, [-3.2, 1.5, 6.2], [-1, 1.2, 0], 40), C(19.6, [-1.5, 1.1, 4], [0, .45, 0], 34), C(21, [.85, .72, 2.3], [0, .45, 0], 30), C(22.5, [0, .66, 2.0], [0, .45, 0], 28), C(24, [-1.2, .64, 1.8], [0, .42, 0], 28),
    C(25.5, [.95, .78, 1.75], [0, .4, 0], 28), C(27, [0, 1.25, 2.5], [0, .3, 0], 30), C(28.5, [1.9, 1.35, 2.8], [0, .3, 0], 32), C(29.9, [0, .95, 3.4], [0, .4, 0], 34),
    C(30.1, [0, 1.5, 6.4], [0, .8, 0], 40), C(32, [.7, 1.05, 3.4], [0, 1.0, 0], 36), C(34, [0, 1.08, 2.3], [0, 1.08, -.35], 34), C(36, [.55, 1.12, 1.9], [0, 1.12, -.35], 34),
    C(38, [-.7, 1.12, 1.6], [.15, 1.12, -.35], 34), C(40, [-.3, 1.12, 1.35], [0, 1.12, -.35], 32), C(42, [0, 1.12, .7], [0, 1.12, -.35], 32),
    C(43, [-.05, .66, 1.1], [0, .62, 0], 24), C(46, [.04, .64, .82], [0, .62, 0], 24),
  ];
  const suave = t => t * t * (3 - 2 * t);
  const tmpP = V(0, 0, 0), tmpA = V(0, 0, 0);

  // paletas do céu por cena
  const CEUS = {
    lab: { alto: '#2f3a49', meio: '#9aa6b4', hor: '#c0866a', chao: '#0a0a0b', nuvem: 1 },
    sala: { alto: '#56606c', meio: '#cfd6dd', hor: '#eee9e2', chao: '#080808', nuvem: .8 },
    escuro: { alto: '#000000', meio: '#020305', hor: '#3a64a6', chao: '#000000', nuvem: 0 },
  };
  const aplicaCeu = k => { const c = CEUS[k]; ceuMat.uniforms.uAlto.value.set(c.alto); ceuMat.uniforms.uMeio.value.set(c.meio); ceuMat.uniforms.uHorizonte.value.set(c.hor); ceuMat.uniforms.uChao.value.set(c.chao); ceuMat.uniforms.uNuvem.value = c.nuvem; };

  function tamanho() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  addEventListener('resize', tamanho); tamanho();

  // atualiza o mundo para o passo p (0..46) e desenha
  function quadro(p, t, ponteiro) {
    let i = 0; while (i < CHAVES.length - 2 && CHAVES[i + 1].p <= p) i++;
    const a = CHAVES[i], b = CHAVES[i + 1];
    const f = suave(Math.min(1, Math.max(0, (p - a.p) / (b.p - a.p))));
    tmpP.lerpVectors(a.pos, b.pos, f); tmpA.lerpVectors(a.alvo, b.alvo, f);
    // leve deriva com o ponteiro, como uma câmera na mão
    tmpP.x += ponteiro.x * .06; tmpP.y += ponteiro.y * .04;
    const rec = Math.max(1, 1.25 / camera.aspect); if (rec > 1) tmpP.sub(tmpA).multiplyScalar(rec).add(tmpA);
    camera.position.copy(tmpP); camera.fov = a.fov + (b.fov - a.fov) * f; camera.updateProjectionMatrix(); camera.lookAt(tmpA);

    const cena = p < 6.4 ? 'esboco' : p < 18.5 ? 'lab' : p < 30 ? 'sala' : p < 42.5 ? 'escuro' : 'fim';
    esboco.visible = cena === 'esboco' || (p > 5.2 && p < 7.2);
    lab.visible = cena === 'lab' || (p > 5.2 && p < 6.4);
    sala.visible = cena === 'sala'; escuro.visible = cena === 'escuro';
    ceu.visible = cena === 'sala' || cena === 'escuro' || (cena === 'lab' && p < 10.2);
    ciclorama.visible = cena === 'lab' && p >= 10.2;
    espelho.visible = cena === 'lab' || cena === 'sala' || cena === 'escuro';
    chao.visible = false;
    frasco.visible = (cena === 'lab' && p > 11.2) || cena === 'sala' || cena === 'escuro' || cena === 'fim';
    // esboço vira matéria: linhas somem enquanto a mesa aparece
    const mistura = Math.min(1, Math.max(0, (p - 5.2) / 1.2));
    linhaMat.opacity = .5 * (1 - mistura); folhas.forEach(m => { m.material.opacity = .55 * (1 - mistura); });
    branco.transparent = mistura < 1 && cena !== 'sala'; branco.opacity = cena === 'lab' || cena === 'esboco' ? Math.max(mistura, cena === 'lab' ? 1 : 0) : 1;
    aplicaCeu(cena === 'sala' ? 'sala' : cena === 'escuro' ? 'escuro' : 'lab');
    ceuMat.uniforms.uTempo.value = t;
    // frasco: pedestal certo para cada cena
    frasco.position.y = cena === 'escuro' ? .1 : .12;
    sombra.visible = frasco.visible; sombra.position.y = frasco.position.y + .0015;
    frasco.rotation.y = cena === 'fim' ? 0 : t * .05;
    foco.intensity = cena === 'fim' ? 2 : 18; contra.intensity = cena === 'fim' ? 14 : cena === 'escuro' ? 10 : 6;
    contra.position.set(cena === 'fim' ? -1.2 : -1.5, cena === 'fim' ? 1.1 : 1.4, cena === 'fim' ? -.8 : -1.6);
    hemi.intensity = cena === 'fim' ? .02 : cena === 'escuro' ? .22 : .45;
    scene.environmentIntensity = cena === 'fim' ? .12 : cena === 'escuro' ? .5 : 1;
    chave.intensity = cena === 'fim' ? .4 : cena === 'escuro' ? .5 : 1.5;
    scene.background.set(cena === 'fim' ? '#000' : '#000');
    renderer.render(scene, camera);
  }
  // posição na tela de um ponto do mundo (para os pontos de exploração)
  const proj = V(0, 0, 0);
  function naTela(x, y, z) { proj.set(x, y, z).project(camera); return { x: (proj.x * .5 + .5) * innerWidth, y: (-proj.y * .5 + .5) * innerHeight, frente: proj.z < 1 }; }
  return { quadro, naTela, renderer };
}
