// Prepara o material do JUIZ AWWWARDS (references/juiz.md): 6 a 8 telas-chave em 1440x900 e 390x844, uma folha única e os fatos medidos.
// Uso (site que rola):   node scripts/juiz.mjs <url> [--saida ./juiz] [--telas 7] [--espera 4000] [--nome "Marca"]
// Uso (palco fixo, sem rolagem, ex. GQ Lab e Cartier): passe os passos do palco.cjs depois de --palco:
//   node scripts/juiz.mjs http://localhost:3007/ --saida ./juiz --palco ".ativar" passo:3 passo:8 passo:13 passo:20 passo:25 passo:33 passo:40
//   (o 1º item depois de --palco é o seletor clicado antes de tudo; use "" se não houver. O comando de cada site está no CLAUDE.md dele, em "Capturas-alvo".)
// Saída em <saida>/: folha.jpg (o que o juiz olha), telas/d-*.jpg e m-*.jpg (detalhe), fatos.json, fatos.md e PEDIDO-AO-JUIZ.md (texto pronto para o subagente).
// Exige playwright-core (PLAYWRIGHT_CORE=caminho, ou no projeto) ou o pacote playwright, e Chrome/Chromium (CHROME=caminho se não achar).
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const av = process.argv.slice(2);
const iPalco = av.indexOf('--palco');
const palco = iPalco >= 0 ? av.slice(iPalco + 1) : null;
const resto = iPalco >= 0 ? av.slice(0, iPalco) : av;
const args = {}; const pos = [];
for (let i = 0; i < resto.length; i++) { if (resto[i].startsWith('--')) { const p = resto[i + 1]; args[resto[i].slice(2)] = p !== undefined && !p.startsWith('--') ? resto[++i] : true; } else pos.push(resto[i]); }
const url = pos[0];
if (!url) { console.error('Uso: node scripts/juiz.mjs <url> [--saida ./juiz] [--telas 7] [--espera 4000] [--palco "<seletor-inicial>" passo:N|tecla:Nome|seletor ...]'); process.exit(1); }
const saida = path.resolve(args.saida || './juiz');
const pastaTelas = path.join(saida, 'telas');
fs.rmSync(pastaTelas, { recursive: true, force: true }); fs.mkdirSync(pastaTelas, { recursive: true });
const N = Math.min(8, Math.max(6, +args.telas || 7));
const espera = +args.espera || 4000;
const nome = args.nome || url;

