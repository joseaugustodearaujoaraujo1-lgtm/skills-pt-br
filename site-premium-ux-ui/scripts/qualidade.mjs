// Filtro de qualidade do acervo: identifica capturas que NÃO são o site (erro, bloqueio, domínio parado, desafio anti-robô).
// Uso: import { capturaInvalida } from './qualidade.mjs'  →  capturaInvalida(registroDoAcervo)
// Critérios: status HTTP >= 400, ou título típico de página de erro/bloqueio. Um site que apenas tem "not found" no nome
// (ex.: "Emily Not Found", status 200) continua válido.
const TITULO_ERRO = /^\s*(403|404|500|502|503|525)\b|forbidden|access denied|um momento|just a moment|attention required|page not found|ssl handshake|reconnect your domain|account suspended|bad gateway|service unavailable|domain (is )?(parked|for sale|expired)|this site can.t be reached|checking your browser|verifying you are human/i;

export function capturaInvalida(s) {
  if (s.http >= 400) return true;
  return TITULO_ERRO.test(s.tituloPagina || '');
}
