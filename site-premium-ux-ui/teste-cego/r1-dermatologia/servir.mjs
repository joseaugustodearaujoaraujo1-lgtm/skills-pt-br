// Servidor estático do projeto (pasta public/), com gzip. Uso: node servir.mjs 3001
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');
const PORTA = +process.argv[2] || 3001;
const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json' };
const COMPRIME = new Set(['.html', '.css', '.js', '.svg', '.json']);

http.createServer((req, res) => {
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
}).listen(PORTA, () => console.log(`Projeto em http://localhost:${PORTA}/`));
