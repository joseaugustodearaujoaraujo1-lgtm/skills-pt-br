---
name: mvp-end-to-end-delivery
description: Conduz qualquer MVP (site, loja virtual, SaaS, API, painel, app web) do zero à produção em 6 etapas com portões de aprovação - 1) requisitos, segurança e questões jurídicas, 2) design do sistema, 3) API segura, 4) documentação da API, 5) deploy com DNS no Cloudflare, 6) teste de carga com k6. Use sempre que alguém pedir para criar, planejar, lançar ou "colocar no ar" um sistema, MVP, protótipo funcional, e-commerce, landing page com backend, ou perguntar "por onde começo", "como lanço meu sistema", "como escalar", "como documentar a API", "como configurar o domínio no Cloudflare" ou "como fazer teste de carga", mesmo que a pessoa não cite as 6 etapas nem a palavra MVP.
---

# MVP de Ponta a Ponta — do requisito ao teste de carga

Skill para entregar um **MVP real, seguro e juridicamente prudente** em seis etapas. Foi escrita para ser usada por qualquer pessoa, em qualquer tipo de sistema. Cada etapa tem um objetivo, entradas, atividades, entregáveis, um **critério de pronto** e um **portão de aprovação**.

> Princípio central: o MVP certo é o **menor sistema que resolve o problema real com segurança**, não o que usa mais tecnologia. Se uma etapa não se aplica (por exemplo, uma landing page estática não precisa de API), registre o motivo e pule-a.

## 1. Quando usar e quando não usar

**Use** para: loja virtual, site institucional com formulário ou painel, SaaS, API para app mobile, sistema interno, marketplace, plataforma de agendamento, dashboards com login.

**Não use** (ou use só as etapas pertinentes) para: script descartável, ajuste pontual de código, protótipo visual sem dados, correção de bug isolado.

**Skill irmã:** `dev-legal-compliance-br` cobre LGPD, consumidor, Marco Civil, propriedade intelectual, pagamentos e responsabilidade do desenvolvedor. Carregue-a na Etapa 1 e revise-a antes da Etapa 5 (lançamento). Se ela não estiver instalada, siga o checklist mínimo em `references/etapa-1-requisitos.md` (seção "Jurídico mínimo") e avise o usuário.

## 2. Regras de conduta (valem para as seis etapas)

1. **Entenda antes de construir.** Pergunte só o que muda a solução; não faça interrogatório. Registre suposições explicitamente.
2. **Portões de aprovação.** Ao fim de cada etapa, apresente o resumo e o que fará a seguir, e peça confirmação antes de iniciar a próxima. Aprovação de uma etapa não vale para a seguinte.
3. **Ações externas exigem confirmação específica:** criar contas, comprar domínio, publicar, alterar DNS, gerar custo, enviar tráfego de teste para servidor, apagar dados. Descreva o efeito e o custo antes.
4. **Nunca peça nem aceite senhas, tokens ou chaves no chat.** O usuário os coloca em variáveis de ambiente ou no gerenciador de segredos. Em login/2FA de painéis (Cloudflare, registrador, provedor), quem autentica é o usuário.
5. **Segurança e jurídico por padrão (*by design*), não no fim.** Cada requisito sensível recebe um controle na própria etapa em que nasce.
6. **Simplicidade.** Sem camadas, serviços ou dependências "para o futuro". Cada item do código deve rastrear até um requisito.
7. **Evidência, não promessa.** Diferencie sempre: *planejado*, *aprovado*, *implementado*, *testado*, *publicado*. Só diga "testado" se rodou o teste e viu o resultado; só diga "no ar" se abriu a URL.
8. **Preserve o que existe.** Em projeto existente, mantenha a stack e as convenções; faça mudanças cirúrgicas.
9. **Idioma:** converse no idioma do usuário; mantenha nomes técnicos, comandos e identificadores de código em inglês.

## 3. Mapa das 6 etapas

| # | Etapa | Entregável principal | Critério de pronto | Portão |
|---|-------|----------------------|--------------------|--------|
| 1 | **Requisitos, segurança e jurídico** | `docs/01-requisitos.md` (escopo MVP, RF/RNF, modelagem de ameaças, inventário de dados, matriz jurídica, riscos) | Todo requisito tem critério de aceite; toda ameaça alta tem controle; todo dado pessoal tem finalidade e base legal | Usuário aprova o escopo |
| 2 | **Design do sistema** | `docs/02-design/` (arquitetura, fluxos, modelo de dados, design system, protótipo, storyboard de motion, briefs de mídia) | Fluxos principais cobertos; tokens claro/escuro com contraste AA; orçamento de performance definido | Usuário aprova o design |
| 3 | **API segura** | Código da API + testes | OWASP API Top 10 mapeado e testado; testes passando; sem segredos no repositório | Usuário revisa e aprova |
| 4 | **Documentação da API** | OpenAPI 3.1 + guia de uso + catálogo de erros | Spec válida (lint), exemplos reais testados, auth e limites documentados | Usuário aprova |
| 5 | **Deploy + DNS no Cloudflare** | Sistema publicado e domínio configurado | HTTPS válido, headers de segurança, WAF/rate limit ativos, rollback testado, monitoramento ligado | Confirmação explícita antes de publicar |
| 6 | **Teste de carga com k6** | Scripts k6 + relatório de capacidade | Limiares (p95, taxa de erro) atingidos ou gargalos listados com plano de correção | Confirmação explícita antes de gerar carga |

