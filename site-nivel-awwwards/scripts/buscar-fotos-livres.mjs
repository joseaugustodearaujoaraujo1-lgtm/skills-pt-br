// Busca fotos com licença aberta no Wikimedia Commons (API oficial) e baixa em 1600 px, com os créditos.
// Só fotos (jpg), largura >= 1800 px, licenças CC0 / domínio público / CC BY / CC BY-SA. Gera creditos.json para o rodapé.
// Uso: node buscar-fotos-livres.mjs --saida ./candidatas --temas "woman surfing wave|surfboard beach|..." [--por 8]
import fs from 'node:fs';
import path from 'node:path';

const args = {}; const av = process.argv.slice(2);
for (let i = 0; i < av.length; i++) if (av[i].startsWith('--')) args[av[i].slice(2)] = av[i + 1] && !av[i + 1].startsWith('--') ? av[++i] : true;
const saida = path.resolve(args.saida || './candidatas'); fs.mkdirSync(saida, { recursive: true });
const temas = String(args.temas || '').split('|').map(s => s.trim()).filter(Boolean);
const por = +args.por || 8;
const UA = { 'User-Agent': 'skills-pt-br-galeria/1.0 (estudo de design)' };
const LIC = /^(CC0|Public domain|CC BY(-SA)? [1-4]\.0)/i;
const espera = ms => new Promise(r => setTimeout(r, ms));
// respeita o limite da API: pausa entre pedidos e nova tentativa quando ela pede calma
async function pedir(url, json = true) {
  for (let k = 0; k < 5; k++) {
    const r = await fetch(url, { headers: UA }); await espera(1200);
    if (r.status === 429 || r.status === 503) { await espera(8000 * (k + 1)); continue; }
    if (!json) return r;
    const t = await r.text(); try { return JSON.parse(t); } catch { await espera(8000 * (k + 1)); }
  }
  return null;
}
const limpar = h => String(h || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

const creditos = fs.existsSync(path.join(saida, 'creditos.json')) ? JSON.parse(fs.readFileSync(path.join(saida, 'creditos.json'), 'utf8')) : {};
for (const [t, tema] of temas.entries()) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=40&gsrsearch=${encodeURIComponent(tema + ' filetype:bitmap')}&prop=imageinfo&iiprop=url|size|extmetadata|mime&iiurlwidth=1600`;
  const d = await pedir(url); if (!d) { console.log(`${tema}: API indisponível`); continue; }
  const paginas = Object.values(d.query?.pages || {}).sort((a, b) => a.index - b.index);
  let n = 0;
  for (const p of paginas) {
    if (n >= por) break;
    const i = p.imageinfo?.[0]; if (!i || i.mime !== 'image/jpeg' || i.width < 1800) continue;
    const m = i.extmetadata || {}; const lic = limpar(m.LicenseShortName?.value);
    if (!LIC.test(lic)) continue;
    const nome = `t${t}-${String(n).padStart(2, '0')}.jpg`;
    const r = await pedir(i.thumburl, false); if (!r || !r.ok) continue;
    fs.writeFileSync(path.join(saida, nome), Buffer.from(await r.arrayBuffer()));
    creditos[nome] = { tema, titulo: p.title.replace(/^File:/, ''), autor: limpar(m.Artist?.value).slice(0, 80), licenca: lic, fonte: i.descriptionurl };
    n++;
  }
  console.log(`${tema}: ${n} fotos`);
}
fs.writeFileSync(path.join(saida, 'creditos.json'), JSON.stringify(creditos, null, 1));
