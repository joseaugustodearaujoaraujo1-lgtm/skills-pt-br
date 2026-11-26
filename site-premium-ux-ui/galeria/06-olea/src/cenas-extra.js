// OLEA — cenas 3D extras (modelo próprio): pilhas de sabonetes (1, 2 e 3), pilha colorida, sabonete na beira da tábua
// com fundo laranja, close na borda sobre azulejo e azeitonas caindo (fundo do rodapé). Tudo renderizado em WebP.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { montarSabonete, VARIANTES } from './sabonete.js';

const rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(9091);
const tela = (w, h, fn) => { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };

function base(canvas, w, h, fundo = null) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: !fundo, preserveDrawingBuffer: true });
  r.setPixelRatio(1); r.setSize(w, h, false); r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = .78; r.outputColorSpace = THREE.SRGBColorSpace; r.shadowMap.enabled = true;
  const cena = new THREE.Scene(); if (fundo) cena.background = new THREE.Color(fundo);
  const pm = new THREE.PMREMGenerator(r); cena.environment = pm.fromScene(new RoomEnvironment(), .04).texture; pm.dispose(); cena.environmentIntensity = .35;
  const chave = new THREE.DirectionalLight(0xfff1dc, 1.8); chave.position.set(-3, 5, 4); chave.castShadow = true; chave.shadow.mapSize.set(2048, 2048); chave.shadow.radius = 5;
  Object.assign(chave.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5 }); cena.add(chave);
  const recorte = new THREE.DirectionalLight(0xffc98a, 2.2); recorte.position.set(4, 1.5, -3); cena.add(recorte);
  const cam = new THREE.PerspectiveCamera(26, w / h, .05, 100);
  return { r, cena, cam };
}
// copia a malha do sabonete (com a variante de cor pedida)
const molde = (() => { let m = null; return () => (m ||= montarSabonete(Object.assign(document.createElement('canvas'), { width: 8, height: 8 }))); })();
function sabonete(cor = 'oliva') {
  const m = molde(); m.trocarCor(cor); const p = m.pivo.clone(true);
  p.traverse(o => { if (o.isMesh) { o.material = o.material.clone(); o.castShadow = o.receiveShadow = true; } }); m.trocarCor('oliva'); return p;
}

