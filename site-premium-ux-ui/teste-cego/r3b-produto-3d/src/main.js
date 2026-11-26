// Fervo 3 — movimento do site. Ideia: "a água sobe pela Fervo, e a cafeteira se abre peça por peça no caminho dela".
// Um gatilho só para o palco (hero + por dentro): o mesmo progresso escolhe o quadro, a altura da linha d'água, o passo e a cota.
// Sem GPU (e no verificador): quadros renderizados da própria cena 3D. Com GPU (ou ?gpu=1): a cena three.js ao vivo (public/cena.js), carregada tarde.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);
const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fino = matchMedia('(pointer: fine)').matches;
const celular = () => matchMedia('(max-width: 860px)').matches;
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
const lerp = (a, b, t) => a + (b - a) * t, clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// ---------- topo fixo, menu do celular, seção ativa, botão fixo do celular ----------
const topo = $('#topo'), nav = $('#topo-nav'), menu = $('.topo-menu'), ctaFixo = $('.cta-fixo');
addEventListener('scroll', () => topo.classList.toggle('solido', scrollY > 40), { passive: true });
menu.addEventListener('click', () => { const ab = nav.classList.toggle('aberto'); menu.setAttribute('aria-expanded', ab); menu.textContent = ab ? 'Fechar' : 'Menu'; });
$$('a', nav).forEach(a => a.addEventListener('click', () => { nav.classList.remove('aberto'); menu.setAttribute('aria-expanded', 'false'); menu.textContent = 'Menu'; }));
for (const id of ['por-dentro', 'ficha']) {
  ScrollTrigger.create({ trigger: '#' + id, start: 'top 55%', end: 'bottom 45%', onToggle: s => $(`[data-secao="${id}"]`).classList.toggle('ativo', s.isActive) });
}
ScrollTrigger.create({ trigger: '#lista', start: 'top bottom', end: 'bottom top', onToggle: s => ctaFixo.classList.toggle('some', s.isActive) });

let lenis = null;
if (!reduzido && fino) {
  lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
}
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const alvo = $(a.getAttribute('href')); if (!alvo) return;
  e.preventDefault();
  if (lenis) lenis.scrollTo(alvo, { duration: 1.4, offset: alvo.id === 'lista' ? -90 : 0 }); else alvo.scrollIntoView({ behavior: reduzido ? 'auto' : 'smooth' });
}));

// ---------- o palco ----------
const palco = $('.palco'), visual = $('.palco-visual'), caixa = $('.palco-objeto');
const tela = $('.palco-quadros'), g = tela.getContext('2d');
const agua = $('.agua'), cota = $('.cota'), cotaRot = $('.cota-rotulo'), titulo = $('.hero-titulo'), arraste = $('.arraste');
const passos = $$('.passo'), PECAS = ['caldeira', 'funil', 'filtro', 'coletor'];
const aguaRot = $('.agua-rotulo'), aguaDir = $('.agua-direita');
const ROTULOS_AGUA = [['<b>nível máx.</b> 150 ml', 'até a válvula'], ['<b>água</b> 150 ml', 'abaixo da válvula'], ['<b>água</b> no café', 'sobe pelo tubo'], ['<b>café</b> passa a placa', 'o pó fica'], ['<b>café</b> pronto', 'na chaminé']];
const NOMES = { caldeira: '01 caldeira · água', funil: '02 funil · café', filtro: '03 filtro · junta', coletor: '04 coletor · chaminé' };
let dados = null, N = 48, quadros = [], conjunto = 760, ultimo = -1, vivo = null, progresso = 0;

