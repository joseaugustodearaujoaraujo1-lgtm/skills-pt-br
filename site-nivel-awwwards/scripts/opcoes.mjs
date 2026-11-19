// Monta as OPÇÕES que o usuário escolhe antes de construir, na ordem em que a skill pergunta:
//   1) SITES (acervo local: 1.819 coletados, 910 utilizáveis): A, B, C variados + E recomendada, cada um com LINK CLICÁVEL;
//      "Outro" (D) = o usuário sugere um site ou ideia e a skill reprocura.
//   2) ESTILO: 3 dos 10 estilos de references/base-estilos/ (antiga skill estilos-paletas-design), cada um com a paleta de origem.
//   3) PALETA: a do estilo + 3 geradas para o tema ESCURO + 3 para o CLARO (contraste conferido).
//   4) ELEMENTO 3D leve sugerido para o tema (sempre sugerir).
// Uso:
//   node opcoes.mjs --tema "joalheria" --adjetivos "elegante,raro" --recursos "3d,tipografia" [--evitar "neon"] [--libs gsap] [--desde 2022]
//        [--excluir "slug1,slug2"]        (não repete sites já mostrados: use ao pedir "mostre outros")
//        [--sugestao "texto livre ou URL"] (opção D: reprocura com a sugestão do usuário)
//        [--json]
// Saída: markdown pronto para mostrar ao usuário (ou JSON). Capturas em acervo/<fonte>/final/<slug>/ (desktop.jpg, mobile.jpg).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { perfilDe } from './layout.mjs';

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
for (const t of temas) { let p = norm(t.id) === q ? 10 : 0; for (const w of t.palavras.filter((w, i, a) => !a.some(o => norm(o) !== norm(w) && norm(o).includes(norm(w)) && q.includes(norm(o))))) if (w.length > 3 ? q.includes(norm(w)) : new RegExp('(^|[^a-z0-9])' + norm(w) + '([^a-z0-9]|$)').test(q)) p += w.length > 3 ? 3 : 1; if (p > melhor) { melhor = p; tema = t; } }
tema = tema || temas.find(t => t.id === 'corporativo');

// ---------- 1) sites ----------
// usa TODOS os sites válidos da base (--todos) e o encaixe de layout (layout.mjs): o site de referência precisa ter uma estrutura que combine com o tema
const pesquisa = (extra = []) => node('pesquisar-referencias.mjs', ['--tema', args.tema, '--recursos', args.recursos || '', '--libs', args.libs || '', '--desde', String(args.desde ?? 0), '--limite', '9999', '--todos', ...(args.tipo ? ['--tipo', String(args.tipo)] : []), ...extra]);
const excluir = new Set(lista(args.excluir));
// desempate: nicho mais específico do tema (1º da lista) ganha; nichos genéricos perdem
const GENERICOS = new Set(['landing page', 'app', 'digital product', 'experimental', 'announcement', 'launching soon', 'informational']);
const nota = r => r.pts + (norm(r.nicho || '') === norm((r.fonte === 'awwwards' ? tema.awwwards : tema.opl)[0] || '') ? 2 : 0) - (GENERICOS.has(norm(r.nicho || '')) ? 1.5 : 0);
const consulta = pesquisa();
const base = consulta.referencias.filter(r => !excluir.has(r.slug)).map(r => ({ ...r, nota: +nota(r).toFixed(1) })).sort((a, b) => b.nota - a.nota || (b.ano || 0) - (a.ano || 0));

// D: sugestão do usuário (URL/host que esteja no acervo, ou texto livre vira nova consulta)
let sugestao = null;
if (args.sugestao) {
  const s = String(args.sugestao);
  const host = u => { try { return new URL(/^https?:/.test(u) ? u : 'https://' + u).hostname.replace(/^www\./, ''); } catch { return ''; } };
  const alvo = /\./.test(s) && !/\s/.test(s) ? host(s) : '';
  const achados = alvo ? pesquisa(['--tema', s]).referencias.filter(r => host(r.url) === alvo) : pesquisa(['--tema', s, '--recursos', args.recursos || '']).referencias.filter(r => !excluir.has(r.slug)).slice(0, 3);
  sugestao = { entrada: s, noAcervo: achados, aviso: achados.length ? null : 'Não está no acervo local: pesquise ao vivo (Awwwards, One Page Love, tasteskill.dev) e capture com recapturar.mjs.' };
}

