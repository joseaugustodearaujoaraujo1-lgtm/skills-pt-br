// Capturas de conferência: node ferramentas/capturar.mjs <url> <largura> <pastaSaida> [pontos=0,.05,...]
import { createRequire } from 'module'; import fs from 'fs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE || '/opt/node-tools/node_modules/playwright-core');
const [url, larg = '1440', saida = 'cap', pts = '0,.04,.1,.15,.2,.27,.34,.42,.55,.7,.85,1'] = process.argv.slice(2);
fs.mkdirSync(saida, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const w = +larg, h = w < 500 ? 844 : w < 1000 ? 1024 : 900;
const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: w < 500, isMobile: w < 500 });
p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('console:', m.text().slice(0, 200)); }); p.on('pageerror', e => console.log('erro:', e.message));
await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(4500);
await p.mouse.move(w * .38, h * .3);
const alt = await p.evaluate(() => document.documentElement.scrollHeight);
for (const f of pts.split(',').map(Number)) {
  await p.evaluate(y => window.scrollTo(0, y), Math.round(f * (alt - h)));
  await p.waitForTimeout(1600);
  await p.screenshot({ path: `${saida}/${w}-${String(Math.round(f * 100)).padStart(3, '0')}.jpg`, quality: 70 });
}
console.log('altura', alt, 'viva', await p.evaluate(() => document.querySelector('.gema-caixa').classList.contains('viva')));
await b.close();
