// Portão de qualidade automático: abre o site em 1440, 768 e 390 px e mede o que a rubrica exige. Gera relatório (md + json) e capturas.
// Uso: node verificar-site.mjs http://localhost:3001/ [--saida ./verificacao] [--lighthouse] [--espera 1500]
// Exige playwright-core (instale no projeto, ou defina PLAYWRIGHT_CORE com o caminho) e Chrome/Edge/Chromium (ou CHROME=caminho).
// Resultado: FAIL = precisa corrigir antes de entregar; WARN = verifique e justifique; OK. Código de saída 1 se houver FAIL.
// Não substitui olhar as capturas (hierarquia, composição, identidade) nem testar em celular real.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const args = {}; const av = process.argv.slice(2); const pos = [];
for (let i = 0; i < av.length; i++) { if (av[i].startsWith('--')) { const p = av[i + 1]; args[av[i].slice(2)] = p && !p.startsWith('--') ? av[++i] : true; } else pos.push(av[i]); }
const url = pos[0];
if (!url) { console.error('Uso: node verificar-site.mjs <url> [--saida ./verificacao] [--lighthouse]'); process.exit(1); }
const saida = path.resolve(args.saida || './verificacao'); fs.mkdirSync(saida, { recursive: true });
const espera = +args.espera || 1500;

