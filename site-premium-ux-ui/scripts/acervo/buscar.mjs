// Busca no acervo. Uso: node buscar.mjs [--texto joia] [--nicho fashion] [--estilo 3d] [--lib three] [--desde 2022] [--fonte awwwards] [--limite 20]
import fs from 'node:fs';
import path from 'node:path';
import { args, pastaFonte } from './_comum.mjs';
import { capturaInvalida } from '../qualidade.mjs';

const a = args(); const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const fontes = a.fonte ? [a.fonte] : ['awwwards', 'onepagelove'];
let achados = [];
for (const f of fontes) {
  let L = []; try { L = JSON.parse(fs.readFileSync(path.join(pastaFonte(f), 'acervo.json'), 'utf8')); } catch { continue; }
  for (const s of L) {
    if (s.erroDesktop || capturaInvalida(s)) continue;
    const alvo = norm([s.titulo, s.url, s.nicho, ...(s.generos || []), ...(s.estilos || [])].join(' '));
    if (a.texto && !alvo.includes(norm(a.texto))) continue;
    if (a.nicho && !norm(s.nicho).includes(norm(a.nicho))) continue;
    if (a.estilo && !(s.estilos || []).some(e => norm(e).includes(norm(a.estilo)))) continue;
    if (a.lib && !s.libs?.[a.lib]) continue;
    if (a.desde && (s.ano || 0) < +a.desde) continue;
    achados.push({ fonte: f, ...s });
  }
}
achados.sort((x, y) => (y.ano || 0) - (x.ano || 0));
const n = +a.limite || 20;
console.log(`${achados.length} sites; mostrando ${Math.min(n, achados.length)}:\n`);
for (const s of achados.slice(0, n)) console.log(`- ${s.titulo} (${s.ano ?? '?'}, ${s.fonte}) ${s.nicho}\n  ${s.urlFinal || s.url}\n  ${path.join(pastaFonte(s.fonte), s.slug)}`);
