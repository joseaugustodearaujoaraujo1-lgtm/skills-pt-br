// Renderiza as 8 pranchas do "hall da fama" e o pôster do hero a partir da cena 3D real (prancha.js). Servidor ligado: node servir.mjs 3003
import fs from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('/opt/node-tools/node_modules/playwright-core');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1000, height: 1000 } });
await p.goto('http://localhost:3003/fonts/fonts.css');
const out = await p.evaluate(async () => {
  document.head.innerHTML = '<link rel="stylesheet" href="/fonts/fonts.css">'; await new Promise(r => setTimeout(r, 300)); await document.fonts.load('800 64px "Mona Sans"');
  const { montarPrancha, PRANCHAS } = await import('/prancha.js');
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; Object.assign(c.style, { width: w + 'px', height: h + 'px' }); document.body.append(c); return c; };
  const r = {};
  const c1 = mk(700, 700); const x = montarPrancha(c1, { manual: true, distancia: 15 }); x.tamanho();
  PRANCHAS.forEach((_, i) => { x.trocar(i); x.quadro(-.42, .18, -.95); r[`prancha-${i}`] = c1.toDataURL('image/webp', .86).split(',')[1]; });
  const c2 = mk(900, 900); const y = montarPrancha(c2, { manual: true, distancia: 12.5 }); y.tamanho(); y.trocar(0); y.quadro(-.5, .1, -.62); r['prancha-hero'] = c2.toDataURL('image/webp', .86).split(',')[1];
  return r;
});
for (const [k, v] of Object.entries(out)) fs.writeFileSync(new URL(`./public/img/${k}.webp`, import.meta.url), Buffer.from(v, 'base64'));
console.log(Object.keys(out).length, 'renders'); await b.close();
