// OLEA: réplica do movimento do Oryzo, palco por palco (medido no original, 1440×900, 63 telas):
// intro desfocada → o sabonete gira (quadros 3D) → "Feito com IA*" com a mão e o brilho de arco-íris →
// tão portátil (moldura, embalagem, vitrine, capa de revista que vira a cena) → recursos com painel de vidro
// (bancada, térmica, croqui, letras, vista de cima) → criptografia / antiescorregão / casca → sustentabilidade →
// avaliações → faixa horizontal do produto → escolha a sua → artigo → rodapé.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fino = matchMedia('(pointer: fine)').matches;
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
const palco = sec => ({ trigger: sec, start: 'top top', end: 'bottom bottom', scrub: .6 });
if (reduzido) gsap.globalTimeline.timeScale(1); // timelines abaixo só rodam sem movimento reduzido

// ---------- quadros do giro (render 3D próprio, 48 quadros) ----------
const N = +$('.giro').dataset.quadros, quadros = [];
for (let i = 0; i < N; i++) { const im = new Image(); im.decoding = 'async'; im.src = `img/giro/${String(i).padStart(2, '0')}.webp`; quadros.push(im); }
const desenhador = canvas => { const g = canvas.getContext('2d'); let ultimo = -1; return t => { const i = Math.max(0, Math.min(N - 1, Math.round(t * (N - 1)))); const im = quadros[i]; if (i === ultimo || !im.complete) return; ultimo = i; g.clearRect(0, 0, canvas.width, canvas.height); g.drawImage(im, 0, 0, canvas.width, canvas.height); }; };
const giroQ = desenhador($('.giro-quadros')), amamQ = desenhador($('.amam-sab'));
quadros[0].onload = () => { giroQ(0); amamQ(0); };

// ---------- textos divididos em letras / palavras (animação por rolagem) ----------
const dividir = (el, cls, porPalavra) => { const nos = [...el.childNodes]; el.textContent = ''; nos.forEach(n => { if (n.nodeType !== 3) { el.appendChild(n); return; } const partes = porPalavra ? n.textContent.split(/(\s+)/) : [...n.textContent]; partes.forEach(t => { if (!t) return; if (/^\s+$/.test(t)) { el.appendChild(document.createTextNode(t)); return; } const sp = document.createElement('span'); sp.className = cls; sp.textContent = t; el.appendChild(sp); }); }); };
dividir($('.ia-t'), 'ch', false); $$('.ia-t sup').forEach(x => x.classList.add('ch'));
dividir($('.giro-texto'), 'pal', true);

// ---------- trilho de rolagem (polegar com "OLEA-1 MODELO") e item ativo do menu ----------
const polegar = $('.polegar'), links = $$('.topo nav a');
const marcos = [['intro', '#intro'], ['recursos', '#recursos'], ['produto', '#produto'], ['contato', '#contato']];
const aoRolar = () => {
  const max = document.documentElement.scrollHeight - innerHeight, p = max > 0 ? scrollY / max : 0;
  polegar.style.transform = `translateY(${p * innerHeight * .88}px)`;
  let atual = 'intro'; for (const [n, s] of marcos) { const el = $(s); if (el && el.getBoundingClientRect().top <= innerHeight * .5) atual = n; }
  links.forEach(a => a.setAttribute('aria-current', String(a.dataset.sec === atual)));
};
const continuar = $('.continuar');
const aoRolar2 = () => { const y = scrollY, H = innerHeight; continuar.classList.toggle('ver', (y > H * 8 && y < H * 56.4) && !(y > H * 45.4 && y < H * 48.9)); };
addEventListener('scroll', aoRolar, { passive: true }); aoRolar();
addEventListener('scroll', aoRolar2, { passive: true }); aoRolar2();

