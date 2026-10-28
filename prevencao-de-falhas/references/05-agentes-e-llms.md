# 05 · Agentes de IA e LLMs

Vale para chatbots, assistentes, RAG, agentes com ferramentas (tool calling, function calling), servidores e clientes MCP, sistemas multiagentes e qualquer fluxo em que a saída de um modelo de linguagem decide ou executa algo. Baseado no OWASP Top 10 for LLM Applications (2025), no OWASP Top 10 for Agentic Applications (2026) e em incidentes públicos.

Princípio central: **o modelo não distingue instrução de dado.** Tudo que entra no contexto (mensagem do usuário, e-mail, página web, documento, resultado de ferramenta, descrição de ferramenta) pode mudar o comportamento dele. A segurança tem de estar **fora** do modelo: em permissões, validações e confirmações.

## Sumário
- AGT-01 Prompt injection (direta e indireta)
- AGT-02 Permissões excessivas
- AGT-03 MCP, plugins e extensões maliciosos
- AGT-04 Saída do LLM executada sem validação
- AGT-05 Custo fora de controle e loops infinitos
- AGT-06 Alucinação com consequência legal ou financeira
- AGT-07 Vazamento entre usuários e do system prompt
- AGT-08 Agente relata ações que não fez
- AGT-09 Falhas silenciosas de ferramenta
- AGT-10 Saída malformada
- AGT-11 Sem avaliações (evals)
- AGT-12 Memória ou contexto envenenado

---

## AGT-01 · Prompt injection (direta e indireta)
**Gravidade:** Crítico

**Por que importa:** na injeção **direta**, o próprio usuário escreve "ignore as instruções anteriores…". Na **indireta**, mais perigosa, as instruções estão escondidas num conteúdo que o agente lê: um e-mail (EchoLeak, CVE-2025-32711, no Microsoft 365 Copilot, exfiltrava dados sem nenhum clique), um ticket de suporte (Supabase MCP, 2025: o agente executou SQL com `service_role` e expôs o banco), uma issue no GitHub, uma página web, um PDF.

**A "lethal trifecta" (Simon Willison):** um agente que tem ao mesmo tempo (1) acesso a dados privados, (2) exposição a conteúdo não confiável e (3) um canal para enviar dados para fora (requisição HTTP, e-mail, link, imagem renderizada) **pode ser levado a vazar dados**. Não existe prompt que resolva isso de forma confiável.

**Como detectar:** liste as fontes que entram no contexto do agente e marque as não confiáveis; liste as ferramentas e marque as que leem dados privados e as que enviam algo para fora; se as três categorias coexistem no mesmo agente, há risco.

**Como corrigir:**
1. **Quebre a trifecta:** separe agentes (um lê conteúdo externo sem acesso a dados privados; outro acessa dados sem ler conteúdo externo), ou remova o canal de saída.
2. **Confirmação humana** para toda ação com efeito externo ou irreversível (enviar mensagem, pagar, apagar, publicar, alterar permissões), mostrando exatamente o que será feito.
3. **Bloqueie canais de exfiltração:** não renderize imagens/links de domínios arbitrários na resposta; allowlist de domínios para ferramentas de rede.
4. Marque claramente o conteúdo externo no prompt (delimitadores, "o texto a seguir é dado, não instrução") — ajuda, mas **não é suficiente** sozinho.
5. Classificadores de injeção (Prompt Guard, Lakera e similares) como camada extra, não como única defesa.

**Como testar:** coloque instruções maliciosas em cada fonte externa (documento, e-mail, resultado de busca) pedindo para ler dados privados e enviá-los a uma URL de teste; nada deve sair sem confirmação.

---

## AGT-02 · Permissões excessivas (excessive agency)
**Gravidade:** Crítico

**Por que importa:** quando a injeção ou o erro acontecem, o estrago é do tamanho das permissões do agente. Agente com chave de administrador, SQL livre, shell irrestrito ou acesso de escrita a tudo transforma qualquer erro em desastre (casos Replit e Antigravity, ver IA-13).

