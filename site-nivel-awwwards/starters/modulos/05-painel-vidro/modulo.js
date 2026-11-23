// Painel de vidro: o CSS faz tudo; este JS só lê os data-* (mude no HTML, não no CSS) e confere o que o CSS não consegue.
//   data-desfoque="26"  → blur em px      data-tinta=".34" → opacidade da tinta      data-saturacao="1.1"
// E avisa no console (só em desenvolvimento) quando o vidro não tem nada atrás ou o contraste do texto sobre a tinta é fraco.
export function iniciarVidro(raiz = document, { avisar = true } = {}) {
  raiz.querySelectorAll('.vidro').forEach(el => {
    const d = el.dataset;
    if (d.desfoque) el.style.setProperty('--desfoque', d.desfoque + 'px');
    if (d.tinta) el.style.setProperty('--tinta', d.tinta);
    if (d.saturacao) el.style.setProperty('--saturacao', d.saturacao);
    if (!avisar) return;
    // Armadilha 1: ancestral com opacity<1, filter ou mix-blend-mode isola o fundo e o vidro vira só uma caixa translúcida.
    for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (+s.opacity < 1 || s.filter !== 'none' || s.mixBlendMode !== 'normal') { console.warn('[vidro] ancestral isola o fundo (opacity/filter/blend); o desfoque não aparece:', p); break; }
    }
  });
}