function carregarPlaywright() {
  const cands = [process.env.PLAYWRIGHT_CORE, path.join(process.cwd(), 'node_modules', 'playwright-core'), '/opt/node-tools/node_modules/playwright-core'].filter(Boolean);
  for (const c of cands) { try { return { pw: createRequire(path.join(path.resolve(c), 'package.json'))(path.resolve(c)), core: path.resolve(c) }; } catch { /* próximo */ } }
  try { return { pw: createRequire(import.meta.url)('playwright'), core: null }; } catch { /* sem playwright */ }
  throw new Error('playwright-core não encontrado. Defina PLAYWRIGHT_CORE=caminho ou instale playwright-core no projeto.');
}
function acharChrome() {
  const cands = [process.env.CHROME, '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', '/usr/bin/google-chrome', '/usr/bin/chromium',
    'C:/Program Files/Google/Chrome/Application/chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
  return cands.find(c => fs.existsSync(c));
}
const { pw, core } = carregarPlaywright();
const chrome = acharChrome();
const navegador = await pw.chromium.launch({ ...(chrome ? { executablePath: chrome } : {}), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });

// Fatos medidos na página (o juiz não vê código; estes números ancoram as notas).
const medir = () => {
  const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 2 && r.height > 2 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05; };
  const folhas = [...document.querySelectorAll('h1,h2,h3,h4,p,a,span,li,button,label,small,strong,em,blockquote,figcaption,td,div')]
    .filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1) && vis(e));
  const familias = {}; const tamanhos = [];
  for (const e of folhas) { const s = getComputedStyle(e); const f = s.fontFamily.split(',')[0].replace(/["']/g, '').trim(); const n = [...e.childNodes].filter(x => x.nodeType === 3).map(x => x.textContent.trim()).join('').length; familias[f] = (familias[f] || 0) + n; tamanhos.push([parseFloat(s.fontSize), n]); }
  const porTam = {}; for (const [t, n] of tamanhos) porTam[Math.round(t)] = (porTam[Math.round(t)] || 0) + n;
  const corpo = +Object.entries(porTam).sort((a, b) => b[1] - a[1])[0]?.[0] || 16;
  const maior = Math.max(...tamanhos.map(t => t[0]), 0);
  const h1 = [...document.querySelectorAll('h1')];
  const primeira = [...document.querySelectorAll('a[href],button')].filter(e => { const r = e.getBoundingClientRect(); return vis(e) && r.top < innerHeight && r.bottom > 0; });
  const fixos = [...document.querySelectorAll('body *')].filter(e => { const p = getComputedStyle(e).position; return (p === 'sticky') && e.getBoundingClientRect().height > innerHeight * 0.5; }).length;
  const imgs = [...document.images];
  return {
    titulo: document.title, idioma: document.documentElement.lang || '(sem lang)',
    alturaTelas: +(document.documentElement.scrollHeight / innerHeight).toFixed(1),
    rolagemHorizontal: document.documentElement.scrollWidth > innerWidth + 1,
    h1: h1.map(e => e.textContent.trim().replace(/\s+/g, ' ').slice(0, 80)),
    familias: Object.entries(familias).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([f, n]) => `${f} (${n} car.)`),
    corpoPx: corpo, maiorTextoPx: Math.round(maior), escala: +(maior / corpo).toFixed(1),
    acoesNaPrimeiraDobra: primeira.slice(0, 8).map(e => (e.textContent.trim() || e.getAttribute('aria-label') || '').replace(/\s+/g, ' ').slice(0, 30)).filter(Boolean),
    linksNoMenu: document.querySelectorAll('nav a, header a').length,
    imagens: imgs.length, imagensSemAlt: imgs.filter(i => !i.hasAttribute('alt')).length, videos: document.querySelectorAll('video').length,
    canvas: document.querySelectorAll('canvas').length, trechosFixos: fixos,
    bibliotecas: ['gsap', 'ScrollTrigger', 'Lenis', 'lenis', 'THREE', 'barba', 'Swiper'].filter(k => window[k]),
    palavras: (document.body.innerText || '').split(/\s+/).filter(Boolean).length,
    textoProvisorio: /lorem ipsum|\[[^\]]{2,40}\]|imagem provis[óo]ria|foto a gerar|IMAGENS\.md/i.test(document.body.innerText || ''),
  };
};

const pontosDaPagina = ([h, sel]) => {
  const H = document.documentElement.scrollHeight; const max = Math.max(0, H - innerHeight); const o = [];
  document.querySelectorAll(sel).forEach(e => { const r = e.getBoundingClientRect(); if (r.height < h * 0.3) return; const y = Math.round(r.top + scrollY);
    const nm = (e.id || (typeof e.className === 'string' && e.className.split(' ')[0]) || e.tagName.toLowerCase()).replace(/[^a-z0-9-]/gi, '').slice(0, 20);
    o.push({ nome: nm, y: Math.min(y, max) }); if (r.height > h * 2.5) o.push({ nome: nm + '-meio', y: Math.min(Math.round(y + r.height / 2 - h / 2), max) }); });
  return { H, max, pontos: o };
};

function escolher(pontos, max, n) {
  // candidatos únicos (distância mínima de meia tela), sempre com o topo e o fim
  const c = [{ nome: 'topo', y: 0 }, ...pontos.filter(p => p.y > 0).sort((a, b) => a.y - b.y)];
  if (max > 0) c.push({ nome: 'fim', y: max });
  const uniq = []; for (const p of c) if (!uniq.length || p.y - uniq[uniq.length - 1].y > 300) uniq.push(p);
  if (uniq.length > n) { const sel = []; for (let i = 0; i < n; i++) sel.push(uniq[Math.round(i * (uniq.length - 1) / (n - 1))]); return sel; }
  // poucos candidatos: completa com posições uniformes
  const out = [...uniq]; for (let i = 1; out.length < n && i < n; i++) { const y = Math.round(max * i / n); if (out.every(p => Math.abs(p.y - y) > 300)) out.push({ nome: `${Math.round(100 * y / Math.max(1, max))}pc`, y }); }
  return out.sort((a, b) => a.y - b.y).slice(0, n);
}

// Fecha aviso de cookies/consentimento (clica no botão de aceitar/ok/fechar dentro de um bloco que fala de cookies ou privacidade).
async function fecharAvisos(p) {
  await p.evaluate(() => {
    const blocos = [...document.querySelectorAll('body *')].filter(e => /cookie|privacidade|consent/i.test(e.textContent || '') && e.textContent.length < 600 && e.querySelector('button,a,[role=button]'));
    for (const b of blocos) { const bt = [...b.querySelectorAll('button,a,[role=button]')].find(x => /^(ok|aceit|accept|concord|entendi|fechar|close|×|x|\[x\])/i.test((x.textContent || x.getAttribute('aria-label') || '').trim())); if (bt) { bt.click(); return; } }
  }).catch(() => {});
  await p.waitForTimeout(700);
}

