// Acha o Blender e roda em segundo plano (sem janela). Uso: node rodar.mjs <argumentos do blender...>
// Ex.: node rodar.mjs referencias-3d/obj/2-blender/obj.blend --python vistas.py -- --saida vistas
//      node rodar.mjs --python modelar.py          (cena nova, roda o script de modelagem)
// Procura em BLENDER, no PATH e nas pastas padrão do Windows, macOS e Linux. Saída resumida para gastar poucos tokens.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const pastasWin = ['C:/Program Files/Blender Foundation', path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Blender Foundation')];
const FERRAMENTAS = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'ferramentas'); // Blender portátil
const candidatos = [process.env.BLENDER,
  ...(() => { try { return fs.readdirSync(FERRAMENTAS).sort().reverse().map(v => path.join(FERRAMENTAS, v, 'blender.exe')); } catch { return []; } })(),
  ...pastasWin.flatMap(d => { try { return fs.readdirSync(d).sort().reverse().map(v => path.join(d, v, 'blender.exe')); } catch { return []; } }),
  '/Applications/Blender.app/Contents/MacOS/Blender', '/usr/bin/blender', '/snap/bin/blender'].filter(Boolean);
let blender = candidatos.find(c => fs.existsSync(c));
if (!blender && spawnSync('blender', ['--version']).status === 0) blender = 'blender';
if (!blender) { console.log('Blender não encontrado. Instale (gratuito, blender.org) ou defina BLENDER=caminho.'); process.exit(2); }

const r = spawnSync(blender, ['--background', '--factory-startup', ...process.argv.slice(2)], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const linhas = (r.stdout + '\n' + r.stderr).split(/\r?\n/);
// mostra só o que importa: linhas do script (OK/ERRO/AVISO), erros do Python e o fim
const uteis = linhas.filter(l => /^(OK|ERRO|AVISO|FALTA)\b|Error|Traceback|^\s+File "|Exception/.test(l));
console.log([...new Set(uteis)].slice(-40).join('\n') || linhas.filter(Boolean).slice(-8).join('\n'));
process.exit(r.status ?? 1);
