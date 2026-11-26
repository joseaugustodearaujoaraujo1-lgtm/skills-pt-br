// Utilidades comuns dos scripts do acervo: Playwright, Chrome, argumentos, slug, pastas.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

export const ACERVO = process.env.ACERVO || path.join(os.homedir(), 'Documents', 'acervos-design', 'acervo');
export const pastaFonte = fonte => path.join(ACERVO, fonte, 'final');

export function args(av = process.argv.slice(2)) {
  const a = { _: [] };
  for (let i = 0; i < av.length; i++) {
    if (av[i].startsWith('--')) { const p = av[i + 1]; a[av[i].slice(2)] = p && !p.startsWith('--') ? av[++i] : true; } else a._.push(av[i]);
  }
  return a;
}

export function carregarPlaywright() {
  const cands = [process.env.PLAYWRIGHT_CORE, path.join(process.cwd(), 'node_modules', 'playwright-core'), path.join(process.cwd(), 'node_modules', 'playwright'),
    path.join(os.homedir(), 'Documents', 'acervos-design', 'node_modules', 'playwright'), path.join(os.homedir(), 'Documents', 'acervos-design', 'node_modules', 'playwright-core'),
    '/opt/node-tools/node_modules/playwright-core'].filter(Boolean);
  for (const c of cands) { try { return createRequire(path.join(path.resolve(c), 'package.json'))(path.resolve(c)); } catch { /* próxima */ } }
  throw new Error('playwright não encontrado. Rode "npm i playwright" na pasta do acervo (e "npx playwright install chromium") ou defina PLAYWRIGHT_CORE=caminho.');
}

export function acharChrome() {
  const cands = [process.env.CHROME, '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', '/opt/pw-browsers/chromium/chrome-linux64/chrome',
    'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/google-chrome', '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
  return cands.find(c => fs.existsSync(c)) || undefined; // undefined: usa o Chromium do próprio Playwright
}

export async function abrirNavegador() {
  const { chromium } = carregarPlaywright();
  return chromium.launch({ headless: true, executablePath: acharChrome(), args: ['--no-sandbox'] });
}

export const slugDe = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/^https?:\/\/(www\.)?/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'site';
export const dormir = ms => new Promise(r => setTimeout(r, ms));

// Espera a página parar de mudar (preloader/intro): compara 2 amostras do tamanho do documento e do texto visível.
export async function esperarEstabilizar(page, max = 12000) {
  const t0 = Date.now(); let ant = '';
  while (Date.now() - t0 < max) {
    const atual = await page.evaluate(() => `${document.documentElement.scrollHeight}|${document.body?.innerText?.length || 0}|${document.querySelectorAll('canvas,video,img').length}`).catch(() => '');
    if (atual && atual === ant && Date.now() - t0 > 2500) return Date.now() - t0;
    ant = atual; await dormir(700);
  }
  return Date.now() - t0;
}
