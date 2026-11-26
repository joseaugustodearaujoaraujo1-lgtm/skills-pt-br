// Uso: node texto.cjs "BRUMA&nbsp;&nbsp;&nbsp;ALTA" marca-base.png 4600   (depois: python3 listrar.py marca-base.png marca.png 14 11)
// renderiza um texto em Unbounded 900 (preto sobre transparente) para depois virar marca listrada
const {chromium}=require('/opt/node-tools/node_modules/playwright-core');const fs=require('fs');
const [,,txt,saida,larg='2880']=process.argv;
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'});const p=await b.newPage({viewport:{width:+larg+200,height:900},deviceScaleFactor:1});
const f=fs.readFileSync(__dirname+'/unbounded-normal-900.woff2').toString('base64');
await p.setContent(`<style>@font-face{font-family:U;src:url(data:font/woff2;base64,${f})}body{margin:0;background:transparent}span{font:900 400px/1 U;letter-spacing:.02em;display:inline-block;padding:40px 20px;white-space:nowrap}</style><span>${txt}</span>`);
await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
const el=await p.$('span');await el.screenshot({path:saida,omitBackground:true});await b.close();console.log('ok')})();
