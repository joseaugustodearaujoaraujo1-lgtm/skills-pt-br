# Etapa 4 — Documentação da API

**Objetivo:** permitir que outra pessoa (front-end, parceiro, auditor, você daqui a 6 meses) use e opere a API sem ler o código.

**Entrada:** API implementada e testada. **Saída:** `docs/04-api/` e interface navegável.

## 4.1 Fonte única da verdade: OpenAPI 3.1

- Escreva `openapi.yaml` (ou gere a partir do código com cuidado: spec gerada não revisada costuma ficar incompleta).
- Estrutura mínima: `info`, `servers` (local, staging, produção), `tags`, `paths`, `components` (`schemas`, `securitySchemes`, `responses`, `parameters`, `examples`).
- Cada operação deve ter: `operationId` único, resumo, descrição, parâmetros, `requestBody` com exemplos, **todas** as respostas (200/201, 400, 401, 403, 404, 409, 422, 429, 500), `security`.
- Reutilize `components` para evitar duplicação; use `$ref`.
- Esquemas de resposta **sem campos internos** (ex.: `passwordHash`).

Esqueleto:

```yaml
openapi: 3.1.0
info:
  title: API da Loja
  version: 1.0.0
  description: API REST do MVP. Autenticação por Bearer JWT.
servers:
  - url: https://api.exemplo.com/api/v1
    description: Produção
  - url: https://staging-api.exemplo.com/api/v1
    description: Staging
security:
  - bearerAuth: []
paths:
  /products:
    get:
      operationId: listProducts
      tags: [Produtos]
      summary: Lista produtos
      security: []                       # rota pública
      parameters:
        - { name: page, in: query, schema: { type: integer, minimum: 1, default: 1 } }
        - { name: limit, in: query, schema: { type: integer, minimum: 1, maximum: 50, default: 20 } }
      responses:
        '200':
          description: Lista paginada
          content:
            application/json:
              schema: { $ref: '#/components/schemas/ProductPage' }
        '429': { $ref: '#/components/responses/TooManyRequests' }
components:
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }
  responses:
    TooManyRequests:
      description: Limite de requisições excedido
      headers:
        Retry-After: { schema: { type: integer } }
      content:
        application/json:
          schema: { $ref: '#/components/schemas/Error' }
  schemas:
    Error:
      type: object
      required: [error]
      properties:
        error:
          type: object
          required: [code, message]
          properties:
            code: { type: string, example: RATE_LIMITED }
            message: { type: string }
            requestId: { type: string }
```

## 4.2 Guia de uso (`guia.md`)

Escreva como tutorial, com comandos executáveis:

1. **Visão geral** e URL base por ambiente.
2. **Início rápido:** cadastro → login → primeira chamada autenticada (`curl` e `fetch`).
3. **Autenticação:** fluxo de *access* + *refresh*, expiração, como renovar, como sair.
4. **Convenções:** formato de datas (ISO 8601 UTC), valores monetários em centavos, paginação, filtros, ordenação, idempotência (`Idempotency-Key`).
5. **Limites:** rate limit por rota, tamanho de payload, cabeçalhos `RateLimit-*`/`Retry-After`.
6. **Versionamento e depreciação:** política (ex.: aviso com 90 dias; `Sunset` header).
7. **Webhooks:** eventos, assinatura, repetição e como validar.
8. **Privacidade:** endpoints de direitos do titular e retenção.
9. **Boas práticas de segurança para consumidores** (guardar tokens, não registrar dados sensíveis).

## 4.3 Catálogo de erros (`erros.md`)

Tabela com `code`, HTTP status, significado, ação recomendada ao cliente e se é reintentável. Exemplo: `VALIDATION_ERROR (422)`, `UNAUTHENTICATED (401)`, `FORBIDDEN (403)`, `NOT_FOUND (404)`, `CONFLICT (409)`, `RATE_LIMITED (429)`, `INTERNAL (500)`.

## 4.4 Interface navegável

- **Swagger UI** ou **Redoc** servidos a partir do `openapi.yaml`.
- Em produção, proteja ou limite a documentação se ela expuser rotas administrativas; **nunca** publique chaves ou exemplos com dados reais.
- Opcional: coleção Postman/Insomnia gerada da spec e SDK mínimo para o front.

## 4.5 Qualidade da documentação

```bash
npx @stoplight/spectral-cli lint docs/04-api/openapi.yaml    # lint da spec
npx @redocly/cli lint docs/04-api/openapi.yaml               # alternativa
```

- **Teste de contrato:** valide respostas reais contra o schema (ex.: `jest-openapi`, `schemathesis`, `dredd`).
- **Exemplos executáveis:** rode cada exemplo do guia contra o ambiente de staging; corrija o que falhar.
- **Revisão cruzada:** compare rotas reais com a spec (rotas fantasmas ou não documentadas são risco de segurança — API9).
- **Changelog** (`CHANGELOG.md`, formato *Keep a Changelog*) a cada versão.

## 4.6 README do repositório

Inclua: propósito, requisitos, como instalar, variáveis de ambiente (referência ao `.env.example`), como rodar, testar, migrar banco, estrutura de pastas, como contribuir, como reportar vulnerabilidades (`SECURITY.md`), licença.

## 4.7 Runbook operacional curto (`05-deploy.md` começa aqui)

Como subir, reverter (*rollback*), rotacionar segredos, restaurar backup, contato de incidentes, onde ficam logs e métricas.

## 4.8 Critério de pronto e portão

- [ ] `openapi.yaml` válida (lint sem erros) e cobrindo 100 % das rotas públicas do MVP.
- [ ] Exemplos de requisição/resposta testados em staging.
- [ ] Autenticação, limites, erros, paginação e idempotência documentados.
- [ ] Interface navegável publicada (com proteção adequada).
- [ ] README, `.env.example`, `SECURITY.md` e CHANGELOG presentes.

Peça aprovação antes da Etapa 5 (que envolve publicação e alterações externas).
