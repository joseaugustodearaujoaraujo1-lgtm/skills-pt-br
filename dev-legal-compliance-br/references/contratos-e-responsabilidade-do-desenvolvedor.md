# Contratos e responsabilidade do desenvolvedor

Base: **Código Civil** (contratos, responsabilidade civil), **CDC** (quando há consumidor), **Lei 9.609/98**, **LGPD**, **Lei 13.874/2019** (liberdade econômica), **Lei 14.063/2020** e **MP 2.200-2/2001** (assinatura eletrônica). Contratos devem ser revisados por advogado(a); aqui estão os pontos que evitam as disputas mais comuns.

## 1. Quem é você na relação?

| Papel | Observação |
|-------|------------|
| Empregado/CLT | O empregador assume riscos e direitos conforme o contrato de trabalho |
| PJ / freelancer / agência (prestação de serviços) | Responde pelo que contratou; **contrato escrito** é essencial |
| Dono do produto (SaaS próprio) | Responde perante usuários (CDC/LGPD) como fornecedor/controlador |
| Operador de dados do cliente | Segue instruções do controlador; responde por falhas de segurança e desvios |

## 2. Cláusulas essenciais do contrato de desenvolvimento

1. **Partes** com qualificação completa e representantes.
2. **Objeto e escopo:** funcionalidades, entregáveis, critérios de aceite (ligar ao documento de requisitos), o que está **fora** do escopo e como tratar mudanças (solicitação de alteração, estimativa, aprovação por escrito).
3. **Cronograma e marcos**, dependências do cliente (acessos, conteúdo, decisões) e consequência de atraso de cada lado.
4. **Preço e pagamento:** valor, parcelas, reajuste, multa/juros, tributos, despesas reembolsáveis (hospedagem, APIs, domínios).
5. **Propriedade intelectual:** cessão (total/parcial) ou licença do código e dos ativos; exceções (bibliotecas de terceiros, *frameworks* próprios, ferramentas reutilizáveis do desenvolvedor); quando a cessão ocorre (após pagamento integral); direito de portfólio.
6. **Licenças de terceiros:** quem contrata, quem paga e quem responde por conformidade (fontes, imagens, plugins, APIs).
7. **Confidencialidade** e uso de informações.
8. **Proteção de dados (LGPD):** papéis (controlador/operador), finalidade, instruções, medidas de segurança, suboperadores, atendimento a titulares, incidentes (prazo de comunicação ao cliente), devolução/eliminação ao término — ver modelo de **DPA** em `templates-documentos.md`.
9. **Garantia e suporte:** período de correção de defeitos (ex.: 30–90 dias) sem custo, definição do que é "defeito" e do que é "nova funcionalidade"; SLA de suporte, horários e canais.
10. **Manutenção e hospedagem:** quem opera, atualiza dependências, faz backup, monitora; custos recorrentes.
11. **Limitação de responsabilidade:** teto razoável (ex.: valor do contrato) e exclusão de lucros cessantes **entre empresas**. **Atenção:** a limitação **não vale** contra consumidor final (CDC), nem em caso de dolo ou culpa grave, nem afasta obrigações legais (LGPD).
12. **Segurança:** o que o desenvolvedor se compromete a fazer (boas práticas, testes) e o que depende do cliente (gestão de senhas, equipe, hospedagem). **Nenhum contrato deve prometer "sistema 100 % seguro"** — prometa meios, processos e padrões, não resultado absoluto.
13. **Rescisão:** causas, aviso, pagamento proporcional, entrega do código-fonte e acessos, transição.
14. **Foro e lei aplicável;** mediação/arbitragem se desejarem.
15. **Assinatura** eletrônica (certificado ICP-Brasil ou plataforma que registre autoria, data e integridade — válida entre as partes conforme Lei 14.063/2020 e MP 2.200-2).

## 3. Termo de aceite e registro

- A cada marco, **termo de aceite** com a lista do que foi entregue e testado.
- Registre solicitações por e-mail/ferramenta de gestão (rastro de mudanças).
- Se o cliente não responder, prever **aceite tácito** após X dias úteis.

## 4. Responsabilidades e riscos do desenvolvedor

- **Responsabilidade contratual:** por inadimplemento, atraso ou defeito. Reduza com escopo claro, aceite formal e testes.
- **Responsabilidade civil por danos a terceiros:** vazamento por falta de controles razoáveis pode gerar indenização ao titular (LGPD art. 42) e ações regressivas entre controlador e operador.
- **Responsabilidade perante consumidor:** se você é o fornecedor (loja/SaaS próprio), a responsabilidade é objetiva e solidária na cadeia.
- **Responsabilidade profissional/ética:** declare limitações; não invente conformidade ("certificado LGPD" não existe como selo único oficial).
- **Seguro:** considere seguro de responsabilidade civil profissional/cibernético para projetos de risco.
- **Registros de decisão:** documente suas recomendações de segurança e as recusas do cliente (ex.: "cliente optou por não implementar MFA"). Isso protege você e esclarece responsabilidades.

## 5. Termos de uso do seu próprio produto (SaaS/loja)

- Definição do serviço, planos e preços, regras de conta, uso aceitável e proibições, propriedade intelectual, conteúdo de usuário, suspensão/cancelamento, limitação de responsabilidade (respeitando CDC), disponibilidade/SLA, alterações com aviso prévio, privacidade (remissão), foro (domicílio do consumidor quando houver consumo).
- Aceite **registrado** (versão, data, IP/UA se necessário); novo aceite quando houver mudança relevante.

## 6. Relação com terceiros (subcontratados e fornecedores)

- Exija contratos com subcontratados: confidencialidade, LGPD, segurança, propriedade do código.
- Faça *due diligence* simples: onde ficam os dados, certificações (ISO 27001, SOC 2), política de incidentes, e se há suboperadores.
- Mantenha lista de **suboperadores** e comunique o cliente conforme o contrato.

## 7. Checklist

- [ ] Contrato escrito com escopo, aceite, mudanças e preço.
- [ ] Cessão/licença do código e ativos definida; licenças de terceiros alocadas.
- [ ] DPA/anexo de dados pessoais com papéis e prazos de incidente.
- [ ] Garantia, suporte e manutenção definidos; limitação de responsabilidade adequada.
- [ ] Nenhuma promessa de "segurança absoluta".
- [ ] Termos de uso e política de privacidade do produto, com registro de aceite.
- [ ] Contratos com subcontratados e fornecedores críticos.
- [ ] Termos de aceite por marco e histórico de mudanças.
