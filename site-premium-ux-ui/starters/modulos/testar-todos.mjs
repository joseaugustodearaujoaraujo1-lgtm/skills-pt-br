// Constrói cada exemplo, sobe o servidor, roda o verificar-site.mjs e resume. Uso: node testar-todos.mjs [pasta-do-módulo ...]
// Precisa de: npm install (nesta pasta) e PLAYWRIGHT_CORE apontando para o playwright-core.
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.env.PLAYWRIGHT_CORE ||= fs.existsSync('/opt/node-tools/node_modules/playwright-core') ? '/opt/node-tools/node_modules/playwright-core' : '';
const aqui = path.dirname(fileURLToPath(import.meta.url));
const verificador = path.resolve(aqui, '../../scripts/verificar-site.mjs');
const alvos = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(aqui).filter(d => /^\d\d-/.test(d)).sort();
let falhou = false, porta = 3150;
for (const m of alvos) {
  const dir = path.join(aqui, m, 'exemplo'), p = porta++;
  execFileSync('npm', ['run', 'build', '--silent'], { cwd: dir, stdio: 'inherit' });
  const srv = spawn('node', ['servir.mjs', String(p)], { cwd: dir, stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 700));
  let saida = '', codigo = 0;
  try { saida = execFileSync('node', [verificador, `http://localhost:${p}/`, '--saida', path.join(process.env.TMPDIR || '/tmp', 'verif-' + m), '--espera', '2500'], { encoding: 'utf8' }); }
  catch (e) { saida = (e.stdout || '') + (e.stderr || ''); codigo = e.status || 1; }
  srv.kill();
  const res = saida.match(/(\d+) FAIL · (\d+) WARN/) || [], fails = +(res[1] ?? 1), warns = +(res[2] ?? 0);
  console.log(`${m}: ${codigo === 0 && !fails ? 'OK' : 'FALHOU'}  (FAIL ${fails}, WARN ${warns})`);
  if (codigo || fails) { falhou = true; console.log(saida.split('\n').filter(l => /FAIL/.test(l) && !/^Resultado/.test(l)).join('\n')); }
}
process.exit(falhou ? 1 : 0);
