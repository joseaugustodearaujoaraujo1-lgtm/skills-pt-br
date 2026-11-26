// Minera os estrutura.json do acervo e escreve references/padroes.md: o que se repete nos sites premiados.
// Uso: node gerar-padroes.mjs            (lê o acervo; regera o arquivo; pode rodar de novo quando houver mais dados)
import fs from 'node:fs';
import os from 'node:os';
import { capturaInvalida } from './qualidade.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ACERVO = process.env.ACERVO || path.join(os.homedir(), 'Documents', 'acervos-design', 'acervo');
const SAIDA = path.join(AQUI, '..', 'references', 'padroes.md');
const host = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };

const dados = { awwwards: [], onepagelove: [] };
for (const f of Object.keys(dados)) {
  const dir = path.join(ACERVO, f, 'final');
  for (const s of JSON.parse(fs.readFileSync(path.join(dir, 'acervo.json'), 'utf8'))) {
    if (s.erroDesktop || capturaInvalida(s) || host(s.urlFinal) === 'onepagelove.com' || host(s.url) === 'onepagelove.com') continue;
    try { const e = JSON.parse(fs.readFileSync(path.join(dir, s.slug, 'estrutura.json'), 'utf8')); if (!e.erro && e.pagina && (e.versao || 1) >= 3) dados[f].push({ ...s, e }); } catch {}
  }
}
const A = dados.awwwards, O = dados.onepagelove;
if (A.length + O.length < 20) { console.error('Poucos estrutura.json (' + (A.length + O.length) + '). Rode extrair-estrutura.mjs primeiro.'); process.exit(1); }

const pct = (lista, f) => { const v = lista.filter(x => { try { return f(x.e, x); } catch { return false; } }).length; return lista.length ? Math.round(100 * v / lista.length) : null; };
const med = (lista, f) => { const v = lista.map(x => { try { return f(x.e, x); } catch { return null; } }).filter(n => Number.isFinite(n)).sort((a, b) => a - b); return v.length ? v[Math.floor(v.length / 2)] : null; };
const p25 = (lista, f, q) => { const v = lista.map(x => { try { return f(x.e, x); } catch { return null; } }).filter(n => Number.isFinite(n)).sort((a, b) => a - b); return v.length ? v[Math.min(v.length - 1, Math.floor(v.length * q))] : null; };
const fmt = v => v === null || v === undefined ? '-' : (typeof v === 'number' && !Number.isInteger(v) ? v.toFixed(2).replace(/\.?0+$/, '') : v);
const topo = (lista, f, n = 4) => { const c = {}; for (const x of lista) { try { for (const [k, v] of f(x.e)) c[k] = (c[k] || 0) + v; } catch {} } return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k); };

const linhaPct = (nome, f) => [nome, pct(A, f), pct(O, f)];
const linhaMed = (nome, f, un = '') => [nome, med(A, f), med(O, f), un];

const T = [];
const tabela = (cab, linhas) => { T.push(`| ${cab.join(' | ')} |`, `|${cab.map(() => '---').join('|')}|`); for (const l of linhas) T.push(`| ${l.map(fmt).join(' | ')} |`); T.push(''); };
const tabPct = linhas => tabela(['Característica', `Awwwards (n=${A.length})`, `One Page Love (n=${O.length})`], linhas.map(l => [l[0], l[1] === null ? '-' : l[1] + '%', l[2] === null ? '-' : l[2] + '%']));
const tabMed = (linhas, nA = A.length, nO = O.length) => tabela(['Medida (mediana)', `Awwwards (n=${nA})`, `One Page Love (n=${nO})`], linhas.map(l => [l[0] + (l[3] ? ` (${l[3]})` : ''), l[1], l[2]]));

