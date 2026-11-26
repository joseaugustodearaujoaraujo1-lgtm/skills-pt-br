// Folha de comparação das vistas entre etapas do pipeline 3D (molde × Blender × Three.js), com SSIM por vista.
// Uso: node comparar-vistas.mjs --pastas <molde>,<blender>,<threejs> --saida comparacao.png [--lado 320]
// Cada pasta tem <vista>.png (frente, lado, tres-quartos, costas, topo). Colunas na ordem das pastas; linhas por vista.
// Requer ffmpeg. SSIM vai de 0 a 1 (1 = idêntico) e é só um apoio: quem decide é o olho do usuário.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const av = process.argv.slice(2);
const opt = n => { const i = av.indexOf('--' + n); return i >= 0 ? av[i + 1] : undefined; };
const pastas = (opt('pastas') || '').split(',').map(s => s.trim()).filter(Boolean);
const saida = opt('saida');
const L = +opt('lado') || 320; // pequeno de propósito: a folha é lida pelo modelo (tokens)
if (pastas.length < 2 || !saida) { console.log('Uso: node comparar-vistas.mjs --pastas a,b[,c] --saida comparacao.png [--lado 320]'); process.exit(2); }
try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); } catch { console.log('Falta o ffmpeg.'); process.exit(2); }

const VISTAS = ['frente', 'lado', 'tres-quartos', 'costas', 'topo'];
const achar = (p, v) => ['.png', '.jpg', '.jpeg', '.webp'].map(e => path.join(p, v + e)).find(f => fs.existsSync(f));
const vistas = VISTAS.filter(v => pastas.some(p => achar(p, v)));
if (!vistas.length) { console.log(`Nenhuma vista encontrada (${VISTAS.join(', ')}).`); process.exit(1); }

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'comparar-'));
const ff = a => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a], { stdio: ['ignore', 'pipe', 'pipe'] });
const ajustar = `scale=${L}:${L}:force_original_aspect_ratio=decrease,pad=${L}:${L}:(ow-iw)/2:(oh-ih)/2:color=0xe9e9e9,format=rgb24`;
const quadro = (f, destino) => f ? ff(['-i', f, '-vf', ajustar, '-frames:v', '1', destino]) : ff(['-f', 'lavfi', '-i', `color=c=0x777777:s=${L}x${L}`, '-frames:v', '1', destino]);

const linhas = [];
console.log(`Colunas: ${pastas.map((p, i) => `${i + 1}=${p}`).join('  ')}`);
for (const v of vistas) {
  const quadros = pastas.map((p, i) => { const d = path.join(tmp, `${v}-${i}.png`); quadro(achar(p, v), d); return { d, existe: !!achar(p, v) }; });
  const ssim = quadros.slice(1).map((q, i) => quadros[i].existe && q.existe ? medirSsim(quadros[i].d, q.d) : "—");
  const linha = path.join(tmp, `linha-${v}.png`);
  ff([...quadros.flatMap(q => ['-i', q.d]), '-filter_complex', `${quadros.map((_, i) => `[${i}]`).join('')}hstack=inputs=${quadros.length}`, linha]);
  linhas.push(linha);
  console.log(`${v.padEnd(13)} SSIM entre colunas vizinhas: ${ssim.map((s, i) => `${i + 1}→${i + 2} ${s}`).join('  ')}${quadros.some(q => !q.existe) ? '  (cinza = vista faltando)' : ''}`);
}
fs.mkdirSync(path.dirname(path.resolve(saida)), { recursive: true });
if (linhas.length === 1) fs.copyFileSync(linhas[0], saida);
else ff([...linhas.flatMap(l => ['-i', l]), '-filter_complex', `${linhas.map((_, i) => `[${i}]`).join('')}vstack=inputs=${linhas.length}`, saida]);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\nFolha: ${saida}`);

// O ffmpeg escreve o resultado do filtro ssim no stderr.
function medirSsim(a, b) {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-i", a, "-i", b, "-lavfi", "ssim", "-f", "null", "-"], { encoding: "utf8" });
  return ((r.stderr || "").match(/All:([\d.]+)/) || [])[1] || "?";
}
