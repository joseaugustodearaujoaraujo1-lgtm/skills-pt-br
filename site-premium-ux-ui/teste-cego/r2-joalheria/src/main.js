// Vésper: uma luz só atravessa o escuro e acende a pedra, faceta por faceta.
// Palco fixo (CSS sticky) conduzido pela rolagem: hero → mesa → coroa → pavilhão. O diamante 3D (WebGL2, ray tracing)
// liga depois da entrada, com a página ociosa; até lá (e sem GPU) fica o pôster renderizado da própria cena.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { poseEm, QUADROS } from './pose.js';

gsap.registerPlugin(ScrollTrigger);
const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fino = matchMedia('(pointer: fine)').matches;
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];

// topo sólido depois da primeira dobra (o menu fica sempre visível)
const topo = $('#topo');
const atualizaTopo = () => topo.classList.toggle('solido', scrollY > innerHeight * .4);
addEventListener('scroll', atualizaTopo, { passive: true }); atualizaTopo();

// formulário: validação simples + "Success check" (transitions.dev)
const form = $('.form'), msg = $('.form-msg');
form.addEventListener('submit', e => {
  e.preventDefault();
  const faltam = ['nome', 'contato'].filter(n => !form.elements[n].value.trim());
  ['nome', 'contato'].forEach(n => form.elements[n].setAttribute('aria-invalid', faltam.includes(n) ? 'true' : 'false'));
  if (faltam.length) { msg.textContent = 'Preencha seu nome e um e-mail ou telefone.'; form.elements[faltam[0]].focus(); return; }
  msg.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg><span>Pedido recebido. Vamos responder para confirmar o dia e a hora.</span>';
  form.querySelector('button').disabled = true;
});

// botão magnético (Magnet, reactbits) só com mouse
if (fino && !reduzido) $$('.botao').forEach(b => {
  const x = gsap.quickTo(b, 'x', { duration: .4, ease: 'power3' }), y = gsap.quickTo(b, 'y', { duration: .4, ease: 'power3' });
  b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * .25); y((e.clientY - r.top - r.height / 2) * .3); });
  b.addEventListener('pointerleave', () => { x(0); y(0); });
});

if (!reduzido) iniciarMovimento();

