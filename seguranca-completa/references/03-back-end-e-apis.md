# 03 · Back-end e APIs

Vale para APIs REST, GraphQL, gRPC, server actions, funções serverless, workers e qualquer código que roda no servidor. Os itens API-01 a API-10 seguem o **OWASP API Security Top 10 (2023)**; os demais são falhas de confiabilidade que derrubam sistemas em produção.

## Sumário
- API-01 BOLA / IDOR
- API-02 Autenticação quebrada
- API-03 JWT mal configurado
- API-04 Mass assignment e excesso de dados na resposta
- API-05 Sem rate limit, paginação ou limites
- API-06 Autorização por função (BFLA)
- API-07 Abuso de fluxo de negócio
- API-08 SSRF
- API-09 Configuração insegura
- API-10 Endpoints esquecidos ou não documentados
- API-11 Confiança cega em APIs de terceiros
- API-12 Chamadas externas sem timeout
- API-13 Retry sem backoff e sem idempotência
- API-14 N+1 e consultas sem índice
- API-15 Operações em várias etapas sem transação
- API-16 Upload sem validação
- API-17 Dados sensíveis nos logs
- API-18 Webhooks sem verificação de assinatura

---

## API-01 · BOLA / IDOR — acessar o dado de outro usuário
**Gravidade:** Crítico · OWASP API1:2023

**Por que importa:** é a falha mais comum e mais explorada em APIs. O usuário logado troca `/pedidos/102` por `/pedidos/103` e recebe o pedido de outra pessoa. Vale para GET, PUT, PATCH, DELETE, downloads de arquivo e GraphQL.

**Como detectar:**
- Toda consulta que recebe um ID vindo da requisição (`params.id`, `query.id`, `body.orderId`) deve ter também um filtro pelo dono (`user_id`, `tenant_id`, `org_id`).
- Padrões suspeitos: `findById(req.params.id)`, `Model.objects.get(id=id)`, `repository.findById(id)`, `WHERE id = $1` sem `AND user_id = $2`.
- Em multi-tenant, procure qualquer consulta sem o tenant.

**Como corrigir:**
1. Filtre pelo dono **na própria consulta**: `WHERE id = $1 AND user_id = $2`, com `user_id` vindo da sessão, nunca do corpo da requisição.
2. Retorne 404 (e não 403) quando o recurso não é do usuário, para não confirmar que ele existe.
3. Centralize: um repositório/serviço que sempre recebe o usuário atual (`orders.findForUser(user, id)`), ou RLS no banco (Postgres/Supabase) como segunda camada.
4. IDs não sequenciais (UUID) dificultam adivinhar, mas **não substituem** a checagem.

**Como testar:** crie usuários A e B; com o token de A, tente ler, alterar e apagar cada recurso de B por todas as rotas; tudo deve retornar 404. Automatize esse teste para os recursos principais.

---

## API-02 · Autenticação quebrada
**Gravidade:** Crítico · OWASP API2:2023

**Por que importa:** login sem limite de tentativas permite força bruta e credential stuffing (senhas vazadas de outros sites); reset de senha mal feito permite tomar contas.

**Como detectar:** login sem rate limit; mensagem diferente para "usuário não existe" e "senha errada"; token de reset previsível, reutilizável ou sem expiração; troca de e-mail/senha sem pedir a senha atual; sessão que não expira e não é invalidada no logout ou na troca de senha.

**Como corrigir:**
1. Rate limit por IP **e** por conta no login, cadastro e reset; bloqueio progressivo.
2. Mensagem única: "e-mail ou senha inválidos".
3. Token de reset: aleatório criptograficamente (≥ 32 bytes), guardado como hash, uso único, expira em 15–60 min.
4. Ações sensíveis (trocar e-mail, senha, 2FA, dados bancários) pedem reautenticação.
5. Invalide sessões ao trocar senha e no logout; ofereça MFA, obrigatório para administradores.
6. Sempre que possível, use um provedor de autenticação maduro em vez de implementar do zero.

**Como testar:** 20 tentativas de senha errada devem ser bloqueadas; token de reset usado duas vezes deve falhar; sessão antiga deve parar de funcionar após trocar a senha.

---

