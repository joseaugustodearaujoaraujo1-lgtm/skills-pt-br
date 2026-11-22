// ACORDE Lab: a página não rola. A roda do mouse, o toque e as setas avançam um "passo" de cada vez (600 px = 1 passo), como no original.
import { criarCena } from './cena.js';
import { TOTAL, FALANTES, CAPITULOS, FALAS, PONTOS } from './roteiro.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const raiz = document.documentElement;

// ---------- transcrição (sempre disponível; é a alternativa estática) ----------
const corpo = $('.transcricao-corpo');
corpo.innerHTML = CAPITULOS.map((c, i) => `<h3>${['I', 'II', 'III'][i]} · ${c.nome}</h3>` + FALAS.filter(f => f[0] >= c.inicio - .3 && f[0] < c.fim).map(f => `<p><b>${FALANTES[f[1]]}</b>${f[2]}</p>`).join('')).join('');
const transcricao = $('.transcricao');
const abrirTranscricao = () => { transcricao.classList.add('aberta'); transcricao.focus(); };
$('.voltar').addEventListener('click', () => { transcricao.classList.remove('aberta'); if (location.hash === '#transcricao') history.replaceState(null, '', location.pathname); });
$('.continuar').addEventListener('click', e => { e.preventDefault(); abrirTranscricao(); });

// ---------- cena 3D ----------
let cena = null;
try { cena = criarCena($('.palco')); } catch (e) { raiz.classList.add('sem-3d'); }

// ---------- estado da rolagem virtual ----------
let alvo = 0, atual = 0, iniciado = false;
const ponteiro = { x: 0, y: 0, tx: 0, ty: 0 };
const limitar = v => Math.max(0, Math.min(TOTAL, v));
const avancar = d => { if (!iniciado) return; alvo = limitar(alvo + d); };
addEventListener('wheel', e => { e.preventDefault(); avancar(e.deltaY / 600); }, { passive: false });
let toqueY = null;
addEventListener('touchstart', e => { toqueY = e.touches[0].clientY; }, { passive: true });
addEventListener('touchmove', e => { if (toqueY === null) return; const y = e.touches[0].clientY; avancar((toqueY - y) / 260); toqueY = y; }, { passive: true });
addEventListener('keydown', e => {
  if (transcricao.classList.contains('aberta') || $('.detalhe').open) return;
  if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); avancar(1); }
  if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); avancar(-1); }
});
addEventListener('pointermove', e => { ponteiro.tx = e.clientX / innerWidth - .5; ponteiro.ty = .5 - e.clientY / innerHeight; });

// ---------- som: ambiente gerado na hora (Web Audio), ligado no primeiro clique ----------
let audio = null, somLigado = false;
function criarSom() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const mestre = ctx.createGain(); mestre.gain.value = 0; mestre.connect(ctx.destination);
  const filtro = ctx.createBiquadFilter(); filtro.type = 'lowpass'; filtro.frequency.value = 900; filtro.connect(mestre);
  [110, 164.8, 220, 277.2].forEach((f, i) => {
    const o = ctx.createOscillator(); o.type = i % 2 ? 'sine' : 'triangle'; o.frequency.value = f;
    const g = ctx.createGain(); g.gain.value = .05 / (i + 1);
    const lfo = ctx.createOscillator(); lfo.frequency.value = .05 + i * .03; const lg = ctx.createGain(); lg.gain.value = .02 / (i + 1);
    lfo.connect(lg).connect(g.gain); o.connect(g).connect(filtro); o.start(); lfo.start();
  });
  return { ctx, mestre, filtro };
}
function ligarSom(on) {
  somLigado = on; $('.som').setAttribute('aria-pressed', String(on)); $('.som').textContent = on ? 'Som ligado' : 'Som';
  if (!audio) return;
  audio.ctx.resume(); audio.mestre.gain.setTargetAtTime(on ? .5 : 0, audio.ctx.currentTime, .6);
}
$('.som').addEventListener('click', e => { e.stopPropagation(); if (!audio) audio = criarSom(); ligarSom(!somLigado); });

