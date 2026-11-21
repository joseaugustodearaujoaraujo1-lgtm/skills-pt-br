// Xícara 3D real (three.js): geometria em código (Lathe + Tube), material PBR, ambiente PMREM, ACES, sombra de contato e vapor.
// Carregada só depois da entrada do hero (o pôster é um render desta mesma cena). Gira com o scroll, inclina com o mouse ou o giroscópio.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export function montarXicara(canvas, { aoPronto, progresso } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  const dpr = Math.min(devicePixelRatio, innerWidth < 860 ? 1.5 : 2);
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const cena = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  cena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  cena.environmentIntensity = 0.85;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 3.6, 7.4);
  camera.lookAt(0, 0.42, 0);

  const sol = new THREE.DirectionalLight(0xfff1e0, 1.6);
  sol.position.set(-3, 5, 4);
  cena.add(sol);
  cena.add(new THREE.HemisphereLight(0xfff6ec, 0x5a3a28, 0.35));

  // ---------- texturas procedurais (microdetalhe) ----------
  const tex = (w, h, desenhar, cor = true) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    desenhar(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    if (cor) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  };
  const rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();

  // esmalte terracota com pintas (cerâmica artesanal)
  const esmalte = tex(1024, 512, (g, w, h) => {
    g.fillStyle = '#9e4124'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${rnd() > .5 ? '60,28,14' : '235,190,150'},${.15 + rnd() * .35})`; g.beginPath(); g.arc(rnd() * w, rnd() * h, rnd() * 1.6 + .3, 0, 7); g.fill(); }
    const grad = g.createLinearGradient(0, 0, 0, h); grad.addColorStop(0, 'rgba(255,220,190,.10)'); grad.addColorStop(1, 'rgba(40,15,5,.28)');
    g.fillStyle = grad; g.fillRect(0, 0, w, h);
  });
  const rugEsmalte = tex(512, 256, (g, w, h) => {
    g.fillStyle = '#5a5a5a'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 4000; i++) { const v = 70 + rnd() * 70 | 0; g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(rnd() * w, rnd() * h, 1.5, 1.5); }
  }, false);
  // cerâmica creme (interior e pires)
  const creme = tex(512, 512, (g, w, h) => {
    g.fillStyle = '#efe6da'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(90,60,40,${.08 + rnd() * .2})`; g.beginPath(); g.arc(rnd() * w, rnd() * h, rnd() * 1.2 + .3, 0, 7); g.fill(); }
  });
  // crema do espresso: anel escuro na borda, centro dourado, bolhas e um "tigre" sutil
  const crema = tex(1024, 1024, (g, w, h) => {
    const cx = w / 2, cy = h / 2, r = w / 2;
    const rad = g.createRadialGradient(cx, cy, 0, cx, cy, r);
    rad.addColorStop(0, '#a5632f'); rad.addColorStop(.5, '#84461f'); rad.addColorStop(.82, '#4a220d'); rad.addColorStop(1, '#1e0c04');
    g.fillStyle = rad; g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = 'overlay';
    for (let i = 0; i < 90; i++) { const a = rnd() * Math.PI * 2, d = rnd() * r * .85; g.strokeStyle = `rgba(${rnd() > .5 ? '255,220,170' : '70,30,10'},.18)`; g.lineWidth = 2 + rnd() * 6; g.beginPath(); g.arc(cx + Math.cos(a) * d * .2, cy + Math.sin(a) * d * .2, d, a, a + .6 + rnd()); g.stroke(); }
    g.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 700; i++) { const a = rnd() * 7, d = Math.sqrt(rnd()) * r * .95; g.fillStyle = `rgba(230,180,120,${.1 + rnd() * .2})`; g.beginPath(); g.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, rnd() * 2.2 + .4, 0, 7); g.fill(); }
  });
  const sombraTex = tex(256, 256, (g, w, h) => {
    const r = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    r.addColorStop(0, 'rgba(5,2,0,.75)'); r.addColorStop(.5, 'rgba(5,2,0,.3)'); r.addColorStop(1, 'rgba(40,22,10,0)');
    g.fillStyle = r; g.fillRect(0, 0, w, h);
  });
  const vaporTex = tex(128, 256, (g, w, h) => {
    for (let i = 0; i < 26; i++) { const y = h * (.1 + rnd() * .8), x = w / 2 + Math.sin(y / 30) * 18 + (rnd() - .5) * 14, r = 14 + rnd() * 22;
      const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,.16)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
  });

  // ---------- materiais PBR ----------
  const matFora = new THREE.MeshPhysicalMaterial({ map: esmalte, roughnessMap: rugEsmalte, roughness: .55, clearcoat: .6, clearcoatRoughness: .25, sheen: .2 });
  const matCreme = new THREE.MeshPhysicalMaterial({ map: creme, roughness: .18, clearcoat: 1, clearcoatRoughness: .06, side: THREE.DoubleSide });
  const matCafe = new THREE.MeshPhysicalMaterial({ map: crema, roughness: .45, clearcoat: .35, clearcoatRoughness: .2, envMapIntensity: .5 });

  const xicara = new THREE.Group();

  // perfil da xícara (cm → unidades): base com pé, bojo curvo, borda arredondada
  const P = (x, y) => new THREE.Vector2(x, y);
  const fora = [P(0, 0.02), P(0.42, 0.02), P(0.46, 0.04), P(0.47, 0.09), P(0.5, 0.1), P(0.66, 0.2), P(0.8, 0.42), P(0.88, 0.7), P(0.92, 0.98), P(0.935, 1.1)];
  const borda = []; for (let i = 0; i <= 8; i++) { const a = Math.PI * i / 8; borda.push(P(0.905 + Math.cos(a) * 0.03, 1.1 + Math.sin(a) * 0.03)); }
  const dentro = [P(0.875, 1.1), P(0.86, 0.96), P(0.82, 0.7), P(0.73, 0.43), P(0.58, 0.24), P(0.3, 0.16), P(0, 0.155)];
  const exterior = new THREE.Mesh(new THREE.LatheGeometry(new THREE.SplineCurve(fora).getPoints(60), 128), matFora);
  const interior = new THREE.Mesh(new THREE.LatheGeometry([...borda, ...new THREE.SplineCurve(dentro).getPoints(50)], 128), matCreme);
  xicara.add(exterior, interior);

  // café com crema: disco na altura do líquido, com menisco
  const nivel = 0.86;
  const cafe = new THREE.Mesh(new THREE.CircleGeometry(0.85, 96), matCafe);
  cafe.rotation.x = -Math.PI / 2; cafe.position.y = nivel; cafe.rotation.z = .4;
  xicara.add(cafe);

  // alça: tubo por uma curva fechada em D, mais grossa em cima
  const alcaCurva = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.9, 0.92, 0), new THREE.Vector3(1.18, 0.98, 0), new THREE.Vector3(1.36, 0.78, 0),
    new THREE.Vector3(1.3, 0.48, 0), new THREE.Vector3(1.06, 0.34, 0), new THREE.Vector3(0.8, 0.4, 0),
  ]);
  const alca = new THREE.Mesh(new THREE.TubeGeometry(alcaCurva, 80, 0.068, 24, false), matFora);
  xicara.add(alca);

  // pires
  const piresPerfil = [P(0, 0), P(0.6, 0), P(0.64, 0.02), P(0.66, 0.05), P(1.1, 0.07), P(1.38, 0.14), P(1.5, 0.2), P(1.53, 0.23), P(1.5, 0.245), P(1.36, 0.18), P(1.08, 0.115), P(0.6, 0.1), P(0, 0.1)];
  const pires = new THREE.Mesh(new THREE.LatheGeometry(new THREE.SplineCurve(piresPerfil).getPoints(80), 128), matCreme);
  pires.position.y = -0.08;
  xicara.position.y = 0.02;

  const conjunto = new THREE.Group();
  conjunto.add(pires, xicara);
  cena.add(conjunto);

  // sombra de contato
  const sombra = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.2), new THREE.MeshBasicMaterial({ map: sombraTex, transparent: true, depthWrite: false }));
  sombra.rotation.x = -Math.PI / 2; sombra.position.y = -0.085;
  cena.add(sombra);

  // vapor: 4 planos voltados à câmera, subindo e sumindo em ciclo
  const vapores = Array.from({ length: 4 }, (_, i) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 1.5), new THREE.MeshBasicMaterial({ map: vaporTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
    m.userData = { fase: i / 4, x: (i % 2 ? .14 : -.12) };
    cena.add(m); return m;
  });

  // ---------- interação ----------
  const alvo = { x: 0, y: 0 }, atual = { x: 0, y: 0 };
  const inclinar = (nx, ny) => { alvo.x = Math.max(-1, Math.min(1, nx)); alvo.y = Math.max(-1, Math.min(1, ny)); };

  const tamanho = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  tamanho();
  new ResizeObserver(tamanho).observe(canvas);

  let visivel = true, rodando = false, t0 = performance.now(), primeiro = true;
  const quadro = (agora) => {
    if (!visivel || document.hidden) { rodando = false; return; }
    const t = (agora - t0) / 1000;
    atual.x += (alvo.x - atual.x) * .06; atual.y += (alvo.y - atual.y) * .06;
    const p = progresso ? progresso() : 0;
    conjunto.rotation.y = -0.45 + Math.sin(t * 0.35) * 0.3 + p * Math.PI * 1.1 + atual.x * 0.5;
    conjunto.rotation.x = atual.y * 0.12;
    conjunto.position.y = Math.sin(t * 1.2) * 0.02;
    for (const v of vapores) {
      const f = (t * 0.22 + v.userData.fase) % 1;
      v.position.set(v.userData.x + Math.sin(t + f * 6) * 0.05, 1.55 + f * 1.2, 0);
      v.quaternion.copy(camera.quaternion);
      v.material.opacity = Math.sin(f * Math.PI) * 0.9 * (1 - p);
      v.scale.setScalar(0.7 + f * 0.7);
    }
    renderer.render(cena, camera);
    if (primeiro) { primeiro = false; aoPronto && aoPronto(); }
    requestAnimationFrame(quadro);
  };
  const ligar = () => { if (!rodando && visivel && !document.hidden) { rodando = true; requestAnimationFrame(quadro); } };
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; ligar(); }).observe(canvas);
  document.addEventListener('visibilitychange', ligar);
  // compila os shaders antes do primeiro quadro (evita travar a entrada)
  (renderer.compileAsync ? renderer.compileAsync(cena, camera) : Promise.resolve()).then(ligar);

  return { inclinar };
}
