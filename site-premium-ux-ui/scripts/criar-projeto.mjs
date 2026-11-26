// Cria o projeto do site do zero a partir do brief: brief.json + tokens.css, fontes locais, projeto-base (HTML+GSAP ou Next.js+GSAP),
// tokens da paleta escura para a seção de contraste e campos preenchidos. O conteúdo real ([entre colchetes]) é escrito depois.
// Uso:
//   node criar-projeto.mjs --stack html|next --nome "Marca" --tema "cafeteria artesanal" --adjetivos "elegante,raro" --publico "..." \
//        --descricao "frase de até 155 caracteres" --saida ./meu-site [--recursos "tipografia,scroll"] [--cores "fundo=#..,texto=#..,acento=#.."] [--fontes "Título,Corpo,Detalhe"]
//        [--entrada sobe|desce|da-esquerda|da-direita|opacidade|nenhuma] [--porta 3005] [--instalar]
// Com --instalar roda npm install (e o build, no HTML). Sem ele, só gera os arquivos.
// --entrada: direção em que títulos, itens e o hero entram (data-entrada no <html>); escolha a que a ideia central pede. Padrão: sobe.
// --porta: porta do servidor (HTML: npm run serve; Next: npm run dev/start). Padrão 3001 (HTML) ou 3000 (Next).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(AQUI, '..');
const args = {}; const av = process.argv.slice(2);
for (let i = 0; i < av.length; i++) if (av[i].startsWith('--')) { const p = av[i + 1]; args[av[i].slice(2)] = p && !p.startsWith('--') ? av[++i] : true; }
const falta = ['nome', 'tema', 'saida'].filter(k => !args[k]);
if (falta.length) { console.error('Uso: node criar-projeto.mjs --stack html|next --nome "Marca" --tema "..." --adjetivos "a,b,c" --publico "..." --descricao "..." --saida ./pasta [--instalar]\nFaltam: ' + falta.join(', ')); process.exit(1); }
const stack = String(args.stack || 'html').toLowerCase().startsWith('n') ? 'next' : 'html';
const saida = path.resolve(args.saida);
const ENTRADAS = ['sobe', 'desce', 'da-esquerda', 'da-direita', 'opacidade', 'nenhuma'];
const entrada = ENTRADAS.includes(String(args.entrada)) ? String(args.entrada) : 'sobe';
if (args.entrada && entrada !== args.entrada) console.log(`AVISO: --entrada "${args.entrada}" não existe; usando "sobe". Opções: ${ENTRADAS.join(', ')}.`);
const porta = /^\d{2,5}$/.test(String(args.porta)) ? String(args.porta) : (stack === 'next' ? '3000' : '3001');
const run = (arq, a, opt = {}) => execFileSync(process.execPath, [path.join(AQUI, arq), ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opt });
const copiar = (de, para) => { fs.mkdirSync(para, { recursive: true }); for (const e of fs.readdirSync(de, { withFileTypes: true })) { const d = path.join(de, e.name), p = path.join(para, e.name); e.isDirectory() ? copiar(d, p) : fs.copyFileSync(d, p); } };

fs.mkdirSync(saida, { recursive: true });
const pastaDesign = path.join(saida, 'design');
console.log(`1/5 Brief e tokens (${stack === 'next' ? 'Next.js + GSAP' : 'HTML + CSS + JS + GSAP'})`);
if (!fs.existsSync(path.join(pastaDesign, 'brief.json'))) {
  run('montar-brief.mjs', ['--nome', args.nome, '--tema', args.tema, '--adjetivos', args.adjetivos || '', '--publico', args.publico || '', '--recursos', args.recursos || '', ...(args.fontes ? ['--fontes', String(args.fontes)] : []), ...(args.ref3d ? ['--ref3d', String(args.ref3d)] : []), ...(args['3d'] ? ['--3d', String(args['3d'])] : []), '--saida', pastaDesign]);
}
const brief = JSON.parse(fs.readFileSync(path.join(pastaDesign, 'brief.json'), 'utf8'));
let tokens = fs.readFileSync(path.join(pastaDesign, 'tokens.css'), 'utf8');

