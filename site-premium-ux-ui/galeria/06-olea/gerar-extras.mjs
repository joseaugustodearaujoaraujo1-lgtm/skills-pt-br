// Renderiza as cenas extras (src/cenas-extra.js) e a bancada com o sabonete flutuando. Uso: node gerar-extras.mjs
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('/opt/node-tools/node_modules/playwright-core');
execSync('npx esbuild src/cenas-extra.js --bundle --format=iife --global-name=Extra --outfile=cena/extra-iife.js --log-level=warning');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1000, height: 800 } });
p.on('pageerror', e => console.log('[erro]', e.message));
await p.setContent('<body style="margin:0"></body>'); await p.addScriptTag({ path: 'cena/extra-iife.js' });
const jobs = [['pilha-1', 'pilha', [1], 900, 900], ['pilha-2', 'pilha', [2], 900, 900], ['pilha-3', 'pilha', [3], 900, 900], ['pilha-cores', 'pilhaColorida', [], 1000, 1200], ['beirada', 'beirada', [], 1600, 1000], ['borda-azulejo', 'bordaAzulejo', [], 1920, 1080], ['azeitonas', 'azeitonas', [], 1920, 1080]];
for (const [nome, fn, args, w, h] of jobs) {
  const d = await p.evaluate(({ fn, args, w, h }) => { const c = document.createElement('canvas'); c.width = w; c.height = h; Extra[fn](c, ...args, { w, h }); return c.toDataURL('image/webp', .84).split(',')[1]; }, { fn, args, w, h });
  fs.writeFileSync(`public/img/${nome}.webp`, Buffer.from(d, 'base64')); console.log(nome, d.length * .75 / 1024 | 0, 'KB');
}
await b.close();
