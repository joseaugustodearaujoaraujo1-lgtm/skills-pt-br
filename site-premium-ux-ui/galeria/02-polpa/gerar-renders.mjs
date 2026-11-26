// Renderiza os "adesivos" de produto a partir da cena 3D real (picole.js): 6 sabores x 4 ângulos, WebP com transparência.
// Uso (com o servidor ligado: node servir.mjs 3002): node gerar-renders.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
const req = createRequire(import.meta.url);
const { chromium } = req('/opt/node-tools/node_modules/playwright-core');
const SABORES = ['morango', 'manga', 'maracuja', 'limao', 'coco', 'acai'];
const ANGULOS = [[-0.5, 0.08, 0.12], [0.35, -0.05, -0.18], [0, 0, 0], [0.9, 0.1, 0.3]];
const LADO = 900;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1000, height: 1000 } });
await p.goto('http://localhost:3002/fonts/fonts.css');
const out = await p.evaluate(async ({ SABORES, ANGULOS, LADO }) => {
  document.head.innerHTML = '<link rel="stylesheet" href="/fonts/fonts.css">'; await new Promise(r => setTimeout(r, 300));
  await document.fonts.load('400 170px Anton');
  const { montarPicole } = await import('/picole.js');
  const c = document.createElement('canvas'); c.width = c.height = LADO; Object.assign(c.style, { width: LADO + 'px', height: LADO + 'px' }); document.body.append(c);
  const x = montarPicole(c, { manual: true }); x.tamanho();
  const r = {};
  for (const s of SABORES) { x.trocar(s); ANGULOS.forEach((a, i) => { x.quadro(...a); r[`${s}-${i}`] = c.toDataURL('image/webp', .86).split(',')[1]; }); }
  return r;
}, { SABORES, ANGULOS, LADO });
let total = 0;
for (const [k, v] of Object.entries(out)) { const buf = Buffer.from(v, 'base64'); total += buf.length; fs.writeFileSync(new URL(`./public/img/picole-${k}.webp`, import.meta.url), buf); }
console.log(Object.keys(out).length, 'renders,', (total / 1024).toFixed(0), 'KB');
await b.close();
