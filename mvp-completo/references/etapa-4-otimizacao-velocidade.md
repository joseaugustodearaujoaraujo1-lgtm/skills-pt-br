# Etapa 4 — Otimização de velocidade

**Objetivo:** deixar o MVP rápido para o usuário real (carregamento, resposta da API e consultas ao banco) **antes** de documentar, publicar e submeter à carga. Velocidade é requisito, não polimento final.

**Entrada:** API implementada e testada (Etapa 3) e, se houver, o front-end montado conforme o design (Etapa 2). **Saída:** `docs/04-performance.md` com métricas antes/depois, checklist preenchido e pendências.

**Ferramenta principal:** a skill **`velocidade-sistema`** (checklist de 31 técnicas). Carregue-a ao iniciar esta etapa e siga o método dela: entender a stack, medir a linha de base, auditar, priorizar por impacto ÷ esforço, implementar em passos pequenos e medir de novo. Se ela não estiver instalada, avise o usuário e use o mínimo da seção 4.6.

## 4.1 Escopo por tipo de projeto

| Tipo de projeto | O que aplicar do checklist |
|---|---|
| Site estático / landing page | Front-end (itens 1–14), CDN (26) e medição (29–31); pule API e banco |
| API para terceiros | API e back-end (15–21), banco (22–25) e medição (29–31); pule front-end |
| Loja virtual / SaaS | Todas as áreas, começando pelos ganhos grandes e baratos |
| Sistema interno | O que a carga e o público justificarem; registre o que foi dispensado e por quê |

Marque ➖ (não se aplica) com motivo; não aplique item que não faz sentido para a stack.

## 4.2 Linha de base (meça antes de mudar)

- Rode Lighthouse/PageSpeed, ou Playwright com *throttling* de CPU e rede, em **ambiente local ou de staging**.
- Anote **LCP, INP, CLS, TTFB e o tamanho do JavaScript** de cada página crítica (home, listagem, detalhe, carrinho/checkout, login).
- Na API, anote o tempo de resposta das rotas principais e o número de consultas ao banco por requisição.
- Salve tudo em `docs/04-performance.md` na seção "Antes".

Não meça sistemas de terceiros nem gere tráfego em produção nesta etapa. O teste de carga é a Etapa 7.

## 4.3 Metas (orçamento de performance)

Use o orçamento definido na Etapa 2. Se não houver, adote como ponto de partida as metas de Core Web Vitals, no percentil 75 dos usuários reais:

| Métrica | Meta |
|---|---|
| LCP | ≤ 2,5 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0,1 |
| TTFB | ≤ 800 ms |

Registre a meta de cada rota da API (ex.: p95 ≤ 300 ms em leituras simples). Ela alimenta os limiares do k6 na Etapa 7.

## 4.4 Auditoria e priorização

1. Preencha o checklist de 31 itens da skill: ✅ feito, ⚠️ parcial, ❌ falta, ➖ não se aplica, sempre com o arquivo ou trecho onde o problema aparece.
2. Priorize por **impacto ÷ esforço**. Costumam vir primeiro: imagens em WebP/AVIF com dimensões, compressão Brotli/GZIP, cache de estáticos, scripts de terceiros depois da página, N+1 e índices no banco.
3. Mostre a lista priorizada ao usuário **antes** de implementar itens grandes.

## 4.5 Implementação

- Faça mudanças pequenas, agrupadas por tema, e **meça de novo depois de cada grupo**.
- Preserve a stack e as convenções do projeto; sem dependências "para o futuro".
- **Segurança e jurídico continuam valendo:** cache nunca guarda dados pessoais ou respostas autenticadas em área pública (CDN/Redis); invalide por usuário; scripts de terceiros (analytics, chat, pixels) só depois do consentimento aplicável (veja `judicial-sistema`).
- **Itens que criam custo ou conta externa** exigem confirmação específica antes: Redis gerenciado, CDN, load balancer, mais instâncias, OpenTelemetry/RUM em serviço pago. Descreva o efeito e o custo e só então prossiga.
- Credenciais e tokens desses serviços nunca vêm pelo chat: o usuário os coloca em variáveis de ambiente.

## 4.6 Mínimo se a skill não estiver instalada

Aplique, nesta ordem: (1) imagens otimizadas com `width`/`height` e `loading="lazy"` abaixo da dobra; (2) compressão e cache de estáticos com `Cache-Control` e hash no nome do arquivo; (3) JavaScript dividido por página e sem dependências não usadas; (4) scripts de terceiros com `defer`/`async`; (5) paginação, `Promise.all` em chamadas independentes e timeout em APIs externas; (6) sem consultas N+1, com índices conferidos por `EXPLAIN` e pool de conexões; (7) teste em rede lenta e CPU limitada.

## 4.7 Critério de pronto e portão

- [ ] Linha de base e métricas finais registradas em `docs/04-performance.md`.
- [ ] Checklist preenchido, com evidência (arquivo/trecho) para cada item marcado como feito.
- [ ] Metas atingidas, ou lista de gargalos restantes com plano e responsável.
- [ ] Nenhum cache expõe dados pessoais; custos e contas externas aprovados.
- [ ] Diferencie: *medido*, *implementado*, *verificado*, *pendente*.

Peça aprovação antes da Etapa 5 (documentação da API).
