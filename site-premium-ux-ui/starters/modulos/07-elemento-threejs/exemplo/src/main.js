import { iniciarElemento } from '../../modulo.js';
import { criarObjeto } from './elemento/objeto.js';

const canvas = document.querySelector('[data-elemento-3d]');
const captura = new URLSearchParams(location.search).has('captura');
try {
  const el = iniciarElemento(canvas, { criar: criarObjeto, fundo: captura ? 0xe9e9e9 : null, exposicao: 1.1 });
  window.elemento3d = el; // no console: elemento3d.info(), elemento3d.poster()
} catch (erro) {
  // sem WebGL: fica o pôster do próprio render (img com data-poster), se existir
  console.warn('WebGL indisponível', erro);
  document.documentElement.classList.add('sem-webgl');
}
