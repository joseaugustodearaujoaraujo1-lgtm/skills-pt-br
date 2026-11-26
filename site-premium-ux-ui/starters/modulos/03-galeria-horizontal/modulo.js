// Galeria horizontal (reescrita a partir da POLPA, trilho fixado dos "momentos", e do arraste das notícias da BRUMA).
// Desktop (≥861px): ScrollTrigger com pin; distância = largura do trilho − largura da janela; scrub: 1 (1 s de "arrasto" suave).
// Celular e reduced-motion: nada de pin; vale o overflow-x nativo com scroll-snap (CSS).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function galeriaHorizontal(secao, { suavizar = 1, voa = true } = {}) {
  const janela = secao.querySelector('.galeria-h-janela'), trilho = secao.querySelector('.galeria-h-trilho');
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduzido) return null;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', () => {
    const dist = () => Math.max(0, trilho.scrollWidth - innerWidth);
    const tl = gsap.to(trilho, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: janela, pin: true, scrub: suavizar, start: 'top top', end: () => '+=' + dist(), invalidateOnRefresh: true },  // invalidateOnRefresh: recalcula ao redimensionar/carregar imagens
    });
    if (voa) trilho.querySelectorAll('.galeria-h-passo').forEach((p, i) => {          // paralaxe por passo (POLPA: palavras gigantes ±40° e ±30%; para fotos use bem menos: ±12° e ±8%)
      gsap.to(p.querySelector('figure'), { rotate: (i % 2 ? -1 : 1) * 12, yPercent: (i % 2 ? 1 : -1) * 8, ease: 'none',
        scrollTrigger: { trigger: p, containerAnimation: tl, start: 'left right', end: 'right left', scrub: true } });
    });
  });
  return mm;
}
