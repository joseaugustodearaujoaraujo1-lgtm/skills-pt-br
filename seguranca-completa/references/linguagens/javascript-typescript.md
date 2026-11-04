# JavaScript / TypeScript (Node.js, Express, React, Next.js)

Exemplos de correção para os IDs desta skill. Usam Node.js 20+ (ESM), Express 5, `pg`, `zod`, `jose` e bibliotecas maduras. Adapte nomes ao projeto e mantenha a stack existente (Prisma, Drizzle, Fastify, NestJS, Hono etc. seguem os mesmos princípios).

## Sumário
1. Configuração validada no boot — IA-01, OPS-08
2. Senhas — IA-07
3. SQL parametrizado e filtro pelo dono — IA-08, API-01
4. Validação de entrada e allowlist de campos — IA-09, API-04
5. Autenticação por padrão e papéis — IA-03, API-06
6. Sessão e JWT — API-03, FE-03
7. Rate limit — API-02, API-05
8. Timeout, retry e backoff — API-12, API-13
9. Idempotência — API-13, FIN-03
10. Dinheiro — FIN-01, FIN-07
11. Débito atômico e transação — FIN-02, API-15
12. Webhooks — API-18, FIN-04
13. SSRF — API-08
14. Logs e erros — API-17, IA-10
15. Uploads — API-16
16. Front-end (React/Next.js) — FE-02, FE-04, FE-06
17. LLMs e agentes — AGT-04, AGT-05
18. Testes que provam as correções
19. Ferramentas

---

## 1. Configuração validada no boot (IA-01, OPS-08)

```js
// config.js — o processo não sobe se faltar algo
import { z } from 'zod';

const Env = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  ALLOWED_ORIGINS: z.string().transform((s) => s.split(',')),
});

export const env = Env.parse(process.env);
```

- Segredos ficam só no servidor. No front, só variáveis públicas por natureza (`NEXT_PUBLIC_SUPABASE_ANON_KEY` com RLS, publishable key do Stripe).
- Nunca use `NEXT_PUBLIC_`/`VITE_` para chave secreta: o valor vai para o bundle.

## 2. Senhas (IA-07)

```js
import bcrypt from 'bcrypt'; // ou: import argon2 from 'argon2'

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain, storedHash) {
  return bcrypt.compare(plain, storedHash);
}
```

## 3. SQL parametrizado e filtro pelo dono (IA-08, API-01)

```js
// ERRADO: injeção e IDOR ao mesmo tempo
// await pool.query(`SELECT * FROM orders WHERE id = ${req.params.id}`);

export async function getOrder(req, res) {
  const { rows } = await pool.query(
    'SELECT id, total_cents, status, created_at FROM orders WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user.id], // user.id vem da sessão, nunca do body
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Pedido não encontrado' });
  return res.json(rows[0]);
}
```

Com Prisma: `prisma.order.findFirst({ where: { id, userId: req.user.id } })` (nunca `findUnique({ where: { id } })` sozinho). `$queryRawUnsafe` com interpolação é proibido; use `$queryRaw` com template tag.

## 4. Validação de entrada e allowlist de campos (IA-09, API-04)

```js
import { z } from 'zod';

const UpdateProfile = z
  .object({
    name: z.string().trim().min(1).max(100),
    bio: z.string().max(500).optional(),
  })
  .strict(); // rejeita campos extras como role, balance, verified

export async function updateProfile(req, res) {
  const parsed = UpdateProfile.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ error: 'Dados inválidos', details: parsed.error.flatten() });
  }
  const user = await users.update(req.user.id, parsed.data);
  // DTO de saída: só o que a tela precisa (sem password_hash, tokens etc.)
  return res.json({ id: user.id, name: user.name, bio: user.bio });
}
```

## 5. Autenticação por padrão e papéis (IA-03, API-06)

```js
import express from 'express';

const app = express();

const publicRoutes = express.Router();
publicRoutes.post('/login', loginLimiter, login);
publicRoutes.post('/signup', signupLimiter, signup);

const privateRoutes = express.Router();
privateRoutes.use(requireUser); // tudo abaixo exige login
privateRoutes.get('/orders/:id', getOrder);
privateRoutes.patch('/me', updateProfile);
privateRoutes.delete('/admin/users/:id', requireRole('admin'), deleteUser);

app.use('/api', publicRoutes);
app.use('/api', privateRoutes);

export function requireRole(...roles) {
  return (req, res, next) =>
    roles.includes(req.user?.role) ? next() : res.status(403).json({ error: 'Sem permissão' });
}
```

