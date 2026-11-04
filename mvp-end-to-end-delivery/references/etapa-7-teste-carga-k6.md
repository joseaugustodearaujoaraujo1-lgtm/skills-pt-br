# Etapa 7 — Teste de carga com k6

**Objetivo:** descobrir até onde o sistema escala, onde ele quebra primeiro e se cumpre as metas dos requisitos (RNF), com números.

**Esta etapa gera tráfego em servidores. Exija confirmação explícita, ambiente e janela definidos.**

## 7.0 Regras legais e éticas

- Teste **somente sistemas seus ou com autorização escrita** do responsável. Gerar carga em terceiros pode configurar infração contratual e, conforme o caso, crime (ver skill `dev-legal-compliance-br`).
- Prefira **staging** equivalente à produção. Se for produção, combine janela, tenha plano de parada e comunique a equipe.
- Verifique a política de uso aceitável do provedor e do Cloudflare; testes pesados podem acionar proteções contra DDoS ou gerar custos. Quando necessário, avise o provedor e libere o IP/cabeçalho do teste.
- Use **dados sintéticos**; não use dados pessoais reais.
- Nunca teste o gateway de pagamento real; use sandbox. Nunca dispare e-mails/SMS reais em massa.
- Defina um **botão de parada** (abortar com `Ctrl+C` ou `thresholds` com `abortOnFail`).

## 7.1 Instalação

```bash
# Windows (winget)    winget install k6 --source winget
# macOS (brew)        brew install k6
# Linux (apt)         siga https://grafana.com/docs/k6/latest/set-up/install-k6/
k6 version
```

## 7.2 Tipos de teste (execute nesta ordem)

| Tipo | Objetivo | Perfil | Duração típica |
|------|----------|--------|----------------|
| **Smoke** | O script e o sistema funcionam | 1–2 VUs | 1 min |
| **Load (média)** | Comportamento na carga esperada | Sobe até a carga alvo e mantém | 10–20 min |
| **Stress** | Onde começa a degradar | Acima da carga alvo, em degraus | 15–30 min |
| **Spike** | Picos súbitos (promoção, campanha) | Salto rápido e retorno | 5–10 min |
| **Soak** | Vazamento de memória/conexões | Carga moderada por horas | 2–8 h |
| **Breakpoint** | Capacidade máxima | Taxa crescente até falhar | até quebrar |

## 7.3 Definição das metas (vem da Etapa 1)

Converta RNF em *thresholds*:

```
p(95) das rotas de leitura < 500 ms
p(99) < 1500 ms
Taxa de erro HTTP < 1 %
Checkout: p(95) < 1500 ms, erros < 0,5 %
Throughput alvo: 50 req/s sustentados
```

Estime a carga com a Lei de Little: `VUs ≈ chegadas/s × tempo médio por sessão (s)`. Prefira **executores por taxa de chegada** (`ramping-arrival-rate`) a "N usuários", porque refletem melhor o tráfego real e não escondem lentidão (modelo aberto).

## 7.4 Script base (`load-tests/loja.js`)

```js
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL;
if (!BASE_URL) throw new Error('Defina BASE_URL (apenas ambiente próprio ou autorizado)');

const businessErrors = new Rate('business_errors');
const checkoutTime = new Trend('checkout_duration', true);

export const options = {
  scenarios: {
    browse: {
      executor: 'ramping-arrival-rate',
      startRate: 5, timeUnit: '1s', preAllocatedVUs: 50, maxVUs: 500,
      stages: [
        { target: 20, duration: '2m' },
        { target: 50, duration: '5m' },
        { target: 0, duration: '1m' },
      ],
      exec: 'browse',
    },
    purchase: {
      executor: 'constant-arrival-rate',
      rate: 2, timeUnit: '1s', duration: '8m', preAllocatedVUs: 20, maxVUs: 100,
      exec: 'purchase',
    },
  },
  thresholds: {
    http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true, delayAbortEval: '30s' }],
    'http_req_duration{scenario:browse}': ['p(95)<500', 'p(99)<1500'],
    checkout_duration: ['p(95)<1500'],
    business_errors: ['rate<0.01'],
  },
};

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export function setup() {
  // cria/usa usuário de teste em staging; nunca dados reais
  const res = http.post(`${BASE_URL}/auth/login`,
    JSON.stringify({ email: __ENV.TEST_USER, password: __ENV.TEST_PASS }), { headers: JSON_HEADERS });
  check(res, { 'login 200': (r) => r.status === 200 });
  return { token: res.json('accessToken') };
}

export function browse() {
  group('home e catálogo', () => {
    const r = http.get(`${BASE_URL}/products?page=1&limit=20`, { tags: { name: 'GET /products' } });
    const ok = check(r, { 'status 200': (x) => x.status === 200, 'tem itens': (x) => x.json('items.length') > 0 });
    businessErrors.add(!ok);
  });
  sleep(Math.random() * 2 + 1);   // tempo de leitura do usuário (think time)
}

export function purchase(data) {
  const auth = { headers: { ...JSON_HEADERS, Authorization: `Bearer ${data.token}` } };
  group('checkout', () => {
    const t0 = Date.now();
    const cart = http.post(`${BASE_URL}/cart/items`, JSON.stringify({ productId: 'sku-teste-1', qty: 1 }), auth);
    const order = http.post(`${BASE_URL}/orders`, JSON.stringify({ payment: 'sandbox' }),
      { ...auth, headers: { ...auth.headers, 'Idempotency-Key': `${__VU}-${__ITER}-${Date.now()}` } });
    const ok = check(order, { 'pedido criado': (x) => x.status === 201 }) && cart.status < 400;
    businessErrors.add(!ok);
    checkoutTime.add(Date.now() - t0);
  });
  sleep(1);
}
```