T.push('# Padrões que se repetem nos sites premiados', '',
  `Gerado por \`node scripts/gerar-padroes.mjs\` em ${new Date().toISOString().slice(0, 10)} a partir de **${A.length + O.length} sites** do acervo com coleta estrutural (Awwwards ${A.length}, One Page Love ${O.length}). Medido (versão 3 da coleta) com o navegador em 1440×900, depois de 6 s de espera (preloader) e com 1 rolagem de teste.`, '',
  '**Como ler:** ≥ 80% = quase universal (trate como regra); 50–79% = padrão forte; 20–49% = escolha comum; < 10% = raro (evite sem motivo). O One Page Love inclui muitos sites simples; o Awwwards representa o topo. Detecção por heurística: confirme visualmente em caso de dúvida.', '');

T.push('## 1. Estrutura e navegação', '');
tabPct([
  linhaPct('Tem menu no topo', e => !!e.menu), linhaPct('Menu fixo (fica ao rolar)', e => e.menu?.fixo), linhaPct('Menu com hambúrguer no desktop', e => e.menu?.hamburguer),
  linhaPct('Links do menu em caixa alta', e => e.menu?.textoEmCaixaAlta), linhaPct('Menu transparente (sobre o hero)', e => e.menu?.transparente),
  linhaPct('Tem preloader/intro cobrindo a tela', e => e.preloader?.existe), linhaPct('Preloader com contador/porcentagem', e => e.preloader?.comPorcentagem),
  linhaPct('Cursor próprio', e => e.cursorCustom), linhaPct('Tem rodapé (<footer>)', e => e.rodape?.existe), linhaPct('Rolagem virtual (documento travado, conteúdo maior)', e => e.pagina.rolagemVirtual),
]);
tabMed([
  linhaMed('Links no menu', e => e.menu?.links), linhaMed('Altura do menu', e => e.menu?.altura, 'px'),
  linhaMed('Altura da página', e => e.pagina.alturaVh, 'telas'), linhaMed('Seções', e => e.pagina.secoes), linhaMed('Palavras na página', e => e.pagina.palavras),
  linhaMed('Padding vertical das seções', e => e.pagina.paddingVerticalMedianoPx, 'px'), linhaMed('Maior texto do rodapé', e => e.rodape?.maiorTextoPx, 'px'),
]);

T.push('## 2. Hero (primeira dobra)', '');
tabPct([
  linhaPct('Fundo/mídia em vídeo', e => e.hero.video), linhaPct('Canvas/WebGL no hero', e => e.hero.canvas), linhaPct('Imagem grande no hero', e => e.hero.imagemGrande),
  linhaPct('Título em caixa alta', e => e.titulo?.caixaAlta), linhaPct('Título com fonte serifada', e => e.titulo?.serifa), linhaPct('Título centralizado', e => e.titulo?.alinhamento === 'center'),
  linhaPct('Título com tracking negativo', e => e.titulo && e.titulo.trackingEm < -0.005),
  linhaPct('Título grande (≥ 72 px)', e => e.titulo?.px >= 72), linhaPct('Título gigante (≥ 120 px)', e => e.titulo?.px >= 120),
]);
// Heros guiados por tipografia: sem canvas/vídeo na primeira dobra. Nos heros de WebGL o maior texto costuma ser um rótulo.
const soTipo = lista => lista.filter(x => !x.e.hero.canvas && !x.e.hero.video);
T.push(`**Só heros guiados por tipografia** (sem canvas nem vídeo; Awwwards n=${soTipo(A).length}, One Page Love n=${soTipo(O).length}):`, '');
tabMed([
  ['Tamanho do título', med(soTipo(A), e => e.titulo?.px), med(soTipo(O), e => e.titulo?.px), 'px'], ['Título em % da largura da tela', med(soTipo(A), e => e.titulo?.emVw), med(soTipo(O), e => e.titulo?.emVw), 'vw'],
  ['Palavras no título', med(soTipo(A), e => e.titulo?.palavras), med(soTipo(O), e => e.titulo?.palavras), ''], ['Heros com título ≥ 72 px', pct(soTipo(A), e => e.titulo?.px >= 72), pct(soTipo(O), e => e.titulo?.px >= 72), '%'],
], soTipo(A).length, soTipo(O).length);
tabMed([
  linhaMed('Tamanho do título', e => e.titulo?.px, 'px'), linhaMed('Título em % da largura da tela', e => e.titulo?.emVw, 'vw'),
  linhaMed('Palavras no título', e => e.titulo?.palavras), linhaMed('Entrelinha do título', e => e.titulo?.entrelinha), linhaMed('Tracking do título', e => e.titulo?.trackingEm, 'em'),
  linhaMed('Peso do título', e => e.titulo?.peso), linhaMed('Botões na primeira dobra', e => e.hero.botoes),
]);
T.push(`Distribuição do título (px): 25% ≤ ${fmt(p25(A, e => e.titulo?.px, .25))} · 75% ≤ ${fmt(p25(A, e => e.titulo?.px, .75))} no Awwwards; 25% ≤ ${fmt(p25(O, e => e.titulo?.px, .25))} · 75% ≤ ${fmt(p25(O, e => e.titulo?.px, .75))} no One Page Love.`, '');

