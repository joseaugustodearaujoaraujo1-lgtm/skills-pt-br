// Roteiro único da rolagem: t (0..1 ao longo do palco) -> estado do moedor. Usado pelo site e pelo gerador de quadros.
const suave = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
export const QUADROS = 24; // quadros do plano B (sem GPU / movimento reduzido usa só o primeiro e o último)
export function estadoDe(t) {
  const e = suave(.16, .62, t);
  return { e, rot: -.55 + t * 2.2, elev: 12 + 5 * e };
}
// qual peça está em destaque (índice do passo) para cada t; os passos ocupam o trecho depois da abertura
export const PASSOS = ['porca', 'cabeca', 'corpo', 'mo', 'anel'];
export function passoDe(t) { if (t < .3) return -1; return Math.min(PASSOS.length - 1, Math.floor((t - .3) / .7 * PASSOS.length)); }
