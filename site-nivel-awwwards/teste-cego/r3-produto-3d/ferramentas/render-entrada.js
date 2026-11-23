// Página de renderização (fora do site): molde em vistas, pôsteres e quadros do plano B. Usa a MESMA cena do site.
import { criarCena } from '../src/moedor.js';
import { estadoDe } from '../src/roteiro.js';
const canvas = document.createElement('canvas'); document.body.appendChild(canvas);
const cena = criarCena(canvas, { dpr: 1, preservar: true });
window.renderizar = ({ w = 640, h = 800, t = null, e = 0, rot = 0, elev = 12, tipo = 'image/png', q = .8 }) => {
  canvas.width = w; canvas.height = h; cena.tamanho(w, h);
  cena.definir(t === null ? { e, rot, elev } : estadoDe(t)); cena.render();
  return { url: canvas.toDataURL(tipo, q), ancoras: cena.ancoras() };
};
window.info = () => { const gl = cena.renderer.getContext(); const x = gl.getExtension('WEBGL_debug_renderer_info'); return { gpu: x ? gl.getParameter(x.UNMASKED_RENDERER_WEBGL) : '?', calls: cena.renderer.info.render.calls, tri: cena.renderer.info.render.triangles }; };
window.pronto = true;
