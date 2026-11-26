// Grava a prévia do site (hero + lapidação + peças) quadro a quadro. Uso: node ferramentas/previa.mjs <url> <pastaQuadros>
import { createRequire } from 'module'; import fs from 'fs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE || '/opt/node-tools/node_modules/playwright-core');
const [url, saida] = process.argv.slice(2); fs.mkdirSync(saida, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(4000);
const alt = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
let n = 0; const foto = async () => p.screenshot({ path: `${saida}/f-${String(n++).padStart(3, '0')}.jpg`, quality: 80 });
for (let i = 0; i < 24; i++) { const t = i / 23; await p.mouse.move(1280 * (.2 + .6 * t), 800 * (.2 + .25 * Math.sin(t * 6))); await p.waitForTimeout(250); await foto(); }
for (let i = 0; i <= 60; i++) { await p.evaluate(y => scrollTo(0, y), Math.round(alt * .78 * (i / 60))); await p.waitForTimeout(300); await foto(); }
await b.close(); console.log(n, 'quadros');
