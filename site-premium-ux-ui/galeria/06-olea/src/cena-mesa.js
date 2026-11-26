// OLEA — bancada do artesão em 3D (modelo próprio): base de corte verde com grade e números, o sabonete OLEA,
// lápis de madeira, estilete, réguas e folhas de oliveira; luz de janela quente com sombras macias.
// Usada para a abertura (vista inclinada, desfocada) e para a cena "perfeitamente redondo" (vista de cima).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { montarSabonete } from './sabonete.js';

const rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(777);
const tela = (w, h, fn, cor = true) => { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); if (cor) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t; };

// base de corte: verde-oliva escuro, grade de 1 cm (fina) e 5 cm (média), diagonais de 45° e números nas bordas
function texturaBase() {
  return tela(4096, 2730, (g, w, h) => {
    g.fillStyle = '#2b5547'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) { const v = rnd(); g.fillStyle = `rgba(${v > .5 ? 255 : 0},${v > .5 ? 255 : 0},${v > .5 ? 255 : 0},.025)`; g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 40, 1 + rnd() * 3); } // marcas de uso
    const cm = 64, x0 = 160, y0 = 160;
    for (let x = x0, k = 0; x < w - 100; x += cm, k++) { g.strokeStyle = k % 5 ? 'rgba(206,226,210,.2)' : 'rgba(225,240,228,.42)'; g.lineWidth = k % 5 ? 1.1 : 2.2; g.beginPath(); g.moveTo(x, y0); g.lineTo(x, h - 100); g.stroke(); }
    for (let y = y0, k = 0; y < h - 100; y += cm, k++) { g.strokeStyle = k % 5 ? 'rgba(206,226,210,.2)' : 'rgba(225,240,228,.42)'; g.lineWidth = k % 5 ? 1.1 : 2.2; g.beginPath(); g.moveTo(x0, y); g.lineTo(w - 100, y); g.stroke(); }
    g.strokeStyle = 'rgba(225,240,228,.35)'; g.lineWidth = 2; for (const d of [0, 1]) { g.beginPath(); g.moveTo(x0, d ? h - 100 : y0); g.lineTo(x0 + (h - 260), d ? y0 : h - 100); g.stroke(); }
    g.fillStyle = 'rgba(225,240,228,.7)'; g.font = '500 30px Arial'; g.textAlign = 'center';
    for (let x = x0, k = 0; x < w - 100; x += cm * 5, k += 5) g.fillText(k, x, y0 - 24);
    g.textAlign = 'right'; for (let y = y0, k = 0; y < h - 100; y += cm * 5, k += 5) g.fillText(k, x0 - 24, y + 10);
  });
}
function texturaMadeira(base = '#c99a62') {
  return tela(512, 128, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(120,80,40,${.1 + rnd() * .2})`; g.lineWidth = 1 + rnd() * 2; const y = rnd() * h; g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x / 60 + i) * 3); g.stroke(); } });
}

function lapis() {
  const gr = new THREE.Group();
  const corpo = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, 1.5, 6), new THREE.MeshStandardMaterial({ map: texturaMadeira('#b78a55'), roughness: .7 }));
  const ponta = new THREE.Mesh(new THREE.ConeGeometry(.045, .16, 6), new THREE.MeshStandardMaterial({ color: 0xd9b58a, roughness: .8 })); ponta.position.y = .83;
  const grafite = new THREE.Mesh(new THREE.ConeGeometry(.012, .045, 6), new THREE.MeshStandardMaterial({ color: 0x222222, roughness: .4, metalness: .3 })); grafite.position.y = .9;
  gr.add(corpo, ponta, grafite); gr.rotation.z = Math.PI / 2; return gr;
}
function estilete() {
  const gr = new THREE.Group();
  const cabo = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .9, 16), new THREE.MeshStandardMaterial({ map: texturaMadeira('#8a5a32'), roughness: .6 }));
  const virola = new THREE.Mesh(new THREE.CylinderGeometry(.043, .043, .1, 16), new THREE.MeshStandardMaterial({ color: 0xb8b8b0, metalness: 1, roughness: .25 })); virola.position.y = .5;
  const lamina = new THREE.Mesh(new THREE.BoxGeometry(.06, .16, .006), new THREE.MeshStandardMaterial({ color: 0xd9d9d6, metalness: 1, roughness: .15 })); lamina.position.y = .62;
  gr.add(cabo, virola, lamina); gr.rotation.z = Math.PI / 2; return gr;
}
function folha() {
  const s = new THREE.Shape(); s.moveTo(0, 0); s.quadraticCurveTo(.06, .14, 0, .32); s.quadraticCurveTo(-.06, .14, 0, 0);
  const m = new THREE.Mesh(new THREE.ShapeGeometry(s, 12), new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(.21, .32, .12 + rnd() * .06), roughness: .7, side: THREE.DoubleSide }));
  m.rotation.x = -Math.PI / 2; return m;
}

// parede de painel perfurado (creme, furos ovais) com prateleira: garrafa de azeite, potes de cerâmica e um ramo
function texturaPainel() {
  return tela(2048, 1170, (g, w, h) => {
    g.fillStyle = '#e8e1d2'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(120,100,70,${rnd() * .04})`; g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 30, 2 + rnd() * 30); }
    for (let y = 40, r = 0; y < h; y += 58, r++) for (let x = 30 + (r % 2) * 38; x < w; x += 76) {
      const gr = g.createLinearGradient(0, y - 18, 0, y + 18); gr.addColorStop(0, '#3b342a'); gr.addColorStop(1, '#6e6352');
      g.fillStyle = gr; g.beginPath(); g.roundRect(x - 6, y - 18, 12, 36, 6); g.fill(); }
  });
}
function prateleira() {
  const gr = new THREE.Group();
  const tabua = new THREE.Mesh(new THREE.BoxGeometry(3.2, .08, .5), new THREE.MeshStandardMaterial({ map: texturaMadeira('#a8794a'), roughness: .7 })); gr.add(tabua);
  const vidro = new THREE.MeshPhysicalMaterial({ color: 0x6f7d2a, transmission: .85, thickness: .4, roughness: .08, ior: 1.5, attenuationColor: new THREE.Color('#5d6a1c'), attenuationDistance: .6 });
  const garrafa = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [.2, 0], [.21, .02], [.21, .7], [.16, .8], [.07, .9], [.065, 1.05], [.08, 1.07], [.08, 1.12], [0, 1.12]].map(([x, y]) => new THREE.Vector2(x, y)), 48), vidro);
  garrafa.position.set(-.9, .04, 0); gr.add(garrafa);
  const rolha = new THREE.Mesh(new THREE.CylinderGeometry(.07, .065, .14, 20), new THREE.MeshStandardMaterial({ color: 0xa57b4f, roughness: .9 })); rolha.position.set(-.9, 1.18, 0); gr.add(rolha);
  const ceramica = (cor, rr, hh, x) => { const m = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [rr * .8, 0], [rr, .05], [rr, hh * .8], [rr * .92, hh], [rr * .85, hh], [rr * .85, hh * .2], [0, hh * .2]].map(([a, b]) => new THREE.Vector2(a, b)), 40), new THREE.MeshStandardMaterial({ color: cor, roughness: .55 })); m.position.set(x, .04, 0); return m; };
  gr.add(ceramica(0xd8cbb3, .22, .42, -.2), ceramica(0x7d8a64, .16, .3, .3), ceramica(0xb98a62, .25, .28, .95));
  gr.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return gr;
}

