---
name: judicial-sistema
description: Guia jurídico prático para desenvolvedores e sistemas no Brasil, para construir software seguro e reduzir o risco de processos, multas e responsabilização - LGPD, Código de Defesa do Consumidor e e-commerce, Marco Civil da Internet e guarda de logs, propriedade intelectual e licenças open source, pagamentos e nota fiscal, crimes cibernéticos e testes de segurança, contratos e responsabilidade do desenvolvedor, acessibilidade, cookies, IA e dados de crianças. Use sempre que o usuário criar, revisar ou lançar site, loja virtual, app, API, SaaS ou automação que colete dados, venda a consumidores, aceite pagamentos, use conteúdo de terceiros ou rode testes de carga/segurança; e quando perguntar "preciso de política de privacidade?", "posso guardar esse dado?", "isso dá processo?", "LGPD", "direito de arrependimento", "posso usar essa imagem/biblioteca?", "contrato de freelancer" ou "quanto tempo guardo os logs", mesmo sem citar a lei.
---

# Conformidade Jurídica para Desenvolvedores (Brasil)

Skill para **projetar e entregar sistemas que respeitam a lei brasileira**, transformando obrigações legais em requisitos técnicos e documentos concretos. O objetivo é *reduzir* substancialmente o risco de processos, multas e danos a usuários.

> **Aviso importante.** Esta skill é material educativo e de apoio técnico. **Não é aconselhamento jurídico** e não elimina risco: nenhuma medida garante ausência de processos. Leis, regulamentos e decisões judiciais mudam; confirme a vigência atual nas fontes oficiais (Planalto, ANPD, STF/STJ, Banco Central, Receita) e **revise contratos e documentos finais com advogado(a)**, principalmente em casos de dados sensíveis, crianças, saúde, finanças, grande escala ou litígio. Diga isso ao usuário no relatório final.

## 1. Quando usar

- Na **Etapa 1** (requisitos) de qualquer sistema: gerar a matriz jurídica e a lista de documentos.
- Na **revisão pré-lançamento** (antes do deploy): rodar o checklist de `references/checklist-pre-lancamento.md`.
- Em **perguntas pontuais**: "preciso de consentimento?", "por quanto tempo guardo?", "posso usar esta biblioteca?".
- Em **contratos de desenvolvimento** (freelancer, agência) e em integração com terceiros (operadores de dados).

## 2. Princípios (as 12 regras de ouro)

1. **Minimização:** colete só o que precisa, pelo tempo que precisar.
2. **Finalidade e base legal para cada dado** (LGPD art. 6º e 7º/11): sem finalidade clara, não colete.
3. **Transparência:** o usuário sabe quem é você, o que faz com os dados e como exercer direitos, em linguagem simples.
4. **Segurança como obrigação legal** (LGPD art. 46): controles técnicos e administrativos proporcionais ao risco, documentados.
5. **Consumidor protegido por padrão:** oferta clara, preço total, arrependimento de 7 dias, SAC, sem cláusulas abusivas nem *dark patterns*.
6. **Registros de acesso guardados e protegidos** (Marco Civil), separados e com acesso restrito.
7. **Nada de dados de cartão** no seu sistema; pagamentos por gateway/PSP certificado.
8. **Origem e licença de tudo:** código, bibliotecas, fontes, imagens, vídeos e textos têm licença; guarde a prova.
9. **Autorização por escrito** para testar segurança/carga em qualquer sistema que não seja seu.
10. **Contrato claro:** escopo, cessão de direitos, responsabilidades, suporte e proteção de dados definidos por escrito.
11. **Acessibilidade e inclusão** são exigência legal para sites de empresas no país.
12. **Incidente é questão de "quando"**: plano de resposta, registro e comunicação no prazo.

## 3. Mapa rápido de risco

