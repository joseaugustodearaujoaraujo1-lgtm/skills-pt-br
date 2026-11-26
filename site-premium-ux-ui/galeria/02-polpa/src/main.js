// POLPA — motion no ritmo do Sweet Tape: hero com arco e produto 3D, colagem em paralaxe, faixa curva com letreiro,
// texto que acende, seção de cor com produto girando, trilho horizontal fixado de palavras gigantes, pilha que cai no rodapé.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fino = matchMedia('(pointer: fine)').matches;
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];

// botão de som: um "ploc" curto gerado na hora (sem arquivo de áudio)
let audio = null;
const ploc = () => { if (!audio) return; const o = audio.createOscillator(), g = audio.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(520, audio.currentTime); o.frequency.exponentialRampToValueAtTime(140, audio.currentTime + .12); g.gain.setValueAtTime(.18, audio.currentTime); g.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .15); o.connect(g).connect(audio.destination); o.start(); o.stop(audio.currentTime + .16); };
$('.som')?.addEventListener('click', e => {
  const b = e.currentTarget, on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on);
  b.setAttribute('aria-label', on ? 'Desligar efeitos sonoros' : 'Ligar efeitos sonoros');
  audio = on ? (audio || new AudioContext()) : null; ploc();
});
$$('a, button').forEach(el => el.addEventListener('pointerenter', ploc));

// texto do papel kraft: divide em palavras (o texto continua no HTML, legível sem JS)
const kraft = $('.kraft-texto');
if (kraft && !reduzido) kraft.innerHTML = kraft.textContent.split(' ').map(p => `<span class="pal">${p}</span>`).join(' ');

