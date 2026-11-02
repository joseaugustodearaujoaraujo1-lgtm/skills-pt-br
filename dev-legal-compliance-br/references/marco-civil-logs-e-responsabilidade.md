# Marco Civil da Internet, guarda de logs e responsabilidade por conteúdo

Normas: **Lei 12.965/2014 (Marco Civil da Internet)** e **Decreto 8.771/2016**. Interage com a LGPD.

## 1. Guarda de registros

| Quem | Dever | Prazo |
|------|-------|-------|
| Provedor de **conexão** (ISP) | Guardar registros de conexão | 1 ano (art. 13) |
| Provedor de **aplicações** com fins econômicos, constituído como pessoa jurídica e que atue de forma organizada e profissional (sua loja/SaaS, em regra) | Guardar **registros de acesso a aplicações** (IP, data e hora com fuso, e dados de porta quando aplicável) | **6 meses**, sob sigilo, em ambiente controlado e seguro (art. 15) |

Observações:

- Para **aplicações sem fins econômicos**, a guarda não é obrigatória por regra, mas pode ser exigida por ordem judicial; avalie manter por segurança.
- A **guarda de conteúdo de comunicações privadas** exige ordem judicial (art. 10 e 22). Não registre mensagens privadas como "log".
- O Decreto 8.771/2016 pede padrões de segurança para a guarda: controle de acesso, autenticação, inventário de acessos, uso de soluções de gestão de registros (ex.: criptografia ou medidas equivalentes).
- A LGPD exige **finalidade e minimização** também nos logs. Mantenha o que a lei exige e o necessário para segurança, e **elimine depois do prazo** quando não houver outra base.

### Como implementar

1. Log de acesso separado do log de aplicação, com IP real (atenção a proxies/CDN: use o cabeçalho confiável, ex.: `CF-Connecting-IP` quando atrás do Cloudflare), data/hora em UTC com fuso, identificador do usuário/sessão, ação.
2. Armazenamento com **acesso restrito**, imutabilidade ou assinatura, backup e retenção de no mínimo 6 meses.
3. Procedimento documentado para atender **ordens judiciais** (quem recebe, valida, extrai e entrega; registro da requisição).
4. Eliminação programada após o prazo, salvo obrigação ou necessidade legítima registrada.

## 2. Responsabilidade por conteúdo de terceiros

- Regra histórica: o provedor de aplicações só era responsabilizado civilmente por conteúdo de terceiros se, após **ordem judicial** específica, não removesse o conteúdo (art. 19). Exceção: divulgação não autorizada de cenas íntimas (art. 21, remoção após notificação do ofendido).
- **Atenção:** em 2025 o Supremo Tribunal Federal julgou os temas sobre o art. 19 e ampliou hipóteses de responsabilização de plataformas (por exemplo, dever de agir após notificação em certos tipos de conteúdo ilícito e dever de cuidado quanto a conteúdos graves). **Verifique a tese e a aplicação vigentes** antes de definir seu fluxo de moderação, principalmente se o sistema aceitar conteúdo de usuários (comentários, avaliações, anúncios, fóruns, uploads).

### Boas práticas para sistemas com conteúdo de usuários

1. **Termos de uso** proibindo conteúdo ilícito, e política de moderação clara.
2. **Canal de denúncia** acessível (formulário/e-mail) com protocolo e SLA interno.
3. **Fluxo de remoção:** análise, remoção preventiva de conteúdo claramente ilícito (nudez não consensual, pedofilia, ameaças, golpes), registro da decisão, possibilidade de recurso do usuário.
4. **Ordens judiciais:** processo para receber, validar autenticidade, preservar dados e responder no prazo.
5. **Avaliações de produtos:** moderar sem manipulação (não apagar só as negativas legítimas; é prática enganosa); identificar patrocinadas; não fabricar reviews.
6. **Preservação:** ao receber notificação de investigação, preserve logs e conteúdo relevantes (guarda por ordem).
7. **Reputação e direito de resposta:** tenha endereço de contato jurídico no site.

## 3. Neutralidade, privacidade e outros direitos (art. 7º)

Usuários têm direito à inviolabilidade da intimidade e do sigilo das comunicações, **informações claras sobre coleta, uso, armazenamento e compartilhamento**, exclusão de dados ao fim da relação (ressalvada a guarda obrigatória) e a termos de uso claros. Cláusulas contratuais que violem esses direitos são nulas.

## 4. Checklist

- [ ] Registro de acesso a aplicações com IP e data/hora (UTC e fuso) retido por 6 meses.
- [ ] Logs em ambiente restrito, protegidos e sem dados desnecessários.
- [ ] Procedimento escrito para ordens judiciais e preservação de dados.
- [ ] Termos com regras de conteúdo e canal de denúncia (se houver conteúdo de usuários).
- [ ] Fluxo de remoção e registro de decisões de moderação.
- [ ] Política de eliminação após o prazo e rotina automatizada.
- [ ] Revisão da tese vigente sobre responsabilidade de plataformas (art. 19) para o seu tipo de sistema.
