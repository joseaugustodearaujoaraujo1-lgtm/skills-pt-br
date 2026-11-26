// Monta o BRIEF de design de um projeto (brief.json + tokens.css) juntando tema, estilo, paleta, tipografia,
// motion e referências do acervo. Qualquer agente constrói a partir dele, sem reinterpretar o briefing.
// Uso:
//   node montar-brief.mjs --nome "Atelier Lume" --tema "joalheria" --adjetivos "elegante,sofisticado,raro"
//        --publico "mulheres 30-55, compra de presente" --recursos "3d,scroll,tipografia" --saida ./design
//        [--tom escuro] [--acento 85] [--evitar "neon,infantil"] [--libs gsap,three] [--3d sim|nao] [--ref3d "objeto=imagem-ou-video,..."]
// Saída: <saida>/brief.json, <saida>/tokens.css e <saida>/fontes.html (colar no <head>)  (NÃO sobrescreve se já existirem, use --forcar)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const args = {}; const av = process.argv.slice(2);
for (let i = 0; i < av.length; i++) if (av[i].startsWith('--')) { const p = av[i + 1]; args[av[i].slice(2)] = p && !p.startsWith('--') ? av[++i] : true; }
if (!args.nome || !args.tema) { console.error('Uso: node montar-brief.mjs --nome "X" --tema "joalheria" [--adjetivos a,b,c] [--publico "..."] [--recursos 3d,scroll] [--fontes "Título,Corpo,Detalhe"] [--saida ./design]'); process.exit(1); }
const saida = path.resolve(args.saida || './design');
if (!args.forcar && (fs.existsSync(path.join(saida, 'brief.json')) || fs.existsSync(path.join(saida, 'tokens.css')))) { console.error(`Já existe brief em ${saida}. Use --forcar para sobrescrever.`); process.exit(1); }
fs.mkdirSync(saida, { recursive: true });

const rodar = (script, a) => JSON.parse(execFileSync(process.execPath, [path.join(AQUI, script), ...a, '--json'], { encoding: 'utf8', maxBuffer: 1e7 }));
const opt = (k, flag = k) => args[k] !== undefined ? [`--${flag}`, String(args[k])] : [];

const estilo = rodar('escolher-estilo.mjs', ['--tema', args.tema, ...opt('adjetivos'), ...opt('evitar'), ...opt('uso')]);
const paleta = rodar('gerar-paleta.mjs', ['--tema', args.tema, ...opt('tom'), ...opt('acento'), ...opt('croma'), ...opt('variante')]);
let refs;
try { refs = rodar('pesquisar-referencias.mjs', ['--tema', args.tema, ...opt('recursos'), ...opt('libs'), ...opt('desde'), '--limite', '10']); }
catch { refs = { referencias: [] }; console.error('  AVISO: acervo não encontrado; brief sem referências (complete com pesquisa ao vivo no Awwwards/One Page Love).'); }

// Fontes livres (Google Fonts) por estilo: título / corpo / detalhe. Substituem as fontes pagas dos sites premiados.
// typography-luxury: Bodoni Moda (didone de alto contraste, com itálico e eixo óptico) + Jost (geométrica de corpo) + Fragment Mono (rótulos).
// Saiu Playfair + Inter, "par de luxo muito visto" para o juiz (teste cego, rodada 2). Outras livres com caráter: Gloock, Fraunces, Cormorant Garamond.
const FONTES = {
  'typography-luxury': ['Bodoni Moda', 'Jost', 'Fragment Mono'], 'minimalism': ['Instrument Serif', 'Inter', 'DM Mono'],
  'brutalism': ['Anton', 'Space Grotesk', 'Space Mono'], 'dark-mode': ['Inter Tight', 'Inter', 'JetBrains Mono'],
  'glassmorphism': ['Outfit', 'Plus Jakarta Sans', 'JetBrains Mono'], 'claymorphism': ['Fredoka', 'Nunito', 'Nunito'],
  'bento-grid': ['Manrope', 'Inter', 'JetBrains Mono'], 'pixel-art': ['Press Start 2P', 'VT323', 'Silkscreen'],
  'neomorphism': ['DM Sans', 'Inter', 'DM Mono'], 'cyberpunk': ['Orbitron', 'Rajdhani', 'Share Tech Mono'],
};
const padraoFontes = FONTES[estilo.principal.id] || FONTES['dark-mode'];
// --fontes "Título,Corpo[,Detalhe]" troca as fontes do estilo (teste cego, rodada 5: o estilo trazia fontes que contrariavam o briefing)
const escolhidas = String(args.fontes || '').split(',').map(x => x.trim()).filter(Boolean);
const [fTitulo, fCorpo, fDetalhe] = [escolhidas[0] || padraoFontes[0], escolhidas[1] || padraoFontes[1], escolhidas[2] || padraoFontes[2]];
const quer3d = args['3d'] ? /sim|s|true|1/i.test(args['3d']) : /3d/i.test(args.recursos || '');
const lenis = /scroll/i.test(args.recursos || '') || true;

