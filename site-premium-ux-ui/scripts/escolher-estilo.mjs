// Recomenda 1 estilo principal (e 1 secundário compatível) entre os 10 estilos de `references/base-estilos/` (vindos da antiga skill estilos-paletas-design).
// Uso: node escolher-estilo.mjs --tema "joalheria" --adjetivos "elegante,sofisticado,raro" [--evitar "infantil,neon"] [--json]
// Pontua: (1) posição do estilo na lista do tema, (2) adjetivos do briefing, (3) palavras em --uso (ex.: "muitos recursos").
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const { temas } = JSON.parse(fs.readFileSync(path.join(AQUI, 'temas.json'), 'utf8'));
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const ESTILOS = {
  'neomorphism': { nome: 'Neomorphism', palavras: ['tatil', 'suave', 'fisico', 'calculadora', 'painel', 'botao', 'relevo', 'casa inteligente', 'controle'] },
  'minimalism': { nome: 'Minimalism', palavras: ['acolhedor', 'caloroso', 'calmo', 'limpo', 'sereno', 'minimalista', 'respiro', 'delicado', 'discreto', 'natural', 'leve', 'zen', 'organico', 'sobrio', 'preciso', 'atemporal', 'artesanal', 'autentico', 'cuidadoso', 'silencioso', 'equilibrado'] },
  'brutalism': { nome: 'Brutalism', palavras: ['ousado', 'cru', 'irreverente', 'jovem', 'rebelde', 'bruto', 'impactante', 'acido', 'provocativo', 'underground', 'autoral', 'experimental'] },
  'glassmorphism': { nome: 'Glassmorphism', palavras: ['translucido', 'vidro', 'moderno', 'etereo', 'futuro', 'camadas', 'brilho', 'fluido'] },
  'claymorphism': { nome: 'Claymorphism', palavras: ['ludico', 'amigavel', 'macio', 'divertido', 'fofo', 'infantil', 'simpatico'] },
  'bento-grid': { nome: 'Bento Grid', palavras: ['modular', 'organizado', 'recursos', 'produto', 'mosaico', 'funcional', 'completo', 'vitrine', 'multiplos', 'dashboard'] },
  'pixel-art': { nome: 'Pixel Art', palavras: ['retro', 'nostalgico', '8-bit', '8bit', 'jogo', 'geek', 'arcade', 'pixel', 'minecraft', 'game'] },
  'typography-luxury': { nome: 'Typography Luxury', palavras: ['luxuoso', 'luxo', 'elegante', 'sofisticado', 'classico', 'editorial', 'premium', 'refinado', 'exclusivo', 'raro', 'atemporal', 'nobre'] },
  'dark-mode': { nome: 'Dark Mode', palavras: ['escuro', 'tecnologico', 'premium', 'noturno', 'focado', 'cinematografico', 'sobrio', 'profissional', 'dev', 'ia'] },
  'cyberpunk': { nome: 'Cyberpunk', palavras: ['futurista', 'neon', 'eletrico', 'sci-fi', 'hacker', 'distopico', 'cyber', 'matrix', 'ficcao'] },
};
// pares que combinam (o secundário só entra se for compatível com o principal)
const COMPATIVEIS = {
  'dark-mode': ['typography-luxury', 'glassmorphism', 'bento-grid', 'cyberpunk', 'brutalism'],
  'typography-luxury': ['dark-mode', 'minimalism'],
  'minimalism': ['typography-luxury', 'claymorphism', 'bento-grid'],
  'brutalism': ['dark-mode', 'pixel-art', 'typography-luxury'],
  'glassmorphism': ['dark-mode', 'bento-grid'],
  'bento-grid': ['dark-mode', 'glassmorphism', 'minimalism', 'claymorphism'],
  'claymorphism': ['minimalism', 'bento-grid', 'pixel-art'],
  'cyberpunk': ['dark-mode', 'pixel-art', 'brutalism'],
  'pixel-art': ['cyberpunk', 'brutalism', 'claymorphism'],
  'neomorphism': ['minimalism', 'claymorphism'],
};

