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
Trocar a paleta: \`?tema=<nome>\` (<PREENCHER se existir>).

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
fs.writeFileSync(path.join(pasta, 'CLAUDE.md'), md);
fs.mkdirSync(path.join(pasta, 'conceito'), { recursive: true });
console.log(`CLAUDE.md gerado em ${pasta} (${secoes.length} seções, ${dados.length} data-*, ${cores.length} cores).`);
