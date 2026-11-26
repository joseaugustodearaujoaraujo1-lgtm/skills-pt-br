// Encaixe de LAYOUT: o quanto a estrutura medida de um site (estrutura.json) combina com o tipo de página que o tema pede.
// Usado por pesquisar-referencias.mjs e opcoes.mjs. A ideia: um site de café não deve se inspirar no layout de um painel de SaaS,
// mesmo que os dois sejam premiados. Cada perfil descreve a estrutura ideal; o encaixe vai de 0 a 6 pontos.
import path from 'node:path';

const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// secoes/palavras/img = [mínimo, máximo] ideais. hero: 'midia' (vídeo, imagem grande ou cena WebGL) | 'tipografia' | 'qualquer'.
export const PERFIS = {
  'vitrine-de-produto': { nome: 'vitrine de produto (imagem forte, poucas palavras)', componentes: ['Split Text (hero)','Scroll Reveal (manifesto)','Tilted Card ou Magic Bento (produtos)','Count Up (números)','Magnet (botão)','Noise (textura)'], secoes: [4, 9], palavras: [60, 450], img: [6, 60], hero: 'midia', rolagem: 'pin' },
  'portfolio-galeria': { nome: 'portfólio e galeria (obra em destaque, texto mínimo)', componentes: ['Flowing Menu ou Pill Nav','Accordion Gallery ou Circular Gallery','Image Trail','Target Cursor','Page side-by-side (transitions.dev)'], secoes: [3, 9], palavras: [30, 350], img: [10, 120], hero: 'qualquer', rolagem: 'horizontal' },
  'produto-digital': { nome: 'produto digital (explica funcionalidades, várias seções)', componentes: ['Split Text','Magic Bento','Scroll Stack','Spotlight Card','Counter','Dark Veil ou Aurora (um fundo, carregado tarde)'], secoes: [6, 13], palavras: [250, 1000], img: [3, 40], hero: 'qualquer', rolagem: 'pin' },
  'institucional': { nome: 'institucional (informação e confiança, mais texto)', componentes: ['Fade Content','Animated Content','Accordion (transitions.dev)','Count Up','Pill Nav'], secoes: [5, 11], palavras: [300, 1200], img: [4, 40], hero: 'qualquer', rolagem: null },
  'editorial': { nome: 'editorial (leitura longa, hierarquia tipográfica)', componentes: ['Scroll Reveal','Scroll Float','Gradual Blur','Text Type (discreto)'], secoes: [5, 16], palavras: [500, 3000], img: [2, 40], hero: 'tipografia', rolagem: null },
  'evento-e-experiencia': { nome: 'evento e experiência (impacto, poucas seções, muito movimento)', componentes: ['Scroll Velocity','Scroll Expand','Particle Text ou Warp Text','Click Spark','Target Cursor'], secoes: [3, 9], palavras: [30, 400], img: [4, 60], hero: 'midia', rolagem: 'pin' },
};

// tema (temas.json) -> perfil de layout
const POR_TEMA = {
  alimentacao: 'vitrine-de-produto', beleza: 'vitrine-de-produto', moda: 'vitrine-de-produto', luxo: 'vitrine-de-produto', automotivo: 'vitrine-de-produto', infantil: 'vitrine-de-produto', ecommerce: 'vitrine-de-produto',
  portfolio: 'portfolio-galeria', arte: 'portfolio-galeria', arquitetura: 'portfolio-galeria', agencia: 'portfolio-galeria',
  tecnologia: 'produto-digital', ia: 'produto-digital', fintech: 'produto-digital', educacao: 'produto-digital',
  corporativo: 'institucional', saude: 'institucional', sustentabilidade: 'institucional', imobiliario: 'institucional',
  editorial: 'editorial',
  eventos: 'evento-e-experiencia', musica: 'evento-e-experiencia', esportes: 'evento-e-experiencia', jogos: 'evento-e-experiencia', viagem: 'evento-e-experiencia',
};
// palavras que o usuário pode dar em --tipo para forçar o perfil
const TIPOS = [['vitrine', 'vitrine-de-produto'], ['produto', 'vitrine-de-produto'], ['loja', 'vitrine-de-produto'], ['portf', 'portfolio-galeria'], ['galeria', 'portfolio-galeria'], ['saas', 'produto-digital'], ['app', 'produto-digital'], ['landing', 'produto-digital'], ['institucional', 'institucional'], ['empresa', 'institucional'], ['editorial', 'editorial'], ['blog', 'editorial'], ['evento', 'evento-e-experiencia'], ['experiencia', 'evento-e-experiencia']];

export function perfilDe(temaId, tipo) {
  const t = norm(tipo || '');
  if (t) for (const [k, v] of TIPOS) if (t.includes(k)) return { id: v, ...PERFIS[v] };
  const id = POR_TEMA[temaId] || 'institucional';
  return { id, ...PERFIS[id] };
}

const dentro = (v, [min, max]) => (v >= min && v <= max ? 1 : (v >= min * 0.6 && v <= max * 1.5 ? 0.5 : 0));

// Retorna { pts (0-6), motivos[] } ou null se o site ainda não tem estrutura medida.
export function encaixe(est, perfil) {
  if (!est || est.erro) return null;
  let pts = 0; const motivos = [];
  const sec = est.pagina?.secoes, pal = est.pagina?.palavras, img = est.midia?.img;
  if (sec != null) { const f = dentro(sec, perfil.secoes); pts += 1.5 * f; if (f === 1) motivos.push(`${sec} seções`); }
  if (pal != null) { const f = dentro(pal, perfil.palavras); pts += 1.5 * f; if (f === 1) motivos.push(pal < 200 ? 'pouco texto' : pal > 700 ? 'bastante texto' : 'texto moderado'); }
  if (img != null) { const f = dentro(img, perfil.img); pts += 1 * f; if (f === 1) motivos.push(`${img} imagens`); }
  const h = est.hero || {}, midia = h.video || h.canvas || h.imagemGrande;
  if (perfil.hero === 'midia') { if (midia) { pts += 1.5; motivos.push(h.video ? 'hero com vídeo' : h.canvas ? 'hero com cena WebGL' : 'hero com imagem grande'); } }
  else if (perfil.hero === 'tipografia') { if (!midia) { pts += 1.5; motivos.push('hero de tipografia'); } }
  else pts += 0.75;
  const r = est.rolagem || {};
  if (perfil.rolagem === 'horizontal' && (r.carrossel > 0 || r.pinSpacer > 0)) { pts += 0.5; motivos.push('rolagem horizontal/fixada'); }
  else if (perfil.rolagem === 'pin' && (r.pinSpacer > 0 || r.sticky > 1)) { pts += 0.5; motivos.push('seções fixadas'); }
  else if (!perfil.rolagem) pts += 0.25;
  return { pts: +Math.min(6, pts).toFixed(1), motivos };
}
