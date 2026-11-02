# Estruturas de documentos legais (rascunhos para revisão jurídica)

> **Todos estes modelos são esqueletos.** Preencha com os dados reais do sistema (um texto genérico que não bate com o que o sistema faz **agrava** o risco). Marque cada documento como *"Rascunho — requer revisão jurídica"* até um(a) advogado(a) validar. Use `[colchetes]` para dados a preencher.

## 1. Política de Privacidade

1. **Quem somos:** razão social, CNPJ, endereço, e-mail; **encarregado/canal do titular**.
2. **Quais dados coletamos** (tabela: dado, origem, finalidade, base legal, retenção).
3. **Como usamos** (cadastro, compra, entrega, suporte, segurança, marketing, melhorias).
4. **Compartilhamento:** categorias de terceiros (gateway, transportadora, e-mail, analytics, hospedagem), motivo e país; **transferência internacional**.
5. **Cookies e tecnologias similares** (link para a política de cookies).
6. **Por quanto tempo guardamos** e critérios de eliminação (inclusive registros de acesso por 6 meses).
7. **Seus direitos** (art. 18) e **como exercê-los** (canal, prazo, validação de identidade).
8. **Segurança** (medidas em linguagem simples, sem expor detalhes que facilitem ataques).
9. **Crianças e adolescentes** (política de idade).
10. **Decisões automatizadas e perfilamento** (se houver) e como revisar.
11. **Alterações** na política (aviso, data, histórico de versões).
12. **Contato e reclamações** (inclusive ANPD).

## 2. Termos de Uso / Condições Gerais de Venda

1. Definições e aceitação; cadastro e responsabilidade pela conta.
2. Descrição do serviço/loja; **informações do fornecedor**.
3. Preços, frete, formas de pagamento, parcelamento, **juros** (se houver), emissão de nota.
4. **Entrega:** prazos, rastreio, tentativa de entrega, risco de extravio.
5. **Direito de arrependimento (7 dias)** e como exercer.
6. **Trocas, devoluções, garantia legal e contratual**, assistência técnica.
7. Cancelamento de pedidos; indisponibilidade de estoque; **erro de preço** (como será tratado, sem abusividade).
8. Uso aceitável; condutas proibidas; conteúdo de usuários; moderação e denúncia.
9. Propriedade intelectual do site; licença de uso.
10. Limitação de responsabilidade (**sem afastar direitos do consumidor**), força maior.
11. Privacidade (remissão); comunicação por e-mail/WhatsApp.
12. Alterações dos termos; vigência; **foro** (domicílio do consumidor, em relações de consumo); contato e SAC.

## 3. Política de Cookies

Tabela: **nome, categoria** (necessário, desempenho, funcional, publicidade), **finalidade, prazo, responsável** (própria/terceiro). Como gerenciar/recusar. Data da última atualização.

## 4. Política de Troca, Devolução e Garantia

Prazo e forma de **arrependimento**; condições do produto na devolução (embalagem, itens, acessórios; sem exigir lacre/caixa de forma que inviabilize o direito legal); quem paga o frete de retorno (no arrependimento, pelo fornecedor); prazo de reembolso e meio; garantia legal (30/90 dias) e **garantia contratual**; como acionar assistência técnica; exclusões legítimas e justificadas (mau uso comprovado).

## 5. ROPA — Registro das Operações de Tratamento (LGPD art. 37)

| ID | Processo | Categoria de titulares | Dados | Finalidade | Base legal | Controlador/Operador | Compartilha com | País/Transferência | Retenção | Medidas de segurança | Responsável |
|----|----------|-----------------------|-------|------------|-----------|----------------------|-----------------|-------------------|----------|---------------------|-------------|

## 6. RIPD — Relatório de Impacto (LGPD art. 38)

1. Descrição do tratamento e do contexto; 2. necessidade e proporcionalidade; 3. dados e titulares envolvidos (escala, vulnerabilidade); 4. riscos identificados (probabilidade × impacto) para direitos e liberdades; 5. medidas e salvaguardas, risco residual; 6. consulta a partes interessadas; 7. aprovação e revisão periódica.

## 7. Plano de Resposta a Incidentes

1. **Papéis** (coordenador, técnico, jurídico, comunicação) e contatos 24/7.
2. **Classificação** (severidade e critérios de risco/dano relevante).
3. **Fluxo:** detecção → contenção → erradicação → recuperação → lições aprendidas.
4. **Preservação de evidências** (cadeia de custódia, cópias forenses, logs).
5. **Notificações:** ANPD e titulares (prazos, conteúdo mínimo, modelo), clientes (contratos), autoridades policiais, seguradora.
6. **Modelo de comunicado** ao titular: o que aconteceu, dados afetados, riscos, o que fizemos, o que você pode fazer, contato.
7. **Registro interno** do incidente, causa raiz e plano de ação; **testes anuais** (simulação).

## 8. DPA — Contrato/Anexo de Tratamento de Dados com Operador

1. Objeto, duração, natureza e finalidade do tratamento; tipos de dados e categorias de titulares.
2. **Instruções documentadas** do controlador; proibição de uso para fins próprios.
3. Confidencialidade da equipe; **medidas de segurança** mínimas (anexo técnico).
4. **Suboperadores:** autorização prévia/geral com lista e direito de oposição.
5. **Assistência** ao controlador: direitos dos titulares, RIPD, auditorias.
6. **Incidentes:** comunicação ao controlador em até [X horas] com informações mínimas.
7. **Transferência internacional:** hipóteses e salvaguardas.
8. **Término:** devolução/eliminação dos dados e certificação.
9. **Auditoria/prestação de contas**, responsabilidade entre as partes, lei e foro.

## 9. Checklist de avaliação de terceiros (fornecedores)

- Onde armazenam os dados (países/regiões)? Há suboperadores?
- Certificações (ISO 27001, SOC 2, PCI DSS quando aplicável)?
- Política de incidentes e prazo de aviso?
- Criptografia, controle de acesso, backup?
- Usam os dados do cliente para treinar modelos/outros fins?
- Cláusulas de exclusão ao término do contrato?
- Existe **DPA** assinável? Qual a lei aplicável e foro?

## 10. Modelo de registro de aceite (técnico)

```json
{
  "userId": "uuid",
  "document": "termos-de-uso",
  "version": "2026-11-01",
  "acceptedAt": "2026-11-02T14:03:22Z",
  "ip": "203.0.113.10",
  "userAgent": "Mozilla/5.0 ...",
  "method": "checkbox-checkout"
}
```

Guarde também o **texto da versão** aceita (hash do documento) para provar o que foi aceito.
