// Dá um nicho (tema) a cada site do acervo que veio sem categoria, lendo título, descrição e o texto do início da página.
// O nicho gravado é o primeiro nicho Awwwards do tema (temas.json), que é o que pesquisar-referencias.mjs compara.
// Uso: node classificar.mjs [--fonte awwwards] [--refazer]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { args, pastaFonte } from './_comum.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const { temas } = JSON.parse(fs.readFileSync(path.join(AQUI, '..', 'temas.json'), 'utf8'));
const EN = { moda: 'fashion apparel clothing wear collection garment streetwear', luxo: 'luxury jewelry jewellery watch couture premium haute', arquitetura: 'architecture architects architectural interior design studio building spaces',
  tecnologia: 'technology software platform developer cloud data security cyber app', ia: 'ai artificial intelligence machine learning llm agent', fintech: 'finance fintech bank payments crypto invest wallet trading',
  saude: 'health clinic medical wellness care therapy dental skin', alimentacao: 'food restaurant coffee wine drink bakery chef kitchen beverage beer', educacao: 'education school course learning university academy',
  arte: 'art artist gallery exhibition museum illustration', musica: 'music album band record artist sound festival', jogos: 'game games gaming play studio esports', esportes: 'sport sports athlete football running bike surf club',
  viagem: 'travel hotel resort tourism trip destination journey', imobiliario: 'real estate residence apartments property homes living', corporativo: 'consulting corporate company group business solutions',
  sustentabilidade: 'sustainability climate energy green nature ocean planet', infantil: 'kids children toys baby', beleza: 'beauty skincare cosmetics fragrance perfume makeup',
  automotivo: 'car cars automotive motor vehicle electric mobility', portfolio: 'portfolio designer developer creative freelance folio', agencia: 'agency studio creative digital branding production',
  ecommerce: 'shop store buy products ecommerce', eventos: 'event conference summit festival tickets', editorial: 'magazine journal stories editorial publication news' };
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const a = args(); const fontes = a.fonte ? [a.fonte] : ['awwwards', 'onepagelove'];
for (const f of fontes) {
  const arq = path.join(pastaFonte(f), 'acervo.json'); let L; try { L = JSON.parse(fs.readFileSync(arq, 'utf8')); } catch { continue; }
  const cont = {};
  for (const s of L) {
    if (s.nicho && !a.refazer) continue;
    const txt = ' ' + norm([s.titulo, s.tituloPagina, s.descricao, s.textoInicio].join(' ')).replace(/[^a-z0-9]+/g, ' ') + ' ';
    let melhor = null, pts = 0;
    for (const t of temas) {
      const palavras = [...t.palavras.map(norm), ...(EN[t.id] || '').split(' ')].filter(w => w.length > 2);
      let p = 0; for (const w of palavras) if (txt.includes(' ' + w + ' ') || (w.length > 5 && txt.includes(w))) p += w.length > 5 ? 2 : 1;
      if (t.id === 'portfolio' || t.id === 'agencia') p *= 0.8; // genéricos: só vencem quando nada mais aparece
      if (p > pts) { pts = p; melhor = t; }
    }
    s.tema = melhor && pts >= 2 ? melhor.id : 'portfolio';
    s.nicho = (temas.find(t => t.id === s.tema)?.awwwards || [''])[0];
    cont[s.tema] = (cont[s.tema] || 0) + 1;
    try { const d = path.join(pastaFonte(f), s.slug, 'dados.json'); const r = JSON.parse(fs.readFileSync(d, 'utf8')); Object.assign(r, { tema: s.tema, nicho: s.nicho }); fs.writeFileSync(d, JSON.stringify(r, null, 1)); } catch {}
  }
  fs.writeFileSync(arq, JSON.stringify(L, null, 1));
  console.log(`${f}: ${Object.entries(cont).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k} ${v}`).join(', ') || 'nada a classificar'}`);
}