export function montarMesa(canvas, { largura = 1440, altura = 900, parede = false } = {}) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  r.setPixelRatio(1); r.setSize(largura, altura, false); r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = .9; r.outputColorSpace = THREE.SRGBColorSpace;
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFShadowMap;
  const cena = new THREE.Scene(); cena.background = new THREE.Color('#1b1a14');
  const pm = new THREE.PMREMGenerator(r); cena.environment = pm.fromScene(new RoomEnvironment(), .04).texture; pm.dispose(); cena.environmentIntensity = .35;
  const sol = new THREE.DirectionalLight(0xffe2b8, 2.6); sol.position.set(-4, 6, 3); sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048);
  Object.assign(sol.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: .5, far: 20 }); sol.shadow.radius = 6; sol.shadow.bias = -.0005; cena.add(sol);
  cena.add(new THREE.HemisphereLight(0xfff1dc, 0x2b2a20, .5));

  // mesa de madeira e a base de corte
  const mesa = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ map: (() => { const t = texturaMadeira('#4a2f1c'); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 40); return t; })(), roughness: .75 }));
  mesa.rotation.x = -Math.PI / 2; mesa.position.y = -.03; mesa.receiveShadow = true; cena.add(mesa);
  const base = new THREE.Mesh(new THREE.BoxGeometry(9, .03, 6), [0, 1, 2, 3, 4, 5].map(i => i === 2 ? new THREE.MeshStandardMaterial({ map: texturaBase(), roughness: .85 }) : new THREE.MeshStandardMaterial({ color: 0x2f5a4c, roughness: .85 })));
  base.receiveShadow = true; cena.add(base);

  // sabonete (reaproveita a malha do sabonete 3D)
  const sc = document.createElement('canvas'); sc.width = sc.height = 8; const sab = montarSabonete(sc);
  const peca = sab.pivo.clone(true); peca.scale.setScalar(.95); peca.position.set(0, .02 + .17 * .95, 0);
  peca.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); cena.add(peca);

  const l = lapis(); l.position.set(1.9, .065, 1.1); l.rotation.y = .5; l.traverse(o => o.isMesh && (o.castShadow = true)); cena.add(l);
  const e = estilete(); e.position.set(-2.3, .06, -1.2); e.rotation.y = -.35; e.traverse(o => o.isMesh && (o.castShadow = true)); cena.add(e);
  for (let i = 0; i < 9; i++) { const f = folha(); f.position.set(-3 + rnd() * 6, .022 + i * .0005, -2.2 + rnd() * 4.4); f.rotation.z = rnd() * 6.28; if (Math.hypot(f.position.x, f.position.z) < 1.3) f.position.x += 2; f.castShadow = true; cena.add(f); }

  if (parede) {
    const tp = texturaPainel(); tp.wrapS = tp.wrapT = THREE.RepeatWrapping; tp.repeat.set(2, 2);
    const muro = new THREE.Mesh(new THREE.PlaneGeometry(16, 9), new THREE.MeshStandardMaterial({ map: tp, roughness: .9 }));
    muro.position.set(0, 4.4, -3.4); muro.receiveShadow = true; cena.add(muro);
    const pr = prateleira(); pr.position.set(-1.6, 2.4, -3.1); cena.add(pr);
    sol.position.set(-6, 5, 4); sol.intensity = 2.2;
    const janela = new THREE.SpotLight(0xffd7a0, 60, 30, .5, .9, 1.6); janela.position.set(-7, 6, 2); janela.target.position.set(1, 2.5, -3.4); janela.castShadow = true; janela.shadow.mapSize.set(1024, 1024);
    cena.add(janela, janela.target); cena.environmentIntensity = .25;
  }
  const cam = new THREE.PerspectiveCamera(30, largura / altura, .1, 100);
  const comp = new EffectComposer(r); comp.addPass(new RenderPass(cena, cam));
  const bokeh = new BokehPass(cena, cam, { focus: 6, aperture: .004, maxblur: .012 }); comp.addPass(bokeh); comp.addPass(new OutputPass());
  const quadro = ({ pos = [0, 9, .01], alvo = [0, 0, 0], desfoque = 0, foco = 9 } = {}) => {
    cam.position.set(...pos); cam.lookAt(...alvo); cam.updateProjectionMatrix();
    bokeh.enabled = desfoque > 0; bokeh.uniforms.focus.value = foco; bokeh.uniforms.aperture.value = desfoque; bokeh.uniforms.maxblur.value = .02;
    comp.render();
  };
  return { quadro, cena, peca };
}
