// Maré: motion com GSAP. Regra: tudo sobe, nada cai. O hero entra por CSS; estados finais já valem sem JS.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);
const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fino = matchMedia('(pointer: fine)').matches;
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];

const topo = $('#topo'); let ultimo = scrollY;
addEventListener('scroll', () => {
  const y = scrollY;
  topo.classList.toggle('solido', y > innerHeight * .5);
  topo.classList.toggle('compacto', y > innerHeight);
  ultimo = y;
}, { passive: true });

const brl = c => 'R$ ' + (c / 100).toFixed(2).replace('.', ',');

if (!reduzido) {
  let lenis = null;
  if (fino) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const alvo = $(a.getAttribute('href')); if (!alvo) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(alvo, { duration: 1.4 }); else alvo.scrollIntoView({ behavior: 'smooth' });
  }));

  // hero: o nível do troco sobe ao carregar (0 -> 58%) e continua subindo com a rolagem do hero (58 -> 100%)
  const num = $('.numeral'), est = { base: 0, p: 0 };
  const pinta = () => num.style.setProperty('--n', (est.base + (100 - est.base) * est.p).toFixed(2) + '%');
  pinta();
  gsap.to(est, { base: 58, duration: 1.6, delay: .35, ease: 'power3.out', onUpdate: pinta });
  gsap.to(est, { p: 1, ease: 'none', onUpdate: pinta, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 15%', scrub: true } });

  // título da seção troco: linhas sobem
  const quandoPerto = (el, fn, margem) => new IntersectionObserver((es, obs) => { if (es[0].isIntersecting) { obs.disconnect(); fn(el); } }, { rootMargin: margem }).observe(el);
  $$('.troco h2, .perguntas h2, .baixar h2').forEach(h => quandoPerto(h, el => {
    const s = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'linha-js', aria: 'none' });
    gsap.from(s.lines, { yPercent: 105, duration: 1.1, ease: 'power4.out', stagger: .1 });
  }, '0px 0px -10% 0px'));

  // tanque: enche conforme as compras do extrato passam; o total sobe junto
  const linhas = $$('.extrato li'), cents = linhas.map(l => +$('.tr', l).dataset.c), soma = cents.reduce((a, b) => a + b, 0);
  const tanque = $('.tanque'), total = $('#total');
  const sobe = p => {
    const alvo = p * soma; let acc = 0;
    linhas.forEach((l, i) => { acc += cents[i]; l.classList.toggle('conta', alvo >= acc - cents[i] * .5); });
    tanque.style.setProperty('--n', (.1 + .9 * p).toFixed(3));
    total.textContent = brl(Math.round(alvo));
  };
  sobe(.35);
  ScrollTrigger.create({ trigger: '.extrato', start: 'top 85%', end: 'bottom 60%', scrub: true, onUpdate: s => sobe(s.progress), onRefresh: s => sobe(s.progress) });

  // renda fixa: faixas de água sobem de baixo para cima, cada uma mais funda
  $$('.faixa').forEach((f, i) => gsap.fromTo(f, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: f, start: 'top 92%', once: true } }));

  // baixar: a maré enche a seção
  const baixar = $('.baixar'); baixar.classList.remove('cheia');
  const em = $('.baixar em'); ScrollTrigger.create({ trigger: '.baixar', start: 'top 70%', end: 'top 10%', scrub: true, onUpdate: s => em.style.setProperty('--n', (s.progress * 100).toFixed(1) + '%') });
  gsap.fromTo('.mare-cheia', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: '.baixar', start: 'top 85%', end: 'top 40%', scrub: true, onUpdate: s => baixar.classList.toggle('cheia', s.progress > .4) } });

  // botão das lojas: leve atração (só mouse)
  if (fino) $$('.loja').forEach(b => {
    const x = gsap.quickTo(b, 'x', { duration: .4, ease: 'power3' }), y = gsap.quickTo(b, 'y', { duration: .4, ease: 'power3' });
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * .15); y((e.clientY - r.top - r.height / 2) * .2); });
    b.addEventListener('pointerleave', () => { x(0); y(0); });
  });

  gsap.from('.rodape-marca', { yPercent: 45, opacity: 0, duration: 1.4, ease: 'power4.out', scrollTrigger: { trigger: '.rodape', start: 'top 90%', once: true } });
  document.fonts.ready.then(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
}
