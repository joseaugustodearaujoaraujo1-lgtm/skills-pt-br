// Gera public/xicara.webp: render da PRÓPRIA cena 3D (plano B e LCP do hero). Rode com o servidor ligado: node servir.mjs 3001
import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
const { chromium } = (() => { try { return req('playwright'); } catch { return req(req('node:child_process').execSync('npm root -g').toString().trim() + '/playwright'); } })();
import fs from 'node:fs';

const url = process.argv[2] || 'http://localhost:3001/';
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'load' });
await page.waitForSelector('.hero-midia.ao-vivo', { timeout: 30000 });
await page.addStyleTag({ content: '.hero-legenda,body::after{display:none!important}.hero-midia{animation:none!important;border-color:transparent!important}' });
await page.waitForTimeout(2500);
const png = await page.locator('.hero-midia').screenshot({ type: 'png' });
const webp = await page.evaluate(async (b64) => {
  const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
  const c = document.createElement('canvas'); c.width = 920; c.height = 1150;
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/webp', 0.82).split(',')[1];
}, png.toString('base64'));
fs.writeFileSync(new URL('./public/xicara.webp', import.meta.url), Buffer.from(webp, 'base64'));
console.log('public/xicara.webp', (Buffer.from(webp, 'base64').length / 1024).toFixed(1), 'KB');
await browser.close();