## 6. Sessão e JWT (API-03, FE-03)

```js
import { SignJWT, jwtVerify } from 'jose';

const key = new TextEncoder().encode(env.JWT_SECRET);
const ISSUER = 'minha-api';
const AUDIENCE = 'minha-app';

export async function issueSession(res, user) {
  const token = await new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(user.id))
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(key);
  res.cookie('session', token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 15 * 60 * 1000 });
}

export async function requireUser(req, res, next) {
  const token = req.cookies?.session;
  if (!token) return res.status(401).json({ error: 'Não autenticado' });
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'], // algoritmo fixo: bloqueia alg "none" e confusão de algoritmo
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch {
    return res.status(401).json({ error: 'Sessão inválida ou expirada' });
  }
}
```

- Nunca use `jwt.decode()` para decidir permissão; só a verificação vale.
- Com cookies, proteja contra CSRF (SameSite + checagem de `Origin` ou token CSRF em formulários).
- Prefira um provedor de auth (Auth.js, Clerk, Supabase Auth, Lucia, Better Auth) a implementar do zero.

## 7. Rate limit (API-02, API-05)

```js
import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
```

Com mais de uma instância, use um store compartilhado (Redis: `rate-limit-redis`) ou o rate limit do provedor/WAF. Limite também tamanho de corpo: `app.use(express.json({ limit: '100kb' }))`.

## 8. Timeout, retry e backoff (API-12, API-13)

```js
const RETRYABLE = new Set([429, 502, 503, 504]);

// Use só para leituras ou escritas com Idempotency-Key.
export async function fetchWithRetry(url, options = {}, { retries = 3, timeoutMs = 5000 } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { ...options, signal: AbortSignal.timeout(timeoutMs) });
      if (!RETRYABLE.has(res.status) || attempt >= retries) return res;
    } catch (err) {
      if (attempt >= retries) throw err;
    }
    const cap = Math.min(1000 * 2 ** attempt, 10000);
    const delay = cap / 2 + Math.random() * (cap / 2); // backoff exponencial com jitter
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}
```

- `axios`: `axios.create({ timeout: 5000 })`. Pool do `pg`: `connectionTimeoutMillis` e `statement_timeout`.
- Circuit breaker: `opossum`.

## 9. Idempotência (API-13, FIN-03)

```sql
CREATE TABLE idempotency_keys (
  user_id      uuid        NOT NULL,
  key          text        NOT NULL,
  request_hash text        NOT NULL,
  status_code  int,
  response     jsonb,
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, key)
);
```

```js
import { createHash } from 'node:crypto';

export function idempotent(handler) {
  return async (req, res) => {
    const key = req.get('Idempotency-Key');
    if (!key) return res.status(400).json({ error: 'Envie o cabeçalho Idempotency-Key' });
    const hash = createHash('sha256').update(JSON.stringify(req.body ?? {})).digest('hex');

    const claimed = await pool.query(
      `INSERT INTO idempotency_keys (user_id, key, request_hash) VALUES ($1, $2, $3)
       ON CONFLICT (user_id, key) DO NOTHING`,
      [req.user.id, key, hash],
    );

    if (claimed.rowCount === 0) {
      const { rows } = await pool.query(
        'SELECT request_hash, status_code, response FROM idempotency_keys WHERE user_id = $1 AND key = $2',
        [req.user.id, key],
      );
      const saved = rows[0];
      if (saved.request_hash !== hash) return res.status(422).json({ error: 'Chave já usada com outro conteúdo' });
      if (saved.status_code === null) return res.status(409).json({ error: 'Requisição ainda em processamento' });
      return res.status(saved.status_code).json(saved.response);
    }

    try {
      const { status, body } = await handler(req);
      await pool.query(
        'UPDATE idempotency_keys SET status_code = $1, response = $2 WHERE user_id = $3 AND key = $4',
        [status, body, req.user.id, key],
      );
      return res.status(status).json(body);
    } catch (err) {
      // libera a chave para nova tentativa se nada foi concluído
      await pool.query('DELETE FROM idempotency_keys WHERE user_id = $1 AND key = $2', [req.user.id, key]);
      throw err;
    }
  };
}
```

Ao chamar o provedor de pagamento, repasse a chave: `stripe.paymentIntents.create(params, { idempotencyKey: \`order-${orderId}\` })`.

## 10. Dinheiro (FIN-01, FIN-07)