Boas práticas do script:

- **Parametrização** por variáveis de ambiente (`-e`), nunca segredos no arquivo.
- **Think time** realista (`sleep`) e mistura de cenários conforme o tráfego real (ex.: 90 % navegação, 8 % carrinho, 2 % compra).
- **`tags: { name: ... }`** para agrupar URLs dinâmicas e não explodir a cardinalidade de métricas.
- **`check`** valida o conteúdo, não apenas o status.
- Dados de teste únicos por VU/iteração (e-mails, chaves de idempotência); limpeza posterior no staging.
- Simule também **erros esperados** (404, validação) em pequena proporção.

## 7.5 Execução

```bash
# Fumaça
k6 run -e BASE_URL=https://staging-api.exemplo.com/api/v1 -e TEST_USER=... -e TEST_PASS=... --vus 2 --duration 1m load-tests/loja.js

# Carga completa com resumo em JSON e métricas brutas
k6 run -e BASE_URL=... --summary-export=docs/07-carga/resumo.json --out json=docs/07-carga/bruto.json load-tests/loja.js

# Visualização opcional: Grafana + InfluxDB/Prometheus, ou k6 Cloud/Grafana Cloud (pode haver custo: pergunte antes)
```

Defina `TEST_USER`/`TEST_PASS` no terminal do usuário (não cole no chat). Observe o servidor durante o teste (CPU, memória, conexões do banco, filas, 5xx).

## 7.6 Interpretação dos resultados

Métricas-chave: `http_req_duration` (p50/p95/p99), `http_req_failed`, `http_reqs` (RPS), `iterations`, `dropped_iterations` (indica que o sistema não acompanhou a taxa — saturação), `vus_max`.

Diagnóstico por sintoma:

| Sintoma | Causa provável | Ação |
|---------|----------------|------|
| p95 sobe linearmente com a carga | Gargalo de CPU ou consulta lenta | Perfilar; adicionar índices; cache; otimizar N+1 |
| Erros 5xx / timeouts em patamar | Pool de conexões esgotado, memória | Ajustar pool, escalar instâncias, filas |
| 429 em excesso | Rate limit (API ou Cloudflare) bloqueando o teste | Liberar IP/cabeçalho de teste; revisar limites |
| `dropped_iterations` > 0 | Sistema saturou | Reduzir carga ou escalar; achar o gargalo |
| Latência boa e erros 0, mas banco a 90 % CPU | Banco é o próximo gargalo | Réplica de leitura, cache, otimização |
| Piora ao longo de horas (soak) | Vazamento de memória/conexões | Analisar *heap*, *connection leaks* |
| Picos periódicos | GC, *cron jobs*, backups | Reagendar tarefas, ajustar GC |

Regra: **mude uma variável por vez** e repita o teste; registre cada rodada.

## 7.7 Relatório de capacidade (`docs/07-carga/relatorio.md`)

```
# Relatório de carga — <Sistema> — <data>
1. Ambiente (staging/produção, specs, versão, região, Cloudflare ligado?)
2. Metas e thresholds (da Etapa 1)
3. Cenários e perfil de carga (taxas, duração, mix)
4. Resultados (tabela: cenário, RPS, p50/p95/p99, erro %, ok/nok)
5. Capacidade medida (ex.: 120 req/s com p95 < 500 ms; degrada acima de 180 req/s)
6. Gargalos encontrados e evidência
7. Correções aplicadas e novo resultado (antes/depois)
8. Recomendações de escala (vertical/horizontal, cache, banco, CDN)
9. Riscos residuais e próximos testes
```

Seja honesto: se não houve ambiente equivalente à produção, diga que o resultado é **indicativo**, não garantia.

## 7.8 Critério de pronto

- [ ] Smoke, load e stress executados (spike/soak conforme o risco).
- [ ] Thresholds atingidos ou gargalos documentados com plano.
- [ ] Capacidade máxima sustentável registrada com margem de segurança (operar normalmente abaixo de ~60–70 % do limite).
- [ ] Scripts versionados em `load-tests/`; instruções para repetir.
- [ ] Relatório entregue com resultados reais (nunca invente números).