// ---------- interações ----------
const giro = $('.giro'), mao = $('.ia-mao');
let maoAtiva = false;
const alvoMao = $('.giro-quadros');
const ptr = { x: -1, y: -1 };
const avaliarMao = () => { if (!maoAtiva || ptr.x < 0) { giro.classList.remove('brilhando'); return; } const r = alvoMao.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2; giro.classList.toggle('brilhando', Math.hypot(ptr.x - cx, ptr.y - cy) < r.width * .36 || (ptr.y > cy && Math.abs(ptr.x - cx) < r.width * .3)); };
addEventListener('pointermove', e => { ptr.x = e.clientX; ptr.y = e.clientY; avaliarMao(); }, { passive: true });
if (!reduzido) gsap.to(document.documentElement, { '--giro': '360deg', duration: 6, repeat: -1, ease: 'none' });
$$('.abas button').forEach(b => b.addEventListener('click', () => {
  $$('.abas button').forEach(x => x.setAttribute('aria-selected', String(x === b))); const m = { img: b.dataset.img, nome: b.dataset.nome, txt: b.dataset.txt, lista: b.dataset.lista.split('|') }; // vem de data-* da aba
  const img = $('.escolha-img'); gsap.fromTo(img, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }); img.src = m.img; img.alt = `${m.nome}: pilha de ${+b.dataset.i + 1} sabonete(s)`;
  $('.escolha-desc h3').textContent = m.nome; $('.escolha-desc p').textContent = m.txt; $$('.escolha-lista li').forEach((li, i) => { li.textContent = m.lista[i]; });
}));
$('.copiar').addEventListener('click', async e => { try { await navigator.clipboard.writeText(location.href); e.target.textContent = 'Copiado!'; } catch { e.target.textContent = location.href; } });
$('.cripto-txt .pilula-c').addEventListener('click', e => { e.target.textContent = 'Mensagem: “toma banho”'; });

// ---------- pré-carregamento: o anel vetorial se preenche enquanto as imagens da abertura chegam ----------
const carregando = $('.carregando'), anel = $('.anel-fill'), topo = $('.topo');
if (!reduzido) topo.classList.add('na-intro');
if (!reduzido) addEventListener('scroll', () => topo.classList.toggle('na-intro', scrollY < innerHeight * .5), { passive: true });
const essenciais = [$('.intro-fundo'), quadros[0]];
const prontas = Promise.all(essenciais.map(im => im.complete ? 0 : new Promise(r => { im.addEventListener('load', r, { once: true }); im.addEventListener('error', r, { once: true }); })));
if (reduzido) carregando.classList.add('fim');
else {
  const prog = { v: 0 };
  const pintar = () => { anel.style.clipPath = `polygon(50% 50%, 50% -20%, ${prog.v > .125 ? '120% -20%,' : ''} ${prog.v > .375 ? '120% 120%,' : ''} ${prog.v > .625 ? '-20% 120%,' : ''} ${prog.v > .875 ? '-20% -20%,' : ''} ${50 + 80 * Math.sin(prog.v * Math.PI * 2)}% ${50 - 80 * Math.cos(prog.v * Math.PI * 2)}%)`; };
  const giroAnel = gsap.to(prog, { v: .82, duration: 1.6, ease: 'power2.out', onUpdate: pintar });
  Promise.all([prontas, new Promise(r => setTimeout(r, 1700))]).then(() => {
    giroAnel.kill();
    gsap.timeline().to(prog, { v: 1, duration: .45, ease: 'power2.inOut', onUpdate: pintar })
      .to('.carregando .alcas', { scale: 1.6, opacity: 0, duration: .9, ease: 'expo.inOut' }, '+=.05')
      .add(() => carregando.classList.add('fim'), '-=.6')
      .from('.intro-fundo', { scale: 1.18, filter: 'blur(14px)', duration: 1.6, ease: 'expo.out' }, '-=.55')
      .from('.intro-marca, .intro-tag, .intro-texto, .intro-vidro, .intro-video', { y: 40, opacity: 0, stagger: .07, duration: 1.1, ease: 'expo.out' }, '-=1.3');
  });
}

// ---------- menu no celular ----------
const menuBt = $('.menu-bt');
menuBt.addEventListener('click', () => { const ab = !$('.topo').classList.contains('aberto'); $('.topo').classList.toggle('aberto', ab); menuBt.setAttribute('aria-expanded', String(ab)); menuBt.textContent = ab ? 'Fechar' : 'Menu'; });
$$('.topo nav a').forEach(a => a.addEventListener('click', () => { $('.topo').classList.remove('aberto'); menuBt.setAttribute('aria-expanded', 'false'); menuBt.textContent = 'Menu'; }));

