// Recaptura um site em profundidade, esperando o intro acabar: hero + N pontos da rolagem (desktop 1440 ou celular 390).
// Uso: node recapturar.mjs --slug bennett-and-clive [--fonte awwwards] [--espera 12000] [--pontos 5] [--largura 390]
//      node recapturar.mjs --url https://exemplo.com --nome ref-nova [--fonte awwwards]
import fs from 'node:fs';
import path from 'node:path';
import { args, abrirNavegador, pastaFonte, slugDe, dormir, esperarEstabilizar } from './_comum.mjs';

const a = args(); const fonte = a.fonte || 'awwwards';
let url = a.url, slug = a.slug || a.nome || (url && slugDe(url));
if (!slug) { console.error('Uso: node recapturar.mjs --slug <slug> | --url <url> --nome <slug> [--espera 12000] [--pontos 5] [--largura 390]'); process.exit(1); }
const pasta = path.join(pastaFonte(fonte), slug); fs.mkdirSync(pasta, { recursive: true });
if (!url) { try { url = JSON.parse(fs.readFileSync(path.join(pasta, 'dados.json'), 'utf8')).urlFinal; } catch { console.error('dados.json não encontrado; passe --url'); process.exit(1); } }
const largura = +a.largura || 1440, mobile = largura < 600, pontos = +a.pontos || 5, prefixo = mobile ? 'recaptura-m' : 'recaptura-d';
const nav = await abrirNavegador();
const ctx = await nav.newContext({ viewport: { width: largura, height: mobile ? 844 : 900 }, isMobile: mobile, hasTouch: mobile });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
const t = await esperarEstabilizar(page, +a.espera || 12000);
const altura = await page.evaluate(() => innerHeight);
for (let i = 0; i < pontos; i++) {
  if (i > 0) { await page.mouse.wheel(0, altura * 0.9); await dormir(1300); }
  await page.screenshot({ path: path.join(pasta, `${prefixo}-${i + 1}.jpg`), type: 'jpeg', quality: 82 });
}
await nav.close();
console.log(`${pontos} capturas em ${pasta} (intro esperou ${Math.round(t / 1000)} s)`);
