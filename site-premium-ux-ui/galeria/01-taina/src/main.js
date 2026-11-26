// TAINÁ ROCHA — réplica do movimento do site do Lando Norris, fase por fase (medido no original):
// 1) hero fixo 200vh: retrato branco com objeto 3D → a foto encolhe num cartão central, o fundo escurece, letreiros e assinatura;
// 2) manifesto que acende; 3) colagem horizontal fixa (349vh) que clareia do escuro para o claro;
// 4) dentro/fora fixo (200vh): objeto entra pela esquerda, perfil pela direita, foto final sobe cobrindo a tela;
// 5) hall da fama em 4 colunas em escada com paralaxe; 6) loja; 7) parcerias; 8) leque das redes; 9) rodapé com assinatura.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { montarFumaca } from './fumaca.js';

gsap.registerPlugin(ScrollTrigger);
const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fino = matchMedia('(pointer: fine)').matches;
const largo = matchMedia('(min-width: 861px)').matches;
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
const topo = $('.topo');
const cor = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim(); // lê o papel de cor do tema ativo
let escuroHero = false, claroHoriz = false;
const atualizarTopo = () => {
  const y = 40, emEscuro = ['.manifesto', '.grupo-preto', '.painel'].some(s => { const r = $(s).getBoundingClientRect(); return r.top <= y && r.bottom >= y; });
  const h = $('.horiz-palco').getBoundingClientRect(), naHoriz = $('.horizontal').getBoundingClientRect();
  const horizEscura = naHoriz.top <= y && naHoriz.bottom >= y && !claroHoriz;
  topo.classList.toggle('escuro', emEscuro || escuroHero || horizEscura);
};
addEventListener('scroll', atualizarTopo, { passive: true });

const man = $('.manifesto-texto');
if (man && !reduzido) man.innerHTML = man.innerHTML.split(/(<em>.*?<\/em>|\s+)/).map(p => !p.trim() ? p : `<span class="pal">${p}</span>`).join('');

