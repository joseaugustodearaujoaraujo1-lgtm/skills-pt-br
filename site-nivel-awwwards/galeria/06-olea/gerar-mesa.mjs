// Renderiza a bancada 3D (src/cena-mesa.js): abertura inclinada e desfocada + vista de cima. Uso: node gerar-mesa.mjs [teste]
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('/opt/node-tools/node_modules/playwright-core');
const teste = process.argv[2] === 'teste';
execSync('npx esbuild src/cena-mesa.js --bundle --format=iife --global-name=Mesa --outfile=cena/mesa-iife.js --log-level=warning');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1500, height: 1000 } });
p.on('pageerror', e => console.log('[erro]', e.message)); p.on('console', m => m.type() === 'error' && console.log('[c]', m.text()));
await p.setContent('<body style="margin:0"><canvas id="c" width="1920" height="1080"></canvas></body>');
await p.addScriptTag({ path: 'cena/mesa-iife.js' });
await p.evaluate(() => { window.m = Mesa.montarMesa(document.getElementById('c'), { largura: 1920, altura: 1080, parede: true }); });
const poses = {
  flutua: { pos: [1.4, 2.5, 8.6], alvo: [-.4, 1.25, -1], subir: 1.1 },
  abertura: { pos: [2.2, 3.6, 4.2], alvo: [0, 0, 0] },
  cima: { pos: [0, 7.4, .01], alvo: [0, 0, 0] },
  bancada: { pos: [1.4, 2.5, 8.6], alvo: [-.4, 1.25, -1] },
};
fs.mkdirSync('public/img', { recursive: true });
for (const [n, q] of Object.entries(poses)) {
  const d = await p.evaluate(q => { m.peca.position.y = .02 + .17 * .95 + (q.subir || 0); m.peca.rotation.set(q.subir ? .25 : 0, 0, q.subir ? -.12 : 0); m.quadro(q); return document.getElementById('c').toDataURL('image/webp', .84).split(',')[1]; }, q);
  const arq = teste ? `cena/mesa-${n}.webp` : `public/img/mesa-${n}.webp`; fs.writeFileSync(arq, Buffer.from(d, 'base64')); console.log(arq, d.length * .75 / 1024 | 0, 'KB');
}
await b.close();
