// 3D ao vivo (só com GPU): a mesma cena dos quadros, renderizada sob demanda. Arrastar gira (com inércia); a rolagem abre a cafeteira.
import { montar } from './cena.js';
export async function ligar(canvas, { largura, altura, dpr = 1 }) {
  const m = montar(canvas, { largura, altura, dpr });
  let p = 0, sujo = true, vel = 0, arrastando = false, ultimoX = 0, visivel = true;
  const api = {
    pontos: null,
    aplicar(np) { p = np; sujo = true; },
    redimensionar(w, h) { m.redimensionar(w, h, dpr); sujo = true; },
  };
  const quadro = () => {
    if (!arrastando && Math.abs(vel) > 1e-4) { m.giroExtra += vel; vel *= .94; sujo = true; }
    if (sujo && visivel && !document.hidden) { sujo = false; m.aplicar(p); m.render(); api.pontos = m.pontos(); }
    requestAnimationFrame(quadro);
  };
  canvas.addEventListener('pointerdown', e => { e.preventDefault(); arrastando = true; ultimoX = e.clientX; vel = 0; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => { if (!arrastando) return; const dx = (e.clientX - ultimoX) / 180; ultimoX = e.clientX; m.giroExtra += dx; vel = dx; sujo = true; });
  const soltar = () => { arrastando = false; };
  canvas.addEventListener('pointerup', soltar); canvas.addEventListener('pointercancel', soltar);
  new IntersectionObserver(es => { visivel = es[0].isIntersecting; sujo = true; }).observe(canvas);
  m.aplicar(0); m.render(); api.pontos = m.pontos();
  requestAnimationFrame(quadro);
  return api;
}