const fatos = { url, nome, data: new Date().toISOString().slice(0, 10), modo: palco ? 'palco' : 'rolagem', desktop: null, celular: null, errosConsole: [], alvosPequenosCelular: 0 };
const VIEWS = [['d', 1440, 900], ['m', 390, 844]];
const SEL = 'main > section, main > footer, body > section, body > footer, main > div[id], main > article, body > main > *';

for (const [pref, w, h] of VIEWS) {
  const p = await navegador.newPage({ viewport: { width: w, height: h }, isMobile: w < 500, hasTouch: w < 500 });
  p.on('pageerror', e => fatos.errosConsole.push(`${pref}: ${e.message.slice(0, 140)}`));
  p.on('console', m => m.type() === 'error' && fatos.errosConsole.push(`${pref}: ${m.text().slice(0, 140)}`));
  await p.goto(url, { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(espera); await p.mouse.move(w / 2, h / 2);
  const f = await p.evaluate(medir);
  if (pref === 'm') fatos.alvosPequenosCelular = await p.evaluate(() => [...document.querySelectorAll('a[href],button,input,select,[role=button]')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.width < 44 || r.height < 44); }).length);
  fatos[pref === 'd' ? 'desktop' : 'celular'] = f;
  if (!palco) {
    const { max, pontos } = await p.evaluate(pontosDaPagina, [h, SEL]);
    if (pref === 'd' && max < h * 0.5) {
      console.error('Este site quase não rola (palco fixo). Rode de novo com --palco e os passos do palco.cjs (veja "Capturas-alvo" no CLAUDE.md do site).');
      await navegador.close(); process.exit(2);
    }
    const escolhidos = escolher(pontos, max, N);
    for (const [i, q] of escolhidos.entries()) {
      // rola em passos (dispara ScrollTrigger e Lenis como um visitante) e espera assentar
      await p.evaluate(y => { window.scrollTo(0, y); }, q.y); await p.waitForTimeout(250);
      await p.mouse.wheel(0, 1); await p.waitForTimeout(1500);
      await p.screenshot({ path: path.join(pastaTelas, `${pref}-${String(i + 1).padStart(2, '0')}-${q.nome}.jpg`), type: 'jpeg', quality: 70 });
      if (i === 0) await fecharAvisos(p); // a 1ª tela mostra o aviso de cookies (primeira impressão real); as outras, o conteúdo
    }
  }
  await p.close();
}

if (palco) {
  if (!core) { console.error('--palco precisa de playwright-core (PLAYWRIGHT_CORE=caminho).'); process.exit(1); }
  const [ini = '', ...passos] = palco;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'palco-'));
  execFileSync('node', [path.join(AQUI, '..', 'replica', 'ferramentas', 'palco.cjs'), url, tmp, ini, ...passos],
    { stdio: 'inherit', env: { ...process.env, PLAYWRIGHT_CORE: core, ...(chrome ? { CHROME: chrome } : {}) } });
  for (const pref of ['d', 'm']) {
    const arqs = fs.readdirSync(tmp).filter(a => a.startsWith(pref + '-')).sort();
    const sel = arqs.length > N ? Array.from({ length: N }, (_, i) => arqs[Math.round(i * (arqs.length - 1) / (N - 1))]) : arqs;
    sel.forEach((a, i) => fs.copyFileSync(path.join(tmp, a), path.join(pastaTelas, `${pref}-${String(i + 1).padStart(2, '0')}-${a.slice(5).replace(/\.jpg$/, '')}.jpg`)));
  }
  fs.rmSync(tmp, { recursive: true, force: true });
}

