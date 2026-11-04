# Etapa 3 — API segura

**Objetivo:** implementar a API do MVP com os controles de segurança e privacidade definidos na Etapa 1, de forma simples e testável.

**Entrada:** requisitos e design aprovados. **Saída:** código em `api/`, testes e `.env.example`.

Antes de codar: confirme a stack com o usuário e **preserve a stack existente** se houver. O exemplo abaixo usa Node.js (ESM) + Express; os princípios valem para qualquer linguagem.

## 3.1 Estrutura (MVC + camada de serviço, quando justificar)

```
api/
├── main.js                  (bootstrap: middlewares, rotas, 404, erro global, listen)
├── src/
│   ├── config/              (env validado, constantes)
│   ├── routes/              (definição de endpoints)
│   ├── controllers/         (entrada/saída HTTP; sem regra de negócio)
│   ├── services/            (regras de negócio)
│   ├── repositories/        (acesso a dados, se útil)
│   ├── middlewares/         (auth, validação, rate limit, erros)
│   ├── schemas/             (Zod/Joi: contratos de entrada e saída)
│   └── utils/
├── tests/
└── .env.example
```

Esqueleto de `main.js`:

```js
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import routes from './src/routes/index.js';
import { env } from './src/config/env.js';
import { notFound, errorHandler } from './src/middlewares/errors.js';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1); // atrás de Cloudflare/proxy: ajuste ao número real de proxies
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGINS, credentials: true })); // lista explícita, nunca '*' com credenciais
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '100kb' }));
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use('/api/v1', routes);
app.use(notFound);
app.use(errorHandler);

app.listen(env.PORT, () => console.log(`API ouvindo na porta ${env.PORT}`));
```

Observações: valide `env` na inicialização (falhe cedo se faltar segredo); `morgan` não deve registrar corpo, cabeçalho `Authorization` nem *query strings* sensíveis.

## 3.2 Mapa OWASP API Security Top 10 (2023) → controles

| Risco | O que fazer neste MVP | Como testar |
|-------|----------------------|-------------|
| API1 BOLA (autorização por objeto) | Toda consulta filtra por `userId` do token (`WHERE id = $1 AND user_id = $2`); nunca confie em IDs do cliente | Teste: usuário A tenta ler/alterar recurso do B → 403/404 |
| API2 Autenticação quebrada | Hash de senha com bcrypt (custo ≥ 12) ou Argon2id; `compare`; JWT curto (10–15 min) + *refresh* rotativo; bloqueio progressivo; MFA para admin; mensagens genéricas | Força bruta bloqueada; token expirado/forjado rejeitado |
| API3 Autorização de propriedade (BOPLA) / exposição excessiva e *mass assignment* | Schemas de **resposta** explícitos (lista de campos permitidos); nunca `Model.create(req.body)`; não devolver `passwordHash`, flags internas | Enviar `role: "admin"` no cadastro → ignorado |
| API4 Consumo irrestrito de recursos | Rate limit global e por rota sensível (login, recuperação), limite de payload, paginação máxima, timeouts, limite de upload | Exceder limites → 429/413; k6 na Etapa 7 |
| API5 Autorização de função (BFLA) | Middleware de papéis (RBAC) por rota; admin separado; negar por padrão | Usuário comum chama rota admin → 403 |
| API6 Fluxos de negócio sensíveis | Idempotência em pagamento/pedido, limites por conta, antifraude simples, confirmação de e-mail | Repetir `POST /orders` com mesma chave → 1 pedido |
| API7 SSRF | Se a API busca URLs: *allowlist* de hosts, bloquear IPs privados/metadata (169.254.169.254) | Tentar apontar para `http://127.0.0.1` → bloqueado |
| API8 Configuração incorreta | `helmet`, CORS restrito, sem *stack trace*, desabilitar métodos não usados, TLS, dependências atualizadas, segredos fora do código | Scanner de headers; `npm audit` |
| API9 Gestão inadequada de inventário | Versionar (`/v1`), manter só endpoints documentados, remover rotas de debug, separar staging de produção | Comparar rotas reais × OpenAPI |
| API10 Consumo inseguro de APIs | Validar respostas de terceiros, timeouts, *retries* com *backoff*, verificar assinatura de webhooks | Simular resposta malformada |

## 3.3 Autenticação e sessão

- **Senhas:** `bcrypt.hash(senha, 12)` e `bcrypt.compare`; rejeite senhas muito comuns; nunca registre senhas em log.
- **Tokens:** *access token* curto + *refresh token* de uso único (rotação) guardado hasheado no banco. Em navegador, prefira cookies `HttpOnly; Secure; SameSite=Lax/Strict`; se usar cookies, proteja contra CSRF.
- **JWT:** algoritmo fixo (`HS256`/`RS256`), validar `iss`, `aud`, `exp`; segredo forte vindo do ambiente; nada sensível no *payload*.
- **Recuperação de senha:** token aleatório, de uso único, expira em minutos; resposta idêntica exista ou não o e-mail.
- **Dados sensíveis recuperáveis** (que precisem ser lidos de volta): criptografia autenticada (AES-256-GCM) com chaves em gerenciador de segredos; nunca "criptografar senha".

