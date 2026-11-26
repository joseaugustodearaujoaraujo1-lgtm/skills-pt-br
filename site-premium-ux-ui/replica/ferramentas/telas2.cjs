// capturas a cada tela do NOSSO site (mesmo passo do estudo do original): node telas.cjs <url> <prefixo> <pasta> [telas] [largura]
const {chromium}=require('/opt/node-tools/node_modules/playwright-core');
const [,,url,pref,pasta,telas='16',larg='1440']=process.argv;
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'});const w=+larg,h=w<500?844:900;
const p=await b.newPage({viewport:{width:w,height:h},isMobile:w<500,hasTouch:w<500});const erros=[];p.on('pageerror',e=>erros.push(e.message));p.on('console',m=>m.type()==='error'&&erros.push(m.text()));
await p.goto(url);await p.waitForTimeout(+(process.env.ESPERA||2500));await p.mouse.move(w/2,h/2);
for(let i=0;i<+telas;i++){await p.screenshot({path:`${pasta}/${pref}-${String(i).padStart(2,'0')}.jpg`,type:'jpeg',quality:72});
 if(w<500){await p.evaluate(d=>scrollBy(0,d),h);}else{for(let k=0;k<6;k++){await p.mouse.wheel(0,150);await p.waitForTimeout(120);}}await p.waitForTimeout(1600);}
console.log(pref,'erros:',erros.length?erros:'nenhum');await b.close()})();