if (!reduzido) {
  let lenis = null;
  if (fino) { lenis = new Lenis({ duration: 1.1 }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const alvo = $(a.getAttribute('href')); if (!alvo) return; e.preventDefault(); lenis ? lenis.scrollTo(alvo, { duration: 1.4 }) : alvo.scrollIntoView({ behavior: 'smooth' }); }));

  // HERO: as letras do título gigante se espalham com a rolagem (como no original)
  const letras = [];
  $$('.hero-grande .sobe').forEach(linha => { linha.innerHTML = [...linha.textContent].map(c => c === ' ' ? ' ' : '<span class="letra">' + c + '</span>').join(''); letras.push(...$$('.letra', linha)); });
  letras.forEach(l => gsap.to(l, { x: () => gsap.utils.random(-260, 260), y: () => gsap.utils.random(-220, 160), rotate: () => gsap.utils.random(-70, 70), opacity: () => (Math.random() < .35 ? 0 : 1), ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '45% top', scrub: true } }));
  // HERO: entrada (arco sobe, picolé cai girando) e, ao rolar, o picolé afunda girando
  gsap.from('.arco', { yPercent: 40, duration: 1.4, delay: .25, ease: 'expo.out' });
  gsap.from('.hero-picole', { yPercent: 45, rotate: -14, opacity: 0, duration: 1.5, delay: .45, ease: 'expo.out' });
  // HERO: ao rolar, o picolé afunda girando e o arco sobe
  const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.hero-picole', { y: () => innerHeight * .25, ease: 'none', scrollTrigger: heroST });
  gsap.to('.arco', { yPercent: -18, ease: 'none', scrollTrigger: heroST });
  gsap.to('.hero-titulo', { yPercent: -30, ease: 'none', scrollTrigger: heroST });

  // picolé 3D ao vivo (depois da entrada; sem GPU de verdade, fica o render)
  const temGPU = (() => { try { const gl = document.createElement('canvas').getContext('webgl2'); if (!gl) return false; const i = gl.getExtension('WEBGL_debug_renderer_info'); const n = i ? gl.getParameter(i.UNMASKED_RENDERER_WEBGL) : ''; gl.getExtension('WEBGL_lose_context')?.loseContext(); return !/swiftshader|llvmpipe|software/i.test(n); } catch { return false; } })();
  if (temGPU && !navigator.connection?.saveData) addEventListener('load', () => setTimeout(async () => {
    const palco = $('.hero-picole');
    const { montarPicole } = await import(/* sem bundle */ new URL('./picole.js', import.meta.url).href);
    await document.fonts.load('400 170px Anton');
    const c = document.createElement('canvas'); c.className = 'hero-canvas'; c.setAttribute('aria-hidden', 'true'); palco.append(c);
    const x = montarPicole(c, { sabor: 'morango', aoPronto: () => palco.classList.add('ao-vivo') });
    if (fino) addEventListener('pointermove', e => x.inclinar(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1), { passive: true });
    // troca de sabor ao clicar no picolé
    const sab = palco.dataset.sabores.split(','); let k = 0;
    palco.addEventListener('click', () => { x.trocar(sab[++k % sab.length]); ploc(); });
  }, 1000), { once: true });

  // COLAGEM: paralaxe por camada + texto que acende + letreiro na curva
  $$('.colagem .p').forEach(el => gsap.to(el, { yPercent: +el.dataset.v * -100, rotate: `+=${+el.dataset.v * 14}`, ease: 'none', scrollTrigger: { trigger: '.colagem', start: 'top bottom', end: 'bottom top', scrub: true } }));
  const pals = $$('.kraft-texto .pal');
  ScrollTrigger.create({ trigger: '.kraft', start: 'top 75%', end: 'bottom 35%', scrub: true, onUpdate: s => { const n = Math.round(s.progress * pals.length); pals.forEach((p, i) => p.classList.toggle('on', i < n)); } });
  gsap.fromTo('.faixa-texto', { attr: { startOffset: '0%' } }, { attr: { startOffset: $('.faixa').dataset.deslocamento }, ease: 'none', scrollTrigger: { trigger: '.faixa', start: 'top bottom', end: 'bottom top', scrub: true } });

  // A FRUTADA: título entra por letra, picolé gira com a rolagem, cartões flutuam
  gsap.from('.frutada-titulo span', { yPercent: 100, opacity: 0, duration: 1.1, ease: 'power4.out', stagger: .1, scrollTrigger: { trigger: '.frutada', start: 'top 70%', once: true } });
  gsap.fromTo('.frutada-picole', { rotate: -18, yPercent: 20 }, { rotate: 14, yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.frutada', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.chips li, .frutada-texto', { x: -40, opacity: 0, duration: .8, ease: 'power3.out', stagger: .08, scrollTrigger: { trigger: '.frutada', start: 'top 60%', once: true } });
  $$('.frutada .cartao').forEach((c, i) => gsap.to(c, { yPercent: (i % 2 ? -1 : 1) * 30, rotate: (i % 2 ? 8 : -8), ease: 'none', scrollTrigger: { trigger: '.frutada', start: 'top bottom', end: 'bottom top', scrub: true } }));

  // MOMENTOS: cabeçalho sobe; trilho horizontal fixado com palavras gigantes (só tela larga)
  gsap.from('.momentos-cab > *', { y: 50, opacity: 0, duration: 1, ease: 'power3.out', stagger: .1, scrollTrigger: { trigger: '.momentos-cab', start: 'top 75%', once: true } });
  ScrollTrigger.matchMedia({
    '(min-width: 861px)': () => {
      const trilho = $('.trilho'); const dist = () => trilho.scrollWidth - innerWidth;
      const tl = gsap.to(trilho, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.trilho-janela', pin: true, scrub: 1, start: 'top top', end: () => '+=' + dist(), invalidateOnRefresh: true } });
      $$('.voa').forEach((v, i) => gsap.to(v, { rotate: (i % 2 ? -1 : 1) * 40, yPercent: (i % 2 ? 30 : -30), ease: 'none', scrollTrigger: { trigger: v.closest('.passo'), containerAnimation: tl, start: 'left right', end: 'right left', scrub: true } }));
    },
  });

  // BORA GELAR: a caixa cresce, os picolés abrem em leque
  gsap.from('.bora-caixa', { scale: .7, rotate: -6, opacity: 0, duration: 1.1, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.bora', start: 'top 70%', once: true } });
  gsap.from('.bora-foto img', { rotate: 0, yPercent: 60, opacity: 0, duration: 1, ease: 'power3.out', stagger: .1, scrollTrigger: { trigger: '.bora', start: 'top 70%', once: true } });

  // RODAPÉ: os picolés caem e quicam na pilha
  gsap.from('.pilha img', { y: () => -innerHeight * .9, rotate: () => gsap.utils.random(-90, 90), duration: 1.3, ease: 'bounce.out', stagger: .12, scrollTrigger: { trigger: '.rodape', start: 'top 55%', once: true } });
  gsap.from('.rodape-grande', { yPercent: 40, opacity: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '.rodape', start: 'top 70%', once: true } });

  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
