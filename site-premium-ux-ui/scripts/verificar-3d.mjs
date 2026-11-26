// Portão do elemento 3D (references/pipeline-3d.md): só Three.js, nada proibido, menos de 200 KB.
// Uso: node verificar-3d.mjs <pasta-ou-arquivo do elemento> [mais pastas ou arquivos...] [--poster arquivo.webp] [--limite 200]
// Mede os arquivos do elemento sem compressão (a biblioteca `three` não entra). O pôster entra na soma.
import fs from 'node:fs';
import path from 'node:path';

const av = process.argv.slice(2);
const opt = n => { const i = av.indexOf('--' + n); return i >= 0 ? av[i + 1] : undefined; };
const alvos = av.filter((a, i) => !a.startsWith('--') && !av[i - 1]?.startsWith('--'));
const LIMITE = (+opt('limite') || 200) * 1024;
if (!alvos.length || !alvos.every(a => fs.existsSync(a))) { console.log('Uso: node verificar-3d.mjs <pasta-ou-arquivo do elemento> [--poster arquivo] [--limite 200]'); process.exit(2); }

const R = []; const res = (ok, item, det) => R.push({ ok, item, det });
const listar = p => fs.statSync(p).isDirectory()
  ? fs.readdirSync(p, { withFileTypes: true }).flatMap(d => d.name === 'node_modules' ? [] : listar(path.join(p, d.name)))
  : [p];
const arquivos = [...new Set(alvos.flatMap(listar))];
const rel = f => path.relative(process.cwd(), f) || f;
const CODIGO = /\.(m?js|cjs|ts|tsx|jsx|glsl|vert|frag|json)$/i;
const PROIBIDO_EXT = /\.(glb|gltf|obj|fbx|stl|ply|usdz?|dae|3ds|blend|bin|png|jpe?g|webp|avif|gif|bmp|tga|hdr|exr|ktx2?|basis|dds|mp4|webm|mov)$/i;

const extProibidas = arquivos.filter(f => PROIBIDO_EXT.test(f));
res(!extProibidas.length, 'Sem arquivos de modelo, textura, HDRI ou vídeo', extProibidas.map(f => rel(f)).join(', ') || 'nenhum');

const codigos = arquivos.filter(f => CODIGO.test(f));
res(codigos.length > 0, 'Tem código do elemento', `${codigos.length} arquivo(s)`);

const REGRAS = [
  [/\b(GLTFLoader|OBJLoader|FBXLoader|DRACOLoader|KTX2Loader|RGBELoader|EXRLoader|HDRLoader|TextureLoader|CubeTextureLoader|ImageLoader|ImageBitmapLoader|FileLoader|ObjectLoader|BufferGeometryLoader|STLLoader|PLYLoader|USDZLoader)\b/, 'loader de arquivo'],
  [/data:(image|model|application\/octet-stream)[^'"`\s]*/i, 'data: URI'],
  [/['"`][A-Za-z0-9+/]{400,}={0,2}['"`]/, 'string longa em base64'],
  [/\.(glb|gltf|obj|fbx|png|jpe?g|webp|avif|hdr|exr|ktx2)(\?[^'"`]*)?['"`]/i, 'caminho de arquivo proibido'],
  [/\bfetch\s*\(|\bXMLHttpRequest\b|\bnew\s+Image\s*\(/, 'carga de arquivo externo'],
];
const LISTA_MAX = 600; // números seguidos num literal: acima disso é malha ou imagem copiada, não forma gerada por código
const achados = [];
let usaThree = false;
for (const f of codigos) {
  const t = fs.readFileSync(f, 'utf8');
  if (/from\s+['"]three(\/[^'"]*)?['"]|require\(\s*['"]three|import\s*\(\s*['"]three/.test(t)) usaThree = true;
  for (const [re, nome] of REGRAS) { const m = t.match(re); if (m) achados.push(`${rel(f)}: ${nome} (${m[0].slice(0, 40)})`); }
  for (const m of t.matchAll(/\[[\s\d.,eE+-]{2000,}\]/g)) {
    const n = (m[0].match(/-?\d+(\.\d+)?(e[+-]?\d+)?/gi) || []).length;
    if (n > LISTA_MAX) achados.push(`${rel(f)}: lista com ${n} números (malha ou imagem copiada?)`);
  }
}
res(!achados.length, 'Nada carregado de fora nem malha escondida', achados.join(' | ') || 'ok');
res(usaThree, 'Feito com Three.js (importa `three`)', usaThree ? 'ok' : 'nenhum import de `three` encontrado');

const poster = opt('poster');
if (poster && !fs.existsSync(poster)) res(false, 'Pôster existe', poster);
const pesoCodigo = codigos.reduce((s, f) => s + fs.statSync(f).size, 0);
const pesoPoster = poster && fs.existsSync(poster) ? fs.statSync(poster).size : 0;
const total = pesoCodigo + pesoPoster;
const kb = b => (b / 1024).toFixed(1) + ' KB';
res(total < LIMITE, `Peso < ${LIMITE / 1024} KB (sem compressão, sem a biblioteca three)`, `código ${kb(pesoCodigo)} + pôster ${kb(pesoPoster)} = ${kb(total)}`);

for (const r of R) console.log(`${r.ok ? 'OK  ' : 'FAIL'} ${r.item}: ${r.det}`);
const falhas = R.filter(r => !r.ok).length;
console.log(`\n${falhas} FAIL`);
console.log('Não medido aqui: fps, triângulos, chamadas de desenho e memória de vídeo. Meça no navegador com GPU (`renderer.info`).');
process.exit(falhas ? 1 : 0);
