// AURA — motion no ritmo da ERA Residence: título que sobe enquanto a foto aproxima a piscina, arco que sobe com texto
// na curva, janela que abre até a tela cheia, manifesto que acende, título empilhado em paralaxe, mapa da costa que se
// desenha, painel que sobe sobre a aérea, foto noturna com arco creme subindo.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fino = matchMedia('(pointer: fine)').matches;
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];

// topo: escuro sobre as seções claras
const claras = $$('.local, .manifesto, .costa, .mapa-sec, .plantas, .metragem, .rodape, .arco-sec');
const topo = $('.topo');
const atualizar = () => topo.classList.toggle('escuro', claras.some(s => { const r = s.getBoundingClientRect(); return r.top <= 60 && r.bottom >= 60; }));
addEventListener('scroll', atualizar, { passive: true }); atualizar();

const man = $('.manifesto-texto');
if (man && !reduzido) man.innerHTML = man.textContent.split(' ').map(p => `<span class="pal">${p}</span>`).join(' ');

if (!reduzido) {
  let lenis = null;
  if (fino) { lenis = new Lenis({ duration: 1.25 }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const alvo = $(a.getAttribute('href')); if (!alvo) return; e.preventDefault(); lenis ? lenis.scrollTo(alvo, { duration: 1.6 }) : alvo.scrollIntoView({ behavior: 'smooth' }); }));

  // HERO: entrada do título e da assinatura; na rolagem o título sobe e a foto aproxima a piscina
  gsap.from('.h-l1, .h-l2', { yPercent: 60, opacity: 0, duration: 1.4, ease: 'expo.out', stagger: .12 });
  gsap.from('.h-script', { opacity: 0, x: -40, duration: 1.6, delay: .5, ease: 'expo.out' });
  gsap.from('.hero-lado', { opacity: 0, y: 20, duration: 1, delay: .8, stagger: .1 });
  const hero = { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: true };
  gsap.to('.hero-titulo', { yPercent: -120, ease: 'none', scrollTrigger: hero });
  gsap.to('.hero-lado', { opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '25% top', scrub: true } });
  gsap.to('.hero-foto img', { scale: +$('.hero').dataset.zoom, yPercent: 6, ease: 'none', scrollTrigger: hero });

  // ARCO sobe sobre a foto
  const arco = $('.arco').dataset;
  gsap.fromTo('.arco', { yPercent: +arco.sobeDe }, { yPercent: +arco.sobeAte, ease: 'none', scrollTrigger: { trigger: '.hero', start: arco.sobeInicio + ' top', end: arco.sobeFim + ' top', scrub: true } });

  // PERTO DE TUDO: a janela abre até a tela cheia; a citação aparece no fim
  gsap.to('.local-janela img', { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: '.local', start: 'top top', end: '70% bottom', scrub: true } });
  gsap.from('.local-citacao', { opacity: 0, y: 40, ease: 'none', scrollTrigger: { trigger: '.local', start: '55% bottom', end: '80% bottom', scrub: true } });

  // MANIFESTO: acende e os ipês balançam
  const pals = $$('.manifesto-texto .pal');
  ScrollTrigger.create({ trigger: '.manifesto', start: 'top 65%', end: 'bottom 70%', scrub: true, onUpdate: s => { const n = Math.round(s.progress * pals.length); pals.forEach((p, i) => p.classList.toggle('on', i < n)); } });
  $$('.ipe').forEach((ip, i) => gsap.fromTo(ip, { rotate: i % 2 ? 6 : -6, scale: .9 }, { rotate: i % 2 ? -4 : 4, scale: 1.05, ease: 'none', scrollTrigger: { trigger: ip.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));

  // NOVA COSTA DOURADA: linhas do título em velocidades diferentes; foto em paralaxe
  $$('.costa-titulo span').forEach((s, i) => gsap.fromTo(s, { x: (i - 1) * 80 }, { x: (i - 1) * -60, ease: 'none', scrollTrigger: { trigger: '.costa', start: 'top bottom', end: 'bottom top', scrub: true } }));
  gsap.fromTo('.costa-foto img', { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.costa', start: 'top bottom', end: 'bottom top', scrub: true } });

  // MAPA: a linha da costa se desenha e os pontos acendem
  const linha = $('.mapa-linha'); const comp = linha.getTotalLength();
  gsap.fromTo(linha, { strokeDasharray: comp, strokeDashoffset: comp }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.mapa', start: 'top 85%', end: 'bottom 50%', scrub: true } });
  gsap.from('.mapa-pontos circle, .lugares li', { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: .6, stagger: .08, ease: 'back.out(2)', scrollTrigger: { trigger: '.mapa', start: 'top 60%', once: true } });
  gsap.fromTo('.paisagem img', { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.paisagem', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.to('.painel-sobe', { yPercent: 0, transform: 'translateY(0%)', ease: 'none', scrollTrigger: { trigger: '.aerea', start: 'top top', end: 'bottom bottom', scrub: true } });

  // PLANTAS
  gsap.from('.plantas-foto img', { clipPath: 'inset(100% 0 0 0)', scale: 1.2, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.plantas', start: 'top 60%', once: true } });
  gsap.from('.plantas-titulo', { yPercent: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.plantas', start: 'top 40%', once: true } });

  // NOITE: lista entra; arco creme sobe com "O ESPAÇO"
  gsap.from('.noite-lista li', { x: 60, opacity: 0, duration: 1, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.noite', start: 'top 50%', once: true } });
  gsap.fromTo('.arco-creme', { yPercent: 100 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.noite', start: $('.noite').dataset.arcoInicio + ' top', end: 'bottom bottom', scrub: true } });
  gsap.fromTo('.noite-foto', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.noite', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