```js
// valores em centavos (inteiros); nunca 19.9
const priceCents = 1990;

export function totalCents(items) {
  return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
}

// divide sem perder centavos: 10000 em 3 → [3334, 3333, 3333]
export function splitCents(total, parts) {
  const base = Math.floor(total / parts);
  const rest = total - base * parts;
  return Array.from({ length: parts }, (_, i) => base + (i < rest ? 1 : 0));
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const formatBRL = (cents) => brl.format(cents / 100); // só para exibir
```

- Para juros/percentuais use `decimal.js` ou `dinero.js` e arredonde uma vez.
- O `pg` retorna `BIGINT`/`NUMERIC` como string: converta com cuidado (`BigInt(value)` ou `decimal.js`), não com `parseFloat`.

## 11. Débito atômico e transação (FIN-02, API-15)

```js
export class InsufficientFunds extends Error {}

export async function transfer(fromId, toId, amountCents, referenceId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const debit = await client.query(
      'UPDATE accounts SET balance_cents = balance_cents - $1 WHERE id = $2 AND balance_cents >= $1',
      [amountCents, fromId],
    );
    if (debit.rowCount === 0) throw new InsufficientFunds();
    await client.query('UPDATE accounts SET balance_cents = balance_cents + $1 WHERE id = $2', [amountCents, toId]);
    await client.query(
      `INSERT INTO ledger_entries (reference_id, account_id, amount_cents) VALUES ($1, $2, $3), ($1, $4, $5)`,
      [referenceId, fromId, -amountCents, toId, amountCents],
    );
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
```

Com Prisma: `prisma.$transaction(async (tx) => { const r = await tx.account.updateMany({ where: { id, balanceCents: { gte: amount } }, data: { balanceCents: { decrement: amount } } }); if (r.count === 0) throw ... })`. Schema do ledger e constraints em `sql-e-bancos.md`.

## 12. Webhooks (API-18, FIN-04)

```js
// Express 5: erros lançados em handlers async chegam ao middleware de erro
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  let event;
  try {
    // corpo bruto + segredo: rejeita eventos forjados
    event = stripe.webhooks.constructEvent(req.body, req.get('stripe-signature'), env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).send('Assinatura inválida');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const fresh = await client.query(
      'INSERT INTO processed_events (provider, event_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      ['stripe', event.id],
    );
    if (fresh.rowCount === 1 && event.type === 'payment_intent.succeeded') {
      await client.query(
        "UPDATE orders SET status = 'paid' WHERE payment_intent_id = $1 AND status = 'pending'",
        [event.data.object.id],
      );
    }
    await client.query('COMMIT');
    return res.sendStatus(200);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});
```

Provedores sem SDK (HMAC genérico):

```js
import { createHmac, timingSafeEqual } from 'node:crypto';

export function verifyHmac(rawBody, signatureHex, secret) {
  const expected = createHmac('sha256', secret).update(rawBody).digest();
  const received = Buffer.from(signatureHex ?? '', 'hex');
  return received.length === expected.length && timingSafeEqual(received, expected);
}
```

## 13. SSRF (API-08)

```js
import { lookup } from 'node:dns/promises';
import ipaddr from 'ipaddr.js';

export async function assertPublicUrl(raw) {
  const url = new URL(raw);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Protocolo não permitido');
  const addresses = await lookup(url.hostname, { all: true });
  for (const { address } of addresses) {
    // process() converte IPv4 mapeado em IPv6; range() !== 'unicast' cobre privado, loopback, link-local etc.
    if (ipaddr.process(address).range() !== 'unicast') throw new Error('Destino não permitido');
  }
  return url;
}

// Uso: valide antes e não siga redirects automaticamente
// const url = await assertPublicUrl(input);
// const res = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(5000) });
```

A checagem por DNS tem uma janela entre a consulta e a conexão (DNS rebinding). Para recursos expostos a muitos usuários, use um agente que valida o IP na conexão (`request-filtering-agent`) ou um serviço isolado sem acesso à rede interna.

## 14. Logs e erros (API-17, IA-10)

```js
import pino from 'pino';

export const logger = pino({
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.token', '*.cpf', '*.cardNumber'],
    censor: '[REDACTED]',
  },
});

// por último, depois de todas as rotas
app.use((err, req, res, _next) => {
  const errorId = crypto.randomUUID();
  logger.error({ err, errorId, path: req.path }, 'erro não tratado');
  res.status(err.status ?? 500).json({
    error: err.expose ? err.message : 'Erro interno. Informe este código ao suporte.',
    errorId,
  });
});
```

## 15. Uploads (API-16)

