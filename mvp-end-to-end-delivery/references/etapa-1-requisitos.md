# Etapa 1 — Requisitos, segurança e questões jurídicas

**Objetivo:** transformar uma ideia em um escopo de MVP verificável, com riscos de segurança e de conformidade legal identificados *antes* de desenhar ou codar.

**Entrada:** resumo de escopo do Passo 0. **Saída:** `docs/01-requisitos.md` aprovado.

## 1.1 Levantamento (entrevista curta)

Pergunte somente o que muda decisões. Cubra:

| Tema | Perguntas-chave |
|------|-----------------|
| Problema | Que dor resolve? Como é resolvida hoje? Como saberemos que funcionou (métrica)? |
| Usuários | Quem usa? Há perfis (cliente, admin, operador)? Há menores de idade? |
| Funções | O que é *indispensável* para o primeiro lançamento? O que fica para depois? |
| Dados | Quais dados são coletados? Pessoais? Sensíveis (saúde, biometria, origem racial, religião, etc.)? Financeiros? |
| Integrações | Pagamento, frete, e-mail/SMS, ERP, nota fiscal, login social? |
| Restrições | Orçamento, prazo, stack obrigatória, hospedagem, equipe que vai manter. |
| Escala | Usuários esperados no mês 1 e em 12 meses; picos (promoções, campanhas). |
| Operação | Quem atende suporte? Quem responde a incidentes? Quem recebe pedidos do titular de dados? |

## 1.2 Escopo do MVP (MoSCoW)

Classifique cada funcionalidade como **Must** (sem isso não lança), **Should**, **Could**, **Won't (agora)**. O MVP contém apenas os *Must*, mais o mínimo de *Should* que o usuário justificar. Registre os *Won't* para evitar expansão de escopo.

## 1.3 Requisitos funcionais (RF) e critérios de aceite

Formato obrigatório, um por linha:

```
RF-007 | Como cliente, quero pagar por Pix para finalizar a compra sem cartão.
Aceite: dado um carrinho válido, quando escolho Pix, então recebo QR/copia-e-cola com expiração de 30 min e o pedido muda para "aguardando pagamento"; ao confirmar o webhook assinado, muda para "pago".
Prioridade: Must | Risco: pagamento | Dados: valor, id do pedido
```

Sem critério de aceite testável, o requisito não está pronto.

## 1.4 Requisitos não funcionais (RNF) com números

- **Desempenho:** ex.: p95 < 500 ms nas rotas de leitura; LCP < 2,5 s em 4G.
- **Disponibilidade:** ex.: 99,5 % (aceita ~3,6 h de indisponibilidade/mês).
- **Capacidade:** ex.: 200 usuários simultâneos, 50 req/s sustentados (será validado na Etapa 7).
- **Segurança:** autenticação, autorização, criptografia em trânsito e em repouso, auditoria.
- **Privacidade:** minimização, retenção, direitos do titular.
- **Acessibilidade:** WCAG 2.2 AA (obrigação legal prática no Brasil, ver skill jurídica).
- **Manutenibilidade, observabilidade, backup (RPO/RTO).**

## 1.5 Inventário de dados (base da LGPD)

Tabela obrigatória:

| Dado | Titular | Finalidade | Base legal | Sensível? | Onde fica | Quem acessa | Retenção | Compartilhado com |
|------|---------|-----------|------------|-----------|-----------|-------------|----------|-------------------|

Regras: colete o mínimo; não armazene o que não usar; dados de cartão **não** passam pelo seu servidor (use o gateway/tokenização); defina prazo de exclusão para cada dado.

## 1.6 Modelagem de ameaças (rápida e útil)

1. **Desenhe o fluxo de dados** (usuário → front → API → banco → terceiros) e marque as *fronteiras de confiança*.
2. **Aplique STRIDE** em cada fluxo: Spoofing (falsificação), Tampering (adulteração), Repudiation (repúdio), Information disclosure (vazamento), Denial of service (negação de serviço), Elevation of privilege (escalada).
3. **Pontue** probabilidade × impacto (baixa/média/alta).
4. **Atribua controle** a cada ameaça média/alta e vincule a um requisito.