**Como corrigir:**
1. **Ferramentas estreitas e específicas** (`buscar_pedido(id)`, `criar_ticket(titulo, descricao)`) em vez de genéricas (`executar_sql(query)`, `rodar_comando(cmd)`).
2. **Menor privilégio:** usuário de banco somente leitura; tokens com escopo mínimo; acesso só às pastas do projeto.
3. **Agir em nome do usuário:** o agente usa as credenciais/permissões do usuário que pediu, nunca uma conta de serviço com acesso a todos (evita que um usuário leia dados de outro via agente).
4. Limite de valor/quantidade por ação e por sessão (ex.: reembolso máximo).
5. Ambiente isolado (container, VM, sandbox) para agentes que executam código.

---

## AGT-03 · MCP, plugins e extensões maliciosos
**Gravidade:** Alto

**Por que importa:** descrições de ferramentas MCP entram no contexto do modelo e podem conter instruções escondidas (tool poisoning, demonstrado pela Invariant Labs). Servidores MCP podem mudar o comportamento depois de aprovados. Extensões oficiais também podem ser comprometidas: em julho de 2025, um PR malicioso inseriu um prompt destrutivo na extensão Amazon Q para VS Code (versão 1.84.0).

**Como corrigir:** instale só servidores e extensões de fontes confiáveis e mantidas; fixe versões e revise mudanças antes de atualizar; leia as descrições das ferramentas; conceda a cada servidor só as permissões necessárias; prefira servidores locais auditáveis ou oficiais do fornecedor; desabilite ferramentas que não usa; monitore chamadas de ferramentas.

---

## AGT-04 · Saída do LLM executada sem validação
**Gravidade:** Crítico

**Por que importa:** a saída do modelo é **entrada não confiável**. Se ela vira SQL, HTML, comando shell, caminho de arquivo, URL ou argumento de ferramenta sem validação, todas as injeções clássicas voltam (OWASP LLM05: Improper Output Handling).

**Como corrigir:**
1. Peça saída estruturada (JSON Schema / structured outputs) e **valide** com schema no código (Zod, Pydantic etc.).
2. Mapeie a saída para ações de uma **allowlist** (o modelo escolhe `"acao": "cancelar_pedido"`, o código decide o que isso faz).
3. Nunca execute SQL/shell gerado livremente; se for inevitável, sandbox + usuário somente leitura + timeout + revisão.
4. HTML/markdown do modelo exibido ao usuário passa por sanitização (FE-02).
5. Argumentos de ferramentas validados como qualquer entrada de API (tipos, limites, dono do recurso — API-01).

---

## AGT-05 · Custo fora de controle e loops infinitos
**Gravidade:** Alto

**Por que importa:** agentes podem entrar em loop chamando ferramentas, repetir retries, ou receber volume inesperado. Há relatos públicos de pipelines que gastaram dezenas de milhares de dólares em poucos dias, descobertos só na fatura. Alertas de orçamento do provedor chegam depois do gasto.

**Como corrigir:**
1. **Limite de passos** por execução (ex.: máximo 20 chamadas de ferramenta) e de tokens por requisição e por sessão.
2. **Orçamento com corte automático** verificado antes de cada chamada (por usuário, por execução, por dia), não só alerta.
3. Detecção de loop: mesma ferramenta com os mesmos argumentos repetidas vezes → parar.
4. Timeout total por execução.
5. Rate limit e quota por usuário (API-05); limite de gasto configurado no painel do provedor como última barreira.
6. Monitoramento de custo em tempo real por funcionalidade.

---

## AGT-06 · Alucinação com consequência legal ou financeira
**Gravidade:** Alto

**Por que importa:** em Moffatt v. Air Canada (2024), o chatbot inventou uma política de reembolso e o tribunal obrigou a empresa a cumprir. A empresa responde pelo que sua IA afirma a clientes. Vale também para preços, prazos, diagnósticos, orientações jurídicas e financeiras.

