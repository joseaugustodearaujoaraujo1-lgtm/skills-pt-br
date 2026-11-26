// Monta sites.json a partir das listagens do Awwwards (rode no SEU computador; a nuvem costuma ser recusada).
// Uso: node listar-awwwards.mjs --categoria fashion [--paginas 3] [--saida sites-awwwards.json]
//      node listar-awwwards.mjs --sotd --paginas 5
// Lê só as páginas públicas de listagem e a página de cada site (para achar o link "Visit site"). Pausa de 2,5 s entre páginas.
// ATENÇÃO: depende do HTML do Awwwards, que muda; se não achar nada, o aviso diz. Alternativa: monte o sites.json à mão.
import fs from 'node:fs';
import { args, abrirNavegador, dormir } from './_comum.mjs';

const a = args(); const paginas = +a.paginas || 2, saida = a.saida || 'sites-awwwards.json';
const base = a.sotd ? 'https://www.awwwards.com/websites/sites_of_the_day/' : `https://www.awwwards.com/websites/${a.categoria || 'sites_of_the_day'}/`;
const nav = await abrirNavegador(); const page = await (await nav.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const out = [], vistos = new Set(); let recusado = false;
for (let p = 1; p <= paginas; p++) {
  try { await page.goto(p === 1 ? base : `${base}?page=${p}`, { waitUntil: 'domcontentloaded', timeout: 45000 }); await dormir(2500); } catch (e) { recusado = true; console.error(`AVISO: página ${p} recusada (${e.message.split('\n')[0]}). Rode no seu computador ou monte o sites.json à mão.`); break; }
  const cards = await page.evaluate(() => [...document.querySelectorAll('a[href*="/sites/"]')].map(x => ({ href: x.href, t: (x.getAttribute('title') || x.innerText || '').trim() })).filter(x => /\/sites\/[^/]+\/?$/.test(x.href)));
  for (const c of cards) { if (vistos.has(c.href)) continue; vistos.add(c.href); out.push(c); }
}
console.log(`${out.length} páginas de sites achadas; resolvendo o link de cada uma...`);
const sites = [];
for (const c of out) {
  try {
    await page.goto(c.href, { waitUntil: 'domcontentloaded', timeout: 45000 }); await dormir(2000);
    const r = await page.evaluate(() => { const v = [...document.querySelectorAll('a')].find(x => /visit/i.test(x.innerText) && /^https?:/.test(x.href) && !/awwwards\.com/.test(x.href)); return { url: v?.href, titulo: (document.querySelector('h1')?.innerText || document.title).trim(), ano: (document.body.innerText.match(/\b(20[12]\d)\b/) || [])[1] }; });
    if (r.url) sites.push({ titulo: r.titulo, url: r.url, ano: r.ano ? +r.ano : null, nicho: a.categoria || 'Sites of the Day' });
  } catch { /* segue */ }
  await dormir(2500);
}
await nav.close();
fs.writeFileSync(saida, JSON.stringify(sites, null, 1));
console.log(sites.length ? `${sites.length} sites gravados em ${saida}. Próximo: node coletar.mjs --lista ${saida} --fonte awwwards` : recusado ? 'Nenhum site: o Awwwards recusou a conexão (rode no seu computador).' : 'Nenhum site resolvido: o HTML do Awwwards pode ter mudado. Monte o sites.json à mão (veja o cabeçalho de coletar.mjs).');