// ---------- rolagem suave ----------
let lenis = null;
if (!reduzido && fino) { lenis = new Lenis({ duration: 1.15 }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const id = a.getAttribute('href'), alvo = id.length > 1 && $(id); if (!alvo) return; e.preventDefault(); lenis ? lenis.scrollTo(alvo, { duration: 1.6 }) : alvo.scrollIntoView({ behavior: reduzido ? 'auto' : 'smooth' }); }));

if (!reduzido) {
gsap.set('.moldura, .revista, .vitrine-grande', { xPercent: -50 }); gsap.set('.moldura', { yPercent: -50 });
// ---------- 1. intro ----------
gsap.to('.intro .palco', { opacity: 0, scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.intro', start: 'top top', end: 'bottom top', scrub: true } });


// ---------- palcos encadeados como no original: cada palco fixo some quando o seguinte assume a tela ----------
['.giro', '.portatil', '.recursos', '.cripto'].forEach(sel => { const sec = $(sel), pal = $('.palco', sec); ScrollTrigger.create({ trigger: sec, start: 'top top', end: 'bottom bottom', onLeave: () => { pal.style.visibility = 'hidden'; }, onEnterBack: () => { pal.style.visibility = ''; } }); });

// ---------- 2. giro → feito com IA (palco fixo de 0 a 7200 px; p = y / 7200, medido no original) ----------
const tg = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { ...palco('.giro'), onUpdate: s => giroQ(.27 * Math.sin(Math.PI * gsap.utils.clamp(0, 1, (s.progress - .12) / .255))) } });
tg.eventCallback('onUpdate', () => { const q = tg.progress(); maoAtiva = q > .66 && q < .94; avaliarMao(); });
tg.fromTo('.giro-titulo', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .05 }, .06)
  .to('.giro-titulo', { y: 82, duration: .255 }, .12)
  .fromTo('.giro-texto', { opacity: 0 }, { opacity: 1, duration: .02 }, .06)
  .to('.giro-texto .pal', { opacity: 1, stagger: .004, duration: .02 }, .07)
  .to('.giro-texto .pal', { opacity: .55, stagger: .004, duration: .02 }, .3)
  .to('.giro-titulo, .giro-texto', { opacity: 0, duration: .04 }, .38)
  .to('.giro-quadros', { y: -30, scale: .68, duration: .1 }, .4)
  .to('.giro-quadros', { y: -34, scale: .54, duration: .08 }, .5)
  .set('.ia', { opacity: 1 }, .44)
  .fromTo('.ia-t .ch', { opacity: 0, yPercent: 35 }, { opacity: 1, yPercent: 0, stagger: .006, duration: .03 }, .44)
  .fromTo('.ia-modelo', { opacity: 0 }, { opacity: 1, duration: .03 }, .52)
  .fromTo('.ia-mao', { yPercent: 55, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .13 }, .46)
  .fromTo('.ia-piada', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: .04 }, .55)
  .fromTo('.ia-dica', { opacity: 0 }, { opacity: .85, duration: .03 }, .66)
  .to('.ia-t .ch', { opacity: 0, stagger: .0022, duration: .008 }, .978)
  .to('.ia-piada', { x: 120, opacity: 0, duration: .03 }, .97)
  .to('.ia-dica', { opacity: 0, duration: .03 }, .95);

