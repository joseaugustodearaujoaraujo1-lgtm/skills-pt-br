// Giro de objeto 3D por quadros (reescrito a partir de OLEA, `src/main.js`, e BRUMA, voo do hero).
// Um canvas 2D desenha o quadro N de uma sequência de imagens; a rolagem do trecho fixo escolhe N.
// Uso: giroQuadros(document.querySelector('.giro'));  (lê data-quadros, data-caminho, data-curva)
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Curvas de progresso (0..1 da rolagem) → posição na sequência (0..1). 'vaivem' é o que a OLEA usa: gira 27% e volta (seno).
export const curvas = {
  linear: p => p,
  vaivem: p => .27 * Math.sin(Math.PI * gsap.utils.clamp(0, 1, p)),
  suave: p => p * p * (3 - 2 * p),
};

export function giroQuadros(secao, { aoAtualizar } = {}) {
  const d = secao.dataset, N = +d.quadros || 36, modelo = d.caminho || 'img/giro/{n}.webp';
  const tela = secao.querySelector('.giro-quadros'), g = tela.getContext('2d');
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const curva = curvas[d.curva] || curvas.linear;
  const url = i => modelo.replace('{n}', String(i).padStart(2, '0'));

  // Carrega o quadro 0 primeiro; os outros em seguida, sem bloquear. decoding async evita engasgo no 1º desenho de cada quadro.
  const quadros = Array.from({ length: N }, (_, i) => { const im = new Image(); im.decoding = 'async'; if (i === 0) im.src = url(0); return im; });
  const carregarResto = () => { for (let i = 1; i < N; i++) quadros[i].src = url(i); };
  let ultimo = -1;

  // Desenha o quadro mais próximo que já carregou (nunca fica em branco se o quadro exato ainda não chegou).
  const pronto = k => quadros[k].complete && quadros[k].naturalWidth > 0;
  const maisProximo = i => { for (let r = 0; r < N; r++) { if (i - r >= 0 && pronto(i - r)) return i - r; if (i + r < N && pronto(i + r)) return i + r; } return -1; };
  const desenhar = t => {
    const i = maisProximo(Math.max(0, Math.min(N - 1, Math.round(t * (N - 1)))));
    if (i < 0 || i === ultimo) return;
    ultimo = i; g.clearRect(0, 0, tela.width, tela.height); g.drawImage(quadros[i], 0, 0, tela.width, tela.height);
  };

  const iniciar = () => { tela.hidden = false; secao.classList.add('pronto'); desenhar(0); };
  quadros[0].complete && quadros[0].naturalWidth ? iniciar() : (quadros[0].onload = iniciar);
  if (reduzido) return { desenhar };          // sem animação: fica o poster/quadro 0

  carregarResto();
  ScrollTrigger.create({
    trigger: secao, start: 'top top', end: 'bottom bottom',   // progresso 0..1 = altura da seção menos a janela
    onUpdate: s => { const t = curva(s.progress); desenhar(t); aoAtualizar?.(s.progress, t); },
  });
  return { desenhar };
}
