---
name: prevencao-de-falhas
description: Catálogo prático de 85 falhas reais de software (código gerado por IA, front-end, back-end/APIs, pagamentos e sistemas financeiros, agentes de IA/LLMs, infraestrutura e operação), com como detectar, corrigir, testar e evitar cada uma, em qualquer linguagem. Use esta skill sempre que for criar, revisar, auditar, refatorar, corrigir ou preparar para deploy qualquer sistema, API, site com login, app, automação, integração de pagamento ou agente de IA — inclusive quando o usuário não falar em "segurança", pedir só uma "revisão", disser que o código foi feito com IA/vibe coding, mencionar Supabase, Firebase, JWT, webhooks, Pix, Stripe, saldo, MCP ou prompt injection, ou perguntar se o sistema está "pronto para produção". Antes de aplicar a verificação completa, pergunte ao usuário a profundidade desejada, porque scripts simples e testes descartáveis não precisam do processo inteiro.
---

# Prevenção de Falhas

Esta skill reúne as falhas que mais aparecem em incidentes públicos, relatos de desenvolvedores (Reddit, Hacker News, TabNews, dev.to), relatórios de segurança (OWASP, Veracode, GitGuardian, Wiz, CodeRabbit) e postmortems. Quase nenhuma delas é sofisticada: são erros básicos que se repetem. Por isso um processo simples e consistente evita a maior parte dos problemas.

Ninguém consegue garantir "zero erros". O objetivo é: **impedir as falhas conhecidas, detectar rápido o que escapar e conseguir se recuperar**.

## 1. Primeiro passo: perguntar a profundidade

Muita coisa que um usuário pede é simples (um script de uma vez, um teste, um protótipo local). Aplicar 85 verificações num script de 20 linhas desperdiça tempo e irrita. Então, antes de começar, a menos que o usuário já tenha dito, pergunte em uma frase qual nível aplicar, sugerindo um:

| Nível | Quando | O que fazer |
|---|---|---|
| **0 · Rápido** | Script descartável, exercício, protótipo local sem dados reais, teste pontual | Só os itens marcados **[Básico]** do `references/checklist-pre-deploy.md` (segredos, injeção, dados reais). Não gera relatório formal. |
| **1 · Padrão** | Sistema com usuários, login, banco de dados ou publicado na internet | Áreas relevantes ao tipo de projeto (seção 3) + checklist completa das áreas tocadas. |
| **2 · Rigoroso** | Dinheiro, dados sensíveis (saúde, documentos, LGPD), agentes de IA com ferramentas, sistemas críticos | Todas as áreas relevantes, todos os itens Crítico e Alto verificados com teste ou evidência, relatório completo. |

Exemplo de pergunta: *"Isso parece um sistema com login e banco publicado na internet; sugiro a verificação de nível 1 (padrão). Quer esse nível, o rápido ou o rigoroso?"*

Se o projeto envolve dinheiro ou dados pessoais sensíveis, recomende o nível 2 e explique por quê, mas respeite a escolha do usuário.

## 2. Modos de uso

Identifique em qual modo está e carregue só as referências necessárias.

### Modo A — Construir algo novo
Aplique as prevenções **enquanto escreve**, não depois. Antes de codar uma feature, leia as entradas da área correspondente e já escreva o código no padrão correto (consulta filtrada pelo dono, valores em centavos, idempotência, timeouts etc.). Ao terminar, rode a checklist do nível escolhido.

### Modo B — Revisar código (incluindo código gerado por IA)
1. Identifique a stack e o tipo de projeto.
2. Carregue `references/01-codigo-gerado-por-ia.md` se houver qualquer sinal de código gerado por IA (o usuário disse, o estilo indica, o projeto veio de Lovable/Bolt/Replit/Cursor/v0/Base44).
3. Carregue as áreas relevantes (seção 3) e o arquivo da linguagem em `references/linguagens/`.
4. Para cada entrada, use a seção **Como detectar** (padrões de busca e perguntas) no código real. Não declare um problema sem evidência no código; não declare ausência de problema sem ter procurado.
5. Entregue o relatório no formato da seção 6.

