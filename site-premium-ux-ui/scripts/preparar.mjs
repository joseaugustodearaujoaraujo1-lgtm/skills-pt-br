// Preparação da skill: mostra o que falta e instala SÓ o que o usuário autorizar.
// Uso:
//   node preparar.mjs                      só confere e lista (não instala nada)
//   node preparar.mjs --instalar blender,ffmpeg --autorizado "<resposta do usuário>"
//   node preparar.mjs --instalar blender --simular      mostra o comando, sem rodar
// Regras para o agente: references/preparacao.md.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SKILL = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FERRAMENTAS = path.join(SKILL, 'ferramentas');
const MODULOS = path.join(SKILL, 'starters', 'modulos');
const SO = process.platform; // win32 | darwin | linux
const HOME = os.homedir();

const existe = p => !!p && fs.existsSync(p);
const roda = (cmd, args = ['--version']) => spawnSync(cmd, args, { stdio: 'ignore' }).status === 0;
const subpastas = d => { try { return fs.readdirSync(d); } catch { return []; } };

const temNavegador = () => [process.env.CHROME, 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe'),
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].some(existe);
const temBlender = () => existe(process.env.BLENDER) || subpastas(FERRAMENTAS).some(v => existe(path.join(FERRAMENTAS, v, 'blender.exe'))) || roda('blender') || existe('/Applications/Blender.app') ||
  ['C:/Program Files/Blender Foundation', path.join(process.env.LOCALAPPDATA || '', 'Programs/Blender Foundation')]
    .some(d => subpastas(d).some(v => existe(path.join(d, v, 'blender.exe'))));
const temPlaywright = () => [process.env.PLAYWRIGHT_CORE, path.join(FERRAMENTAS, 'node_modules/playwright-core'),
  path.join(process.cwd(), 'node_modules/playwright-core'), path.join(HOME, 'Documents/acervos-design/node_modules/playwright-core'),
  '/opt/node-tools/node_modules/playwright-core'].some(existe);
const temModulos = () => ['three', 'esbuild', 'gsap', 'lenis'].every(p => existe(path.join(MODULOS, 'node_modules', p)));

// comando por sistema: [programa, argumentos]; null = o script não instala, só orienta
const sistema = (win, mac, linux) => ({ win32: win, darwin: mac, linux }[SO] || null);
const winget = id => ['winget', ['install', '--id', id, '-e', '--accept-package-agreements', '--accept-source-agreements']];
const brew = (...a) => ['brew', ['install', ...a]];
const q = p => (SO === 'win32' ? `"${p}"` : p); // npm no Windows roda pelo shell: caminho entre aspas

const ITENS = [
  { id: 'navegador', nome: 'Google Chrome', obrigatorio: true, uso: 'capturas, verificador e juiz', tem: temNavegador,
    cmd: sistema(winget('Google.Chrome'), brew('--cask', 'google-chrome'), null), manual: 'instale Chrome ou Chromium pelo gerenciador do sistema' },
  { id: 'playwright', nome: 'playwright-core (npm)', obrigatorio: true, uso: 'verificador e juiz', tem: temPlaywright,
    cmd: ['npm', ['install', '--no-audit', '--no-fund', '--prefix', q(FERRAMENTAS), 'playwright-core@1']], tamanho: 'poucos MB' },
  { id: 'modulos', nome: 'three, esbuild, gsap, lenis (npm)', uso: 'elemento 3D e módulos-base', tem: temModulos,
    cmd: ['npm', ['install', '--no-audit', '--no-fund', '--prefix', q(MODULOS)]], tamanho: 'dezenas de MB' },
  { id: 'blender', nome: 'Blender', uso: 'só para o caminho com Blender no 3D (etapa 2, opcional)', tem: temBlender, tamanho: 'centenas de MB',
    cmd: sistema(winget('BlenderFoundation.Blender'), brew('--cask', 'blender'), null), manual: 'baixe em https://www.blender.org/download/' },
  { id: 'ffmpeg', nome: 'ffmpeg', uso: 'comparar vistas e gravar a prévia', tem: () => roda('ffmpeg', ['-version']),
    cmd: sistema(winget('Gyan.FFmpeg'), brew('ffmpeg'), null), manual: 'instale o pacote ffmpeg pelo gerenciador do sistema' },
  { id: 'python', nome: 'Python 3', uso: 'só para réplica de site', tem: () => roda('python3') || roda('python'),
    cmd: sistema(winget('Python.Python.3.13'), brew('python'), null), manual: 'instale o pacote python3 pelo gerenciador do sistema' },
];