// ---------- 3. tão portátil (palco fixo de 7200 a 19125 px; p = (y - 7200) / 11925) ----------
const grandes = ['img/pilha-cores.webp', 'img/vida-3.webp', 'img/vida-6.webp', 'img/vida-1.webp', 'img/vida-5.webp'];
const imgGrande = $('.vitrine-grande img'); let iGrande = 0;
const tp = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { ...palco('.portatil'), onUpdate: s => {
  const i = Math.max(0, Math.min(grandes.length - 1, Math.floor((s.progress - .36) / (.42 / grandes.length))));
  if (i !== iGrande) { iGrande = i; imgGrande.src = grandes[i]; }
} } });
tp.fromTo('.moldura', { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: .04 }, 0)
  .fromTo('.moldura-sab', { rotate: -14 }, { rotate: 0, duration: .07 }, 0)
  .fromTo('.portatil-rotulo', { opacity: 0 }, { opacity: 1, duration: .03 }, .02)
  .to('.portatil-rotulo', { top: '34vh', duration: .06 }, .09)
  .to('.embalagem', { opacity: 1, duration: .03 }, .1)
  .fromTo('.portatil-grande', { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1.4, duration: .03 }, .1)
  .to('.portatil-grande', { scale: 1, duration: .07 }, .15)
  .set('.portatil-grande', { className: 'portatil-grande brilha' }, .19)
  .to('.embalagem, .moldura-mira', { opacity: 0, duration: .03 }, .17)
  .to('.moldura', { width: '38.2vw', height: '76.7vh', top: '50.6vh', duration: .06 }, .17)
  .to('.moldura-sab', { top: '24%', width: '84%', duration: .06 }, .17)
  .to('.portatil-rotulo', { top: '31.1vh', duration: .08 }, .2)
  .to('.vitrine', { opacity: 1, duration: .001 }, .23)
  .fromTo('.vitrine-grande', { opacity: 0 }, { opacity: 1, duration: .04 }, .24)
  .to('.moldura', { width: '39.6vw', height: '81.7vh', top: '49.9vh', duration: .05 }, .23)
  .to('.moldura-sab', { opacity: 0, duration: .03 }, .25)
  .set('.portatil-grande', { className: 'portatil-grande' }, .26)
  .to('.portatil-grande', { scale: .62, x: '-14vw', y: '-6vh', duration: .06 }, .24)
  .to('.portatil-grande', { scale: .14, x: '0vw', y: '-2.5vh', opacity: 0, duration: .06 }, .31)
  .to('.portatil-pequeno', { opacity: 1, duration: .03 }, .34)
  .to('.moldura', { opacity: 0, duration: .02 }, .3)
  .fromTo('.vitrine-faixa', { x: () => innerWidth * .015 }, { x: () => -innerWidth * 1.318, duration: .55 }, .4)
  .fromTo('.vitrine-faixa', { opacity: 0 }, { opacity: 1, duration: .03 }, .39)
  .to('.revista', { opacity: 1, duration: .03 }, .8)
  .from('.revista', { scale: .96, duration: .05 }, .8)
  .to('.vitrine-grande', { opacity: 0, duration: .02 }, .83)
  .to('.revista > p, .revista-barras', { opacity: 0, duration: .04 }, .91)
  .fromTo('.revista-foto', { scale: 1 }, { scale: 1.12, duration: .09 }, .91)
  .to('.portatil-rotulo', { opacity: .35, duration: .04 }, .93)
  .to('.vitrine-faixa', { opacity: 0, duration: .03 }, .93);

