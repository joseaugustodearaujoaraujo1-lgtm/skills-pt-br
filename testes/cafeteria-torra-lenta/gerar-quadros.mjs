// Gera public/ritual/q-00.webp … q-59.webp: sequência de quadros da PRÓPRIA cena 3D para a seção Ritual (pin + scrub em canvas).
// Funciona sem GPU no visitante e no celular. Rode com o servidor ligado: node servir.mjs 3001 && node gerar-quadros.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
const req = createRequire(import.meta.url);
const { chromium } = (() => { try { return req('playwright'); } catch { return req(req('node:child_process').execSync('npm root -g').toString().trim() + '/playwright'); } })();

const N = 60, LADO = 640, FUNDO = '#110c08', url = process.argv[2] || 'http://localhost:3001/';
const pasta = new URL('./public/ritual/', import.meta.url); fs.mkdirSync(pasta, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
await page.goto(url, { waitUntil: 'load' });
const quadros = await page.evaluate(async ({ N, LADO, FUNDO }) => {
  const { montarXicara } = await import(new URL('./xicara.js', location.href).href);
  const c = document.createElement('canvas');
  Object.assign(c.style, { position: 'fixed', left: 0, top: 0, width: LADO + 'px', height: LADO + 'px', zIndex: 999 });
  document.body.append(c);
  const x = montarXicara(c, { manual: true }); x.tamanho(); await x.compilar();
  const suave = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
  const plano = document.createElement('canvas'); plano.width = plano.height = LADO; const g = plano.getContext('2d');
  const saida = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    x.quadroFixo(-0.45 + t * Math.PI * 1.7, suave(0.5, 1, t), 1 - suave(0.35, 0.7, t), t * 9);
    g.fillStyle = FUNDO; g.fillRect(0, 0, LADO, LADO); g.drawImage(c, 0, 0, LADO, LADO);
    saida.push(plano.toDataURL('image/webp', 0.74).split(',')[1]);
  }
  return saida;
}, { N, LADO, FUNDO });
let total = 0;
quadros.forEach((b64, i) => { const buf = Buffer.from(b64, 'base64'); total += buf.length; fs.writeFileSync(new URL(`q-${String(i).padStart(2, '0')}.webp`, pasta), buf); });
console.log(`${N} quadros em public/ritual/, ${(total / 1024).toFixed(0)} KB no total`);
await browser.close();
