// Gera uma paleta própria (OKLCH -> hex) a partir do tema do site, com contraste WCAG conferido.
// Uso:
//   node gerar-paleta.mjs --tema "moda" [--tom claro|escuro] [--acento 20] [--croma 0.17] [--variante 0] [--json]
//   node gerar-paleta.mjs --listar          (lista os temas conhecidos)
// --acento: matiz do acento em graus OKLCH (0 rosa-vermelho, 30 laranja, 90 amarelo, 145 verde, 200 ciano, 260 azul, 310 roxo).
// --variante: escolhe o N-ésimo matiz sugerido para o tema (0, 1, 2...). Sem --acento, usa essa lista.
// Saída: variáveis CSS prontas + relatório de contraste. Troque o acento por outro matiz para diferenciar do concorrente.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const { temas } = JSON.parse(fs.readFileSync(path.join(AQUI, 'temas.json'), 'utf8'));

// ---------- OKLCH <-> sRGB ----------
const clamp01 = x => Math.min(1, Math.max(0, x));
const gama = c => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
const linear = c => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
function oklchParaLinear(L, C, hDeg) {
  const h = hDeg * Math.PI / 180, a = C * Math.cos(h), b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b, m_ = L - 0.1055613458 * a - 0.0638541728 * b, s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s];
}
const dentro = v => v.every(x => x >= -0.0001 && x <= 1.0001);
function oklch(L, C, h) { // reduz o croma até caber no sRGB
  let c = C, lin = oklchParaLinear(L, c, h);
  for (let i = 0; i < 40 && !dentro(lin); i++) { c *= 0.94; lin = oklchParaLinear(L, c, h); }
  return lin.map(x => Math.round(clamp01(gama(clamp01(x))) * 255));
}
const hex = rgb => '#' + rgb.map(x => x.toString(16).padStart(2, '0')).join('');
const lumRel = rgb => { const [r, g, b] = rgb.map(x => linear(x / 255)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contraste = (a, b) => { const x = lumRel(a), y = lumRel(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

// ---------- argumentos ----------
const args = {}; const av = process.argv.slice(2);
for (let i = 0; i < av.length; i++) if (av[i].startsWith('--')) { const p = av[i + 1]; args[av[i].slice(2)] = p && !p.startsWith('--') ? av[++i] : true; }
if (args.listar) { for (const t of temas) console.log(`${t.id.padEnd(16)} ${t.palavras.slice(0, 5).join(', ')}`); process.exit(0); }

const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
function acharTema(txt) {
  const q = norm(txt); let melhor = null, pontos = 0;
  for (const t of temas) {
    let p = norm(t.id) === q ? 10 : 0;
    for (const w of t.palavras.filter((w, i, a) => !a.some(o => norm(o) !== norm(w) && norm(o).includes(norm(w)) && q.includes(norm(o))))) if (w.length > 3 ? q.includes(norm(w)) : new RegExp('(^|[^a-z0-9])' + norm(w) + '([^a-z0-9]|$)').test(q)) p += w.length > 3 ? 3 : 1;
    if (p > pontos) { pontos = p; melhor = t; }
  }
  return melhor;
}
const tema = acharTema(args.tema || '') || temas.find(t => t.id === 'corporativo');
const tom = args.tom || (tema.tom === 'auto' ? 'escuro' : tema.tom);
const hueAcento = args.acento !== undefined ? +args.acento : tema.acentoHue[(+args.variante || 0) % tema.acentoHue.length];
const croma = args.croma ? +args.croma : tema.croma;

// ---------- construção da paleta ----------
const escuro = tom === 'escuro';
const N = tema.neutroHue, c0 = escuro ? 0.012 : 0.01; // neutros tingidos na direção do tema, nunca #000/#fff puros
const P = {
  fundo: oklch(escuro ? 0.16 : 0.975, c0, N),
  superficie: oklch(escuro ? 0.205 : 0.995, c0, N),
  superficie2: oklch(escuro ? 0.25 : 0.945, c0 * 1.2, N),
  linha: oklch(escuro ? 0.34 : 0.88, c0 * 1.3, N),
  textoMudo: oklch(escuro ? 0.72 : 0.45, c0 * 1.4, N),
  texto: oklch(escuro ? 0.96 : 0.2, c0, N),
};
// acento: tenta o L ideal para o tom; se o contraste com o fundo ficar < 3, ajusta L
let La = escuro ? 0.78 : 0.56;
let acento = oklch(La, croma, hueAcento);
// o acento precisa passar como TEXTO sobre o fundo (4,5:1) e aceitar texto claro ou escuro por cima (4,5:1)
const melhorTinta = c => Math.max(contraste(c, [255, 255, 255]), contraste(c, [10, 10, 10]));
for (let i = 0; i < 80 && (contraste(acento, P.fundo) < 4.5 || melhorTinta(acento) < 4.5); i++) { La += escuro ? 0.012 : -0.012; acento = oklch(La, croma, hueAcento); }
const acentoSuave = oklch(escuro ? 0.3 : 0.93, croma * 0.35, hueAcento);
const tintaNoAcento = contraste(acento, [255, 255, 255]) >= contraste(acento, [10, 10, 10]) ? oklch(0.99, 0.005, hueAcento) : oklch(0.16, 0.02, hueAcento);
P.acento = acento; P.acentoSuave = acentoSuave; P.tintaNoAcento = tintaNoAcento;

// garante AA/AAA
const relatorio = [];
const exige = (nome, a, b, minimo) => { const v = contraste(P[a], P[b]); relatorio.push({ par: nome, razao: +v.toFixed(2), minimo, ok: v >= minimo }); };
exige('texto sobre fundo', 'texto', 'fundo', 7);
exige('texto sobre superfície', 'texto', 'superficie', 7);
exige('texto mudo sobre fundo', 'textoMudo', 'fundo', 4.5);
exige('texto mudo sobre superfície', 'textoMudo', 'superficie', 4.5);
exige('tinta sobre acento', 'tintaNoAcento', 'acento', 4.5);
exige('acento sobre fundo (elementos grandes/ícones)', 'acento', 'fundo', 3);
exige('acento como texto sobre fundo', 'acento', 'fundo', 4.5);

const nomesCss = { fundo: '--bg', superficie: '--surface', superficie2: '--surface-2', linha: '--line', textoMudo: '--text-muted', texto: '--text', acento: '--accent', acentoSuave: '--accent-soft', tintaNoAcento: '--on-accent' };
const saida = { tema: tema.id, tom, matizAcento: hueAcento, croma, nota: tema.nota, estilosSugeridos: tema.estilos, nichosAcervo: { awwwards: tema.awwwards, onepagelove: tema.opl }, cores: Object.fromEntries(Object.entries(P).map(([k, v]) => [k, hex(v)])), contraste: relatorio };

if (args.json) { console.log(JSON.stringify(saida, null, 2)); process.exit(0); }
console.log(`Tema: ${tema.id} | fundo ${tom} | acento ${hueAcento}° (croma ${croma})`);
console.log(`Nota: ${tema.nota}\n`);
console.log(':root {');
for (const [k, v] of Object.entries(nomesCss)) console.log(`  ${v}: ${hex(P[k])};`);
console.log('}\n');
for (const r of relatorio) console.log(`${r.ok ? 'OK ' : 'FALHA'}  ${r.razao.toFixed(2).padStart(5)}:1  (mín. ${r.minimo})  ${r.par}`);
console.log(`\nAlternativas de acento para este tema: ${tema.acentoHue.join('°, ')}° (use --variante N ou --acento GRAUS).`);
console.log(`Estilos sugeridos: ${tema.estilos.join(', ')}`);
