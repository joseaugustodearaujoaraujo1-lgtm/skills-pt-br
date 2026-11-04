# LGPD — Lei Geral de Proteção de Dados (Lei 13.709/2018)

Regulador: **ANPD** (Autoridade Nacional de Proteção de Dados). Conferir regulamentos vigentes em gov.br/anpd.

## 1. Conceitos que o desenvolvedor precisa dominar

| Termo | Significado prático |
|-------|---------------------|
| **Dado pessoal** | Qualquer informação que identifique ou possa identificar uma pessoa: nome, e-mail, CPF, IP, ID de dispositivo, geolocalização, cookies identificadores |
| **Dado sensível** (art. 5º, II) | Origem racial/étnica, convicção religiosa, opinião política, filiação sindical, saúde, vida sexual, dado genético ou biométrico. Exige proteção reforçada |
| **Controlador** | Quem decide as finalidades e os meios (normalmente o dono do negócio) |
| **Operador** | Quem trata dados em nome do controlador (você como agência/freelancer, hospedagem, e-mail marketing, gateway) |
| **Titular** | A pessoa a quem os dados se referem |
| **Encarregado (DPO)** | Canal entre controlador, titulares e ANPD |
| **Tratamento** | Qualquer operação: coletar, armazenar, consultar, compartilhar, excluir |

> Como desenvolvedor, você pode ser **operador** (trata dados a mando do cliente) ou **controlador** (se o produto é seu). Defina isso por escrito. Operadores respondem solidariamente quando descumprem a lei ou as instruções do controlador.

## 2. Princípios (art. 6º)

Finalidade, adequação, necessidade (minimização), livre acesso, qualidade dos dados, transparência, segurança, prevenção, não discriminação, responsabilização e prestação de contas.

## 3. Bases legais (art. 7º; dados sensíveis, art. 11)

Consentimento; cumprimento de obrigação legal/regulatória; execução de contrato ou procedimentos preliminares; exercício regular de direitos em processo; proteção da vida; tutela da saúde; **legítimo interesse** (com teste de balanceamento e documentação); proteção do crédito; políticas públicas; estudos por órgão de pesquisa.

Orientação prática:

- **Cadastro e compra** → execução de contrato (não precisa de "aceito" para isso).
- **Nota fiscal, guarda de registros** → obrigação legal.
- **Marketing por e-mail** → consentimento ou legítimo interesse (avaliar caso a caso), sempre com descadastro fácil.
- **Cookies não essenciais (analytics, publicidade)** → consentimento, com opção real de recusar.
- **Dados sensíveis** → consentimento específico e destacado ou hipótese do art. 11; evite coletá-los.
- **Consentimento válido:** livre, informado, inequívoco, para finalidade determinada, **revogável** a qualquer momento. Caixa pré-marcada **não** vale.

## 4. Direitos do titular (art. 18)

Confirmação de tratamento; acesso; correção; anonimização, bloqueio ou eliminação de dados desnecessários; **portabilidade**; eliminação dos dados tratados com consentimento; informação sobre compartilhamentos; informação sobre consequências de não consentir; **revogação do consentimento**; oposição; revisão de decisões automatizadas (art. 20).

Prazo: a lei prevê atendimento imediato para confirmação/acesso simplificado e até **15 dias** para declaração completa; confira regulamentos da ANPD. **Implemente** endpoints/fluxos: exportar dados, corrigir, excluir/anonimizar, revogar consentimento, e registre o atendimento.

## 5. O que o sistema precisa ter (traduzindo em requisitos)

| Obrigação | Requisito técnico |
|-----------|-------------------|
| Transparência (art. 9º) | Política de privacidade clara, com controlador, finalidades, bases, compartilhamentos, retenção, direitos, contato do encarregado |
| Canal do titular | E-mail dedicado + formulário/endpoint autenticado; procedimento para validar identidade |
| Registro das operações (art. 37) | ROPA/inventário de dados atualizado (ver `templates-documentos.md`) |
| Segurança (art. 46) | Criptografia em trânsito e repouso, controle de acesso, hash de senhas, logs, backups, gestão de vulnerabilidades, treinamento |
| Privacidade desde a concepção (art. 46, §2º) | Minimização, *defaults* restritivos, pseudonimização/anonimização quando possível |
| Retenção | Prazo por tipo de dado e rotina de eliminação |
| RIPD (art. 38) | Relatório de impacto para tratamento de alto risco (sensíveis, grande escala, perfilamento) |
| Compartilhamento | Lista de terceiros, contratos/DPA, cláusulas de confidencialidade e segurança |
| Transferência internacional (art. 33) | Hipótese legal válida (ex.: cláusulas-padrão aprovadas pela ANPD, país adequado, consentimento específico); verifique a regulamentação vigente; documentar onde ficam servidores e serviços (analytics, e-mail, nuvem) |
| Incidente (art. 48) | Plano de resposta; comunicar ANPD e titulares quando houver risco ou dano relevante, **dentro do prazo regulamentado** (a regulamentação da ANPD prevê 3 dias úteis; confirme a regra vigente) |
| Encarregado (art. 41) | Indicar e divulgar contato; há regime simplificado para agentes de pequeno porte (Resolução CD/ANPD nº 2/2022), mas o canal de atendimento ao titular continua necessário |

## 6. Dados de menores

Tratamento de crianças e adolescentes deve atender ao **melhor interesse** (art. 14). Para crianças, consentimento específico de um dos pais ou responsável legal, esforço razoável de verificação e informações em linguagem adequada. Veja também `acessibilidade-ia-criancas-e-marketing.md`.

## 7. Sanções (art. 52)

Advertência; multa simples de até **2 % do faturamento** da pessoa jurídica no Brasil no último exercício, limitada a **R$ 50 milhões por infração**; multa diária; publicização da infração; bloqueio ou eliminação dos dados; suspensão parcial do banco de dados e do exercício da atividade de tratamento. Além disso, há **responsabilidade civil** (art. 42) e ações individuais e coletivas, inclusive por consumidores (CDC).

## 8. Erros comuns de sistemas (evite)

- Coletar CPF, data de nascimento ou endereço "por precaução".
- Banner de cookies sem botão de recusar ou que carrega rastreadores *antes* do consentimento.
- Política de privacidade copiada, genérica, que não bate com o que o sistema faz.
- Guardar dados para sempre; "soft delete" como única forma de exclusão.
- Enviar dados a terceiros (analytics, chat, pixel, e-mail) sem listar na política nem contratar.
- Logs com senhas, tokens, CPF, corpo de requisição completo.
- Ambiente de teste/homologação com **dados reais** de clientes.
- Não ter plano para vazamento, nem quem decide e notifica.
- Dados sensíveis (saúde, biometria) sem RIPD e sem base legal específica.
- E-mail marketing para lista comprada.

## 9. Checklist rápido

- [ ] Inventário de dados com finalidade, base legal e retenção.
- [ ] Política de privacidade fiel ao sistema, publicada e acessível.
- [ ] Banner/gerenciador de cookies com recusa e registro de escolha.
- [ ] Consentimentos versionados e revogáveis.
- [ ] Fluxo de direitos do titular implementado e testado.
- [ ] Segurança documentada (criptografia, acesso, logs, backup, hash de senha).
- [ ] Contratos/DPA com operadores e lista de suboperadores.
- [ ] Transferência internacional mapeada e fundamentada.
- [ ] RIPD quando houver alto risco.
- [ ] Plano de incidentes testado em simulação e contato do encarregado divulgado.
