// CAIS: movimento da réplica do Terminal Industries (GSAP + ScrollTrigger + Lenis).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const estreito = matchMedia('(max-width: 860px)');

// ---------- logos fictícios da grade ----------
const LOGOS = ['Rodosul', 'Frio Norte', 'Cargas Tupi', 'Atacado Brisa', 'Via Norte', 'Armazéns Ipê', 'Porto Vivo', 'Agro Pampa', 'Maremar', 'Translitoral', 'Laticínios Serra', 'Depósito Central', 'Pneus Sertão', 'Moda Aroeira', 'Bebidas Ipanema', 'Eletro Caju', 'Papel Jatobá', 'Farma Brisa'];
const icones = ['<circle cx="13" cy="13" r="11" fill="none" stroke="currentColor" stroke-width="3"/>', '<path d="M2 22L13 3l11 19z" fill="currentColor"/>', '<rect x="3" y="3" width="20" height="20" rx="3" fill="currentColor"/>', '<path d="M2 13h22M13 2v22" stroke="currentColor" stroke-width="4"/>'];
$('.grade-logos').innerHTML = LOGOS.map((n, i) => `<li><span><svg viewBox="0 0 26 26" aria-hidden="true">${icones[i % 4]}</svg>${n}</span></li>`).join('');

// ---------- menu do celular ----------
const menuBt = $('.menu-bt'), menuCel = $('#menu-cel');
menuBt.addEventListener('click', () => { const ab = menuCel.hidden; menuCel.hidden = !ab; menuBt.setAttribute('aria-expanded', String(ab)); });
$$('#menu-cel a').forEach(a => a.addEventListener('click', () => { menuCel.hidden = true; menuBt.setAttribute('aria-expanded', 'false'); }));

// ---------- calculadora (conta de verdade, recalcula ao digitar) ----------
const fmt = n => Math.round(n).toLocaleString('pt-BR');
function calcular() {
  const f = Object.fromEntries([...new FormData($('.calc-form'))].map(([k, v]) => [k, +v || 0]));
  const semanas = 52, horas = 8;
  const mao = f.portoes * f.turnos * horas * f.dias * semanas * f.hora * .55;
  const manobra = f.manobristas * f.turnos * horas * f.dias * semanas * f.hora * .42;
  const multa = f.entradas * f.dias * semanas * (4 + f.multas * 2.1);
  const set = (k, v) => { $(`[data-r="${k}"]`).textContent = fmt(v); };
  set('mao', mao); set('manobra', manobra); set('multa', multa); set('total', mao + manobra + multa);
}
$('.calc-form').addEventListener('input', calcular); calcular();

// ---------- abas das perguntas e do carrossel ----------
$$('.perg-dir .abas button').forEach(b => b.addEventListener('click', () => { $$('.perg-dir .abas button').forEach(x => x.setAttribute('aria-selected', String(x === b))); }));
const slides = $$('.slide'), abasP = $$('.plataforma .abas button');
let slideAtual = 0;
function irSlide(i) {
  slideAtual = (i + slides.length) % slides.length;
  slides.forEach((s, k) => s.classList.toggle('ativo', k === slideAtual));
  abasP.forEach((b, k) => b.setAttribute('aria-selected', String(k === slideAtual)));
  if (!estreito.matches) $('.slides').style.transform = `translateX(${-slideAtual * 600}px)`;
}
abasP.forEach(b => b.addEventListener('click', () => irSlide(+b.dataset.i)));
$('.seta.ant').addEventListener('click', () => irSlide(slideAtual - 1));
$('.seta.prox').addEventListener('click', () => irSlide(slideAtual + 1));

// ---------- gêmeo digital: vagas e trajetos desenhados por cima da foto aérea ----------
function desenharGemeo(cv, t, intensidade = 1) {
  const w = cv.width = cv.clientWidth, h = cv.height = cv.clientHeight, g = cv.getContext('2d');
  g.clearRect(0, 0, w, h); if (!w) return;
  g.strokeStyle = `rgba(140,210,255,${.35 * intensidade})`; g.lineWidth = 1;
  const passo = 46;
  for (let x = (t * 8) % passo; x < w; x += passo) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  for (let y = 0; y < h; y += passo) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  g.font = '600 10px "IBM Plex Mono", monospace';
  for (let i = 0; i < 18; i++) {
    const x = (i % 6) * w / 6 + w / 30, y = Math.floor(i / 6) * h / 3.4 + h / 6, bw = w / 9, bh = h / 16;
    const livre = (i * 7 + Math.floor(t)) % 5 === 0;
    g.strokeStyle = livre ? `rgba(255,138,31,${.9 * intensidade})` : `rgba(180,230,255,${.75 * intensidade})`;
    g.strokeRect(x, y, bw, bh);
    g.fillStyle = g.strokeStyle; g.fillText(`VAGA ${String(i + 1).padStart(2, '0')} · ${livre ? 'LIVRE' : 'OCUPADA'}`, x, y - 6);
  }
  const yv = (t * 120) % h; g.fillStyle = `rgba(140,210,255,${.18 * intensidade})`; g.fillRect(0, yv, w, 2);
}