export function pilha(canvas, n, { w = 900, h = 900 } = {}) {
  const { r, cena, cam } = base(canvas, w, h);
  const chao = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: .35 })); chao.rotation.x = -Math.PI / 2; chao.position.y = -.01; chao.receiveShadow = true; cena.add(chao);
  for (let i = 0; i < n; i++) { const s = sabonete(); s.position.y = .17 + i * .345; s.rotation.y = i * .7; cena.add(s); }
  cam.position.set(0, 3.2 + n * .35, 5.6); cam.lookAt(0, .2 + n * .17, 0); r.render(cena, cam);
}
export function pilhaColorida(canvas, { w = 1000, h = 1200 } = {}) {
  const { r, cena, cam } = base(canvas, w, h, '#d9d4c8');
  const chao = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ color: 0xd9d4c8, roughness: .95 })); chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; cena.add(chao);
  const cores = ['carvao', 'lavanda', 'oliva', 'argila', 'curcuma', 'oliva', 'lavanda'];
  cores.forEach((c, i) => { const s = sabonete(c); s.position.set((rnd() - .5) * .25, .17 + i * .345, (rnd() - .5) * .25); s.rotation.set((rnd() - .5) * .05, rnd() * 6, (rnd() - .5) * .05); cena.add(s); });
  const solta = sabonete('curcuma'); solta.position.set(1.7, .17, .8); cena.add(solta);
  cam.position.set(2.6, 3.4, 6.8); cam.lookAt(.3, 1.2, 0); r.render(cena, cam);
}
export function beirada(canvas, { w = 1600, h = 1000 } = {}) {
  const { r, cena, cam } = base(canvas, w, h, '#c4511c');
  const fundo = new THREE.Mesh(new THREE.PlaneGeometry(40, 20), new THREE.MeshStandardMaterial({ color: 0xc4511c, roughness: 1 })); fundo.position.z = -6; cena.add(fundo);
  const madeira = tela(1024, 256, (g, W, H) => { g.fillStyle = '#b88a5a'; g.fillRect(0, 0, W, H); for (let i = 0; i < 70; i++) { g.strokeStyle = `rgba(110,70,35,${.12 + rnd() * .25})`; g.lineWidth = 1 + rnd() * 3; const y = rnd() * H; g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= W; x += 40) g.lineTo(x, y + Math.sin(x / 80 + i) * 4); g.stroke(); } });
  const tabua = new THREE.Mesh(new THREE.BoxGeometry(8, .35, 3), new THREE.MeshStandardMaterial({ map: madeira, roughness: .7 })); tabua.position.set(-2.6, -.18, 0); tabua.castShadow = tabua.receiveShadow = true; cena.add(tabua);
  const s = sabonete(); s.position.set(1.15, .17, .2); s.rotation.y = .3; cena.add(s);
  cam.position.set(2.8, 1.1, 4.2); cam.lookAt(.6, .1, 0);
  const comp = new EffectComposer(r); comp.addPass(new RenderPass(cena, cam)); comp.addPass(new BokehPass(cena, cam, { focus: 3.7, aperture: .01, maxblur: .015 })); comp.addPass(new OutputPass()); comp.render();
}
export function bordaAzulejo(canvas, { w = 1920, h = 1080 } = {}) {
  const { r, cena, cam } = base(canvas, w, h, '#151513');
  const azulejo = tela(2048, 2048, (g, W, H) => { g.fillStyle = '#d6d6cf'; g.fillRect(0, 0, W, H); const t = 256; for (let y = 0; y < H; y += t) for (let x = 0; x < W; x += t) { const v = 40 + rnd() * 12 | 0; g.fillStyle = `rgb(${v},${v + 6},${v + 3})`; g.fillRect(x + 6, y + 6, t - 12, t - 12); } });
  azulejo.wrapS = azulejo.wrapT = THREE.RepeatWrapping; azulejo.repeat.set(3, 3);
  const chao = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.MeshPhysicalMaterial({ map: azulejo, roughness: .25, clearcoat: .8, clearcoatRoughness: .2 })); chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; cena.add(chao);
  const s = sabonete(); s.position.set(0, .17, 0); s.scale.setScalar(1); cena.add(s);
  cam.fov = 22; cam.position.set(.4, .25, 2.15); cam.lookAt(0, .2, 0); cam.updateProjectionMatrix();
  const comp = new EffectComposer(r); comp.addPass(new RenderPass(cena, cam)); comp.addPass(new BokehPass(cena, cam, { focus: 1.25, aperture: .02, maxblur: .012 })); comp.addPass(new OutputPass()); comp.render();
}
export function azeitonas(canvas, { w = 1920, h = 1080 } = {}) {
  const { r, cena, cam } = base(canvas, w, h, '#0b0a07');
  const geo = new THREE.SphereGeometry(.12, 32, 24); geo.scale(1, 1.38, 1);
  const tons = [0x2e3a12, 0x46501b, 0x3a1f2b, 0x24121b, 0x5b6322];
  for (let i = 0; i < 160; i++) {
    const m = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: tons[i % tons.length], roughness: .28, clearcoat: .9, clearcoatRoughness: .15, sheen: .3 }));
    const t = rnd(); m.position.set(-3.5 + t * 7 + (rnd() - .5) * 2.2, 2.2 - t * 4.4 + (rnd() - .5) * 2.4, -1 - rnd() * 4);
    m.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6); m.scale.setScalar(.8 + rnd() * .5); cena.add(m);
  }
  cam.position.set(0, 0, 6); cam.lookAt(0, 0, -1);
  const comp = new EffectComposer(r); comp.addPass(new RenderPass(cena, cam)); comp.addPass(new BokehPass(cena, cam, { focus: 7.5, aperture: .012, maxblur: .012 })); comp.addPass(new OutputPass()); comp.render();
}
