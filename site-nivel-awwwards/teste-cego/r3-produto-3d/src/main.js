// MÓ 01 — motion com GSAP + ScrollTrigger + Lenis. Ideia: role e o moedor se abre, peça por peça, ao longo do próprio eixo.
// 3D: pôster (quadro 0 da própria cena) primeiro; o WebGL (three.js) liga depois da entrada, com a página ociosa ou na 1ª interação.
// Sem GPU de verdade, com economia de dados ou aparelho fraco: quadros renderizados da mesma cena, escolhidos pela rolagem.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { estadoDe, QUADROS, PASSOS, passoDe } from './roteiro.js';
import ANCORAS from '../public/img/quadros/ancoras.json';

gsap.registerPlugin(ScrollTrigger, SplitText);
const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fino = matchMedia('(pointer: fine)').matches;
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
const forcarGPU = new URLSearchParams(location.search).has('gpu');

// ---------- topo ----------
const topo = $('#topo');
addEventListener('scroll', () => topo.classList.toggle('solido', scrollY > 40), { passive: true });

// ---------- palco ----------
const palco = $('#palco'), quadro = $('.cena-quadro'), canvas = $('.cena-canvas'), svg = $('.cotas'), regua = $('.regua');
const rotulos = Object.fromEntries($$('.rotulos li').map(li => [li.dataset.peca, li]));
const NS = 'http://www.w3.org/2000/svg';
const linhas = Object.fromEntries(PASSOS.map(p => {
  const g = document.createElementNS(NS, 'g'), l = document.createElementNS(NS, 'line'), c = document.createElementNS(NS, 'circle');
  c.setAttribute('r', 3.5); g.append(l, c); g.style.opacity = 0; svg.append(g); return [p, { g, l, c }];
}));
let t = 0, cena = null, vivo = false, idxQuadro = 0;
const imgs = [];
function carregarQuadros() {
  if (imgs.length) return;
  for (let i = 0; i < QUADROS; i++) { const im = new Image(); im.decoding = 'async'; im.src = `img/quadros/q${String(i).padStart(2, '0')}.webp`; imgs.push(im); }
}
const LX = .74; // coluna dos rótulos (fração da caixa)
// raio de cada peça (cm), para a linha de cota começar na borda e não no eixo; escala ~ 31 px/cm a 56 de distância
const RAIO = { porca: .62, cabeca: 2.4, corpo: 2.55, mo: 1.3, anel: 2.9 };
function cotas(anc, e, ativo) {
  const vis = gsap.utils.clamp(0, 1, (e - .55) / .3);
  for (const p of PASSOS) {
    const [x, y] = anc[p], { g, l, c } = linhas[p], li = rotulos[p];
    const x0 = x * 640 + RAIO[p] * 31 * 56 / (56 + 34 * e) + 8, x1 = LX * 640 - 8, yy = y * 800;
    l.setAttribute('x1', x0); l.setAttribute('x2', x1); l.setAttribute('y1', yy); l.setAttribute('y2', yy);
    c.setAttribute('cx', x0); c.setAttribute('cy', yy);
    g.style.opacity = vis * (p === ativo || ativo === null ? 1 : .45);
    li.style.left = LX * 100 + '%'; li.style.top = y * 100 + '%'; li.style.opacity = vis;
    li.classList.toggle('ativo', p === ativo);
  }
}
function atualizar() {
  const est = estadoDe(t), passo = passoDe(t), ativo = passo < 0 ? null : PASSOS[passo];
  regua.style.opacity = 1 - Math.min(1, est.e * 3);
  if (vivo) { pedir(); return; }
  const i = Math.round(t * (QUADROS - 1));
  if (i !== idxQuadro && imgs[i]?.complete) { quadro.src = imgs[i].src; idxQuadro = i; }
  cotas(ANCORAS[idxQuadro], estadoDe(idxQuadro / (QUADROS - 1)).e, ativo);
}