Detalhes de cada etapa estão nos arquivos de referência. **Leia apenas o da etapa em que está trabalhando.**

- Etapa 1 → `references/etapa-1-requisitos.md`
- Etapa 2 → `references/etapa-2-design.md` (e `references/media-prompts.md` se houver imagens ou vídeos gerados por IA)
- Etapa 3 → `references/etapa-3-api-segura.md`
- Etapa 4 → `references/etapa-4-documentacao.md`
- Etapa 5 → `references/etapa-5-deploy-cloudflare.md`
- Etapa 6 → `references/etapa-6-teste-carga-k6.md`

## 4. Fluxo de trabalho

### Passo 0 — Triagem (antes de qualquer etapa)

Responda, com o usuário, em no máximo 5 perguntas relevantes:

1. Qual problema o sistema resolve e para quem?
2. Qual é o resultado mínimo que prova valor (o MVP)?
3. Há dados pessoais, pagamentos ou conteúdo de terceiros?
4. Existe stack, hospedagem, domínio ou prazo já definidos?
5. Quais etapas o usuário quer percorrer agora?

Produza um **resumo de escopo** (objetivo, usuários, funcionalidades essenciais, fora de escopo, suposições) e peça aprovação para iniciar a Etapa 1.

### Passo 1 — Percorra as etapas em ordem

Ordem padrão 1→6. Variações aceitáveis:

| Tipo de projeto | Etapas |
|-----------------|--------|
| Site estático / landing page | 1, 2, 5 (sem API; k6 só para o CDN, opcional) |
| API para terceiros | 1, 3, 4, 5, 6 (design = contratos e modelo de dados) |
| Loja virtual / SaaS | 1 a 6 completas |
| Sistema interno | 1, 2, 3, 5 (4 e 6 conforme público e criticidade) |

Registre a decisão de pular etapas em `docs/00-escopo.md`.

### Passo 2 — Ao fim de cada etapa

Entregue este bloco ao usuário:

```
## Etapa N concluída — <nome>
- Feito: <lista curta, com caminhos de arquivos>
- Verificado: <comandos rodados e resultado real>
- Não verificado / pendente: <honestamente>
- Decisões e suposições: <lista>
- Riscos abertos: <lista com severidade>
- Próxima etapa proposta: <escopo, custo/efeito externo se houver>
Posso começar a próxima etapa?
```

## 5. Estrutura de pastas recomendada

```
projeto/
├── docs/
│   ├── 00-escopo.md
│   ├── 01-requisitos.md
│   ├── 02-design/            (arquitetura.md, fluxos.md, dados.md, design-system.md, motion.md, midia.md)
│   ├── 04-api/               (openapi.yaml, guia.md, erros.md)
│   ├── 05-deploy.md
│   ├── 06-carga/             (relatorio.md)
│   └── legal/                (politica-privacidade.md, termos.md, ropa.md, ...)
├── api/                      (src/, tests/, .env.example)
├── web/                      (front-end, se houver)
├── load-tests/               (scripts k6)
└── README.md
```

## 6. Definição de "MVP pronto"

- [ ] Fluxo principal do usuário funciona de ponta a ponta em produção (ou em ambiente equivalente).
- [ ] Nenhum segredo no repositório; `.env.example` completo; segredos rotacionáveis.
- [ ] Autenticação e autorização testadas (inclusive acesso a recursos de outro usuário).
- [ ] Dados pessoais mínimos, com política de privacidade, termos e canal do titular publicados.
- [ ] Logs úteis sem dados sensíveis; alertas básicos ligados.
- [ ] Backup e restauração do banco testados pelo menos uma vez.
- [ ] Documentação suficiente para outra pessoa operar (README + OpenAPI + runbook curto).
- [ ] Teste de carga com meta documentada e resultado registrado.
- [ ] Lista de pendências conhecidas e o que ficou fora do MVP.

## 7. Erros comuns que esta skill previne

- Começar a codar sem escopo e descobrir tarde que faltava pagamento, nota fiscal ou LGPD.
- Tratar segurança como "fase final" e esquecer autorização por objeto (BOLA/IDOR).
- Publicar com `CORS: *`, segredos no Git, console de admin aberto ou erros com *stack trace* na resposta.
- Trocar DNS sem reduzir TTL, exportar a zona ou ter plano de rollback.
- Rodar k6 contra produção sem janela, ou contra sistema de terceiros.
- Afirmar que "está seguro" porque o build passou.

## 8. Integração opcional com outras skills

Se estiverem instaladas, use: **design/UI** (tokens, componentes e motion), **GSAP** (ScrollTrigger e timelines), **auditoria OWASP/API** (revisão da Etapa 3), **dev-legal-compliance-br** (Etapas 1 e 5). Skills são apoio: o escopo aprovado pelo usuário continua sendo o limite.
