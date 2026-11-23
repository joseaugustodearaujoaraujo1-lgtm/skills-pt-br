// Monta sites.json a partir dos vencedores "Website of the Day" do CSS Design Awards (premiação do mesmo nível do Awwwards).
// Funciona inclusive na nuvem (o Awwwards costuma recusar). Só lê páginas públicas; pausa de 1,5 s entre pedidos.
// Uso: node listar-cssda.mjs [--paginas 8] [--desde 1] [--saida sites-cssda.json]
// Depois: node coletar.mjs --lista sites-cssda.json --fonte awwwards   (pasta "awwwards" = sites premiados; a fonte real fica em cada registro)
import fs from 'node:fs';
import { args, dormir } from './_comum.mjs';

const a = args(); const paginas = +a.paginas || 8, inicio = +a.desde || 1, saida = a.saida || 'sites-cssda.json';
const UA = { headers: { 'user-agent': 'Mozilla/5.0 (acervo de estudo; poucos pedidos)' } };
const pegar = async u => { const r = await fetch(u, UA); if (!r.ok) throw new Error(`${r.status} em ${u}`); return r.text(); };
const limpar = s => s.replace(/&amp;/g, '&').replace(/&#0?39;|&rsquo;/g, "'").replace(/\s+/g, ' ').trim();

let anteriores = []; try { anteriores = JSON.parse(fs.readFileSync(saida, 'utf8')); } catch {}
const feitos = new Set(anteriores.map(s => s.fichaUrl));
const fichas = [];
for (let p = inicio; p < inicio + paginas; p++) {
  try {
    const h = await pegar(`https://www.cssdesignawards.com/wotd-award-winners?page=${p}`);
    for (const m of new Set(h.match(/\/sites\/[a-z0-9-]+\/\d+\//g) || [])) if (!feitos.has('https://www.cssdesignawards.com' + m)) fichas.push('https://www.cssdesignawards.com' + m);
  } catch (e) { console.error('AVISO:', e.message); break; }
  await dormir(1500);
}
console.log(`${fichas.length} fichas novas; lendo cada uma...`);
const sites = [...anteriores];
for (const f of [...new Set(fichas)]) {
  try {
    const h = await pegar(f);
    const url = (h.match(/href="(https?:\/\/[^"]+)"[^>]*class="[^"]*single-website__thumbnail/) || h.match(/class="[^"]*single-website__thumbnail[^"]*"[^>]*href="(https?:\/\/[^"]+)"/) || [])[1];
    const titulo = limpar(((h.match(/<title>([^<]*)/) || [])[1] || '').replace(/\s*-\s*CSS Design Awards.*$/i, ''));
    const ano = +((h.match(/\b(20[12]\d)\b/) || [])[1]) || null;
    const cats = [...new Set((h.match(/\/website-gallery\?(?:category|tag)=([a-z0-9-]+)/g) || []).map(x => x.split('=')[1]))].slice(0, 6);
    if (url) sites.push({ titulo, url, ano, nicho: cats[0] || '', generos: cats, estilos: [], origem: 'CSS Design Awards · Website of the Day', fichaUrl: f });
    process.stdout.write(url ? '.' : 'x');
  } catch { process.stdout.write('!'); }
  await dormir(1500);
}
fs.writeFileSync(saida, JSON.stringify(sites, null, 1));
console.log(`\n${sites.length} sites em ${saida}. Próximo: node coletar.mjs --lista ${saida} --fonte awwwards`);
