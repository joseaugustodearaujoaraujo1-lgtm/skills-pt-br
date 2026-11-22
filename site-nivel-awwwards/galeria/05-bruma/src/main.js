// BRUMA ALTA: réplica do movimento da Son Daven, fase por fase (medido no original, 1440×900):
// abertura → hero 400vh (voo de drone, a foto encolhe num cartão dentro da paisagem em meio-tom) → prólogo que acende →
// sobre/conceito → onde as serras falam (mapa + infraestrutura) → lua fixa e palco claro com cartões em diagonal →
// linha do tempo → suítes → números → estações (arraste o sol) → quem faz → ateliê em números → galeria → notícias (arraste)
// → foto alta com contato → F·A·Q fixo → rodapé que se afasta.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fino = matchMedia('(pointer: fine)').matches;
const largo = matchMedia('(min-width: 861px)').matches;
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
const topo = $('.topo');

// ---------- topo: aparece depois da abertura do hero; cor conforme o fundo da seção sob ele ----------
const temas = $$('[data-tema]');
const atualizarTopo = () => {
  topo.classList.toggle('visivel', scrollY > innerHeight * .2 || reduzido);
  const y = 40; let tema = 'claro';
  for (const s of temas) { const r = s.getBoundingClientRect(); if (r.top <= y && r.bottom >= y) tema = s.dataset.tema; }
  // no hero, depois que a foto encolhe, o fundo é areia (claro)
  topo.classList.toggle('escuro', tema === 'escuro');
};
addEventListener('scroll', atualizarTopo, { passive: true });

// ---------- menu ----------
const botaoMenu = $('.menu-botao'), menu = $('#menu');
const fecharMenu = () => { menu.hidden = true; botaoMenu.setAttribute('aria-expanded', 'false'); };
botaoMenu.addEventListener('click', () => { const abrir = menu.hidden; menu.hidden = !abrir; botaoMenu.setAttribute('aria-expanded', String(abrir)); if (abrir) menu.querySelector('a').focus(); });
menu.addEventListener('click', e => { if (e.target.closest('a')) fecharMenu(); });
addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { fecharMenu(); botaoMenu.focus(); } });

// ---------- texto que acende palavra a palavra ----------
const quebrar = el => { el.innerHTML = el.textContent.trim().split(/\s+/).map(p => `<span class="pal">${p}</span>`).join(' '); return $$('.pal', el); };

// ---------- carrosséis simples (fade) ----------
function carrossel(caixa, contador, aoTrocar) {
  const fotos = $$('img', caixa); let i = 0;
  const ir = n => { i = (n + fotos.length) % fotos.length; fotos.forEach((f, k) => f.classList.toggle('ativa', k === i)); if (contador) contador.textContent = i + 1; aoTrocar?.(i); };
  $$('.seta', caixa).forEach(b => b.addEventListener('click', () => ir(i + +b.dataset.dir)));
  ir(0); return ir;
}
carrossel($('.galeria-fotos'), $('.galeria-i'));
const SUITES = [
  { area: 37, hosp: '2+1', preco: 'R$ 1.480', desc: 'Um estúdio aconchegante com sala panorâmica ampla e copa integrada, voltado para a mata.', foto: 0 },
  { area: 46, hosp: '2', preco: 'R$ 1.790', desc: 'Deluxe com banheira de imersão junto à janela e terraço para o vale.', foto: 1 },
  { area: 52, hosp: '2+1', preco: 'R$ 2.050', desc: 'Superior de pé-direito alto, armários de madeira maciça e lareira a lenha.', foto: 2 },
  { area: 64, hosp: '2', preco: 'R$ 2.480', desc: 'Master com sauna privativa de madeira clara e varanda para o nascer do sol.', foto: 3 },
  { area: 78, hosp: '4', preco: 'R$ 2.900', desc: 'Família com dois quartos, sala com lareira e quintal gramado.', foto: 0 },
  { area: 112, hosp: '4+2', preco: 'R$ 4.200', desc: 'Cobertura com terraço jardim, banheira externa e vista de 270° da serra.', foto: 1 },
];
const irSuite = carrossel($('.suites-fotos'), $('.suites-i'));
$$('.suites-tipos button').forEach(b => b.addEventListener('click', () => {
  $$('.suites-tipos button').forEach(x => x.setAttribute('aria-selected', String(x === b)));
  const s = SUITES[+b.dataset.i];
  $('.suites-area .num').textContent = s.area; $('.suites-hosp').textContent = s.hosp; $('.suites-valor').textContent = s.preco; $('.suites-desc').textContent = s.desc; irSuite(s.foto);
}));

