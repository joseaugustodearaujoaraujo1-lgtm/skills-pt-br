#!/usr/bin/env node
// Gera o esqueleto do pacote liberável de um site da galeria (CLAUDE.md + conceito/).
// Uso: node scripts/gerar-pacote.mjs galeria/05-bruma
// Lê o site e escreve CLAUDE.md com mapa de arquivos, seções, cores, atributos data-* e comandos.
// Depois, o agente só preenche as marcas <PREENCHER> com o que é específico do site.
import fs from 'node:fs';
import path from 'node:path';

const pasta = path.resolve(process.argv[2] || '');
if (!fs.existsSync(path.join(pasta, 'package.json'))) { console.error('Informe a pasta de um site (com package.json).'); process.exit(1); }
const ler = (...p) => { const f = path.join(pasta, ...p); return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : ''; };
const pkg = JSON.parse(ler('package.json'));
const html = ler('public', 'index.html');
const css = ler('public', 'estilo.css') || ler('public', 'style.css');
const serv = ler('servir.mjs');
const porta = (pkg.scripts?.serve || '').match(/\d{4}/)?.[0] || '3001';

const unico = a => [...new Set(a)];
const secoes = unico([...html.matchAll(/<(section|header|footer|main)[^>]*\bid="([^"]+)"/g)].map(m => `${m[2]} (<${m[1]}>)`));
const dados = unico([...html.matchAll(/\b(data-[a-z0-9-]+)=/g)].map(m => m[1]));
const raiz = css.match(/:root\s*\{([^}]*)\}/s)?.[1] || '';
const cores = [...raiz.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)].map(m => `${m[1]}: ${m[2].trim()}`);
const temasCss = [...new Set([...css.matchAll(/html\[data-paleta="([^"]+)"\]/g)].map(m => m[1]))];
const lista = (a, vazio) => a.length ? a.map(x => `- \`${x}\``).join('\n') : vazio;
const arquivos = fs.readdirSync(path.join(pasta, 'public')).map(f => `- \`public/${f}\``).join('\n');
const nome = pkg.name || path.basename(pasta);

const md = `# ${nome}: pacote do site

> Gerado por \`scripts/gerar-pacote.mjs\`. Complete os trechos <PREENCHER> e apague este aviso.

## Como rodar
\`\`\`
npm install
npm run build        # gera public/app.js
npm run serve        # http://localhost:${porta}/
PLAYWRIGHT_CORE=/opt/node-tools/node_modules/playwright-core node ../../scripts/verificar-site.mjs http://localhost:${porta}/ --espera 4000   # precisa dar 0 FAIL
\`\`\`

## Mapa de arquivos
- \`src/\`: JS de origem (esbuild empacota em \`public/app.js\`). Não edite \`app.js\`.
${arquivos}
${fs.existsSync(path.join(pasta, 'cena')) ? '- `cena/`: scripts que geram renders e imagens.\n' : ''}
## Seções (ordem da página)
${lista(secoes, '- <PREENCHER>')}

## Cores por papel
${cores.length ? cores.map(c => `- \`${c}\``).join('\n') : '- <PREENCHER: criar variáveis por papel, ex. --cor-hero>'}
Trocar a paleta: \`?tema=<nome>\`. Temas prontos: ${temasCss.join(', ') || '<PREENCHER se existir>'} (blocos \`html[data-paleta="..."]\` no fim do :root).

## Atributos data-* que controlam comportamento
${lista(dados, '- nenhum ainda: <PREENCHER>')}

## Regras de rolagem
- Altura medida do original: <PREENCHER> px a 1440x900 (1 vh = 9 px).
- Trechos fixos (\`position: sticky\`) com timeline GSAP presa à rolagem: <PREENCHER>.
- Lenis controla a rolagem suave; não use scroll nativo em animações.

## Regras do celular (390x844)
- <PREENCHER>

## Armadilhas conhecidas
- <PREENCHER>

## Imagens
- Essenciais (o usuário gera): ver \`../IMAGENS-PARA-GERAR.md\`.
- Não essenciais: placeholder de mesma proporção.

## Capturas-alvo
Em \`conceito/\` (nossas, uma por seção, desktop e celular). Gere com \`replica/ferramentas/telas2.cjs\`.
`;
const arqMd = path.join(pasta, 'CLAUDE.md');
const protegido = fs.existsSync(arqMd) && !fs.readFileSync(arqMd, 'utf8').includes('<PREENCHER') && !process.argv.includes('--forcar');
if (!protegido) fs.writeFileSync(arqMd, md); else console.log('CLAUDE.md já preenchido: mantido (use --forcar para regerar).');
fs.mkdirSync(path.join(pasta, 'conceito'), { recursive: true });

// PROMPT-DE-USO.md: perguntas iniciais e 3 caminhos (sempre regerado, é só texto de uso)
const temas = unico([...css.matchAll(/html\[data-paleta="([^"]+)"\]/g)].map(m => m[1]));
const papeis = cores.filter(c => c.startsWith('--cor-')).map(c => c.split(':')[0]);
const uso = `# Como usar o site ${nome}

Cole este texto numa sessão nova do Claude Code, com este repositório aberto. Ele faz as perguntas e escolhe o caminho.

\`\`\`
Leia galeria/${path.basename(pasta)}/CLAUDE.md e galeria/${path.basename(pasta)}/conceito/ (capturas-alvo).
Antes de mexer em qualquer coisa, me faça estas perguntas e espere a resposta:
1. Qual é a marca ou o cliente (nome, cidade, o que vende) e quem é o público?
2. Vou usar o site como está (demonstração), trocar marca e paleta, ou construir um site novo a partir do padrão deste?
3. Já existe logotipo, fotos, textos e cores da marca? Se não, uso placeholders e anoto o que falta.
4. Quais seções ficam e quais saem? Tem página ou seção que o site precisa ter e este não tem?
5. Quais ações importam (WhatsApp, reserva, formulário, compra) e onde ficam os dados de contato?
6. Prazo, domínio e onde vai ficar publicado?
Depois siga o caminho escolhido abaixo. Não mude o movimento nem a estrutura sem eu pedir.
\`\`\`

## Caminho 1: usar como está
1. \`npm install && npm run build && npm run serve\` e abra http://localhost:${porta}/.
2. Troque só os textos, os contatos e os links (no \`public/index.html\`) e as imagens em \`public/img/\` (mesmo tamanho e proporção).
3. Confira com \`verificar-site.mjs\` (0 FAIL) e refaça as capturas de \`conceito/\` se a aparência mudar.

## Caminho 2: trocar marca e paleta
1. Cores: ${papeis.length ? 'edite os papéis no \`:root\` do \`public/estilo.css\` (' + papeis.slice(0, 4).map(x => '\`' + x + '\`').join(', ') + '...). Para testar sem editar, abra \`?tema=' + (temas[0] || 'nome') + '\` (temas prontos: ' + (temas.join(', ') || 'nenhum') + '). Para criar um tema novo, copie um bloco \`html[data-paleta="..."]\`.' : '<PREENCHER>'}
2. Marca: troque nome, logotipo e textos mantendo o comprimento aproximado (o layout quebra linha no mesmo ponto).
3. Fotos e vídeos: o que for essencial está em \`../IMAGENS-PARA-GERAR.md\`; o resto pode ser placeholder da mesma proporção.
4. Conteúdo que muda o comportamento está nos atributos \`data-*\` do HTML (lista no CLAUDE.md): edite lá, sem tocar no JS.
5. Rode o build, o \`verificar-site.mjs\` e compare com as capturas de \`conceito/\`.

## Caminho 3: construir do zero a partir do padrão
1. Mantenha do ${nome}: a estrutura de rolagem, as medidas e a lógica de movimento do CLAUDE.md. Troque a ideia: defina antes a ideia central e o gesto de cada seção (\`references/direcao-criativa.md\` da skill, se existir).
2. Copie a pasta, renomeie em \`package.json\`, e reescreva seção por seção: texto, imagem, cor e gesto. Seção sem gesto não está pronta.
3. A cada seção: build, captura (\`replica/ferramentas/telas2.cjs\`) no desktop (1440x900) e no celular (390x844), e olhe a imagem antes de seguir.
4. Ao fim: \`verificar-site.mjs\` com 0 FAIL e capturas novas em \`conceito/\`.

## Regras que valem nos três caminhos
- Não copie código, textos ou imagens de sites de terceiros.
- Imagem não essencial: placeholder da mesma proporção. Essencial: acrescente em \`../IMAGENS-PARA-GERAR.md\` com prompt.
- Nada com cara de provisório ("lorem", "[ ]", emoji no lugar de ícone).
`;
fs.writeFileSync(path.join(pasta, 'PROMPT-DE-USO.md'), uso);
console.log(`Pacote gerado em ${pasta} (${secoes.length} seções, ${dados.length} data-*, ${cores.length} cores, temas: ${temas.join(', ') || 'nenhum'}).`);
