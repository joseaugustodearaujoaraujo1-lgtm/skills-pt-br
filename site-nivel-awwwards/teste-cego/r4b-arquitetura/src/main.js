// Linha Terra: a parede se levanta em fiadas. Tudo assenta de baixo para cima (data-entrada="sobe").
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
  topo.classList.toggle('escondido', y > ultimo && y > innerHeight);
  ultimo = y;
}, { passive: true });

// formulário curto: validação clara e confirmação (sem backend: ver design/DECISOES.md)
const form = $('#form'), status = $('#form-status');
form.addEventListener('submit', e => {
  e.preventDefault();
  const campos = $$('input[required]', form); let ok = true;
  campos.forEach(c => { const v = c.value.trim().length > 1; c.setAttribute('aria-invalid', String(!v)); if (!v && ok) { c.focus(); ok = false; } });
  if (!ok) { status.textContent = 'Preencha nome e um contato para combinarmos o horário.'; return; }
  status.textContent = 'Recebido. Entraremos em contato para combinar o horário da conversa.';
  form.reset();
});

if (!reduzido) {
  let lenis = null;
  if (fino) {
    lenis = new Lenis({ duration: 1.1, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const alvo = $(a.getAttribute('href')); if (!alvo) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(alvo, { duration: 1.3 }); else alvo.scrollIntoView({ behavior: 'smooth' });
  }));

  // hero: as fiadas sobem em ritmos diferentes ao rolar (só para cima)
  $$('.fiada').forEach((f, i) => gsap.fromTo(f, { yPercent: 0 }, { yPercent: -(4 + i * 5), ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } }));

  const quandoPerto = (el, fn, margem) => new IntersectionObserver((es, obs) => { if (es[0].isIntersecting) { obs.disconnect(); fn(el); } }, { rootMargin: margem }).observe(el);

  // manifesto: cada linha ganha a fiada de baixo para cima
  quandoPerto($('.manifesto-texto'), el => {
    const s = SplitText.create(el, { type: 'lines', linesClass: 'lm', aria: 'none' });
    gsap.fromTo(s.lines, { opacity: .5, '--p': 0 }, { opacity: 1, '--p': 1, stagger: .5, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true } });
    ScrollTrigger.refresh();
  }, '100% 0px 100% 0px');

  // títulos: sobem por linha
  $$('.materiais-titulo, .processo h2, .obras h2, .contato h2').forEach(h => quandoPerto(h, el => {
    const s = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'linha-js', aria: 'none' });
    gsap.from(s.lines, { yPercent: 105, duration: 1.1, ease: 'power4.out', stagger: .1 });
  }, '0px 0px -12% 0px'));

  // materiais: cada faixa assenta de baixo para cima por recorte, completa antes de 30% na tela
  $$('.faixa').forEach(f => gsap.from(f, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: f, start: 'top 92%', once: true } }));
  $$('.faixa-nome').forEach(n => gsap.from(n, { yPercent: 40, duration: 1.4, ease: 'power4.out', scrollTrigger: { trigger: n, start: 'top 92%', once: true } }));

  // processo: a parede cresce com a rolagem e acende as etapas
  const etapas = $$('.etapa');
  const marca = p => etapas.forEach((e, i) => e.classList.toggle('on', p >= i / etapas.length - 0.001));
  ScrollTrigger.matchMedia({
    '(min-width: 861px)': () => {
      ScrollTrigger.create({ trigger: '.processo', start: 'top top', end: '+=120%', pin: true, scrub: true, onUpdate: s => { gsap.set('.processo-parede', { '--fill': .15 + s.progress * .85 }); $('.processo-fill').style.setProperty('--fill', .15 + s.progress * .85); marca(s.progress); } });
    },
    '(max-width: 860px)': () => {
      ScrollTrigger.create({ trigger: '.processo-corpo', start: 'top 70%', end: 'bottom 60%', scrub: true, onUpdate: s => { $('.processo-fill').style.setProperty('--fill', .1 + s.progress * .9); marca(s.progress); } });
    },
  });

  // obras: entram por recorte vertical, de baixo para cima
  $$('.ph').forEach(p => gsap.from(p, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.3, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 92%', once: true } }));

  if (fino) $$('.botao').forEach(b => {
    const x = gsap.quickTo(b, 'x', { duration: .4, ease: 'power3' }), y = gsap.quickTo(b, 'y', { duration: .4, ease: 'power3' });
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * .2); y((e.clientY - r.top - r.height / 2) * .25); });
    b.addEventListener('pointerleave', () => { x(0); y(0); });
  });
  document.fonts.ready.then(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
} else {
  $$('.etapa').forEach(e => e.classList.add('on'));
  $('.processo-fill').style.setProperty('--fill', 1);
}