## 3.4 Validação e saída

- Valide **tudo** na borda: *body*, *query*, *params*, cabeçalhos relevantes, com schema (Zod/Joi). Rejeite campos desconhecidos (`.strict()`).
- Consultas **parametrizadas** ou ORM; nunca concatene entrada em SQL/NoSQL.
- Saída por DTO/schema; nunca devolva a entidade crua do banco.
- Erros no formato único e sem detalhes internos:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Dados inválidos", "details": [{"field":"email","issue":"formato inválido"}], "requestId": "..." } }
```

## 3.5 Privacidade na API (LGPD na prática)

- Endpoints de direitos do titular: **exportar meus dados**, **corrigir**, **excluir/anonimizar conta**, **revogar consentimento**.
- Registro de **consentimentos** (o quê, quando, versão do texto, IP/UA se necessário).
- **Minimização:** colete só o necessário; mascare dados em logs (e-mail parcial, CPF omitido).
- **Retenção:** *job* periódico que elimina dados vencidos.
- **Registros de acesso (Marco Civil):** guarde IP, data/hora (com fuso) e porta de origem conforme aplicável por 6 meses, em local controlado, e separe-os dos dados de negócio.
- **Incidente:** log de auditoria e plano de resposta (ver skill jurídica) para notificar titulares e ANPD quando houver risco relevante.

## 3.6 Pagamentos e webhooks

- Use gateway certificado; **não** receba número de cartão no seu servidor. Use tokenização ou página hospedada.
- Webhooks: verifique assinatura/HMAC, *timestamp* (anti-replay) e idempotência; responda 2xx rápido e processe em fila.
- Conciliação periódica entre pedidos e gateway; trate estados (pendente, pago, falhou, estornado).
- Valores em centavos; arredondamento definido; jamais confie em preço vindo do cliente (recalcule no servidor).

## 3.7 Logs, observabilidade e auditoria

- Logs estruturados (ex.: `pino`) com `requestId`, nível, rota, status, latência; **redação** de campos (`authorization`, `password`, `token`, `cpf`).
- Auditoria de ações sensíveis (login, mudança de e-mail/senha, papéis, exclusões, pagamentos).
- Healthcheck `/health` (sem detalhes internos) e *readiness*.
- Métricas básicas: taxa de erro, latência p95, saturação de CPU/memória, conexões do banco.

## 3.8 Segredos, dependências e cadeia de suprimentos

- `.env` fora do Git (`.gitignore`); `.env.example` com chaves vazias.
- Scanner de segredos no CI (ex.: gitleaks); rotação de chaves vazadas.
- `npm ci` com *lockfile*; `npm audit --omit=dev`; Dependabot/Renovate; revise pacotes novos (reputação, manutenção, licença).
- Imagens Docker (se usadas): base mínima, usuário não root, sem segredos na imagem.

## 3.9 Banco de dados

- Usuário do app com **privilégio mínimo** (sem `DROP`/`SUPERUSER`); conexões TLS.
- Migrações versionadas; `UNIQUE`/`FK`/`CHECK`; índices para as consultas reais.
- Se usar Supabase/Postgres com RLS: políticas por tabela, nunca expor a *service role key* no navegador.
- Backups automáticos + **teste de restauração**.

## 3.10 Testes (proporcionais ao risco)

Cobertura mínima de MVP:

1. **Unitários** para regras de negócio (preço, desconto, estados de pedido).
2. **Integração** (Supertest) para cada rota: sucesso, validação inválida, sem autenticação, sem permissão, recurso de outro usuário.
3. **Segurança:** *mass assignment*, enumeração de usuários, limite de taxa, tokens inválidos/expirados, injeção básica, CORS.
4. **Contrato:** respostas conforme o schema/OpenAPI.

Rodar: `npm test`, `npm run lint`, `npm audit`. **Só relate resultados que você de fato executou.**

## 3.11 Auditoria complementar (se disponível)

Se houver skills de auditoria (OWASP, API, segredos, dependências, `prevencao-de-falhas`), ofereça rodá-las ao usuário antes do portão. Pergunte o nível de profundidade; para dinheiro ou dados sensíveis, recomende o rigoroso.

## 3.12 Critério de pronto e portão

- [ ] Todas as rotas do MVP implementadas conforme RF e critérios de aceite.
- [ ] Mapa OWASP API Top 10 preenchido com evidência de teste.
- [ ] Testes passando (reporte comandos e saída).
- [ ] Nenhum segredo no repositório; `.env.example` completo.
- [ ] Endpoints de direitos do titular e política de retenção implementados.
- [ ] Logs com redação, auditoria e `requestId`.
- [ ] Pendências e riscos residuais listados.

Peça aprovação antes da Etapa 4.
