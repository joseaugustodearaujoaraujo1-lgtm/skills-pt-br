// Página de render offline: desenha a gema em ângulos pedidos e devolve PNG/WebP (molde, pôsteres e quadros de reserva).
import { criarGema, planosDiamante } from '../src/gema.js';
window.planosDiamante = planosDiamante;
window.renderizar = async (lista, tam = 600, formato = 'image/png', qual = 0.9) => {
  const c = document.createElement('canvas'); c.style.width = tam + 'px'; c.style.height = tam + 'px';
  document.body.appendChild(c);
  const g = await criarGema(c, { forcar: true, preservar: true });
  const saida = [];
  for (const v of lista) {
    Object.assign(g.estado, v); g.desenhar(v.q || 8, 1);
    saida.push(c.toDataURL(formato, qual));
  }
  return saida;
};
import { poseEm, QUADROS } from '../src/pose.js';
window.poseEm = poseEm; window.QUADROS = QUADROS;
