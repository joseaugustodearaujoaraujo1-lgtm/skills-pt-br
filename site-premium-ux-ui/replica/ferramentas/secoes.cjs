// Capturas-alvo POR SEÇÃO do nosso site (desktop 1440x900 e celular 390x844) em conceito/.
// Uso: PLAYWRIGHT_CORE=/opt/node-tools/node_modules/playwright-core node secoes.cjs <url> <pasta-saida> [seletor-das-secoes]
// Seções altas (mais de 2,5 telas) ganham também uma captura no meio. Para sites de palco fixo (sem rolagem), use telas2.cjs.
const {chromium}=require(process.env.PLAYWRIGHT_CORE||'/opt/node-tools/node_modules/playwright-core');
const fs=require('fs');
const [,,url,pasta,sel='main > section, main > footer, body > section, body > footer, main > div[id]']=process.argv;
fs.mkdirSync(pasta,{recursive:true});
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'});
for(const [pref,w,h] of [['d',1440,900],['m',390,844]]){
 const p=await b.newPage({viewport:{width:w,height:h},isMobile:w<500,hasTouch:w<500});const erros=[];
 p.on('pageerror',e=>erros.push(e.message));
 await p.goto(url);await p.waitForTimeout(+(process.env.ESPERA||4500));
 const pontos=await p.evaluate(([sel,h])=>{const o=[];document.querySelectorAll(sel).forEach((e,i)=>{const r=e.getBoundingClientRect();if(r.height<h*.3)return;const y=Math.round(r.top+scrollY);
  const nome=(e.id||(e.className&&String(e.className).split(' ')[0])||e.tagName.toLowerCase()).replace(/[^a-z0-9-]/gi,'');
  o.push({nome:String(o.length).padStart(2,'0')+'-'+nome,y});if(r.height>h*2.5)o.push({nome:String(o.length).padStart(2,'0')+'-'+nome+'-meio',y:Math.round(y+r.height/2-h/2)});});return o;},[sel,h]);
 for(const q of pontos){await p.evaluate(y=>scrollTo(0,y),q.y);await p.waitForTimeout(1400);await p.screenshot({path:`${pasta}/${pref}-${q.nome}.jpg`,type:'jpeg',quality:62});}
 console.log(pref,pontos.length,'capturas; erros:',erros.length?erros:'nenhum');await p.close();}
await b.close()})();