| Área | Normas principais | Risco típico | Controle técnico/documental | Referência |
|------|------------------|--------------|------------------------------|------------|
| Dados pessoais | LGPD (Lei 13.709/2018), regulamentos da ANPD | Multa, sanção, ação coletiva, indenização | Inventário, bases legais, política, canal do titular, segurança, RIPD, plano de incidentes | `references/lgpd-protecao-de-dados.md` |
| Venda online | CDC (Lei 8.078/1990), Decreto 7.962/2013, Decreto 11.034/2022 | Ação de consumidor, Procon, devolução, danos morais | Dados do fornecedor, preço/frete claro, arrependimento, garantia, SAC, termos sem abusividade | `references/consumidor-e-comercio-eletronico.md` |
| Registros e conteúdo de terceiros | Marco Civil (Lei 12.965/2014), Decreto 8.771/2016 | Ordem judicial sem logs; responsabilização por conteúdo | Guarda de 6 meses de registros, canal de denúncia, moderação, termos | `references/marco-civil-logs-e-responsabilidade.md` |
| Propriedade intelectual | Leis 9.609/98, 9.610/98, 9.279/96 | Ação por uso indevido, remoção, indenização | Inventário de licenças, imagens/fontes licenciadas, registro de marca, cessão formal | `references/propriedade-intelectual-e-licencas.md` |
| Pagamentos e fiscal | PCI DSS, normas do BCB, legislação tributária | Fraude, vazamento financeiro, autuação fiscal | Gateway, tokenização, conciliação, emissão de nota, contador | `references/pagamentos-fiscal-e-financeiro.md` |
| Segurança e crimes | Lei 12.737/2012, Lei 14.155/2021, CP art. 154-A | Responsabilização penal por testes sem autorização | Autorização escrita, escopo, ambiente de teste, política de divulgação | `references/seguranca-crimes-e-testes.md` |
| Contratos e responsabilidade | Código Civil, CDC, Lei 14.063/2020, Lei 13.874/2019 | Disputa de escopo, propriedade do código, SLA, responsabilidade solidária | Contrato, termo de aceite, DPA, limites de responsabilidade | `references/contratos-e-responsabilidade-do-desenvolvedor.md` |
| Inclusão, IA, crianças, marketing | Lei 13.146/2015, LGPD art. 14 e 20, ECA Digital, normas de publicidade | Sanção, ação civil pública, danos | WCAG, cookies, revisão de decisões automatizadas, controle de idade, opt-in e opt-out | `references/acessibilidade-ia-criancas-e-marketing.md` |

Leia **apenas** os arquivos de referência das áreas que o projeto toca.

## 4. Fluxo de trabalho

### A) Diagnóstico (5 perguntas)

1. O sistema coleta dados pessoais? Quais, de quem, para quê? (Há sensíveis, de crianças ou financeiros?)
2. Vende produtos/serviços a consumidores no Brasil?
3. Aceita pagamentos, emite notas ou guarda dados financeiros?
4. Hospeda conteúdo de usuários ou integra serviços de terceiros (operadores)?
5. Terá usuários no exterior ou usa servidores/serviços fora do Brasil?

Se for entrar em produção com perfil de risco alto (dados sensíveis, saúde, crianças, financeiro, grande volume), **recomende fortemente consultoria jurídica especializada** desde o início.

### B) Matriz jurídica

Produza `docs/legal/matriz-juridica.md`:

```
| # | Obrigação | Fonte legal | Como atendemos (requisito/controle) | Responsável | Status (planejado/implementado/verificado) | Evidência |
```

### C) Documentos a gerar (rascunhos para revisão jurídica)

Use `references/templates-documentos.md`: Política de Privacidade, Termos de Uso, Política de Cookies, Política de Troca/Devolução e Garantia, Registro das Operações de Tratamento (ROPA), Relatório de Impacto (RIPD), Plano de Resposta a Incidentes, Contrato com Operador/Suboperador (DPA), Checklist de Terceiros. Marque todo rascunho com *"Rascunho — requer revisão jurídica"*.

### D) Implementação técnica

Traduza em tarefas: banners de cookies com recusa, páginas legais, endpoints de direitos do titular, consentimentos versionados, retenção/expurgo, logs de acesso, headers de segurança, botão de arrependimento, avisos de preço/frete, emissão de nota, etc. Integre ao backlog da skill `mvp-completo` quando houver.

### E) Revisão pré-lançamento

Execute `references/checklist-pre-lancamento.md`, item a item, com evidência. Entregue o relatório abaixo.

## 5. Formato do relatório de conformidade

```
# Relatório de conformidade — <Sistema> — <data>
## Resumo executivo (risco geral: baixo/médio/alto) 
## Escopo e premissas
## Achados
| Sev. | Área | Achado | Base legal | Correção recomendada | Esforço |
## Documentos produzidos (e status de revisão jurídica)
## Pendências que exigem advogado(a)/contador(a)
## Limitações (o que não foi verificado)
## Aviso: material de apoio, não é aconselhamento jurídico
```

Severidade: **Crítico** (impede lançamento: dado sensível sem proteção, cartão armazenado, ausência de base legal, teste sem autorização), **Alto**, **Médio**, **Baixo**.

## 6. Quando escalar para profissional humano

Procure advogado(a) quando houver: dados sensíveis ou de crianças em escala; transferência internacional; decisões automatizadas com efeito relevante; vazamento ocorrido; notificação, processo ou ordem judicial; contratos de alto valor; marketplaces; fintech, saúde, educação; propriedade de código em litígio. Procure contador(a) para regime tributário e notas fiscais. Procure DPO/encarregado(a) quando a operação exigir.

## 7. Cuidado com o que esta skill não faz

- Não afirma que "está 100 % legal" nem garante isenção de responsabilidade.
- Não substitui parecer jurídico nem representa o usuário.
- Não cobre legislação de outros países (GDPR, CCPA) — se houver usuários no exterior, sinalize e recomende análise específica.
- Dados desatualizados: leis e prazos devem ser conferidos na data do uso. Quando houver dúvida sobre vigência (por exemplo, normas recentes de proteção de crianças e de IA), diga explicitamente que precisa ser verificada.