const args = {}; const av = process.argv.slice(2);
for (let i = 0; i < av.length; i++) if (av[i].startsWith('--')) { const p = av[i + 1]; args[av[i].slice(2)] = p && !p.startsWith('--') ? av[++i] : true; }
const lista = s => String(s || '').split(',').map(x => norm(x.trim())).filter(Boolean);
const adj = lista(args.adjetivos), evitar = lista(args.evitar), uso = norm(args.uso || '');

const q = norm(args.tema || '');
let tema = null, melhorP = 0;
for (const t of temas) { let p = norm(t.id) === q ? 10 : 0; for (const w of t.palavras.filter((w, i, a) => !a.some(o => norm(o) !== norm(w) && norm(o).includes(norm(w)) && q.includes(norm(o))))) if (w.length > 3 ? q.includes(norm(w)) : new RegExp('(^|[^a-z0-9])' + norm(w) + '([^a-z0-9]|$)').test(q)) p += w.length > 3 ? 3 : 1; if (p > melhorP) { melhorP = p; tema = t; } }

const pontos = {};
for (const id of Object.keys(ESTILOS)) pontos[id] = { total: 0, motivos: [] };
if (tema) tema.estilos.forEach((id, i) => { pontos[id].total += 6 - i * 2; pontos[id].motivos.push(`tema "${tema.id}" (posição ${i + 1})`); });
for (const [id, e] of Object.entries(ESTILOS)) {
  for (const a of adj) if (e.palavras.some(w => a.includes(w) || w.includes(a))) { pontos[id].total += 3; pontos[id].motivos.push(`adjetivo "${a}"`); }
  for (const w of e.palavras) if (uso.includes(w)) { pontos[id].total += 2; pontos[id].motivos.push(`uso: "${w}"`); }
  for (const ev of evitar) if (e.palavras.some(w => ev.includes(w) || w.includes(ev))) { pontos[id].total -= 6; pontos[id].motivos.push(`evitar "${ev}"`); }
}
// sem dados do briefing: Awwwards tende ao escuro (51%): dá um empurrão leve ao dark-mode
const ranking = Object.entries(pontos).sort((a, b) => b[1].total - a[1].total);
const [principal] = ranking; const secundario = ranking.find(([id]) => id !== principal[0] && (COMPATIVEIS[principal[0]] || []).includes(id) && pontos[id].total > 0);

const resp = {
  tema: tema?.id || null,
  principal: { id: principal[0], nome: ESTILOS[principal[0]].nome, pontos: principal[1].total, motivos: principal[1].motivos, arquivo: `~/.claude/skills/site-premium-ux-ui/references/base-estilos/${principal[0]}.md` },
  secundario: secundario ? { id: secundario[0], nome: ESTILOS[secundario[0]].nome, pontos: secundario[1].total, motivos: secundario[1].motivos, arquivo: `~/.claude/skills/site-premium-ux-ui/references/base-estilos/${secundario[0]}.md` } : null,
  ranking: ranking.slice(0, 5).map(([id, p]) => ({ id, pontos: p.total })),
  aviso: principal[1].total <= 0 ? 'Nenhum sinal forte: o briefing não casou com nenhum estilo. Peça mais adjetivos ou apresente 2 opções.' : (['dark-mode', 'cyberpunk'].includes(principal[0]) ? 'Dark Mode e Cyberpunk não têm imagens de referência na skill de estilos: tratar como proposta e validar com protótipo.' : null),
};
if (args.json) { console.log(JSON.stringify(resp, null, 2)); process.exit(0); }
console.log(`Tema: ${resp.tema || '(não reconhecido)'}`);
console.log(`Principal : ${resp.principal.nome} (${resp.principal.pontos} pts) — ${resp.principal.motivos.join('; ')}`);
if (resp.secundario) console.log(`Secundário: ${resp.secundario.nome} (${resp.secundario.pontos} pts) — ${resp.secundario.motivos.join('; ')}  [combina com o principal]`);
console.log(`Ranking   : ${resp.ranking.map(r => `${r.id} ${r.pontos}`).join(' | ')}`);
console.log(`Ler       : ${resp.principal.arquivo}`);
if (resp.aviso) console.log(`Aviso     : ${resp.aviso}`);