// diversidade: A, B, C não repetem fonte+nicho; a RECOMENDADA é a de maior nota (4ª opção, distinta)
const evitar = lista(args.evitar).map(norm);
const ok = base.filter(r => !evitar.some(e => norm(`${r.titulo} ${r.nicho}`).includes(e)));
const E = ok[0] || null;
const A_C = []; const usados = new Set(E ? [E.slug] : []);
for (const r of ok) {
  if (A_C.length === 3) break; if (usados.has(r.slug)) continue;
  if (!A_C.some(x => x.fonte === r.fonte && norm(x.nicho || '') === norm(r.nicho || ''))) { A_C.push(r); usados.add(r.slug); }
}
for (const r of ok) { if (A_C.length === 3) break; if (!usados.has(r.slug)) { A_C.push(r); usados.add(r.slug); } }
const letras = ['A', 'B', 'C'];
const fonteNome = f => (f === 'awwwards' ? 'Awwwards' : 'One Page Love');
const link = r => `[${r.titulo}](${r.url})`;
const medidos = base.filter(r => r.layout != null).length;
const encaixaPorque = r => [r.nicho ? `assunto: ${r.nicho}` : null, r.layoutMotivos?.length ? `layout: ${r.layoutMotivos.join(', ')}` : 'layout ainda não medido (coleta em andamento: confira a captura)'].filter(Boolean).join(' | ');
const sites = {
  opcoes: A_C.map((r, i) => ({ letra: letras[i], fonteNome: fonteNome(r.fonte), link: link(r), porQueEncaixa: encaixaPorque(r), ...r })),
  recomendada: E ? { letra: 'E', rotulo: 'Recomendada por mim', fonteNome: fonteNome(E.fonte), link: link(E), porQueEncaixa: encaixaPorque(E), ...E } : null,
  base: { sitesConsiderados: base.length, comLayoutMedido: medidos, perfilDeLayout: consulta.perfilLayout },
  outro: { letra: 'D', rotulo: 'Outro: o usuário escreve um site, estilo ou ideia e a skill pesquisa de novo', sugestao },
};

// ---------- 2) estilos, com a paleta de origem de cada guia ----------
const tabela = {};
for (const l of fs.readFileSync(path.join(AQUI, '..', 'references', 'base-estilos', '_SKILL-original.md'), 'utf8').split('\n')) {
  const m = l.match(/^\| (Neomorphism|Minimalism|Brutalism|Glassmorphism|Claymorphism|Bento Grid|Pixel Art|Typography Luxury|Dark Mode|Cyberpunk) \|/); if (!m) continue;
  const c = l.split('|').map(x => x.trim());
  tabela[norm(m[1]).replace(/\s+/g, '-')] = { fundo: c[2], superficie: c[3], acento: c[4], texto: c[5], raio: c[6], profundidade: c[7], fonte: c[8] };
}
const NOMES = { neomorphism: 'Neomorphism', minimalism: 'Minimalism', brutalism: 'Brutalism', glassmorphism: 'Glassmorphism', claymorphism: 'Claymorphism', 'bento-grid': 'Bento Grid', 'pixel-art': 'Pixel Art', 'typography-luxury': 'Typography Luxury', 'dark-mode': 'Dark Mode', cyberpunk: 'Cyberpunk' };
const rank = node('escolher-estilo.mjs', ['--tema', args.tema, '--adjetivos', args.adjetivos || '', '--evitar', args.evitar || '']);
const estilos = rank.ranking.slice(0, 3).map((e, i) => ({ id: e.id, nome: NOMES[e.id] || e.id, pontos: e.pontos, recomendado: i === 0, paletaDeOrigem: tabela[e.id] || null, guia: `references/base-estilos/${e.id}.md` }));

