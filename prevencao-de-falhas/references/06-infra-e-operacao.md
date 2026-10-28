# 06 · Infraestrutura e operação

Vale para deploy, CI/CD, bancos em produção, nuvem, containers, dependências, segredos, monitoramento e resposta a incidentes. Muitos dos maiores incidentes da história (GitLab 2017, CrowdStrike 2024, Shai-Hulud 2025) foram falhas de operação, não de lógica.

## Sumário
- OPS-01 Backups nunca testados
- OPS-02 Comando no ambiente errado
- OPS-03 Deploy para todos de uma vez
- OPS-04 Migrations destrutivas ou que travam tabelas
- OPS-05 Ataque à cadeia de dependências
- OPS-06 Segredos que nunca são trocados
- OPS-07 Sem monitoramento nem alertas
- OPS-08 Configuração ou feature flag divergente
- OPS-09 Storage ou bucket público
- OPS-10 Dev e produção compartilhando banco ou credenciais
- OPS-11 Sem proteção contra abuso ou DDoS
- OPS-12 Dependência de terceiro sem plano B
- OPS-13 Guardar dados além do necessário

---

## OPS-01 · Backups nunca testados
**Gravidade:** Crítico

**Por que importa:** no incidente do GitLab (jan. 2017), um engenheiro apagou o diretório do banco no servidor errado. Dos 5 mecanismos de backup e replicação, nenhum funcionava; cerca de 6 horas de dados foram perdidas. Backup que nunca foi restaurado é uma suposição.

**Como corrigir:**
1. Backups automáticos com retenção definida (ex.: diários por 30 dias) e point-in-time recovery quando o banco permitir.
2. Cópia fora da conta/região principal (protege contra exclusão acidental, ransomware e conta comprometida), idealmente imutável.
3. **Teste de restauração periódico e automatizado** (ex.: mensal): restaurar num ambiente separado e rodar uma checagem (contagem de linhas, consulta conhecida).
4. Alerta se o backup ou o teste de restauração falhar.
5. Documente o procedimento de restauração e os tempos esperados (RPO: quanto dado pode perder; RTO: quanto tempo pode ficar fora).

**Como testar:** restaure o backup de ontem num banco novo agora e meça o tempo.

---

## OPS-02 · Comando no ambiente errado
**Gravidade:** Crítico

**Por que importa:** apagar dados, limpar buckets ou rodar migration em produção achando que era homologação é um dos erros humanos mais comuns (GitLab: `db1` em vez de `db2`; relatos no r/ExperiencedDevs de buckets S3 apagados durante uma reunião).

**Como corrigir:** contas/projetos de nuvem separados por ambiente; credenciais de produção que não ficam na máquina do dia a dia (acesso via SSO com sessão curta); prompt do terminal e tema do cliente de banco com cor e nome do ambiente; usuário de produção sem permissão de `DROP`/`DELETE` em massa; operações destrutivas em produção só por pipeline com aprovação; proteção contra exclusão (deletion protection) nos recursos críticos.

---

## OPS-03 · Deploy para todos de uma vez
**Gravidade:** Crítico

**Por que importa:** em 19 de julho de 2024, uma atualização de configuração da CrowdStrike (Channel File 291), com um número de campos diferente do esperado, foi liberada para todos os clientes de uma vez e derrubou cerca de 8,5 milhões de máquinas Windows. Configuração é código e pode quebrar tudo.

**Como corrigir:** rollout gradual (canary: 1% → 10% → 50% → 100%, com observação entre as etapas); feature flags para ligar funcionalidades sem deploy; rollback rápido e testado (um comando ou um clique); validação de arquivos de configuração com schema no CI e no carregamento; health checks que barram o avanço do rollout; evitar deploys em sextas à noite e vésperas de feriado sem plantão.

---

## OPS-04 · Migrations destrutivas ou que travam tabelas
**Gravidade:** Alto

**Por que importa:** `DROP COLUMN` enquanto a versão antiga do código ainda está rodando quebra requisições; `ALTER TABLE` que reescreve uma tabela grande trava escrita por minutos; migration sem volta impede rollback. Agentes de IA também geram e aplicam migrations destrutivas (IA-13).

**Como corrigir:**
1. Padrão **expand/contract**: adicionar coluna nova → código escreve nas duas → migrar dados → código lê da nova → só depois remover a antiga.
2. Teste a migration numa cópia de produção (volume real) e meça o tempo.
3. Índices criados de forma concorrente (`CREATE INDEX CONCURRENTLY` no Postgres); `lock_timeout` curto para não bloquear tudo.
4. Backup ou snapshot imediatamente antes; migration reversível quando possível.
5. Migrations versionadas no repositório e aplicadas pelo pipeline, nunca à mão em produção.

---

## OPS-05 · Ataque à cadeia de dependências
**Gravidade:** Crítico

**Por que importa:** em setembro de 2025, contas de mantenedores do npm foram sequestradas (pacotes como `chalk` e `debug`) e o worm **Shai-Hulud** se espalhou por centenas de pacotes, roubando tokens do npm, GitHub e nuvem e publicando repositórios privados; a versão 2.0 (nov. 2025) atingiu 796 pacotes. Também vale para PyPI, RubyGems, Maven, NuGet, imagens Docker, GitHub Actions e extensões de editor.