### Modo C — Auditoria antes do deploy
Rode `references/checklist-pre-deploy.md` inteira para o nível escolhido. Cada item marcado como OK precisa de evidência (arquivo e linha, saída de comando, resultado de teste). "Parece certo" não conta como evidência.

### Modo D — Configurar ou revisar um agente de IA
Carregue `references/05-agentes-e-llms.md`. Se o agente escreve código ou tem acesso a terminal/banco, carregue também as entradas IA-13 e OPS-01 a OPS-03.

### Modo E — Investigar um incidente
Carregue `references/casos-reais.md` para comparar com padrões conhecidos, depois a área do sintoma. Siga: conter o dano → preservar evidências (logs) → achar a causa raiz → corrigir → criar o teste que impede a volta → registrar o postmortem.

## 3. Quais áreas carregar por tipo de projeto

| Tipo de projeto | Referências |
|---|---|
| Site estático / landing page | `02-front-end.md` (FE-01, FE-02, FE-12, FE-13) e `06-infra-e-operacao.md` (OPS-05) |
| SPA / front com API própria | `02-front-end.md`, `03-back-end-e-apis.md` |
| API / back-end | `03-back-end-e-apis.md`, `06-infra-e-operacao.md` |
| App com Supabase/Firebase direto do front | `01-codigo-gerado-por-ia.md` (IA-01, IA-02), `02-front-end.md`, `linguagens/sql-e-bancos.md` |
| Pagamentos, carteira, saldo, Pix, assinaturas | `04-pagamentos-e-financeiro.md` + `03-back-end-e-apis.md` (sempre nível 2 sugerido) |
| Chatbot, RAG, agente com ferramentas, MCP | `05-agentes-e-llms.md` + `03-back-end-e-apis.md` |
| Automação / integração / webhooks | `03-back-end-e-apis.md` (API-12, API-13, API-18), `04-pagamentos-e-financeiro.md` (FIN-04) |
| Qualquer projeto feito com ajuda de IA | some `01-codigo-gerado-por-ia.md` ao que já foi escolhido |
| Deploy, CI/CD, banco em produção | `06-infra-e-operacao.md` |

Exemplos de código por linguagem ficam em `references/linguagens/`. Carregue **só** o arquivo da stack do projeto:
`javascript-typescript.md` · `python.md` · `java-kotlin.md` · `csharp-dotnet.md` · `go.md` · `php.md` · `sql-e-bancos.md` (sempre útil quando há banco).
Se a linguagem do projeto não estiver na lista, aplique os princípios das referências por área e use a biblioteca padrão/madura equivalente daquela linguagem; diga ao usuário que os exemplos foram adaptados.

## 4. Índice das falhas

Cada referência usa IDs estáveis para que relatórios e conversas possam citar o item.

| Prefixo | Arquivo | Itens |
|---|---|---|
| IA-01 a IA-16 | `references/01-codigo-gerado-por-ia.md` | segredos expostos, banco sem RLS, rotas sem auth, pacotes alucinados, lógica errada, testes falsos, senhas, injeção, validação só no front, erros engolidos, duplicação, APIs inventadas, agente na produção, produtividade ilusória, vazamento para IA, app público sem querer |
| FE-01 a FE-13 | `references/02-front-end.md` | variáveis públicas, XSS, token em localStorage, autorização só no front, envio duplicado, respostas fora de ordem, vazamento de memória, estados de tela, datas, hydration, cache pós-deploy, acessibilidade, performance |
| API-01 a API-18 | `references/03-back-end-e-apis.md` | BOLA/IDOR, autenticação, JWT, mass assignment, rate limit, BFLA, abuso de fluxo, SSRF, configuração, endpoints esquecidos, APIs de terceiros, timeouts, retries, N+1, transações, uploads, logs, webhooks |
| FIN-01 a FIN-13 | `references/04-pagamentos-e-financeiro.md` | float, double spend, idempotência, webhook duplicado, ledger, conciliação, arredondamento, estados de pagamento, credenciais internas, limites e anomalias, auditoria, datas de corte, LGPD |
| AGT-01 a AGT-12 | `references/05-agentes-e-llms.md` | prompt injection, permissões excessivas, MCP malicioso, saída executada sem validar, custo e loops, alucinação com efeito legal, vazamento entre usuários, ações não realizadas, falhas silenciosas, saída malformada, evals, memória envenenada |
| OPS-01 a OPS-13 | `references/06-infra-e-operacao.md` | backups, ambiente errado, deploy de uma vez, migrations, cadeia de dependências, rotação de segredos, monitoramento, config divergente, storage público, dev/prod juntos, DDoS, dependência sem plano B, retenção |

