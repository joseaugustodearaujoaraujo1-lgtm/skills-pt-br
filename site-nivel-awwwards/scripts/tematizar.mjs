#!/usr/bin/env node
// Põe as cores de um site da galeria "por papel" e cria temas trocáveis por ?tema=<nome>.
// Uso: node scripts/tematizar.mjs galeria/05-bruma '{"vars":{"--musgo":"--cor-escura"},"hex":{"#E7B36A":"--cor-destaque"}}'
//  - vars: renomeia variáveis CSS existentes (em estilo.css, index.html e src/*.js).
//  - hex: troca cores literais do estilo.css por var(--papel) (a cor entra no :root).
// Gera os temas quente, frio e mono (mesma luminância de cada papel, então o contraste se mantém).
// O visual do tema padrão não muda. Idempotente: se já existir bloco de temas, não faz nada.
import fs from 'node:fs';
import path from 'node:path';

const pasta = path.resolve(process.argv[2] || '');
const mapa = JSON.parse(process.argv[3] || '{}');
const f = (...p) => path.join(pasta, ...p);
let css = fs.readFileSync(f('public', 'estilo.css'), 'utf8');
if (css.includes('data-paleta')) { console.log('já tematizado:', pasta); process.exit(0); }
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// 1. renomear variáveis (mais longas primeiro)
const arqs = [f('public', 'estilo.css'), f('public', 'index.html'), ...(fs.existsSync(f('src')) ? fs.readdirSync(f('src')).filter(n => n.endsWith('.js')).map(n => f('src', n)) : [])];
const vars = Object.entries(mapa.vars || {}).sort((a, b) => b[0].length - a[0].length);
for (const a of arqs) {
  let t = a === f('public', 'estilo.css') ? css : fs.readFileSync(a, 'utf8');
  for (const [v, n] of vars) t = t.replace(new RegExp(esc(v) + '(?![\\w-])', 'g'), n);
  if (a === f('public', 'estilo.css')) css = t; else fs.writeFileSync(a, t);
}
// 2. cores literais -> var(--papel)
const novos = [];
for (const [hex, papel] of Object.entries(mapa.hex || {})) {
  css = css.replace(new RegExp(esc(hex) + '(?![0-9a-fA-F])', 'gi'), `var(${papel})`); novos.push(`${papel}: ${hex.toLowerCase()}`);
}
// 3. :root com os papéis
const m = css.match(/:root\s*\{([^}]*)\}/);
if (!m) throw new Error('sem :root');
let corpo = m[1].replace(/\s+$/, '');
if (novos.length) corpo += '\n  ' + novos.join('; ') + ';';
const papeis = [...corpo.matchAll(/(--cor-[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)].map(x => [x[1], x[2]]);
if (!papeis.length) throw new Error('nenhum papel --cor-* com valor hex no :root');

// 3b. rgb(r g b / a) literais que casam com um papel viram color-mix (acompanham o tema)
const ladoPapel = [];
for (const [n, v] of papeis) { const c = v.slice(1); const h6 = c.length < 6 ? [...c].map(x => x + x).join('') : c; ladoPapel.push([n, [0, 2, 4].map(i => parseInt(h6.slice(i, i + 2), 16))]); }
let trocas = 0;
const fora = css.indexOf(m[0]) + m[0].length;
css = css.slice(0, fora) + css.slice(fora).replace(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)\s*(?:[\/,]\s*([\d.]+%?))?\s*\)/g, (t, r, g, b, a) => {
  const p = ladoPapel.find(([, c]) => c[0] === +r && c[1] === +g && c[2] === +b); if (!p) return t;
  const al = a === undefined ? 100 : a.endsWith('%') ? parseFloat(a) : Math.round(parseFloat(a) * 10000) / 100; trocas++;
  return `color-mix(in srgb, var(${p[0]}) ${al}%, transparent)`; });

// 4. temas
const rgb = h => { h = h.slice(1); if (h.length < 6) h = [...h].map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255); };
const hex = c => '#' + c.map(v => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0')).join('');
const lin = v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
const lum = c => .2126 * lin(c[0]) + .7152 * lin(c[1]) + .0722 * lin(c[2]);
const hsl = ([r, g, b]) => { const M = Math.max(r, g, b), n = Math.min(r, g, b), l = (M + n) / 2; if (M === n) return [0, 0, l]; const d = M - n, s = l > .5 ? d / (2 - M - n) : d / (M + n); const h = M === r ? (g - b) / d + (g < b ? 6 : 0) : M === g ? (b - r) / d + 2 : (r - g) / d + 4; return [h * 60, s, l]; };
const rgbDe = ([h, s, l]) => { const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), t = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1)); return [t(0), t(8), t(4)]; };
const igualaLum = (h, s, alvo) => { let lo = 0, hi = 1; for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; lum(rgbDe([h, s, mid])) < alvo ? lo = mid : hi = mid; } return rgbDe([h, s, (lo + hi) / 2]); };
const TEMAS = {
  quente: (h, s, n) => [(h - 28 + 360) % 360, Math.min(1, s * 1.05)],
  frio: (h, s, n) => [(h + 75) % 360, s],
  mono: (h, s, n) => [h, /destaque|acento/.test(n) ? s : s * .3],
};
let blocos = '';
for (const [nome, fn] of Object.entries(TEMAS)) {
  const linhas = papeis.map(([n, v]) => { const c = rgb(v), [h, s] = hsl(c); if (s < .06) return `${n}: ${v}`; const [h2, s2] = fn(h, s, n); return `${n}: ${hex(igualaLum(h2, s2, lum(c)))}`; });
  blocos += `\n/* tema ?tema=${nome} */\nhtml[data-paleta="${nome}"] { ${linhas.join('; ')}; }`;
}
css = css.replace(m[0], `:root {${corpo}\n}` + blocos);
fs.writeFileSync(f('public', 'estilo.css'), css);

// 5. leitor de ?tema= no <head>, antes do primeiro script
let html = fs.readFileSync(f('public', 'index.html'), 'utf8');
const leitor = `<script>(function(){var t=new URLSearchParams(location.search).get('tema');if(t)document.documentElement.setAttribute('data-paleta',t)})()</script>\n`;
html = html.replace(/(<script)/, leitor + '$1');
fs.writeFileSync(f('public', 'index.html'), html);
console.log(`ok: ${trocas} rgb() ligados aos papéis, ${papeis.length} papéis, temas ${Object.keys(TEMAS).join(', ')}`);