## API-03 · JWT mal configurado
**Gravidade:** Alto

**Por que importa:** JWT mal validado vira passe livre: aceitar `alg: none`, confundir algoritmo (HS256 com chave pública), segredo fraco que pode ser quebrado offline, token sem expiração, ou ler o payload com `decode` sem verificar a assinatura.

**Como detectar:** chamadas a `jwt.decode` (sem verificar) usadas para autorização; ausência de `algorithms: [...]` fixo na verificação; segredo curto ou no código; tokens sem `exp`; dados sensíveis (CPF, papel editável) no payload.

**Como corrigir:**
1. Use a função de **verificação** da biblioteca com algoritmo fixo (`algorithms: ['HS256']` ou `['RS256']`/`['EdDSA']`).
2. Segredo HS256 com ≥ 256 bits aleatórios, em secret manager; ou chaves assimétricas com rotação (JWKS).
3. `exp` curto (5–15 min) para access token; refresh token rotativo e revogável guardado no servidor.
4. Valide `iss` e `aud`.
5. Não coloque dados sensíveis no payload (ele é só codificado em base64, não criptografado).
6. Para revogação imediata, mantenha lista de sessões/tokens válidos no servidor.

**Como testar:** token com assinatura alterada, `alg: none`, `exp` passado e `aud` errado devem ser rejeitados.

---

## API-04 · Mass assignment e excesso de dados na resposta (BOPLA)
**Gravidade:** Alto · OWASP API3:2023

**Por que importa:** passar `req.body` inteiro para `update` permite que o usuário envie `role: "admin"`, `balance: 999999`, `verified: true`. No sentido inverso, devolver o objeto inteiro do banco expõe hash de senha, tokens, CPF e campos internos.

**Como detectar:** `Model.update(req.body)`, `Object.assign(entity, req.body)`, `User(**data)`, `$fillable`/`$guarded` mal configurados, `@RequestBody Entity` direto no JPA; respostas que serializam a entidade inteira (`res.json(user)`).

**Como corrigir:**
1. Entrada: schema/DTO com **allowlist** dos campos que aquele endpoint aceita; rejeite ou ignore os demais.
2. Saída: DTO/serializer com só os campos necessários para aquela tela.
3. Campos sensíveis (papel, saldo, status de verificação) só mudam por fluxos específicos e autorizados.

**Como testar:** envie campos extras (`role`, `isAdmin`, `balance`) num update e confira que nada mudou; confira que nenhuma resposta contém `password`, `hash`, `token`, `secret`.

---

## API-05 · Sem rate limit, paginação ou limites de tamanho
**Gravidade:** Alto · OWASP API4:2023

**Por que importa:** um endpoint que devolve a tabela inteira, aceita upload sem limite ou permite milhares de requisições por segundo derruba o banco e gera custo (relato no r/Supabase: 200–300 req/s de um IP levaram o disco a 100% e o site ficou fora do ar por horas). Em APIs que chamam LLMs, cada requisição custa dinheiro.

**Como corrigir:**
1. Rate limit por IP e por usuário/chave (mais restrito em login, cadastro, envio de e-mail/SMS e rotas caras).
2. Paginação obrigatória com limite máximo (`limit` ≤ 100), cursor para listas grandes.
3. Limite de tamanho de corpo, de upload e de campos; timeout de consulta no banco (`statement_timeout`).
4. GraphQL: limite de profundidade, complexidade e número de itens; desligue introspection em produção se não for necessária.
5. Quotas de custo por usuário em recursos pagos (LLM, SMS).

**Como testar:** dispare 100 requisições rápidas e confira respostas 429; peça `limit=100000` e confira que o servidor limita.

---

## API-06 · Usuário comum chamando função de admin (BFLA)
**Gravidade:** Alto · OWASP API5:2023

**Por que importa:** rotas administrativas "escondidas" (não aparecem na interface) são descobertas lendo o JavaScript ou adivinhando (`/api/admin/users`).

**Como corrigir:** checagem de papel/permissão no servidor em toda rota administrativa (middleware de rota + checagem na regra de negócio); permissões granulares (`users:delete`) em vez de só "admin sim/não"; negar por padrão.

**Como testar:** com token de usuário comum, chame todas as rotas administrativas e espere 403.

