# 04 · Pagamentos e sistemas financeiros

Vale para qualquer sistema que mexe com dinheiro ou algo equivalente: e-commerce, assinaturas, carteiras, saldo, cashback, pontos, créditos de uso, Pix, boletos, cartões, marketplaces com repasse, bancos e fintechs.

Aqui o erro não gera só bug: gera prejuízo direto, cobrança indevida, problema regulatório e perda de confiança. Sugira nível 2 (rigoroso) para estes sistemas.

Princípios: **dinheiro é exato, toda operação pode se repetir, todo saldo precisa ser explicável e toda credencial pode vazar.**

## Sumário
- FIN-01 Dinheiro em float
- FIN-02 Race condition no saldo (double spend)
- FIN-03 Pagamento sem chave de idempotência
- FIN-04 Webhook processado duas vezes
- FIN-05 Saldo como campo editável, sem ledger
- FIN-06 Sem conciliação
- FIN-07 Arredondamento e divisão de centavos
- FIN-08 Estados de pagamento mal modelados
- FIN-09 Credenciais internas e de fornecedores como ponto único
- FIN-10 Sem limites nem detecção de anomalias
- FIN-11 Trilha de auditoria editável ou inexistente
- FIN-12 Datas de corte, dias úteis e fuso
- FIN-13 LGPD e dados pessoais em excesso

---

## FIN-01 · Dinheiro em float
**Gravidade:** Crítico

**Por que importa:** `float`/`double` usam binário e não representam valores como 0,10 exatamente (`0.1 + 0.2 = 0.30000000000000004`). Os erros se acumulam em somas, juros e conversões; totais deixam de bater na conciliação.

**Como detectar:** colunas `FLOAT`, `REAL`, `DOUBLE` para valores; `parseFloat` / `Number()` / `float()` / `double` em preço, saldo, taxa; `toFixed` usado para "corrigir" contas; `Math.round(valor * 100) / 100` espalhado pelo código.

