// Confere se todo link de Markdown da skill aponta para um arquivo ou pasta que existe.
// Uso: node scripts/checar-links.mjs [arquivos ou pastas...]   (padrão: SKILL.md, references/, starters/modulos/, replica/*.md)
// Também confere, no SKILL.md e nos arquivos de references/ escritos para o fluxo, caminhos entre crases que começam
// por references/, scripts/, starters/, replica/ ou galeria/. Links externos (http, mailto) e âncoras (#) são ignorados.
// Código de saída 1 se algum link estiver quebrado.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const alvos = process.argv.slice(2).length ? process.argv.slice(2).map(a => path.resolve(a))
  : ['SKILL.md', 'references', 'starters/modulos', 'replica/README.md', 'replica/PROTOCOLO.md', 'replica/PROMPTS.md'].map(a => path.join(RAIZ, a));
const IGNORAR = new Set(['node_modules', 'exemplo', 'public']);
const arquivos = [];
const juntar = p => { if (!fs.existsSync(p)) return; const st = fs.statSync(p); if (st.isFile()) { if (p.endsWith('.md')) arquivos.push(p); return; } for (const e of fs.readdirSync(p)) if (!IGNORAR.has(e)) juntar(path.join(p, e)); };
alvos.forEach(juntar);

const RAIZES_CRASE = /^(references|scripts|starters|replica|galeria)\//;
let quebrados = 0, total = 0;
for (const arq of arquivos) {
  const texto = fs.readFileSync(arq, 'utf8').replace(/```[\s\S]*?```/g, ''); // blocos de código não têm links
  const dir = path.dirname(arq), rel = path.relative(RAIZ, arq);
  const links = [...texto.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map(m => ({ alvo: m[1], base: dir }));
  // caminhos entre crases relativos à raiz da skill (só onde o texto usa esse estilo)
  for (const m of texto.matchAll(/`([^`\s<>*]+)`/g)) if (RAIZES_CRASE.test(m[1])) links.push({ alvo: m[1], base: RAIZ, crase: true });
  for (const { alvo, base, crase } of links) {
    if (/^(https?:|mailto:|#)/.test(alvo)) continue;
    const limpo = decodeURIComponent(alvo.split('#')[0]).replace(/[),.;:]+$/, '');
    if (!limpo) continue;
    total++;
    const cands = [path.resolve(base, limpo)];
    if (crase) cands.push(path.resolve(dir, limpo)); // crase pode ser relativa ao próprio arquivo
    if (!cands.some(c => fs.existsSync(c))) { quebrados++; console.log(`QUEBRADO  ${rel}  →  ${alvo}`); }
  }
}
console.log(`${arquivos.length} arquivos, ${total} links conferidos, ${quebrados} quebrado(s).`);
process.exit(quebrados ? 1 : 0);
