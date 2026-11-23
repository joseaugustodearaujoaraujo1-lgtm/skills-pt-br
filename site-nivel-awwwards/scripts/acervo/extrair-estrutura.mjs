// Mede a estrutura de UX/UI da página aberta (versão 3 do estrutura.json). Use por importação (coletar.mjs) ou direto:
//   node extrair-estrutura.mjs <url> [--espera 8000]     → imprime o JSON
import { args, abrirNavegador, esperarEstabilizar, dormir } from './_comum.mjs';
import { fileURLToPath } from 'node:url';

// Roda cedo (logo após o carregamento) para flagrar o preloader.
export function medirPreloader() {
  const vw = innerWidth, vh = innerHeight; let achado = null;
  for (const el of document.querySelectorAll('body *')) {
    const s = getComputedStyle(el); if (s.position !== 'fixed' && s.position !== 'absolute') continue;
    const r = el.getBoundingClientRect(); if (r.width < vw * 0.9 || r.height < vh * 0.9) continue;
    if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity < 0.3) continue;
    const txt = (el.innerText || '').trim(); const cls = `${el.id} ${el.className}`.toLowerCase();
    const nome = /load|preload|intro|splash|curtain|cover|transition/.test(cls);
    if (nome || (txt && txt.length < 200 && +s.zIndex > 5)) { achado = { existe: true, comPorcentagem: /\b\d{1,3}\s?%/.test(txt) || /count|percent|progress/.test(cls) }; break; }
  }
  return achado || { existe: false, comPorcentagem: false };
}

