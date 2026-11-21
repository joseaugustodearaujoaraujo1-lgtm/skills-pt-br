// Projeto-base da skill site-nivel-awwwards: motion com GSAP.
// O hero NÃO depende de JS (entra por CSS). Aqui: Lenis só com mouse, manifesto que acende, trilho horizontal fixado,
// números, botão magnético e rodapé. Lições de desempenho: dividir texto só quando a seção se aproxima; sem laço de JS no toque.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);
const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fino = matchMedia('(pointer: fine)').matches;
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];

// menu: some ao descer, volta ao subir; sólido depois da primeira dobra (vale também sem animação)
const topo = $('#topo'); let ultimo = scrollY;
addEventListener('scroll', () => {
  const y = scrollY;
  topo.classList.toggle('solido', y > innerHeight * .5);
  topo.classList.toggle('escondido', y > ultimo && y > innerHeight);
  ultimo = y;
}, { passive: true });

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
    if (lenis) lenis.scrollTo(alvo, { duration: 1.4 }); else alvo.scrollIntoView({ behavior: 'smooth' });
  }));

  // hero: a mídia afunda e gira de leve ao sair
  gsap.to('.hero-midia', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // divisão de texto só quando a seção se aproxima
  const quandoPerto = (el, fn, margem) => new IntersectionObserver((es, obs) => { if (es[0].isIntersecting) { obs.disconnect(); fn(el); } }, { rootMargin: margem }).observe(el);

  // manifesto: opacidade mínima .5 (texto grande precisa de 3:1 de contraste)
  quandoPerto($('.manifesto-texto'), el => {
    const m = SplitText.create(el, { type: 'words', wordsClass: 'palavra', aria: 'none' });
    gsap.fromTo(m.words, { opacity: .5 }, { opacity: 1, stagger: .05, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
    ScrollTrigger.refresh();
  }, '100% 0px 100% 0px');

  // títulos de seção sobem por linha quando entram
  $$('.colecao-cab h2, .escura h2, .passos h2, .contato h2').forEach(h => quandoPerto(h, el => {
    const s = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'linha-js', aria: 'none' });
    gsap.from(s.lines, { yPercent: 105, duration: 1.1, ease: 'power4.out', stagger: .1 });
  }, '0px 0px -12% 0px'));

  // coleção: trilho horizontal fixado (tela larga); no celular é carrossel nativo
  ScrollTrigger.matchMedia({
    '(min-width: 861px)': () => {
      const trilho = $('.trilho'); const dist = () => trilho.scrollWidth - innerWidth;
      gsap.to(trilho, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.colecao', pin: true, scrub: 1, start: 'top top', end: () => '+=' + dist(), invalidateOnRefresh: true } });
    },
  });
  gsap.from('.item', { opacity: 0, y: 50, duration: 1, ease: 'power3.out', stagger: .08, scrollTrigger: { trigger: '.trilho', start: 'top 85%', once: true } });

  // números (valor final já no HTML para quem não roda JS)
  $$('.num').forEach(el => {
    const fim = +el.dataset.n, suf = el.dataset.suf || '', o = { v: 0 };
    gsap.to(o, { v: fim, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('pt-BR') + suf; }, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  // passos sobem um a um
  gsap.utils.toArray('.passos-lista li').forEach(li => gsap.from(li, { opacity: 0, y: 30, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: li, start: 'top 88%', once: true } }));

  // botão magnético (só com mouse)
  if (fino) $$('.botao').forEach(b => {
    const x = gsap.quickTo(b, 'x', { duration: .4, ease: 'power3' }), y = gsap.quickTo(b, 'y', { duration: .4, ease: 'power3' });
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * .25); y((e.clientY - r.top - r.height / 2) * .3); });
    b.addEventListener('pointerleave', () => { x(0); y(0); });
  });

  // XÍCARA 3D (gesto de assinatura): pôster da própria cena no carregamento, WebGL só depois da entrada e se houver GPU
  const palco = $('.hero-midia');
  // sem GPU = sem 3D: renderizador por software (SwiftShader, llvmpipe) trava a thread principal; fica o pôster
  const temWebGL = (() => {
    try {
      const gl = document.createElement('canvas').getContext('webgl2'); if (!gl) return false;
      const info = gl.getExtension('WEBGL_debug_renderer_info');
      const nome = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return !/swiftshader|llvmpipe|software|basic render/i.test(nome || '');
    } catch { return false; }
  })();
  const fraco = (navigator.hardwareConcurrency || 4) <= 2 || navigator.connection?.saveData;
  if (palco && temWebGL && !fraco) {
    let prog = 0;
    ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', onUpdate: s => { prog = s.progress; } });
    const iniciar = async () => {
      const { montarXicara } = await import(/* sem bundle */ new URL('./xicara.js', import.meta.url).href);
      const canvas = document.createElement('canvas');
      canvas.className = 'hero-canvas'; canvas.setAttribute('aria-hidden', 'true');
      palco.append(canvas);
      const x = montarXicara(canvas, { progresso: () => prog, aoPronto: () => palco.classList.add('ao-vivo') });
      if (fino) addEventListener('pointermove', e => x.inclinar(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1), { passive: true });
      else {
        // celular: inclina com o giroscópio (iOS pede permissão num toque)
        const giro = e => { if (e.gamma != null) x.inclinar(e.gamma / 30, (e.beta - 45) / 40); };
        const ouvir = () => addEventListener('deviceorientation', giro, { passive: true });
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
          palco.addEventListener('click', () => DeviceOrientationEvent.requestPermission().then(r => r === 'granted' && ouvir()).catch(() => {}), { once: true });
        } else ouvir();
      }
    };
    const depoisDaEntrada = () => (window.requestIdleCallback || setTimeout)(iniciar, { timeout: 1500 });
    if (document.readyState === 'complete') setTimeout(depoisDaEntrada, 900); else addEventListener('load', () => setTimeout(depoisDaEntrada, 900), { once: true });
  }

  gsap.from('.rodape-marca', { yPercent: 45, opacity: 0, duration: 1.4, ease: 'power4.out', scrollTrigger: { trigger: '.rodape', start: 'top 90%', once: true } });
  document.fonts.ready.then(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
}
