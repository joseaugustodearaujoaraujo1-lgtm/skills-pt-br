// Servidor estático mínimo (pasta public/ do diretório atual), com gzip. Usado por `node servir.mjs [porta]` de cada exemplo.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

export function servir(portaPadrao = 3100) {
  const RAIZ = path.join(process.cwd(), 'public');
  const PORTA = +process.argv[2] || portaPadrao;
  const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json', '.woff2': 'font/woff2' };
  const COMPRIME = new Set(['.html', '.css', '.js', '.svg', '.json']);
  http.createServer((req, res) => {
    let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    const arq = path.normalize(path.join(RAIZ, rel));
    if (!arq.startsWith(RAIZ)) { res.writeHead(403).end(); return; }
    fs.readFile(arq, (erro, dados) => {
      if (erro) { res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Não encontrado'); return; }
      const ext = path.extname(arq).toLowerCase();
      const cab = { 'content-type': TIPOS[ext] || 'application/octet-stream', 'cache-control': 'no-cache' };
      if (COMPRIME.has(ext) && /gzip/.test(req.headers['accept-encoding'] || '')) { cab['content-encoding'] = 'gzip'; dados = zlib.gzipSync(dados); }
      res.writeHead(200, cab).end(dados);
    });
  }).listen(PORTA, () => console.log(`Exemplo em http://localhost:${PORTA}/`));
}
