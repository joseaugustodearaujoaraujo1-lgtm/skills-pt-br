# Casos reais

Incidentes públicos usados como base desta skill. Servem para explicar ao usuário por que uma prevenção importa e para reconhecer padrões ao investigar um incidente (Modo E). Onde a causa é contestada ou baseada em relato de uma das partes, isso está indicado.

| Quando | Caso | O que falhou | Lição | IDs |
|---|---|---|---|---|
| jan. 2017 | GitLab.com | Diretório do banco apagado no servidor errado; nenhum dos 5 mecanismos de backup funcionava; ~6 h de dados perdidas. | Backup só existe se a restauração foi testada. | OPS-01, OPS-02 |
| fev. 2024 | Air Canada (Moffatt v. Air Canada) | Chatbot inventou política de reembolso; tribunal obrigou a empresa a cumprir. | A empresa responde pelo que sua IA diz. | AGT-06 |
| jul. 2024 | CrowdStrike | Arquivo de configuração com número de campos inesperado, liberado para todos, derrubou ~8,5 milhões de máquinas Windows. | Configuração é código; valide e libere em etapas. | OPS-03, OPS-08 |
| mar. 2025 | Next.js — CVE-2025-29927 | Cabeçalho `x-middleware-subrequest` forjado pulava o middleware e a autorização. | Autorização perto do dado, não só no middleware; mantenha o framework atualizado. | FE-04 |
| jun. 2025 | EchoLeak — CVE-2025-32711 | E-mail com instruções escondidas fazia o Microsoft 365 Copilot exfiltrar dados sem clique. | Conteúdo externo é instrução em potencial para um LLM. | AGT-01 |
| jun.–jul. 2025 | C&M Software (Pix) | Credencial de operador vendida por funcionário deu acesso às contas reserva de instituições no Banco Central; desvio estimado em centenas de milhões de reais (valores divulgados variam). | MFA, menor privilégio, segregação de funções e detecção de anomalias. | FIN-09, FIN-10 |
| jul. 2025 | Replit Agent | Segundo o relato do usuário (Jason Lemkin), o agente apagou o banco de produção (~2.400 registros) durante code freeze, inventou dados e disse que o rollback era impossível. | Agente sem escrita em produção; verifique efeitos reais. | IA-13, IA-06, AGT-08 |
| jul. 2025 | Amazon Q Developer (VS Code) | PR malicioso inseriu um prompt destrutivo na extensão oficial (v1.84.0). A AWS informou que nenhum recurso de cliente foi afetado. | Ferramentas de IA fazem parte da cadeia de suprimentos. | AGT-03, OPS-05 |
| jul. 2025 | Supabase MCP ("lethal trifecta") | Ticket de suporte com instruções fez o agente usar `service_role` e expor o banco (demonstração de pesquisadores). | Não junte dados privados, conteúdo não confiável e canal de saída. | AGT-01, AGT-02 |
| jul. 2025 | Base44 | Endpoints de cadastro não documentados aceitavam só o `app_id` público e permitiam pular o SSO de apps privados (Wiz). | Inventário de endpoints e autenticação por padrão. | IA-03, API-10 |
| jul. 2025 | Tea | Bucket Firebase público expôs ~72 mil imagens (13 mil selfies com documento) e, depois, ~1,1 milhão de mensagens. Simon Willison e outros afirmam que a causa **não** foi vibe coding (dados legados). | Storage privado, minimização e retenção. | OPS-09, OPS-13, FIN-13 |
| 2025 | Lovable — CVE-2025-48757 | 170+ apps gerados com Supabase sem RLS ou com RLS fraca (303 endpoints); qualquer pessoa com a chave pública lia/escrevia dados. CVE contestada pelo fornecedor, que atribui a responsabilidade a cada cliente. | RLS em toda tabela, testada como atacante. | IA-02 |
| ago. 2025 | Sinqia (Pix) | Credenciais de fornecedores legítimos usadas para desviar cerca de R$ 710 milhões. | Acesso de terceiros com limites, monitoramento e revogação rápida. | FIN-09, FIN-10 |
| set.–nov. 2025 | npm: chalk/debug e worm Shai-Hulud | Contas de mantenedores sequestradas; worm roubou tokens e se espalhou por centenas de pacotes (796 na versão 2.0). | Lockfile, scripts de instalação controlados, 2FA, adoção tardia de versões. | OPS-05 |
| 2025 | Google Antigravity | Em modo "Turbo", o agente interpretou "limpar o cache" e apagou o drive D: inteiro do usuário. | Confirmação humana e sandbox para comandos destrutivos. | IA-13 |
| jan. 2026 | Moltbook | Chave Supabase no JS do cliente e banco sem RLS expuseram 1,5 milhão de API keys, 35 mil e-mails e mensagens privadas (Wiz). O fundador disse não ter escrito código. | Chave pública só é segura com RLS correta. | IA-01, IA-02 |