// ---------- 4. recursos (palco fixo de 19125 a 28575 px; p = (y - 19125) / 9450) ----------
const tr = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: palco('.recursos') });
tr.fromTo('.cena-1', { clipPath: 'inset(9.1vh 30.2vw 9.2vh 30.2vw)' }, { clipPath: 'inset(0vh 0vw 0vh 0vw)', duration: .055 }, 0)
  .fromTo('.cena-1 img', { scale: 1.12 }, { scale: 1, duration: .2 }, 0)
  .fromTo('.vidro', { xPercent: -100 }, { xPercent: 0, duration: .05 }, .06)
  .fromTo('.v1 > *', { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: .008, duration: .03 }, .08)
  .fromTo('.f1', { opacity: 0 }, { opacity: 1, duration: .03 }, .05)
  .fromTo('.cena-2', { opacity: 1, clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: .09 }, .22)
  .fromTo('.cena-2 img', { filter: 'blur(18px)' }, { filter: 'blur(0px)', duration: .1 }, .22)
  .to('.v1, .f1', { opacity: 0, duration: .03 }, .24)
  .to('.v2', { opacity: 1, duration: .001 }, .27).fromTo('.v2 > *', { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: .008, duration: .03 }, .27)
  .to('.f2', { opacity: 1, duration: .03 }, .28).to('.escala', { opacity: 1, duration: .03 }, .3)
  .to('.cena-5', { opacity: 1, duration: .04 }, .4).fromTo('.cena-5 img', { scale: 1.2 }, { scale: 1, duration: .09 }, .4)
  .to('.v2, .f2, .escala', { opacity: 0, duration: .03 }, .4)
  .to('.v3', { opacity: 1, duration: .001 }, .44).fromTo('.v3 > *', { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: .01, duration: .04 }, .44)
  .to('.f3', { opacity: 1, duration: .03 }, .46)
  .to('.cena-3', { opacity: 1, duration: .04 }, .48)
  .from('.croqui', { opacity: 0, scale: 1.06, duration: .06 }, .49).from('.vetor', { rotate: -40, scale: .8, duration: .08 }, .5)
  .to('.vidro', { xPercent: -100, duration: .05 }, .6)
  .to('.f3', { opacity: 0, duration: .03 }, .68)
  .to('.croqui', { opacity: 0, duration: .05 }, .66)
  .to('.vetor', { left: '50vw', scale: 1.45, duration: .08 }, .66)
  .to('.vetor', { opacity: 0, duration: .03 }, .79)
  .to('.cena-4', { opacity: 1, duration: .03 }, .78).fromTo('.letras', { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: .05 }, .78)
  .fromTo('.letra-o svg', { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: .04 }, .8)
  .to('.letra-o svg', { opacity: 0, duration: .03 }, .86)
  .to('.letras', { scale: .34, color: 'rgb(255 241 216 / .16)', duration: .07 }, .86)
  .to('.letras', { opacity: 0, duration: .03 }, .97);

// ---------- 5. criptografia / antiescorregão (palco fixo de 28575 a 35775 px; p = (y - 28575) / 7200) ----------
const tc = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: palco('.cripto') });
tc.to('.c-cima', { opacity: 1, duration: .001 }, 0).fromTo('.c-cima img', { scale: 1.25 }, { scale: 1.05, duration: .1 }, 0)
  .to('.c-flutua', { opacity: 1, duration: .04 }, .09).fromTo('.c-flutua img', { scale: 1.12, y: 30 }, { scale: 1, y: -20, duration: .35 }, .09)
  .to('.cripto-txt', { opacity: 1, duration: .04 }, .12)
  .to('.cripto-txt', { opacity: 0, duration: .03 }, .44)
  .to('.c-borda', { opacity: 1, duration: .05 }, .46).fromTo('.c-borda img', { scale: 1.25 }, { scale: 1, duration: .3 }, .46)
  .fromTo('.c-borda img', { filter: 'grayscale(0) brightness(.82)' }, { filter: 'grayscale(1) brightness(.7)', duration: .05 }, .57)
  .to('.aderencia-txt', { opacity: 1, duration: .04 }, .6)
  .to('.aderencia-txt', { opacity: 0, duration: .03 }, .84)
  .to('.cripto .c-casca', { opacity: 1, duration: .04 }, .86).fromTo('.cripto .c-casca img', { scale: 1.3 }, { scale: 1, duration: .14 }, .86);

// ---------- 6. sustentabilidade (palco fixo de 35775 a 40866 px; p = (y - 35775) / 5091) ----------
const ts = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: palco('.sustenta') });
ts.fromTo('.s-casca .casca-a', { yPercent: -2 }, { yPercent: -100, duration: .36, ease: 'power3.in' }, .0).fromTo('.s-casca .casca-b', { yPercent: 2 }, { yPercent: 100, duration: .36, ease: 'power3.in' }, .0)
  .from('.sustenta-palavra', { opacity: .4, letterSpacing: '.02em', duration: .3 }, .05)
  .from('.sustenta-rot, .sustenta-topo, .sustenta-texto', { opacity: 0, duration: .06 }, .3)
  .to('.sustenta .palco', { '--claro': 1, duration: .16 }, .5).to('.sustenta .palco', { '--cor': '#12130c', duration: .16 }, .5).to('.folhas', { opacity: .55, duration: .16 }, .52)
  .to('.sustenta-palavra', { top: '9vh', duration: .1 }, .8).to('.sustenta-rot', { top: '10.6vh', duration: .1 }, .8).to('.sustenta-texto', { top: '39vh', duration: .1 }, .8).to('.sustenta-topo', { opacity: 0, duration: .05 }, .8)
  .fromTo('.cartoes', { top: '100vh' }, { top: '46.7vh', duration: .12 }, .88);