// ---------- 3) paletas geradas por tom ----------
// matizes com pelo menos 40° entre si; faltando, completa com complementar e análogos
const dist = (a, b) => { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); };
const hues = [];
for (const h of [...tema.acentoHue, ...[180, 60, -60, 120].map(d => (tema.acentoHue[0] + d + 360) % 360)]) if (hues.length < 3 && hues.every(x => dist(x, h) >= 40)) hues.push(h);
// personalidade calma (elegante, silencioso...) baixa o croma; enérgica (ousado, vibrante...) sobe
const adjs = lista(args.adjetivos).map(norm);
const calmo = adjs.filter(a => /eleg|silenc|sobri|discret|calm|minimal|rar|sereno|refin|classic/.test(a)).length;
const vivo = adjs.filter(a => /ousad|vibr|jovem|irreverent|energ|divert|forte|alegr/.test(a)).length;
const fp = Math.max(0.55, Math.min(1.3, 1 - 0.12 * calmo + 0.12 * vivo));
const croma = +(tema.croma * fp).toFixed(3);
const perfis = [
  { nome: 'Assinatura', porque: 'acento mais típico do tema, croma padrão', hue: hues[0], f: 1 },
  { nome: 'Contida', porque: 'acento alternativo com croma baixo: mais sóbria e editorial', hue: hues[1], f: 0.7 },
  { nome: 'Ousada', porque: 'terceiro matiz com croma alto: diferencia do concorrente', hue: hues[2], f: 1.2 },
];
const paletas = { escuro: [], claro: [] };
for (const tom of ['escuro', 'claro']) {
  perfis.forEach((p, i) => {
    const r = node('gerar-paleta.mjs', ['--tema', tema.id, '--tom', tom, '--acento', String(p.hue), '--croma', String(+(croma * p.f).toFixed(3))]);
    paletas[tom].push({ id: `${tom === 'escuro' ? 'E' : 'C'}${i + 1}`, nome: p.nome, porque: p.porque, matiz: p.hue, cores: r.cores, contraste: r.contraste, aprovada: r.contraste.every(c => c.ok) });
  });
}
// recomendada: a do estilo recomendado (paleta de origem) quando existir; senão a "Assinatura" no tom padrão do tema
const tomPadrao = tema.tom === 'claro' ? 'claro' : 'escuro';
const paletaRecomendada = { origem: estilos[0]?.paletaDeOrigem ? `paleta de origem do estilo ${estilos[0].nome}` : 'gerada para o tema', estilo: estilos[0]?.paletaDeOrigem || null, gerada: paletas[tomPadrao][0] };

// ---------- 4) elemento 3D leve sugerido (sempre sugerir; método em references/3d-leve.md) ----------
const SUGESTAO_3D = { moda: 'tecido ou peça girando com dobras em shader (plano subdividido, sem modelo pesado)', luxo: 'joia ou frasco em ray tracing leve (como o diamante de ~23 KB)', arquitetura: 'maquete isométrica em linhas (geometria em código) que se monta com a rolagem', tecnologia: 'objeto abstrato do produto (cubo ou anel) com reflexo de ambiente procedural', ia: 'malha de pontos que reage ao cursor (instanciamento)', fintech: 'moeda ou cartão girando com brilho metálico (esfera + normal map procedural)', saude: 'forma orgânica suave (blob) respirando', alimentacao: 'o produto em destaque (grão, fruta, lata) girando com o mouse, textura gerada em canvas (método da lata)', educacao: 'livro ou sólido geométrico que se desdobra com a rolagem', arte: 'superfície deformada por ruído que segue o cursor', musica: 'disco ou onda 3D reagindo ao áudio', jogos: 'cena low-poly instanciada com parallax', esportes: 'bola ou objeto com trajetória na rolagem', viagem: 'globo leve com rotas em arco', imobiliario: 'maquete do imóvel em linhas, com corte ao rolar', corporativo: 'forma geométrica sóbria com um único material', sustentabilidade: 'folha ou semente em baixa poligonagem crescendo com a rolagem', infantil: 'objeto arredondado de brinquedo, material fosco, giro suave', beleza: 'frasco ou batom com reflexo de estúdio procedural', automotivo: 'silhueta do veículo em linhas + reflexos, giro de 360° por arraste', portfolio: 'objeto-assinatura do autor, só um, interativo', agencia: 'tipografia 3D extrudada leve reagindo ao cursor', ecommerce: 'o produto principal girando 360° (pôster + WebGL tardio)', eventos: 'forma do evento (ingresso, palco) com luz animada', editorial: 'objeto simbólico da pauta, discreto, sem competir com o texto' };
const sugestao3d = { elemento: SUGESTAO_3D[tema.id] || 'um único objeto simbólico do negócio, com geometria em código', regra: 'antes de modelar: imagem muito detalhada (várias vistas) ou vídeo de referência; peso-alvo ≤ 150 KB; pôster + WebGL tardio', prompts: 'references/prompts-3d.md', perguntar: 'Você gera a imagem/vídeo (eu passo o prompt com comandos de barra) ou eu mesmo faço a referência?' };