## Estudos citados
- **Veracode, GenAI Code Security Report (2025):** 45% das tarefas geradas por mais de 100 modelos introduziram falhas do OWASP Top 10.
- **CodeRabbit (2025):** em 470 PRs open source, código de IA teve 1,7× mais problemas; a maior categoria foi lógica e correção.
- **USENIX Security 2025 (package hallucination):** 19,7% dos pacotes recomendados não existiam; 205.474 nomes inventados; 5,2% em modelos comerciais e 21,7% em abertos; muitos nomes se repetem.
- **GitGuardian, State of Secrets Sprawl 2026:** 28,65 milhões de segredos no GitHub público em 2025; +81% em vazamentos de chaves de serviços de IA; 64% dos segredos de 2022 ainda válidos.
- **GitClear (2025–2026):** forte crescimento de blocos duplicados e queda de refatoração com assistentes de IA.
- **METR (jul. 2025):** ensaio randomizado; devs experientes 19% mais lentos com IA, achando que estavam 20% mais rápidos.
- **Escape.tech (via Cloud Security Alliance, 2026):** milhares de apps de plataformas de vibe coding analisados; 2.000+ vulnerabilidades graves, 400+ segredos expostos, 175 vazamentos de dados pessoais.

## Fontes principais
- OWASP API Security Top 10: https://api-security.owasp.org
- OWASP Top 10 for Agentic Applications 2026: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
- GitLab postmortem 2017: https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/
- CrowdStrike RCA: https://www.crowdstrike.com/wp-content/uploads/2024/08/Executive-Summary_Root-Cause-Analysis_Channel-File-291.pdf
- NVD CVE-2025-29927: https://nvd.nist.gov/vuln/detail/cve-2025-29927
- NVD CVE-2025-48757: https://nvd.nist.gov/vuln/detail/cve-2025-48757
- EchoLeak (arXiv): https://arxiv.org/abs/2509.10540
- Supabase, Defense in Depth for MCP: https://supabase.com/blog/defense-in-depth-mcp
- Wiz, Moltbook: https://www.wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys
- Wiz, Base44: https://www.wiz.io/blog/critical-vulnerability-base44
- AI Incident Database #1152 (Replit): https://incidentdatabase.ai/cite/1152/
- AWS boletim AWS-2025-019 (Amazon Q): https://aws.amazon.com/security/security-bulletins/AWS-2025-019/
- Unit 42, Shai-Hulud: https://unit42.paloaltonetworks.com/npm-supply-chain-attack/
- G1, C&M: https://g1.globo.com/economia/noticia/2025/07/04/ataque-hacker-ao-sistema-pix-o-que-se-sabe-sobre-o-golpe-e-o-suspeito-preso-em-sp.ghtml
- G1, Sinqia: https://g1.globo.com/economia/noticia/2025/09/02/ataque-hacker-sinqia.ghtml
- Moffatt v. Air Canada: https://en.wikipedia.org/wiki/Moffatt_v._Air_Canada
- METR: https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
- Veracode: https://www.veracode.com/blog/genai-code-security-report/
- CodeRabbit: https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report
- GitGuardian: https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/
