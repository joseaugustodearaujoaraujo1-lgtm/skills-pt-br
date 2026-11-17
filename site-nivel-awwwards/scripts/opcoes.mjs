// Monta as OPÇÕES que o usuário escolhe antes de construir: 3 paletas para tema ESCURO + 3 para tema CLARO, e 5 sites de referência.
//   Sites: A, B, C = três referências (Awwwards / One Page Love) variadas; D = campo livre (sugestão do usuário, reprocura);
//          E = recomendada (melhor pontuação; quem usa a skill justifica a escolha).
// Uso:
//   node opcoes.mjs --tema "joalheria" --adjetivos "elegante,raro" --recursos "3d,tipografia" [--evitar "neon"] [--libs gsap] [--desde 2022]
//        [--excluir "slug1,slug2"]        (não repete sites já mostrados: use ao pedir "mostre outros")
//        [--sugestao "texto livre ou URL"] (opção D: reprocura com a sugestão do usuário)
//        [--json]
// Saída: markdown pronto para mostrar ao usuário (ou JSON). As capturas ficam em acervo/<fonte>/final/<slug>/ (desktop.jpg, mobile.jpg).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const { temas } = JSON.parse(fs.readFileSync(path.join(AQUI, 'temas.json'), 'utf8'));
const args = {}; const av = process.argv.slice(2);
for (let i = 0; i < av.length; i++) if (av[i].startsWith('--')) { const p = av[i + 1]; args[av[i].slice(2)] = p && !p.startsWith('--') ? av[++i] : true; }
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const lista = s => String(s || '').split(',').map(x => x.trim()).filter(Boolean);
const node = (arq, a) => JSON.parse(execFileSync(process.execPath, [path.join(AQUI, arq), ...a, '--json'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
if (!args.tema) { console.error('Uso: node opcoes.mjs --tema "<tema>" [--adjetivos a,b,c] [--recursos 3d,scroll] [--evitar x,y] [--excluir slugs] [--sugestao "..."] [--json]'); process.exit(1); }

// ---------- tema ----------
const q = norm(args.tema); let tema = null, melhor = 0;
for (const t of temas) { let p = norm(t.id) === q ? 10 : 0; for (const w of t.palavras.filter((w, i, a) => !a.some(o => o !== w && norm(o).includes(norm(w)) && q.includes(norm(o))))) if (w.length > 3 ? q.includes(norm(w)) : new RegExp('(^|[^a-z0-9])' + norm(w) + '([^a-z0-9]|$)').test(q)) p += w.length > 3 ? 3 : 1; if (p > melhor) { melhor = p; tema = t; } }
tema = tema || temas.find(t => t.id === 'corporativo');

// ---------- 3 paletas por tom ----------
// matizes com pelo menos 40° entre si (senão as 3 paletas parecem a mesma); faltando, completa com complementar e análogos
const dist = (a, b) => { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); };
const hues = [];
for (const h of [...tema.acentoHue, ...[180, 60, -60, 120].map(d => (tema.acentoHue[0] + d + 360) % 360)]) if (hues.length < 3 && hues.every(x => dist(x, h) >= 40)) hues.push(h);
// personalidade calma (elegante, silencioso, sóbrio...) baixa o croma; enérgica (ousado, vibrante...) sobe
const adjs = lista(args.adjetivos).map(norm);
const calmo = adjs.filter(a => /eleg|silenc|sobri|discret|calm|minimal|rar|sereno|refin|classic/.test(a)).length;
const vivo = adjs.filter(a => /ousad|vibr|jovem|irreverent|energ|divert|forte|alegr/.test(a)).length;
const fp = Math.max(0.55, Math.min(1.3, 1 - 0.12 * calmo + 0.12 * vivo));
tema.croma = +(tema.croma * fp).toFixed(3);
const perfis = [
  { nome: 'Assinatura', porque: 'acento mais típico do tema, croma padrão', hue: hues[0], f: 1 },
  { nome: 'Contida', porque: 'acento alternativo com croma baixo: mais sóbria e editorial', hue: hues[1], f: 0.7 },
  { nome: 'Ousada', porque: 'terceiro matiz com croma alto: diferencia do concorrente', hue: hues[2], f: 1.2 },
];
const paletas = { escuro: [], claro: [] };
for (const tom of ['escuro', 'claro']) {
  perfis.forEach((p, i) => {
    const r = node('gerar-paleta.mjs', ['--tema', tema.id, '--tom', tom, '--acento', String(p.hue), '--croma', String(+(tema.croma * p.f).toFixed(3))]);
    paletas[tom].push({ id: `${tom === 'escuro' ? 'E' : 'C'}${i + 1}`, nome: p.nome, porque: p.porque, matiz: p.hue, cores: r.cores, contraste: r.contraste, aprovada: r.contraste.every(c => c.ok) });
  });
}

// ---------- 5 sites ----------
const pesquisa = (extra = []) => node('pesquisar-referencias.mjs', ['--tema', args.tema, '--recursos', args.recursos || '', '--libs', args.libs || '', '--desde', String(args.desde || 2022), '--limite', '60', ...extra]);
const excluir = new Set(lista(args.excluir));
// desempate: nicho mais específico do tema (1º da lista) ganha; nichos genéricos perdem
const GENERICOS = new Set(['landing page', 'app', 'digital product', 'experimental', 'announcement', 'launching soon', 'informational']);
const nota = r => r.pts + (norm(r.nicho || '') === norm((r.fonte === 'awwwards' ? tema.awwwards : tema.opl)[0] || '') ? 2 : 0) - (GENERICOS.has(norm(r.nicho || '')) ? 1.5 : 0);
const base = pesquisa().referencias.filter(r => !excluir.has(r.slug)).map(r => ({ ...r, nota: +nota(r).toFixed(1) })).sort((a, b) => b.nota - a.nota || (b.ano || 0) - (a.ano || 0));

// D: sugestão do usuário (URL do acervo/host, ou texto livre vira nova consulta)
let sugestao = null;
if (args.sugestao) {
  const s = String(args.sugestao);
  const host = u => { try { return new URL(/^https?:/.test(u) ? u : 'https://' + u).hostname.replace(/^www\./, ''); } catch { return ''; } };
  const alvo = /\./.test(s) && !/\s/.test(s) ? host(s) : '';
  const achados = alvo ? pesquisa(['--tema', s]).referencias.filter(r => host(r.url) === alvo) : pesquisa(['--tema', s, '--recursos', args.recursos || '']).referencias.filter(r => !excluir.has(r.slug)).slice(0, 3);
  sugestao = { entrada: s, noAcervo: achados, aviso: achados.length ? null : 'Não está no acervo local: pesquise ao vivo (Awwwards, One Page Love, tasteskill.dev) e capture com recapturar.mjs.' };
}

// diversidade: não repete fonte+nicho nas três primeiras; E = melhor pontuação
const evitar = lista(args.evitar).map(norm);
const ok = base.filter(r => !evitar.some(e => norm(`${r.titulo} ${r.nicho}`).includes(e)));
const E = ok[0] || null;
const A_C = []; const usados = new Set(E ? [E.slug] : []);
for (const r of ok) {
  if (A_C.length === 3) break; if (usados.has(r.slug)) continue;
  const parecido = A_C.some(x => x.fonte === r.fonte && norm(x.nicho || '') === norm(r.nicho || ''));
  if (!parecido) { A_C.push(r); usados.add(r.slug); }
}
for (const r of ok) { if (A_C.length === 3) break; if (!usados.has(r.slug)) { A_C.push(r); usados.add(r.slug); } }
const letras = ['A', 'B', 'C'];
const sites = { opcoes: A_C.map((r, i) => ({ letra: letras[i], ...r })), D: { letra: 'D', rotulo: 'Sua sugestão (campo livre)', sugestao }, E: E ? { letra: 'E', rotulo: 'Recomendada por mim', ...E } : null };

const fontesLive = [
  'Awwwards: https://www.awwwards.com/websites/ (filtre por categoria e "Site of the Day")',
  'One Page Love: https://onepagelove.com/ (inspiração por categoria)',
  'Taste Skill (biblioteca de 247 sites curados + 20 direções): https://tasteskill.dev/docs',
  'Transitions.dev (transições): https://transitions.dev/library.html',
  'React Bits (componentes): https://reactbits.dev',
];

const saida = { tema: tema.id, adjetivos: lista(args.adjetivos), estilosSugeridos: tema.estilos, nota: tema.nota, paletas, sites, buscaAoVivo: fontesLive, proximosPassos: 'Pergunte: paleta (escuro e claro), site (A/B/C/D/E). Em D, rode de novo com --sugestao. Para "mostre outros", repita com --excluir <slugs já mostrados>.' };
if (args.json) { console.log(JSON.stringify(saida, null, 2)); process.exit(0); }

// ---------- markdown ----------
const sw = c => `\`${c}\``;
console.log(`# Opções para "${args.tema}" (tema reconhecido: ${tema.id})\n\n_${tema.nota}_\nEstilos sugeridos: ${tema.estilos.join(', ')}\n`);
for (const tom of ['escuro', 'claro']) {
  console.log(`## Paletas — tema ${tom}\n`);
  console.log('| Id | Nome | Fundo | Superfície | Texto | Acento | Tinta no acento | Contraste | Quando usar |\n|---|---|---|---|---|---|---|---|---|');
  for (const p of paletas[tom]) console.log(`| ${p.id} | ${p.nome} | ${sw(p.cores.fundo)} | ${sw(p.cores.superficie)} | ${sw(p.cores.texto)} | ${sw(p.cores.acento)} | ${sw(p.cores.tintaNoAcento)} | ${p.aprovada ? 'AA/AAA ok' : 'REVER'} | ${p.porque} |`);
  console.log('');
}
console.log('## Sites de referência\n');
const linha = r => `**${r.letra}.** ${r.titulo} (${r.ano ?? '?'}, ${r.fonte === 'awwwards' ? 'Awwwards' : 'One Page Love'}) — ${r.nicho}\n   ${r.url}\n   por que: ${r.por.join(', ') || 'afinidade com o tema'} | capturas: ${r.capturas}`;
sites.opcoes.forEach(r => console.log(linha(r) + '\n'));
console.log(`**D.** Sua sugestão (campo livre): diga um site, um estilo ou uma ideia e eu pesquiso de novo.`);
if (sugestao) { console.log(`   Entrada: "${sugestao.entrada}"`); sugestao.noAcervo.forEach(r => console.log('   → ' + `${r.titulo} (${r.ano ?? '?'}, ${r.fonte}) ${r.url}`)); if (sugestao.aviso) console.log('   ' + sugestao.aviso); }
console.log('');
if (sites.E) console.log(linha(sites.E) + '\n   (justificativa: escreva por que esta é a melhor para o briefing)\n');
console.log('## Busca ao vivo (complemento)\n' + fontesLive.map(x => '- ' + x).join('\n'));
