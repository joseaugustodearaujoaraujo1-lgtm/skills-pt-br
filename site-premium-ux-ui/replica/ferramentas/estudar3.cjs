// estudo fino incremental: node estudar3.cjs <url> <pasta> <passos> <px por passo> <px inicial>
// salva captura + caixas a cada passo e regrava estrutura.json a cada passo (não perde nada se cair por tempo)
const {chromium}=require('/opt/node-tools/node_modules/playwright-core');
const [,, url, pasta, passos='40', passo='900', ini='0'] = process.argv;
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:1440,height:900}});
if(process.env.LENTO) await p.addInitScript(()=>{window.requestAnimationFrame=cb=>setTimeout(()=>cb(performance.now()),+(window.__fps||110));window.cancelAnimationFrame=id=>clearTimeout(id);});
await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000});await p.waitForTimeout(12000);await p.mouse.move(720,450);
const fs=require('fs');const out=[];
const mapa=await p.evaluate(()=>{const H=document.documentElement.scrollHeight;const secs=[...document.querySelectorAll('section,header,footer,main>div,[class*=section],[class*=sticky]')].map(e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return {c:(e.className&&e.className.baseVal===undefined?e.className:'').toString().slice(0,60),tag:e.tagName,top:Math.round(r.top+scrollY),h:Math.round(r.height),pos:s.position,bg:s.backgroundColor}}).filter(x=>x.h>200);return {H,secs:secs.slice(0,80)}});
fs.writeFileSync(pasta+'/mapa.json',JSON.stringify(mapa,null,1));
const voltas=Math.round(+passo/150);
for(let k=0;k<Math.round(+ini/150);k++){await p.mouse.wheel(0,150);await p.waitForTimeout(60);} if(+ini) await p.waitForTimeout(2000);
for(let i=0;i<+passos;i++){
  const n=String(i).padStart(2,'0');
  await p.screenshot({path:`${pasta}/m-${n}.jpg`,type:'jpeg',quality:70});
  out.push(await p.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.width>30&&r.height>12&&r.bottom>0&&r.top<innerHeight&&s.visibility!=='hidden'&&+s.opacity>0.05?r:null};
    const box=r=>[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)];
    const imgs=[...document.querySelectorAll('img,canvas,video')].map(e=>{const r=vis(e);return r&&{t:e.tagName,b:box(r),src:(e.currentSrc||'').split('/').pop().slice(0,40)}}).filter(Boolean).slice(0,14);
    const txt=[...document.querySelectorAll('h1,h2,h3,p,a,span,div,li,button')].filter(e=>!e.children.length&&(e.innerText||'').trim()).map(e=>{const r=vis(e);if(!r)return null;const s=getComputedStyle(e);return {t:e.innerText.trim().slice(0,60),b:box(r),f:s.fontFamily.split(',')[0].replace(/"/g,''),sz:Math.round(parseFloat(s.fontSize)),w:s.fontWeight,c:s.color,tt:s.textTransform,ls:s.letterSpacing}}).filter(Boolean).slice(0,30);
    return {y:Math.round(scrollY),bg:getComputedStyle(document.elementFromPoint(720,450)||document.body).backgroundColor,imgs,txt}}));
  fs.writeFileSync(pasta+'/estrutura.json',JSON.stringify(out,null,1));
  for(let k=0;k<voltas;k++){await p.mouse.wheel(0,150);await p.waitForTimeout(110);} await p.waitForTimeout(1600);
}
console.log('ok',out.length,out[out.length-1].y);await b.close()})().catch(e=>{console.log('ERRO',e.message);process.exit(1)});
