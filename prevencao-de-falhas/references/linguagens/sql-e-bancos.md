# SQL e bancos de dados (PostgreSQL, Supabase, MySQL, Firebase)

Padrões de banco que valem para qualquer linguagem. Os exemplos são PostgreSQL (inclui Supabase); diferenças de MySQL e regras do Firebase estão no final.

## Sumário
1. Tipos certos — FIN-01, FE-09
2. Constraints como rede de segurança — FIN-02, API-07
3. Débito atômico e locks — FIN-02
4. Ledger de dupla entrada — FIN-05
5. Idempotência e eventos processados — API-13, FIN-03, FIN-04
6. Auditoria append-only — FIN-11
7. RLS no Supabase/Postgres — IA-02, API-01
8. Storage do Supabase — OPS-09
9. Usuário somente leitura para agentes e relatórios — IA-13, AGT-02
10. Índices e N+1 — API-14
11. Timeouts e migrations seguras — API-05, OPS-04
12. MySQL
13. Firebase (Firestore e Storage)

---

## 1. Tipos certos (FIN-01, FE-09)

```sql
CREATE TABLE orders (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users (id), -- no Supabase; em outros, a sua tabela users
  total_cents bigint      NOT NULL CHECK (total_cents >= 0),   -- dinheiro em centavos (ou numeric(19,4))
  currency    char(3)     NOT NULL DEFAULT 'BRL',
  status      text        NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded', 'disputed')),
  created_at  timestamptz NOT NULL DEFAULT now()               -- instante em UTC
);
```

- Nunca `real`/`double precision`/`float` para dinheiro; o tipo `money` do Postgres depende de locale, evite.
- `timestamptz` para instantes; `date` para datas sem hora (vencimento, aniversário).

## 2. Constraints como rede de segurança (FIN-02, API-07)

```sql
ALTER TABLE accounts ADD CONSTRAINT balance_non_negative CHECK (balance_cents >= 0);

-- cupom usado uma vez por usuário
CREATE TABLE coupon_redemptions (
  coupon_id uuid NOT NULL REFERENCES coupons (id),
  user_id   uuid NOT NULL,
  order_id  uuid NOT NULL,
  PRIMARY KEY (coupon_id, user_id)
);
```

Mesmo que o código tenha um bug de concorrência, o banco recusa o estado inválido.

## 3. Débito atômico e locks (FIN-02)

```sql
-- Opção 1: UPDATE condicional (confira linhas afetadas = 1)
UPDATE accounts
   SET balance_cents = balance_cents - $1
 WHERE id = $2 AND balance_cents >= $1;

-- Opção 2: lock pessimista quando é preciso ler antes de decidir
BEGIN;
SELECT balance_cents FROM accounts WHERE id = $1 FOR UPDATE;
-- ... regras de negócio ...
UPDATE accounts SET balance_cents = balance_cents - $2 WHERE id = $1;
COMMIT;
```

Em transferências, trave as contas sempre na mesma ordem (`ORDER BY id ... FOR UPDATE`) para evitar deadlock.

## 4. Ledger de dupla entrada (FIN-05)

```sql
CREATE TABLE ledger_transactions (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key text        NOT NULL UNIQUE,
  kind            text        NOT NULL,          -- 'transfer', 'payment', 'refund', 'fee'
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ledger_entries (
  id             bigserial PRIMARY KEY,
  transaction_id uuid      NOT NULL REFERENCES ledger_transactions (id),
  account_id     uuid      NOT NULL REFERENCES accounts (id),
  amount_cents   bigint    NOT NULL CHECK (amount_cents <> 0) -- negativo = débito, positivo = crédito
);

-- conferência: cada transação soma zero
SELECT transaction_id
  FROM ledger_entries
 GROUP BY transaction_id
HAVING sum(amount_cents) <> 0;   -- deve retornar vazio

-- saldo derivado
SELECT account_id, sum(amount_cents) AS balance_cents FROM ledger_entries GROUP BY account_id;
```

Torne o ledger append-only com permissões (seção 6).

## 5. Idempotência e eventos processados (API-13, FIN-03, FIN-04)

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

CREATE TABLE processed_events (
  provider     text        NOT NULL,
  event_id     text        NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (provider, event_id)
);

