// Renderiza o molde (4 vistas) e mede o perfil. Uso: node ferramentas/molde.mjs
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE || '/opt/node-tools/node_modules/playwright-core');
const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SAIDA = path.join(AQUI, '..', 'referencias-3d', 'diamante'); fs.mkdirSync(SAIDA, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage(); p.on('console', m => console.log('console:', m.text())); p.on('pageerror', e => console.log('erro:', e.message));
await p.goto('file://' + path.join(AQUI, 'render.html'));
const luz = [-.45, .7, .55];
const vistas = [
  { nome: 'frente', rotY: 0, incl: 0, luz },
  { nome: 'tres-quartos', rotY: .2, incl: .38, luz },
  { nome: 'topo', rotY: 0, incl: Math.PI / 2, luz },
  { nome: 'base', rotY: 0, incl: -Math.PI / 2, luz },
];
const t0 = Date.now();
const imgs = await p.evaluate(v => window.renderizar(v, 600), vistas);
console.log('render', Date.now() - t0, 'ms');
imgs.forEach((d, i) => fs.writeFileSync(path.join(SAIDA, `molde-${vistas[i].nome}.png`), Buffer.from(d.split(',')[1], 'base64')));
const med = await p.evaluate(() => { const r = window.planosDiamante(); return { n: r.planos.length, tipos: r.planos.reduce((a, x) => (a[x.tipo] = (a[x.tipo] || 0) + 1, a), {}), medidas: r.medidas }; });
console.log(JSON.stringify(med));
await b.close();