// ---- playwright-core e navegador ----
function carregarPlaywright() {
  const cands = [process.env.PLAYWRIGHT_CORE, path.join(process.cwd(), 'node_modules', 'playwright-core'), path.join(os.homedir(), 'Documents', 'acervos-design', 'node_modules', 'playwright-core'), '/opt/node-tools/node_modules/playwright-core'].filter(Boolean);
  for (const c of cands) { try { return createRequire(path.join(path.resolve(c), 'package.json'))(path.resolve(c)); } catch { /* próxima */ } }
  throw new Error('playwright-core não encontrado. Rode "npm i -D playwright-core" no projeto ou defina PLAYWRIGHT_CORE.');
}
function acharChrome() {
  const cands = [process.env.CHROME, process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium-1248', 'chrome-win64', 'chrome.exe'),
    'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', '/opt/pw-browsers/chromium/chrome-linux64/chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
  const achado = cands.find(c => fs.existsSync(c)); if (!achado) throw new Error('Chrome/Edge/Chromium não encontrado. Defina CHROME=caminho.'); return achado;
}
const { chromium } = carregarPlaywright();

const itens = []; // { vp, nivel, id, msg }
const reg = (vp, nivel, id, msg) => itens.push({ vp, nivel, id, msg });

// ---- medição dentro da página ----
function medir() {
  const visivel = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 1 && r.height > 1 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05; };
  const parseCor = c => { const s = c.match(/color\(srgb ([^)]+)\)/); if (s) { const q = s[1].split(/[ /]+/).filter(Boolean).map(Number); return { r: q[0] * 255, g: q[1] * 255, b: q[2] * 255, a: q[3] ?? 1 }; } const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 }; };
  const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = c => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const mistura = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
  const fundoEfetivo = el => { // sobe a árvore até achar fundo opaco; imagem/gradiente de fundo = indeterminado
    let cor = { r: 255, g: 255, b: 255, a: 1 }; const pilha = [];
    for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); if (s.backgroundImage !== 'none') return null; const c = parseCor(s.backgroundColor); if (c && c.a > 0) { pilha.push(c); if (c.a >= 1) break; } }
    for (let i = pilha.length - 1; i >= 0; i--) cor = mistura(pilha[i], cor); return cor;
  };
  const out = { problemas: {} };
  const txt = document.body.innerText || '';
  out.placeholders = [...new Set((txt.match(/\[[^\]\n]{2,80}\]/g) || []))].slice(0, 6);
  out.lorem = /lorem ipsum|dolor sit amet/i.test(txt);
  // notas de produção à vista (teste cego, rodadas 1 e 3: "IMAGEM PROVISÓRIA", "FOTO A GERAR · x.webp · ver IMAGENS.md") contam como texto provisório para o juiz
  out.notasProducao = [...new Set((txt.match(/[^\n]{0,30}(imagem provis[óo]ria|foto provis[óo]ria|a gerar\b|placeholder|IMAGENS\.md|PARA-GERAR|[\w-]+\.(webp|png|jpe?g|avif|mp4))[^\n]{0,30}/gi) || []).map(s => s.trim()))].slice(0, 6);
  out.emoji = (txt.match(/\p{Extended_Pictographic}/gu) || []).filter(e => !'©®™‼⁉'.includes(e)).length; // ©, ® e ™ são símbolos de texto, não emoji
  out.h1 = [...document.querySelectorAll('h1')].map(h => ({ texto: h.innerText.trim().slice(0, 80), px: Math.round(parseFloat(getComputedStyle(h).fontSize)), visivel: visivel(h) }));
  out.overflowX = document.documentElement.scrollWidth - innerWidth;
  out.lang = document.documentElement.lang; out.titulo = document.title; out.desc = document.querySelector('meta[name=description]')?.content || '';
  out.viewportMeta = !!document.querySelector('meta[name=viewport]');
  const imgs = [...document.images]; out.imgs = imgs.length; out.imgsSemAlt = imgs.filter(i => !i.hasAttribute('alt')).length; out.imgsQuebradas = imgs.filter(i => i.complete && i.naturalWidth === 0).length;
  out.videos = document.querySelectorAll('video').length; out.videosSemPoster = [...document.querySelectorAll('video')].filter(v => !v.poster).length;
  // fontes e tamanhos de texto reais
  const fam = new Map(); let pequenos = 0, corpoPx = 0, nTxt = 0; const baixos = []; let amostras = 0, indef = 0, gradTexto = 0;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const vistos = new Set();
  for (let n; (n = walker.nextNode());) {
    const t = n.textContent.trim(); const el = n.parentElement; if (!t || !el || vistos.has(el) || !visivel(el)) continue; vistos.add(el);
    if (/^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.tagName)) continue;
    const s = getComputedStyle(el), ctm = el instanceof SVGGraphicsElement && el.getScreenCTM ? el.getScreenCTM() : null, px = parseFloat(s.fontSize) * (ctm ? Math.hypot(ctm.a, ctm.b) : 1), f = s.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    fam.set(f, (fam.get(f) || 0) + 1); nTxt++; if (el.tagName === 'P') corpoPx = Math.max(corpoPx, px);
    if (px < 12) pequenos++;
    if (s.backgroundClip === 'text' || s.webkitBackgroundClip === 'text') gradTexto++;
    if (amostras < 400) { // contraste
      amostras++; const fg = parseCor(s.color), bgc = fundoEfetivo(el); if (!fg) continue; if (!bgc) { indef++; continue; }
      const f2 = mistura({ ...fg, a: fg.a * (+s.opacity || 1) }, bgc), l1 = lum(f2), l2 = lum(bgc), r = (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05);
      const grande = px >= 24 || (px >= 18.66 && +s.fontWeight >= 700), min = grande ? 3 : 4.5;
      if (r < min) baixos.push({ texto: t.slice(0, 32), razao: +r.toFixed(2), min, px: Math.round(px) });
    }
  }
  out.familias = [...fam.keys()]; out.textosPequenos = pequenos; out.corpoPx = Math.round(corpoPx); out.contrasteBaixo = baixos.slice(0, 6); out.contrasteBaixoTotal = baixos.length; out.contrasteIndefinido = indef; out.gradienteTexto = gradTexto;
  // alvos de toque (links e botões visíveis)
  const alvos = [...document.querySelectorAll('a[href], button, input, select, textarea, [role=button]')].filter(visivel);
  out.alvosPequenos = alvos.filter(a => { const r = a.getBoundingClientRect(); return (r.width < 44 || r.height < 44) && !(a.closest('p') && a.tagName === 'A'); }).length; out.alvos = alvos.length;
  // elementos com movimento
  let mov = 0; for (const el of document.querySelectorAll('body *')) { const s = getComputedStyle(el); if (s.animationName !== 'none' || (s.transform !== 'none' && s.transform !== 'matrix(1, 0, 0, 1, 0, 0)') || s.transitionDuration.split(',').some(d => parseFloat(d) > 0)) mov++; }
  out.comMovimento = mov;
  out.secoes = document.querySelectorAll('main section, body > section').length; out.palavras = txt.split(/\s+/).filter(Boolean).length;
  // composição de cada seção (colunas, posição do título, peso da mídia, tamanho do título): seções vizinhas iguais = página de modelo
  out.composicao = [...document.querySelectorAll('main > section, main > div, main > article, body > section')].filter(sec => sec.getBoundingClientRect().height > 300 && visivel(sec)).slice(0, 30).map(sec => {
    const R = sec.getBoundingClientRect(), area = R.width * R.height;
    const blocos = [...sec.querySelectorAll('*')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 120 && r.width < R.width * 0.9 && r.height > 60 && visivel(e); });
    const linhas = new Map(); for (const b of blocos) { const r = b.getBoundingClientRect(); const k = Math.round(r.top / 80); if (!linhas.has(k)) linhas.set(k, new Set()); linhas.get(k).add(Math.round(r.left / 60)); }
    const colunas = Math.min(4, Math.max(1, ...[...linhas.values()].map(v => v.size)));
    const h = [...sec.querySelectorAll('h1,h2,h3')].find(visivel); let tit = 'sem', tam = 0;
    if (h) { const r = h.getBoundingClientRect(), c = (r.left + r.width / 2 - R.left) / R.width; tit = r.width > R.width * 0.7 ? 'largo' : c < 0.4 ? 'esq' : c > 0.6 ? 'dir' : 'centro'; const px = parseFloat(getComputedStyle(h).fontSize); tam = px < 40 ? 1 : px < 90 ? 2 : 3; }
    const midia = Math.max(0, ...[...sec.querySelectorAll('img,video,canvas,picture,svg')].filter(visivel).map(m => { const r = m.getBoundingClientRect(); return r.width * r.height / area; }));
    const peso = midia < 0.05 ? 0 : midia < 0.3 ? 1 : midia < 0.7 ? 2 : 3;
    return { id: sec.id || sec.className?.toString().split(' ')[0] || sec.tagName.toLowerCase(), sig: `${colunas}c-${tit}-t${tam}-m${peso}` };
  });
  out.temMain = !!document.querySelector('main'); out.temNav = !!document.querySelector('nav'); out.temFooter = !!document.querySelector('footer');
  out.focoVisivel = (() => { const s = [...document.styleSheets].some(ss => { try { return [...ss.cssRules].some(r => /focus-visible|:focus/.test(r.selectorText || '')); } catch { return false; } }); return s; })();
  return out;
}

