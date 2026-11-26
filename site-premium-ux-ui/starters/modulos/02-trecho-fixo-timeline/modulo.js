// Trecho fixo com timeline GSAP presa à rolagem (reescrito a partir do hero da BRUMA, `src/main.js`, seção "1. HERO").
// A foto aproxima até `data-aproxima-ate` (fração da rolagem); depois o palco encolhe num cartão de `data-cartao-px` (px num layout de 1440).
// Para outra cena, use `trechoFixo(secao, (tl, secao) => { tl.to(...) })` e monte a sua timeline (posições 0..1).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function cenaCartao(tl, secao, largo) {
  const d = secao.dataset, fim = +d.aproximaAte || .55;
  tl.to('.trecho-foto', { scale: 1.32, xPercent: -5, yPercent: 3, duration: fim }, 0)             // 1) aproxima
    .to('.trecho-texto h2', { opacity: 0, y: -60, duration: .12 }, .02)                             // 2) título sai logo no início
    .to('.trecho-cartao', { scale: largo ? (+d.cartaoPx || 433) / 1440 : (+d.cartaoCelular || .6), duration: +d.cartaoDuracao || .39, ease: 'power2.in' }, fim)  // 3) encolhe
    .to('.trecho-base', { opacity: 1, duration: .3 }, fim);                                         // 4) legenda entra
}

export function trechoFixo(secao, montar = cenaCartao) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return null;   // CSS já mostra a cena final, sem altura extra
  const largo = matchMedia('(min-width: 861px)').matches;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },                          // scrub precisa de ease linear; o ease "de verdade" vai em cada tween
    scrollTrigger: { trigger: secao, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
  });
  montar(tl, secao, largo);
  return tl;
}