if (!reduzido) {
  let lenis = null;
  if (fino) { lenis = new Lenis({ duration: 1.15 }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const alvo = $(a.getAttribute('href')); if (!alvo) return; e.preventDefault(); lenis ? lenis.scrollTo(alvo, { duration: 1.4 }) : alvo.scrollIntoView({ behavior: 'smooth' }); }));

  // ---------- 1. HERO ----------
  gsap.from('.hero-retrato', { yPercent: 10, opacity: 0, duration: 1.4, ease: 'expo.out' });
  gsap.from('.proxima', { y: 30, opacity: 0, duration: 1, delay: .8, ease: 'power3.out' });
  const traco = $('.assinatura path'), comp = traco.getTotalLength();
  gsap.set(traco, { strokeDasharray: comp, strokeDashoffset: comp });
  const cartA = $('.hero').dataset.cartaoA.split(' '), cartB = $('.hero').dataset.cartaoB.split(' '); // tamanho do cartão: [largura, altura]
  const th = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: s => { escuroHero = s.progress > +$('.hero').dataset.escuroEm; atualizarTopo(); } } });
  th.to('.fumaca', { opacity: 0, duration: .2 }, 0)
    .set('.hero-cartao', { mixBlendMode: 'normal' }, .04)
    .to('.proxima', { opacity: 0, y: 20, duration: .15 }, 0)
    .to('.hero-escuro', { opacity: 1, duration: .35 }, .05)
    .to('.hero-curvas', { opacity: 0, duration: .3 }, .05)
    .to('.hero-cartao', { width: cartA[0], height: cartA[1], backgroundColor: '#cfd3cc', duration: .45 }, 0)
    .to('.hero-retrato', { filter: 'grayscale(.85)', height: '115%', duration: .45 }, 0)
    .to('.hero-cartao', { width: cartB[0], height: cartB[1], duration: .4 }, .5)
    .fromTo('.l1 span', { xPercent: 0 }, { xPercent: -30, duration: 1 }, 0)
    .fromTo('.l2 span', { xPercent: -35 }, { xPercent: -5, duration: 1 }, 0)
    .to(traco, { strokeDashoffset: 0, duration: .4 }, .55);

  // fumaça meio líquida que sai do cursor sobre o retrato (como no original)
  montarFumaca($('.fumaca'), { area: $('.hero-palco'), cor: [24, 96, 92] });

  // ---------- 2. MANIFESTO ----------
  const pals = $$('.manifesto-texto .pal');
  ScrollTrigger.create({ trigger: '.manifesto', start: 'top 70%', end: 'bottom 70%', scrub: true, onUpdate: s => { const n = Math.round(s.progress * pals.length); pals.forEach((p, i) => p.classList.toggle('on', i < n)); } });
  gsap.from('.manifesto .louro, .louro-legenda', { y: 30, opacity: 0, duration: 1, stagger: .1, scrollTrigger: { trigger: '.manifesto', start: 'top 75%', once: true } });

  if (largo) {
    // ---------- 3. COLAGEM HORIZONTAL ----------
    const palcoH = $('.horiz-palco');
    const tc = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.horizontal', start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: s => { claroHoriz = s.progress > +$('.horizontal').dataset.claroEm; palcoH.classList.toggle('claro', claroHoriz); atualizarTopo(); } } });
    tc.to('.trilho', { x: () => -(innerWidth * +$('.horizontal').dataset.deslocamento), duration: 1 }, 0)
      .to(palcoH, { backgroundColor: cor('--cor-neutra'), duration: .3 }, 0)
      .to(palcoH, { backgroundColor: cor('--cor-fundo-2'), duration: .25 }, .3)
      .to(palcoH, { backgroundColor: cor('--cor-fundo'), duration: .2 }, .55)
      .to(palcoH, { '--curvas': 1, duration: .3 }, .45);
    $$('.hf').forEach((f, i) => tc.fromTo(f, { y: (i % 3 - 1) * 40 }, { y: (i % 3 - 1) * -40, duration: 1 }, 0));

    // ---------- 4. DENTRO / FORA ----------
    const to = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.otot', start: 'top top', end: 'bottom bottom', scrub: true } });
    // como no original: os elementos entram ANTES de a seção fixar
    const entra = { trigger: '.otot', start: 'top 85%', end: 'top top', scrub: true };
    gsap.from('.otot-esq', { xPercent: -50, rotate: -50, ease: 'none', scrollTrigger: entra });
    gsap.from('.otot-dir', { xPercent: 60, ease: 'none', scrollTrigger: entra });
    gsap.from('.otot-col', { y: 80, opacity: 0, stagger: .1, ease: 'none', scrollTrigger: { trigger: '.otot', start: 'top 60%', end: 'top top', scrub: true } });
    to.to('.otot-esq', { rotate: 6, duration: .5 }, 0)
      .to('.otot-fim', { clipPath: 'inset(0% 0 0 0)', duration: .45 }, .55)
      .fromTo('.otot-fim img', { scale: 1.25 }, { scale: 1, duration: .45 }, .55);
  }

  // ---------- 5. HALL DA FAMA ----------
  gsap.from('.hall-titulo, .hall-texto', { y: 50, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.hall', start: 'top 80%', once: true } });
  if (largo) $$('.grade .col1, .grade .col3').forEach(li => gsap.fromTo(li, { y: 60 }, { y: -100, ease: 'none', scrollTrigger: { trigger: '.grade', start: 'top bottom', end: 'bottom top', scrub: true } }));
  gsap.from('.grade li', { opacity: 0, y: 60, duration: .9, ease: 'power3.out', stagger: .05, scrollTrigger: { trigger: '.grade', start: 'top 85%', once: true } });
  gsap.from('.mais > *', { y: 30, opacity: 0, duration: .9, stagger: .1, scrollTrigger: { trigger: '.mais', start: 'top 70%', once: true } });

  // ---------- 6. LOJA ----------
  const tl = { trigger: '.loja', start: 'top bottom', end: 'bottom top', scrub: true };
  gsap.fromTo('.loja-grande', { yPercent: 12 }, { yPercent: -6, ease: 'none', scrollTrigger: tl });
  gsap.fromTo('.loja-cartao', { yPercent: 40, rotate: -6 }, { yPercent: -30, rotate: 4, ease: 'none', scrollTrigger: tl });
  gsap.fromTo('.loja-p1, .loja-p2, .loja-p3', { y: 80 }, { y: -60, ease: 'none', stagger: .1, scrollTrigger: tl });

  // ---------- 7. PARCERIAS ----------
  gsap.fromTo('.parc-mao', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'none', scrollTrigger: { trigger: '.parcerias', start: 'top 90%', end: 'top 30%', scrub: true } });
  gsap.fromTo('.marcas', { xPercent: 0 }, { xPercent: -30, ease: 'none', scrollTrigger: { trigger: '.parcerias', start: 'top bottom', end: 'bottom top', scrub: true } });

  // ---------- 8. REDES: o leque sobe e abre ----------
  const cartas = $$('.leque img'), meio = (cartas.length - 1) / 2;
  cartas.forEach((c, i) => gsap.fromTo(c, { y: innerHeight * .35, rotate: 0, x: 0 }, { y: 0, rotate: (i - meio) * +$('.leque').dataset.giro, x: (i - meio) * innerWidth * (largo ? +$('.leque').dataset.abertura : +$('.leque').dataset.aberturaCelular), ease: 'none', scrollTrigger: { trigger: '.redes', start: 'top 85%', end: 'center 55%', scrub: true } }));

  // ---------- 9. RODAPÉ ----------
  const tr = $('.painel-assinatura path'), c2 = tr.getTotalLength();
  gsap.fromTo(tr, { strokeDasharray: c2, strokeDashoffset: c2 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.rodape', start: 'top 70%', end: 'top 20%', scrub: true } });
  gsap.to('.painel-marcas span', { xPercent: -50, duration: 30, ease: 'none', repeat: -1 });
  gsap.from('.painel-foto', { yPercent: 25, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.rodape', start: 'top 50%', once: true } });

  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
atualizarTopo();
