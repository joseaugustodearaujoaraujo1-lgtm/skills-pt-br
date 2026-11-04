# Checklist jurídico pré-lançamento

Use na véspera do deploy (Etapa 6 da skill `mvp-end-to-end-delivery`). Para cada item, registre **evidência** (link, print, arquivo, commit) e **status**: ✅ verificado · 🟡 parcial · ❌ pendente · N/A. **Itens ❌ marcados como Crítico impedem o lançamento.**

## A. Dados pessoais (LGPD)

| # | Item | Sev. |
|---|------|------|
| A1 | Inventário de dados com finalidade, base legal, retenção e compartilhamentos | Crítico |
| A2 | Política de privacidade publicada, fiel ao sistema, com contato do encarregado/canal do titular | Crítico |
| A3 | Consentimentos (cookies, marketing) registrados, versionados e revogáveis; sem caixas pré-marcadas | Alto |
| A4 | Fluxo de direitos do titular (acesso, correção, exclusão, portabilidade, revogação) implementado e testado | Alto |
| A5 | Dados sensíveis/de crianças ausentes ou com base legal específica e RIPD | Crítico |
| A6 | Contratos/DPA com operadores e lista de suboperadores | Alto |
| A7 | Transferência internacional mapeada e fundamentada | Alto |
| A8 | Retenção e eliminação automatizadas; ambiente de teste sem dados reais | Médio |
| A9 | Plano de incidentes com contatos, modelos de comunicação (ANPD e titulares) e responsável | Alto |

## B. Segurança (LGPD art. 46)

| # | Item | Sev. |
|---|------|------|
| B1 | Senhas com bcrypt/Argon2id; sem segredos no repositório; `.env.example` | Crítico |
| B2 | TLS em tudo; HSTS; cookies `Secure/HttpOnly/SameSite` | Alto |
| B3 | Autorização por objeto testada (acesso cruzado entre usuários) | Crítico |
| B4 | Rate limit, WAF e proteção contra bots em login/cadastro | Alto |
| B5 | Logs sem dados sensíveis; auditoria de ações críticas | Alto |
| B6 | Backups automáticos e restauração testada | Alto |
| B7 | Dependências auditadas; sem vulnerabilidades críticas conhecidas | Alto |
| B8 | `SECURITY.md`/canal de reporte de vulnerabilidades | Baixo |

## C. Consumidor e e-commerce

| # | Item | Sev. |
|---|------|------|
| C1 | Razão social, CNPJ, endereço, e-mail e telefone no rodapé | Crítico |
| C2 | Preço total (produto + frete + taxas) e prazos de entrega claros antes de pagar | Crítico |
| C3 | Direito de arrependimento de 7 dias com meio de exercício no site | Crítico |
| C4 | Política de troca, garantia legal/contratual, assistência técnica | Alto |
| C5 | Termos de uso e resumo do contrato antes da compra; sem cláusulas abusivas | Alto |
| C6 | Confirmação imediata do pedido; SAC com protocolo e prazos | Alto |
| C7 | Descrições/imagens fiéis ao produto; promoções com regras | Médio |
| C8 | Sem *dark patterns* (contagem falsa, checkbox pré-marcado, cancelamento escondido) | Alto |

## D. Logs e conteúdo (Marco Civil)

| # | Item | Sev. |
|---|------|------|
| D1 | Registros de acesso (IP, data/hora, fuso) retidos por 6 meses, protegidos e separados | Alto |
| D2 | Procedimento para ordens judiciais e preservação de dados | Médio |
| D3 | Termos de conteúdo, canal de denúncia e fluxo de remoção (se houver conteúdo de usuários) | Alto |

## E. Propriedade intelectual

| # | Item | Sev. |
|---|------|------|
| E1 | Inventário de licenças das dependências; nenhuma incompatível (AGPL/GPL, não comerciais) | Alto |
| E2 | Fontes, ícones, imagens, vídeos e músicas licenciados para uso comercial | Alto |
| E3 | Imagens/vídeos de IA com prova de origem; sem pessoas reais nem marcas de terceiros | Alto |
| E4 | Busca de anterioridade da marca no INPI e domínio no nome do negócio | Médio |
| E5 | Contrato define titularidade do código | Alto |

## F. Pagamentos e fiscal

| # | Item | Sev. |
|---|------|------|
| F1 | Nenhum dado de cartão armazenado ou logado; gateway PCI | Crítico |
| F2 | Webhooks assinados, idempotentes; conciliação de pagamentos | Alto |
| F3 | Emissão de nota fiscal definida com contador; NCM dos produtos | Alto |
| F4 | Fluxo de reembolso/estorno e *chargeback* | Médio |

## G. Acessibilidade, marketing e outros

| # | Item | Sev. |
|---|------|------|
| G1 | Auditoria WCAG 2.2 AA (teclado, leitor de tela, contraste, movimento reduzido) | Alto |
| G2 | Banner de cookies com recusa; rastreadores só após consentimento | Alto |
| G3 | E-mail marketing com opt-in e descadastro simples | Médio |
| G4 | Promoções/sorteios com regras e autorização quando exigida | Médio |
| G5 | Público de menores tratado (restrição ou proteção) | Alto |
| G6 | IA: transparência, DPA com provedor, revisão humana | Médio |

## H. Testes e infraestrutura

| # | Item | Sev. |
|---|------|------|
| H1 | Testes de segurança/carga somente em ambientes próprios, autorizados e com dados sintéticos | Crítico |
| H2 | Contratos com provedores (hospedagem, CDN, e-mail, gateway) revisados | Médio |
| H3 | Plano de rollback e canal de contato jurídico divulgado | Médio |

## Fechamento

1. Some os itens ❌ por severidade; **bloqueie o lançamento** se houver Crítico pendente.
2. Gere o relatório de conformidade no formato da skill.
3. Liste o que requer revisão de advogado(a)/contador(a) e **entregue ao usuário** com o aviso: *este checklist reduz riscos, não garante isenção de responsabilidade nem substitui assessoria jurídica*.
