// Meio-tom em linhas verticais (reescrito a partir da BRUMA, `cena/preparar.py` → função meiotom, versão em canvas para rodar no navegador).
// A imagem vira colunas de largura variável: cada célula de cw×rh px (BRUMA: 8×6) vira uma barra vertical centrada,
// de largura proporcional à "tinta" (escuro = barra larga). O resultado é uma máscara alfa (PNG), usada em CSS por `mask`.
// Uso: await meioTom('img/lua.webp', { largura: 1200, inverter: true, gama: 1.6, corte: .96, piso: .12 }) → dataURL.
//      iniciarMeioTom(document) → procura `.mt[data-mt-src]` e define --mt e --mt-proporcao.
const cache = new Map();

export function carregar(src) {
  if (!cache.has(src)) cache.set(src, new Promise((ok, erro) => { const im = new Image(); im.decoding = 'async'; im.onload = () => ok(im); im.onerror = erro; im.src = src; }));
  return cache.get(src);
}

export async function meioTom(src, { largura = 1200, altura = null, cw = 8, rh = 6, gama = 1.15, corte = .9, inverter = false, contraste = 1, piso = 0 } = {}) {
  const im = await carregar(src), L = largura, H = altura || Math.round(im.naturalHeight * L / im.naturalWidth);
  const c = document.createElement('canvas'); c.width = L; c.height = H; const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(im, 0, 0, L, H);
  const px = g.getImageData(0, 0, L, H).data, lum = new Float32Array(L * H), hist = new Uint32Array(256);
  for (let i = 0; i < L * H; i++) { const v = Math.round(.299 * px[i * 4] + .587 * px[i * 4 + 1] + .114 * px[i * 4 + 2]); lum[i] = v; hist[v]++; }
  // autocontraste com corte de 1% nas pontas (igual ao ImageOps.autocontrast(cutoff=1) do Python)
  let lo = 0, hi = 255, acc = 0; for (; lo < 255 && acc + hist[lo] <= L * H * .01; lo++) acc += hist[lo];
  acc = 0; for (; hi > 0 && acc + hist[hi] <= L * H * .01; hi--) acc += hist[hi];
  const esc = hi > lo ? 255 / (hi - lo) : 1;
  const nc = Math.floor(L / cw), nr = Math.floor(H / rh);
  const saida = document.createElement('canvas'); saida.width = L; saida.height = H; const s = saida.getContext('2d');
  s.fillStyle = '#000';
  for (let i = 0; i < nr; i++) for (let j = 0; j < nc; j++) {
    let soma = 0;
    for (let y = 0; y < rh; y++) for (let x = 0; x < cw; x++) {
      let a = Math.min(1, Math.max(0, (lum[(i * rh + y) * L + j * cw + x] - lo) * esc / 255));
      if (inverter) a = 1 - a;
      soma += Math.min(1, Math.max(0, (a - .5) * contraste + .5));
    }
    const b = soma / (cw * rh);
    let d = Math.pow(Math.min(1, Math.max(0, 1 - b)), gama);
    if (b > corte || d < piso) d = 0;                       // corte: claro demais não recebe tinta; piso: some o pontilhado fraco
    const k = Math.round(d * cw);
    if (k) s.fillRect(j * cw + Math.floor((cw - k) / 2), i * rh, k, rh);
  }
  return { url: saida.toDataURL('image/png'), proporcao: L / H };
}

// Barras verticais de comprimento aleatório: passagem "digital" entre foto e cor chapada (BRUMA, mt-dissolve-*.webp). Semente fixa = resultado repetível.
export function dissolver({ largura = 1440, altura = 480, cw = 8, deCima = true, semente = 3 } = {}) {
  let r = semente * 2654435761 >>> 0; const rnd = () => ((r = (r * 1664525 + 1013904223) >>> 0) / 4294967296);
  const c = document.createElement('canvas'); c.width = largura; c.height = altura; const g = c.getContext('2d'); g.fillStyle = '#000';
  for (let j = 0; j < largura; j += cw) {
    const L = Math.round(altura * Math.pow(.15 + .85 * rnd(), 1.6)), k = 2 + Math.floor(rnd() * (cw - 2));
    g.fillRect(j, deCima ? 0 : altura - L, k, L);
  }
  g.fillRect(0, deCima ? 0 : altura * .92, largura, altura * .08);   // base cheia do lado de onde vem a cor
  return c.toDataURL('image/png');
}

export async function iniciarMeioTom(raiz = document) {
  await Promise.all([...raiz.querySelectorAll('.mt[data-mt-src]')].map(async el => {
    const d = el.dataset, o = { largura: +d.mtLargura || 1200, gama: +d.mtGama || 1.15, corte: d.mtCorte ? +d.mtCorte : .9, piso: +d.mtPiso || 0, inverter: 'mtInverter' in d, contraste: +d.mtContraste || 1 };
    try { const { url, proporcao } = await meioTom(d.mtSrc, o); el.style.setProperty('--mt', `url(${url})`); el.style.setProperty('--mt-proporcao', proporcao); el.classList.add('pronto'); } catch { /* sem máscara: o bloco fica vazio, a página segue */ }
  }));
}
