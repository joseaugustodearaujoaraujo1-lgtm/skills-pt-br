// ESCUTA: movimento da réplica do MindMarket (GSAP + ScrollTrigger + Lenis).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const estreito = matchMedia('(max-width: 860px)');
const k = () => innerWidth / 1440; // as medidas do original são em px de 1440 de largura

// ---------- marcas fictícias dos trilhos (ícones próprios) ----------
const MARCAS = [
  ['Café Serrano', 'Banco Ipê', 'Aroeira Moda', 'Viação Sabiá', 'Rede Jangada', 'Pão de Mel & Cia', 'Cacau do Sul', 'Mercado Tucano'],
  ['Seguros Manacá', 'Óticas Brisa', 'Jacarandá Pay', 'Canal Pipoca', 'Motos Carcará', 'Hotéis Maré', 'Laticínios Serra Azul'],
  ['Rádio Varanda', 'Caju Entregas', 'Tênis Picada', 'Livraria Ponteio', 'Saúde Jatobá', 'Mate do Pampa', 'Clube Arara'],
];
const CORES = ['#6A3FB5', '#2F7DE1', '#F06B8A', '#E07B2E', '#3FA36B', '#2C2E2A', '#C9A227'];
const icone = (nome, i) => {
  const c = CORES[(nome.length + i) % CORES.length], l = nome[0];
  const forma = ['<circle cx="28" cy="28" r="12" fill="#fff"/>', '<rect x="17" y="17" width="22" height="22" rx="5" fill="#fff"/>', '<path d="M28 15l13 22H15z" fill="#fff"/>', '<path d="M16 34q12-24 24 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>'][(nome.length + i) % 4];
  return `<svg viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="28" fill="${c}"/>${forma}<text x="28" y="33" text-anchor="middle" font-size="14" font-weight="600" font-family="Inter, sans-serif" fill="${c}">${l}</text></svg>`;
};
$$('.trilho').forEach((t, r) => {
  const itens = MARCAS[r].map((n, i) => `<div class="pilula">${icone(n, i)}<span>${n}</span></div>`).join('');
  t.innerHTML = itens + itens.replace(/class="pilula"/g, 'class="pilula" aria-hidden="true"');
});

// ---------- menu do celular ----------
const menuBt = $('.menu-bt'), menuCel = $('#menu-cel');
menuBt.addEventListener('click', () => {
  const ab = menuCel.hidden;
  menuCel.hidden = !ab; menuBt.setAttribute('aria-expanded', String(ab)); menuBt.setAttribute('aria-label', ab ? 'Fechar menu' : 'Abrir menu');
});
$$('#menu-cel a').forEach(a => a.addEventListener('click', () => { menuCel.hidden = true; menuBt.setAttribute('aria-expanded', 'false'); }));