**Como corrigir:**
1. **Lockfile versionado** e instalação reprodutível no CI (`npm ci`, `pnpm install --frozen-lockfile`, `pip install --require-hashes`, `go mod verify`).
2. Desabilite scripts de instalação quando possível (`npm ci --ignore-scripts`, `pnpm` com `onlyBuiltDependencies`) e libere só os necessários.
3. Espere alguns dias antes de adotar versões novas (ex.: Renovate/Dependabot com `minimumReleaseAge`), porque a maioria dos pacotes maliciosos é detectada em horas ou dias.
4. 2FA obrigatório nas contas de publicação; publicação via CI com provenance (trusted publishing).
5. GitHub Actions fixadas por SHA do commit, não por tag.
6. Varredura: `npm audit`, `pip-audit`, `osv-scanner`, Socket, Snyk, Dependabot alerts.
7. Tokens de CI com escopo mínimo e curta duração (OIDC), para que um roubo cause pouco dano.

---

## OPS-06 · Segredos que nunca são trocados
**Gravidade:** Alto

**Por que importa:** segundo a GitGuardian, 64% dos segredos vazados em 2022 continuavam válidos em 2026. Uma chave antiga esquecida num backup, log ou repositório continua abrindo portas.

**Como corrigir:** inventário de segredos (onde está cada um, quem usa); rotação periódica e imediata em caso de vazamento ou saída de pessoas; credenciais de curta duração (OIDC entre CI e nuvem, tokens temporários); secret manager central; detecção de segredos no repositório e nos logs (IA-01, API-17).

---

## OPS-07 · Sem monitoramento nem alertas
**Gravidade:** Alto

**Por que importa:** o problema é descoberto pelo cliente reclamando, horas ou dias depois, e sem dados para investigar.

**Como corrigir:**
1. Rastreamento de erros (Sentry, Rollbar, Bugsnag) no front e no back.
2. Logs estruturados centralizados, com ID de correlação por requisição.
3. Métricas essenciais: taxa de erro, latência (p95/p99), tráfego, saturação (CPU, memória, conexões do banco); métricas de negócio (pedidos por hora, pagamentos aprovados).
4. Uptime checks externos nas rotas críticas.
5. Alertas acionáveis (com limite e responsável), não ruído.
6. Para dinheiro e agentes: alertas de custo e de volume anormal (FIN-10, AGT-05).

---

## OPS-08 · Configuração ou feature flag divergente
**Gravidade:** Alto

**Por que importa:** a chave de uma flag no código não bate com a da configuração, uma variável de ambiente falta em produção, e o sistema assume um valor padrão errado em silêncio (relato no r/ExperiencedDevs: quase milhões em desperdício antes de um feriado por uma chave de flag divergente).

**Como corrigir:** valide toda a configuração no **boot** com schema (Zod/envalid, pydantic-settings, `@ConfigurationProperties` com `@Validated`, `IOptions` com validação, envconfig) e **falhe ao iniciar** se faltar algo; sem valores padrão perigosos para itens críticos; nomes de flags como constantes compartilhadas; flags com dono e data de remoção; diff de configuração entre ambientes revisado no deploy.

---

## OPS-09 · Storage ou bucket público
**Gravidade:** Crítico

**Por que importa:** no caso Tea (jul. 2025), um bucket Firebase público expôs cerca de 72 mil imagens, incluindo 13 mil selfies com documento. S3, GCS, Azure Blob, Supabase Storage e Firebase Storage abertos estão entre as causas mais comuns de vazamento.

**Como corrigir:** buckets privados por padrão e "block public access" ligado na conta; acesso a arquivos por URLs assinadas com expiração curta; policies por usuário/pasta; separar bucket de arquivos realmente públicos (imagens do site) do de arquivos de usuários; revisão periódica com ferramentas da nuvem (AWS Config, Security Hub, Supabase advisors).

**Como testar:** tente baixar um arquivo privado sem autenticação e listar o bucket anonimamente.

---

## OPS-10 · Dev e produção compartilhando banco ou credenciais
**Gravidade:** Alto

**Por que importa:** um teste local, um seed ou um agente de IA apaga ou altera dados reais; dados pessoais reais ficam espalhados em máquinas de desenvolvimento.

**Como corrigir:** projetos, bancos e chaves separados por ambiente; `.env` de produção nunca na máquina de desenvolvimento; dados de desenvolvimento sintéticos ou anonimizados; scripts de seed e reset que se recusam a rodar se detectarem ambiente de produção.

---

## OPS-11 · Sem proteção contra abuso ou DDoS
**Gravidade:** Médio

**Como corrigir:** CDN/WAF na frente (Cloudflare, firewall do provedor de hospedagem); rate limit (API-05); cache de conteúdo público; limites de conexão no banco e pool de conexões; autoscaling com teto de custo; proteção de bots nas rotas sensíveis.

---

## OPS-12 · Dependência de terceiro sem plano B
**Gravidade:** Médio

**Por que importa:** provedor de pagamento, e-mail, LLM, autenticação ou nuvem fica fora do ar, e o sistema inteiro cai junto.

**Como corrigir:** timeouts e circuit breakers (API-12); filas para trabalho que pode esperar (e-mails, notificações); degradação elegante (a página funciona mesmo sem o widget de recomendação); provedor alternativo para funções críticas quando o custo justificar; página de status e comunicação com usuários.

---

## OPS-13 · Guardar dados além do necessário
**Gravidade:** Alto

**Por que importa:** dados antigos esquecidos (backups de sistemas legados, logs de anos, exportações em buckets) aumentam o estrago de qualquer vazamento e as obrigações da LGPD.

**Como corrigir:** política de retenção por tipo de dado; exclusão automática (TTL, jobs de limpeza, lifecycle rules nos buckets); inventário de onde há dados pessoais; desativação completa de sistemas antigos, incluindo seus backups e buckets.
