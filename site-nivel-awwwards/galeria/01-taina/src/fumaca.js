// Fumaça meio líquida que sai do cursor (efeito do hero do site do Lando Norris), em canvas 2D leve:
// cada movimento solta "baforadas" que herdam a velocidade do gesto, ondulam, crescem e somem.
// O canvas é desenhado em meia resolução e recebe desfoque + contraste no CSS, o que dá o aspecto líquido.
// Só anima enquanto há fumaça na tela e o hero está visível; não roda com movimento reduzido.
export function montarFumaca(canvas, { area = canvas.parentElement, cor = [15, 43, 43] } = {}) {
  const g = canvas.getContext('2d');
  const ESCALA = .5, MAX = 140;
  let w = 0, h = 0, rodando = false, visivel = true, ultimo = null;
  const pts = [];
  const tamanho = () => { w = canvas.width = Math.round(area.clientWidth * ESCALA); h = canvas.height = Math.round(area.clientHeight * ESCALA); };
  tamanho(); new ResizeObserver(tamanho).observe(area);

  // sprite macio (gradiente radial) reaproveitado em todas as baforadas
  const sprite = document.createElement('canvas'); sprite.width = sprite.height = 128;
  const sg = sprite.getContext('2d'); const rg = sg.createRadialGradient(64, 64, 0, 64, 64, 64);
  const [r, gg, b] = cor;
  rg.addColorStop(0, `rgba(${r},${gg},${b},.9)`); rg.addColorStop(.5, `rgba(${r},${gg},${b},.45)`); rg.addColorStop(1, `rgba(${r},${gg},${b},0)`);
  sg.fillStyle = rg; sg.fillRect(0, 0, 128, 128);

  const emitir = (x, y, vx, vy) => {
    const vel = Math.min(Math.hypot(vx, vy), 60);
    const n = 1 + Math.min(3, vel / 14 | 0);
    for (let i = 0; i < n; i++) {
      if (pts.length >= MAX) pts.shift();
      pts.push({ x: x + (Math.random() - .5) * 6, y: y + (Math.random() - .5) * 6, vx: vx * .08 + (Math.random() - .5) * .6, vy: vy * .08 + (Math.random() - .5) * .6 - .25,
        r: 6 + Math.random() * 5 + vel * .14, vida: 0, dur: 60 + Math.random() * 30, fase: Math.random() * 6.28 });
    }
    ligar();
  };

  const quadro = () => {
    if (!visivel || !pts.length) { rodando = false; g.clearRect(0, 0, w, h); return; }
    g.clearRect(0, 0, w, h);
    for (let i = pts.length - 1; i >= 0; i--) {
      const p = pts[i]; p.vida++;
      const t = p.vida / p.dur; if (t >= 1) { pts.splice(i, 1); continue; }
      // ondulação lenta (dá o "líquido") + subida suave
      p.vx += Math.sin(p.fase + p.vida * .07) * .05; p.vy += Math.cos(p.fase + p.vida * .05) * .04 - .012;
      p.vx *= .965; p.vy *= .965; p.x += p.vx; p.y += p.vy; p.r += .32;
      g.globalAlpha = Math.sin(Math.PI * Math.min(1, t * 1.6)) * (1 - t) * 1.1;
      const d = p.r * 2; g.drawImage(sprite, p.x - p.r, p.y - p.r, d, d);
    }
    g.globalAlpha = 1;
    requestAnimationFrame(quadro);
  };
  const ligar = () => { if (!rodando && visivel) { rodando = true; requestAnimationFrame(quadro); } };

  area.addEventListener('pointermove', e => {
    const box = area.getBoundingClientRect();
    const x = (e.clientX - box.left) * ESCALA, y = (e.clientY - box.top) * ESCALA;
    if (ultimo) emitir(x, y, (x - ultimo.x) / ESCALA, (y - ultimo.y) / ESCALA);
    ultimo = { x, y };
  }, { passive: true });
  area.addEventListener('pointerleave', () => { ultimo = null; });
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; if (visivel && pts.length) ligar(); }).observe(area);
}