// ---------- 3D ao vivo ----------
let sujo = true, extra = 0, extraAlvo = 0, giro = 0, inicio = 0, rodando = false, visivel = true;
function pedir() { sujo = true; if (!rodando && visivel && !document.hidden) { rodando = true; requestAnimationFrame(quadroVivo); } }
function quadroVivo(agora) {
  rodando = false; if (!cena) return;
  const dt = Math.min(.05, (agora - (quadroVivo.ult || agora)) / 1000); quadroVivo.ult = agora;
  const seg = (agora - inicio) / 1000;
  const girando = seg < 7 && t < .05;               // giro automático só nos primeiros segundos, no hero
  if (girando) giro += dt * .45 * Math.min(1, 7 - seg);
  extra += (extraAlvo - extra) * Math.min(1, dt * 6);
  const mexendo = girando || Math.abs(extraAlvo - extra) > .001;
  if (sujo || mexendo) {
    const est = estadoDe(t), passo = passoDe(t);
    cena.definir({ ...est, rot: est.rot + giro + extra });
    cena.render(); sujo = false;
    const a = cena.ancoras(), w = cena.estado.w, h = cena.estado.h;
    cotas(Object.fromEntries(Object.entries(a).map(([k, [x, y]]) => [k, [x / w, y / h]])), est.e, passo < 0 ? null : PASSOS[passo]);
  }
  if (mexendo) pedir();
}
async function ligar3D() {
  if (ligar3D.feito) return; ligar3D.feito = true;
  const con = navigator.connection;
  if (!forcarGPU && (con?.saveData || (navigator.deviceMemory && navigator.deviceMemory < 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4))) return carregarQuadros();
  // sem GPU de verdade, renderização por software trava a página: fica com os quadros
  try {
    const gl = document.createElement('canvas').getContext('webgl2'); if (!gl) return carregarQuadros();
    const x = gl.getExtension('WEBGL_debug_renderer_info'), r = x ? gl.getParameter(x.UNMASKED_RENDERER_WEBGL) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    if (!forcarGPU && /swiftshader|llvmpipe|software/i.test(r)) return carregarQuadros();
  } catch { return carregarQuadros(); }
  performance.mark('3d-inicio');
  const { criarCena } = await import('./cena3d.js');
  cena = criarCena(canvas, { dpr: Math.min(devicePixelRatio || 1, 1.75) });
  const medir = () => { const r = canvas.getBoundingClientRect(); cena.tamanho(Math.round(r.width), Math.round(r.height)); pedir(); };
  medir(); new ResizeObserver(medir).observe(canvas);
  inicio = performance.now(); cena.definir(estadoDe(t)); cena.render();
  vivo = true; palco.classList.add('vivo'); performance.mark('3d-pronto'); pedir();
  if (fino) addEventListener('pointermove', e => { extraAlvo = (e.clientX / innerWidth - .5) * .5; pedir(); }, { passive: true });
  new IntersectionObserver(es => { visivel = es[0].isIntersecting; if (visivel) pedir(); }).observe(palco);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) pedir(); });
}

if (reduzido) {
  // movimento reduzido: sem scrub; o hero mostra o moedor montado e "Por dentro" mostra o estado final (aberto), sem animar
  carregarQuadros();
  const final = () => { const ult = QUADROS - 1; quadro.src = imgs[ult].src; idxQuadro = ult; regua.style.opacity = 0; cotas(ANCORAS[ult], 1, null); };
  const inicioQ = () => { quadro.src = imgs[0].src; idxQuadro = 0; regua.style.opacity = 1; cotas(ANCORAS[0], 0, null); };
  new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? final() : (e.boundingClientRect.top > 0 && inicioQ())), { threshold: .05 }).observe($('.por-dentro'));
} else {
  ScrollTrigger.create({ trigger: palco, start: 'top top', end: 'bottom bottom', onUpdate: s => { t = s.progress; atualizar(); } });
  addEventListener('scroll', carregarQuadros, { once: true, passive: true });
  const acordar = () => { ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(ev => removeEventListener(ev, acordar)); ligar3D(); };
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(ev => addEventListener(ev, acordar, { passive: true, once: true }));
  addEventListener('load', () => setTimeout(() => (window.requestIdleCallback || setTimeout)(() => { carregarQuadros(); acordar(); }, { timeout: 2000 }), 2600));
  atualizar();
}