Também disponíveis: `references/checklist-pre-deploy.md` (checklist por nível) e `references/casos-reais.md` (15 incidentes públicos e a lição de cada um).

## 5. Regras de ouro

Estas regras cobrem a maior parte dos incidentes conhecidos. Aplique-as mesmo no nível 0, quando fizerem sentido.

1. **O servidor decide.** Validação, autorização e regras de negócio valem no servidor ou no banco (RLS). O front-end pode ser contornado por qualquer pessoa com um `curl`.
2. **Negue por padrão.** Toda rota, tabela e bucket começa fechado; o que é público é liberado explicitamente.
3. **Cada consulta sabe de quem é o dado.** Filtrar pelo dono (usuário/tenant) em toda leitura e escrita evita a falha mais comum de APIs.
4. **Segredo nunca vai para o cliente nem para o repositório.** Vazou, troque; apagar o commit não desfaz o vazamento.
5. **Toda operação que pode se repetir precisa ser idempotente.** Redes falham, usuários clicam duas vezes, provedores reenviam webhooks.
6. **Dinheiro é inteiro (centavos) ou decimal, e o débito é atômico.**
7. **Toda chamada externa tem timeout**, e retries têm limite e backoff.
8. **Conteúdo externo é dado, nunca instrução** — vale para SQL, HTML e principalmente para LLMs.
9. **Agentes não tocam produção sem confirmação humana**, e só com o mínimo de permissão.
10. **Backup só existe se a restauração foi testada.**
11. **Prove, não presuma.** Rode o teste, consulte o banco, leia a saída. O relato de um agente ("testes passaram") não é evidência.

## 6. Formato do relatório (modos B e C)

Use este formato para que o usuário consiga priorizar:

```markdown
# Revisão de falhas — <nome do sistema>
Nível aplicado: <0/1/2> · Stack: <...> · Áreas verificadas: <...>

## Resumo
<2–4 frases: o estado geral e o que precisa ser feito primeiro>

## Problemas encontrados (do mais grave para o menos grave)
### [Crítico] API-01 — Pedido de outro usuário acessível pelo ID
- Onde: `src/routes/orders.js:42`
- Evidência: a consulta busca por `id` sem filtrar por `user_id`.
- Impacto: qualquer usuário logado lê pedidos de todos.
- Correção: <passo a passo ou código>
- Teste que prova a correção: <teste>

## Verificado e OK (com evidência)
- IA-01: nenhum segredo no bundle — `grep` por padrões de chave em `dist/` sem resultados.

## Não verificado (e por quê)
- OPS-01: não tenho acesso ao provedor de banco para testar a restauração.

## Próximos passos
1. ...
```

Seja honesto sobre o que não foi possível verificar. Um relatório que diz "tudo OK" sem ter olhado é pior do que nenhum relatório.

## 7. Como corrigir

- Corrija o mais grave primeiro (Crítico → Alto → Médio).
- Faça a menor mudança correta e mantenha o estilo do projeto.
- Para cada correção de item Crítico ou Alto, escreva um teste que falharia antes da correção.
- Antes de alterar código, banco, configuração ou fazer deploy, peça autorização ao usuário quando o ambiente ou as instruções dele exigirem.
- Ações destrutivas (apagar dados, migrations que removem colunas, rotação de chaves em produção) sempre pedem confirmação explícita.