const VPS = [['1440', 1440, 900, false], ['768', 768, 1024, false], ['390', 390, 844, true]];
const navegador = await chromium.launch({ executablePath: acharChrome() });
const dados = {};
for (const [nome, w, h, movel] of VPS) {
  const ctx = await navegador.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: movel, hasTouch: movel });
  const p = await ctx.newPage(); const errosConsole = [], falhas = [];
  p.on('pageerror', e => errosConsole.push(e.message)); p.on('console', m => m.type() === 'error' && errosConsole.push(m.text()));
  p.on('requestfailed', r => falhas.push(r.url().slice(0, 100)));
  await p.goto(url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now(), { waitUntil: 'networkidle' }); await p.waitForTimeout(espera);
  // espera as animações finitas terminarem: texto ainda entrando tem opacidade menor e daria contraste falso
  await p.evaluate(() => Promise.race([Promise.allSettled(document.getAnimations().filter(a => a.effect?.getTiming().iterations !== Infinity).map(a => a.finished)), new Promise(r => setTimeout(r, 5000))]));
  const d = await p.evaluate(medir); dados[nome] = d;
  // texto escrito dentro de SVG usado como <img> (o innerText não o vê): também é nota de produção se nomear arquivo ou "a gerar"
  const txtSvg = await p.evaluate(async () => { let t = ''; for (const u of new Set([...document.images].map(i => i.currentSrc || i.src).filter(u => /\.svg(\?|#|$)/i.test(u)))) { try { const r = await fetch(u); t += (await r.text()).replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ') + '\n'; } catch { /* outra origem */ } } return t; });
  const notasSvg = (txtSvg.match(/[^\n]{0,30}(imagem provis[óo]ria|foto provis[óo]ria|a gerar\b|placeholder|IMAGENS\.md|[\w-]+\.(webp|png|jpe?g|avif|mp4))[^\n]{0,30}/gi) || []).map(x => 'no SVG: ' + x.trim());
  d.notasProducao = [...new Set([...(d.notasProducao || []), ...notasSvg])].slice(0, 6);
  // no meio da página, menu ou ação principal ainda alcançáveis? (teste cego, rodadas 1 e 4: sem isso a Usabilidade para em 6,5)
  await p.evaluate(() => window.scrollTo(0, Math.round(document.documentElement.scrollHeight * 0.5))); await p.mouse.wheel(0, 2); await p.waitForTimeout(1200);
  d.navegacaoNoMeio = await p.evaluate(() => {
    const fixo = el => { for (let e = el; e && e !== document.body; e = e.parentElement) { const ps = getComputedStyle(e).position; if (ps === 'fixed' || ps === 'sticky') return true; } return false; };
    return [...document.querySelectorAll('a[href], button')].some(a => { const r = a.getBoundingClientRect(), s = getComputedStyle(a); return r.width > 20 && r.height > 14 && r.top >= 0 && r.bottom <= innerHeight && s.visibility !== 'hidden' && +s.opacity > 0.3 && (a.innerText || a.getAttribute('aria-label') || '').trim() && fixo(a); });
  });
  // rola a página inteira para disparar carregamento tardio e capturar
  await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 70)); } scrollTo(0, 0); });
  await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(saida, `dobra-${nome}.png`) }); // primeira dobra, com movimento normal
  d.errosConsole = errosConsole.slice(0, 5); d.requisicoesFalhas = falhas.slice(0, 5);
  // movimento reduzido: nada de texto escondido
  const ctx2 = await navegador.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' }); const p2 = await ctx2.newPage();
  await p2.goto(url + (url.includes('?') ? '&' : '?') + 'r=' + Date.now(), { waitUntil: 'networkidle' }); await p2.waitForTimeout(espera);
  await p2.addStyleTag({ content: '*{content-visibility:visible!important}' }); await p2.waitForTimeout(300);
  // loading="lazy" só carrega perto da tela: força o carregamento antes da captura da página inteira (teste cego, rodada 3b)
  await p2.evaluate(async () => { for (const i of document.images) if (i.loading === 'lazy') i.loading = 'eager'; await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 3000); }))); }); // content-visibility:auto não pinta o que está fora da tela: força só durante a captura
  await p2.screenshot({ path: path.join(saida, `captura-${nome}.png`), fullPage: true }); // página inteira no estado final (movimento reduzido)
  d.escondidoComMovimentoReduzido = await p2.evaluate(() => { let n = 0; for (const el of document.querySelectorAll('h1,h2,h3,p,li,a,button')) { const t = el.innerText?.trim(); if (!t) continue; const s = getComputedStyle(el), r = el.getBoundingClientRect(); if (+s.opacity < .1 && r.width > 1) n++; } return n; });
  await ctx2.close(); await ctx.close();

  // ---- regras ----
  if (d.overflowX > 1) reg(nome, 'FAIL', 'overflow-x', `rolagem horizontal: o documento excede a tela em ${d.overflowX}px`);
  if (d.errosConsole.length) reg(nome, 'FAIL', 'console', `erros no console: ${d.errosConsole.join(' | ').slice(0, 200)}`);
  if (d.requisicoesFalhas.length) reg(nome, 'FAIL', 'requisicoes', `requisições falhas: ${d.requisicoesFalhas.join(', ')}`);
  if (d.placeholders.length) reg(nome, 'FAIL', 'placeholder', `texto de modelo ainda na página: ${d.placeholders.join(' ')}`);
  if (d.lorem) reg(nome, 'FAIL', 'lorem', 'lorem ipsum na página');
  if (d.notasProducao?.length) reg(nome, 'FAIL', 'nota-de-producao', `nota de produção à vista (o juiz lê como texto provisório, teto 3 em Usabilidade): ${d.notasProducao.join(' | ')}. O nome do arquivo vai em data-imagem e na lista de imagens, nunca no texto.`);
  if (d.h1.length !== 1) reg(nome, 'FAIL', 'h1', `deve haver 1 <h1>, há ${d.h1.length}`); else { if (!d.h1[0].visivel) reg(nome, 'FAIL', 'h1-visivel', 'o <h1> não está visível'); if (d.h1[0].px < (nome === '390' ? 40 : 56)) reg(nome, 'WARN', 'h1-pequeno', `título pequeno para a primeira dobra: ${d.h1[0].px}px`); }
  if (d.contrasteBaixoTotal) reg(nome, 'FAIL', 'contraste', `${d.contrasteBaixoTotal} texto(s) abaixo do mínimo (ex.: ${d.contrasteBaixo.map(c => `"${c.texto}" ${c.razao}:1<${c.min}`).slice(0, 3).join('; ')})`);
  if (d.contrasteIndefinido > 8) reg(nome, 'WARN', 'contraste-indefinido', `${d.contrasteIndefinido} textos sobre imagem ou gradiente: confira o contraste na captura`);
  if (d.imgsSemAlt) reg(nome, 'FAIL', 'alt', `${d.imgsSemAlt} imagem(ns) sem atributo alt`);
  if (d.imgsQuebradas) reg(nome, 'FAIL', 'img-quebrada', `${d.imgsQuebradas} imagem(ns) quebrada(s)`);
  if (d.videosSemPoster) reg(nome, 'WARN', 'video-poster', `${d.videosSemPoster} vídeo(s) sem poster`);
  if (d.familias.length > 3) reg(nome, 'WARN', 'fontes', `${d.familias.length} famílias de fonte em uso (${d.familias.join(', ')}): o ideal são 2 mais uma de detalhe`);
  if (d.textosPequenos) reg(nome, 'WARN', 'texto-pequeno', `${d.textosPequenos} texto(s) abaixo de 12px`);
  if (d.corpoPx && d.corpoPx < 16) reg(nome, 'WARN', 'corpo-pequeno', `texto de corpo com ${d.corpoPx}px (mínimo recomendado 16px)`);
  if (nome === '390' && d.alvosPequenos > 0) reg(nome, 'WARN', 'alvo-toque', `${d.alvosPequenos} de ${d.alvos} alvos de toque menores que 44px`);
  if (d.escondidoComMovimentoReduzido) reg(nome, 'FAIL', 'movimento-reduzido', `${d.escondidoComMovimentoReduzido} texto(s) invisível(is) com prefers-reduced-motion`);
  if (d.comMovimento < 8) reg(nome, 'WARN', 'pouco-movimento', `só ${d.comMovimento} elementos com movimento (premiados costumam ter 8 ou mais)`);
  if (d.gradienteTexto) reg(nome, 'WARN', 'gradiente-texto', `${d.gradienteTexto} texto(s) com gradiente (clichê de "cara de IA")`);
  if (nome === '1440' && d.composicao?.length >= 3) { // teste cego: nota 8 pede composição própria por seção
    const iguais = []; for (let i = 1; i < d.composicao.length; i++) if (d.composicao[i].sig === d.composicao[i - 1].sig) iguais.push(`${d.composicao[i - 1].id} = ${d.composicao[i].id} (${d.composicao[i].sig})`);
    if (iguais.length >= 2 || iguais.length / (d.composicao.length - 1) > 0.3) reg(nome, 'WARN', 'secoes-repetidas', `${iguais.length} par(es) de seções vizinhas com a mesma composição: ${iguais.slice(0, 4).join('; ')}. Varie colunas, posição do título, escala ou peso da imagem (references/direcao-criativa.md, "Composição por seção").`);
  }
  if (d.navegacaoNoMeio === false) reg(nome, 'FAIL', 'sem-navegacao', 'no meio da página não há menu nem ação principal à vista (nada fixo com link ou botão). Mantenha uma barra compacta fixa no desktop e a ação fixa no pé do celular, sem cobrir botões ou texto (elementos.md §8). Menu que só reaparece ao rolar para cima não conta: o juiz fotografa descendo.');
  if (d.emoji) reg(nome, 'WARN', 'emoji', `${d.emoji} emoji(s) na página`);
  if (nome === '1440') {
    if (d.imgs < 4 && d.videos === 0) reg(nome, 'WARN', 'poucas-imagens', `só ${d.imgs} imagem(ns): sites premiados sustentam a identidade com imagem real`);
    if (!d.lang) reg(nome, 'FAIL', 'lang', 'falta <html lang>'); if (!d.titulo) reg(nome, 'FAIL', 'title', 'falta <title>'); if (!d.desc) reg(nome, 'WARN', 'description', 'falta meta description');
    if (!d.viewportMeta) reg(nome, 'FAIL', 'viewport', 'falta meta viewport'); if (!d.temMain) reg(nome, 'WARN', 'main', 'falta <main>'); if (!d.focoVisivel) reg(nome, 'WARN', 'foco', 'nenhuma regra :focus-visible encontrada');
  }
}
await navegador.close();

