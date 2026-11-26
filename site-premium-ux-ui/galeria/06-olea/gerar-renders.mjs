// Renderiza o sabonete OLEA (src/sabonete.js) em quadros WebP com transparência.
// Uso: node gerar-renders.mjs teste   → cena/teste-*.webp (4 ângulos)
//      node gerar-renders.mjs         → public/img/giro/NN.webp (sequência do hero) + poses avulsas
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('/opt/node-tools/node_modules/playwright-core');
const teste = process.argv[2] === 'teste';
execSync('npx esbuild src/sabonete.js --bundle --format=iife --global-name=Sab --outfile=cena/sabonete-iife.js --log-level=warning');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1000, height: 1000 } });
p.on('pageerror', e => console.log('[erro]', e.message));
await p.setContent('<body style="margin:0;background:transparent"><canvas id="c" width="900" height="900"></canvas></body>');
await p.addScriptTag({ path: 'cena/sabonete-iife.js' });
await p.evaluate(() => { window.s = Sab.montarSabonete(document.getElementById('c')); });
const salvar = async (pose, nome) => { const d = await p.evaluate(q => { s.quadro(q); return document.getElementById('c').toDataURL('image/webp', .86).split(',')[1]; }, pose); fs.writeFileSync(nome, Buffer.from(d, 'base64')); return d.length * .75 / 1024 | 0; };
if (teste) {
  const poses = [{ rx: 0 }, { rx: .95, rz: .35 }, { rx: 1.42, rz: .1 }, { rx: .55, ry: .4, rz: -.25 }];
  for (const [i, q] of poses.entries()) console.log(i, await salvar(q, `cena/teste-${i}.webp`), 'KB');
} else {
  fs.mkdirSync('public/img/giro', { recursive: true });
  // hero: de cima → vira de lado mostrando a espessura → volta de cima (como o porta-copos do original)
  const N = 48; let total = 0;
  for (let i = 0; i < N; i++) { const t = i / (N - 1), k = Math.sin(t * Math.PI);
    total += await salvar({ rx: k * 1.25, ry: t * 1.2, rz: k * .45 }, `public/img/giro/${String(i).padStart(2, '0')}.webp`); }
  console.log(N, 'quadros', total, 'KB');
  const poses = { cima: { rx: 0 }, inclinado: { rx: .7, rz: .2 }, lado: { rx: 1.42, rz: .1 }, tres: { rx: .55, ry: .4, rz: -.25 } };
  for (const [n, q] of Object.entries(poses)) console.log(n, await salvar(q, `public/img/sabonete-${n}.webp`), 'KB');
}
await b.close();
