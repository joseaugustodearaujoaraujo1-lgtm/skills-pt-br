const {chromium}=require('/opt/node-tools/node_modules/playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'});const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto(process.argv[2]);await p.waitForTimeout(5500);
const r=await p.evaluate(()=>{const parseCor=c=>{const m=c.match(/rgba?\(([^)]+)\)/);if(!m)return null;const q=m[1].split(/[ ,/]+/).filter(Boolean).map(Number);return{r:q[0],g:q[1],b:q[2],a:q[3]??1}};
const lin=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};const lum=c=>.2126*lin(c.r)+.7152*lin(c.g)+.0722*lin(c.b);
const mis=(f,b)=>({r:f.r*f.a+b.r*(1-f.a),g:f.g*f.a+b.g*(1-f.a),b:f.b*f.a+b.b*(1-f.a),a:1});
const fundo=el=>{let cor={r:255,g:255,b:255,a:1};const pi=[];for(let e=el;e;e=e.parentElement){const s=getComputedStyle(e);if(s.backgroundImage!=='none')return null;const c=parseCor(s.backgroundColor);if(c&&c.a>0){pi.push(c);if(c.a>=1)break}}for(let i=pi.length-1;i>=0;i--)cor=mis(pi[i],cor);return cor};
const out=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const vis=new Set();
for(let n;(n=w.nextNode());){const t=n.textContent.trim(),el=n.parentElement;if(!t||!el||vis.has(el))continue;vis.add(el);const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden')continue;
const fg=parseCor(s.color),bg=fundo(el);if(!fg||!bg)continue;const f2=mis({...fg,a:fg.a*(+s.opacity||1)},bg);const l1=lum(f2),l2=lum(bg);const r=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);const px=parseFloat(s.fontSize);const min=px>=24?3:4.5;
if(r<min)out.push((el.closest('section,header,footer,nav,div[class]')?.className||'?').split(' ')[0]+' | '+el.className+' | '+t.slice(0,30)+' | '+r.toFixed(2))}
return out});
const c={};r.forEach(x=>{const k=x.split(' | ')[0];c[k]=(c[k]||0)+1});console.log(c);console.log(r.slice(0,40).join('\n'));await b.close()})();
