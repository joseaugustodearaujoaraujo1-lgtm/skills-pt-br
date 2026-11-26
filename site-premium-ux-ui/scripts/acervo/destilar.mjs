// Gera o índice destilado do acervo (só fatos medidos e o endereço público de cada site; nenhuma captura, texto ou código do site).
// Este arquivo PODE ir para o GitHub: dá referências a quem usa a skill sem o acervo local.
// Uso: node destilar.mjs   → references/acervo-destilado/indice.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pastaFonte } from './_comum.mjs';
import { capturaInvalida } from '../qualidade.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SAIDA = path.join(AQUI, '..', '..', 'references', 'acervo-destilado'); fs.mkdirSync(SAIDA, { recursive: true });
const anterior = (() => { try { return JSON.parse(fs.readFileSync(path.join(SAIDA, 'indice.json'), 'utf8')).sites; } catch { return []; } })();
const porUrl = new Map(anterior.map(s => [s.url, s]));
let novos = 0;
for (const f of ['awwwards', 'onepagelove']) {
  let L = []; try { L = JSON.parse(fs.readFileSync(path.join(pastaFonte(f), 'acervo.json'), 'utf8')); } catch { continue; }
  for (const s of L) {
    if (s.erroDesktop || capturaInvalida(s)) continue;
    let e; try { e = JSON.parse(fs.readFileSync(path.join(pastaFonte(f), s.slug, 'estrutura.json'), 'utf8')); } catch { continue; }
    if (e.erro || !e.pagina) continue;
    const L2 = s.libs || {};
    const url = (s.urlFinal || s.url).replace(/[?#].*$/, '');
    if (!porUrl.has(url)) novos++;
    porUrl.set(url, { titulo: s.titulo, url, ano: s.ano, fonte: f, origem: s.origem || '', tema: s.tema || '', nicho: s.nicho || '',
      libs: Object.keys(L2).filter(k => L2[k] && L2[k] !== 0),
      estrutura: { versao: e.versao, pagina: e.pagina, menu: e.menu, preloader: e.preloader, hero: e.hero, titulo: e.titulo, corpo: e.corpo, rolagem: e.rolagem, efeitos: e.efeitos, forma: e.forma, midia: e.midia,
        motion: e.motion && { ...e.motion, duracoesMs: (e.motion.duracoesMs || []).slice(0, 3), curvas: (e.motion.curvas || []).slice(0, 3) }, rodape: e.rodape, cursorCustom: e.cursorCustom, larguraMaxMedianaPx: e.larguraMaxMedianaPx } });
  }
}
const sites = [...porUrl.values()].sort((a, b) => (a.tema || '').localeCompare(b.tema || '') || a.titulo.localeCompare(b.titulo));
fs.writeFileSync(path.join(SAIDA, 'indice.json'), JSON.stringify({ gerado: new Date().toISOString().slice(0, 10), nota: 'Fatos medidos em 1440x900 e endereço público. Sem capturas, textos ou código dos sites. Abra o endereço para ver o site.', total: sites.length, sites }));
const porTema = {}; for (const s of sites) (porTema[s.tema || 'sem tema'] ||= []).push(s);
const md = ['# Acervo destilado', '', `${sites.length} sites premiados medidos (gerado por \`scripts/acervo/destilar.mjs\` em ${new Date().toISOString().slice(0, 10)}). Só fatos e endereço: abra o site para ver. Usado por \`pesquisar-referencias.mjs\` quando não há acervo local.`, ''];
for (const [t, L] of Object.entries(porTema).sort()) { md.push(`## ${t} (${L.length})`, ''); for (const s of L) { const e = s.estrutura, rec = [e.hero?.canvas && 'WebGL', e.hero?.video && 'vídeo', e.rolagem?.lenis && 'Lenis', e.rolagem?.pinSpacer && 'pin', e.cursorCustom && 'cursor', e.preloader?.existe && 'preloader', e.motion?.marquee && 'marquee'].filter(Boolean).join(', '); md.push(`- [${s.titulo}](${s.url}) · título ${e.titulo?.px ?? '?'} px${e.titulo?.serifa ? ' serifa' : ''} · ${e.pagina.secoes} seções · ${rec || 'sem efeitos medidos'}`); } md.push(''); }
fs.writeFileSync(path.join(SAIDA, 'README.md'), md.join('\n'));
console.log(`${sites.length} sites no índice (${novos} novos) → ${SAIDA}`);
