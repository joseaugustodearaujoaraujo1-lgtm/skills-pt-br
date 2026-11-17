// Baixa fontes do Google Fonts (licença OFL) para o próprio site e gera fonts.css: sem requisição a terceiros (mais rápido, melhor LCP,
// e sem enviar o IP do visitante ao Google, relevante para a LGPD). Só o subconjunto "latin" (cobre português).
// Uso: node baixar-fontes.mjs --familias "Playfair Display:ital@0;1,Inter,Jost" --saida ./public/fonts [--preload "Playfair Display,Inter"]
// Saída: <saida>/*.woff2 + <saida>/fonts.css (com font-display: swap) + sugestão de <link rel=preload> para a fonte do título.
import fs from 'node:fs';
import path from 'node:path';

const args = {}; const av = process.argv.slice(2);
for (let i = 0; i < av.length; i++) if (av[i].startsWith('--')) { const p = av[i + 1]; args[av[i].slice(2)] = p && !p.startsWith('--') ? av[++i] : true; }
if (!args.familias || !args.saida) { console.error('Uso: node baixar-fontes.mjs --familias "Playfair Display:ital@0;1,Inter" --saida ./public/fonts'); process.exit(1); }
const saida = path.resolve(args.saida); fs.mkdirSync(saida, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'; // pede woff2 moderno

const fam = String(args.familias).split(/,(?=[A-Z])/).map(s => s.trim()).filter(Boolean); // separa por vírgula só antes de maiúscula (mantém "ital@0;1")
const url = 'https://fonts.googleapis.com/css2?' + fam.map(f => 'family=' + encodeURIComponent(f).replace(/%3A/g, ':').replace(/%40/g, '@').replace(/%3B/g, ';').replace(/%2C/g, ',')).join('&') + '&display=swap';
const css = await (await fetch(url, { headers: { 'User-Agent': UA } })).text();
if (!/@font-face/.test(css)) { console.error('Resposta inesperada do Google Fonts:\n' + css.slice(0, 300)); process.exit(1); }

const blocos = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)].map(m => ({ subconjunto: m[1], texto: m[2] }));
const latin = blocos.filter(b => b.subconjunto === 'latin');
let saidaCss = '/* Fontes hospedadas localmente (Google Fonts, licença OFL), subconjunto latin. Gerado por baixar-fontes.mjs */\n', total = 0;
const arquivos = [];
for (const b of latin) {
  const familia = b.texto.match(/font-family:\s*'([^']+)'/)[1], estilo = b.texto.match(/font-style:\s*(\w+)/)[1], peso = b.texto.match(/font-weight:\s*([\d ]+)/)[1].trim();
  const src = b.texto.match(/url\(([^)]+)\)/)[1];
  const nome = `${familia.toLowerCase().replace(/\s+/g, '-')}-${estilo}-${peso.replace(/\s+/g, '-')}.woff2`;
  const buf = Buffer.from(await (await fetch(src, { headers: { 'User-Agent': UA } })).arrayBuffer());
  fs.writeFileSync(path.join(saida, nome), buf); total += buf.length; arquivos.push({ nome, familia, estilo, kb: +(buf.length / 1024).toFixed(1) });
  saidaCss += b.texto.replace(/url\([^)]+\)(\s*format\([^)]*\))?/, `url(${nome}) format('woff2')`).replace(/\s+/g, ' ').replace(/ ?\{ ?/, ' { ').replace(/ ?\} ?$/, ' }') + '\n';
}
fs.writeFileSync(path.join(saida, 'fonts.css'), saidaCss);
console.log(`${arquivos.length} arquivos, ${(total / 1024).toFixed(1)} KB em ${saida}`);
for (const a of arquivos) console.log(`  ${a.nome} (${a.kb} KB)`);
console.log('\nNo <head> (CSS primeiro; preload só da fonte do título e do corpo, se forem usadas na primeira dobra):');
console.log('<link rel="stylesheet" href="fonts/fonts.css">');
const alvos = String(args.preload || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
for (const a of (alvos.length ? arquivos.filter(x => alvos.some(n => x.nome.startsWith(n.replace(/\s+/g, '-')))) : arquivos.slice(0, 2))) console.log(`<link rel="preload" href="fonts/${a.nome}" as="font" type="font/woff2" crossorigin>`);
