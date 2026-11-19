// Mede quais padrões de UX/UI (scroll, 3D, animação, movimento, menu, hero, tipografia) aparecem na maioria dos sites da base
// e escreve references/padroes-ux.md. Lê dados.json + estrutura.json de cada site válido.
// Uso: node gerar-padroes-ux.mjs [--acervo <pasta do acervo>]
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const av = process.argv.slice(2);
const acervo = av.includes('--acervo') ? av[av.indexOf('--acervo') + 1] : path.join(os.homedir(), 'Documents', 'acervos-design', 'acervo');
const med = a => { a = a.filter(x => x > 0).sort((x, y) => x - y); return a.length ? a[Math.floor(a.length / 2)] : 0; };

const tot = { awwwards: 0, onepagelove: 0 }; let descartados = 0;
const R = {}, curvas = {}, dur = {}, nums = { vh: [], secoes: [], palavras: [], fontes: [] };
const GRUPOS = {
  'Scroll': ['Seção sticky', 'Scroll-snap', 'Lenis (rolagem suave)', 'ScrollTrigger', 'Pin (ScrollTrigger)', 'Locomotive'],
  '3D e canvas': ['Canvas (qualquer)', 'Hero com canvas/WebGL', 'Three.js/WebGL', 'Rive'],
  'Mídia': ['Vídeo', 'Vídeo autoplay', 'Hero com vídeo', 'Hero com imagem grande', 'SVG abundante (≥20)', 'Lottie'],
  'Animação e movimento': ['GSAP', 'Marquee', 'Preloader', 'SplitText', 'Framer Motion', 'Barba (transição de página)', 'Swiper/carrossel', 'Cursor customizado', 'prefers-reduced-motion'],
  'Efeitos visuais': ['clip-path', 'Gradiente', 'filter (blur/brilho)', 'mix-blend-mode', 'backdrop-filter (vidro)', 'Sombra', 'Texto em gradiente'],
  'Menu, hero e tipografia': ['Menu transparente', 'Menu fixo', 'Menu hambúrguer no desktop', 'Título ≥ 72 px', 'Tracking negativo no título', 'Título em CAIXA ALTA', 'Título serifado', 'Botão pílula', 'Grid CSS'],
};

for (const fonte of ['awwwards', 'onepagelove']) {
  const base = path.join(acervo, fonte, 'final');
  if (!fs.existsSync(base)) continue;
  for (const s of fs.readdirSync(base)) {
    let d, e;
    try { d = JSON.parse(fs.readFileSync(path.join(base, s, 'dados.json'), 'utf8')); e = JSON.parse(fs.readFileSync(path.join(base, s, 'estrutura.json'), 'utf8')); } catch { continue; }
    if (e.erro || !e.pagina || !(e.pagina.palavras > 20) || (d.http && d.http >= 400)) { descartados++; continue; }
    tot[fonte]++;
    const L = d.libs || {}, r = e.rolagem || {}, f = e.efeitos || {};
    const flags = {
      'GSAP': L.gsap, 'ScrollTrigger': L.scrollTrigger, 'Lenis (rolagem suave)': L.lenis || r.lenis, 'Locomotive': L.locomotive, 'Three.js/WebGL': L.three, 'Canvas (qualquer)': L.canvas > 0,
      'Vídeo': L.video > 0, 'Vídeo autoplay': e.midia?.videoAuto > 0, 'Lottie': L.lottie, 'Rive': L.rive, 'Swiper/carrossel': L.swiper || r.carrossel > 0, 'Barba (transição de página)': L.barba,
      'SplitText': L.splitText, 'Framer Motion': L.framerMotion, 'Seção sticky': r.sticky > 0, 'Pin (ScrollTrigger)': r.pinSpacer > 0, 'Scroll-snap': r.scrollSnap,
      'Preloader': e.preloader?.existe, 'Cursor customizado': e.cursorCustom, 'Marquee': e.motion?.marquee, 'prefers-reduced-motion': e.motion?.prefersReducedMotion,
      'Menu fixo': e.menu?.fixo, 'Menu transparente': e.menu?.transparente, 'Menu hambúrguer no desktop': e.menu?.hamburguer,
      'Hero com canvas/WebGL': e.hero?.canvas, 'Hero com vídeo': e.hero?.video, 'Hero com imagem grande': e.hero?.imagemGrande,
      'clip-path': f.clipPath > 0, 'mix-blend-mode': f.mixBlend > 0, 'backdrop-filter (vidro)': f.backdropFilter > 0, 'filter (blur/brilho)': f.filtro > 0, 'Gradiente': f.gradiente > 0, 'Texto em gradiente': f.textoGradiente > 0, 'Sombra': f.sombra > 0,
      'Título em CAIXA ALTA': e.titulo?.caixaAlta, 'Título serifado': e.titulo?.serifa, 'Título ≥ 72 px': e.titulo?.px >= 72, 'Tracking negativo no título': e.titulo?.trackingEm < 0,
      'Botão pílula': e.forma?.botaoPilula > 0, 'Grid CSS': e.forma?.grid > 0, 'SVG abundante (≥20)': e.midia?.svg >= 20,
    };
    for (const k in flags) { R[k] ??= { awwwards: 0, onepagelove: 0 }; if (flags[k]) R[k][fonte]++; }
    nums.vh.push(e.pagina.alturaVh || 0); nums.secoes.push(e.pagina.secoes || 0); nums.palavras.push(e.pagina.palavras || 0);
    nums.fontes.push((d.fontes || []).filter(x => !/serif|sans|mono|system|inherit|cursive/i.test(x)).length);
    for (const [cv] of e.motion?.curvas || []) curvas[cv] = (curvas[cv] || 0) + 1;
    for (const [du] of e.motion?.duracoesMs || []) dur[du] = (dur[du] || 0) + 1;
  }
}
const N = tot.awwwards + tot.onepagelove;
const pc = (x, n) => n ? Math.round(x / n * 100) : 0;
const linha = k => { const v = R[k] || { awwwards: 0, onepagelove: 0 }; return { k, t: pc(v.awwwards + v.onepagelove, N), a: pc(v.awwwards, tot.awwwards), o: pc(v.onepagelove, tot.onepagelove) }; };
const topo = o => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => `\`${k}\` (${v})`).join(', ');