// ---- Lighthouse (opcional) ----
const lh = {};
if (args.lighthouse) {
  const chrome = acharChrome(); const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  for (const modo of ['desktop', 'mobile']) {
    const arq = path.join(saida, `lighthouse-${modo}.json`);
    try {
      execFileSync(npx, ['--yes', 'lighthouse@latest', url, `--chrome-path=${chrome}`, '--chrome-flags=--headless=new --no-sandbox', ...(modo === 'desktop' ? ['--preset=desktop'] : []), '--only-categories=performance,accessibility,best-practices,seo', '--output=json', `--output-path=${arq}`, '--quiet'], { stdio: 'ignore', shell: process.platform === 'win32', timeout: 600000 });
      const j = JSON.parse(fs.readFileSync(arq, 'utf8')); const c = j.categories, a = j.audits;
      lh[modo] = { desempenho: Math.round(c.performance.score * 100), acessibilidade: Math.round(c.accessibility.score * 100), boasPraticas: Math.round(c['best-practices'].score * 100), seo: Math.round(c.seo.score * 100), lcp: a['largest-contentful-paint'].displayValue, tbt: a['total-blocking-time'].displayValue, cls: a['cumulative-layout-shift'].displayValue };
      const meta = modo === 'desktop' ? 90 : 75; if (lh[modo].desempenho < meta) reg(modo, 'WARN', 'lighthouse-desempenho', `desempenho ${lh[modo].desempenho} (meta ${meta})`);
      if (lh[modo].acessibilidade < 95) reg(modo, 'FAIL', 'lighthouse-acessibilidade', `acessibilidade ${lh[modo].acessibilidade} (meta 95)`);
    } catch (e) { reg(modo, 'WARN', 'lighthouse', 'não foi possível rodar o Lighthouse: ' + String(e.message).slice(0, 80)); }
  }
}

