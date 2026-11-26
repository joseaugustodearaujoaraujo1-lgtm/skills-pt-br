// Projeto-base da skill site-premium-ux-ui: motion com GSAP.
// O hero NÃO depende de JS (entra por CSS). Aqui: Lenis só com mouse, manifesto que acende, trilho horizontal fixado,
// números, botão magnético e rodapé. Lições de desempenho: dividir texto só quando a seção se aproxima; sem laço de JS no toque.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { iniciarNivel } from './nivel.js';

gsap.registerPlugin(ScrollTrigger, SplitText);
const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fino = matchMedia('(pointer: fine)').matches;
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];

// menu: some ao descer, volta ao subir; sólido depois da primeira dobra (vale também sem animação)
const topo = $('#topo'); let ultimo = scrollY;
addEventListener('scroll', () => {
  const y = scrollY;
  topo.classList.toggle('solido', y > innerHeight * .5);
  topo.classList.toggle('compacto', y > innerHeight);
  ultimo = y;
}, { passive: true });

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

  // direção de entrada: data-entrada no elemento (ou no ancestral mais próximo, ou no <html>); o hero em CSS lê o mesmo atributo
  const DIRECOES = { sobe: [0, 1], desce: [0, -1], 'da-esquerda': [-1, 0], 'da-direita': [1, 0], opacidade: [0, 0] };
  const de = (el, dist, emPct) => { // valores para gsap.from; null = sem entrada
    const nome = (el && el.closest('[data-entrada]') || document.documentElement).dataset.entrada || 'sobe';
    if (nome === 'nenhuma') return null;
    const [dx, dy] = DIRECOES[nome] || DIRECOES.sobe;
    return emPct ? { xPercent: dx * dist, yPercent: dy * dist, ...(dx || dy ? {} : { opacity: 0 }) } : { x: dx * dist, y: dy * dist, opacity: 0 };
  };

  // hero: a mídia afunda e gira de leve ao sair
  gsap.to('.hero-midia', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // divisão de texto só quando a seção se aproxima
  const quandoPerto = (el, fn, margem) => new IntersectionObserver((es, obs) => { if (es[0].isIntersecting) { obs.disconnect(); fn(el); } }, { rootMargin: margem }).observe(el);

  // manifesto: opacidade mínima .5 (texto grande precisa de 3:1 de contraste)
  quandoPerto($('.manifesto-texto'), el => {
    const m = SplitText.create(el, { type: 'words', wordsClass: 'palavra', aria: 'none' });
    gsap.fromTo(m.words, { opacity: .8, color: '#7a5636' }, { opacity: 1, color: '#2b1c12', stagger: .05, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
    ScrollTrigger.refresh();
  }, '100% 0px 100% 0px');

  // títulos de seção entram por linha, na direção de data-entrada
  $$('.colecao-cab h2, .passos h2, .contato h2').forEach(h => quandoPerto(h, el => {
    const s = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'linha-js', aria: 'none' });
    const v = de(el, 105, true); if (v) gsap.from(s.lines, { ...v, duration: 1.1, ease: 'power4.out', stagger: .1 });
  }, '0px 0px -12% 0px'));

  // coleção: trilho horizontal fixado (tela larga); no celular é carrossel nativo
  ScrollTrigger.matchMedia({
    '(min-width: 861px)': () => {
      const trilho = $('.trilho'); const dist = () => trilho.scrollWidth - innerWidth;
      gsap.to(trilho, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.colecao', pin: true, scrub: 1, start: 'top top', end: () => '+=' + dist(), invalidateOnRefresh: true } });
    },
  });
  const vItem = de($('.item'), 50); if (vItem) gsap.from('.item', { ...vItem, duration: 1, ease: 'power3.out', stagger: .08, scrollTrigger: { trigger: '.trilho', start: 'top 85%', once: true } });

  iniciarNivel();
  // passos entram um a um
  gsap.utils.toArray('.passos-lista li').forEach(li => { const v = de(li, 30); if (v) gsap.from(li, { ...v, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: li, start: 'top 88%', once: true } }); });

  // botão magnético (só com mouse)
  if (fino) $$('.botao').forEach(b => {
    const x = gsap.quickTo(b, 'x', { duration: .4, ease: 'power3' }), y = gsap.quickTo(b, 'y', { duration: .4, ease: 'power3' });
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * .25); y((e.clientY - r.top - r.height / 2) * .3); });
    b.addEventListener('pointerleave', () => { x(0); y(0); });
  });

  document.fonts.ready.then(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
}

// barra fixa do WhatsApp (celular): só depois que o botão do hero sai da tela
{
  const alvo = $('.hero-acoes .botao');
  if (alvo) new IntersectionObserver(es => document.body.classList.toggle('zap-on', !es[0].isIntersecting && es[0].boundingClientRect.top < 0)).observe(alvo);
}