// Objetos 3D: --ref3d "diamante=./referencias-3d/diamante/ref.jpg,anel=./ref/anel.mp4" (imagem ou vídeo detalhado de cada objeto)
const objetos3d = String(args.ref3d || '').split(',').map(s => s.trim()).filter(Boolean).map(s => { const i = s.indexOf('='); const nome = i > 0 ? s.slice(0, i) : s; const arq = i > 0 ? s.slice(i + 1) : ''; return { nome, referencia: arq || null, referenciaExiste: !!arq && fs.existsSync(path.resolve(arq)), checklist: ['silhueta e proporções iguais às da referência', 'material e cor (reflexo, transparência, brilho)', 'iluminação e fundo da referência', 'comparação numérica ou lado a lado registrada'] }; });
if (quer3d && !objetos3d.length) console.warn('AVISO: site com 3D sem referência visual. Informe --ref3d "objeto=caminho-da-imagem-ou-video".');
const brief = {
  projeto: { nome: args.nome, tema: paleta.tema, publico: args.publico || null, adjetivos: String(args.adjetivos || '').split(',').map(s => s.trim()).filter(Boolean), evitar: String(args.evitar || '').split(',').map(s => s.trim()).filter(Boolean) },
  estilo: { principal: estilo.principal, secundario: estilo.secundario, aviso: estilo.aviso },
  paleta: { tom: paleta.tom, matizAcento: paleta.matizAcento, cores: paleta.cores, contraste: paleta.contraste, nota: paleta.nota },
  tipografia: { titulo: fTitulo, corpo: fCorpo, detalhe: fDetalhe, escala: { h1: 'clamp(3rem, 10vw, 10.5rem)', h2: 'clamp(2rem, 5.5vw, 5.5rem)', h3: 'clamp(1.25rem, 2vw, 2rem)', corpo: 'clamp(1rem, 1.1vw, 1.25rem)' }, entrelinhaTitulo: 0.95, trackingTitulo: '-0.03em', entrelinhaCorpo: 1.5, regras: ['no máximo 2 famílias + 1 de detalhe', 'hierarquia por escala e peso, não por cor', 'medida de leitura 60-75 caracteres'] },
  motion: { stack: quer3d ? ['gsap', 'ScrollTrigger', 'lenis', 'three'] : ['gsap', 'ScrollTrigger', 'lenis'], easing: { entrada: 'cubic-bezier(0.25, 1, 0.5, 1)', transicao: 'cubic-bezier(0.76, 0, 0.24, 1)' }, duracoesMs: { micro: 200, revelacao: 800, transicao: 1000 }, regras: ['1 efeito de assinatura + 1 padrão de revelação consistente', 'animar só transform e opacity', 'prefers-reduced-motion obrigatório', 'pausar canvas fora da tela'] },
  tridimensional: quer3d ? { usar: true, receita: '~/.claude/skills/site-nivel-awwwards/references/3d-leve.md', regra: 'TODO objeto 3D precisa de uma imagem muito detalhada (várias vistas) ou de um vídeo de como deve ficar, ANTES de modelar. Sem referência, não modele.', objetos: objetos3d, bloqueio: objetos3d.length ? (objetos3d.some(o => !o.referenciaExiste) ? 'Há objeto 3D com referência inexistente: corrija o caminho.' : null) : 'Nenhuma referência visual de objeto 3D informada (--ref3d "nome=caminho"). Obtenha imagem/vídeo detalhado antes de modelar.', orcamento: { celular: 'ate 60 draw calls, 100 mil triangulos, atlas 512px', desktop: 'ate 150 draw calls, 400 mil triangulos' }, planoB: 'imagem estática se WebGL falhar ou prefers-reduced-motion' } : { usar: false },
  referencias: refs.referencias.map(r => ({ titulo: r.titulo, ano: r.ano, fonte: r.fonte, url: r.url, motivos: r.por, capturas: r.capturas })),
  secoes: [
    { id: 'hero', objetivo: 'primeira impressão e promessa', referencia: null, motion: 'revelação do título por linhas/palavras + 1 gesto de assinatura', componente: null },
    { id: 'manifesto', objetivo: 'ideia da marca em uma frase grande', referencia: null, motion: 'texto que se revela com o scroll', componente: null },
    { id: 'conteudo', objetivo: 'o que a marca oferece (produtos, trabalhos, serviços)', referencia: null, motion: 'cards/galeria com hover e entrada escalonada', componente: null },
    { id: 'prova', objetivo: 'confiança: números, depoimentos, logos, prêmios', referencia: null, motion: 'contadores ou marquee discreto', componente: null },
    { id: 'chamada', objetivo: 'ação principal', referencia: null, motion: 'botão com microinteração magnética/preenchimento', componente: null },
    { id: 'rodape', objetivo: 'fechar com marca e navegação', referencia: null, motion: 'tipografia grande e revelação ao final', componente: null },
  ],
  qualidade: { portao: '~/.claude/skills/site-nivel-awwwards/references/rubrica.md', alvos: { lighthouseDesktop: '>=90', lighthouseMobile: '>=75', LCP: '<2.5s', CLS: '<0.1', contraste: 'AA', viewports: ['1440', '768', '390'] } },
  proximosPassos: [...(quer3d ? ['ANTES de modelar qualquer objeto 3D: reunir imagem muito detalhada (várias vistas) ou vídeo de como ele deve ficar e registrar em referencias-3d/<objeto>/README.md'] : []), 'Abrir as capturas das referências (3-6) e preencher a referência de cada seção em "secoes"', 'Conferir a biblioteca de componentes para cada seção (skill biblioteca-componentes)', 'Validar paleta e fontes com o usuário antes de construir', 'Construir e passar pelo portão de qualidade (rubrica.md)'],
  geradoEm: new Date().toISOString(),
};
fs.writeFileSync(path.join(saida, 'brief.json'), JSON.stringify(brief, null, 2));

