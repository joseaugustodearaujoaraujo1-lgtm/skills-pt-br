const {chromium}=require('/opt/node-tools/node_modules/playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'});const p=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
await p.goto(process.argv[2]);await p.waitForTimeout(5000);
const r=await p.evaluate(()=>{const o=[];document.querySelectorAll('a,button,summary,[role=tab],input').forEach(e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);if(s.display==='none'||s.visibility==='hidden'||!r.width)return;if(r.width<44||r.height<44)o.push(e.tagName+'.'+(e.className||'')+' '+(e.textContent||'').trim().slice(0,24)+' '+Math.round(r.width)+'x'+Math.round(r.height))});
const pq=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);for(let n;(n=w.nextNode());){const el=n.parentElement;if(!n.textContent.trim()||!el)continue;const s=getComputedStyle(el);if(parseFloat(s.fontSize)<12&&s.display!=='none')pq.push(el.className+' '+n.textContent.trim().slice(0,20)+' '+s.fontSize)}return {o,pq}});
console.log(r.o.length);console.log(r.o.join('\n'));console.log('PEQ',r.pq);await b.close()})();
