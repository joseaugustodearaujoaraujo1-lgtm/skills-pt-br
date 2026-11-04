# Checklist antes de publicar

Como usar:
- **Nível 0 (rápido):** só os itens marcados **[Básico]**.
- **Nível 1 (padrão):** todos os itens das seções que se aplicam ao projeto.
- **Nível 2 (rigoroso):** todas as seções aplicáveis, e cada item Crítico/Alto com evidência verificável (arquivo:linha, saída de comando, teste).

Para cada item, registre: **OK** (com evidência), **Falha** (com ID e local), **N/A** (com motivo) ou **Não verificado** (com motivo). Pule seções que não se aplicam (ex.: sem pagamentos → pule a seção 4) e diga isso no relatório.

## 1. Código e segredos
- [ ] **[Básico]** Nenhum segredo no código, no histórico do git, no build do front ou em variáveis públicas do bundler — IA-01, FE-01
- [ ] **[Básico]** `.env` e arquivos de credenciais no `.gitignore` e nunca commitados — IA-01
- [ ] **[Básico]** Nenhuma query SQL montada por concatenação/template com dados externos — IA-08
- [ ] **[Básico]** Nenhum HTML de usuário/LLM inserido sem sanitização — IA-08, FE-02
- [ ] Senhas com bcrypt/argon2 e verificação pela função da biblioteca — IA-07
- [ ] Toda entrada validada no servidor com schema, rejeitando campos desconhecidos — IA-09, API-04
- [ ] Dependências novas conferidas (existem, mantidas, populares, sem typo-squatting) — IA-04
- [ ] Erros tratados por handler global; nada de stack trace para o usuário; nenhum `catch` vazio — IA-10
- [ ] Testes rodados de verdade no CI, incluindo casos de borda; nenhum teste pulado sem motivo — IA-05, IA-06
- [ ] Diff gerado por IA lido por inteiro e comparado com a regra de negócio — IA-05

## 2. Autenticação, autorização e dados
- [ ] **[Básico]** Nenhuma rota que lê ou altera dados está aberta sem autenticação por engano — IA-03
- [ ] Autenticação aplicada por padrão; rotas públicas listadas explicitamente — IA-03
- [ ] Toda consulta com ID externo filtra pelo dono/tenant (sem IDOR) — API-01
- [ ] Papel de administrador verificado no servidor em cada rota administrativa — API-06, FE-04
- [ ] Autorização verificada nos handlers, não só em middleware ou no front — FE-04
- [ ] RLS ativa em todas as tabelas expostas e testada com a chave anônima (Supabase/Firebase) — IA-02
- [ ] Respostas sem campos sensíveis ou internos (hash, tokens, documentos) — API-04
- [ ] Login, cadastro e reset com rate limit; tokens de reset de uso único e com expiração — API-02
- [ ] JWT verificado com algoritmo fixo, `exp` curto, `iss`/`aud` validados — API-03
- [ ] Sessão em cookie HttpOnly/Secure/SameSite (ou token curto + refresh rotativo) — FE-03

## 3. Robustez da API
- [ ] Paginação obrigatória com limite máximo; limite de tamanho de corpo e upload — API-05
- [ ] Rate limit nas rotas caras e sensíveis — API-05, API-07
- [ ] Timeout em toda chamada HTTP, de banco e de LLM — API-12
- [ ] Retries com limite, backoff e jitter; escritas com chave de idempotência — API-13
- [ ] Operações em várias etapas dentro de transação (ou outbox/saga) — API-15
- [ ] URLs informadas pelo usuário protegidas contra SSRF — API-08
- [ ] Uploads validados por conteúdo, renomeados e em storage privado — API-16
- [ ] CORS com origens explícitas, debug desligado, headers de segurança — API-09
- [ ] Webhooks com assinatura verificada e deduplicação — API-18
- [ ] Logs sem senhas, tokens, cartões ou documentos — API-17
- [ ] Inventário de rotas atualizado; nenhuma rota de teste/debug em produção — API-10
- [ ] Consultas principais sem N+1 e com índices — API-14

## 4. Dinheiro (pule se não houver)
- [ ] **[Básico]** Nenhum valor monetário em float/double — FIN-01
- [ ] Débito de saldo atômico, testado com requisições paralelas; `CHECK (saldo >= 0)` — FIN-02
- [ ] `Idempotency-Key` (ou `txid`) em toda criação de cobrança — FIN-03
- [ ] Webhooks deduplicados por event_id na mesma transação do efeito — FIN-04
- [ ] Ledger append-only de dupla entrada; saldo verificável contra os lançamentos — FIN-05
- [ ] Conciliação automática com PSP/banco e alerta de divergência — FIN-06
- [ ] Soma das parcelas/splits sempre igual ao total — FIN-07
- [ ] Máquina de estados de pagamento com transições validadas — FIN-08
- [ ] MFA, menor privilégio e segregação de funções para acessos operacionais e de fornecedores — FIN-09
- [ ] Limites de valor e frequência com bloqueio e alerta — FIN-10
- [ ] Auditoria append-only de operações financeiras — FIN-11
- [ ] Regras com fuso explícito e calendário de dias úteis — FIN-12

