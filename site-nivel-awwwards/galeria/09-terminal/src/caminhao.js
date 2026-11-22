// Caminhão-baú da CAIS em three.js, para o primeiro quadro do hero (render offline em gerar-hero.mjs).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export function montar(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  r.setSize(canvas.width, canvas.height, false);
  r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.0;
  const cena = new THREE.Scene();
  // céu de entardecer: lilás no alto, pêssego no meio, laranja no horizonte
  const ceu = document.createElement('canvas'); ceu.width = 16; ceu.height = 512;
  const g = ceu.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 512);
  gr.addColorStop(0, '#cdbfc4'); gr.addColorStop(.3, '#dcc2b4'); gr.addColorStop(.62, '#e4bb8c'); gr.addColorStop(.8, '#dca064'); gr.addColorStop(.805, '#0a0505'); gr.addColorStop(1, '#030202');
  g.fillStyle = gr; g.fillRect(0, 0, 16, 512);
  const tex = new THREE.CanvasTexture(ceu); tex.colorSpace = THREE.SRGBColorSpace; cena.background = tex;
  const pm = new THREE.PMREMGenerator(r); cena.environment = pm.fromScene(new RoomEnvironment(), .04).texture; cena.environmentIntensity = .25;
  const contra = new THREE.DirectionalLight('#ffcf9a', 2.2); contra.position.set(-10, 6, -12); cena.add(contra);
  const recorte = new THREE.DirectionalLight('#ffe3c0', 1.1); recorte.position.set(12, 4, -6); cena.add(recorte);
  cena.add(new THREE.HemisphereLight('#e8c9a8', '#050302', .35));

  const pintura = new THREE.MeshPhysicalMaterial({ color: '#5a4a3f', metalness: .5, roughness: .38, clearcoat: .6 });
  const cabine = new THREE.MeshPhysicalMaterial({ color: '#7a6b5f', metalness: .6, roughness: .3, clearcoat: 1 });
  const preto = new THREE.MeshStandardMaterial({ color: '#0d0b0a', roughness: .7 });
  const cromo = new THREE.MeshStandardMaterial({ color: '#d9d6d2', metalness: 1, roughness: .15 });
  const vidro = new THREE.MeshPhysicalMaterial({ color: '#1a1714', metalness: .2, roughness: .05, clearcoat: 1 });
  const caminhao = new THREE.Group(); cena.add(caminhao);
  const roda = (x) => { [1.15, -1.15].forEach(z => { const pneu = new THREE.Mesh(new THREE.CylinderGeometry(.52, .52, .32, 40), preto); pneu.rotation.x = Math.PI / 2; pneu.position.set(x, .52, z); caminhao.add(pneu); const aro = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .34, 24), cromo); aro.rotation.x = Math.PI / 2; aro.position.set(x, .52, z); caminhao.add(aro); }); };
  // carreta
  const bau = new THREE.Mesh(new RoundedBoxGeometry(13.6, 2.7, 2.5, 2, .05), pintura); bau.position.set(-1.4, 2.65, 0); caminhao.add(bau);
  const saia = new THREE.Mesh(new THREE.BoxGeometry(13.4, .18, 2.3), preto); saia.position.set(-1.4, 1.22, 0); caminhao.add(saia);
  [-7.4, -6.3].forEach(roda);
  const para = new THREE.Mesh(new THREE.BoxGeometry(.5, .5, 2.2), preto); para.position.set(-8, 1, 0); caminhao.add(para);
  const pe = new THREE.Mesh(new THREE.BoxGeometry(.12, 1, .12), preto); pe.position.set(2.5, .7, 1); caminhao.add(pe);
  [-8.1, 5.2].forEach(x => { const l = new THREE.Mesh(new THREE.BoxGeometry(.12, .05, .08), new THREE.MeshBasicMaterial({ color: '#ffffff' })); l.position.set(x, 4.02, 1.26); caminhao.add(l); });
  // cavalo mecânico: perfil extrudado
  const perfil = new THREE.Shape();
  perfil.moveTo(0, 0); perfil.lineTo(4.4, 0); perfil.lineTo(4.4, 1.25); perfil.lineTo(4.3, 1.55); perfil.quadraticCurveTo(3.9, 1.75, 3.35, 1.8);
  perfil.lineTo(2.85, 2.85); perfil.quadraticCurveTo(2.4, 3.5, 1.2, 3.75); perfil.lineTo(0, 3.78); perfil.lineTo(0, 0);
  const cav = new THREE.Mesh(new THREE.ExtrudeGeometry(perfil, { depth: 2.45, bevelEnabled: true, bevelSize: .06, bevelThickness: .06, bevelSegments: 3 }), cabine);
  cav.position.set(5.7, 1.05, -1.225); caminhao.add(cav);
  const janela = new THREE.Shape(); janela.moveTo(0, 0); janela.lineTo(.75, 0); janela.lineTo(.45, .8); janela.lineTo(0, .8); janela.lineTo(0, 0);
  const jan = new THREE.Mesh(new THREE.ShapeGeometry(janela), vidro); jan.position.set(8.25, 2.85, 1.29); caminhao.add(jan);
  const jan2 = new THREE.Mesh(new THREE.PlaneGeometry(.5, .6), vidro); jan2.position.set(6.4, 3.3, 1.29); caminhao.add(jan2);
  const grade = new THREE.Mesh(new THREE.BoxGeometry(.1, 1.1, 1.9), cromo); grade.position.set(10.17, 1.85, 0); caminhao.add(grade);
  const parachoque = new THREE.Mesh(new RoundedBoxGeometry(.35, .45, 2.6, 2, .08), cromo); parachoque.position.set(10.2, .95, 0); caminhao.add(parachoque);
  const tanque = new THREE.Mesh(new THREE.CylinderGeometry(.33, .33, 1.3, 32), cromo); tanque.rotation.z = Math.PI / 2; tanque.position.set(7.6, 1.05, 1.05); caminhao.add(tanque);
  const escape = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, 2.6, 16), cromo); escape.position.set(6.95, 3.2, 1.15); caminhao.add(escape);
  const espelho = new THREE.Mesh(new THREE.BoxGeometry(.06, .35, .2), preto); espelho.position.set(9.3, 2.7, 1.5); caminhao.add(espelho);
  [3.3, 4.5, 9.4].forEach(roda);
  // farol e o cone de luz no chão
  const farol = new THREE.Mesh(new THREE.CircleGeometry(.16, 24), new THREE.MeshBasicMaterial({ color: '#fff6e0', toneMapped: false })); farol.position.set(10.38, 1.55, 1.05); farol.rotation.y = Math.PI / 2; caminhao.add(farol);
  const brilho = document.createElement('canvas'); brilho.width = brilho.height = 128; { const c = brilho.getContext('2d'); const rg = c.createRadialGradient(64, 64, 0, 64, 64, 64); rg.addColorStop(0, 'rgba(255,240,210,1)'); rg.addColorStop(1, 'rgba(255,240,210,0)'); c.fillStyle = rg; c.fillRect(0, 0, 128, 128); }
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(brilho), blending: THREE.AdditiveBlending, depthWrite: false })); sp.scale.set(2.4, 2.4, 1); sp.position.set(10.6, 1.55, 1.2); caminhao.add(sp);
  const cone = new THREE.Mesh(new THREE.PlaneGeometry(14, 6), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture((() => { const c = document.createElement('canvas'); c.width = 256; c.height = 64; const x = c.getContext('2d'); const lg = x.createLinearGradient(0, 0, 256, 0); lg.addColorStop(0, 'rgba(255,210,150,.55)'); lg.addColorStop(1, 'rgba(255,210,150,0)'); x.fillStyle = lg; x.beginPath(); x.moveTo(0, 28); x.lineTo(256, 0); x.lineTo(256, 64); x.lineTo(0, 36); x.fill(); return c; })()), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  cone.rotation.x = -Math.PI / 2; cone.position.set(17.4, .01, 3); caminhao.add(cone);
  const chao = new THREE.Mesh(new THREE.PlaneGeometry(400, 200), new THREE.MeshBasicMaterial({ color: '#060303' })); chao.rotation.x = -Math.PI / 2; cena.add(chao);

  const cam = new THREE.PerspectiveCamera(22, canvas.width / canvas.height, .1, 500);
  cam.position.set(1.5, 2.0, 35.5); cam.lookAt(1.5, 3.1, 0);
  return { quadro: () => r.render(cena, cam) };
}