let md = `# Padrões de UX/UI da base (medidos em ${N} sites válidos)\n\n`;
md += `Gerado por \`scripts/gerar-padroes-ux.mjs\` em ${new Date().toISOString().slice(0, 10)}. Amostra: **${tot.awwwards} do Awwwards** e **${tot.onepagelove} do One Page Love** com estrutura medida (${descartados} descartados por erro, bloqueio ou pouca informação). Porcentagem = sites da base que têm o recurso na página inicial (detecção por DOM, bibliotecas e CSS em 1440 px); **não prova que o efeito é bom**, só que é comum. "Maioria" = acima de 50%.\n\n`;
md += `**Medianas da página:** ${med(nums.vh)} telas de altura (Awwwards e OPL juntos), ${med(nums.secoes)} seções, ${med(nums.palavras)} palavras, ${med(nums.fontes)} famílias de fonte. Os 7 sites de scroll avançado de \`scroll-avancado.md\` têm 14 a 35 telas: são **exceção** (nível máximo), não a regra.\n\n`;
for (const [g, itens] of Object.entries(GRUPOS)) {
  md += `## ${g}\n\n| Recurso | Todos | Awwwards | One Page Love |\n|---|---|---|---|\n`;
  for (const l of itens.map(linha).sort((x, y) => y.t - x.t)) md += `| ${l.k} | ${l.t}% | ${l.a}% | ${l.o}% |\n`;
  md += '\n';
}
md += `## Curvas e durações de transição (mais usadas)\n\n- Curvas (nº de sites): ${topo(curvas)}.\n- Durações em ms (nº de sites): ${topo(dur)}.\n- Leitura: a maioria usa \`ease\` e 200–500 ms; o acabamento "premium" aparece em curvas \`cubic-bezier(.19,1,.22,1)\` (expo-out) e \`cubic-bezier(.22,1,.36,1)\`.\n\n`;
md += `## Como usar\n- O que passa de 50% é **expectativa do público** (grid, sombra suave, clip-path, gradiente): fazer sem destaque.\n- O que está entre 20% e 50% é **diferencial de linguagem**: escolha com propósito (sticky, marquee, mix-blend, preloader, scroll-snap, Lenis, canvas).\n- O que está abaixo de 20% é **assinatura rara** (Three.js em hero, pin longo, Barba, SplitText, cursor customizado): use um, bem feito.\n- Diferença entre as bases: o Awwwards usa muito mais **GSAP, ScrollTrigger, preloader, canvas/WebGL, Barba e SplitText**; o One Page Love usa mais **sticky, vidro (\`backdrop-filter\`), vídeo autoplay, títulos grandes e grid**.\n`;
const destino = path.join(AQUI, '..', 'references', 'padroes-ux.md');
fs.writeFileSync(destino, md);
console.log(`ok: ${N} sites (${tot.awwwards} Awwwards + ${tot.onepagelove} OPL) → ${destino}`);
