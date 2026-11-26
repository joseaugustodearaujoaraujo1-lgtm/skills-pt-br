// Registra as aprovações do pipeline 3D (references/pipeline-3d.md) e bloqueia etapa pulada.
// Uso:
//   node estado-3d.mjs --objeto <obj> status
//   node estado-3d.mjs --objeto <obj> exigir  --etapa <etapa>            (sai com erro se a etapa anterior não foi aprovada)
//   node estado-3d.mjs --objeto <obj> aprovar --etapa <etapa> --fala "<palavras do usuário>"
//   node estado-3d.mjs --objeto <obj> alterar --etapa <etapa> --fala "<o que o usuário pediu>"   (anula esta e as seguintes)
//   node estado-3d.mjs --objeto <obj> dispensar --etapa blender --fala "<resposta do usuário>"   (caminho sem Blender)
// Etapas, em ordem: referencias, molde, blender, threejs, previa. "site" só serve para exigir (pede tudo aprovado).
// Opcional: --raiz <pasta do projeto> (padrão: pasta atual). Arquivo: <raiz>/referencias-3d/<obj>/estado.json
import fs from 'node:fs';
import path from 'node:path';

const ETAPAS = ['referencias', 'molde', 'blender', 'threejs', 'previa'];
const av = process.argv.slice(2);
const opt = n => { const i = av.indexOf('--' + n); return i >= 0 ? av[i + 1] : undefined; };
const acao = av.find((a, i) => !a.startsWith('--') && !av[i - 1]?.startsWith('--'));
const objeto = opt('objeto'), etapa = opt('etapa'), fala = opt('fala');
const sair = (msg, cod = 1) => { console.log(msg); process.exit(cod); };

if (!objeto || !/^[\w-]+$/.test(objeto)) sair('Informe --objeto (letras, números, - ou _).');
if (!['status', 'exigir', 'aprovar', 'alterar', 'dispensar'].includes(acao)) sair('Ação: status, exigir, aprovar, alterar ou dispensar.');
const arq = path.join(path.resolve(opt('raiz') || '.'), 'referencias-3d', objeto, 'estado.json');
const est = fs.existsSync(arq) ? JSON.parse(fs.readFileSync(arq, 'utf8')) : { objeto, etapas: {}, historico: [] };
const salvar = () => { fs.mkdirSync(path.dirname(arq), { recursive: true }); fs.writeFileSync(arq, JSON.stringify(est, null, 2) + '\n'); };
const dispensada = e => est.etapas[e]?.status === 'dispensada';
const aprovada = e => est.etapas[e]?.status === 'aprovada' || dispensada(e); // etapa que não bloqueia as seguintes

if (acao === 'status') {
  for (const e of ETAPAS) console.log(`${dispensada(e) ? 'DISPENSADA' : aprovada(e) ? 'APROVADA  ' : 'pendente  '}  ${e}${est.etapas[e]?.fala ? `  ("${est.etapas[e].fala}")` : ''}`);
  const prox = ETAPAS.find(e => !aprovada(e));
  sair(prox ? `\nPróxima etapa: ${prox}` : '\nTudo aprovado: pode construir o site.', 0);
}

const alvo = etapa === 'site' && acao === 'exigir' ? ETAPAS.length : ETAPAS.indexOf(etapa);
if (alvo < 0) sair(`Etapa inválida. Use: ${ETAPAS.join(', ')}${acao === 'exigir' ? ', site' : ''}.`);
const faltando = ETAPAS.slice(0, alvo).filter(e => !aprovada(e));

if (acao === 'exigir') {
  if (faltando.length) sair(`BLOQUEADO: antes de "${etapa}", o usuário precisa aprovar: ${faltando.join(', ')}. Pare e peça a aprovação.`);
  sair(`OK: pode fazer "${etapa}".`, 0);
}

if (!fala || fala.trim().length < 2) sair('Informe --fala com as palavras do usuário nesta conversa. Sem resposta do usuário, não registre nada.');
const agora = new Date().toISOString();
if (acao === 'dispensar') {
  if (etapa !== 'blender') sair('Só a etapa "blender" pode ser dispensada.');
  if (faltando.length) sair(`Não dá para dispensar "blender": faltam ${faltando.join(', ')}.`);
  if (est.etapas.blender?.status === 'aprovada') sair('O Blender já foi aprovado. Para trocar de caminho, use antes: alterar --etapa blender.');
  est.etapas.blender = { status: 'dispensada', fala, em: agora };
  est.historico.push({ acao, etapa, fala, em: agora });
  salvar();
  sair('Blender dispensado pelo usuário. Próxima: threejs.', 0);
}
if (acao === 'aprovar') {
  if (faltando.length) sair(`Não dá para aprovar "${etapa}": faltam ${faltando.join(', ')}.`);
  est.etapas[etapa] = { status: 'aprovada', fala, em: agora };
  est.historico.push({ acao, etapa, fala, em: agora });
  salvar();
  const prox = ETAPAS[alvo + 1];
  sair(`Aprovada: ${etapa}. ${prox ? `Próxima: ${prox}.` : 'Tudo aprovado: pode construir o site.'}`, 0);
}
// alterar: anula esta etapa e as seguintes
const anuladas = ETAPAS.slice(alvo).filter(aprovada);
for (const e of ETAPAS.slice(alvo)) delete est.etapas[e];
est.etapas[etapa] = { status: 'alterar', fala, em: agora };
est.historico.push({ acao, etapa, fala, anuladas, em: agora });
salvar();
sair(`Alteração registrada em "${etapa}"${anuladas.length ? `; aprovações anuladas: ${anuladas.join(', ')}` : ''}. Refaça e peça aprovação de novo.`, 0);