// ---------- letras do hero ----------
$$('.frase').forEach(f => {
  const palavras = f.textContent.split(' ');
  f.setAttribute('aria-label', f.textContent);
  f.innerHTML = palavras.map(p => `<span style="white-space:nowrap">${[...p].map(c => `<span class="l" aria-hidden="true">${c}</span>`).join('')}</span>`).join(' ');
});
function revelar(frase, u, h = 0) {
  // u: fração escrita (da primeira letra em diante); h: fração apagada (também da primeira em diante)
  const ls = frase.querySelectorAll('.l'), n = Math.round(Math.max(0, Math.min(1, u)) * ls.length), a = Math.round(Math.max(0, Math.min(1, h)) * ls.length);
  ls.forEach((l, i) => { l.classList.toggle('v', i < n && i >= a); l.classList.toggle('novo', i < n && i >= n - 3 && n < ls.length); });
}

// ---------- pré-carregamento ----------
const carregando = $('.carregando');
if (reduzido) carregando.classList.add('fim');
else Promise.all([document.fonts.ready, new Promise(r => setTimeout(r, 900))]).then(() => carregando.classList.add('fim'));

if (reduzido) {
  revelar($('.f1'), 1);
} else {
  const lenis = new Lenis({ lerp: .1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // topo claro sobre as seções brancas
  const topo = $('.topo');
  const temaTopo = () => { const y = scrollY; const escuro = y < $('.hero').offsetHeight - 80 || (y > $('.citacao').offsetTop - 80 && y < $('.citacao').offsetTop + 820) || y > $('.rodape').offsetTop - 80; topo.classList.toggle('claro', !escuro); };
  addEventListener('scroll', temaTopo, { passive: true }); temaTopo();

  // hero: 3 quadros que se cruzam com zoom lento + 3 frases que se escrevem
  const gemeo = $('.gemeo');
  let progHero = 0;
  ScrollTrigger.create({
    trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: s => {
      const p = progHero = s.progress;
      gsap.set('.hq1', { scale: 1 + p * .25, opacity: 1 - gsap.utils.clamp(0, 1, (p - .28) / .1) });
      gsap.set('.hq2', { scale: 1.15 - p * .15, opacity: gsap.utils.clamp(0, 1, (p - .28) / .1) });
      gsap.set('.hq3', { opacity: gsap.utils.clamp(0, 1, (p - .62) / .1) });
      gsap.set(gemeo, { opacity: gsap.utils.clamp(0, 1, (p - .66) / .12) });
      gsap.set('.rolar', { opacity: .75 * (1 - gsap.utils.clamp(0, 1, p / .06)) });
      // medido no original: cada frase ocupa 600 px; escreve de +40 a +355 e apaga de +400 a +570
      const rol = p * 1800;
      ['.f1', '.f2', '.f3'].forEach((sel, i) => { const s0 = i * 600; revelar($(sel), (rol - s0 - 40) / 315, (rol - s0 - 400) / 170); });
    },
  });
  gsap.ticker.add(t => { if (progHero > .6 && scrollY < $('.hero').offsetHeight) desenharGemeo(gemeo, t); });

  // títulos grandes sobem com leve atraso
  $$('.titulo-g, .titulo-m').forEach(el => gsap.from(el, { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top bottom' } }));
  gsap.from('.card', { y: 80, opacity: 0, duration: 1, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.cards', start: 'top bottom' } });

  // passos: o item ativo e a mídia mudam conforme a rolagem
  const itens = $$('.passos-lista li'), midias = $$('.passos-midia img');
  ScrollTrigger.create({
    trigger: '.passos', start: 'top top', end: 'bottom bottom',
    onUpdate: s => {
      if (estreito.matches) return;
      // trocas medidas no original: item 2 em ~6 600, item 3 em ~7 500, item 4 em ~8 400
      const i = Math.max(0, Math.min(itens.length - 1, Math.floor((scrollY - 5700) / 900)));
      itens.forEach((li, k) => { li.classList.toggle('ativo', k === i); li.classList.toggle('saiu', k < i); });
      midias.forEach((m, k) => m.classList.toggle('ativo', k === i));
    },
    onRefresh: s => s.onUpdate && s.onUpdate(s),
  });
  itens[0].classList.add('ativo'); midias[0].classList.add('ativo');
  const gp = $('.gemeo-passo');
  gsap.ticker.add(t => { const r = gp.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) desenharGemeo(gp, t, .6); });

  // citação: foto com paralaxe
  gsap.fromTo('.citacao img', { y: -60 }, { y: 60, ease: 'none', scrollTrigger: { trigger: '.citacao', start: 'top bottom', end: 'bottom top', scrub: true } });
  addEventListener('load', () => ScrollTrigger.refresh());
}