// infraestrutura: minutos e lugar mudam junto com a foto ao lado
const INFRA = [
  { n: 3, lugar: 'Bosque das Araucárias', foto: 5, alt: 'Araucárias no alto de um morro com mata nativa' },
  { n: 8, lugar: 'Cachoeira das Andorinhas', foto: 1, alt: 'Cachoeira alta descendo pela mata' },
  { n: 12, lugar: 'Poço Verde', foto: 2, alt: 'Poço de água verde entre pedras' },
  { n: 5, lugar: 'Trilha da Cascata', foto: 4, alt: 'Cascata entre pedras com musgo' },
  { n: 20, lugar: 'Mirante do Vale', foto: 3, alt: 'Vale aberto com cachoeira ao fundo' },
  { n: 15, lugar: 'Jardim de Hortênsias', foto: 6, alt: 'Hortênsias em flor' },
];
let infraI = 0;
const fotoInfra = $('.infra-foto img');
const irInfra = n => {
  infraI = (n + INFRA.length) % INFRA.length; const d = INFRA[infraI];
  $('.infra-n').textContent = d.n; $('.infra-lugar').textContent = d.lugar; $('.infra-i').textContent = infraI + 1;
  fotoInfra.style.opacity = 0; setTimeout(() => { fotoInfra.src = `img/infra-${d.foto}.webp`; fotoInfra.alt = d.alt; fotoInfra.style.opacity = 1; }, 250);
};
$$('.infra .seta').forEach(b => b.addEventListener('click', () => irInfra(infraI + +b.dataset.dir)));

// ---------- estações: arraste o sol pelo arco (ou clique / setas) ----------
const ESTACOES = [
  'O verão transforma a serra num mapa de aventuras: trilhas na mata, banho de cachoeira, festas de padroeiro e um roteiro de sabores que vai do queijo ao café.',
  'O outono pinta os morros de ferrugem e ouro: é tempo de pinhão na brasa, de vinho na adega e de caminhadas longas no ar seco e limpo.',
  'O inverno traz a névoa que dá nome à casa: manhãs de geada, lareira acesa, fondue, céu estrelado e o silêncio que só existe a 1.640 metros.',
  'A primavera abre o jardim de hortênsias, enche as trilhas de passarinhos e devolve às cachoeiras a força das primeiras chuvas.',
];
const dial = $('.dial'), sol = $('.dial-sol'), paradas = $$('.dial-paradas button'), fundos = $$('.estacoes-fundo .mt'), textoEst = $('.estacoes-texto');
let estI = 0;
const pontoArco = t => { // curva quadrática do SVG (20,60) (200,-20) (380,60) em fração da caixa
  const x = (1 - t) ** 2 * 20 + 2 * (1 - t) * t * 200 + t * t * 380, y = (1 - t) ** 2 * 60 + 2 * (1 - t) * t * -20 + t * t * 60;
  return [x / 400, y / 80];
};
const porSol = t => { const [x, y] = pontoArco(t); sol.style.left = x * 100 + '%'; sol.style.top = y * 100 + '%'; };
const irEstacao = (n, animar = true) => {
  estI = n; paradas.forEach((b, k) => b.setAttribute('aria-checked', String(k === n)));
  fundos.forEach((f, k) => f.classList.toggle('ativa', k === n));
  textoEst.style.opacity = 0; setTimeout(() => { textoEst.textContent = ESTACOES[n]; textoEst.style.opacity = 1; }, animar ? 250 : 0);
  porSol(n / 3);
};
paradas.forEach(b => b.addEventListener('click', () => irEstacao(+b.dataset.i)));
$('.dial-paradas').addEventListener('keydown', e => { const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!d) return; e.preventDefault(); const n = (estI + d + 4) % 4; irEstacao(n); paradas[n].focus(); });
let arrasto = false;
const tDoPonteiro = e => { const r = dial.getBoundingClientRect(); return Math.min(1, Math.max(0, (e.clientX - r.left - r.width * .05) / (r.width * .9))); };
sol.addEventListener('pointerdown', e => { arrasto = true; dial.classList.add('arrastando'); sol.setPointerCapture(e.pointerId); });
sol.addEventListener('pointermove', e => { if (!arrasto) return; const t = tDoPonteiro(e); porSol(t); const n = Math.round(t * 3); if (n !== estI) { estI = n; paradas.forEach((b, k) => b.setAttribute('aria-checked', String(k === n))); fundos.forEach((f, k) => f.classList.toggle('ativa', k === n)); textoEst.textContent = ESTACOES[n]; } });
sol.addEventListener('pointerup', () => { arrasto = false; dial.classList.remove('arrastando'); irEstacao(estI, false); });
irEstacao(0, false);

