// Captura as vistas padrão de qualquer página que aceite ?vista=<nome>: o elemento Three.js (módulo 07) e o molde SVG (starters/molde/molde.html, por file:///).
// Uso: node capturar-vistas-three.mjs --url http://localhost:3100/ --saida referencias-3d/<obj>/3-threejs/vistas [--lado 1024] [--espera 4000]
// Usa o Chrome/Chromium em modo headless (sem Playwright). Sem GPU o Chrome usa renderizador de software: confira o resultado com GPU real.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const av = process.argv.slice(2);
const opt = n => { const i = av.indexOf('--' + n); return i >= 0 ? av[i + 1] : undefined; };
const url = opt('url'), saida = opt('saida');
const L = +opt('lado') || 1024, espera = +opt('espera') || 4000;
if (!url || !saida) { console.log('Uso: node capturar-vistas-three.mjs --url <página> --saida <pasta> [--lado 1024] [--espera 4000]'); process.exit(2); }

const chrome = [process.env.CHROME,
  process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'Application', 'chrome.exe'),
  'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean).find(c => fs.existsSync(c));
if (!chrome) { console.log('Chrome não encontrado: defina CHROME=caminho.'); process.exit(2); }

// O Chrome headless tem largura mínima de janela (~500 px no Windows): captura em J ≥ 1024 e reduz com ffmpeg.
const J = Math.max(L, 1024);
const VISTAS = ['frente', 'lado', 'tres-quartos', 'costas', 'topo'];
fs.mkdirSync(saida, { recursive: true });
const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'vistas-chrome-'));
let falhas = 0;
for (const v of VISTAS) {
  const u = new URL(url); u.searchParams.set('vista', v); u.searchParams.set('captura', '1');
  const destino = path.resolve(saida, `${v}.png`);
  const r = spawnSync(chrome, ['--headless=new', '--hide-scrollbars', '--force-device-scale-factor=1', '--enable-unsafe-swiftshader', '--use-angle=swiftshader',
    `--window-size=${J},${J}`, `--virtual-time-budget=${espera}`, `--user-data-dir=${perfil}`, `--screenshot=${destino}`, u.href], { encoding: 'utf8', timeout: 120000 });
  let ok = fs.existsSync(destino) && r.status === 0;
  if (ok && L < J) {
    const tmp = destino.replace(/.png$/, '.tmp.png'); fs.renameSync(destino, tmp);
    ok = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-vf', `scale=${L}:${L}:flags=lanczos`, destino]).status === 0;
    fs.rmSync(tmp, { force: true });
  }
  if (!ok) falhas++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${v}: ${ok ? destino : (r.stderr || r.error || '').toString().split('\n').slice(-3).join(' ')}`);
}
fs.rmSync(perfil, { recursive: true, force: true });
process.exit(falhas ? 1 : 0);