const av = process.argv.slice(2);
const opt = n => { const i = av.indexOf('--' + n); return i >= 0 ? av[i + 1] : undefined; };
const texto = i => i.cmd ? `${i.cmd[0]} ${i.cmd[1].join(' ')}` : i.manual;

if (!av.includes('--instalar')) {
  const faltam = ITENS.filter(i => !i.tem());
  console.log(`Node ${process.versions.node}${+process.versions.node.split('.')[0] >= 20 ? '' : ' (ANTIGO: precisa 20+)'}`);
  console.log(`Prontos: ${ITENS.filter(i => !faltam.includes(i)).map(i => i.id).join(', ') || 'nenhum'}`);
  if (!faltam.length) console.log('Nada falta. A skill está pronta.');
  for (const i of faltam) console.log(`FALTA ${i.id} | ${i.nome} | ${i.obrigatorio ? 'obrigatório' : 'opcional'} | ${i.uso} | grátis${i.tamanho ? ', ' + i.tamanho : ''}\n      ${i.cmd ? 'comando' : 'manual'}: ${texto(i)}`);
  if (faltam.length) console.log('\nNada foi instalado. PERGUNTE ao usuário quais itens instalar (references/preparacao.md).');
  process.exit(faltam.some(i => i.obrigatorio) ? 1 : 0);
}

const pedidos = (opt('instalar') || '').split(',').map(s => s.trim()).filter(Boolean);
const invalidos = pedidos.filter(p => !ITENS.some(i => i.id === p));
if (!pedidos.length || invalidos.length) { console.log(`Informe os itens: --instalar ${ITENS.map(i => i.id).join(',')}${invalidos.length ? ` (inválido: ${invalidos.join(', ')})` : ''}`); process.exit(2); }
const simular = av.includes('--simular');
const autorizado = opt('autorizado');
if (!simular && (!autorizado || autorizado.startsWith('--') || autorizado.trim().length < 2)) {
  console.log('BLOQUEADO: pergunte ao usuário e passe a resposta dele em --autorizado "<resposta>". Nada foi instalado.');
  process.exit(2);
}

let falhas = 0;
for (const id of pedidos) {
  const i = ITENS.find(x => x.id === id);
  if (i.tem()) { console.log(`OK ${id}: já instalado`); continue; }
  if (!i.cmd) { console.log(`MANUAL ${id}: ${i.manual}`); falhas++; continue; }
  if (simular) { console.log(`SIMULAÇÃO ${id}: ${texto(i)}`); continue; }
  console.log(`Instalando ${id}. Se o sistema pedir permissão de administrador, quem confirma é o usuário.`);
  const r = spawnSync(i.cmd[0], i.cmd[1], { stdio: 'inherit', shell: SO === 'win32' && i.cmd[0] === 'npm' });
  if (r.status !== 0) { console.log(`ERRO ${id}: o comando falhou${r.error ? ` (${r.error.code})` : ''}. Comando: ${texto(i)}`); falhas++;
    console.log('Se a janela de administrador foi recusada ou fechada, NÃO repita sozinho: avise o usuário e pergunte.');
    if (id === 'blender') console.log(`Sem administrador: versão portátil (.zip) de https://www.blender.org/download/, extraída em ${FERRAMENTAS} (references/preparacao.md).`); }
  else console.log(i.tem() ? `OK ${id}: instalado` : `AVISO ${id}: comando terminou; abra um terminal novo (PATH) e rode preparar.mjs de novo`);
}
process.exit(falhas ? 1 : 0);