T.push('## 3. Rolagem e movimento', '');
tabPct([
  linhaPct('Scroll suave (Lenis)', e => e.rolagem.lenis), linhaPct('Scroll suave (Locomotive)', e => e.rolagem.locomotive), linhaPct('Seção fixada (pin do ScrollTrigger)', e => e.rolagem.pinSpacer > 0),
  linhaPct('Elementos sticky (2 ou mais)', e => e.rolagem.sticky >= 2), linhaPct('Carrossel/slider', e => e.rolagem.carrossel > 0), linhaPct('scroll-snap em algum elemento', e => e.rolagem.scrollSnap),
  linhaPct('Marquee/ticker', e => e.motion.marquee), linhaPct('Respeita prefers-reduced-motion (CSS)', e => e.motion.prefersReducedMotion),
]);
tabMed([linhaMed('Animações ativas na página', e => e.motion.animacoesAtivas)]);
T.push(`**Durações de transição mais comuns (ms)**: Awwwards ${topo(A, e => e.motion.duracoesMs.map(([k, v]) => [k, v])).join(', ') || '-'} · One Page Love ${topo(O, e => e.motion.duracoesMs.map(([k, v]) => [k, v])).join(', ') || '-'}.`, '',
  `**Curvas mais comuns**: Awwwards ${topo(A, e => e.motion.curvas.map(([k, v]) => [k, v]), 5).map(c => '`' + c + '`').join(', ') || '-'} · One Page Love ${topo(O, e => e.motion.curvas.map(([k, v]) => [k, v]), 5).map(c => '`' + c + '`').join(', ') || '-'}.`, '');

T.push('## 4. Mídia', '');
tabPct([
  linhaPct('Usa <video>', e => e.midia.video > 0), linhaPct('Vídeo com autoplay', e => e.midia.videoAuto > 0), linhaPct('Usa <canvas>', e => e.midia.canvas > 0),
  linhaPct('Imagens com loading="lazy"', e => e.midia.imgLazy > 0), linhaPct('Imagens com srcset', e => e.midia.imgSrcset > 0), linhaPct('Usa iframe (embed)', e => e.midia.iframe > 0),
]);
tabMed([linhaMed('Imagens (<img>)', e => e.midia.img), linhaMed('SVGs inline', e => e.midia.svg), linhaMed('Vídeos', e => e.midia.video)]);

T.push('## 5. Forma e efeitos', '');
tabPct([
  linhaPct('Botões em pílula (maioria arredondada total)', e => e.forma.botaoPilula >= 0.5), linhaPct('Usa backdrop-filter (vidro)', e => e.efeitos.backdropFilter > 0), linhaPct('Usa mix-blend-mode', e => e.efeitos.mixBlend > 0),
  linhaPct('Usa clip-path (máscaras)', e => e.efeitos.clipPath > 0), linhaPct('Usa gradientes', e => e.efeitos.gradiente > 0), linhaPct('Texto com gradiente (background-clip: text)', e => e.efeitos.textoGradiente > 0),
  linhaPct('Usa filtros (blur etc.)', e => e.efeitos.filtro > 0), linhaPct('Usa sombras (box-shadow)', e => e.efeitos.sombra > 0), linhaPct('Usa display: grid', e => e.forma.grid > 0),
]);
tabMed([linhaMed('Raio dos cartões', e => e.forma.raioCartaoMedianoPx, 'px'), linhaMed('Largura máxima do conteúdo', e => e.larguraMaxMedianaPx, 'px')]);