```js
import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } });
const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/webp']);

app.post('/api/avatar', requireUser, upload.single('file'), async (req, res) => {
  const type = req.file ? await fileTypeFromBuffer(req.file.buffer) : undefined; // tipo real pelo conteúdo
  if (!type || !ALLOWED.has(type.mime)) return res.status(415).json({ error: 'Envie PNG, JPEG ou WebP até 5 MB' });
  const objectKey = `avatars/${req.user.id}/${crypto.randomUUID()}.${type.ext}`; // nunca o nome original
  await storage.putPrivate(objectKey, req.file.buffer, type.mime);
  res.status(201).json({ key: objectKey });
});
```

## 16. Front-end (React / Next.js) (FE-02, FE-04, FE-06)

```jsx
// FE-02: HTML de usuário/LLM sempre sanitizado
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />

// FE-06: cancela a requisição anterior ao trocar o filtro
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/products?category=${encodeURIComponent(category)}`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setProducts)
    .catch((err) => { if (err.name !== 'AbortError') setError(err); });
  return () => controller.abort();
}, [category]);
```

```js
// FE-04: Next.js — server action checa sessão e dono, sem confiar no middleware
'use server';

export async function deletePost(postId) {
  const user = await requireUser(); // lança se não houver sessão válida
  const post = await db.post.findFirst({ where: { id: postId, authorId: user.id } });
  if (!post) throw new Error('Não encontrado');
  await db.post.delete({ where: { id: post.id } });
}
```

- Mantenha `next` atualizado (CVE-2025-29927 corrigida em 12.3.5, 13.5.9, 14.2.25 e 15.2.3).
- Prefira TanStack Query/SWR para dados: resolvem cancelamento, cache e estados de erro.

## 17. LLMs e agentes (AGT-04, AGT-05)

```js
import { z } from 'zod';

const AgentAction = z.discriminatedUnion('action', [
  z.object({ action: z.literal('lookup_order'), orderId: z.string().uuid() }),
  z.object({ action: z.literal('escalate'), reason: z.string().max(500) }),
]);

export async function runAction(modelOutput, currentUser) {
  let data;
  try {
    data = AgentAction.parse(JSON.parse(modelOutput)); // saída do modelo é entrada não confiável
  } catch {
    return escalateToHuman('Resposta do modelo inválida');
  }
  if (data.action === 'lookup_order') {
    return orders.findForUser(currentUser, data.orderId); // dono verificado pelo código, não pelo modelo
  }
  return escalateToHuman(data.reason);
}

// AGT-05: limites duros por execução
export async function runAgent(task, { maxSteps = 20, maxCostUsd = 0.5 } = {}) {
  let costUsd = 0;
  for (let step = 0; step < maxSteps; step++) {
    const { done, usage } = await agentStep(task);
    costUsd += usage.costUsd;
    if (costUsd > maxCostUsd) throw new Error('Orçamento da execução excedido');
    if (done) return;
  }
  throw new Error('Limite de passos atingido');
}
```

## 18. Testes que provam as correções

```js
// Vitest/Jest + supertest
it('API-01: não devolve pedido de outro usuário', async () => {
  const res = await request(app).get(`/api/orders/${pedidoDoB.id}`).set('Cookie', cookieDoA);
  expect(res.status).toBe(404);
});

it('FIN-02: saque concorrente não deixa saldo negativo', async () => {
  const results = await Promise.all(
    Array.from({ length: 20 }, () =>
      request(app).post('/api/withdraw').set('Cookie', cookieDoA).send({ amountCents: 10_000 }),
    ),
  );
  expect(results.filter((r) => r.status === 200)).toHaveLength(1);
});

it('IA-03: rotas privadas exigem login', async () => {
  for (const path of ['/api/orders/1', '/api/me']) {
    expect((await request(app).get(path)).status).toBe(401);
  }
});
```

## 19. Ferramentas
- Segredos: `gitleaks`, `trufflehog`, GitHub secret scanning.
- Código: `eslint-plugin-security`, `eslint-plugin-react-hooks`, Semgrep (`p/javascript`, `p/typescript`, `p/react`, `p/nodejs`), TypeScript `strict`.
- Dependências: `npm ci --ignore-scripts` no CI, `npm audit`, `osv-scanner`, Socket, Dependabot/Renovate com idade mínima de versão.
- Testes: Vitest/Jest, supertest, Playwright, `fast-check` (propriedades), Stryker (mutação), k6 (carga e concorrência).
- Front: Lighthouse, axe, `@next/bundle-analyzer`.