// Roda depois da espera, na primeira dobra (rolagem no topo).
export function medirPagina() {
  const vw = innerWidth, vh = innerHeight, num = v => parseFloat(v) || 0;
  const vis = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 1 && r.height > 1 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05; };
  const med = a => { a = a.filter(Number.isFinite).sort((x, y) => x - y); return a.length ? a[Math.floor(a.length / 2)] : null; };
  const contar = (m, k) => { m[k] = (m[k] || 0) + 1; };
  const doc = document.documentElement, body = document.body;
  const docH = Math.max(doc.scrollHeight, body.scrollHeight);
  const maxBottom = Math.max(...[...body.children].map(e => e.getBoundingClientRect().bottom + scrollY), 0);
  const texto = body.innerText || '';
  const secs = [...document.querySelectorAll('section, [data-section], main > div, main > article')].filter(vis);
  const pagina = { alturaVh: +(docH / vh).toFixed(1), secoes: secs.length, palavras: texto.split(/\s+/).filter(Boolean).length,
    paddingVerticalMedianoPx: med(secs.map(s => (num(getComputedStyle(s).paddingTop) + num(getComputedStyle(s).paddingBottom)) / 2)),
    rolagemVirtual: docH <= vh * 1.05 && maxBottom > vh * 1.5 };

  // menu
  const cabs = [...document.querySelectorAll('header, nav, [role=banner]')].filter(e => vis(e) && e.getBoundingClientRect().top < 160 && e.getBoundingClientRect().height < 220);
  let menu = null;
  if (cabs.length) {
    const m = cabs.sort((a, b) => b.querySelectorAll('a').length - a.querySelectorAll('a').length)[0], s = getComputedStyle(m), r = m.getBoundingClientRect();
    const links = [...m.querySelectorAll('a')].filter(vis);
    let pos = s.position, p = m; while ((pos !== 'fixed' && pos !== 'sticky') && p.parentElement && p.parentElement !== body) { p = p.parentElement; pos = getComputedStyle(p).position; }
    const bg = (s.backgroundColor.match(/[\d.]+/g) || []).map(Number); const fundoAlfa = s.backgroundColor === 'transparent' ? 0 : (bg.length > 3 ? bg[3] : 1);
    menu = { links: links.length, altura: Math.round(r.height), fixo: pos === 'fixed' || pos === 'sticky', textoEmCaixaAlta: links.some(a => getComputedStyle(a).textTransform === 'uppercase' || (a.innerText.trim().length > 2 && a.innerText.trim() === a.innerText.trim().toUpperCase() && /[A-Z]/.test(a.innerText))),
      transparente: fundoAlfa < 0.1, hamburguer: [...m.querySelectorAll('button, [class*=burger], [class*=hamburger], [class*=menu-toggle], [aria-label*=enu]')].some(e => vis(e) && e.getBoundingClientRect().width < 120) && links.length < 7 };
  }

  // hero (primeira dobra)
  const naDobra = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < vh * 0.9 && vis(el); };
  const hero = { video: [...document.querySelectorAll('video')].some(v => naDobra(v) && v.getBoundingClientRect().width > vw * 0.4),
    canvas: [...document.querySelectorAll('canvas')].some(c => naDobra(c) && c.getBoundingClientRect().width > vw * 0.4 && c.getBoundingClientRect().height > vh * 0.4),
    imagemGrande: [...document.querySelectorAll('img, picture img')].some(i => naDobra(i) && i.getBoundingClientRect().width > vw * 0.5 && i.getBoundingClientRect().height > vh * 0.4)
      || [...document.querySelectorAll('section, div, header')].some(d => { const s = getComputedStyle(d), r = d.getBoundingClientRect(); return s.backgroundImage.startsWith('url') && r.width > vw * 0.8 && r.height > vh * 0.5 && naDobra(d); }),
    botoes: [...document.querySelectorAll('a, button')].filter(e => naDobra(e) && !e.closest('header, nav') && (/btn|button|cta/.test(String(e.className).toLowerCase()) || e.tagName === 'BUTTON') && e.innerText.trim()).length };

  // título
  const tit = [...document.querySelectorAll('h1, h2, [class*=title], [class*=headline], [class*=hero] p')].filter(e => naDobra(e) && e.innerText.trim().length > 1)
    .map(e => ({ e, px: num(getComputedStyle(e).fontSize) })).sort((a, b) => b.px - a.px)[0];
  let titulo = null;
  if (tit) {
    const s = getComputedStyle(tit.e), fam = s.fontFamily.toLowerCase().replace(/["']/g, ''), principal = fam.split(',')[0].trim(), px = tit.px;
    const serifa = /\b(serif)\b/.test(fam.split(',').slice(-1)[0]) && !/sans/.test(fam.split(',').slice(-1)[0]) || /georgia|times|playfair|bodoni|garamond|didot|cormorant|fraunces|dm serif|libre baskerville|lora|merriweather|newsreader|instrument serif|editorial/.test(principal);
    const ls = s.letterSpacing === 'normal' ? 0 : num(s.letterSpacing);
    titulo = { px: Math.round(px), emVw: +(px / vw * 100).toFixed(2), peso: +s.fontWeight || 400, entrelinha: s.lineHeight === 'normal' ? 1.2 : +(num(s.lineHeight) / px).toFixed(2), trackingEm: +(ls / px).toFixed(3),
      caixaAlta: s.textTransform === 'uppercase' || (tit.e.innerText.trim() === tit.e.innerText.trim().toUpperCase() && /[A-Z]{3}/.test(tit.e.innerText)), serifa, alinhamento: s.textAlign === 'start' ? 'left' : s.textAlign, palavras: tit.e.innerText.trim().split(/\s+/).length };
  }

  // corpo
  const ps = [...document.querySelectorAll('p')].filter(p => vis(p) && p.innerText.trim().length > 60);
  const corpo = { px: med(ps.map(p => num(getComputedStyle(p).fontSize))), entrelinha: med(ps.map(p => { const s = getComputedStyle(p); return s.lineHeight === 'normal' ? 1.2 : num(s.lineHeight) / num(s.fontSize); })),
    h2: med([...document.querySelectorAll('h2')].filter(vis).map(h => num(getComputedStyle(h).fontSize))), h3: med([...document.querySelectorAll('h3')].filter(vis).map(h => num(getComputedStyle(h).fontSize))) };
  if (corpo.entrelinha) corpo.entrelinha = +corpo.entrelinha.toFixed(2);

  // rolagem
  const todos = [...document.querySelectorAll('body *')].slice(0, 4000);
  const rolagem = { lenis: doc.classList.contains('lenis') || !!window.lenis, locomotive: !!document.querySelector('[data-scroll-container], .locomotive-scroll, html.has-scroll-smooth'),
    pinSpacer: document.querySelectorAll('.pin-spacer').length, sticky: todos.filter(e => getComputedStyle(e).position === 'sticky').length,
    carrossel: document.querySelectorAll('.swiper, .splide, .flickity-enabled, .embla, [class*=carousel], [class*=slider]').length,
    scrollSnap: /snap/.test(getComputedStyle(doc).scrollSnapType) || /snap/.test(getComputedStyle(body).scrollSnapType) };

  // efeitos, forma, mídia, motion
  const efeitos = { clipPath: 0, mixBlend: 0, backdropFilter: 0, filtro: 0, gradiente: 0, textoGradiente: 0, sombra: 0 };
  const duracoes = {}, curvas = {}; let anim = 0, grid = 0, pilula = 0; const raios = [];
  for (const el of todos) {
    const s = getComputedStyle(el);
    if (s.clipPath !== 'none') efeitos.clipPath++; if (s.mixBlendMode !== 'normal') efeitos.mixBlend++; if (s.backdropFilter && s.backdropFilter !== 'none') efeitos.backdropFilter++;
    if (s.filter !== 'none') efeitos.filtro++; if (/gradient/.test(s.backgroundImage)) efeitos.gradiente++; if (/gradient/.test(s.backgroundImage) && (s.webkitBackgroundClip === 'text' || s.backgroundClip === 'text')) efeitos.textoGradiente++;
    if (s.boxShadow !== 'none') efeitos.sombra++; if (s.display === 'grid') grid++;
    if (el.tagName === 'A' || el.tagName === 'BUTTON') { const r = el.getBoundingClientRect(); if (r.height > 20 && num(s.borderTopLeftRadius) >= r.height / 2 - 1) pilula++; }
    if (s.animationName !== 'none' && s.animationPlayState === 'running') anim++;
    const rr = num(s.borderTopLeftRadius); if (rr > 0 && /card|item|box|tile/.test(String(el.className).toLowerCase())) raios.push(rr);
    if (s.transitionDuration && s.transitionDuration !== '0s') { s.transitionDuration.split(',').forEach(d => { const ms = Math.round(parseFloat(d) * (d.includes('ms') ? 1 : 1000)); if (ms > 0) contar(duracoes, ms); }); s.transitionTimingFunction.split(/,(?![^(]*\))/).forEach(c => contar(curvas, c.trim())); }
  }
  const larg = [...document.querySelectorAll('section > div, main > div, .container, [class*=container], [class*=wrapper]')].filter(vis).map(e => { const m = getComputedStyle(e).maxWidth; return m.endsWith('px') ? num(m) : null; });
  const topo = o => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const motion = { animacoesAtivas: anim + (document.getAnimations ? document.getAnimations().length : 0), duracoesMs: topo(duracoes), curvas: topo(curvas),
    marquee: !!document.querySelector('marquee, [class*=marquee], [class*=ticker]'), prefersReducedMotion: [...document.styleSheets].some(ss => { try { return [...ss.cssRules].some(r => r.media && /prefers-reduced-motion/.test(r.media.mediaText)); } catch { return false; } }) };
  const midia = { img: document.images.length, imgLazy: [...document.images].filter(i => i.loading === 'lazy').length, imgSrcset: [...document.images].filter(i => i.srcset).length, svg: document.querySelectorAll('svg').length,
    video: document.querySelectorAll('video').length, videoAuto: [...document.querySelectorAll('video')].filter(v => v.autoplay || v.hasAttribute('autoplay')).length, canvas: document.querySelectorAll('canvas').length, iframe: document.querySelectorAll('iframe').length };
  const rod = document.querySelector('footer'); const rodape = { existe: !!rod, maiorTextoPx: rod ? Math.max(0, ...[...rod.querySelectorAll('*')].filter(e => vis(e) && e.children.length === 0 && e.innerText?.trim()).map(e => num(getComputedStyle(e).fontSize))) || null : null };
  const cursorCustom = !!document.querySelector('[class*=cursor], [id*=cursor]') && ([...document.querySelectorAll('[class*=cursor]')].some(e => getComputedStyle(e).position === 'fixed') || getComputedStyle(body).cursor === 'none' || getComputedStyle(doc).cursor === 'none');
  return { pagina, menu, hero, titulo, corpo, rolagem, efeitos, forma: { botaoPilula: pilula, grid, raioCartaoMedianoPx: med(raios) }, midia, motion, rodape, cursorCustom, larguraMaxMedianaPx: med(larg) };
}

export function detectarLibs() {
  const w = window, q = s => document.querySelectorAll(s).length;
  const scripts = [...document.scripts].map(s => s.src || '').join(' ').toLowerCase();
  const tem = (g, re) => !!g || re.test(scripts);
  return { gsap: tem(w.gsap, /gsap/), scrollTrigger: tem(w.ScrollTrigger, /scrolltrigger/), lenis: tem(w.Lenis || w.lenis, /lenis/), locomotive: tem(w.LocomotiveScroll, /locomotive/), three: tem(w.THREE, /three/) || false,
    canvas: q('canvas'), video: q('video'), lottie: tem(w.lottie, /lottie/), rive: /rive/.test(scripts), swiper: tem(w.Swiper, /swiper/), barba: tem(w.barba, /barba/), splitText: tem(w.SplitText, /split-?text|splitting/), framerMotion: /framer/.test(scripts) };
}

export async function extrairEstrutura(page, { espera = 8000 } = {}) {
  const pre = await page.evaluate(medirPreloader).catch(() => ({ existe: false, comPorcentagem: false }));
  await esperarEstabilizar(page, espera);
  await page.evaluate(() => scrollTo(0, 0)); await dormir(300);
  const r = await page.evaluate(medirPagina);
  const libs = await page.evaluate(detectarLibs).catch(() => ({}));
  // rolagem de teste (revela conteúdo preguiçoso) e remede a altura
  const h0 = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.mouse.wheel(0, 900); await dormir(900);
  const rolou = await page.evaluate(() => scrollY > 0 || !!document.querySelector('.lenis'));
  await page.evaluate(() => scrollTo(0, 0)); await dormir(200);
  const fontes = await page.evaluate(() => [...new Set([...document.querySelectorAll('h1,h2,p,a,button')].slice(0, 200).map(e => getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '').trim()))].slice(0, 8));
  if (!rolou && r.pagina) r.pagina.rolagemVirtual = r.pagina.rolagemVirtual || h0 <= 1000;
  return { estrutura: { versao: 3, ...r, preloader: pre }, libs, fontes };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const a = args(); const url = a._[0]; if (!url) { console.error('Uso: node extrair-estrutura.mjs <url> [--espera 8000]'); process.exit(1); }
  const nav = await abrirNavegador(); const page = await (await nav.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }); const r = await extrairEstrutura(page, { espera: +a.espera || 8000 });
  console.log(JSON.stringify(r, null, 2)); await nav.close();
}