// ---- relatório ----
const fails = itens.filter(i => i.nivel === 'FAIL'), warns = itens.filter(i => i.nivel === 'WARN');
const agrupa = lista => { const m = new Map(); for (const i of lista) { const k = i.id + '|' + i.msg.replace(/\d+/g, '#'); if (!m.has(k)) m.set(k, { ...i, vps: [i.vp] }); else m.get(k).vps.push(i.vp); } return [...m.values()]; };
const linhas = [`# Verificação — ${url}`, '', `Resultado: **${fails.length ? 'REPROVADO' : 'APROVADO'}** · ${fails.length} FAIL · ${warns.length} WARN · capturas em ${saida}`, ''];
const d14 = dados['1440']; linhas.push(`Medidas (1440): ${d14.secoes} seções, ${d14.palavras} palavras, ${d14.imgs} imagens, ${d14.videos} vídeos, ${d14.comMovimento} elementos com movimento, fontes: ${d14.familias.join(', ')}.`, '');
if (fails.length) { linhas.push('## FAIL (corrigir antes de entregar)'); agrupa(fails).forEach(i => linhas.push(`- **${i.id}** [${i.vps.join(', ')}] ${i.msg}`)); linhas.push(''); }
if (warns.length) { linhas.push('## WARN (verificar e justificar)'); agrupa(warns).forEach(i => linhas.push(`- **${i.id}** [${i.vps.join(', ')}] ${i.msg}`)); linhas.push(''); }
if (Object.keys(lh).length) { linhas.push('## Lighthouse', '', '| | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | TBT | CLS |', '|---|---|---|---|---|---|---|---|'); for (const [m, v] of Object.entries(lh)) linhas.push(`| ${m} | ${v.desempenho} | ${v.acessibilidade} | ${v.boasPraticas} | ${v.seo} | ${v.lcp} | ${v.tbt} | ${v.cls} |`); linhas.push(''); }
linhas.push('## Não verificado por este script', '- Hierarquia, composição, identidade e originalidade: **olhe as capturas** e aplique a rubrica (`references/rubrica.md`).', '- Celular real, redes lentas, outros navegadores, leitor de tela, navegação por teclado completa.');
fs.writeFileSync(path.join(saida, 'relatorio.md'), linhas.join('\n')); fs.writeFileSync(path.join(saida, 'relatorio.json'), JSON.stringify({ url, fails, warns, lighthouse: lh, medidas: dados }, null, 2));
console.log(linhas.join('\n'));
process.exit(fails.length ? 1 : 0);
