// Café Serra: o nível do café sobe (xícara do hero, régua, linha d'água, momento "devagar", goles).
import gsap from 'gsap';

export function iniciarNivel() {
  const $ = s => document.querySelector(s);
  gsap.fromTo('.xicara', { '--nivel': .5 }, { '--nivel': 1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 35%', scrub: true } });
  const regua = $('.regua');
  const prog = () => regua.style.setProperty('--p', Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)).toFixed(4));
  addEventListener('scroll', prog, { passive: true }); prog();
  gsap.from('.agua', { '--n': 0, duration: 1.6, ease: 'power3.out', stagger: .12, scrollTrigger: { trigger: '.colecao', start: 'top 55%', once: true } });
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.nivel', start: 'top top', end: () => '+=' + Math.round(innerHeight * 3), scrub: true } });
  tl.fromTo('.nivel-cafe', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(50% 0 0 0)', duration: 3 })
    .to('.nivel-cafe', { clipPath: 'inset(50% 0 0 0)', duration: 4 })
    .to('.nivel-cafe', { clipPath: 'inset(0% 0 0 0)', duration: 3 });
}