// ---------- início: carregamento e clique em qualquer lugar ----------
const carga = $('.carga i');
let cargaP = 0;
const subirCarga = setInterval(() => { cargaP = Math.min(1, cargaP + .07); carga.style.setProperty('--p', cargaP); if (cargaP >= 1) { clearInterval(subirCarga); $('.carregando').classList.add('fim'); } }, 70);
function iniciar() {
  if (iniciado) return; iniciado = true;
  raiz.classList.add('iniciado');
  try { audio = criarSom(); ligarSom(true); } catch (e) { /* sem áudio: segue em silêncio */ }
  alvo = Math.max(alvo, .4);
}
addEventListener('click', e => { if (e.target.closest('.som, .detalhe, .ponto, .capitulos, .transcricao, .continuar, .pular-intro, .marcas')) return; iniciar(); });
$('.ativar').addEventListener('click', iniciar);

// ---------- capítulos e pular introdução ----------
$$('.capitulos button').forEach(b => b.addEventListener('click', () => { iniciar(); alvo = CAPITULOS[+b.dataset.cap].inicio + .4; }));
$('.pular-intro').addEventListener('click', () => { iniciar(); alvo = CAPITULOS[0].inicio + 1.8; });
$('.marcas').addEventListener('click', e => { e.preventDefault(); alvo = 0; });

// ---------- pontos de exploração ----------
const dlg = $('.detalhe');
$$('.ponto').forEach(b => b.addEventListener('click', () => {
  const d = PONTOS[+b.dataset.ponto];
  $('.detalhe-rotulo').textContent = d.rotulo; $('.detalhe-titulo').textContent = d.titulo; $('.detalhe-texto').textContent = d.texto;
  dlg.showModal();
}));
$('.fechar').addEventListener('click', () => dlg.close());
const PONTO_3D = [[.0, .72, .0], [.0, .55, .0]];

// ---------- onda de áudio da barra de capítulos ----------
const onda = $('.onda'), og = onda.getContext('2d');
function desenharOnda(t, p) {
  const w = onda.width = onda.clientWidth * Math.min(devicePixelRatio, 2), h = onda.height = onda.clientHeight * Math.min(devicePixelRatio, 2);
  og.clearRect(0, 0, w, h);
  const prog = Math.max(0, Math.min(1, (p - 10) / 32));
  const grad = og.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, 'rgba(255,140,60,.0)'); grad.addColorStop(.15, 'rgba(255,140,60,.9)'); grad.addColorStop(.5, 'rgba(255,255,255,.9)'); grad.addColorStop(.85, 'rgba(90,140,255,.9)'); grad.addColorStop(1, 'rgba(90,140,255,0)');
  og.lineWidth = 1.5 * (w / onda.clientWidth); og.strokeStyle = grad; og.shadowColor = 'rgba(255,170,90,.8)'; og.shadowBlur = 14;
  for (let k = 0; k < 2; k++) {
    og.beginPath();
    for (let x = 0; x <= w; x += 4) {
      const u = x / w, amp = (somLigado ? 1 : .35) * h * .22 * (Math.sin(u * 9 + t * 1.3 + k) * .6 + Math.sin(u * 23 - t * 2.1) * .4) * Math.exp(-Math.pow((u - prog) * 5, 2) * (k ? 1 : .4));
      og.lineTo(x, h / 2 + amp);
    }
    og.globalAlpha = k ? .5 : 1; og.stroke();
  }
  og.globalAlpha = 1;
}