---

## API-07 · Abuso de fluxo de negócio
**Gravidade:** Médio · OWASP API6:2023

**Por que importa:** o código funciona como foi pedido, mas o fluxo é abusado em escala: cupom reutilizado, bônus de indicação com contas falsas, bots comprando todo o estoque, envio de SMS para gerar custo.

**Como corrigir:** limites por usuário, dispositivo e janela de tempo; constraints de unicidade no banco (um cupom por usuário); verificação de e-mail/telefone antes de benefícios; detecção de bots (CAPTCHA, Turnstile, BotID) nos fluxos sensíveis; alertas para volumes anormais.

---

## API-08 · SSRF
**Gravidade:** Alto · OWASP API7:2023

**Por que importa:** qualquer recurso que busca uma URL informada pelo usuário (preview de link, importar imagem por URL, webhook configurável, gerar PDF de uma página) pode ser usado para acessar a rede interna, o banco ou o endpoint de metadata da nuvem (`169.254.169.254`), que entrega credenciais.

**Como corrigir:**
1. Allowlist de domínios quando possível.
2. Resolva o DNS e bloqueie IPs privados, loopback, link-local e metadata (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `169.254.0.0/16`, `::1`, `fc00::/7`) — e valide de novo após redirects.
3. Aceite só `http`/`https`; desligue redirects automáticos ou limite e revalide.
4. Rode buscas de URL em serviço isolado, sem acesso à rede interna; use IMDSv2 na AWS.

**Como testar:** envie `http://127.0.0.1`, `http://169.254.169.254/latest/meta-data/`, um domínio que resolve para IP interno e uma URL que redireciona para IP interno; todas devem ser bloqueadas.

---

## API-09 · Configuração insegura
**Gravidade:** Alto · OWASP API8:2023

**Como detectar:** CORS `*` (ou refletindo qualquer origem) com `credentials: true`; modo debug em produção (`DEBUG=True`, `APP_DEBUG=true`, `NODE_ENV` ≠ production); stack traces nas respostas; headers de segurança ausentes; listagem de diretórios; painéis administrativos (Swagger, phpMyAdmin, actuator) abertos; TLS desligado entre serviços.

**Como corrigir:** CORS com lista explícita de origens; debug desligado; erros genéricos (IA-10); headers (`Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `frame-ancestors`); painéis protegidos ou desligados; configuração por ambiente revisada antes de cada deploy.

**Como testar:** `curl -I` para conferir headers; `curl -H "Origin: https://evil.example"` e conferir que o CORS não libera; securityheaders.com; OWASP ZAP baseline.

### Headers de segurança: o que cada um faz e como configurar

| Header | Protege contra | Valor de partida |
|---|---|---|
| `Strict-Transport-Security` (HSTS) | acesso por HTTP e downgrade para conexão sem criptografia | `max-age=63072000; includeSubDomains` |
| `Content-Security-Policy` (CSP) | XSS e carregamento de scripts de origens não previstas | comece restritivo (`default-src 'self'`) e libere só o necessário; evite `unsafe-inline` em scripts |
| `X-Content-Type-Options` | o navegador "adivinhar" o tipo de um arquivo e executá-lo | `nosniff` |
| `frame-ancestors` (dentro da CSP) | clickjacking (sua página dentro de um iframe alheio) | `frame-ancestors 'none'` (ou liste quem pode embutir); `X-Frame-Options: DENY` é o equivalente antigo |
| `Referrer-Policy` | vazar URLs com tokens ou IDs para outros sites | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | uso de câmera, microfone e localização por scripts de terceiros | `camera=(), microphone=(), geolocation=()` |

Avisos importantes:
- **HSTS só vale sobre HTTPS** e é difícil de desfazer: teste com `max-age` curto antes. `includeSubDomains` obriga todos os subdomínios a ter HTTPS; não use `preload` sem entender que entrar na lista dos navegadores é lento de reverter.
- **CSP quebra páginas se for rígida demais.** Publique primeiro como `Content-Security-Policy-Report-Only`, leia os relatórios e só depois imponha. Scripts inline e de terceiros (analytics, chat) precisam de `nonce` ou de liberação explícita.
- Headers **não substituem** correção de XSS (FE-02); são a segunda camada.

**Express (pacote `helmet`):**

```js
import express from "express";
import helmet from "helmet";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        frameAncestors: ["'none'"],
      },
    },
    strictTransportSecurity: { maxAge: 63072000, includeSubDomains: true },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);