## 5. Front-end
- [ ] Botões de envio desabilitados durante a requisição; servidor idempotente — FE-05
- [ ] Requisições obsoletas canceladas ou ignoradas — FE-06
- [ ] Efeitos com cleanup; lint de hooks ativo — FE-07
- [ ] Estados de carregamento, erro, vazio e sucesso em toda tela com dados — FE-08
- [ ] Datas em UTC no servidor e convertidas só na exibição — FE-09
- [ ] Sem hydration mismatch; assets com hash e tratamento de ChunkLoadError — FE-10, FE-11
- [ ] Acessibilidade básica (labels, contraste, teclado, foco) verificada com axe/Lighthouse — FE-12
- [ ] Core Web Vitals aceitáveis em celular — FE-13

## 6. Agentes e LLMs (pule se não houver)
- [ ] **[Básico]** Agente sem credenciais de produção e sem permissão de escrita onde não precisa — IA-13, AGT-02
- [ ] Nenhum agente combina dados privados + conteúdo não confiável + canal de saída sem confirmação — AGT-01
- [ ] Confirmação humana para ações irreversíveis ou com efeito externo — AGT-01, IA-13
- [ ] Ferramentas estreitas, com menor privilégio, agindo com as permissões do usuário — AGT-02
- [ ] MCPs e extensões de fonte confiável, com versão fixa — AGT-03
- [ ] Saída do modelo validada com schema antes de qualquer ação — AGT-04, AGT-10
- [ ] Limite de passos, tokens, tempo e orçamento por execução, com corte automático — AGT-05
- [ ] Respostas sobre políticas, preços e prazos vêm de fontes/sistemas, com recusa quando não houver — AGT-06
- [ ] Busca vetorial filtrada por tenant/usuário no servidor; nada sensível no system prompt — AGT-07
- [ ] Resultados de ferramentas registrados e mostrados pelo sistema, não pelo texto do modelo — AGT-08, AGT-09
- [ ] Evals rodando a cada troca de modelo, prompt ou ferramenta — AGT-11

## 7. Deploy e operação
- [ ] **[Básico]** Dados reais não são usados em testes/protótipos sem necessidade — OPS-10
- [ ] Restauração de backup testada recentemente (ex.: últimos 30 dias) — OPS-01
- [ ] Ambientes separados (contas, bancos, chaves); identificação visual do ambiente — OPS-02, OPS-10
- [ ] Rollout gradual ou rollback testado; configuração validada no CI — OPS-03
- [ ] **[Básico]** Plano de rollback escrito (gatilho, responsável, comando, banco, tempo) e ensaiado em staging — OPS-03
- [ ] Log de segurança (logins, falhas, mudanças de permissão, acessos negados) sem dados sensíveis, fora do servidor da aplicação e com alertas — OPS-14
- [ ] Migrations testadas em cópia com volume real, reversíveis ou em expand/contract — OPS-04
- [ ] Lockfile, instalação reprodutível, scripts de instalação controlados, Actions por SHA, 2FA — OPS-05
- [ ] Segredos inventariados e com rotação definida — OPS-06
- [ ] Rastreamento de erros, métricas, uptime e alertas configurados — OPS-07
- [ ] Configuração validada no boot; falha ao iniciar se faltar algo — OPS-08
- [ ] Buckets privados por padrão e URLs assinadas — OPS-09
- [ ] CDN/WAF/rate limit contra abuso — OPS-11
- [ ] Plano para indisponibilidade de terceiros críticos — OPS-12
- [ ] Política de retenção e exclusão de dados (LGPD) — OPS-13, FIN-13

## 8. LGPD e privacidade (pule se o sistema não trata dados pessoais)
- [ ] **[Básico]** Cada dado pessoal coletado tem finalidade, base legal e prazo de guarda; o que não é necessário foi removido — LGP-01
- [ ] **[Básico]** Política de privacidade acessível, em linguagem simples, com canal de contato do responsável — LGP-02
- [ ] Consentimento desmarcado por padrão, por finalidade, registrado e revogável; cookies não essenciais só após o aceite — LGP-02
- [ ] "Exportar meus dados" e "Excluir minha conta" funcionam, inclusive em logs, caches, backups (no prazo) e bases vetoriais — LGP-03
- [ ] Dados sensíveis e de menores identificados, com acesso restrito, criptografia e sem aparecer em notificações — LGP-04
- [ ] Plano de resposta a incidente de uma página, com responsável e prazo de comunicação à ANPD conferido — LGP-05
- [ ] Lista de terceiros que recebem dados (inclusive provedores de IA), com dados mascarados quando possível — LGP-06