// ---------- regulagem: o anel gira clique a clique com a rolagem ----------
const entalhes = $('.dial-entalhes'), USOS = ['pó fino, para molhos e caldos', 'pó fino, para massas', 'médio-fino, para ovos', 'médio, para saladas e legumes', 'médio, para peixes', 'grosso, para carnes', 'grosso, para a brasa', 'grão quebrado, para crosta de pimenta'];
const rects = [];
for (let i = 0; i < 8; i++) {
  const a = i * 45, r = document.createElementNS(NS, 'rect'), tx = document.createElementNS(NS, 'text');
  r.setAttribute('x', -3); r.setAttribute('y', -92); r.setAttribute('width', 6); r.setAttribute('height', 20); r.setAttribute('rx', 1.5); r.setAttribute('transform', `rotate(${a})`);
  const rad = (a - 90) * Math.PI / 180; tx.setAttribute('x', Math.cos(rad) * 58); tx.setAttribute('y', Math.sin(rad) * 58); tx.textContent = i + 1;
  entalhes.append(r, tx); rects.push(r);
}
const dial = $('.dial'), rolo = $('.reg-num-rolo'), uso = $('.reg-uso'), graos = $$('.graos li');
let reg = -1;
const textos = $$('.dial-entalhes text');
// números do anel sempre de pé
function endireitar() { const r = -gsap.getProperty(dial, 'rotation'); textos.forEach(x => { x.style.transform = `rotate(${r}deg)`; }); }
function regular(i) {
  if (i === reg) return; const subindo = i > reg; reg = i;
  rects.forEach((r, k) => r.classList.toggle('ativo', k === i)); graos.forEach((g, k) => g.classList.toggle('ativo', k === i));
  uso.textContent = USOS[i];
  if (reduzido) { gsap.set(dial, { rotation: -i * 45 }); endireitar(); rolo.textContent = i + 1; return; }
  gsap.to(dial, { rotation: -i * 45, duration: .55, ease: 'back.out(2.2)', overwrite: true, onUpdate: endireitar });
  // contador que rola na vertical (Spinning counter, transitions.dev)
  gsap.timeline({ overwrite: true }).to(rolo, { yPercent: subindo ? -100 : 100, duration: .16, ease: 'power2.in' })
    .add(() => { rolo.textContent = i + 1; }).fromTo(rolo, { yPercent: subindo ? 100 : -100 }, { yPercent: 0, duration: .3, ease: 'power3.out' });
}
regular(0);
ScrollTrigger.create({ trigger: '.reg-palco', start: 'top 75%', end: 'bottom 35%', onUpdate: s => regular(Math.min(7, Math.floor(s.progress * 8))) });

// ---------- formulário (sem envio real: ligar a um serviço antes de publicar) ----------
const form = $('.form'), campo = $('#email'), msg = $('#form-msg');
form.addEventListener('submit', e => {
  e.preventDefault();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(campo.value.trim());
  campo.setAttribute('aria-invalid', ok ? 'false' : 'true');
  msg.className = 'form-msg ' + (ok ? 'ok' : 'erro');
  msg.textContent = ok ? 'Anotado. Você recebe um único e-mail quando a fornada abrir.' : 'Confira o e-mail: falta o @ ou o domínio.';
  if (!ok) campo.focus();
});

// ---------- motion de apoio (tudo no eixo vertical) ----------
if (!reduzido) {
  let lenis = null;
  if (fino) {
    lenis = new Lenis({ duration: 1.15, easing: x => Math.min(1, 1.001 - Math.pow(2, -10 * x)) });
    lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(x => lenis.raf(x * 1000)); gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const alvo = $(a.getAttribute('href')); if (!alvo) return; e.preventDefault();
    lenis ? lenis.scrollTo(alvo, { duration: 1.4 }) : alvo.scrollIntoView({ behavior: 'smooth' });
  }));
  const quandoPerto = (el, fn, margem) => new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { o.disconnect(); fn(el); } }, { rootMargin: margem }).observe(el);
  // títulos sobem por linha, com máscara (Split Text, reactbits.dev)
  $$('.secao-cab h2, .reg-texto h2, .lista-form h3').forEach(h => quandoPerto(h, el => {
    const s = SplitText.create(el, { type: 'lines', mask: 'lines', aria: 'none' });
    gsap.from(s.lines, { yPercent: 105, duration: 1.1, ease: 'power4.out', stagger: .1 });
  }, '0px 0px -12% 0px'));
  // passos assentam de cima para baixo, como peças descendo no eixo
  $$('.passo').forEach(p => gsap.from(p.children, { y: -18, opacity: 0, duration: .9, ease: 'power3.out', stagger: .07, scrollTrigger: { trigger: p, start: 'top 75%', once: true } }));
  gsap.from('.graos .grao', { y: -40, opacity: 0, duration: .7, ease: 'bounce.out', stagger: .05, scrollTrigger: { trigger: '.graos', start: 'top 85%', once: true } });
  gsap.from('.rodape-marca', { yPercent: 40, duration: 1.4, ease: 'power4.out', scrollTrigger: { trigger: '.rodape', start: 'top 90%', once: true } });
  document.fonts.ready.then(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
}
