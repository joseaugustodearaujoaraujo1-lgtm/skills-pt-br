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
const N = 48, quadros = [];
for (let i = 0; i < N; i++) { const im = new Image(); im.decoding = 'async'; im.src = `img/giro/${String(i).padStart(2, '0')}.webp`; quadros.push(im); }
const desenhador = canvas => { const g = canvas.getContext('2d'); let ultimo = -1; return t => { const i = Math.max(0, Math.min(N - 1, Math.round(t * (N - 1)))); const im = quadros[i]; if (i === ultimo || !im.complete) return; ultimo = i; g.clearRect(0, 0, canvas.width, canvas.height); g.drawImage(im, 0, 0, canvas.width, canvas.height); }; };
const giroQ = desenhador($('.giro-quadros')), amamQ = desenhador($('.amam-sab'));
quadros[0].onload = () => { giroQ(0); amamQ(0); };

// ---------- trilho de rolagem (polegar com "OLEA-1 MODELO") e item ativo do menu ----------
const polegar = $('.polegar'), links = $$('.topo nav a');
const marcos = [['intro', '#intro'], ['recursos', '#recursos'], ['produto', '#produto'], ['contato', '#contato']];
const aoRolar = () => {
  const max = document.documentElement.scrollHeight - innerHeight, p = max > 0 ? scrollY / max : 0;
  polegar.style.transform = `translateY(${p * innerHeight * .88}px)`;
  let atual = 'intro'; for (const [n, s] of marcos) { const el = $(s); if (el && el.getBoundingClientRect().top <= innerHeight * .5) atual = n; }
  links.forEach(a => a.setAttribute('aria-current', String(a.dataset.sec === atual)));
};
addEventListener('scroll', aoRolar, { passive: true }); aoRolar();

// ---------- interações ----------
const giro = $('.giro'), mao = $('.ia-mao');
mao.addEventListener('pointerenter', () => { if (+getComputedStyle($('.ia')).opacity > .5) giro.classList.add('brilhando'); }); mao.addEventListener('pointerleave', () => giro.classList.remove('brilhando'));
if (!reduzido) gsap.to(document.documentElement, { '--giro': '360deg', duration: 6, repeat: -1, ease: 'none' });
const MODELOS = [
  { img: 'img/pilha-1.webp', nome: 'OLEA', txt: 'O original. Refinado até parecer inevitável. Espuma na medida, firmeza na medida, e some no seu dia como se nunca tivesse estado ali.', lista: ['Elevação de uma camada', 'Isolamento natural de azeite', 'Firme em qualquer saboneteira'] },
  { img: 'img/pilha-2.webp', nome: 'OLEA Pro', txt: 'O dobro de azeite. O dobro de compromisso. Para quem quer espuma de sobra sem pensar nisso.', lista: ['Elevação de duas camadas', 'Isolamento térmico em dobro', 'Estabilidade para banheiras fundas'] },
  { img: 'img/pilha-3.webp', nome: 'OLEA Pro Max', txt: 'Três camadas de confiança. Para quem gosta do banho levado a sério, e de ser visto levando.', lista: ['Elevação máxima de três camadas', 'Presença máxima na pia', 'Literalmente três sabonetes'] },
];
$$('.abas button').forEach(b => b.addEventListener('click', () => {
  $$('.abas button').forEach(x => x.setAttribute('aria-selected', String(x === b))); const m = MODELOS[+b.dataset.i];
  const img = $('.escolha-img'); gsap.fromTo(img, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }); img.src = m.img; img.alt = `${m.nome}: pilha de ${+b.dataset.i + 1} sabonete(s)`;
  $('.escolha-desc h3').textContent = m.nome; $('.escolha-desc p').textContent = m.txt; $$('.escolha-lista li').forEach((li, i) => { li.textContent = m.lista[i]; });
}));
$('.copiar').addEventListener('click', async e => { try { await navigator.clipboard.writeText(location.href); e.target.textContent = 'Copiado!'; } catch { e.target.textContent = location.href; } });
$('.cripto-txt .pilula-c').addEventListener('click', e => { e.target.textContent = 'Mensagem: “toma banho”'; });

// ---------- rolagem suave ----------
let lenis = null;
if (!reduzido && fino) { lenis = new Lenis({ duration: 1.15 }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const id = a.getAttribute('href'), alvo = id.length > 1 && $(id); if (!alvo) return; e.preventDefault(); lenis ? lenis.scrollTo(alvo, { duration: 1.6 }) : alvo.scrollIntoView({ behavior: reduzido ? 'auto' : 'smooth' }); }));

