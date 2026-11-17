// Pesquisa no acervo local (Awwwards + One Page Love) os melhores sites de referência para o tema e os recursos pedidos.
// Uso: node pesquisar-referencias.mjs --tema "joalheria" --recursos "3d,scroll,tipografia,cursor" [--libs gsap,three]
//        [--desde 2022] [--limite 12] [--fonte awwwards|opl|todas] [--json]
// Recursos: 3d, scroll, tipografia, horizontal, experimental, editorial, video, cursor, preloader, marquee, pin, canvas
// Usa estrutura.json (quando existir) para cursor/preloader/marquee/pin. Não lê JSON inteiro no contexto: imprime só o ranking.
// Variável ACERVO sobrescreve a pasta do acervo.
import fs from 'node:fs';
import os from 'node:os';
import { capturaInvalida } from './qualidade.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ACERVO = process.env.ACERVO || path.join(os.homedir(), 'Documents', 'acervos-design', 'acervo');
const { temas } = JSON.parse(fs.readFileSync(path.join(AQUI, 'temas.json'), 'utf8'));
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const host = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };

const args = {}; const av = process.argv.slice(2);
for (let i = 0; i < av.length; i++) if (av[i].startsWith('--')) { const p = av[i + 1]; args[av[i].slice(2)] = p && !p.startsWith('--') ? av[++i] : true; }
const lista = s => String(s || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
const recursos = lista(args.recursos), libsPedidas = lista(args.libs);
const desde = +args.desde || 2021, limite = +args.limite || 12, fonteSel = args.fonte || 'todas';

const q = norm(args.tema || '');
let tema = null, melhor = 0;
for (const t of temas) { let p = norm(t.id) === q ? 10 : 0; for (const w of t.palavras.filter((w, i, a) => !a.some(o => o !== w && norm(o).includes(norm(w)) && q.includes(norm(o))))) if (w.length > 3 ? q.includes(norm(w)) : new RegExp('(^|[^a-z0-9])' + norm(w) + '([^a-z0-9]|$)').test(q)) p += w.length > 3 ? 3 : 1; if (p > melhor) { melhor = p; tema = t; } }
const nichosAww = new Set((tema?.awwwards || []).map(norm)), nichosOpl = new Set((tema?.opl || []).map(norm));

const ehListagem = s => host(s.urlFinal) === 'onepagelove.com' || host(s.url) === 'onepagelove.com' || /Inspiration$|One Page Love/i.test(s.tituloPagina || '');
const FONTES = [['awwwards', 'awwwards'], ['opl', 'onepagelove']].filter(([k]) => fonteSel === 'todas' || fonteSel === k);

const candidatos = [];
for (const [rotulo, pasta] of FONTES) {
  const dir = path.join(ACERVO, pasta, 'final');
  for (const s of JSON.parse(fs.readFileSync(path.join(dir, 'acervo.json'), 'utf8'))) {
    if (s.erroDesktop || ehListagem(s) || capturaInvalida(s)) continue;
    let est = null; try { est = JSON.parse(fs.readFileSync(path.join(dir, s.slug, 'estrutura.json'), 'utf8')); if (est.erro) est = null; } catch {}
    const L = s.libs || {}, E = (s.estilos || []).map(x => x.toLowerCase());
    let pts = 0; const por = [];
    const nicho = norm(s.nicho || ''), gens = (s.generos || []).map(norm);
    if (rotulo === 'awwwards' ? nichosAww.has(nicho) : (nichosOpl.has(nicho) || gens.some(g => nichosOpl.has(g)))) { pts += 7; por.push('nicho do tema'); }
    for (const l of libsPedidas) if (L[l] || L[l.replace(/-/g, '')]) { pts += 2; por.push(l); }
    const tem = { '3d': L.three || E.includes('3d'), scroll: L.scrollTrigger || L.lenis || E.includes('scroll effects'), tipografia: E.includes('typographic'), horizontal: E.includes('horizontal layout') || (est?.rolagem?.pinSpacer > 0 && est?.rolagem?.carrossel > 0), experimental: E.includes('experimental') || /experimental/i.test(s.nicho), editorial: E.includes('editorial'), video: (L.video > 0) || est?.hero?.video, canvas: L.canvas > 0, cursor: est?.cursorCustom, preloader: est?.preloader?.existe, marquee: est?.motion?.marquee, pin: est?.rolagem?.pinSpacer > 0 || est?.rolagem?.sticky > 1 };
    for (const r of recursos) if (tem[r]) { pts += 2; por.push(r); }
    if ((s.ano || 0) >= desde) pts += 1 + Math.min(1, ((s.ano || 0) - desde) / 5);
    if (rotulo === 'awwwards') { pts += 1; por.push('premiado'); }
    if (pts <= 1.5) continue;
    candidatos.push({ fonte: rotulo, slug: s.slug, titulo: (s.titulo || '').replace(/&#0?38;|&amp;/g, '&'), ano: s.ano, nicho: s.nicho, url: s.urlFinal || s.url, pts: +pts.toFixed(1), por, capturas: path.join(ACERVO, pasta, 'final', s.slug), estrutura: !!est });
  }
}
// sem repetir domínio; mistura as duas fontes se ambas existirem
const vistos = new Set(); const ordenados = candidatos.sort((a, b) => b.pts - a.pts || (b.ano || 0) - (a.ano || 0)).filter(c => { const h = host(c.url); if (vistos.has(h)) return false; vistos.add(h); return true; });
const saida = ordenados.slice(0, limite);

if (args.json) { console.log(JSON.stringify({ tema: tema?.id || null, recursos, total: ordenados.length, referencias: saida }, null, 2)); process.exit(0); }
console.log(`Tema: ${tema?.id || '(não reconhecido: usando só recursos/libs)'} | recursos: ${recursos.join(', ') || '-'} | libs: ${libsPedidas.join(', ') || '-'} | desde ${desde}`);
console.log(`${ordenados.length} candidatos; top ${saida.length}:\n`);
saida.forEach((c, i) => {
  console.log(`${String(i + 1).padStart(2)}. [${c.pts}] ${c.titulo} (${c.ano ?? '?'}, ${c.fonte}) — ${c.nicho}`);
  console.log(`    ${c.url}  | por: ${c.por.join(', ') || '-'}${c.estrutura ? '' : '  (sem estrutura.json)'}`);
  console.log(`    capturas: ${c.capturas}`);
});
console.log('\nPróximo passo: abra desktop.jpg, desktop-scroll.jpg e mobile.jpg de 3 a 6 sites e escolha a referência de cada SEÇÃO (hero, conteúdo, prova, chamada, rodapé).');