app.use((req, res, next) => {
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});
```

**Next.js (`next.config.mjs`):**

```js
const headersDeSeguranca = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: "default-src 'self'; frame-ancestors 'none'" },
];

const nextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: headersDeSeguranca }];
  },
};

export default nextConfig;
```

(A CSP tão simples assim quebra páginas que usam estilos ou scripts inline do Next.js; ajuste com `nonce` ou publique antes em modo Report-Only.)

**Nginx:**

```nginx
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```

**Como testar os headers:** `curl -I https://seu-site` e confira cada um; faça também a varredura em securityheaders.com e confirme no navegador (aba Console) que a CSP não bloqueou nada legítimo.

---

## API-10 · Endpoints esquecidos ou não documentados
**Gravidade:** Alto · OWASP API9:2023

**Por que importa:** versão antiga da API ainda no ar sem as correções novas, rota de teste em produção, endpoint interno exposto. No caso Base44, endpoints não documentados permitiam pular o SSO.

**Como corrigir:** inventário vivo das rotas (OpenAPI gerado do código); remover versões antigas com prazo comunicado; ambientes de teste separados e protegidos; scanner periódico de rotas expostas; revisar o inventário a cada release.

---

## API-11 · Confiança cega em APIs de terceiros
**Gravidade:** Médio · OWASP API10:2023

**Por que importa:** dados de parceiros e integrações são entrada externa: podem vir malformados, maliciosos ou de um parceiro comprometido.

**Como corrigir:** valide respostas com schema; trate valores como não confiáveis (escape, sanitize, limites); HTTPS com verificação de certificado (nunca desligar `verify`/`rejectUnauthorized`); timeouts (API-12); trate indisponibilidade com fallback.

---

## API-12 · Chamadas externas sem timeout
**Gravidade:** Alto

**Por que importa:** muitas bibliotecas HTTP não têm timeout por padrão (ou têm minutos). Quando um serviço dependente fica lento, as conexões ficam presas, o pool esgota e sua API inteira para — uma falha em cascata.

**Como detectar:** `fetch(` sem `AbortSignal.timeout`, `axios` sem `timeout`, `requests.get` sem `timeout=`, `http.Client{}` sem `Timeout` em Go, `HttpClient` sem `Timeout`, drivers de banco sem timeout de conexão/consulta.

**Como corrigir:**
1. Timeout explícito em toda chamada HTTP, de banco, de fila e de LLM (conexão + leitura).
2. Timeout total da requisição menor que o do cliente/gateway.
3. Circuit breaker para dependências instáveis (opossum, resilience4j, Polly, gobreaker, pybreaker).
4. Bulkhead: limite de chamadas simultâneas por dependência.

**Como testar:** aponte a dependência para um servidor que nunca responde e confira que sua API responde erro dentro do tempo definido.

---

## API-13 · Retry sem backoff e sem idempotência
**Gravidade:** Alto

**Por que importa:** retry imediato e ilimitado multiplica a carga sobre um serviço que já está com problema (tempestade de retries). Retry de operação não idempotente duplica efeitos: dois e-mails, dois pedidos, duas cobranças.

**Como corrigir:**
1. Retry só para erros temporários (timeout, 429, 502, 503, 504), com **limite** (3–5), **backoff exponencial** e **jitter**; respeite `Retry-After`.
2. Operações de escrita com **chave de idempotência**: o cliente envia `Idempotency-Key`; o servidor guarda a chave com o resultado (constraint `UNIQUE`) e devolve o mesmo resultado em repetições.
3. Consumidores de fila: assuma entrega pelo menos uma vez e deduplique por ID da mensagem.

**Como testar:** envie a mesma requisição de escrita com a mesma chave duas vezes (também em paralelo); só um efeito deve ocorrer e as duas respostas devem ser iguais.

---

## API-14 · N+1 e consultas sem índice
**Gravidade:** Médio