if (!reduzido) {
// ---------- 1. intro ----------
gsap.to('.intro .palco', { opacity: 0, scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.intro', start: 'top top', end: 'bottom top', scrub: true } });
if (!reduzido) gsap.from('.alcas', { scale: .85, opacity: 0, duration: 1.4, ease: 'expo.out', delay: .2 });

// ---------- 2. giro → feito com IA ----------
const tg = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { ...palco('.giro'), onUpdate: s => giroQ(gsap.utils.clamp(0, 1, (s.progress - .1) / .36)) } });
tg.eventCallback('onUpdate', () => { if (tg.progress() > .95 || tg.progress() < .42) giro.classList.remove('brilhando'); });
tg.fromTo('.giro-titulo, .giro-texto', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .05 }, .08)
  .to('.giro-titulo, .giro-texto', { opacity: 0, y: -20, duration: .05 }, .38)
  .to('.giro-quadros', { y: () => innerHeight * .08, scale: .62, duration: .08 }, .38)
  .to('.giro-quadros', { opacity: 0, duration: .05 }, .46)
  .to('.ia', { opacity: 1, duration: .06 }, .42)
  .from('.ia-mao', { yPercent: 30, duration: .1 }, .42)
  .from('.ia-titulo', { yPercent: 40, opacity: 0, duration: .06 }, .44)
  .from('.ia-piada, .ia-dica', { opacity: 0, x: 30, duration: .05 }, .5)
  .to('.ia-titulo', { opacity: 0, duration: .06 }, .9)
  .to('.ia', { opacity: 0, duration: .04 }, .96);

// ---------- 3. tão portátil ----------
const grandes = ['img/pilha-cores.webp', 'img/vida-3.webp', 'img/vida-6.webp', 'img/vida-1.webp', 'img/vida-5.webp'];
const imgGrande = $('.vitrine-grande img'); let iGrande = 0;
const tp = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { ...palco('.portatil'), onUpdate: s => {
  const i = Math.max(0, Math.min(grandes.length - 1, Math.floor((s.progress - .26) / (.44 / grandes.length))));
  if (i !== iGrande) { iGrande = i; imgGrande.src = grandes[i]; }
} } });
tp.fromTo('.moldura-sab', { rotate: -8 }, { rotate: 0, duration: .08 }, 0)
  .to('.portatil-grande', { opacity: 1, duration: .05 }, .09)
  .fromTo('.portatil-grande', { letterSpacing: '.05em' }, { letterSpacing: '-.04em', duration: .1 }, .09)
  .to('.embalagem', { opacity: 1, duration: .04 }, .12)
  .fromTo('.moldura-sab', { scale: 1 }, { scale: .8, duration: .06 }, .12)
  .to('.portatil-grande, .moldura', { opacity: 0, duration: .04 }, .21)
  .to('.portatil-pequeno', { opacity: 1, duration: .03 }, .22)
  .to('.portatil-rotulo', { top: '30vh', duration: .03 }, .22)
  .to('.vitrine', { opacity: 1, duration: .04 }, .22)
  .fromTo('.vitrine-faixa', { x: 0 }, { x: () => -(innerWidth * 1.9), duration: .6 }, .26)
  .from('.vitrine-grande', { yPercent: 8, duration: .05 }, .22)
  .to('.revista', { opacity: 1, duration: .05 }, .72)
  .from('.revista', { scale: .96, duration: .06 }, .72)
  .to('.vitrine-grande', { opacity: 0, duration: .03 }, .76)
  .to('.revista > p, .revista-barras', { opacity: 0, duration: .05 }, .88)
  .to('.revista', { width: () => innerWidth, height: () => innerHeight, top: 0, outlineColor: 'transparent', duration: .09 }, .88)
  .to('.portatil-rotulo, .vitrine-faixa', { opacity: 0, duration: .04 }, .86);

// ---------- 4. recursos ----------
const tr = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: palco('.recursos') });
tr.from('.vidro', { xPercent: -100, duration: .04 }, .01)
  .from('.cena-1 img', { scale: 1.08, duration: .2 }, 0)
  .to('.cena-2', { opacity: 1, duration: .04 }, .28).to('.v1', { opacity: 0, duration: .03 }, .28).to('.v2', { opacity: 1, duration: .03 }, .3)
  .to('.f1', { opacity: 0, duration: .03 }, .28).to('.f2, .escala', { opacity: 1, duration: .03 }, .3)
  .to('.cena-3', { opacity: 1, duration: .04 }, .55).to('.v2, .escala, .f2', { opacity: 0, duration: .03 }, .55).to('.v3, .f3', { opacity: 1, duration: .03 }, .57)
  .from('.croqui', { opacity: 0, scale: 1.05, duration: .08 }, .56).from('.vetor', { rotate: -40, scale: .8, duration: .12 }, .58)
  .to('.vidro', { xPercent: -100, duration: .04 }, .76).to('.f3', { opacity: 0, duration: .03 }, .76)
  .to('.cena-4', { opacity: 1, duration: .04 }, .76).fromTo('.letras', { letterSpacing: '.3em', opacity: 0 }, { letterSpacing: '.02em', opacity: 1, duration: .08 }, .77)
  .to('.cena-5', { opacity: 1, duration: .05 }, .88).fromTo('.cena-5 img', { scale: 1.25 }, { scale: 1, duration: .12 }, .88);

