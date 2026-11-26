// Página de render (só para gerar molde, quadros e pôster; não vai para o site)
import { montar } from '../src/cena.js';
const c = document.querySelector('canvas');
let m = null;
window.fervo = {
  iniciar(w, h) { if (!m) m = montar(c, { largura: w, altura: h, preservar: true }); else m.redimensionar(w, h); return true; },
  quadro(p, tipo = 'image/webp', q = .8) { m.normal(); m.aplicar(p); m.render(); return { url: c.toDataURL(tipo, q), dados: m.pontos(), info: { ...m.info() } }; },
  vista(nome, tipo = 'image/png', q = 1) { m.vista(nome); m.render(); const r = c.toDataURL(tipo, q); m.normal(); return r; },
  vistaComPontos(nome, tipo = 'image/webp', q = .85) { m.vista(nome); m.render(); const d = m.pontos(); const r = c.toDataURL(tipo, q); m.normal(); return { url: r, dados: d }; },
};
document.title = 'pronto';
