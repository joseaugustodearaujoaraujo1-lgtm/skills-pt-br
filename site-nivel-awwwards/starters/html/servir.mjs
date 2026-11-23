// Servidor estático do projeto (pasta public/), com gzip.
// Uso: node servir.mjs [porta]  ·  node servir.mjs --porta 3005  ·  PORT=3005 node servir.mjs  ·  npm run serve -- 3005
// Padrão: a porta do criar-projeto --porta (3001 sem ela). Se a porta estiver ocupada, tenta as 10 seguintes e diz qual usou (vários projetos abertos ao mesmo tempo).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');
const av = process.argv.slice(2), iP = av.indexOf('--porta');
const PORTA = +(iP >= 0 ? av[iP + 1] : av.find(a => /^\d+$/.test(a))) || +process.env.PORT || +'{{PORTA}}' || 3001; // o número entre aspas vem do criar-projeto --porta
const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json' };
const COMPRIME = new Set(['.html', '.css', '.js', '.svg', '.json']);

const servidor = http.createServer((req, res) => {
  let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  const arq = path.normalize(path.join(RAIZ, rel));
  if (!arq.startsWith(RAIZ)) { res.writeHead(403).end(); return; }
  fs.readFile(arq, (erro, dados) => {
    if (erro) { res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Não encontrado'); return; }
    const ext = path.extname(arq).toLowerCase();
    const cab = { 'content-type': TIPOS[ext] || 'application/octet-stream', 'cache-control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable' };
    if (COMPRIME.has(ext) && /gzip/.test(req.headers['accept-encoding'] || '')) { cab['content-encoding'] = 'gzip'; dados = zlib.gzipSync(dados); }
    res.writeHead(200, cab).end(dados);
  });
});
let tentativa = 0;
servidor.on('error', e => {
  if (e.code === 'EADDRINUSE' && ++tentativa <= 10) { console.log(`Porta ${PORTA + tentativa - 1} ocupada; tentando ${PORTA + tentativa}.`); servidor.listen(PORTA + tentativa); }
  else { console.error(e.message); process.exit(1); }
});
servidor.on('listening', () => console.log(`Projeto em http://localhost:${servidor.address().port}/`));
servidor.listen(PORTA);