const urlQ = i => `img/quadros/${conjunto}/${String(i).padStart(2, '0')}.webp`;
function prepararQuadros() {
  const r = caixa.getBoundingClientRect();
  conjunto = r.width * Math.min(devicePixelRatio, 2) > 520 ? 760 : 440;
  tela.width = conjunto; tela.height = Math.round(conjunto * 1.25);
  quadros = Array.from({ length: N }, (_, i) => { const im = new Image(); if (i === 0) im.src = urlQ(0); return im; });
  const resto = () => { for (let i = 1; i < N; i++) quadros[i].src = urlQ(i); };
  quadros[0].onload = () => { tela.hidden = false; palco.classList.add('pronto'); ultimo = -1; desenhar(progresso); };
  ('requestIdleCallback' in window ? requestIdleCallback : setTimeout)(resto, { timeout: 1500 });
}
const pronto = k => quadros[k]?.complete && quadros[k].naturalWidth > 0;
function maisProximo(i) { for (let r = 0; r < N; r++) { if (i - r >= 0 && pronto(i - r)) return i - r; if (i + r < N && pronto(i + r)) return i + r; } return -1; }
function desenhar(p) {
  if (vivo) return;
  const i = maisProximo(Math.round(p * (N - 1)));
  if (i < 0 || i === ultimo) return;
  ultimo = i; g.clearRect(0, 0, tela.width, tela.height); g.drawImage(quadros[i], 0, 0, tela.width, tela.height);
}
// pontos da tela no progresso p: do 3D ao vivo, ou interpolados entre os quadros renderizados
function pontosEm(p) {
  if (vivo) return vivo.pontos;
  if (!dados) return null;
  const f = p * (N - 1), a = dados[Math.floor(f)], b = dados[Math.min(N - 1, Math.ceil(f))], t = f - Math.floor(f);
  const out = { pecas: {}, agua: {} };
  for (const k in a.pecas) out.pecas[k] = a.pecas[k].map((v, j) => lerp(v, b.pecas[k][j], t));
  for (const k in a.agua) out.agua[k] = lerp(a.agua[k], b.agua[k], t);
  return out;
}

// posição contínua nos passos (0 = caldeira … 3 = coletor), pelo centro da tela
function posPasso() {
  const meio = scrollY + innerHeight * .5;
  const c = passos.map(el => { const r = el.getBoundingClientRect(); return scrollY + r.top + r.height * .5; });
  if (meio <= c[0]) return { sp: 0, dentro: meio > c[0] - innerHeight * .5 };
  for (let k = 0; k < c.length - 1; k++) if (meio <= c[k + 1]) return { sp: k + (meio - c[k]) / (c[k + 1] - c[k]), dentro: true };
  return { sp: 3, dentro: meio < c[3] + innerHeight * .5 };
}

function atualizar(p) {
  progresso = p;
  if (vivo) vivo.aplicar(p); else desenhar(p);
  // título do hero: sobe e sai (vertical, como a água)
  const s = clamp(p / .14, 0, 1);
  titulo.style.transform = `translateY(${-s * 22}vh)`; titulo.style.opacity = String(1 - s);
  arraste.classList.toggle('on', p < .03);
  const pt = pontosEm(p); if (!pt) return;
  const r = caixa.getBoundingClientRect(), v = visual.getBoundingClientRect();
  const { sp, dentro } = posPasso();
  const k = Math.floor(sp), t = sp - k, chaves = PECAS.map(n => pt.agua[n]);
  const ny = lerp(chaves[k], chaves[Math.min(3, k + 1)], reduzido ? Math.round(t) : t);
  agua.style.transform = `translateY(${r.top - v.top + ny * r.height}px)`;
  // cota: da peça ativa até a coluna do texto do passo (lado alterna)
  const ativa = Math.round(sp), nome = PECAS[ativa], bx = pt.pecas[nome];
  const esq = !celular() && ativa % 2 === 0;
  const yC = r.top - v.top + ((bx[1] + bx[3]) / 2) * r.height;
  let x0, x1;
  if (celular()) { x0 = r.left - v.left + bx[2] * r.width + 8; x1 = v.width - 14; }
  else if (esq) { x1 = r.left - v.left + bx[0] * r.width - 10; x0 = Math.max(v.width * .26, x1 - 230); }
  else { x0 = r.left - v.left + bx[2] * r.width + 10; x1 = Math.min(v.width * .74, x0 + 230); }
  cota.classList.toggle('esq', esq || celular()); cota.classList.toggle('dir', !esq && !celular());
  if (celular()) { cota.classList.remove('esq'); cota.classList.add('dir'); }
  cota.style.left = x0 + 'px'; cota.style.width = Math.max(0, x1 - x0) + 'px'; cota.style.transform = `translateY(${yC}px)`;
  cota.classList.toggle('visivel', dentro && p > .18);
  const rotC = celular() ? nome : NOMES[nome];
  if (cotaRot.dataset.n !== rotC) { cotaRot.dataset.n = rotC; cotaRot.textContent = rotC; }
  const fase = dentro ? Math.round(sp) : -1;
  if (aguaRot.dataset.f !== String(fase)) { aguaRot.dataset.f = fase; const [e, d] = ROTULOS_AGUA[fase + 1]; aguaRot.innerHTML = e; aguaDir.textContent = d; }
  passos.forEach((el, i) => el.classList.toggle('ativo', i === ativa && dentro));
}