// ---------- pré-carregamento: a marca se desenha e a tela some ----------
const carregando = $('.carregando');
if (reduzido) carregando.classList.add('fim');
else {
  const tracos = $$('.carregando-marca path');
  tracos.forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
  const tl = gsap.timeline();
  tl.to(tracos, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: .15 });
  Promise.all([document.fonts.ready, new Promise(r => setTimeout(r, 1400))]).then(() => {
    tl.to('.carregando-marca', { y: -44, duration: .6, ease: 'power3.inOut' })
      .add(() => carregando.classList.add('fim'), '-=.2')
      .from('.hero-texto', { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out' }, '-=.1')
      .from('.grupo', { y: 120, opacity: 0, duration: 1.3, ease: 'expo.out' }, '<.1');
  });
}

if (!reduzido) {
  // ---------- rolagem suave ----------
  const lenis = new Lenis({ lerp: .1, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  let vel = 0;
  lenis.on('scroll', e => { vel = e.velocity || 0; });

  // botão de menu gira com a rolagem
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => gsap.set('.menu-bt svg', { rotate: s.scroll() * .25 }) });

  // ---------- hero: o bloco encolhe e escurece enquanto a linha do tempo sobe por cima ----------
  const th = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  th.to('.hero-texto', { scale: .8 }, 0).to('.hero-sombra', { opacity: .16 }, 0).to('.grupo', { scale: 1.11 }, 0);

  // ---------- linha do tempo: cartões entram e objetos com paralaxe ----------
  $$('.cartao').forEach(c => gsap.from(c, { y: 90, rotate: 2.5, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 88%', toggleActions: 'play none none reverse' } }));
  $$('.obj, .pers').forEach((o, i) => {
    const d = o.classList.contains('pers') ? 70 : 140 * (i % 2 ? 1 : -1);
    gsap.fromTo(o, { y: d }, { y: -d, rotate: o.classList.contains('obj') ? (i % 2 ? 14 : -14) : 0, ease: 'none', scrollTrigger: { trigger: o, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.fromTo('.m-tras', { y: -60 }, { y: 180, ease: 'none', scrollTrigger: { trigger: '.fim', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.m-meio', { y: -20 }, { y: 100, ease: 'none', scrollTrigger: { trigger: '.fim', start: 'top bottom', end: 'bottom top', scrub: true } });
  // ciclistas atravessam os morros e saem antes do título da chamada
  gsap.fromTo('.ciclistas-fixo img', { x: () => -innerWidth * .6 }, { x: () => innerWidth * 1.05, ease: 'none', scrollTrigger: { trigger: '.fim', start: 'top 60%', end: () => '+=' + innerHeight * 1.1, scrub: true, invalidateOnRefresh: true } });
  gsap.fromTo('.nuvem', { x: -40 }, { x: 60, ease: 'none', scrollTrigger: { trigger: '.fim', start: 'top bottom', end: 'bottom top', scrub: true } });

  // ---------- foto: camadas e fita com paralaxe ----------
  gsap.fromTo('.pub-fundo', { y: () => -innerWidth * .04 }, { y: () => innerWidth * .04, ease: 'none', scrollTrigger: { trigger: '.publico', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
  gsap.fromTo('.fita', { y: 60 }, { y: -60, ease: 'none', scrollTrigger: { trigger: '.publico', start: 'top bottom', end: 'bottom top', scrub: true } });

  // ---------- números: cartões sobem e se empilham (posições medidas no original, em px de 1440) ----------
  const PONTOS = [
    [[7356, 1582], [8100, 838], [8423, 467], [9170, 273], [9900, 89], [10045, 85]],
    [[8500, 1002], [9170, 332], [9900, 148], [10045, 145]],
    [[9200, 908], [9900, 208], [10045, 205]],
  ];
  const interp = (pts, s) => {
    if (s <= pts[0][0]) return pts[0][1] + (pts[0][0] - s);
    for (let i = 1; i < pts.length; i++) if (s <= pts[i][0]) { const [a, va] = pts[i - 1], [b, vb] = pts[i]; return va + (vb - va) * (s - a) / (b - a); }
    const [a, va] = pts[pts.length - 1]; return va - (s - a);
  };
  const cartoes = $$('.ncard'), pilha = $('.num-pilha'), numeros = $('.numeros');
  const posicionar = () => {
    if (estreito.matches) { cartoes.forEach(c => gsap.set(c, { clearProps: 'transform' })); return; }
    const f = k(), topoPilha = pilha.getBoundingClientRect().top;
    const sBase = scrollY - (numeros.getBoundingClientRect().top + scrollY - 8256 * f); // rolagem equivalente no original
    cartoes.forEach((c, i) => gsap.set(c, { y: interp(PONTOS[i], sBase / f) * f - 80 * f - topoPilha }));
  };
  ScrollTrigger.create({ trigger: '.numeros', start: 'top bottom', end: 'bottom top', onUpdate: posicionar, onRefresh: posicionar });

  // ---------- marcas: trilhos em sentidos alternados, mais rápidos com a rolagem ----------
  const trilhos = $$('.trilho').map(t => ({ el: t, dir: +t.dataset.dir, x: 0 }));
  gsap.ticker.add((_, dt) => {
    trilhos.forEach(t => {
      const w = t.el.scrollWidth / 2;
      t.x -= t.dir * (dt / 1000) * (40 + Math.min(Math.abs(vel), 60) * 6);
      if (t.x < -w) t.x += w; if (t.x > 0) t.x -= w;
      t.el.style.transform = `translate3d(${t.x}px,0,0)`;
    });
  });
  addEventListener('load', () => ScrollTrigger.refresh());
}