// Fontes por <link> com preconnect (menos uma etapa de rede que o @import). Só o título pede itálico real quando a família tem.
const COM_ITALICO = new Set(['Playfair Display', 'Bodoni Moda', 'Instrument Serif', 'Inter', 'Nunito', 'Jost']);
const familias = [...new Set([fTitulo, fCorpo, fDetalhe])].map(f => 'family=' + f.replace(/ /g, '+') + (f === fTitulo && COM_ITALICO.has(f) ? ':ital@0;1' : ''));
// Dica: para hospedar as fontes no próprio site (recomendado), rode scripts/baixar-fontes.mjs; fontes.html fica só como atalho de desenvolvimento.
fs.writeFileSync(path.join(saida, 'fontes.html'), `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${familias.join('&')}&display=swap">
`);
const c = paleta.cores, T = brief.tipografia;
const css = `/* Tokens de design — ${args.nome} (gerado por montar-brief.mjs; edite livremente, mantenha os nomes) */
/* Fontes: NÃO use @import aqui (cria uma cadeia de 3 requisições). Cole o conteúdo de fontes.html no <head>. */
:root {
  /* cor (${paleta.tom}; acento ${paleta.matizAcento}°) */
  --bg: ${c.fundo}; --surface: ${c.superficie}; --surface-2: ${c.superficie2}; --line: ${c.linha};
  --text: ${c.texto}; --text-muted: ${c.textoMudo}; --accent: ${c.acento}; --accent-soft: ${c.acentoSuave}; --on-accent: ${c.tintaNoAcento};
  /* tipografia */
  --font-display: '${fTitulo}', serif; --font-body: '${fCorpo}', system-ui, sans-serif; --font-detail: '${fDetalhe}', ui-monospace, monospace;
  --fs-h1: ${T.escala.h1}; --fs-h2: ${T.escala.h2}; --fs-h3: ${T.escala.h3}; --fs-body: ${T.escala.corpo};
  --lh-title: ${T.entrelinhaTitulo}; --lh-body: ${T.entrelinhaCorpo}; --tracking-title: ${T.trackingTitulo};
  /* espaço e forma */
  --space-section: clamp(4rem, 12vw, 12rem); --gutter: clamp(1rem, 4vw, 4rem); --radius: 12px; --max-w: 1440px;
  /* motion */
  --ease-out: ${brief.motion.easing.entrada}; --ease-in-out: ${brief.motion.easing.transicao};
  --dur-micro: ${brief.motion.duracoesMs.micro}ms; --dur-reveal: ${brief.motion.duracoesMs.revelacao}ms; --dur-transition: ${brief.motion.duracoesMs.transicao}ms;
}
@media (prefers-reduced-motion: reduce) { :root { --dur-micro: 0ms; --dur-reveal: 0ms; --dur-transition: 0ms; } }
html { background: var(--bg); color: var(--text); font-family: var(--font-body); line-height: var(--lh-body); }
h1, h2, h3 { font-family: var(--font-display); line-height: var(--lh-title); letter-spacing: var(--tracking-title); font-weight: 400; margin: 0; }
h1 { font-size: var(--fs-h1); } h2 { font-size: var(--fs-h2); } h3 { font-size: var(--fs-h3); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
`;
fs.writeFileSync(path.join(saida, 'tokens.css'), css);
console.log(`Brief criado em ${saida}`);
console.log(`  estilo: ${estilo.principal.nome}${estilo.secundario ? ' + ' + estilo.secundario.nome : ''} | paleta ${paleta.tom}, acento ${paleta.matizAcento}° | fontes: ${fTitulo} / ${fCorpo} / ${fDetalhe}`);
console.log(`  ${brief.referencias.length} referências do acervo | 3D: ${quer3d ? 'sim' : 'não'} | contraste: ${paleta.contraste.every(x => x.ok) ? 'todos OK' : 'REVISAR'}`);