// ---------- 4b) scroll animado avançado (sempre sugerir logo depois do 3D; ver references/scroll-avancado.md) ----------
const SCROLL_REF = { 'pin+scrub': ['Tenztan https://www.tenztan.in/', 'The Art of Cinema https://www.theartofcinema.xyz/'], 'pilha sticky': ['Diego Liv https://www.diegoliv.works/', 'Collab Capitolium https://www.collabcapitolium.fr/', 'Rectangles FM https://rectangles.fm/'], 'clip-path': ['Zentry https://zentry.com/', 'Era Residence https://www.era-residence.com/'], 'vídeo no scroll': ['Zentry https://zentry.com/', 'Collab Capitolium https://www.collabcapitolium.fr/'] };
const padraoScroll = (args.recursos || '').includes('3d') || /joia|produto|objeto|3d/i.test(args.tema + ' ' + (args.recursos || '')) ? 'pin+scrub' : (['portfolio', 'agencia', 'moda', 'arte', 'ecommerce'].includes(tema.id) ? 'pilha sticky' : 'clip-path');
const sugestaoScroll = { recomendado: padraoScroll, referencias: SCROLL_REF[padraoScroll], alternativas: Object.keys(SCROLL_REF).filter(k => k !== padraoScroll).slice(0, 2).map(k => ({ padrao: k, referencias: SCROLL_REF[k] })), regra: 'um scroll de assinatura por página; só transform/opacity/clip-path; celular sem Lenis e pins curtos; movimento reduzido mostra o estado final', guia: 'references/scroll-avancado.md', perguntar: 'Qual scroll animado? (recomendado, 2 alternativas, você escolhe por mim, ou digitar)' };

const perfilLayout = perfilDe(tema.id, args.tipo);
const componentesSugeridos = { perfil: perfilLayout.nome, itens: perfilLayout.componentes || [], catalogo: 'references/componentes-plataformas.md' };

const plataformas = [
  'React Bits (componentes e fundos): https://reactbits.dev',
  'Transitions.dev (transições): https://transitions.dev',
  'Naocodei (motion CSS/JS): https://www.naocodei.com',
  'Pinstack (estrutura de seções, só referência): https://pinstack.app',
  'Taste Skill (direções e inspetor): https://tasteskill.dev',
];

const saida = {
  tema: tema.id, adjetivos: lista(args.adjetivos), nota: tema.nota,
  ordemDasPerguntas: ['1 sites (A, B, C, recomendada, outro) com links', '2 stack (HTML+CSS+JS+GSAP ou Next.js+GSAP)', '3 estilo (3 opções + você escolhe + digitar)', '4 paleta (do estilo, geradas, você escolhe + digitar)', '5 se houver 3D: molde ultrarrealista primeiro (quem gera: prompt com comandos de barra ou eu faço) e 3D estritamente igual ao molde', '6 scroll animado avançado (sempre, logo depois do 3D)', '7 componentes das plataformas (sempre usar)'],
  sites, estilos, paletas, paletaRecomendada, sugestao3d, sugestaoScroll, componentesSugeridos, plataformas,
  proximosPassos: 'Mostre os sites com links clicáveis e pergunte qual agrada mais. Em "Outro", rode de novo com --sugestao. Para "mostre outros", repita com --excluir <slugs já mostrados>.',
};
if (args.json) { console.log(JSON.stringify(saida, null, 2)); process.exit(0); }

