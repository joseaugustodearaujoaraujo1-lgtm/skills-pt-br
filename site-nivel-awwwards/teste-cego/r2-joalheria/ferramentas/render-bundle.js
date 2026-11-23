(() => {
  // src/gema.js
  var RAD = Math.PI / 180;
  var PROPORCOES = { coroa: 34.5, pavilhao: 40.75, mesa: 0.57, cintura: 0.03, estrela: 0.5, inferior: 0.77 };
  function planosDiamante(p = PROPORCOES) {
    const ac = p.coroa * RAD, ap = p.pavilhao * RAD, tc = p.mesa, hg = p.cintura;
    const yMesa = hg + (1 - tc) * Math.tan(ac);
    const planos = [];
    const add = (n, pt, tipo) => {
      const l = Math.hypot(n[0], n[1], n[2]);
      const u = n.map((v) => v / l);
      planos.push({ n: u, d: u[0] * pt[0] + u[1] * pt[1] + u[2] * pt[2], tipo });
    };
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const tri = (A, B, C, tipo) => {
      let n = cross(sub(B, A), sub(C, A));
      const c = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3, (A[2] + B[2] + C[2]) / 3];
      if (n[0] * c[0] + n[1] * c[1] + n[2] * c[2] < 0) n = n.map((v) => -v);
      add(n, A, tipo);
    };
    const dirAz = (f, r, y) => [r * Math.cos(f), y, r * Math.sin(f)];
    add([0, 1, 0], [0, yMesa, 0], "mesa");
    const dB = Math.sin(ac) + Math.cos(ac) * hg;
    const c225 = Math.cos(22.5 * RAD);
    const rEdge = tc * c225;
    const rA = rEdge + p.estrela * (1 - rEdge);
    const yA = (dB - Math.sin(ac) * rA * c225) / Math.cos(ac);
    const dP = Math.sin(ap) + Math.cos(ap) * hg;
    const rQ = 1 - p.inferior;
    const yQ = (Math.sin(ap) * rQ * c225 - dP) / Math.cos(ap);
    for (let k = 0; k < 8; k++) {
      const fb = k * 45 * RAD, fs = fb + 22.5 * RAD;
      add([Math.sin(ac) * Math.cos(fb), Math.cos(ac), Math.sin(ac) * Math.sin(fb)], [Math.cos(fb), hg, Math.sin(fb)], "coroa");
      const incl = Math.atan2(yMesa - yA, rA - rEdge);
      add([Math.sin(incl) * Math.cos(fs), Math.cos(incl), Math.sin(incl) * Math.sin(fs)], dirAz(fs, rEdge, yMesa), "estrela");
      add([Math.sin(ap) * Math.cos(fb), -Math.cos(ap), Math.sin(ap) * Math.sin(fb)], [Math.cos(fb), -hg, Math.sin(fb)], "pavilhao");
      const A = dirAz(fs, rA, yA), Q = dirAz(fs, rQ, yQ);
      for (const lado of [0, 1]) {
        const fg = lado ? fb + 45 * RAD : fb;
        tri(A, dirAz(fg, 1, hg), dirAz(fs, 1, hg), "superior");
        tri(Q, dirAz(fg, 1, -hg), dirAz(fs, 1, -hg), "inferior");
      }
    }
    for (let k = 0; k < 32; k++) {
      const f = k * 11.25 * RAD;
      add([Math.cos(f), 0, Math.sin(f)], [Math.cos(f), 0, Math.sin(f)], "cintura");
    }
    const yCulet = -(Math.tan(ap) + hg);
    return { planos, medidas: { yMesa, yCulet, alturaTotal: yMesa - yCulet, coroa: yMesa - hg, pavilhao: -hg - yCulet, cinturaAltura: 2 * hg } };
  }
  var VS = `#version 300 es
in vec2 p; out vec2 vUv; void main(){ vUv = p; gl_Position = vec4(p, 0., 1.); }`;
  var FS = (N) => `#version 300 es
precision highp float;
in vec2 vUv; out vec4 cor;
uniform vec4 uPl[${N}];
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
  for (int i = 0; i < ${N}; i++){
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
    for (int i = 0; i < ${N}; i++){
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
}`;
  function rotacao(rotY, incl) {
    const cy = Math.cos(rotY), sy = Math.sin(rotY), cx = Math.cos(incl), sx = Math.sin(incl);
    const Ry = [[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]];
    const Rx = [[1, 0, 0], [0, cx, -sx], [0, sx, cx]];
    const m = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) m[i][j] += Rx[i][k] * Ry[k][j];
    return new Float32Array([m[0][0], m[1][0], m[2][0], m[0][1], m[1][1], m[2][1], m[0][2], m[1][2], m[2][2]]);
  }
  function gpuDeSoftware(gl) {
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const r = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    return /swiftshader|llvmpipe|software|basic render/i.test(String(r));
  }
  async function criarGema(canvas, opts = {}) {
    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: false, antialias: false, preserveDrawingBuffer: !!opts.preservar, powerPreference: "high-performance" });
    if (!gl) return null;
    if (!opts.forcar && gpuDeSoftware(gl)) return null;
    const { planos } = planosDiamante();
    const N = planos.length;
    const par = gl.getExtension("KHR_parallel_shader_compile");
    const sh = (t, s) => {
      const o = gl.createShader(t);
      gl.shaderSource(o, s);
      gl.compileShader(o);
      return o;
    };
    const vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS(N));
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (par) await new Promise((ok) => {
      const t = () => gl.getProgramParameter(prog, par.COMPLETION_STATUS_KHR) ? ok() : requestAnimationFrame(t);
      t();
    });
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn(gl.getShaderInfoLog(fs));
      return null;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n) => gl.getUniformLocation(prog, n);
    const { medidas } = planosDiamante();
    const cy = (medidas.yMesa + medidas.yCulet) / 2;
    const arr = new Float32Array(N * 4);
    planos.forEach((pl, i) => arr.set([...pl.n, pl.d - pl.n[1] * cy], i * 4));
    gl.uniform4fv(U("uPl"), arr);
    const uRot = U("uRot"), uLight = U("uLight"), uAsp = U("uAsp"), uQ = U("uQ"), uDsp = U("uDsp"), uExp = U("uExp"), uZoom = U("uZoom");
    gl.uniform1f(uDsp, 0.045);
    gl.uniform1f(uExp, 1.15);
    gl.uniform1f(uZoom, opts.zoom || 4.6);
    const estado = { rotY: 0, incl: 0.32, luz: [-0.45, 0.7, 0.55] };
    let escala = 1;
    function desenhar(qual = 8, fator = 1) {
      const w = Math.max(2, Math.round(canvas.clientWidth * fator * escala)), h = Math.max(2, Math.round(canvas.clientHeight * fator * escala));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform1f(uAsp, w / h);
      gl.uniformMatrix3fv(uRot, false, rotacao(estado.rotY, estado.incl));
      const l = estado.luz, n = Math.hypot(...l);
      gl.uniform3f(uLight, l[0] / n, l[1] / n, l[2] / n);
      gl.uniform1f(uQ, qual);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    return { gl, estado, desenhar, setEscala: (e) => {
      escala = e;
    } };
  }

  // src/pose.js
  var CHAVES = [
    { s: 0, incl: 0.32, luz: [-0.45, 0.7, 0.55] },
    { s: 0.26, incl: 0.34, luz: [-0.4, 0.72, 0.56] },
    { s: 0.38, incl: 1.38, luz: [0.25, 0.45, 0.86] },
    { s: 0.48, incl: 1.38, luz: [0.38, 0.4, 0.83] },
    { s: 0.6, incl: 0.06, luz: [-0.8, 0.45, 0.4] },
    { s: 0.7, incl: 0.06, luz: [-0.7, 0.55, 0.45] },
    { s: 0.82, incl: -0.95, luz: [0.45, -0.55, 0.7] },
    { s: 0.92, incl: -0.95, luz: [0.55, -0.45, 0.7] },
    { s: 1, incl: 0.4, luz: [-0.3, 0.7, 0.65] }
  ];
  var suave = (t) => t * t * (3 - 2 * t);
  function poseEm(s) {
    s = Math.min(1, Math.max(0, s));
    let i = 0;
    while (i < CHAVES.length - 2 && s > CHAVES[i + 1].s) i++;
    const a = CHAVES[i], b = CHAVES[i + 1], t = suave((s - a.s) / (b.s - a.s || 1));
    const mix = (x, y) => x + (y - x) * t;
    return { rotY: 0.15 + s * Math.PI * 1.5, incl: mix(a.incl, b.incl), luz: a.luz.map((v, k) => mix(v, b.luz[k])) };
  }
  var QUADROS = 16;

  // ferramentas/render.js
  window.planosDiamante = planosDiamante;
  window.renderizar = async (lista, tam = 600, formato = "image/png", qual = 0.9) => {
    const c = document.createElement("canvas");
    c.style.width = tam + "px";
    c.style.height = tam + "px";
    document.body.appendChild(c);
    const g = await criarGema(c, { forcar: true, preservar: true });
    const saida = [];
    for (const v of lista) {
      Object.assign(g.estado, v);
      g.desenhar(v.q || 8, 1);
      saida.push(c.toDataURL(formato, qual));
    }
    return saida;
  };
  window.poseEm = poseEm;
  window.QUADROS = QUADROS;
})();