T.push('## 6. Texto corrido', '');
tabMed([linhaMed('Tamanho do corpo', e => e.corpo.px, 'px'), linhaMed('Entrelinha do corpo', e => e.corpo.entrelinha), linhaMed('Subtítulos h2', e => e.corpo.h2), linhaMed('Subtítulos h3', e => e.corpo.h3)]);

// ---- regras derivadas automaticamente ----
const regras = [];
const caracteristicas = [
  ['menu fixo', e => e.menu?.fixo, 'Menu fixo no topo'], ['preloader', e => e.preloader?.existe, 'Preloader/intro'], ['lenis', e => e.rolagem.lenis, 'Scroll suave (Lenis)'],
  ['cursor', e => e.cursorCustom, 'Cursor próprio'], ['pin', e => e.rolagem.pinSpacer > 0, 'Seção fixada'], ['marquee', e => e.motion.marquee, 'Marquee'], ['video', e => e.midia.video > 0, 'Vídeo'],
  ['canvas', e => e.midia.canvas > 0, 'Canvas/WebGL'], ['clip', e => e.efeitos.clipPath > 0, 'Máscaras (clip-path)'], ['mix', e => e.efeitos.mixBlend > 0, 'mix-blend-mode'], ['glass', e => e.efeitos.backdropFilter > 0, 'Vidro (backdrop-filter)'],
  ['pilula', e => e.forma.botaoPilula >= 0.5, 'Botões em pílula'], ['caixa alta', e => e.titulo?.caixaAlta, 'Título em caixa alta'], ['reduced', e => e.motion.prefersReducedMotion, 'prefers-reduced-motion'],
];
T.push('## 7. Regras derivadas (Awwwards)', '');
for (const [, f, nome] of caracteristicas) { const p = pct(A, f); if (p === null) continue; const rotulo = p >= 80 ? 'quase universal' : p >= 50 ? 'padrão forte' : p >= 20 ? 'escolha comum' : p >= 10 ? 'minoria' : 'raro'; regras.push([p, `- **${nome}**: ${p}% (${rotulo}).`]); }
regras.sort((a, b) => b[0] - a[0]); T.push(...regras.map(r => r[1]), '');
T.push('## 8. O que isso significa para o design', '',
  '- **Título gigante é escolha, não regra**: só ~25% (Awwwards) e ~39% (One Page Love) têm título de 72 px ou mais na primeira dobra, e 13–16% passam de 120 px. Nos heros de WebGL (43% no Awwwards) o texto é mínimo e o protagonista é a cena.',
  '- O "maior texto da página" (mediana ~70 px no Awwwards, 75% até ~150 px; skill `identidade-visual`) costuma aparecer em **outra seção** (manifesto, rodapé, números), não no hero.',
  '- Quase todo site premiado **escolhe um protagonista** na primeira dobra: tipografia, cena 3D/canvas, imagem ou vídeo. Escolha o seu e deixe o resto em segundo plano.', '',
  '## 9. Como usar', '',
  '- Trate "quase universal" como **requisito de nível** (ex.: menu fixo, scroll suave) e "raro" como **risco** (justifique se usar).',
  '- Para cada recurso que você quiser (preloader, cursor, pin, marquee), peça referências com `pesquisar-referencias.mjs --recursos ...` e abra as capturas.',
  '- Os números descrevem o que existe, não o que ganha prêmio: use junto da [rubrica](rubrica.md) e do conceito do projeto.', '',
  '**Limites:** detecção por heurística de DOM (um preloader pode ser perdido se terminar antes de 0,9 s; um menu pode ser confundido com cabeçalho); sites com WebGL pesado podem ter menos medições; amostra do One Page Love limitada aos mais recentes.', '');
fs.writeFileSync(SAIDA, T.join('\n'));
console.log(`padroes.md gerado com ${A.length} (Awwwards) + ${O.length} (OPL) sites → ${SAIDA}`);