console.log('2/5 Paleta escura da seção de contraste');
let escura = null;
try { escura = JSON.parse(run('gerar-paleta.mjs', ['--tema', args.tema, '--tom', 'escuro', '--json'])).cores; } catch { /* mantém os valores padrão do estilo.css */ }
if (escura) tokens += `\n/* seção escura de contraste (paleta escura da skill) */\n:root { --d-bg: ${escura.fundo}; --d-surface: ${escura.superficie}; --d-line: ${escura.linha}; --d-text: ${escura.texto}; --d-muted: ${escura.textoMudo}; --d-accent: ${escura.acento}; }\n`;

// --cores "fundo=#..,superficie=#..,texto=#..,acento=#.." grava a paleta escolhida (ex.: a recomendada pelo opcoes.mjs, de origem do estilo).
// Sem --cores fica a paleta gerada para o tema; o aviso abaixo diz isso (teste cego, rodada 1 e 3: a paleta escolhida não chegava ao tokens.css).
const VAR = { fundo: '--bg', superficie: '--surface', texto: '--text', acento: '--accent', textoMudo: '--text-muted', linha: '--line' };
if (args.cores) {
  for (const par of String(args.cores).split(',')) { const [k, v] = par.split('=').map(x => x.trim()); if (VAR[k] && /^#[0-9a-f]{3,8}$/i.test(v || '')) tokens = tokens.replace(new RegExp(`${VAR[k]}:\\s*[^;]+;`), `${VAR[k]}: ${v};`); else console.log(`   (cor ignorada: ${par})`); }
  const acento = (String(args.cores).match(/acento=(#[0-9a-f]{6})/i) || [])[1];
  if (acento) {
    tokens = tokens.replace(/--accent-soft:\s*[^;]+;/, `--accent-soft: color-mix(in oklab, ${acento} 18%, var(--bg));`);
    const lum = h => { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
    const contraste = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
    const texto = (String(args.cores).match(/texto=(#[0-9a-f]{6})/i) || [])[1] || '#111111';
    const fundo = (String(args.cores).match(/fundo=(#[0-9a-f]{6})/i) || [])[1] || '#111111';
    // texto do botão: o candidato de maior contraste com o acento (acento claro em tema escuro pede texto escuro)
    const tinta = ['#ffffff', texto, fundo, '#111111'].reduce((a, b) => contraste(b, acento) > contraste(a, acento) ? b : a), r = contraste(tinta, acento);
    tokens = tokens.replace(/--on-accent:\s*[^;]+;/, `--on-accent: ${tinta};`);
    if (r < 4.5) console.log(`   AVISO: texto do botão sobre o acento dá ${r.toFixed(2)}:1 (< 4,5). Escureça o acento para botões e use o original só em elementos grandes.`);
  }
  fs.writeFileSync(path.join(pastaDesign, 'tokens.css'), tokens); // design/ e public/ ficam com a mesma paleta (teste cego, rodada 4)
  console.log('   paleta escolhida gravada em tokens.css: ' + args.cores + ' (confira o contraste no verificador)');
} else console.log('   AVISO: tokens.css ficou com a paleta GERADA para o tema. Se a escolhida foi outra (ex.: a de origem do estilo, recomendada pelo opcoes.mjs), rode de novo com --cores "fundo=#..,superficie=#..,texto=#..,acento=#..".');

console.log('3/5 Fontes locais (woff2 latin, sem Google em produção)');
const titulo = brief.tipografia?.titulo || 'Instrument Serif', corpo = brief.tipografia?.corpo || 'Inter';
const detalhe = brief.tipografia?.detalhe && ![titulo, corpo].includes(brief.tipografia.detalhe) ? `,${brief.tipografia.detalhe}` : ''; // fonte de detalhe (mono) do brief
const pubFontes = stack === 'next' ? path.join(saida, 'public', 'fonts') : path.join(saida, 'public', 'fonts');
let preload = '';
const tentativas = [`${titulo}:ital,wght@0,400;0,700;1,400,${corpo}:wght@400;500;700${detalhe}`, `${titulo}:ital@0;1,${corpo}:wght@400;500${detalhe}`, `${titulo},${corpo}:wght@400;500${detalhe}`, `${titulo},${corpo}${detalhe}`, `${titulo},${corpo}`];
for (const fam of tentativas) {
  try { const out = run('baixar-fontes.mjs', ['--familias', fam, '--saida', pubFontes, '--preload', `${titulo},${corpo}`]); preload = out.split('\n').filter(l => l.startsWith('<link rel="preload"')).join('\n'); console.log('   ' + out.split('\n')[0]); break; }
  catch (e) { console.log('   (tentativa de fontes falhou: ' + fam + ')'); }
}

console.log('4/5 Projeto-base');
const base = path.join(RAIZ, 'starters', stack);
copiar(base, saida);
const bg = (tokens.match(/--bg:\s*(#[0-9a-fA-F]{6})/) || [])[1] || '#ffffff';
const descricao = args.descricao || `${args.nome}: ${args.tema}. [Escreva a descrição de até 155 caracteres]`;
const preloadJsx = preload.split(/\r?\n/).filter(Boolean).map(l => '        ' + l.replace('crossorigin', 'crossOrigin="anonymous"').replace('href="fonts/', 'href="/fonts/').replace(/>$/, ' />')).join('\n');
const subs = { NOME: args.nome, TEMA: args.tema, DESCRICAO: descricao, COR_FUNDO: bg, ANO: String(new Date().getFullYear()), PRELOAD_FONTES: preload, PRELOAD_FONTES_JSX: preloadJsx, ENTRADA: entrada, PORTA: porta };
const trocar = arq => { if (!fs.existsSync(arq)) return; let s = fs.readFileSync(arq, 'utf8'); for (const [k, v] of Object.entries(subs)) s = s.split(`{{${k}}}`).join(v); fs.writeFileSync(arq, s); };
const tokensDestino = stack === 'next' ? path.join(saida, 'app', 'tokens.css') : path.join(saida, 'public', 'tokens.css');
fs.writeFileSync(tokensDestino, tokens);
const alvos = stack === 'next' ? ['app/layout.js', 'app/page.js', 'package.json'] : ['public/index.html', 'package.json', 'servir.mjs'];
alvos.forEach(a => trocar(path.join(saida, a)));
const pkg = path.join(saida, 'package.json'); let pj = fs.readFileSync(pkg, 'utf8'); fs.writeFileSync(pkg, pj.replace('"name": "projeto-base"', `"name": "${String(args.nome).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'site'}"`));

console.log('5/5 ' + (args.instalar ? 'Instalando dependências' : 'Pronto (sem instalar)'));
if (args.instalar) {
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  execFileSync(npm, ['install', '--no-audit', '--no-fund'], { cwd: saida, stdio: 'inherit', shell: process.platform === 'win32' });
  if (stack === 'html') execFileSync(npm, ['run', 'build'], { cwd: saida, stdio: 'inherit', shell: process.platform === 'win32' });
}
console.log(`\nProjeto em ${saida}\nPróximos passos:\n 1. Troque todo texto [entre colchetes] por conteúdo real do cliente (o verificador reprova placeholders).\n 2. Aplique as escolhas do brief (estilo, referência) e os componentes das plataformas (references/componentes-plataformas.md).\n 3. ${stack === 'html' ? 'npm run build && npm run serve' : 'npm run dev  (ou npm run build && npm start)'}   (porta ${porta}; o servidor HTML pula para a seguinte se ela estiver ocupada e diz qual usou)\n 4. node ${path.join(AQUI, 'verificar-site.mjs')} http://localhost:${porta}/ --saida ./verificacao\n 5. Gestos prontos: ${path.join(RAIZ, 'starters', 'modulos', 'README.md')} (giro por quadros, trecho fixo, galeria horizontal, meio-tom, vidro, cursor).\n Entrada dos elementos: "${entrada}" (troque em data-entrada no <html> ou num elemento).`);
