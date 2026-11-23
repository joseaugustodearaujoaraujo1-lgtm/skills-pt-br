// Coleta o acervo: para cada site da lista, captura (desktop, rolagem, celular), mede a estrutura e grava no formato que a skill lê.
// Uso:  node coletar.mjs --lista sites.json --fonte awwwards [--limite 100] [--abas 2] [--espera 10000] [--pausa 2500]
//   sites.json = [{ "titulo": "Nome", "url": "https://...", "ano": 2024, "nicho": "Fashion", "generos": [], "estilos": [] }, ...]
//   ou um .txt com uma URL por linha.   --fonte: awwwards | onepagelove (nome da pasta; use o que combinar com a origem da lista)
// Retoma sozinho: sites já coletados (com estrutura.json) são pulados. Salva acervo.json a cada site.
import fs from 'node:fs';
import path from 'node:path';
import { args, abrirNavegador, pastaFonte, slugDe, dormir, esperarEstabilizar } from './_comum.mjs';
import { extrairEstrutura } from './extrair-estrutura.mjs';

const a = args();
if (!a.lista) { console.error('Uso: node coletar.mjs --lista sites.json|sites.txt --fonte awwwards|onepagelove [--limite N] [--abas 2] [--espera 10000] [--pausa 2500]'); process.exit(1); }
const fonte = a.fonte || 'awwwards', dir = pastaFonte(fonte), espera = +a.espera || 10000, pausa = +a.pausa || 2500, abas = Math.min(+a.abas || 2, 3);
fs.mkdirSync(dir, { recursive: true });

let lista;
const bruto = fs.readFileSync(a.lista, 'utf8');
try { lista = JSON.parse(bruto); } catch { lista = bruto.split(/\r?\n/).map(s => s.trim()).filter(s => /^https?:\/\//.test(s)).map(url => ({ url })); }
if (a.limite) lista = lista.slice(0, +a.limite);

const arq = path.join(dir, 'acervo.json');
let acervo = []; try { acervo = JSON.parse(fs.readFileSync(arq, 'utf8')); } catch {}
const porSlug = new Map(acervo.map(s => [s.slug, s]));
const salvar = () => fs.writeFileSync(arq, JSON.stringify([...porSlug.values()], null, 1));

const nav = await abrirNavegador();
let feitos = 0, pulados = 0, falhas = 0, i = 0;

async function um(item) {
  const slug = item.slug || slugDe(item.titulo || item.url), pasta = path.join(dir, slug);
  if (fs.existsSync(path.join(pasta, 'estrutura.json'))) { pulados++; return; }
  fs.mkdirSync(pasta, { recursive: true });
  const reg = { slug, titulo: item.titulo || slug, url: item.url, urlFinal: item.url, ano: item.ano ?? null, nicho: item.nicho || '', generos: item.generos || [], estilos: item.estilos || [], http: 0, tituloPagina: '', libs: {}, fontes: [] };
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US' });
  try {
    const page = await ctx.newPage();
    const resp = await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    reg.http = resp?.status() || 0; reg.urlFinal = page.url();
    const { estrutura, libs, fontes } = await extrairEstrutura(page, { espera });
    reg.tituloPagina = await page.title(); reg.libs = libs; reg.fontes = fontes;
    await page.evaluate(() => scrollTo(0, 0)); await dormir(300);
    await page.screenshot({ path: path.join(pasta, 'desktop.jpg'), type: 'jpeg', quality: 80 });
    await page.mouse.wheel(0, 1800); await dormir(1500);
    await page.screenshot({ path: path.join(pasta, 'desktop-scroll.jpg'), type: 'jpeg', quality: 80 });
    const m = await (await nav.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
    await m.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(() => {}); await esperarEstabilizar(m, espera);
    await m.screenshot({ path: path.join(pasta, 'mobile.jpg'), type: 'jpeg', quality: 75 }); await m.context().close();
    fs.writeFileSync(path.join(pasta, 'estrutura.json'), JSON.stringify(estrutura, null, 1));
    feitos++;
  } catch (e) {
    reg.erroDesktop = String(e.message || e).split('\n')[0].slice(0, 160);
    fs.writeFileSync(path.join(pasta, 'estrutura.json'), JSON.stringify({ versao: 3, erro: reg.erroDesktop }));
    falhas++;
  } finally { await ctx.close().catch(() => {}); }
  fs.writeFileSync(path.join(pasta, 'dados.json'), JSON.stringify(reg, null, 1));
  porSlug.set(slug, reg); salvar();
  console.log(`[${++i}/${lista.length}] ${reg.erroDesktop ? 'ERRO ' : 'ok   '}${slug}${reg.erroDesktop ? '  ' + reg.erroDesktop : ''}`);
  await dormir(pausa);
}

const fila = [...lista];
await Promise.all(Array.from({ length: abas }, async () => { while (fila.length) await um(fila.shift()); }));
await nav.close(); salvar();
console.log(`\nfeitos ${feitos} · pulados ${pulados} · com erro ${falhas} · total no acervo ${porSlug.size}\npasta: ${dir}\nPróximo passo: node ../gerar-padroes.mjs && node ../gerar-padroes-ux.mjs`);
