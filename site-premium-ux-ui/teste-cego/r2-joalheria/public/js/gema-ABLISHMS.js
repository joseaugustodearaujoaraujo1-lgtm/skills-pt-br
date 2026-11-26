import"./chunk-O2XFH626.js";var A=Math.PI/180,G={coroa:34.5,pavilhao:40.75,mesa:.57,cintura:.03,estrela:.5,inferior:.77};function L(n=G){let i=n.coroa*A,t=n.pavilhao*A,g=n.mesa,c=n.cintura,h=c+(1-g)*Math.tan(i),x=[],v=(e,o,r)=>{let m=Math.hypot(e[0],e[1],e[2]),l=e.map(a=>a/m);x.push({n:l,d:l[0]*o[0]+l[1]*o[1]+l[2]*o[2],tipo:r})},s=(e,o)=>[e[0]-o[0],e[1]-o[1],e[2]-o[2]],u=(e,o)=>[e[1]*o[2]-e[2]*o[1],e[2]*o[0]-e[0]*o[2],e[0]*o[1]-e[1]*o[0]],R=(e,o,r,m)=>{let l=u(s(o,e),s(r,e)),a=[(e[0]+o[0]+r[0])/3,(e[1]+o[1]+r[1])/3,(e[2]+o[2]+r[2])/3];l[0]*a[0]+l[1]*a[1]+l[2]*a[2]<0&&(l=l.map(d=>-d)),v(l,e,m)},f=(e,o,r)=>[o*Math.cos(e),r,o*Math.sin(e)];v([0,1,0],[0,h,0],"mesa");let M=Math.sin(i)+Math.cos(i)*c,E=Math.cos(22.5*A),b=g*E,w=b+n.estrela*(1-b),P=(M-Math.sin(i)*w*E)/Math.cos(i),D=Math.sin(t)+Math.cos(t)*c,S=1-n.inferior,O=(Math.sin(t)*S*E-D)/Math.cos(t);for(let e=0;e<8;e++){let o=e*45*A,r=o+22.5*A;v([Math.sin(i)*Math.cos(o),Math.cos(i),Math.sin(i)*Math.sin(o)],[Math.cos(o),c,Math.sin(o)],"coroa");let m=Math.atan2(h-P,w-b);v([Math.sin(m)*Math.cos(r),Math.cos(m),Math.sin(m)*Math.sin(r)],f(r,b,h),"estrela"),v([Math.sin(t)*Math.cos(o),-Math.cos(t),Math.sin(t)*Math.sin(o)],[Math.cos(o),-c,Math.sin(o)],"pavilhao");let l=f(r,w,P),a=f(r,S,O);for(let d of[0,1]){let p=d?o+45*A:o;R(l,f(p,1,c),f(r,1,c),"superior"),R(a,f(p,1,-c),f(r,1,-c),"inferior")}}for(let e=0;e<32;e++){let o=e*11.25*A;v([Math.cos(o),0,Math.sin(o)],[Math.cos(o),0,Math.sin(o)],"cintura")}let y=-(Math.tan(t)+c);return{planos:x,medidas:{yMesa:h,yCulet:y,alturaTotal:h-y,coroa:h-c,pavilhao:-c-y,cinturaAltura:2*c}}}var T=`#version 300 es
in vec2 p; out vec2 vUv; void main(){ vUv = p; gl_Position = vec4(p, 0., 1.); }`,U=n=>`#version 300 es
precision highp float;
in vec2 vUv; out vec4 cor;
uniform vec4 uPl[${n}];
uniform mat3 uRot;       // objeto -> mundo
uniform vec3 uLight;     // dire\xE7\xE3o (mundo) para a luz
uniform float uAsp, uQ, uDsp, uExp, uZoom;
const float IOR = 2.417;

vec3 ambiente(vec3 d){
  // est\xFAdio escuro e quente; uma luz s\xF3, forte, e um rebatedor fraco no teto
  float l = max(dot(d, uLight), 0.);
  vec3 c = vec3(.004, .003, .0025) + vec3(.02, .016, .012) * smoothstep(-.3, 1., d.y);
  c += vec3(1., .94, .86) * (40. * pow(l, 160.) + 4.5 * pow(l, 18.) + .5 * pow(l, 5.));
  c += vec3(.9, .85, .8) * smoothstep(.9, .97, d.y) * 1.4;
  float faixa = smoothstep(.10, .0, abs(d.y - .1)) * smoothstep(.6, .95, abs(d.x));
  c += vec3(.5, .45, .4) * faixa;
  return c;
}
float fresnel(float cosi, float n1, float n2){
  float r0 = (n1 - n2) / (n1 + n2); r0 *= r0; return r0 + (1. - r0) * pow(1. - cosi, 5.);
}
void main(){
  vec3 ro = vec3(0., 0., 7.2);
  vec3 rd = normalize(vec3(vUv.x * uAsp, vUv.y, -uZoom));
  mat3 inv = transpose(uRot);
  vec3 o = inv * ro, d = inv * rd;
  float tin = -1e9, tout = 1e9; vec3 nin = vec3(0.);
  for (int i = 0; i < ${n}; i++){
    vec3 n = uPl[i].xyz; float h = uPl[i].w; float nd = dot(n, d), no = dot(n, o);
    if (abs(nd) < 1e-6){ if (no > h) { tin = 1e9; } continue; }
    float t = (h - no) / nd;
    if (nd < 0.) { if (t > tin) { tin = t; nin = n; } } else { tout = min(tout, t); }
  }
  if (tin > tout || tout < 0.) { cor = vec4(0.); return; }
  vec3 p = o + d * tin;
  float ci = clamp(-dot(d, nin), 0., 1.);
  float F = fresnel(ci, 1., IOR);
  vec3 soma = F * ambiente(uRot * reflect(d, nin));
  vec3 dd = refract(d, nin, 1. / IOR);
  vec3 tr = vec3(1. - F);
  int Q = int(uQ);
  for (int b = 0; b < 10; b++){
    if (b >= Q) break;
    float tm = 1e9; vec3 nm = vec3(0., 1., 0.);
    for (int i = 0; i < ${n}; i++){
      vec3 n = uPl[i].xyz; float nd = dot(n, dd);
      if (nd > 1e-5){ float t = (uPl[i].w - dot(n, p)) / nd; if (t < tm) { tm = t; nm = n; } }
    }
    p += dd * tm;
    vec3 rG = refract(dd, -nm, IOR);
    if (dot(rG, rG) < 1e-6) { dd = reflect(dd, -nm); p += dd * 1e-4; continue; }
    float co = clamp(dot(dd, nm), 0., 1.);
    float Fo = fresnel(co, IOR, 1.);
    vec3 rR = refract(dd, -nm, IOR - uDsp), rB = refract(dd, -nm, IOR + uDsp);
    vec3 sai;
    vec3 aG = ambiente(uRot * rG);
    sai.r = dot(rR, rR) > 1e-6 ? ambiente(uRot * rR).r : aG.r;
    sai.g = aG.g;
    sai.b = dot(rB, rB) > 1e-6 ? ambiente(uRot * rB).b : aG.b;
    soma += tr * (1. - Fo) * sai;
    tr *= Fo;
    dd = reflect(dd, -nm); p += dd * 1e-4;
  }
  soma += tr * ambiente(uRot * dd) * .5;
  vec3 c = 1. - exp(-soma * uExp);
  c = pow(c, vec3(1. / 2.2));
  cor = vec4(c, 1.);
}`;function B(n,i){let t=Math.cos(n),g=Math.sin(n),c=Math.cos(i),h=Math.sin(i),x=[[t,0,g],[0,1,0],[-g,0,t]],v=[[1,0,0],[0,c,-h],[0,h,c]],s=[[0,0,0],[0,0,0],[0,0,0]];for(let u=0;u<3;u++)for(let R=0;R<3;R++)for(let f=0;f<3;f++)s[u][R]+=v[u][f]*x[f][R];return new Float32Array([s[0][0],s[1][0],s[2][0],s[0][1],s[1][1],s[2][1],s[0][2],s[1][2],s[2][2]])}function z(n){let i=n.getExtension("WEBGL_debug_renderer_info"),t=i?n.getParameter(i.UNMASKED_RENDERER_WEBGL):n.getParameter(n.RENDERER);return/swiftshader|llvmpipe|software|basic render/i.test(String(t))}async function Q(n,i={}){let t=n.getContext("webgl2",{alpha:!0,premultipliedAlpha:!1,antialias:!1,preserveDrawingBuffer:!!i.preservar,powerPreference:"high-performance"});if(!t||!i.forcar&&z(t))return null;let{planos:g}=L(),c=g.length,h=t.getExtension("KHR_parallel_shader_compile"),x=(a,d)=>{let p=t.createShader(a);return t.shaderSource(p,d),t.compileShader(p),p},v=x(t.VERTEX_SHADER,T),s=x(t.FRAGMENT_SHADER,U(c)),u=t.createProgram();if(t.attachShader(u,v),t.attachShader(u,s),t.linkProgram(u),h&&await new Promise(a=>{let d=()=>t.getProgramParameter(u,h.COMPLETION_STATUS_KHR)?a():requestAnimationFrame(d);d()}),!t.getProgramParameter(u,t.LINK_STATUS))return console.warn(t.getShaderInfoLog(s)),null;t.useProgram(u);let R=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,R),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW);let f=t.getAttribLocation(u,"p");t.enableVertexAttribArray(f),t.vertexAttribPointer(f,2,t.FLOAT,!1,0,0);let M=a=>t.getUniformLocation(u,a),{medidas:E}=L(),b=(E.yMesa+E.yCulet)/2,w=new Float32Array(c*4);g.forEach((a,d)=>w.set([...a.n,a.d-a.n[1]*b],d*4)),t.uniform4fv(M("uPl"),w);let P=M("uRot"),D=M("uLight"),S=M("uAsp"),O=M("uQ"),y=M("uDsp"),e=M("uExp"),o=M("uZoom");t.uniform1f(y,.045),t.uniform1f(e,1.15),t.uniform1f(o,i.zoom||4.6);let r={rotY:0,incl:.32,luz:[-.45,.7,.55]},m=1;function l(a=8,d=1){let p=Math.max(2,Math.round(n.clientWidth*d*m)),F=Math.max(2,Math.round(n.clientHeight*d*m));(n.width!==p||n.height!==F)&&(n.width=p,n.height=F),t.viewport(0,0,p,F),t.uniform1f(S,p/F),t.uniformMatrix3fv(P,!1,B(r.rotY,r.incl));let _=r.luz,I=Math.hypot(..._);t.uniform3f(D,_[0]/I,_[1]/I,_[2]/I),t.uniform1f(O,a),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.drawArrays(t.TRIANGLES,0,3)}return{gl:t,estado:r,desenhar:l,setEscala:a=>{m=a}}}export{G as PROPORCOES,Q as criarGema,z as gpuDeSoftware,L as planosDiamante,B as rotacao};
