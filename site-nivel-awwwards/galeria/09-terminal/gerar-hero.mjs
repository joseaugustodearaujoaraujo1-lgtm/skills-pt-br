// Renderiza o primeiro quadro do hero (caminhão-baú ao entardecer) em public/img/hero-1.webp.
// Uso: node gerar-hero.mjs
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('/opt/node-tools/node_modules/playwright-core');
fs.mkdirSync('cena', { recursive: true });
execSync('npx esbuild src/caminhao.js --bundle --format=iife --global-name=Cam --outfile=cena/caminhao-iife.js --log-level=warning');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1200 } });
p.on('pageerror', e => console.log('[erro]', e.message));
await p.setContent('<body style="margin:0"><canvas id="c" width="1920" height="1200"></canvas></body>');
await p.addScriptTag({ path: 'cena/caminhao-iife.js' });
const d = await p.evaluate(() => { const s = Cam.montar(document.getElementById('c')); s.quadro(); return document.getElementById('c').toDataURL('image/webp', .84).split(',')[1]; });
fs.writeFileSync('public/img/hero-1.webp', Buffer.from(d, 'base64'));
console.log('hero-1.webp', (d.length * .75 / 1024) | 0, 'KB');
await b.close();