// ---------- notícias: abas e arrastar ----------
$$('.abas button').forEach(b => b.addEventListener('click', () => {
  $$('.abas button').forEach(x => x.setAttribute('aria-selected', String(x === b)));
  $$('.noticias-lista li').forEach(li => li.classList.toggle('fora', b.dataset.f === 'obra' && li.dataset.tipo !== 'obra'));
}));
const trilho = $('.noticias-trilho'), lista = $('.noticias-lista'), etiquetaArraste = $('.arraste');
if (largo) {
  let x = 0, ini = 0, base = 0, puxando = false;
  const limite = () => Math.min(0, trilho.clientWidth - lista.scrollWidth - innerWidth * .06);
  const mover = v => { x = Math.max(limite(), Math.min(0, v)); gsap.to(lista, { x, duration: .6, ease: 'power3.out' }); };
  trilho.addEventListener('pointerdown', e => { puxando = true; ini = e.clientX; base = x; trilho.setPointerCapture(e.pointerId); });
  trilho.addEventListener('pointermove', e => {
    if (fino) gsap.to(etiquetaArraste, { left: e.clientX - trilho.getBoundingClientRect().left, top: e.clientY - trilho.getBoundingClientRect().top, duration: .3 });
    if (puxando) mover(base + (e.clientX - ini) * 1.3);
  });
  trilho.addEventListener('pointerup', () => { puxando = false; });
  trilho.addEventListener('keydown', e => { if (e.key === 'ArrowRight') mover(x - innerWidth * .33); if (e.key === 'ArrowLeft') mover(x + innerWidth * .33); });
}

// ---------- abertura ----------
const abertura = $('.abertura');
const fimAbertura = () => { abertura.remove(); atualizarTopo(); };

