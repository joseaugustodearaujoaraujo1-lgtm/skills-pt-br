// Cursor customizado (reescrito a partir do rótulo "arraste" da BRUMA, `src/main.js`, e do cursor da TAINÁ).
// Ponto: segue o mouse na hora. Anel: segue com atraso (quickTo, duration .3 — o mesmo da etiqueta de arraste da BRUMA).
// Só liga com ponteiro fino e sem prefers-reduced-motion. Estados por data-cursor="<texto>" ou "ocultar"; links e botões crescem o anel.
import gsap from 'gsap';

export function iniciarCursor({ atraso = .3, seletorLink = 'a, button, [role="button"], summary, label, input, select, textarea' } = {}) {
  if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  let el = document.querySelector('.cursor');
  if (!el) { el = document.createElement('div'); el.className = 'cursor'; el.setAttribute('aria-hidden', 'true'); el.innerHTML = '<span class="cursor-ponto"></span><span class="cursor-anel"><span class="cursor-rotulo"></span></span>'; document.body.append(el); }
  const ponto = el.querySelector('.cursor-ponto'), anel = el.querySelector('.cursor-anel'), rotulo = el.querySelector('.cursor-rotulo');
  document.documentElement.classList.add('tem-cursor');

  const px = gsap.quickTo(ponto, 'x', { duration: .05 }), py = gsap.quickTo(ponto, 'y', { duration: .05 });   // quickTo reutiliza o tween: sem criar objeto a cada movimento
  const ax = gsap.quickTo(anel, 'x', { duration: atraso, ease: 'power3.out' }), ay = gsap.quickTo(anel, 'y', { duration: atraso, ease: 'power3.out' });

  let primeiro = true;
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    if (primeiro) { gsap.set([ponto, anel], { x: e.clientX, y: e.clientY }); primeiro = false; }   // evita o anel "voar" do canto na primeira vez
    px(e.clientX); py(e.clientY); ax(e.clientX); ay(e.clientY);
    el.classList.add('visivel');
    const alvo = e.target.closest?.('[data-cursor]'), texto = alvo?.dataset.cursor;
    el.classList.toggle('escondido', texto === 'ocultar');
    el.classList.toggle('com-rotulo', !!texto && texto !== 'ocultar');
    if (texto && texto !== 'ocultar') rotulo.textContent = texto;
    el.classList.toggle('sobre-link', !texto && !!e.target.closest?.(seletorLink));
  }, { passive: true });
  document.addEventListener('pointerleave', () => el.classList.remove('visivel'));
  document.addEventListener('pointerdown', () => el.classList.add('clicando'));
  addEventListener('pointerup', () => el.classList.remove('clicando'));
  return el;
}