Ameaças que quase todo MVP precisa tratar:

| Ameaça | Controle mínimo |
|--------|-----------------|
| Acesso a dados de outro usuário (BOLA/IDOR) | Autorização por objeto em toda rota; testes de acesso cruzado |
| Força bruta e *credential stuffing* | Rate limit por IP e por conta, bloqueio progressivo, MFA para admin |
| Injeção (SQL/NoSQL/comando) | Consultas parametrizadas, validação por schema |
| XSS / CSRF | Escape de saída, CSP, cookies `HttpOnly`+`SameSite`, token CSRF quando usar cookies |
| Vazamento de segredos | Variáveis de ambiente, scanners de segredos no CI, rotação |
| Upload malicioso | Lista de tipos, limite de tamanho, renomear, armazenar fora do webroot, antivírus se necessário |
| Fraude de pagamento / webhook falso | Assinatura do webhook, idempotência, conciliação |
| Enumeração de usuários | Mensagens genéricas em login e recuperação de senha |
| Dependências vulneráveis | `npm audit`/Dependabot, *lockfile*, revisão de pacotes novos |
| Negação de serviço | Rate limit, limites de payload e de paginação, cache, CDN/WAF |

Referências para consulta: OWASP Top 10 (web), OWASP API Security Top 10 (2023), OWASP ASVS (nível 1 para MVP, nível 2 se houver dados sensíveis ou dinheiro).

## 1.7 Jurídico mínimo (se a skill `dev-legal-compliance-br` não estiver disponível)

Ao menos: (a) definir controlador e operadores e **base legal** por finalidade (LGPD); (b) política de privacidade e termos de uso claros; (c) canal para o titular exercer direitos; (d) aviso e preferências de cookies (recusar não essencial); (e) se vender a consumidor: dados do fornecedor (razão social, CNPJ, endereço, contato) visíveis, preço total claro, **direito de arrependimento de 7 dias** em compras online, política de troca/garantia e SAC; (f) guarda de **registros de acesso por 6 meses** (Marco Civil); (g) não armazenar dados de cartão; (h) licenças de bibliotecas, fontes e imagens conferidas; (i) acessibilidade básica. **Isto não substitui revisão de advogado**; indique ao usuário que contratos e documentos finais devem ser revisados por profissional habilitado.

## 1.8 Riscos, premissas e decisões

- **Registro de riscos:** descrição, probabilidade, impacto, mitigação, responsável.
- **ADRs (decisões de arquitetura) curtas:** contexto → decisão → alternativas → consequências. Registre as escolhas de stack, banco, hospedagem e provedores de pagamento.
- **Custos estimados:** hospedagem, domínio, e-mail, gateway (taxas por transação), CDN, monitoramento.

## 1.9 Template de `docs/01-requisitos.md`

```
# Requisitos — <Sistema>
1. Visão e métricas de sucesso
2. Usuários e perfis
3. Escopo do MVP (Must/Should/Could/Won't)
4. Requisitos funcionais (RF) com critérios de aceite
5. Requisitos não funcionais (RNF) com números
6. Inventário de dados e base legal
7. Modelagem de ameaças (fluxo, STRIDE, controles)
8. Matriz jurídica (lei → obrigação → como atendemos → status)
9. Integrações e dependências externas
10. Riscos, premissas e ADRs
11. Custos estimados
12. Perguntas em aberto
```

## 1.10 Critério de pronto e portão

- [ ] Cada RF tem critério de aceite testável e prioridade.
- [ ] Cada RNF tem número e forma de medir.
- [ ] Cada ameaça média/alta tem controle atribuído a um requisito.
- [ ] Cada dado pessoal tem finalidade, base legal, retenção e responsável.
- [ ] Matriz jurídica preenchida e lista de documentos a produzir.
- [ ] Usuário aprovou o escopo e as suposições por escrito na conversa.

Antes de passar para a Etapa 2, apresente o bloco de fechamento (ver `SKILL.md`, seção 4) e pergunte se pode começar.