if (reduzido) { fimAbertura(); }
else {
  let lenis = null;
  if (fino) { lenis = new Lenis({ duration: 1.2 }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); lenis.stop(); }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const id = a.getAttribute('href'); const alvo = id.length > 1 && $(id); if (!alvo) return; e.preventDefault(); lenis ? lenis.scrollTo(alvo, { duration: 1.6 }) : alvo.scrollIntoView({ behavior: 'smooth' }); }));

  // abertura: o letreiro sobe em varredura, a araucária pulsa e a cortina sobe
  const ta = gsap.timeline({ onComplete: () => { fimAbertura(); lenis?.start(); } });
  ta.from('.abertura-marca', { clipPath: 'inset(100% 0 0 0)', duration: 1.1, ease: 'steps(14)' })
    .from('.abertura-arvore', { opacity: 0, scale: .9, duration: 1.2, ease: 'power2.out' }, 0)
    .from('.abertura-frase span, .abertura-esq span, .abertura-dir span', { opacity: 0, y: 8, stagger: .06, duration: .5 }, .2)
    .to({}, { duration: .5 })
    .to(abertura, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' })
    .from('.hero-foto', { scale: 1.18, duration: 1.8, ease: 'expo.out' }, '-=.9')
    .from('.hero-topo > *, .hero-base > *', { opacity: 0, y: 24, stagger: .06, duration: 1, ease: 'power3.out' }, '-=1.4');

  // ---------- 1. HERO ----------
  const th = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: true } });
  th.to('.hero-foto', { scale: 1.32, xPercent: -5, yPercent: 3, duration: .55 }, 0)                 // voo: aproxima e desliza para o sol
    .to('.hero-topo', { opacity: 0, y: -60, duration: .12 }, .02)
    .to('.hero-cartao', { scale: () => largo ? 433 / 1440 : .6, duration: .39, ease: 'power2.in' }, .55)   // encolhe até o cartão no meio da paisagem
    .to('.hero-base', { opacity: .85, duration: .3 }, .55);

  // ---------- 2. PRÓLOGO e frases que acendem ----------
  const acender = (el, gatilho, ini = 'top 75%', fim = 'bottom 60%') => {
    const pals = quebrar(el);
    ScrollTrigger.create({ trigger: gatilho, start: ini, end: fim, scrub: true, onUpdate: s => { const n = Math.round(s.progress * pals.length); pals.forEach((p, i) => p.classList.toggle('on', i < n)); } });
  };
  acender($('.prologo-texto p'), '.prologo', 'top 60%', 'bottom 90%');
  acender($('.criadores-frase'), '.criadores', 'top 70%', 'top 0%');
  gsap.fromTo('.prologo-flores', { yPercent: 8 }, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.prologo', start: 'top bottom', end: 'bottom top', scrub: true } });

  // meio-tom entra "varrendo" de baixo para cima, em degraus (como a varredura do original)
  $$('.faixa, .sobre-dissolve, .suites-serras, .lago-areia, .alto-cima, .alto-baixo').forEach(el => gsap.from(el, { clipPath: 'inset(100% 0 0 0)', ease: 'steps(12)', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 45%', scrub: true } }));

  if (largo) {
    // ---------- 3. SOBRE ----------
    gsap.from('.sobre-nome span', { yPercent: 40, opacity: 0, stagger: .12, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.sobre', start: 'top 70%', once: true } });
    gsap.from('.sobre-a > *, .sobre-b > *', { y: 50, opacity: 0, stagger: .08, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.sobre-a', start: 'top 85%', once: true } });
    gsap.fromTo('.sobre-lugar img', { scale: 1 }, { scale: 1.14, ease: 'none', scrollTrigger: { trigger: '.sobre-lugar', start: 'top bottom', end: 'bottom top', scrub: true } });

    // ---------- 4. O LUGAR ----------
    gsap.fromTo('.l1', { x: 0 }, { x: () => -innerWidth * .06, ease: 'none', scrollTrigger: { trigger: '.lugar', start: 'top bottom', end: 'top -40%', scrub: true } });
    gsap.fromTo('.l2', { x: () => innerWidth * .04 }, { x: 0, ease: 'none', scrollTrigger: { trigger: '.lugar', start: 'top bottom', end: 'top -40%', scrub: true } });
    gsap.from('.mapa .mapa-pontos > *', { opacity: 0, stagger: .03, duration: .6, scrollTrigger: { trigger: '.mapa', start: 'top 70%', once: true } });
    gsap.from('.infra', { yPercent: 10, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.infra', start: 'top 85%', once: true } });
    gsap.fromTo('.infra-foto', { yPercent: 18 }, { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.infra-foto', start: 'top bottom', end: 'bottom top', scrub: true } });

    // ---------- 5. POR QUE ENCANTA: cartões em diagonal (posições do original em px a 1440×900) ----------
    const X0 = [0, 1, 2, 3, 4, 5, 6, 7].map(i => 1737 + i * 575), Y0 = [375, 520, 721, 451, 700, 448, 651, 531], R0 = [-4, 3, -2, 5, -3, 4, -5, 2];
    const cartoes = $$('.cartao');
    const posicionar = px => { // px = rolagem dentro do palco fixo, em px de 1440
      const kx = innerWidth / 1440, ky = innerHeight / 900;
      cartoes.forEach((c, i) => {
        const x = X0[i] - 1.15 * px, sobe = Math.min(2700, Math.max(0, 2000 - x));
        const y = Y0[i] - .33 * sobe, r = R0[i] * Math.max(-1, Math.min(1, (x - 430) / 900));
        const meio = 1 - Math.min(1, Math.abs(x + 290 - 720) / 900), s = .94 + .08 * meio;
        c.style.transform = `translate3d(${x * kx}px, ${y * ky}px, 0) rotate(${r}deg) scale(${s})`;
      });
    };
    posicionar(0);
    ScrollTrigger.create({ trigger: '.encanto-palco', start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: s => posicionar(s.progress * (s.end - s.start) * 1440 / innerWidth) });
    gsap.fromTo('.encanto-galhos', { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.encanto-palco', start: 'top bottom', end: 'top top', scrub: true } });

    // ---------- 6. LINHA DO TEMPO ----------
    gsap.fromTo('.linha-foto img', { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.linha-foto', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.linha-cartao', { y: 80, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.linha-cartao', start: 'top 92%', once: true } });
    gsap.from('.linha-titulo span', { yPercent: 60, opacity: 0, stagger: .1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.linha', start: 'top 75%', once: true } });

    // ---------- 7. SUÍTES ----------
    gsap.from('.suites-fio', { scaleY: 0, transformOrigin: 'top', ease: 'none', scrollTrigger: { trigger: '.suites', start: 'top 70%', end: 'center center', scrub: true } });
    gsap.from('.suites-texto', { y: 50, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.suites', start: 'top 70%', once: true } });
    gsap.fromTo('.suites-fotos', { clipPath: 'inset(18% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', ease: 'none', scrollTrigger: { trigger: '.suites-fotos', start: 'top bottom', end: 'top 40%', scrub: true } });

    // ---------- 8 a 11 ----------
    gsap.fromTo('.numeros-pico', { yPercent: 10 }, { yPercent: -4, ease: 'none', scrollTrigger: { trigger: '.numeros', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.numeros-dados > div, .numeros-ritmo, .numeros-inclui', { y: 30, opacity: 0, stagger: .08, duration: .9, scrollTrigger: { trigger: '.numeros', start: 'top 60%', once: true } });
    gsap.fromTo('.criadores-nuvens', { yPercent: 6 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.criadores', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.atelie-cartao', { y: 120, ease: 'none', scrollTrigger: { trigger: '.atelie-cartao', start: 'top bottom', end: 'top 40%', scrub: true } });
    $$('.stat-n').forEach(n => { const alvo = +n.dataset.n, o = { v: 0 }; gsap.to(o, { v: alvo, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: '.stats', start: 'top 80%', once: true }, onUpdate: () => { n.textContent = Math.round(o.v); } }); });
    gsap.fromTo('.lago', { yPercent: 8 }, { yPercent: -4, ease: 'none', scrollTrigger: { trigger: '.atelie-numeros', start: 'top bottom', end: 'bottom top', scrub: true } });

    // ---------- 12 a 14 ----------
    gsap.from('.galeria-titulo span', { yPercent: 60, opacity: 0, stagger: .1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.galeria', start: 'top 80%', once: true } });
    gsap.from('.noticias-titulo span', { yPercent: 60, opacity: 0, stagger: .08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.noticias', start: 'top 70%', once: true } });
    gsap.fromTo('.noticias-lista li', { x: 120, opacity: 0 }, { x: 0, opacity: 1, stagger: .08, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.noticias-trilho', start: 'top 85%', once: true } });
    gsap.fromTo('.alto-foto', { y: 0 }, { y: () => innerHeight * .27, ease: 'none', scrollTrigger: { trigger: '.alto', start: 'top bottom', end: 'bottom top', scrub: true } });

    // ---------- 15. F·A·Q: letras primeiro, depois a lista ----------
    const tf = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.faq', start: 'top top', end: 'bottom bottom', scrub: true } });
    tf.to('.faq-letras', { y: -innerHeight * .1, duration: .3 }, 0)
      .to('.faq-letras', { opacity: 0, duration: .15 }, .3)
      .from('.faq-lista details', { y: 40, opacity: 0, stagger: .04, duration: .2 }, .38)
      .to({}, { duration: .2 });

    // ---------- 16. RODAPÉ: começa ampliado e se afasta ----------
    gsap.fromTo('.rodape-cena', { scale: 1.5 }, { scale: 1.04, ease: 'none', scrollTrigger: { trigger: '.rodape', start: 'top top', end: 'bottom bottom', scrub: true } });
  } else {
    gsap.utils.toArray('.titulo-g, .titulo-m, .suites-texto, .cartao, .linha-cartao, .infra').forEach(el => gsap.from(el, { y: 40, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
  }
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
atualizarTopo();