-- dentro da mesma transação do efeito:
INSERT INTO processed_events (provider, event_id) VALUES ('stripe', $1) ON CONFLICT DO NOTHING;
-- 1 linha inserida = evento novo → aplique o efeito; 0 = repetido → ignore
```

Limpe chaves antigas periodicamente (ex.: mais de 30 dias).

## 6. Auditoria append-only (FIN-11)

```sql
CREATE TABLE audit_log (
  id          bigserial   PRIMARY KEY,
  actor_id    uuid,
  action      text        NOT NULL,
  resource    text        NOT NULL,
  resource_id text,
  before      jsonb,
  after       jsonb,
  ip          inet,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- a aplicação só pode inserir e ler
REVOKE UPDATE, DELETE, TRUNCATE ON audit_log, ledger_entries FROM app_user;
GRANT INSERT, SELECT ON audit_log, ledger_entries TO app_user;
```

## 7. RLS no Supabase/Postgres (IA-02, API-01)

```sql
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders: dono lê"     ON public.orders FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);
CREATE POLICY "orders: dono cria"   ON public.orders FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "orders: dono altera" ON public.orders FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
-- sem policy de DELETE = ninguém apaga pelo cliente

-- campos que o usuário não pode mudar (status, total) ficam fora do alcance do cliente:
REVOKE UPDATE ON public.orders FROM authenticated;
GRANT UPDATE (shipping_address) ON public.orders TO authenticated;

-- tabelas só do servidor: RLS ligada e nenhuma policy (só service_role, no back-end, acessa)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
```

Verificações:

```sql
-- tabelas expostas sem RLS (deve retornar vazio)
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND NOT rowsecurity;

-- policies permissivas demais
SELECT tablename, policyname, qual, with_check FROM pg_policies
 WHERE schemaname = 'public' AND (qual = 'true' OR with_check = 'true');
```

- `(select auth.uid())` entre parênteses é avaliado uma vez por consulta (melhor desempenho).
- Multi-tenant: `USING (org_id IN (SELECT org_id FROM memberships WHERE user_id = (select auth.uid())))`.
- Funções `SECURITY DEFINER` ignoram RLS: defina `SET search_path = ''` e cheque permissões dentro delas.
- Views ignoram RLS por padrão; no Postgres 15+ use `WITH (security_invoker = true)`.
- `service_role` nunca vai para o front, para agentes nem para o repositório.

## 8. Storage do Supabase (OPS-09)

```sql
-- bucket privado 'documents'; cada usuário só acessa a própria pasta (<user_id>/arquivo)
CREATE POLICY "documents: dono lê" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = (select auth.uid())::text);
CREATE POLICY "documents: dono envia" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = (select auth.uid())::text);
```

Entregue arquivos com URLs assinadas de curta duração (`createSignedUrl`).

## 9. Usuário somente leitura para agentes e relatórios (IA-13, AGT-02)

```sql
CREATE ROLE agent_readonly LOGIN PASSWORD '<gerado e guardado em secret manager>';
GRANT CONNECT ON DATABASE app TO agent_readonly;
GRANT USAGE ON SCHEMA public TO agent_readonly;
GRANT SELECT ON public.products, public.orders_summary TO agent_readonly; -- só o necessário
ALTER ROLE agent_readonly SET default_transaction_read_only = on;
ALTER ROLE agent_readonly SET statement_timeout = '5s';
```

Prefira uma réplica de leitura ou cópia anonimizada para agentes e análises.

## 10. Índices e N+1 (API-14)

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS orders_user_created_idx ON orders (user_id, created_at DESC);
EXPLAIN (ANALYZE, BUFFERS) SELECT ... ;   -- procure Seq Scan em tabelas grandes
```

Indexe as colunas de dono/tenant usadas em toda consulta e nas policies de RLS. `pg_stat_statements` mostra as consultas mais caras e repetidas.

## 11. Timeouts e migrations seguras (API-05, OPS-04)

```sql
ALTER ROLE app_user SET statement_timeout = '15s';
ALTER ROLE app_user SET idle_in_transaction_session_timeout = '30s';

-- em migrations: não bloquear a tabela por muito tempo
SET lock_timeout = '3s';
ALTER TABLE orders ADD COLUMN notes text;                     -- rápido (sem default volátil)
CREATE INDEX CONCURRENTLY orders_status_idx ON orders (status); -- fora de transação

-- expand/contract para renomear: adicionar nova coluna → escrever nas duas → migrar dados
-- → ler da nova → remover a antiga num deploy posterior
```

Antes de migrations arriscadas: snapshot/backup e teste numa cópia com volume real.

## 12. MySQL

- Dinheiro: `DECIMAL(19,4)` ou `BIGINT`; nunca `FLOAT`/`DOUBLE`.
- Datas: `DATETIME` não guarda fuso; grave em UTC e documente (ou `TIMESTAMP`, que converte pelo fuso da sessão — defina `time_zone = '+00:00'`).
- `INSERT IGNORE` / `INSERT ... ON DUPLICATE KEY UPDATE` no lugar de `ON CONFLICT`.
- `SELECT ... FOR UPDATE` funciona com InnoDB; `CHECK` constraints só são aplicadas a partir do MySQL 8.0.16.
- Sem RLS nativo: a autorização por dono fica obrigatoriamente na aplicação (API-01) ou em views por usuário.
- `sql_mode` com `STRICT_ALL_TABLES` para não truncar dados silenciosamente.

## 13. Firebase (Firestore e Storage)

```
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /users/{userId}/orders/{orderId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId
                    && request.resource.data.keys().hasOnly(['items', 'address', 'createdAt'])
                    && request.resource.data.items.size() <= 50;
      allow update, delete: if false; // alterações de status só pelo servidor (Admin SDK)
    }
    match /{document=**} { allow read, write: if false; } // nega todo o resto
  }
}

// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{fileName} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

- `allow read, write: if true;` e `if request.auth != null;` sem checar o dono são as causas mais comuns de vazamento (caso Tea).
- Teste as regras com o Firebase Emulator e `@firebase/rules-unit-testing`.
- Ative o App Check para dificultar abuso da configuração pública.