// ---------- 5. criptografia / antiescorregão / casca ----------
const tc = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: palco('.cripto') });
tc.to('.c-flutua', { opacity: 1, duration: .04 }, 0).fromTo('.c-flutua img', { y: 30 }, { y: -20, duration: .3 }, 0)
  .to('.cripto-txt', { opacity: 1, duration: .04 }, .04)
  .to('.cripto-txt', { opacity: 0, duration: .03 }, .3)
  .to('.c-borda', { opacity: 1, duration: .05 }, .32).fromTo('.c-borda img', { scale: 1.15 }, { scale: 1, duration: .3 }, .32)
  .to('.aderencia-txt', { opacity: 1, duration: .04 }, .38)
  .to('.aderencia-txt', { opacity: 0, duration: .03 }, .62)
  .to('.c-casca', { opacity: 1, duration: .04 }, .63).fromTo('.c-casca img', { scale: 1.3 }, { scale: 1, duration: .2 }, .63)
  .to('.casca-a', { yPercent: -100, duration: .16 }, .84).to('.casca-b', { yPercent: 100, duration: .16 }, .84);

// ---------- 6. sustentabilidade ----------
const ts = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: palco('.sustenta') });
ts.from('.sustenta-palavra', { opacity: 0, letterSpacing: '.04em', duration: .12 }, 0).from('.sustenta-rot, .sustenta-topo, .sustenta-texto', { opacity: 0, duration: .08 }, .05)
  .to('.sustenta .palco', { '--claro': 1, duration: .14 }, .24).to('.sustenta .palco', { '--cor': '#12130c', duration: .14 }, .24).to('.folhas', { opacity: .55, duration: .14 }, .26)
  .to('.sustenta-palavra', { top: '6vh', duration: .1 }, .45).to('.sustenta-rot', { top: '4vh', duration: .1 }, .45).to('.sustenta-texto', { top: '24vh', duration: .1 }, .45).to('.sustenta-topo', { opacity: 0, duration: .05 }, .45)
  .to('.cartoes', { top: '48vh', duration: .2 }, .55);

// ---------- 7. avaliações ----------
const ta = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { ...palco('.amam'), onUpdate: s => amamQ((s.progress * 1.6) % 1) } });
ta.from('.amam-titulo', { opacity: 0, y: 30, duration: .1 }, 0).to('.amam-titulo', { opacity: 0, duration: .08 }, .3)
  .to('.avaliacoes', { top: () => -($('.avaliacoes').offsetHeight - innerHeight * .9), duration: .85 }, .15);

// ---------- 8. produto: faixa horizontal ----------
gsap.fromTo('.faixa', { x: () => innerWidth * .03 }, { x: () => -($('.faixa').scrollWidth - innerWidth * .92), ease: 'none', scrollTrigger: palco('.produto') });
$$('.q img').forEach(im => gsap.fromTo(im, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: palco('.produto') }));

// ---------- 9. escolha + 10. artigo ----------
const te = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: palco('.escolha') });
te.to('.escolha-palco > .rotulo-c', { opacity: 0, duration: .2 }, .35).to('.escolha-titulo', { scale: .55, y: () => -innerHeight * .1, duration: .3 }, .35)
  .to('.abas', { y: () => -innerHeight * .15, duration: .3 }, .35).to('.escolha-img', { y: () => -innerHeight * .12, duration: .3 }, .35)
  .to('.escolha-desc, .escolha-lista', { opacity: 1, duration: .2 }, .55);
$$('.artigo-corpo > *, .tab-col, .tab-linhas div').forEach(el => gsap.from(el, { opacity: 0, y: 24, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
gsap.from('.rodape-frase', { opacity: 0, y: 40, stagger: .12, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.rodape', start: 'top 70%', once: true } });

}
else giroQ(0);
document.fonts.ready.then(() => ScrollTrigger.refresh());
