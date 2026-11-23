// Capturas-alvo de sites de PALCO FIXO (sem rolagem nativa): clica em uma lista de seletores e fotografa cada estado.
// Uso: PLAYWRIGHT_CORE=... node palco.cjs <url> <pasta-saida> "<seletor-inicial>" "<seletor1>" "<seletor2>" ...
// Um item "passo:N" não clica: gira a roda até o passo absoluto N (1 passo = PASSO_PX px, padrão 600), para sites movidos pela roda.
// O 1º seletor (pode ser "") é clicado antes de tudo (ex.: botão que libera o site). Cada seletor seguinte vira d-NN.jpg e m-NN.jpg.
const {chromium}=require(process.env.PLAYWRIGHT_CORE||'/opt/node-tools/node_modules/playwright-core');
const fs=require('fs');
const [,,url,pasta,ini,...sels]=process.argv;
fs.mkdirSync(pasta,{recursive:true});
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
for(const [pref,w,h] of [['d',1440,900],['m',390,844]]){
 const p=await b.newPage({viewport:{width:w,height:h},isMobile:w<500,hasTouch:w<500});const erros=[];p.on('pageerror',e=>erros.push(e.message));
 await p.goto(url);await p.waitForTimeout(+(process.env.ESPERA||5000));
 await p.screenshot({path:`${pasta}/${pref}-00-abertura.jpg`,type:'jpeg',quality:62});
 if(ini){await p.click(ini).catch(()=>{});await p.waitForTimeout(2500);}
 let n=1,atual=0;for(const s of sels){if(s.startsWith('passo:')){const alvo=+s.slice(6);const px=(alvo-atual)*(+process.env.PASSO_PX||600);const dir=Math.sign(px);for(let k=0;k<Math.ceil(Math.abs(px)/300);k++){await p.mouse.wheel(0,dir*Math.min(300,Math.abs(px)-k*300));await p.waitForTimeout(40);}atual=alvo;}else await p.click(s,{timeout:4000}).catch(e=>erros.push('clique '+s));await p.waitForTimeout(+(process.env.PAUSA||4500));
  await p.screenshot({path:`${pasta}/${pref}-${String(n++).padStart(2,'0')}-${s.replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'')}.jpg`,type:'jpeg',quality:62});}
 console.log(pref,n,'capturas; erros:',erros.length?erros:'nenhum');await p.close();}
await b.close()})();
