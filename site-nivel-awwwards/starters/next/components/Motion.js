'use client';
// Movimento do site (GSAP). Carrega as bibliotecas só no cliente, depois da hidratação; desfaz tudo ao desmontar.
// Mesmas lições do projeto HTML: hero em CSS (não depende deste arquivo), Lenis só com mouse, texto dividido só quando a seção se aproxima.
import { useEffect } from 'react';

export default function Motion() {
  useEffect(() => {
    let limpar = () => {};
    let cancelado = false;
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { SplitText }, { default: Lenis }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText'), import('lenis')]);
      if (cancelado) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);
      const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
      const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches, fino = matchMedia('(pointer: fine)').matches;
      // direção de entrada: data-entrada no elemento (ou no ancestral mais próximo, ou no <html>); o hero em CSS lê o mesmo atributo
      const DIRECOES = { sobe: [0, 1], desce: [0, -1], 'da-esquerda': [-1, 0], 'da-direita': [1, 0], opacidade: [0, 0] };
      const de = (el, dist, emPct) => { // valores para gsap.from; null = sem entrada
        const nome = (el && el.closest('[data-entrada]') || document.documentElement).dataset.entrada || 'sobe';
        if (nome === 'nenhuma') return null;
        const [dx, dy] = DIRECOES[nome] || DIRECOES.sobe;
        return emPct ? { xPercent: dx * dist, yPercent: dy * dist, ...(dx || dy ? {} : { opacity: 0 }) } : { x: dx * dist, y: dy * dist, opacity: 0 };
      };
      const topo = $('#topo'); let ultimo = scrollY;
      const aoRolar = () => { const y = scrollY; topo.classList.toggle('solido', y > innerHeight * .5); topo.classList.toggle('compacto', y > innerHeight); /* nunca esconder: teste cego, rodadas 1 e 4 */ ultimo = y; };
      addEventListener('scroll', aoRolar, { passive: true });
      const observadores = []; let lenis = null, tick = null;
      const ctx = gsap.context(() => {
        if (reduzido) return;
        if (fino) {
          lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
          lenis.on('scroll', ScrollTrigger.update); tick = t => lenis.raf(t * 1000); gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
        }
        $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const alvo = $(a.getAttribute('href')); if (!alvo) return; e.preventDefault(); lenis ? lenis.scrollTo(alvo, { duration: 1.4 }) : alvo.scrollIntoView({ behavior: 'smooth' }); }));
        gsap.to('.hero-midia', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
        const quandoPerto = (el, fn, margem) => { const o = new IntersectionObserver((es) => { if (es[0].isIntersecting) { o.disconnect(); fn(el); } }, { rootMargin: margem }); o.observe(el); observadores.push(o); };
        quandoPerto($('.manifesto-texto'), el => {
          const m = SplitText.create(el, { type: 'words', wordsClass: 'palavra', aria: 'none' });
          gsap.fromTo(m.words, { opacity: .5 }, { opacity: 1, stagger: .05, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
          ScrollTrigger.refresh();
        }, '100% 0px 100% 0px');
        $$('.colecao-cab h2, .escura h2, .passos h2, .contato h2').forEach(h => quandoPerto(h, el => {
          const s = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'linha-js', aria: 'none' });
          const v = de(el, 105, true); if (v) gsap.from(s.lines, { ...v, duration: 1.1, ease: 'power4.out', stagger: .1 });
        }, '0px 0px -12% 0px'));
        ScrollTrigger.matchMedia({ '(min-width: 861px)': () => {
          const trilho = $('.trilho'); const dist = () => trilho.scrollWidth - innerWidth;
          gsap.to(trilho, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.colecao', pin: true, scrub: 1, start: 'top top', end: () => '+=' + dist(), invalidateOnRefresh: true } });
        } });
        const vItem = de($('.item'), 50); if (vItem) gsap.from('.item', { ...vItem, duration: 1, ease: 'power3.out', stagger: .08, scrollTrigger: { trigger: '.trilho', start: 'top 85%', once: true } });
        $$('.num').forEach(el => { const fim = +el.dataset.n, suf = el.dataset.suf || '', o = { v: 0 }; gsap.to(o, { v: fim, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('pt-BR') + suf; }, scrollTrigger: { trigger: el, start: 'top 88%', once: true } }); });
        gsap.utils.toArray('.passos-lista li').forEach(li => { const v = de(li, 30); if (v) gsap.from(li, { ...v, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: li, start: 'top 88%', once: true } }); });
        if (fino) $$('.botao').forEach(b => { const x = gsap.quickTo(b, 'x', { duration: .4, ease: 'power3' }), y = gsap.quickTo(b, 'y', { duration: .4, ease: 'power3' });
          b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * .25); y((e.clientY - r.top - r.height / 2) * .3); });
          b.addEventListener('pointerleave', () => { x(0); y(0); }); });
        const vMarca = de($('.rodape-marca'), 45, true); if (vMarca) gsap.from('.rodape-marca', { ...vMarca, opacity: 0, duration: 1.4, ease: 'power4.out', scrollTrigger: { trigger: '.rodape', start: 'top 90%', once: true } });
        document.fonts.ready.then(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
      });
      limpar = () => { removeEventListener('scroll', aoRolar); observadores.forEach(o => o.disconnect()); if (tick) gsap.ticker.remove(tick); lenis?.destroy(); ctx.revert(); };
    })();
    return () => { cancelado = true; limpar(); };
  }, []);
  return null;
}
