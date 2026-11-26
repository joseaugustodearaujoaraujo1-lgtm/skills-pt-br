// Confere se a máquina está pronta para a skill. Uso: node scripts/diagnostico.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { ACERVO, pastaFonte } from './acervo/_comum.mjs';

const R = []; const ok = (n, v, dica = '') => R.push({ n, v, dica });
const cmd = c => { try { return execSync(c, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { return null; } };

const node = +process.versions.node.split('.')[0];
ok('Node 20 ou mais', node >= 20 ? 'ok' : `falta (tem ${process.versions.node})`, 'Instale em nodejs.org');

let pw = null;
for (const c of [process.env.PLAYWRIGHT_CORE, path.join(process.cwd(), 'node_modules', 'playwright-core'), path.join(process.cwd(), 'node_modules', 'playwright'), path.join(os.homedir(), 'Documents', 'acervos-design', 'node_modules', 'playwright'), '/opt/node-tools/node_modules/playwright-core'].filter(Boolean)) {
  try { pw = createRequire(path.join(path.resolve(c), 'package.json'))(path.resolve(c)); break; } catch {}
}
ok('Playwright', pw ? 'ok' : 'falta', 'npm i playwright && npx playwright install chromium');

const chromes = [process.env.CHROME, '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', '/opt/pw-browsers/chromium/chrome-linux64/chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
let navegador = chromes.find(c => fs.existsSync(c)) ? 'ok' : null;
if (!navegador && pw) { try { navegador = fs.existsSync(pw.chromium.executablePath()) ? 'ok' : null; } catch {} }
ok('Chrome/Chromium', navegador || 'falta', 'npx playwright install chromium (ou defina CHROME=caminho)');

ok('ffmpeg (converter imagens e vídeos)', cmd('ffmpeg -version') ? 'ok' : 'falta', 'Instale em ffmpeg.org (opcional, mas recomendado)');
ok('Python 3 (fidelidade.py, só em réplica)', cmd('python3 --version') || cmd('python --version') ? 'ok' : 'falta', 'Opcional');

let n = 0;
for (const f of ['awwwards', 'onepagelove']) { try { n += JSON.parse(fs.readFileSync(path.join(pastaFonte(f), 'acervo.json'), 'utf8')).length; } catch {} }
ok(`Acervo de sites (${ACERVO})`, n ? `ok (${n} sites)` : 'vazio', 'Opcional: monte com references/acervo-do-zero.md. Sem ele a pesquisa é ao vivo, mais fraca');

for (const r of R) console.log(`${/^ok/.test(r.v) ? 'OK   ' : 'FALTA'} ${r.n}: ${r.v}${/^ok/.test(r.v) ? '' : '  → ' + r.dica}`);
const obrig = R.slice(0, 3).every(r => /^ok/.test(r.v));
console.log(obrig ? '\nObrigatórios prontos. A skill já funciona.' : '\nFalta algo obrigatório (Node, Playwright e Chromium).');
process.exit(obrig ? 0 : 1);
