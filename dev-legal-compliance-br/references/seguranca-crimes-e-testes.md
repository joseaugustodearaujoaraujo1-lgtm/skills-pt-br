# Segurança, crimes cibernéticos e testes autorizados

Normas: **Código Penal art. 154-A** (invasão de dispositivo informático, incluído pela Lei 12.737/2012 e agravado pela Lei 14.155/2021), arts. 171 e 297/298 (fraude e falsificação, com qualificadoras em meio eletrônico), **Lei 12.965/2014**, **LGPD** (art. 46 a 49) e contratos. Este material é educativo; para dúvidas concretas, procure advogado(a) criminalista/digital.

## 1. Por que o desenvolvedor precisa conhecer

- **Invadir ou obter acesso** a dispositivo/sistema alheio, mediante violação indevida de mecanismo de segurança, para obter, adulterar ou destruir dados, é crime (art. 154-A). Há aumento de pena em certos casos (prejuízo econômico, obtenção de conteúdo de comunicações, controle remoto, etc.).
- **Produzir, oferecer ou difundir** dispositivo ou programa com o fim de permitir a invasão também é punido (§ 1º), o que exige cuidado em ferramentas de teste.
- Intenções boas **não substituem autorização**. "Só estava testando" não é defesa segura.

## 2. Regra: testar apenas com autorização escrita

Antes de qualquer teste de intrusão, varredura, *fuzzing*, *scraping* agressivo ou teste de carga:

1. **Sistema próprio** ou **autorização por escrito** do dono (e do provedor, quando exigido).
2. **Escopo definido:** hosts/URLs, contas de teste, tipos de teste permitidos e proibidos, janela de tempo, contatos de emergência, regras de parada.
3. **Ambiente:** staging sempre que possível; sem dados reais; sem derrubar produção.
4. **Dados encontrados:** não copiar, não reter além do necessário, não divulgar; tratar vazamentos como incidente.
5. **Relatório** entregue só ao responsável, com correções e prazo.

Modelo de cláusula (adaptar com advogado): *"A CONTRATANTE autoriza expressamente a CONTRATADA a realizar testes de segurança nos ativos listados no Anexo I, no período X, pelas técnicas Y, ficando proibidos Z. A CONTRATADA manterá sigilo e tratará eventuais dados pessoais conforme a LGPD."*

### Testes de carga (k6, JMeter etc.)

- Só contra ambientes seus/autorizados; comunique o provedor e o Cloudflare quando o volume puder parecer ataque DDoS; respeite políticas de uso aceitável.
- Volume incremental, janela combinada, botão de parada.
- Dados sintéticos; sandbox de pagamento; sem disparo de e-mails/SMS reais.

## 3. Segurança como dever (LGPD art. 46 e 6º, VII/VIII)

O controlador e o operador devem adotar medidas **técnicas e administrativas** aptas a proteger os dados. A falta delas é fundamento direto para sanções e para responsabilidade civil. Documente:

- Política de segurança (acesso, senhas, MFA, backups, atualizações, descarte).
- Controle de acesso por mínimo privilégio; revisão periódica de contas.
- Gestão de vulnerabilidades e dependências; testes antes de produção.
- Criptografia em trânsito (TLS) e em repouso para dados sensíveis.
- Treinamento básico da equipe; acordos de confidencialidade.
- Registro de acessos e de ações administrativas.

## 4. Resposta a incidentes (LGPD art. 48)

1. **Detecte e contenha** (isolar sistemas, revogar credenciais, preservar evidências).
2. **Avalie** o que foi afetado: tipos de dados, quantidade de titulares, risco/dano relevante.
3. **Comunique** a ANPD e os titulares quando o incidente puder acarretar risco ou dano relevante, no prazo regulamentado (a regulamentação da ANPD prevê **3 dias úteis**; confirme a regra vigente) e com as informações exigidas (natureza do incidente, dados envolvidos, medidas adotadas, riscos, contato do encarregado).
4. **Registre** internamente todo incidente, mesmo os não comunicados, com análise de causa.
5. **Corrija** a causa e revise controles; **aprenda** (post-mortem sem culpados).
6. **Acione** advogado(a) e, quando necessário, autoridades policiais (crime em curso) e o seguro cibernético, se houver.

Tenha antes do incidente: lista de contatos, árvore de decisão, modelo de comunicado, *runbook* técnico.

## 5. Programa de divulgação responsável (opcional, recomendado)

- `SECURITY.md`/`/.well-known/security.txt` com e-mail e política (*safe harbor* para boa-fé, escopo, prazos de resposta).
- Resposta rápida, não retaliar pesquisadores de boa-fé; **não** prometer imunidade legal que você não pode dar.

## 6. Cuidados em ferramentas e automação

- Evite publicar scripts "prontos para ataque" (força bruta, *credential stuffing*) sem salvaguardas e finalidade clara; documente uso lícito.
- Coletas automatizadas: respeite termos e limites; não burlar autenticação, CAPTCHA, ou controles de acesso.
- Engenharia social (phishing simulado) só com contrato e escopo; cuidado com LGPD e danos a funcionários.

## 7. Checklist

- [ ] Autorização escrita e escopo para qualquer teste em sistema que não é seu.
- [ ] Testes só em staging com dados sintéticos; produção apenas com janela e plano de parada.
- [ ] Política de segurança e controles do art. 46 documentados.
- [ ] Plano de resposta a incidentes com prazos e modelos de comunicação.
- [ ] `SECURITY.md` e canal para reporte de vulnerabilidades.
- [ ] Evidências e logs preservados em incidentes; advogado(a) acionado quando necessário.