**Por que importa:** funciona com 10 registros e trava com 100 mil. Uma lista de 100 itens que busca o autor de cada um dispara 101 consultas.

**Como detectar:** loops que fazem consulta por item; ORM com lazy loading em listas; log de consultas mostrando repetição; `EXPLAIN ANALYZE` com `Seq Scan` em tabelas grandes; consultas lentas no painel do banco.

**Como corrigir:** eager loading / joins (`include`, `select_related`/`prefetch_related`, `JOIN FETCH`, `Include()`, `with()`); DataLoader em GraphQL; índices nas colunas usadas em `WHERE`, `JOIN` e `ORDER BY` (incluindo `user_id`/`tenant_id`); paginação.

**Como testar:** teste que conta consultas por requisição; dados de volume realista em homologação.

---

## API-15 · Operações em várias etapas sem transação
**Gravidade:** Alto

**Por que importa:** se der erro no meio, fica metade gravado: debitou e não creditou, criou o pedido sem itens, reservou estoque sem pedido.

**Como corrigir:**
1. Envolva as etapas numa transação de banco (`BEGIN … COMMIT`, `prisma.$transaction`, `transaction.atomic`, `@Transactional`, `DbContext` transaction, `DB::transaction`).
2. Não faça chamadas externas lentas (pagamento, e-mail) dentro da transação; use o padrão **outbox**: grave o evento na mesma transação e processe depois.
3. Entre serviços diferentes, use saga com ações de compensação.
4. Defina o nível de isolamento adequado quando houver concorrência (ver FIN-02).

**Como testar:** force uma exceção entre as etapas e confira que nada ficou gravado.

---

## API-16 · Upload sem validação
**Gravidade:** Alto

**Como detectar:** aceita qualquer tipo e tamanho; confia na extensão ou no `Content-Type` enviado; salva com o nome original (path traversal: `../../`); serve arquivos do usuário do mesmo domínio da aplicação; descompacta ZIP sem limites (zip bomb).

**Como corrigir:** limite de tamanho; verificar o tipo real pelo conteúdo (magic bytes); renomear com UUID; armazenar fora da pasta pública, em storage privado com URLs assinadas e expiração; servir de domínio separado com `Content-Disposition: attachment` quando for download; processar imagens re-encodando (remove payloads e metadados EXIF com localização); antivírus quando o risco justificar.

**Como testar:** envie arquivo grande demais, `.html`/`.svg` com script, arquivo com nome `../../x` e executável renomeado para `.jpg`.

---

## API-17 · Dados sensíveis nos logs
**Gravidade:** Alto

**Por que importa:** logs são copiados para vários sistemas (APM, Sentry, buckets) com acesso amplo e retenção longa. Senhas, tokens, cartões e documentos em log viram vazamento e violação de LGPD.

**Como detectar:** `console.log(req.body)`, `logger.info(user)`, log de headers completos (`Authorization`, `Cookie`), log de respostas de pagamento, erros que incluem o payload.

**Como corrigir:** logs estruturados com allowlist do que entra; redaction automática (pino `redact`, structlog processors, Serilog destructuring, filtros no Sentry `beforeSend`); nunca logar senha, token, cartão completo, CPF completo, conteúdo de documentos; retenção definida.

**Como testar:** faça login e um pagamento de teste e procure nos logs pela senha e pelo token usados.

---

## API-18 · Webhooks sem verificação de assinatura
**Gravidade:** Alto (Crítico se mexe com pagamento)

**Por que importa:** a URL de webhook é pública. Sem verificar a assinatura, qualquer pessoa envia um "pagamento aprovado" falso e libera o produto.

**Como corrigir:**
1. Verifique a assinatura HMAC com o segredo do provedor usando o **corpo bruto** da requisição (antes do parse de JSON) e comparação em tempo constante.
2. Rejeite eventos com timestamp antigo (ex.: > 5 min) para evitar replay.
3. Deduplique pelo ID do evento (FIN-04).
4. Responda 2xx rápido e processe em fila; confirme o status consultando a API do provedor quando o valor for alto.

**Como testar:** envie um webhook com assinatura inválida, sem assinatura e repetido; os dois primeiros devem ser rejeitados e o terceiro ignorado.