function iniciarMovimento() {
  let lenis = null;
  if (fino) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
  }
  const palco = $('#palco'), cena = $('.cena'), caixa = $('.gema-caixa'), poster = $('.gema-poster');
  const marca = $('.marca-gigante'), passos = $$('.passo');
  const fimPalco = () => palco.offsetTop + palco.offsetHeight - innerHeight;
  const posicaoDe = s => palco.offsetTop + s * (palco.offsetHeight - innerHeight);

  // âncoras: dentro do palco, cada destino é um ponto da rolagem
  const destinos = { '#inicio': () => 0, '#lapidacao': () => posicaoDe(.45) };
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const h = a.getAttribute('href'); const alvo = $(h); if (!alvo || h === '#conteudo') return;
    e.preventDefault();
    const y = destinos[h] ? destinos[h]() : alvo.getBoundingClientRect().top + scrollY - 70;
    if (lenis) lenis.scrollTo(y, { duration: 1.6 }); else scrollTo({ top: y, behavior: 'smooth' });
  }));

  // ---------- a luz (Spotlight, reactbits: holofote que segue o ponteiro) ----------
  let gema = null, sujo = false, ultimoMov = 0, nitido = null, inicio = performance.now(), visivel = true, s = 0;
  const luz = { x: innerWidth * -.1, y: innerHeight * -.15 };
  let mr = 42; // raio da luz sobre a marca (vw)
  const aplicarLuz = () => {
    cena.style.setProperty('--lx', luz.x + 'px'); cena.style.setProperty('--ly', luz.y + 'px');
    const r = marca.getBoundingClientRect();
    marca.style.setProperty('--mx', (luz.x - r.left) + 'px'); marca.style.setProperty('--my', (luz.y - r.top) + 'px');
    marca.style.setProperty('--mr', mr + 'vw');
    pedir();
  };
  // entrada: a luz chega do canto e para acima e à esquerda da pedra
  const entrada = gsap.to(luz, { x: innerWidth * .36, y: innerHeight * .24, duration: 2.4, ease: 'power3.out', delay: .2, onUpdate: aplicarLuz });
  if (fino) {
    const qx = gsap.quickTo(luz, 'x', { duration: .6, ease: 'power3', onUpdate: aplicarLuz });
    const qy = gsap.quickTo(luz, 'y', { duration: .6, ease: 'power3' });
    addEventListener('pointermove', e => { entrada.kill(); qx(e.clientX); qy(e.clientY); movendo(); }, { passive: true });
  } else {
    // toque: a luz faz uma órbita lenta em volta da pedra
    gsap.to(luz, { x: () => innerWidth * .7, duration: 6, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2.6, onUpdate: aplicarLuz });
  }
  aplicarLuz();

  // ---------- linha do tempo do palco ----------
  const estadoPasso = () => passos.forEach(p => p.classList.toggle('ativo', s >= +p.dataset.de && s < +p.dataset.ate));
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: palco, start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: st => { s = st.progress; estadoPasso(); pedir(); trocarQuadro(); } } });
  tl.set({}, {}, 1);
  // saída do hero: a luz deixa a marca (o raio se fecha) e o texto apaga
  tl.to('.hero-colunas, .hero-rotulo', { opacity: 0, duration: .06 }, .22)
    .to({ v: 42 }, { v: 0.1, duration: .1, onUpdate() { mr = this.targets()[0].v; aplicarLuz(); } }, .22)
    .to(marca, { opacity: 0, duration: .06 }, .3);
  // a lapidação entra por um círculo de luz que se abre a partir da pedra
  const mm = gsap.matchMedia();
  mm.add({ largo: '(min-width: 861px)', estreito: '(max-width: 860px)' }, ctx => {
    const { largo } = ctx.conditions;
    tl.fromTo(caixa, { x: 0, y: () => innerHeight * (largo ? .07 : .0), scale: largo ? .82 : .9 }, { x: () => largo ? -innerWidth * .22 : 0, y: () => largo ? 0 : -innerHeight * .17, scale: largo ? 1 : .78, duration: .1, immediateRender: true }, .26);
    tl.fromTo('.lap-texto', { visibility: 'hidden', clipPath: largo ? 'circle(0% at -30% 50%)' : 'circle(0% at 50% -40%)' },
      { visibility: 'visible', clipPath: largo ? 'circle(160% at -30% 50%)' : 'circle(170% at 50% -40%)', duration: .1, immediateRender: true }, .3);
  });
  const cota = (sel, de, ate) => {
    tl.fromTo(sel, { opacity: 0 }, { opacity: 1, duration: .03, immediateRender: true }, de)
      .fromTo(`${sel} .traco`, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .06, immediateRender: true }, de)
      .to(sel, { opacity: 0, duration: .03 }, ate);
  };
  cota('.cota-mesa', .35, .49); cota('.cota-coroa', .57, .71); cota('.cota-pavilhao', .79, .95);

  // ---------- peças: cada uma surge de um círculo de luz ----------
  $$('.peca-luz').forEach(el => {
    gsap.fromTo(el, { clipPath: 'circle(0% at 50% 44%)' }, { clipPath: 'circle(75% at 50% 44%)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 35%', scrub: true } });
    gsap.fromTo(el.querySelector('img'), { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 92%', end: 'bottom 40%', scrub: true } });
  });
  $$('.pecas-cab h2, .visita h2').forEach(h => gsap.fromTo(h, { clipPath: 'circle(0% at 0% 55%)' }, { clipPath: 'circle(150% at 0% 55%)', duration: 1.6, ease: 'power2.inOut', scrollTrigger: { trigger: h, start: 'top 85%', once: true } }));

  // ---------- 3D ----------
  function movendo() { ultimoMov = performance.now(); }
  function pedir() { if (!gema || sujo) return; sujo = true; requestAnimationFrame(quadro); }
  function quadro(t) {
    sujo = false; if (!visivel) return;
    const p = poseEm(s), r = caixa.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = (luz.x - cx) / (r.width / 2), dy = (luz.y - cy) / (r.height / 2);
    const lc = [dx * 1.1, -dy * 1.1 + .15, .95];
    const w = 1 - Math.min(1, Math.max(0, (s - .2) / .14)); // no hero a luz é o cursor; depois, a pose da lapidação
    const giro = Math.min(t - inicio, 7000) / 1000 * .22;
    Object.assign(gema.estado, { rotY: p.rotY + giro, incl: p.incl, luz: p.luz.map((v, k) => v + (lc[k] - v) * w) });
    const emMovimento = t - inicio < 7000 || performance.now() - ultimoMov < 160;
    gema.desenhar(emMovimento ? 5 : 8, emMovimento ? .72 : 1);
    if (t - inicio < 7000) pedir();
    clearTimeout(nitido); nitido = setTimeout(() => { gema.desenhar(8, 1); }, 180);
  }
  new IntersectionObserver(es => { visivel = es[0].isIntersecting; if (visivel) pedir(); }).observe(palco);
  document.addEventListener('visibilitychange', () => { visivel = !document.hidden; if (visivel) pedir(); });
  ScrollTrigger.addEventListener('scrollStart', movendo);

  // reserva sem GPU: quadros pré-renderizados da própria cena, baixados só na primeira rolagem
  let quadros = null;
  function trocarQuadro() {
    if (gema || !quadros) return;
    const i = Math.round(s * (QUADROS - 1));
    poster.src = s < .02 ? 'img/gema/poster.webp' : quadros[i].src;
  }
  function carregarReserva() {
    if (quadros) return;
    quadros = [...Array(QUADROS)].map((_, i) => { const im = new Image(); im.decoding = 'async'; im.src = `img/gema/q-${String(i).padStart(2, '0')}.webp`; return im; });
    trocarQuadro();
  }

  let ligado = false;
  async function ligar3D() {
    if (ligado) return; ligado = true;
    const pouco = navigator.connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory < 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);
    if (!pouco) {
      const { criarGema } = await import('./gema.js');
      const canvas = $('.gema-canvas');
      gema = await criarGema(canvas, { forcar: location.search.includes('3d=forcar') }).catch(() => null);
    }
    if (!gema) { addEventListener('scroll', carregarReserva, { once: true, passive: true }); if (scrollY > 0) carregarReserva(); return; }
    gema.setEscala(Math.min(devicePixelRatio || 1, 1.5));
    inicio = performance.now();
    gema.desenhar(8, 1); caixa.classList.add('viva');
    addEventListener('resize', pedir);
    pedir();
  }
  const quandoOcioso = fn => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 200));
  addEventListener('load', () => setTimeout(() => quandoOcioso(ligar3D), 2600), { once: true });
  ['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, ligar3D, { once: true, passive: true }));

  document.fonts.ready.then(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
}
