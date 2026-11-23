// Gera, a partir da cena real: molde em vistas (referencias-3d/moedor/), quadros do plano B e pôster (public/img/).
// Uso: node ferramentas/gerar-imagens.mjs [molde|quadros|tudo]
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PW = process.env.PLAYWRIGHT_CORE || '/opt/node-tools/node_modules/playwright-core';
const { chromium } = await import(path.join(PW, 'index.mjs'));
const modo = process.argv[2] || 'tudo';
const TIPOS = { '.html': 'text/html', '.js': 'text/javascript' };
const srv = http.createServer((q, r) => { const a = path.join(RAIZ, decodeURIComponent(q.url.split('?')[0])); fs.readFile(a, (e, d) => e ? r.writeHead(404).end() : r.writeHead(200, { 'content-type': TIPOS[path.extname(a)] || 'application/octet-stream' }).end(d)); }).listen(0);
const porta = srv.address().port;
const b = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage(); p.on('console', m => m.type() === 'error' && console.log('console:', m.text()));
await p.goto(`http://localhost:${porta}/ferramentas/render.html`); await p.waitForFunction(() => window.pronto, null, { timeout: 60000 });
const salvar = (url, arq) => { fs.mkdirSync(path.dirname(arq), { recursive: true }); fs.writeFileSync(arq, Buffer.from(url.split(',')[1], 'base64')); };
const rend = o => p.evaluate(o => window.renderizar(o), o);

if (modo === 'molde' || modo === 'tudo') {
  const dir = path.join(RAIZ, 'referencias-3d', 'moedor');
  const vistas = { frente: { rot: 0, elev: 2 }, perfil: { rot: -Math.PI / 2, elev: 2 }, 'tres-quartos': { rot: -.7, elev: 20 }, verso: { rot: Math.PI, elev: 2 }, topo: { rot: 0, elev: 89.5 }, base: { rot: 0, elev: -89.5 }, explodida: { rot: -.7, elev: 14, e: 1 } };
  for (const [nome, o] of Object.entries(vistas)) { const r = await rend({ w: 600, h: 900, e: 0, ...o }); salvar(r.url, path.join(dir, `molde-${nome}.png`)); console.log('molde', nome); }
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...['frente', 'perfil', 'tres-quartos', 'verso'].flatMap(n => ['-i', path.join(dir, `molde-${n}.png`)]), '-filter_complex', 'color=c=0xF4EFE8:s=2400x900[f];[0][1][2][3]hstack=4[h];[f][h]overlay', '-frames:v', '1', path.join(dir, 'molde-folha-4-vistas.jpg')]);
  console.log(JSON.stringify(await p.evaluate(() => window.info())));
}
if (modo === 'quadros' || modo === 'tudo') {
  const { QUADROS } = await import(path.join(RAIZ, 'src', 'roteiro.js'));
  const dir = path.join(RAIZ, 'public', 'img', 'quadros'); const ancoras = [];
  for (let i = 0; i < QUADROS; i++) {
    const r = await rend({ w: 640, h: 800, t: i / (QUADROS - 1), tipo: 'image/webp', q: .72 });
    salvar(r.url, path.join(dir, `q${String(i).padStart(2, '0')}.webp`));
    ancoras.push(Object.fromEntries(Object.entries(r.ancoras).map(([k, [x, y]]) => [k, [+(x / 640).toFixed(4), +(y / 800).toFixed(4)]])));
  }
  fs.writeFileSync(path.join(dir, 'ancoras.json'), JSON.stringify(ancoras));
  console.log('quadros', QUADROS);
}
await b.close(); srv.close();