// ---------- legenda com palavras que acendem ----------
const fala = $('.fala'), falante = $('.falante');
let falaAtual = -1;
function legenda(p) {
  let i = -1; for (let k = 0; k < FALAS.length; k++) if (FALAS[k][0] <= p) i = k;
  if (p < 10 || p > 42) i = -1;
  if (i !== falaAtual) {
    falaAtual = i;
    if (i < 0) { fala.innerHTML = ''; falante.textContent = ''; }
    else { falante.textContent = FALANTES[FALAS[i][1]]; fala.innerHTML = FALAS[i][2].split(' ').map(w => `<span>${w}</span>`).join(' '); }
  }
  if (i >= 0) {
    const ini = FALAS[i][0], fim = (FALAS[i + 1] ? FALAS[i + 1][0] : ini + 1.5), u = Math.min(1, (p - ini) / Math.max(.3, (fim - ini) * .7));
    const spans = fala.children, n = Math.ceil(u * spans.length);
    for (let k = 0; k < spans.length; k++) spans[k].classList.toggle('on', k < n);
  }
}

// ---------- laço principal ----------
const escuro = $('.escuro'), capTitulo = $('.cap-titulo');
let ultimoCap = -1, tempo0 = performance.now();
function laco(agora) {
  const t = (agora - tempo0) / 1000;
  atual += (alvo - atual) * (reduzido ? 1 : .075);
  if (Math.abs(alvo - atual) < .0005) atual = alvo;
  ponteiro.x += (ponteiro.tx - ponteiro.x) * .05; ponteiro.y += (ponteiro.ty - ponteiro.y) * .05;
  const p = atual;

  // interface por trecho
  raiz.classList.toggle('dentro', p > .6);
  $('.intro').style.opacity = String(Math.max(0, 1 - p / 1.6));
  $('.role-dica').classList.toggle('ver', iniciado && p < 9.6 && p > .2);
  $('.pular-intro').classList.toggle('ver', iniciado && p > .3 && p < 10.4);
  raiz.classList.toggle('capitulando', p >= 10 && p < 42.2);
  $('.fim').classList.toggle('ver', p > 43.4);
  const cap = CAPITULOS.findIndex(c => p >= c.inicio && p < c.fim);
  if (cap !== ultimoCap) {
    ultimoCap = cap;
    $$('.capitulos button').forEach((b, i) => i === cap ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current'));
    if (cap >= 0) { capTitulo.textContent = CAPITULOS[cap].titulo; $('.cap-atual .num').textContent = ['I', 'II', 'III'][cap]; $('.cap-atual .nome').textContent = CAPITULOS[cap].nome; }
  }
  const c0 = cap >= 0 ? CAPITULOS[cap].inicio : 0;
  capTitulo.classList.toggle('ver', cap >= 0 && p - c0 > .5 && p - c0 < 1.8);
  // escurece nas trocas de cena
  const trocas = [6.4, 18.5, 30, 42.6];
  let esc = 0; trocas.forEach(x => { esc = Math.max(esc, 1 - Math.abs(p - x) / .35); });
  if (p > 42 && p < 43.2) esc = 1;
  escuro.style.opacity = String(Math.max(0, esc));
  legenda(p);
  desenharOnda(t, p);

  if (cena) {
    cena.quadro(p, t, ponteiro);
    $$('.ponto').forEach((b, i) => {
      const [a, z] = PONTOS[i].passo, ver = p > a && p < z;
      b.classList.toggle('ver', ver);
      if (ver) { const s = cena.naTela(...PONTO_3D[i]); b.style.transform = `translate(${s.x - 15}px, ${s.y - 22}px)`; }
    });
  }
  requestAnimationFrame(laco);
}

if (reduzido) {
  // alternativa estática: um quadro parado do frasco e a transcrição aberta
  $('.carregando').classList.add('fim'); raiz.classList.add('iniciado', 'dentro');
  if (cena) cena.quadro(14.2, 0, { x: 0, y: 0 });
  abrirTranscricao();
} else requestAnimationFrame(laco);
if (location.hash === '#transcricao') abrirTranscricao();