let gatilho = null;
function iniciarPalco() {
  prepararQuadros();
  gatilho = ScrollTrigger.create({
    trigger: palco, start: 'top top', end: 'bottom bottom',
    onUpdate: s => atualizar(s.progress), onRefresh: s => atualizar(s.progress),
  });
  addEventListener('resize', () => atualizar(progresso));
}
fetch('img/quadros/dados.json').then(r => r.json()).then(d => { dados = d.quadros; N = d.n; atualizar(progresso); }).catch(() => {});
iniciarPalco();

// ---------- 3D ao vivo: só com GPU de verdade (ou ?gpu=1), depois da entrada e com a página ociosa ----------
function temGPU() {
  if (/[?&]gpu=1/.test(location.search)) return true;
  if (/[?&]gpu=0/.test(location.search) || reduzido || navigator.connection?.saveData) return false;
  if ((navigator.deviceMemory || 8) < 4 || (navigator.hardwareConcurrency || 8) < 4) return false;
  try {
    const c = document.createElement('canvas').getContext('webgl2'); if (!c) return false;
    const ext = c.getExtension('WEBGL_debug_renderer_info');
    const nome = ext ? c.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '';
    c.getExtension('WEBGL_lose_context')?.loseContext();
    return !/swiftshader|llvmpipe|software|basic render/i.test(nome);
  } catch { return false; }
}
async function ligarVivo() {
  try {
    const url = './cena.js?v=5';
    const mod = await import(/* @vite-ignore */ url);
    const c = document.createElement('canvas'); c.className = 'vivo'; c.setAttribute('aria-hidden', 'true');
    caixa.appendChild(c);
    const r = caixa.getBoundingClientRect();
    vivo = await mod.ligar(c, { largura: Math.round(r.width), altura: Math.round(r.height), dpr: Math.min(devicePixelRatio, 1.5) });
    tela.hidden = true; palco.classList.add('pronto', 'vivo');
    vivo.aplicar(progresso); atualizar(progresso);
    addEventListener('resize', () => { const q = caixa.getBoundingClientRect(); vivo.redimensionar(Math.round(q.width), Math.round(q.height)); vivo.aplicar(progresso); });
  } catch (e) { vivo = null; tela.hidden = false; }
}
if (temGPU()) {
  const ocioso = () => ('requestIdleCallback' in window ? requestIdleCallback(ligarVivo, { timeout: 3000 }) : setTimeout(ligarVivo, 200));
  setTimeout(ocioso, 2600);
}

