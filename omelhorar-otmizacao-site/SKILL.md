---
name: "omelhorar-otmizacao-site"
description: "Use ao auditar ou otimizar a velocidade de um site/app web (front-end, API, banco, infra): aplica o checklist de 31 técnicas de performance."
---

# Otimizar performance de site/app

Use esta skill quando o usuário pedir para deixar um site ou app mais rápido, auditar performance, revisar código pensando em velocidade, ou quando estiver construindo um projeto novo e quiser seguir boas práticas desde o início.

## Como trabalhar

1. **Entenda o projeto primeiro.** Identifique a stack (framework front-end, back-end, banco, hospedagem) lendo o código, `package.json`, configs de build e deploy. Não aplique itens que não fazem sentido para a stack (ex.: pool de conexões num site estático).
2. **Meça antes de mudar.** Se possível, rode Lighthouse/PageSpeed (ou Playwright com throttling de CPU e rede) e anote LCP, INP, CLS, TTFB e tamanho do bundle. Isso vira a linha de base.
3. **Audite com o checklist abaixo.** Para cada item, marque: ✅ já feito, ⚠️ parcial, ❌ falta, ➖ não se aplica. Aponte o arquivo/trecho onde o problema aparece.
4. **Priorize por impacto ÷ esforço.** Comece pelos ganhos grandes e baratos (imagens, compressão, cache, CDN, scripts de terceiros, índices no banco, N+1).
5. **Implemente em passos pequenos** e meça de novo depois de cada grupo de mudanças.
6. **Entregue um relatório curto:** antes/depois das métricas, o que foi feito, o que ficou pendente e por quê.

## Checklist (31 itens)

### Interface e carregamento (front-end)
1. **Telas skeleton** — mostrar o esqueleto do layout enquanto o conteúdo carrega, em vez de spinner em tela branca.
2. **Imagens em WebP ou AVIF** — converter e servir com `<picture>`/fallback; definir `width`/`height` para evitar CLS.
3. **Lazy load de imagens abaixo da dobra** — `loading="lazy"`; nunca na imagem principal (LCP), que deve ter prioridade alta.
4. **UI otimista** — atualizar a interface antes da resposta do servidor (curtir, adicionar ao carrinho) e reverter se der erro.
5. **Streaming de respostas de IA** — transmitir token por token (SSE/streams) em vez de esperar a resposta completa.
6. **Debounce na busca e autocomplete** — esperar uma pausa na digitação (~250–400 ms) antes de chamar a API.
7. **Renderizar no servidor ou no build** — SSR/SSG para páginas de conteúdo; evitar depender só de renderização no cliente.
8. **Scripts de terceiros depois da página** — chat, analytics, pixels com `defer`/`async` ou carregados após o load/interação.
9. **Dividir o JavaScript por página** — code splitting e imports dinâmicos; nada de um `app.js` gigante.
10. **Remover dependências não utilizadas** — revisar o bundle (ex.: analyzer), trocar libs pesadas, tirar polyfills antigos.
11. **Virtualizar listas longas** — renderizar só os itens visíveis.
12. **Evitar renderizações desnecessárias** — memoização, estado no lugar certo, seletores granulares.
13. **Hospedar fontes e limitar pesos** — servir do próprio domínio, usar só os pesos necessários, `font-display: swap`, preload da fonte principal.
14. **Cache do navegador para estáticos** — `Cache-Control` longo com arquivos versionados por hash.

### API e back-end
15. **Evitar chamadas duplicadas à API** — deduplicar/cachear no cliente (ex.: React Query/SWR); um único `GET /user` compartilhado.
16. **Paginar resultados** — nunca retornar listas inteiras; usar limite + cursor/offset.
17. **Requisições independentes em paralelo** — `Promise.all` em vez de `await` em sequência.
18. **Tempo limite em APIs externas** — timeout + fallback/retry para não travar o fluxo (ex.: cálculo de frete).
19. **Tarefas lentas em fila em segundo plano** — PDF, e-mail, relatórios via fila/worker; responder ao usuário na hora.
20. **Compressão Brotli ou GZIP** — ativar no servidor/CDN para HTML, JS, CSS e JSON.
21. **Redis como cache dos dados mais acessados** — com TTL e invalidação claros.

### Banco de dados
22. **Corrigir consultas N+1** — usar joins, `include`/eager loading ou batch.
23. **Índices para consultas frequentes** — verificar com `EXPLAIN` as colunas usadas em `WHERE`, `JOIN` e `ORDER BY`.
24. **Selecionar só as colunas necessárias** — evitar `SELECT *`.
25. **Reutilizar conexões (pool)** — não abrir conexão nova a cada requisição; atenção a ambientes serverless.

### Infraestrutura
26. **Estáticos por CDN** — JS, CSS, imagens e fontes servidos perto do usuário.
27. **Servidor perto do banco** — mesma região/rede privada.
28. **Distribuir tráfego entre instâncias** — load balancer com várias instâncias do app quando a carga pedir.

### Medição
29. **Rastrear requisições lentas com OpenTelemetry** — traces para ver onde o tempo é gasto (auth, query, API externa, render).
30. **Monitorar a velocidade real dos usuários** — RUM / Core Web Vitals, olhando o p75 e não só a média.
31. **Testar em celulares básicos e redes lentas** — throttling de CPU e rede (ex.: 3G) no DevTools/Playwright.

## Formato do relatório de auditoria

```
## Métricas (antes)
LCP · INP · CLS · TTFB · tamanho do JS

## Prioridades
1. [item] — problema encontrado (arquivo) — ganho esperado — esforço
...

## Checklist
| # | Item | Status | Observação |

## Depois das mudanças
Métricas novas e o que ficou pendente
```

Escreva em português, de forma direta. Não diga que um item foi feito sem mostrar onde.