// ---------- markdown ----------
const sw = c => `\`${c}\``;
console.log(`# Opções para "${args.tema}" (tema reconhecido: ${tema.id})\n\n_${tema.nota}_\n`);
console.log('## 1. Sites de referência (de toda a base, com layout que combina com o tema)\n');
console.log(`Base: ${sites.base.sitesConsiderados} sites válidos considerados, ${sites.base.comLayoutMedido} com layout já medido. Perfil de layout do tema: ${sites.base.perfilDeLayout}.\n`);
const linha = (r, rot) => `- **${rot}** ${r.link} (${r.ano ?? '?'}, ${r.fonteNome}): ${r.porQueEncaixa}\n  capturas: ${r.capturas}`;
sites.opcoes.forEach(r => console.log(linha(r, r.letra + '.')));
if (sites.recomendada) console.log(linha(sites.recomendada, 'E (recomendada).'));
console.log(`- **Outro:** escreva um site, estilo ou ideia e eu pesquiso de novo.`);
if (sugestao) { console.log(`  Entrada: "${sugestao.entrada}"`); sugestao.noAcervo.forEach(r => console.log(`  → [${r.titulo}](${r.url}) (${r.ano ?? '?'}, ${r.fonte})`)); if (sugestao.aviso) console.log('  ' + sugestao.aviso); }
console.log('\n## 2. Estilos (com a paleta de origem de cada um)\n');
console.log('| Estilo | Fundo | Acento | Texto | Fonte | Observação |\n|---|---|---|---|---|---|');
for (const e of estilos) console.log(`| ${e.nome}${e.recomendado ? ' (recomendado)' : ''} | ${e.paletaDeOrigem?.fundo || '-'} | ${e.paletaDeOrigem?.acento || '-'} | ${e.paletaDeOrigem?.texto || '-'} | ${e.paletaDeOrigem?.fonte || '-'} | ${e.pontos} pts |`);
console.log('\nAlém destes: "você escolhe por mim" ou digitar o estilo desejado.\n');
for (const tom of ['escuro', 'claro']) {
  console.log(`## 3. Paletas geradas para o tema — ${tom}\n`);
  console.log('| Id | Nome | Fundo | Superfície | Texto | Acento | Contraste | Quando usar |\n|---|---|---|---|---|---|---|---|');
  for (const p of paletas[tom]) console.log(`| ${p.id} | ${p.nome} | ${sw(p.cores.fundo)} | ${sw(p.cores.superficie)} | ${sw(p.cores.texto)} | ${sw(p.cores.acento)} | ${p.aprovada ? 'AA/AAA ok' : 'REVER'} | ${p.porque} |`);
  console.log('');
}
console.log(`Recomendada: ${paletaRecomendada.origem}. Ou escreva a sua.\n`);
console.log(`## 4. Elemento 3D leve sugerido\n\n- ${sugestao3d.elemento}\n- Regra: ${sugestao3d.regra}\n- ${sugestao3d.perguntar}\n`);
console.log(`## 4b. Scroll animado avançado sugerido

- Recomendado: ${sugestaoScroll.recomendado} (${sugestaoScroll.referencias.join(" · ")})
- Alternativas: ${sugestaoScroll.alternativas.map(a=>a.padrao+" ("+a.referencias.join(" · ")+")").join("; ")}
- Regra: ${sugestaoScroll.regra}
- Guia: ${sugestaoScroll.guia}
`);
console.log(`## Componentes sugeridos das plataformas (sempre usar; perfil: ${componentesSugeridos.perfil})\n` + componentesSugeridos.itens.map(x => '- ' + x).join('\n') + `\nCatálogo completo: ${componentesSugeridos.catalogo}\n`);
console.log('## Plataformas (links)\n' + plataformas.map(x => '- ' + x).join('\n'));
