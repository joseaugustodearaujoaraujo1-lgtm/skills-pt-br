// Pose da pedra e direção da luz ao longo do palco (s de 0 a 1). A mesma função serve ao 3D ao vivo e aos quadros de reserva.
// Fases: hero (0–.26) · mesa (.34–.48) · coroa (.56–.70) · pavilhão (.78–.92) · saída (1).
const CHAVES = [
  { s: 0,    incl: .32,  luz: [-.45, .70, .55] },
  { s: .26,  incl: .34,  luz: [-.40, .72, .56] },
  { s: .38,  incl: 1.38, luz: [.25, .45, .86] },
  { s: .48,  incl: 1.38, luz: [.38, .40, .83] },
  { s: .60,  incl: .06,  luz: [-.80, .45, .40] },
  { s: .70,  incl: .06,  luz: [-.70, .55, .45] },
  { s: .82,  incl: -.95, luz: [.45, -.55, .70] },
  { s: .92,  incl: -.95, luz: [.55, -.45, .70] },
  { s: 1,    incl: .40,  luz: [-.30, .70, .65] },
];
const suave = t => t * t * (3 - 2 * t);
export function poseEm(s) {
  s = Math.min(1, Math.max(0, s));
  let i = 0; while (i < CHAVES.length - 2 && s > CHAVES[i + 1].s) i++;
  const a = CHAVES[i], b = CHAVES[i + 1], t = suave((s - a.s) / (b.s - a.s || 1));
  const mix = (x, y) => x + (y - x) * t;
  return { rotY: .15 + s * Math.PI * 1.5, incl: mix(a.incl, b.incl), luz: a.luz.map((v, k) => mix(v, b.luz[k])) };
}
export const QUADROS = 16; // quadros de reserva (sem GPU)