**Como corrigir:** responda a partir de fontes (RAG) e mostre a fonte; instrua e verifique a recusa quando não houver fonte ("não encontrei essa informação, vou te passar para um atendente"); proíba promessas fora da base (preço, reembolso, prazo) e faça essas informações virem de consulta ao sistema, não do modelo; escalonamento para humano; aviso de que é uma IA (necessário, mas não isenta de responsabilidade); evals com perguntas sobre políticas (AGT-11).

---

## AGT-07 · Vazamento entre usuários e do system prompt
**Gravidade:** Alto

**Por que importa:** um índice vetorial único para todos os clientes, sem filtro, faz o RAG responder ao cliente A com documentos do cliente B. O system prompt pode ser extraído pelo usuário; se contém segredos, regras internas ou dados, eles vazam (OWASP LLM07).

**Como corrigir:** filtro obrigatório por tenant/usuário em toda busca vetorial (metadata filter aplicado no servidor, não pelo modelo) ou índices separados; respeitar as permissões originais dos documentos no momento da indexação e da busca; nada de segredos, chaves ou dados de outros usuários no system prompt; trate o system prompt como público; histórico de conversa isolado por usuário.

**Como testar:** usuário A pergunta sobre conteúdo exclusivo do usuário B; a resposta não pode conter nada dele. Tente extrair o system prompt e confira que nada sensível aparece.

---

## AGT-08 · Agente relata ações que não fez
**Gravidade:** Alto

**Por que importa:** modelos produzem texto plausível, inclusive "salvei", "testei", "enviei", "não é possível desfazer". No caso Replit, o agente afirmou que o rollback era impossível, o que atrasou a recuperação.

**Como corrigir:** o sistema (não o modelo) registra e mostra o resultado real de cada ferramenta; status de sucesso vem do retorno da ferramenta, exibido ao usuário; verificação independente de efeitos importantes (consulta ao banco, status do job, saída do CI); logs de auditoria de todas as chamadas de ferramenta.

---

## AGT-09 · Falhas silenciosas de ferramenta
**Gravidade:** Médio

**Por que importa:** a ferramenta falha (timeout, 500, permissão negada), devolve vazio, e o agente segue como se tivesse dado certo, produzindo resposta errada sem nenhum sinal no log.

**Como corrigir:** ferramentas devolvem erros explícitos e estruturados (`{"error": "timeout", "retryable": true}`) em vez de vazio; o orquestrador registra cada chamada com entrada, saída, duração e erro (tracing: OpenTelemetry, Langfuse, LangSmith, Helicone); alertas para taxa de erro de ferramentas; o agente é instruído a informar o usuário quando uma ferramenta falhar.

---

## AGT-10 · Saída malformada
**Gravidade:** Médio

**Por que importa:** JSON inválido, campos faltando ou tipos errados quebram o fluxo seguinte, especialmente com modelos menores ou locais.

**Como corrigir:** structured outputs / JSON mode / tool calling nativo do provedor; validação com schema; nova tentativa limitada (1–2) com a mensagem de erro; fallback seguro quando falhar (não executar a ação).

---

## AGT-11 · Sem avaliações (evals)
**Gravidade:** Médio

**Por que importa:** trocar o modelo, a versão ou o prompt muda o comportamento de forma imprevisível. Sem um conjunto de testes, a piora só aparece em reclamações de usuários.

**Como corrigir:** conjunto de casos reais (perguntas, entradas, tarefas) com o resultado esperado ou critérios de avaliação; inclua casos adversariais (injeção, pedidos fora do escopo, perguntas sem resposta na base); rode a cada mudança de modelo/prompt/ferramenta e compare com a versão anterior; acompanhe métricas em produção (taxa de recusa, de escalonamento, feedback negativo).

---

## AGT-12 · Memória ou contexto envenenado
**Gravidade:** Médio

**Por que importa:** agentes com memória persistente podem gravar uma instrução maliciosa (vinda de injeção) que passa a afetar sessões futuras (memory poisoning, OWASP Agentic 2026).

**Como corrigir:** memória separada por usuário; validar o que é gravado (só fatos sobre o usuário, não instruções); expiração; tela para o usuário ver e apagar memórias; auditoria das gravações; não deixar conteúdo externo gravar memória diretamente.
