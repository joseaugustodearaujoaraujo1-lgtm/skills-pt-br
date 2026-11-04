# Exemplo completo (intensidade padrão)

Aplicação das 5 fases a um problema fictício, para mostrar o método do começo ao fim. Os números são ilustrativos e servem só ao exemplo.

**Pedido original:** "Quero um app para a minha clínica, porque os pacientes faltam muito."

---

## Fase 1 — Entender

- **Problema em uma frase:** pacientes de uma clínica de fisioterapia com 3 profissionais faltam a cerca de 25% das sessões sem avisar. Os horários ficam vazios e o faturamento cai.
- **Solução disfarçada:** "um app" é uma solução. O problema real é **horário vazio não reaproveitado**.
- **5 porquês** (dois caminhos):
  - Caminho 1:
    1. Por que faltam? Esquecem.
    2. Por quê? A sessão foi marcada há semanas, sem lembrete.
    3. Por quê? A recepção não tem tempo de ligar para todos.
  - Caminho 2:
    1. Por que não avisam?
    2. Avisar exige ligar no horário comercial, e a falta não tem nenhuma consequência.
- **Jobs to be done:** o paciente quer melhorar da dor sem complicar a rotina; o dono quer agenda cheia sem a recepção virar central de telemarketing.
- **Restrições reais:** orçamento pequeno; LGPD (dados de saúde são sensíveis); a equipe não é técnica.
- **Restrições supostas** (questionáveis):
  - "Paciente não aceita pagar antecipado."
  - "Precisa de um app próprio."
  - "Horário vago não tem como preencher em cima da hora."
- **Reformulações "Como poderíamos…?":**
  - …fazer o paciente lembrar e confirmar sem esforço da recepção?
  - …preencher horários vagos em cima da hora?
  - …tornar a falta menos provável sem punir o paciente fiel?
- **Sucesso será:** taxa de faltas abaixo de 10% e menos de 30 min/dia da recepção com confirmações.

## Fase 2 — Divergir (18 ideias, 4 técnicas)

**Inversão** ("como fazer o paciente faltar mais?" → inverter):
1. Marcar com muita antecedência e nunca lembrar → lembrete 24h e 2h antes.
2. Fazer avisar ser difícil → cancelar com um toque, pelo próprio lembrete.
3. Não haver consequência → política clara e gentil de faltas.

**Analogias:**
4. **Companhias aéreas:** overbooking calculado, com uma pequena margem de encaixe nos horários com mais faltas.
5. **Restaurantes:** lista de espera que avisa quando abre uma mesa → lista de espera para horários vagos.
6. **Academias:** pacote mensal pago antecipado, em que a sessão perdida conta.
7. **Salões de beleza:** sinal no agendamento, abatido da sessão.
8. **Jogos:** sequência de presença com recompensa (a 10ª sessão tem bônus).

**Restrições artificiais:**
9. **Sem tecnologia:** o profissional marca a próxima sessão com o paciente, olho no olho, ao fim de cada atendimento, e entrega um cartão.
10. **Sem recepção:** confirmação 100% automática por WhatsApp.
11. **Custo zero:** agenda compartilhada + lembretes do próprio Google Agenda ou WhatsApp Business.

**SCAMPER:**
12. **Substituir** a ligação por mensagem com botões "Confirmo" e "Preciso remarcar".
13. **Combinar** o lembrete com um exercício de casa do tratamento, que dá valor à mensagem.
14. **Eliminar** a marcação com muita antecedência: agenda aberta só para as próximas 2 semanas.
15. **Reverter:** o paciente escolhe e remarca sozinho por um link, sem precisar da recepção.
16. **Propor outro uso:** horário vago vira sessão de reavaliação gratuita para ex-pacientes, o que gera retorno.
17. **Modificar:** sessões em grupo nos horários historicamente mais vazios.
18. **Absurda:** "o paciente ganha dinheiro por ir". Núcleo aproveitável: um pequeno desconto por pontualidade no pacote.

## Fase 3 — Convergir

Agrupando e combinando, ficam 4 candidatas:

| Candidata | Impacto | Esforço | Risco | Reversível |
|---|---|---|---|---|
| A. Lembretes automáticos com confirmar/remarcar (1, 2, 10, 12) | alto | baixo | baixo | sim |
| B. Lista de espera para encaixes em cima da hora (5) | médio-alto | baixo | baixo | sim |
| C. Pacote mensal com sinal e política de faltas (6, 7, 3) | alto | médio | médio (reação dos pacientes) | sim, com cuidado |
| D. Autoagendamento por link com agenda de 2 semanas (14, 15) | médio | médio | baixo | sim |

**Critério eliminatório:** a LGPD. As mensagens não devem expor o tipo de tratamento na pré-visualização ("Lembrete da sua sessão amanhã às 9h", sem diagnóstico), e o paciente precisa consentir com o canal.

**Matriz:**
- **Vitórias rápidas:** A e B.
- **Aposta:** C.
- **Ajuste:** D.

O "app próprio" do pedido original ficou de fora: tem custo alto e o mesmo resultado sai de ferramentas existentes.

## Fase 4 — Testar

**Pré-mortem da combinação A + B** ("deu errado em 3 meses, por quê?"):
- **Pacientes ignoram as mensagens.** Mitigação: mensagem curta, com nome do profissional e horário, enviada 24h e 2h antes.
- **A lista de espera fica vazia.** Mitigação: oferecer a lista ativamente a quem pede horário cheio.
- **A ferramenta fica cara ou complicada.** Mitigação: começar com WhatsApp Business e agenda simples; só contratar sistema se o teste provar valor.
- **Confirmações não são registradas.** Mitigação: um único lugar para a agenda.

**Menor teste viável:**
- **O quê:** 4 semanas, um profissional apenas, lembretes com confirmação + lista de espera.
- **Hipótese:** as faltas desse profissional caem de cerca de 25% para menos de 12%.
- **Sucesso:** faltas abaixo de 12% **e** pelo menos 3 encaixes por semana vindos da lista.
- **Fracasso:** queda menor que 5 pontos → rever a mensagem e o canal antes de expandir.
- **Custo:** praticamente zero, mais cerca de 2h de configuração.

## Fase 5 — Entregar (leque de soluções)

- **Segura:** lembretes automáticos 24h e 2h antes, com botões "Confirmo" e "Preciso remarcar". Comprovado em muitos setores, barato e reversível.
- **Ousada:** pacote mensal com pagamento antecipado e política de faltas clara (24h para remarcar sem custo), com bônus de pontualidade. Pode reduzir muito as faltas, mas exige comunicação cuidadosa para não afastar pacientes.
- **Fora da caixa:** tratar o horário vago como oportunidade em vez de perda:
  - lista de espera para encaixes;
  - sessões de reavaliação gratuitas para ex-pacientes nos horários historicamente vazios, que geram retorno de quem já tinha parado.

**Recomendação:** começar pela segura combinada com a lista de espera (A + B). São vitórias rápidas, reversíveis e quase sem custo, e o teste de 4 semanas com um profissional mostra o resultado.
- **Trade-off aceito:** ainda depende de o paciente ler a mensagem.
- **Mudaria de ideia se:** as faltas não caírem nem 5 pontos. Nesse caso, partir para o pacote antecipado (C) com um grupo pequeno de pacientes novos.
- **Primeiro passo:** levantar quantas faltas houve nas últimas 8 semanas, por profissional e por horário, para ter a linha de base.