**Como corrigir:**
1. Guarde valores como **inteiro na menor unidade** (centavos: `BIGINT`) ou como **decimal exato** (`NUMERIC(19,4)` no Postgres, `DECIMAL` no MySQL).
2. No código, use inteiros ou tipo decimal: `BigInt`/inteiros ou `decimal.js`/`dinero.js` (JS), `Decimal` (Python), `BigDecimal` (Java), `decimal` (C#), `shopspring/decimal` (Go), `brick/money` (PHP).
3. Guarde sempre a moeda junto do valor (`amount_cents`, `currency = 'BRL'`).
4. Converta para texto com vírgula e R$ só na exibição (`Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`).
5. Em APIs, trafegue centavos inteiros ou strings decimais, nunca float em JSON.

**Como testar:** some 0,10 dez vezes e confira 1,00 exato; teste conversões ida e volta (exibição → valor → exibição).

---

## FIN-02 · Race condition no saldo (double spend / TOCTOU)
**Gravidade:** Crítico

**Por que importa:** o padrão "ler saldo → checar se dá → debitar" falha quando duas requisições chegam ao mesmo tempo: as duas leem R$ 100, as duas aprovam um saque de R$ 100, e o saldo fica −R$ 100. É uma das falhas mais pagas em programas de bug bounty (saques, cupons, gift cards, limites).

**Como detectar:** código que faz `SELECT saldo` e depois `UPDATE saldo = novo_valor` calculado na aplicação; checagens de limite/uso único feitas em memória; ausência de constraint `CHECK (saldo >= 0)`; cupons sem `UNIQUE (cupom_id, user_id)`.

**Como corrigir (escolha conforme o caso):**
1. **UPDATE atômico condicional:** `UPDATE contas SET saldo = saldo - :valor WHERE id = :id AND saldo >= :valor` e confira se 1 linha foi afetada; se 0, saldo insuficiente.
2. **Lock pessimista:** `SELECT ... FOR UPDATE` dentro de uma transação antes de checar e debitar.
3. **Constraints como rede de segurança:** `CHECK (saldo >= 0)`, `UNIQUE` para uso único.
4. **Ledger com versão (lock otimista):** grave a versão esperada e rejeite se mudou.
5. Para transferências entre duas contas, trave as linhas sempre na mesma ordem (por ID) para evitar deadlock.

**Como testar:** dispare 20 requisições simultâneas de saque do saldo inteiro (Promise.all, `xargs -P`, k6, ou o "send group in parallel" do Burp/Caido no seu próprio ambiente); só uma deve passar e o saldo nunca deve ficar negativo.

---

## FIN-03 · Pagamento sem chave de idempotência
**Gravidade:** Crítico

**Por que importa:** a cobrança dá certo, mas a resposta se perde por timeout; o app (ou o usuário) tenta de novo e o cliente é cobrado duas vezes.

**Como corrigir:**
1. Gere uma chave por **intenção de pagamento** (ex.: id do pedido + tentativa) e envie em `Idempotency-Key` ao provedor (Stripe, Adyen, Mercado Pago, Pagar.me e outros aceitam). Para Pix, use o `txid` único da cobrança.
2. No seu servidor, também deduplique: tabela `idempotency_keys (key UNIQUE, request_hash, response, status)`; repetição com a mesma chave devolve a resposta salva.
3. Antes de tentar de novo depois de um timeout, consulte o status da cobrança no provedor.

**Como testar:** simule timeout depois de criar a cobrança e repita a chamada; só uma cobrança deve existir no provedor.

---

## FIN-04 · Webhook processado duas vezes
**Gravidade:** Crítico

**Por que importa:** provedores entregam webhooks **pelo menos uma vez**: se sua resposta demorar ou falhar, reenviam. Sem deduplicação, um `payment.succeeded` repetido credita duas vezes, libera dois produtos ou envia dois e-mails.

**Como corrigir:**
1. Verifique a assinatura (API-18).
2. Tabela `processed_events (provider, event_id, PRIMARY KEY (provider, event_id))`; insira o ID **na mesma transação** que aplica o efeito; se der violação de chave, é repetição → responda 200 e não faça nada.
3. Torne o efeito idempotente por natureza quando possível (ex.: "marcar pedido 42 como pago" em vez de "somar crédito").
4. Responda 2xx rápido e processe em fila; eventos podem chegar fora de ordem, então confira o estado atual antes de aplicar (FIN-08).

**Como testar:** reenvie o mesmo evento 3 vezes (inclusive em paralelo); o efeito deve acontecer uma vez.

---

## FIN-05 · Saldo como campo editável, sem ledger
**Gravidade:** Alto

**Por que importa:** com só uma coluna `saldo` que recebe `UPDATE`, não dá para explicar de onde veio uma diferença, auditar, estornar com segurança nem reconstruir o histórico depois de um bug.

**Como corrigir:**
1. **Ledger de dupla entrada:** cada movimentação gera lançamentos que somam zero (débito numa conta, crédito noutra), em tabela **append-only** (nunca `UPDATE`/`DELETE`; correções são novos lançamentos de estorno).
2. Saldo é derivado da soma dos lançamentos (ou um cache atualizado na mesma transação e verificável contra a soma).
3. Cada lançamento referencia a operação de origem (pedido, transferência, taxa) e tem chave de idempotência.
4. Restrinja permissões no banco: a aplicação só pode inserir na tabela de lançamentos.

**Como testar:** job diário que compara saldo em cache com a soma dos lançamentos e alerta divergências; a soma de todos os lançamentos do sistema deve ser zero.

---

## FIN-06 · Sem conciliação
**Gravidade:** Alto

**Por que importa:** o que o seu sistema registra e o que o banco/PSP realmente liquidou divergem (falhas de webhook, estornos, chargebacks, taxas). Sem conciliação, a diferença cresce por meses até alguém notar.

**Como corrigir:** importar diariamente extratos/relatórios do PSP e do banco; casar cada transação por ID; classificar diferenças (faltando de um lado, valor diferente, status diferente); fila de pendências com responsável; alertas para divergências acima de um limite.

---

## FIN-07 · Arredondamento e divisão de centavos
**Gravidade:** Médio

**Por que importa:** R$ 100,00 em 3 parcelas não fecha (33,33 × 3 = 99,99). Arredondar em cada etapa de um cálculo de juros dá resultado diferente de arredondar no final. Split de marketplace perde ou cria centavos.

**Como corrigir:** calcule com precisão total e arredonde **uma vez**, no ponto definido pela regra; ao dividir, distribua o resto (ex.: 33,34 + 33,33 + 33,33) com algoritmo de alocação; documente o modo de arredondamento (meio para cima, bancário) e use o mesmo em todo o sistema; siga a regra contratual/regulatória quando houver.

**Como testar:** a soma das partes sempre é igual ao total, para vários valores e números de partes (teste baseado em propriedades).

---

## FIN-08 · Estados de pagamento mal modelados
**Gravidade:** Alto

**Por que importa:** só "pago/não pago" não representa a realidade: pendente, autorizado, capturado, falhou, expirado, estornado parcialmente, estornado, contestado (chargeback). Eventos chegam fora de ordem (o `refunded` antes do `paid`). O sistema libera produto de pagamento que depois falhou.

**Como corrigir:** máquina de estados explícita com as transições permitidas (ex.: `pending → paid → partially_refunded → refunded`); rejeitar transições inválidas; usar o estado do provedor como fonte e guardar o histórico de transições; liberar produto só em estado final de sucesso; tratar expiração de cobranças Pix/boletos.

**Como testar:** testes para cada transição válida e inválida; eventos fora de ordem não podem levar a estado errado.

---

## FIN-09 · Credenciais internas e de fornecedores como ponto único de falha
**Gravidade:** Crítico

**Por que importa:** os maiores incidentes do sistema financeiro brasileiro em 2025 não exploraram bug de código: usaram credenciais legítimas. C&M Software (jun./jul. 2025): credencial de um operador, vendida por um funcionário, deu acesso às contas reserva de instituições no Banco Central, com desvio estimado em centenas de milhões de reais. Sinqia (ago. 2025): credenciais de fornecedores legítimos usadas para desviar cerca de R$ 710 milhões.

**Como corrigir:**
1. **MFA forte** (chave física/FIDO2 ou app) para todo acesso administrativo e operacional, inclusive de fornecedores.
2. **Menor privilégio:** cada pessoa e sistema só acessa o que precisa; acessos temporários (just-in-time) para operações críticas.
3. **Segregação de funções:** quem cria uma operação crítica não aprova (regra de quatro olhos acima de um valor).
4. Acesso de terceiros por canais dedicados, com IP restrito, sessão gravada e revogação imediata.
5. Monitoramento de comportamento: horário incomum, volume incomum, destino novo (FIN-10).
6. Desligamento de funcionários e fim de contrato com fornecedores revogam acessos no mesmo dia.

---

## FIN-10 · Sem limites nem detecção de anomalias
**Gravidade:** Alto

**Por que importa:** sem teto de valor e de frequência, uma credencial roubada, um bug ou um script em loop movimenta tudo antes de alguém perceber.

**Como corrigir:** limites por transação, por dia e por conta (e para operações automáticas); velocity checks (muitas operações em pouco tempo, muitos destinos novos); bloqueio automático e revisão humana acima do limite; alertas em tempo real para a equipe; "kill switch" para pausar saídas.

**Como testar:** simule operações acima do limite e em rajada; devem ser bloqueadas e gerar alerta.

---

## FIN-11 · Trilha de auditoria editável ou inexistente
**Gravidade:** Alto

**Por que importa:** depois de um incidente ou de uma disputa com cliente, é preciso provar quem fez o quê, quando e de onde. Logs editáveis pela própria aplicação não provam nada.

**Como corrigir:** tabela de auditoria append-only (ou serviço externo/WORM) com usuário, ação, recurso, valores antes/depois, horário em UTC, IP e ID de correlação; a aplicação não tem permissão de `UPDATE`/`DELETE` nela; retenção conforme exigência regulatória.

---

## FIN-12 · Datas de corte, dias úteis e fuso
**Gravidade:** Médio

**Por que importa:** vencimento cai em feriado, D+1 é calculado em dias corridos, o servidor em UTC fecha o dia às 21h de Brasília, juros calculados com número errado de dias.

**Como corrigir:** calendário de dias úteis (feriados nacionais e, se preciso, municipais) mantido e atualizado; regras de negócio com fuso explícito (`America/Sao_Paulo`); horário de corte configurável; convenção de contagem de dias documentada (corridos, úteis, 30/360, 252 dias úteis); testes nas viradas de dia, mês, ano e feriados.

---

## FIN-13 · LGPD e dados pessoais em excesso
**Gravidade:** Alto

**Por que importa:** cada dado guardado é um dado que pode vazar. No caso Tea (2025), imagens de documentos guardadas de um sistema antigo foram expostas anos depois. Dados financeiros e documentos aumentam a gravidade e as obrigações legais.

**Como corrigir:** colete só o necessário (minimização); não guarde número completo de cartão (use tokenização do PSP; PCI DSS); criptografe dados sensíveis em repouso; política de retenção com exclusão automática; acesso restrito e auditado; base legal e consentimento registrados; plano de resposta a incidentes com prazo de comunicação à ANPD e aos titulares.
