# Pagamentos, fiscal e financeiro

> Tributação e regras do Banco Central mudam com frequência (inclusive a reforma tributária em transição). Sempre confirme com **contador(a)** e nas fontes oficiais (Receita Federal, SEFAZ, Banco Central, bandeiras).

## 1. Regra de ouro: não toque em dados de cartão

- **Nunca** receba, registre ou armazene número completo do cartão, CVV, ou trilha magnética no seu servidor, banco ou logs.
- Use **gateway/PSP certificado PCI DSS** com página hospedada, *iframe*/*hosted fields* ou **tokenização**. O sistema guarda apenas token, últimos 4 dígitos, bandeira e validade quando necessário.
- Se o seu sistema tocar em dados de cartão, entra no escopo do **PCI DSS** (requisitos pesados). Evite.
- Credenciais do gateway ficam em cofre de segredos; separe chaves de **sandbox** e **produção**.

## 2. Meios de pagamento

| Meio | Cuidados |
|------|----------|
| **Pix** | Use PSP/gateway que gere cobrança (QR dinâmico) com TXID/expiração; confirme por webhook assinado; concilie; trate devolução (MED/estorno) conforme regras do BCB; não confie na tela do cliente |
| **Cartão** | 3-D Secure quando disponível; regras de *chargeback*; guarde evidências de entrega/uso; antifraude |
| **Boleto** | Registro bancário, vencimento, baixa por webhook; juros/multa conforme contrato e lei |
| **Carteiras digitais** | Siga os termos do provedor |
| **Cripto** | Atenção a Lei 14.478/2022 e regulamentos do BCB/CVM; consulte especialista; nunca prometer rentabilidade |

Programação defensiva: valores em **centavos**; recalcule o total no servidor; **idempotência** na criação de pedido e cobrança; estados claros (pendente, pago, falhou, estornado); conciliação diária; tratamento de webhooks duplicados ou fora de ordem; limite de tentativas para evitar *card testing* (CAPTCHA/Turnstile, rate limit, antifraude).

## 3. Informação ao consumidor sobre pagamento

- Preço à vista e parcelado, **juros e CET** (quando houver financiamento próprio), data e valor de cada parcela, taxa de serviço, e total — antes da finalização (ver `consumidor-e-comercio-eletronico.md`).
- Cobrança recorrente (assinaturas): consentimento explícito, aviso antes de renovar, **cancelamento fácil**, comprovante a cada cobrança.
- Estornos: no prazo e pelo mesmo meio do pagamento original.

## 4. Fiscal (resumo orientativo)

- **Emissão de nota fiscal:** venda de mercadorias no e-commerce exige emissão de **NF-e** (ou NFC-e em alguns casos presenciais); serviços, NFS-e municipal. Entregue o DANFE/XML ao cliente. Integre um emissor (API de nota) apenas com orientação do contador.
- **Regime tributário** (MEI, Simples Nacional, Lucro Presumido/Real): define o que cobrar e como; MEI tem **restrições** (atividades permitidas, limite de faturamento, vedações a certos produtos/serviços e a regime de substituição tributária).
- **ICMS, substituição tributária, DIFAL, ISS, PIS/COFINS:** dependem do estado, do produto (NCM) e do regime; **cadastre NCM correto** nos produtos de informática.
- **Marketplace:** responsabilidades de emissão e recolhimento mudam; leia o contrato do marketplace.
- **Frete e logística:** nota e conhecimento de transporte; seguro de mercadoria.
- **Retenção de documentos fiscais:** guarde XMLs por pelo menos o prazo legal (em geral 5 anos; confirme com o contador).

## 5. Prevenção à fraude e lavagem de dinheiro

- Antifraude proporcional (score do gateway, validação de endereço, limite de tentativas, análise manual de pedidos suspeitos).
- Não processe pagamentos de terceiros de forma que configure **intermediação financeira** sem autorização (subadquirência, arranjos de pagamento regulados pelo BCB). Use sempre PSP regulado.
- Conheça as obrigações de *compliance* do seu PSP e dos arranjos; guarde evidências.

## 6. Dados financeiros e LGPD

- Dados financeiros são pessoais (não "sensíveis" pela LGPD), mas exigem **segurança reforçada**: criptografia, acesso mínimo, logs sem valores sensíveis, segregação.
- Compartilhamento com PSP e antifraude: documentar em política de privacidade e contratos.
- Retenção: manter os dados necessários para obrigação fiscal e defesa em disputas; eliminar o restante.

## 7. Checklist

- [ ] Nenhum dado de cartão trafega ou é salvo no sistema (verificado em código, logs e banco).
- [ ] Gateway/PSP regulado; chaves de produção e sandbox separadas; webhooks assinados e idempotentes.
- [ ] Conciliação automática e alertas de divergência.
- [ ] Valores monetários em centavos; total recalculado no servidor.
- [ ] Emissão de nota fiscal definida com o contador (modelo, integração, NCM).
- [ ] Política de reembolso/estorno e fluxo de *chargeback*.
- [ ] Assinaturas com aviso e cancelamento fácil.
- [ ] Antifraude e limites contra *card testing*.
- [ ] Contratos com PSP e política de privacidade descrevem o compartilhamento.
