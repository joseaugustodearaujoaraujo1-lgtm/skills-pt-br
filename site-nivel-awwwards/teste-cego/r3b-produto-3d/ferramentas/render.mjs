// Gera, a partir da MESMA cena do site (src/cena.js): o molde em 4 vistas, os quadros do plano B, a vista de perfil da ficha e os dados das cotas.
// Uso: node ferramentas/render.mjs [molde|quadros|perfil|tudo]
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module'; import { fileURLToPath } from 'node:url';
const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_CORE || '/opt/node-tools/node_modules/playwright-core');
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
const modo = process.argv[2] || 'tudo';
const srv = http.createServer((q, r) => { const f = path.join(RAIZ, decodeURIComponent(new URL(q.url, 'http://x').pathname)); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404).end(); return; } r.writeHead(200, { 'content-type': f.endsWith('.js') ? 'text/javascript' : 'text/html' }).end(d); }); }).listen(0);
const porta = srv.address().port;
const b = await chromium.launch({ executablePath: CHROME, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await b.newPage({ viewport: { width: 1200, height: 1200 } });
pg.on('console', m => console.log('[pg]', m.text())); pg.on('pageerror', e => console.log('[erro]', e.message));
await pg.goto(`http://localhost:${porta}/ferramentas/render.html`); await pg.waitForFunction(() => window.fervo);
const grava = (arq, url) => { fs.mkdirSync(path.dirname(arq), { recursive: true }); fs.writeFileSync(arq, Buffer.from(url.split(',')[1], 'base64')); };
const t0 = Date.now();
if (modo === 'molde' || modo === 'tudo') {
  await pg.evaluate(() => fervo.iniciar(900, 1100));
  for (const v of ['frente', 'perfil', 'tresquartos', 'topo']) grava(path.join(RAIZ, 'referencias-3d/cafeteira/molde', v + '.png'), await pg.evaluate(n => fervo.vista(n), v));
  console.log('molde ok', Date.now() - t0, 'ms');
}
if (modo === 'perfil' || modo === 'tudo') {
  await pg.evaluate(() => fervo.iniciar(800, 1000));
  const r = await pg.evaluate(() => fervo.vistaComPontos('perfil', 'image/webp', .82));
  grava(path.join(RAIZ, 'public/img/perfil.webp'), r.url); fs.writeFileSync(path.join(RAIZ, 'public/img/perfil.json'), JSON.stringify(r.dados));
  console.log('perfil ok');
}
if (modo === 'quadros' || modo === 'tudo') {
  const N = 48, dados = [];
  for (const [w, h, q] of [[760, 950, .74], [440, 550, .7]]) {
    await pg.evaluate(([w, h]) => fervo.iniciar(w, h), [w, h]);
    for (let i = 0; i < N; i++) {
      const r = await pg.evaluate(([p, q]) => fervo.quadro(p, 'image/webp', q), [i / (N - 1), q]);
      grava(path.join(RAIZ, `public/img/quadros/${w}/${String(i).padStart(2, '0')}.webp`), r.url);
      if (w === 760) { dados.push(r.dados); if (i === 0) console.log('info', JSON.stringify(r.info)); }
    }
    console.log('quadros', w, Date.now() - t0, 'ms');
  }
  fs.writeFileSync(path.join(RAIZ, 'public/img/quadros/dados.json'), JSON.stringify({ n: N, quadros: dados }));
}
await b.close(); srv.close();
