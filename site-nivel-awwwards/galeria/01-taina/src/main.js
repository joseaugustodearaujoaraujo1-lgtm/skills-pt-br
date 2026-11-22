// TAINÁ ROCHA — motion no ritmo do site do Lando Norris: objeto 3D sobre o retrato, letreiros em direções opostas,
// assinatura que se desenha, manifesto que acende, colagem em paralaxe, títulos que se separam, grade que entra, leque das redes.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fino = matchMedia('(pointer: fine)').matches;
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];

// topo claro/escuro conforme a seção embaixo dele
const escuras = $$('.emcasa, .manifesto, .hall, .grade, .rodape');
const topo = $('.topo');
const atualizarTopo = () => { const y = 40; topo.classList.toggle('escuro', escuras.some(s => { const r = s.getBoundingClientRect(); return r.top <= y && r.bottom >= y; })); };
addEventListener('scroll', atualizarTopo, { passive: true }); atualizarTopo();

// manifesto: palavras (o texto segue no HTML)
const man = $('.manifesto-texto');
if (man && !reduzido) man.innerHTML = man.innerHTML.split(/(<em>.*?<\/em>|\s+)/).map(p => !p.trim() ? p : `<span class="pal">${p}</span>`).join('');

if (!reduzido) {
  let lenis = null;
  if (fino) { lenis = new Lenis({ duration: 1.15 }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const alvo = $(a.getAttribute('href')); if (!alvo) return; e.preventDefault(); lenis ? lenis.scrollTo(alvo, { duration: 1.4 }) : alvo.scrollIntoView({ behavior: 'smooth' }); }));

  // HERO: entrada e saída
  gsap.from('.hero-retrato', { yPercent: 12, opacity: 0, duration: 1.4, ease: 'expo.out' });
  gsap.from('.hero-nome span:not(.sr)', { yPercent: 60, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: .12 });
  gsap.to('.hero-nome span:first-child', { xPercent: -25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-nome span:nth-child(2)', { xPercent: 25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.from('.hero-prancha', { scale: .6, rotate: -30, opacity: 0, duration: 1.6, delay: .3, ease: 'expo.out' });
  gsap.from('.proxima, .rolar', { y: 30, opacity: 0, duration: 1, delay: .7, ease: 'power3.out', stagger: .1 });
  const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.hero-retrato', { scale: 1.08, yPercent: 8, ease: 'none', scrollTrigger: heroST });
  gsap.to('.hero-prancha', { yPercent: 55, xPercent: 18, rotate: 35, ease: 'none', scrollTrigger: heroST });

  // prancha 3D ao vivo (só com GPU de verdade; senão fica o render da própria cena)
  const temGPU = (() => { try { const gl = document.createElement('canvas').getContext('webgl2'); if (!gl) return false; const i = gl.getExtension('WEBGL_debug_renderer_info'); const n = i ? gl.getParameter(i.UNMASKED_RENDERER_WEBGL) : ''; gl.getExtension('WEBGL_lose_context')?.loseContext(); return !/swiftshader|llvmpipe|software/i.test(n); } catch { return false; } })();
  if (temGPU && !navigator.connection?.saveData) addEventListener('load', () => setTimeout(async () => {
    const palco = $('.hero-prancha');
    const { montarPrancha } = await import(/* sem bundle */ new URL('./prancha.js', import.meta.url).href);
    await document.fonts.load('800 64px "Mona Sans"');
    const c = document.createElement('canvas'); c.className = 'hero-canvas'; c.setAttribute('aria-hidden', 'true'); palco.append(c);
    const x = montarPrancha(c, { distancia: 12.5, aoPronto: () => palco.classList.add('ao-vivo') });
    ScrollTrigger.create({ ...heroST, onUpdate: s => x.progresso(s.progress) });
    if (fino) addEventListener('pointermove', e => x.inclinar(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1), { passive: true });
  }, 900), { once: true });

  // EM CASA: letreiros em direções opostas + assinatura que se desenha
  const ec = { trigger: '.emcasa', start: 'top bottom', end: 'bottom top', scrub: true };
  gsap.fromTo('.l1 span', { xPercent: -10 }, { xPercent: -40, ease: 'none', scrollTrigger: ec });
  gsap.fromTo('.l2 span', { xPercent: -45 }, { xPercent: -10, ease: 'none', scrollTrigger: ec });
  gsap.fromTo('.l3 span', { xPercent: -5 }, { xPercent: -35, ease: 'none', scrollTrigger: ec });
  const traco = $('.assinatura path'); const comp = traco.getTotalLength();
  gsap.fromTo(traco, { strokeDasharray: comp, strokeDashoffset: comp }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.emcasa', start: 'top 60%', end: 'center 40%', scrub: true } });
  gsap.fromTo('.emcasa-foto', { scale: .8, rotate: -4 }, { scale: 1.05, rotate: 3, ease: 'none', scrollTrigger: ec });

  // MANIFESTO: acende palavra por palavra
  const pals = $$('.manifesto-texto .pal');
  ScrollTrigger.create({ trigger: '.manifesto', start: 'top 70%', end: 'bottom 60%', scrub: true, onUpdate: s => { const n = Math.round(s.progress * pals.length); pals.forEach((p, i) => p.classList.toggle('on', i < n)); } });

  // COLAGEM: camadas em velocidades diferentes
  $$('.colagem .p').forEach(el => gsap.to(el, { yPercent: +el.dataset.v * -140, ease: 'none', scrollTrigger: { trigger: '.colagem', start: 'top bottom', end: 'bottom top', scrub: true } }));
  $$('.colagem .cf img').forEach(img => gsap.from(img, { clipPath: 'inset(100% 0 0 0)', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: img, start: 'top 90%', once: true } }));
  gsap.from('.citacao, .colagem-texto', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.citacao', start: 'top 85%', once: true } });

  // DENTRO / FORA: as palavras se afastam e as fotos crescem
  const df = { trigger: '.dentrofora', start: 'top bottom', end: 'bottom top', scrub: true };
  gsap.fromTo('.df-a', { xPercent: -5 }, { xPercent: -45, ease: 'none', scrollTrigger: df });
  gsap.fromTo('.df-b', { xPercent: 5 }, { xPercent: 45, ease: 'none', scrollTrigger: df });
  gsap.fromTo('.df-col img', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: df });

  // HALL + GRADE
  gsap.fromTo('.hall-foto', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.hall', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.hall-titulo, .hall-texto', { y: 60, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: .12, scrollTrigger: { trigger: '.hall', start: 'top 40%', once: true } });
  gsap.from('.pranchas li', { y: 80, opacity: 0, rotate: 3, duration: 1, ease: 'power3.out', stagger: { each: .07, grid: 'auto', from: 'start' }, scrollTrigger: { trigger: '.pranchas', start: 'top 80%', once: true } });
  $$('.pranchas img').forEach((img, i) => gsap.to(img, { rotate: i % 2 ? 6 : -6, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } }));

  // LOJA + PARCERIAS
  gsap.fromTo('.loja-cartao', { rotate: -14, yPercent: 40 }, { rotate: 10, yPercent: -30, ease: 'none', scrollTrigger: { trigger: '.loja', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.parc-mao', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'none', scrollTrigger: { trigger: '.parcerias', start: 'top 75%', end: 'top 15%', scrub: true } });
  gsap.from('.marcas li', { y: 30, opacity: 0, duration: .8, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: '.marcas', start: 'top 90%', once: true } });

  // REDES: leque de cartões que se abre
  const cartas = $$('.leque img'); const meio = (cartas.length - 1) / 2;
  cartas.forEach((c, i) => gsap.fromTo(c, { rotate: 0, x: 0 }, { rotate: (i - meio) * 9, x: (i - meio) * (innerWidth < 860 ? 30 : 70), ease: 'none', scrollTrigger: { trigger: '.redes', start: 'top 70%', end: 'center 50%', scrub: true } }));

  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