// ---------- seções: títulos, números, ficha e cotas (sempre na vertical) ----------
if (!reduzido) {
  const quandoPerto = (el, fn, margem) => new IntersectionObserver((es, obs) => { if (es[0].isIntersecting) { obs.disconnect(); fn(el); } }, { rootMargin: margem }).observe(el);
  $$('.dentro-cab h2, .ficha-texto h2, .lista h3').forEach(h => quandoPerto(h, el => {
    const s = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'linha-js' });
    gsap.from(s.lines, { yPercent: 108, duration: 1.1, ease: 'power4.out', stagger: .1 });
  }, '0px 0px -12% 0px'));
  // medidas dos passos contam ao entrar (Count Up, reactbits.dev, reescrito em GSAP)
  $$('.passo-medida').forEach(el => {
    const txt = el.firstChild, fim = parseFloat(txt.textContent.replace(',', '.')), dec = txt.textContent.includes(',') ? 1 : 0, o = { v: 0 };
    gsap.to(o, { v: fim, duration: .9, ease: 'power3.out', onUpdate: () => { txt.textContent = o.v.toFixed(dec).replace('.', ','); }, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });
  gsap.from('.passo h3, .passo-corpo > p:last-child', { yPercent: 40, opacity: 0, duration: 1, ease: 'power3.out', stagger: .06, scrollTrigger: { trigger: '.passos', start: 'top 70%', once: true } });
  // ficha: as linhas sobem para o lugar, uma a uma; as cotas se desenham (vertical de baixo para cima)
  gsap.from('.specs div', { y: 26, opacity: 0, duration: .9, ease: 'power3.out', stagger: .07, scrollTrigger: { trigger: '.specs', start: 'top 82%', once: true } });
  gsap.from('.cota-v-linha', { scaleY: 0, duration: 1.4, ease: 'power3.inOut', scrollTrigger: { trigger: '.ficha-figura', start: 'top 70%', once: true } });
  gsap.from('.cota-h-linha', { scaleX: 0, duration: 1.2, ease: 'power3.inOut', delay: .3, scrollTrigger: { trigger: '.ficha-figura', start: 'top 70%', once: true } });
  gsap.from('.ficha-img', { yPercent: 6, opacity: 0, duration: 1.3, ease: 'power3.out', scrollTrigger: { trigger: '.ficha-figura', start: 'top 80%', once: true } });
  gsap.from('.rodape-marca', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'power4.out', scrollTrigger: { trigger: '.rodape', start: 'top 92%', once: true } });
  // botão magnético (Magnet, reactbits.dev) só com mouse; deslocamento pequeno
  if (fino) $$('.botao').forEach(b => {
    const x = gsap.quickTo(b, 'x', { duration: .4, ease: 'power3' }), y = gsap.quickTo(b, 'y', { duration: .4, ease: 'power3' });
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * .18); y((e.clientY - r.top - r.height / 2) * .3); });
    b.addEventListener('pointerleave', () => { x(0); y(0); });
  });
}

// ---------- cotas da ficha alinhadas ao desenho (dados do render de perfil) ----------
fetch('img/perfil.json').then(r => r.json()).then(d => {
  const ps = Object.values(d.pecas), topoY = Math.min(...ps.map(b => b[1])), baseY = Math.max(...ps.map(b => b[3]));
  const esq = Math.min(...ps.map(b => b[0])), dir = Math.max(...ps.map(b => b[2]));
  const fig = $('.ficha-desenho');
  fig.style.setProperty('--cv-top', (topoY * 100).toFixed(2) + '%'); fig.style.setProperty('--cv-bot', ((1 - baseY) * 100).toFixed(2) + '%');
  fig.style.setProperty('--cv-dir', ((1 - Math.min(1, dir)) * 100).toFixed(2) + '%');
  fig.style.setProperty('--ch-esq', (Math.max(0, esq) * 100).toFixed(2) + '%'); fig.style.setProperty('--ch-dir', ((1 - Math.min(1, dir)) * 100).toFixed(2) + '%');
}).catch(() => {});

// ---------- lista: validação com tremor (Error state shake) e confirmação com traço (Success check), de transitions.dev ----------
const form = $('#lista'), email = $('#email'), erro = $('#email-erro'), ok = $('.lista-ok');
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!email.value.trim() || !email.checkValidity()) {
    erro.textContent = 'Confira o e-mail: falta algo antes ou depois do @.'; email.setAttribute('aria-invalid', 'true');
    form.classList.remove('tremer'); void form.offsetWidth; form.classList.add('tremer'); email.focus(); return;
  }
  erro.textContent = ''; email.removeAttribute('aria-invalid');
  form.classList.add('enviado'); $('.botao-texto', form).textContent = 'Anotado';
  ok.textContent = 'Anotado. Este é um protótipo: nenhum dado foi enviado.';
});
email.addEventListener('input', () => { if (email.getAttribute('aria-invalid')) { erro.textContent = ''; email.removeAttribute('aria-invalid'); } });

document.fonts.ready.then(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
