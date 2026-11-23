// Estrato Dermatologia: motion com GSAP + ScrollTrigger + Lenis.
// Ideia: a rolagem desce pelas camadas da pele. Regra: tudo se revela de cima para baixo por recorte (clip-path inset do topo).
// O hero entra por CSS (não depende de JS). Aqui: régua de profundidade, corte que se abre, faixas que abrem por recorte,
// exame com linha de leitura, botão magnético (Magnet, reactbits.dev) e estados do formulário (Success check e Error state shake, transitions.dev).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fino = matchMedia('(pointer: fine)').matches;
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];

// topo: some ao descer, volta ao subir; sólido depois da primeira dobra
const topo = $('#topo'); let ultimo = scrollY;
addEventListener('scroll', () => {
  const y = scrollY;
  topo.classList.toggle('solido', y > innerHeight * .5);
  topo.classList.toggle('escondido', y > ultimo && y > innerHeight);
  ultimo = y;
}, { passive: true });

// régua de profundidade: progresso da página + nome da camada atual (funciona também com movimento reduzido)
const regua = $('.regua');
const textos = $$('[data-camada-texto]'), mm = $('[data-camada-mm]');
const camadas = $$('[data-camada]');
let atual = '';
const marcar = el => {
  if (!el || el.dataset.camada === atual) return;
  atual = el.dataset.camada;
  textos.forEach(t => { t.textContent = atual; });
  if (mm) mm.textContent = el.dataset.mm || '';
  regua.classList.toggle('escura', atual === 'Consulta');
};
camadas.forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%', onToggle: s => s.isActive && marcar(el) }));
ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => regua.style.setProperty('--p', s.progress.toFixed(4)) });

// formulário: validação com tremor no erro e confirmação com traço
const form = $('.form');
form.addEventListener('submit', e => {
  e.preventDefault();
  const nome = $('#f-nome'), tel = $('#f-tel');
  const checar = (campo, ok) => {
    const erro = $('#' + campo.id + '-erro');
    campo.setAttribute('aria-invalid', String(!ok)); erro.hidden = ok;
    if (ok) campo.removeAttribute('aria-describedby'); else campo.setAttribute('aria-describedby', erro.id);
    if (!ok && !reduzido) { campo.classList.remove('treme'); void campo.offsetWidth; campo.classList.add('treme'); }
    return ok;
  };
  const okNome = checar(nome, nome.value.trim().length >= 2);
  const okTel = checar(tel, tel.value.replace(/\D/g, '').length >= 10);
  if (!okNome) { nome.focus(); return; }
  if (!okTel) { tel.focus(); return; }
  const primeiro = nome.value.trim().split(/\s+/)[0];
  $('[data-ok-texto]').textContent = `Pedido recebido, ${primeiro}. Vamos ligar no número informado para combinar o dia.`;
  $('.form-ok').hidden = false;
  form.querySelector('button').disabled = true;
});

if (!reduzido) {
  let lenis = null;
  if (fino) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const alvo = $(a.getAttribute('href')); if (!alvo) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(alvo, { duration: 1.4, offset: -24 }); else alvo.scrollIntoView({ behavior: 'smooth' });
  }));

  // HERO: o corte se abre (vista explodida) enquanto o hero sai
  const corte = $('.corte');
  const abre = { v: 14 };
  gsap.to(abre, { v: () => (innerWidth < 861 ? 34 : 64), ease: 'none', onUpdate: () => corte.style.setProperty('--abre', abre.v.toFixed(1) + 'px'),
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 30%', scrub: true, invalidateOnRefresh: true } });

  // títulos de seção: recorte de cima para baixo
  $$('.camadas-cab h2, .consulta h2, .agendar h3').forEach(h => gsap.fromTo(h, { clipPath: 'inset(0% 0% 100% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 88%', once: true } }));

  // SEÇÃO 1: cada faixa abre de cima para baixo (assinatura: clip-path ligado à rolagem)
  $$('.faixa').forEach(f => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 92%', end: 'top 38%', scrub: .6 } });
    tl.fromTo(f, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' })
      .fromTo($$('.pilulas li', f), { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', stagger: .08, ease: 'none' }, .35);
  });

  // SEÇÃO 2: o exame percorre a imagem de cima para baixo, com a linha de leitura na borda do recorte
  const janela = $('.exame-janela'), linha = $('.exame-linha'), img = $('.exame-janela img');
  const exame = gsap.timeline({ scrollTrigger: { trigger: janela, start: 'top 85%', end: 'center 50%', scrub: .6 } });
  exame.set(linha, { opacity: 1 }, 0)
    .fromTo(img, { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.12 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, ease: 'none' }, 0)
    .fromTo(linha, { yPercent: 0, top: '0%' }, { top: '100%', ease: 'none' }, 0)
    .to(linha, { opacity: 0, duration: .08 });

  // passos: recorte em cascata
  gsap.fromTo('.passos li', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .9, ease: 'power3.out', stagger: .12,
    scrollTrigger: { trigger: '.passos', start: 'top 85%', once: true } });

  // botão magnético (só com mouse)
  if (fino) $$('.botao').forEach(b => {
    const x = gsap.quickTo(b, 'x', { duration: .4, ease: 'power3' }), y = gsap.quickTo(b, 'y', { duration: .4, ease: 'power3' });
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * .25); y((e.clientY - r.top - r.height / 2) * .3); });
    b.addEventListener('pointerleave', () => { x(0); y(0); });
  });

  // rodapé: a marca desce para o lugar
  gsap.fromTo('.rodape-marca', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: '.rodape', start: 'top 92%', once: true } });

  document.fonts.ready.then(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
}