// ---------- 7. avaliações (palco fixo de 41766 a 43158 px; o título e a lista sobem como rolagem normal; o sabonete gira) ----------
dividir($('.amam-frase'), 'pal', true);
const lis = $$('.avaliacoes li');
const ta = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { ...palco('.amam'), onUpdate: s => { amamQ(gsap.utils.clamp(0, 1, .06 + s.progress * .24)); lis.forEach(li => { const r = li.getBoundingClientRect(); li.classList.toggle('apagada', r.top > innerHeight * .55 || r.bottom < innerHeight * .2); }); } } });
ta.to('.amam-titulo, .amam-frase', { y: () => -innerHeight * 1.5467, duration: 1 }, 0)
  .to('.amam-frase .pal', { opacity: 1, stagger: .02, duration: .05 }, 0)
  .to('.avaliacoes', { y: () => -innerHeight * 1.5467, duration: 1 }, 0)
  .to('.amam-sab', { left: '80.9vw', top: '50vh', rotate: -14, scale: 1, duration: .38 }, 0)
  .to('.amam-sab', { left: '50.7vw', top: '77.8vh', rotate: 10, duration: .62 }, .38);

// ---------- 8. produto: faixa horizontal ----------
// a faixa anda 1 px por 1 px de rolagem, como no original (de -53 px a -6778 px em 1440×900)
const estreito = matchMedia('(max-width: 860px)');
gsap.fromTo('.faixa', { x: () => estreito.matches ? 0 : -innerHeight * .0589 }, { x: () => estreito.matches ? -($('.faixa').scrollWidth - innerWidth) : -innerHeight * 7.531, ease: 'none', scrollTrigger: { trigger: '.produto', start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true } });
$$('.q img').forEach(im => gsap.fromTo(im, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: palco('.produto') }));

gsap.fromTo('.escolha-img', { y: () => -innerHeight * 1.58 }, { y: 0, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.escolha', start: 'top bottom', end: 'top top', scrub: .6 } });
// ---------- 9. escolha (palco fixo de 51683 a 52967 px; depois a tabela rola no fluxo) ----------
const te = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.escolha-trilho', start: 'top top', end: 'bottom bottom', scrub: .6 } });
te.to('.escolha-palco > .rotulo-c', { y: () => -innerHeight * .117, duration: .16 }, .4).to('.escolha-palco > .rotulo-c', { opacity: 0, duration: .14 }, .56)
  .to('.escolha-titulo', { scale: .72, y: () => -innerHeight * .2, duration: .6 }, .4)
  .to('.abas', { y: () => -innerHeight * .138, duration: .16 }, .4).to('.abas', { y: () => -innerHeight * .231, duration: .44 }, .56)
  .to('.escolha-img', { y: () => -innerHeight * .043, duration: .6 }, .4)
  .to('.escolha-desc, .escolha-lista', { opacity: 1, duration: .1 }, .46)
  .to('.escolha-desc', { y: () => -innerHeight * .131, duration: .44 }, .56).to('.escolha-lista', { y: () => -innerHeight * .13, duration: .44 }, .56);
$$('.artigo-corpo > *, .tab-col, .tab-linhas div').forEach(el => gsap.from(el, { opacity: 0, y: 24, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
gsap.from('.rodape-frase', { opacity: 0, y: 40, stagger: .12, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.rodape', start: 'top 70%', once: true } });

}
else giroQ(0);
document.fonts.ready.then(() => ScrollTrigger.refresh());