// ---- folha única: desktop em 3 colunas, celular em uma faixa ----
const telas = fs.readdirSync(pastaTelas).filter(a => a.endsWith('.jpg')).sort();
const b64 = a => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(pastaTelas, a)).toString('base64');
const rot = a => a.replace(/\.jpg$/, '').replace(/^([dm])-/, (_, x) => (x === 'd' ? 'D' : 'C'));
const tile = (a, cls) => `<figure class="${cls}"><img src="${b64(a)}"><figcaption>${rot(a)}</figcaption></figure>`;
const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:#111;color:#ddd;font:13px/1.3 system-ui,sans-serif;width:1600px;padding:14px;box-sizing:border-box}
h1{font-size:15px;margin:0 0 10px;color:#fff;font-weight:600} h2{font-size:12px;margin:14px 0 6px;color:#aaa;font-weight:500;letter-spacing:.08em;text-transform:uppercase}
.g{display:grid;gap:8px} .d{grid-template-columns:repeat(3,1fr)} .m{grid-template-columns:repeat(8,1fr)}
figure{margin:0;position:relative} img{width:100%;display:block;border:1px solid #333}
figcaption{position:absolute;left:0;top:0;background:#000c;color:#ff0;padding:1px 5px;font-size:11px}
</style><h1>Juiz · ${nome.replace(/</g, '')} · ${fatos.data}</h1>
<h2>Desktop 1440×900</h2><div class="g d">${telas.filter(a => a.startsWith('d-')).map(a => tile(a, 'td')).join('')}</div>
<h2>Celular 390×844</h2><div class="g m">${telas.filter(a => a.startsWith('m-')).map(a => tile(a, 'tm')).join('')}</div>`;
const pg = await navegador.newPage({ viewport: { width: 1600, height: 800 } });
await pg.setContent(html, { waitUntil: 'load' });
await pg.screenshot({ path: path.join(saida, 'folha.jpg'), type: 'jpeg', quality: 80, fullPage: true });
await navegador.close();

// ---- fatos e pedido ----
fs.writeFileSync(path.join(saida, 'fatos.json'), JSON.stringify(fatos, null, 1));
const linha = (k, v) => `| ${k} | ${v} |`;
const d = fatos.desktop, c = fatos.celular;
const md = [`# Fatos medidos: ${nome}`, '', `URL: ${url} · ${fatos.data} · modo ${fatos.modo}`, '', '| Medida | Desktop / celular |', '|---|---|',
  linha('Título · idioma', `${d.titulo} · ${d.idioma}`),
  linha('Altura (telas)', `${d.alturaTelas} / ${c.alturaTelas}`),
  linha('h1', d.h1.length ? d.h1.join(' · ') : 'nenhum'),
  linha('Famílias de fonte (por volume de texto)', d.familias.join(', ')),
  linha('Corpo · maior texto · escala', `${d.corpoPx} px · ${d.maiorTextoPx} px · ${d.escala}× (celular ${c.escala}×)`),
  linha('Ações na primeira dobra', d.acoesNaPrimeiraDobra.join(' · ') || 'nenhuma'),
  linha('Links no menu/topo', d.linksNoMenu),
  linha('Imagens (sem alt) · vídeos · canvas', `${d.imagens} (${d.imagensSemAlt}) · ${d.videos} · ${d.canvas}`),
  linha('Trechos fixos (sticky > meia tela)', d.trechosFixos),
  linha('Bibliotecas de movimento', d.bibliotecas.join(', ') || 'nenhuma detectada no window'),
  linha('Palavras na página', d.palavras),
  linha('Texto provisório (lorem, [ ])', d.textoProvisorio || c.textoProvisorio ? 'SIM' : 'não'),
  linha('Rolagem horizontal no celular', c.rolagemHorizontal ? 'SIM' : 'não'),
  linha('Alvos de toque < 44 px no celular', fatos.alvosPequenosCelular),
  linha('Erros no console', fatos.errosConsole.length ? fatos.errosConsole.slice(0, 5).join(' / ') : 'nenhum'), ''].join('\n');
fs.writeFileSync(path.join(saida, 'fatos.md'), md);
const pedido = `Você é o JUIZ AWWWARDS desta skill. Leia ${path.resolve(AQUI, '..', 'references', 'juiz.md')} inteiro e siga-o à risca.
Material (não abra o código do site):
- Folha única: ${path.join(saida, 'folha.jpg')}
- Telas em tamanho real, para conferir detalhe: ${pastaTelas}/ (d-* desktop 1440x900, m-* celular 390x844)
- Fatos medidos: ${path.join(saida, 'fatos.md')}
${args.direcao ? `- Direção criativa declarada: ${path.resolve(args.direcao)}\n` : ''}Devolva exatamente o formato de saída do juiz.md (tabela de notas, média ponderada, veredito e correções ordenadas por impacto).
`;
fs.writeFileSync(path.join(saida, 'PEDIDO-AO-JUIZ.md'), pedido);
console.log(`Juiz: ${telas.length} telas em ${pastaTelas}\nFolha: ${path.join(saida, 'folha.jpg')}\nFatos: ${path.join(saida, 'fatos.md')}\nPedido pronto para o subagente: ${path.join(saida, 'PEDIDO-AO-JUIZ.md')}`);
