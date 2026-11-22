// TURMALINA: a roda do mouse (ou o toque, ou as setas) troca de capítulo, um por vez, como no original.
import { criarCena } from './cena.js';
import { CAPITULOS } from './capitulos.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const raiz = document.documentElement;
const N = CAPITULOS.length;

// pontos de navegação à direita
$('.pontos').innerHTML = CAPITULOS.map((c, i) => `<li><button type="button" data-i="${i}" aria-label="Capítulo ${i + 1}${c.titulo ? ': ' + c.titulo.replace(/<br>/g, ' ') : ''}"><i></i></button></li>`).join('');

let cena = null;
try { cena = criarCena($('.palco')); } catch (e) { raiz.classList.add('sem-3d'); }

let cap = 0, chegada = 1, ocupado = false, pronto = false;
const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
const titulo = $('.titulo'), descobrir = $('.descobrir'), veu = $('.veu');

function mostrarTexto(k) {
  const c = CAPITULOS[k];
  titulo.innerHTML = c.titulo ? c.titulo.split('<br>').map(l => `<span class="linha">${[...l].map((ch, i) => `<span class="l" style="--i:${i}">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('')}</span>`).join('') : '';
  titulo.setAttribute('aria-label', c.titulo.replace(/<br>/g, ' '));
  raiz.classList.toggle('na-abertura', k === 0);
  descobrir.hidden = !c.peca;
  $$('.pontos button').forEach((b, i) => b.toggleAttribute('aria-current', i === k));
  titulo.classList.remove('entra'); void titulo.offsetWidth; titulo.classList.add('entra');
}
function ir(k) {
  k = Math.max(0, Math.min(N - 1, k));
  if (k === cap || ocupado || !pronto) return;
  ocupado = true;
  veu.style.background = CAPITULOS[k].fundo;
  veu.classList.add('ver'); titulo.classList.add('sai');
  setTimeout(() => {
    cap = k; chegada = 0; mostrarTexto(k); titulo.classList.remove('sai');
    veu.classList.remove('ver');
    setTimeout(() => { ocupado = false; }, 900);
  }, reduzido ? 0 : 650);
}
let acum = 0, ultimo = 0;
addEventListener('wheel', e => { e.preventDefault(); const agora = performance.now(); if (agora - ultimo > 400) acum = 0; ultimo = agora; acum += e.deltaY; if (Math.abs(acum) > 120) { ir(cap + Math.sign(acum)); acum = 0; } }, { passive: false });
let toqueY = null;
addEventListener('touchstart', e => { toqueY = e.touches[0].clientY; }, { passive: true });
addEventListener('touchend', e => { if (toqueY === null) return; const d = toqueY - e.changedTouches[0].clientY; if (Math.abs(d) > 40) ir(cap + Math.sign(d)); toqueY = null; });
addEventListener('keydown', e => { if ($('.painel').open) return; if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); ir(cap + 1); } if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); ir(cap - 1); } });
addEventListener('pointermove', e => { ptr.tx = e.clientX / innerWidth - .5; ptr.ty = .5 - e.clientY / innerHeight; });
$('.pontos').addEventListener('click', e => { const b = e.target.closest('button'); if (b) ir(+b.dataset.i); });
$('.rolar').addEventListener('click', () => ir(1));

// painel "Descobrir"
const painel = $('.painel');
descobrir.addEventListener('click', () => { const c = CAPITULOS[cap]; $('.painel-titulo').textContent = c.peca; $('.painel-texto').textContent = c.texto; painel.showModal(); });
$('.fechar').addEventListener('click', () => painel.close());

// som: ambiente suave gerado na hora (Web Audio)
let audio = null;
$('.som').addEventListener('click', () => {
  if (!audio) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)(); const g = ctx.createGain(); g.gain.value = 0; g.connect(ctx.destination);
    [196, 246.9, 293.7, 392].forEach((f, i) => { const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f; const v = ctx.createGain(); v.gain.value = .05 / (i + 1); o.connect(v).connect(g); o.start(); });
    audio = { ctx, g, on: false };
  }
  audio.on = !audio.on; audio.ctx.resume(); audio.g.gain.setTargetAtTime(audio.on ? .5 : 0, audio.ctx.currentTime, .5);
  $('.som').setAttribute('aria-pressed', String(audio.on));
});

// carregamento: texto de abertura + linha e porcentagem
const num = $('.carga-num'), linha = $('.carga-linha i');
let carga = 0;
function carregar() {
  carga = reduzido ? 100 : Math.min(100, (performance.now() - inicioCarga) / 18);
  num.textContent = Math.round(carga); linha.style.transform = `scaleX(${carga / 100})`;
  if (carga < 100) setTimeout(carregar, 40);
  else { $('.carregando').classList.add('fim'); pronto = true; mostrarTexto(0); }
}
let inicioCarga = performance.now();
document.fonts.ready.then(() => { inicioCarga = performance.now(); carregar(); });

let t0 = performance.now();
function laco(agora) {
  const t = (agora - t0) / 1000;
  chegada += (1 - chegada) * (reduzido ? 1 : .035);
  ptr.x += (ptr.tx - ptr.x) * .05; ptr.y += (ptr.ty - ptr.y) * .05;
  if (cena) cena.quadro(cap, chegada, t, ptr);
  if (!reduzido) requestAnimationFrame(laco);
}
requestAnimationFrame(laco);
