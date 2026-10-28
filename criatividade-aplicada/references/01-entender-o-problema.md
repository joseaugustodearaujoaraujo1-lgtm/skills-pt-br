# 01 · Entender o problema

A causa mais comum de soluções ruins é resolver o problema errado. Investir alguns minutos aqui economiza dias depois e, muitas vezes, revela a ideia criativa antes mesmo da fase de geração.

## Sumário
1. Escrever o problema em uma frase
2. "Como poderíamos…?"
3. 5 porquês
4. Problema × solução disfarçada
5. Jobs to be done (o trabalho que a pessoa quer feito)
6. Mapa de restrições
7. Primeiros princípios
8. Suposições escondidas
9. Mudar o enquadramento
10. Critério de sucesso

---

## 1. Escrever o problema em uma frase

Formato: **[quem] tem dificuldade em [fazer o quê] porque [causa], o que provoca [consequência].**

- Fraco: "O site está ruim."
- Forte: "Clientes novos abandonam o cadastro no passo de endereço porque o formulário pede 11 campos no celular, e perdemos cerca de 40% dos interessados."

Se não der para escrever essa frase, falta informação: pergunte antes de gerar ideias.

## 2. "Como poderíamos…?"

Transforme o problema numa pergunta aberta que convida ideias: **"Como poderíamos [resultado desejado] para [quem], [condição]?"**

Varie o recorte para abrir caminhos diferentes:
- **Mais amplo:** "Como poderíamos conquistar a confiança do cliente antes de pedir dados?"
- **Mais específico:** "Como poderíamos preencher o endereço sem a pessoa digitar?"
- **Invertido:** "Como poderíamos tornar o cadastro desnecessário?"
- **Focado na emoção:** "Como poderíamos fazer o cadastro parecer rápido mesmo se for longo?"

Cada versão leva a ideias diferentes. Escolha 2 ou 3 para a fase de geração.

## 3. 5 porquês

Pergunte "por quê?" repetidamente até chegar a algo que se pode mudar.

Exemplo:
1. Por que as vendas caíram? Menos pessoas finalizam a compra.
2. Por quê? O pagamento falha com frequência.
3. Por quê? O Pix expira antes da pessoa pagar.
4. Por quê? O QR code vale 5 minutos e a pessoa vai buscar o celular do outro cômodo.
5. Por quê? Ninguém revisou o tempo padrão da integração.

A solução deixa de ser "fazer anúncio" e vira "aumentar a validade do Pix e permitir copiar o código".

Cuidado: há quase sempre mais de uma causa. Siga 2 ou 3 caminhos de porquês, não um só.

## 4. Problema × solução disfarçada

Pedidos costumam chegar como soluções: "preciso de um app", "quero um chatbot", "precisamos de microsserviços". Pergunte qual problema essa solução resolveria e se há outras formas de resolvê-lo.

| Pedido | Problema real provável | Outras saídas |
|---|---|---|
| "Quero um app" | clientes não conseguem agendar fora do horário | link de agendamento, WhatsApp com resposta automática, página web |
| "Precisamos de um chatbot de IA" | a equipe responde as mesmas 20 perguntas o dia todo | FAQ melhor, respostas prontas, busca no site |
| "Vamos migrar para microsserviços" | deploys lentos e com medo de quebrar | testes automatizados, deploy contínuo, módulos melhores no monólito |

## 5. Jobs to be done (o trabalho que a pessoa quer feito)

Pergunte: **que trabalho a pessoa está "contratando" este produto para fazer?** Pense em três dimensões:
- **Funcional:** o que ela quer realizar.
- **Emocional:** como quer se sentir (segura, no controle, sem vergonha).
- **Social:** como quer ser vista.

Exemplo: ninguém quer "um sistema de estoque". O dono da farmácia quer "não perder vendas por falta de remédio e não jogar dinheiro fora com vencidos", e quer se sentir no controle sem passar a noite em planilhas.

## 6. Mapa de restrições

Liste todas as restrições e classifique:

| Restrição | Tipo | Pode ser questionada? |
|---|---|---|
| Lei, regulação, segurança | **Real** | não, mas pode haver formas diferentes de cumprir |
| Física, tecnologia disponível | **Real** | às vezes (novas tecnologias mudam o limite) |
| Orçamento e prazo | **Real, negociável** | dá para trocar escopo por prazo, ou fazer em etapas |
| "Sempre foi assim", "o cliente não aceita", "nossa stack não permite" | **Suposta** | sim: teste a suposição |

As restrições supostas são onde moram as melhores ideias. Pergunte para cada uma: "Como sabemos que isso é verdade? O que aconteceria se não fosse?"

## 7. Primeiros princípios

Desmonte o problema até as verdades básicas e reconstrua a partir delas, ignorando como "todo mundo faz".

1. O que estamos tentando alcançar, em termos fundamentais?
2. Quais são os componentes indispensáveis (física, dados, pessoas, dinheiro)?
3. Quanto custa ou quanto tempo leva cada componente isolado?
4. Se fôssemos montar do zero sabendo só isso, como faríamos?

Exemplo: "relatório mensal leva 3 dias". Fundamentalmente, os dados já existem no banco; o relatório é uma consulta + uma formatação. Reconstruindo: uma consulta agendada e um painel que se atualiza sozinho. O relatório de 3 dias deixa de existir.

## 8. Suposições escondidas

Liste o que todo mundo assume sem perceber e inverta cada item:
- "O usuário precisa criar conta antes de comprar" → e se comprasse primeiro e a conta fosse criada depois?
- "O atendimento é por telefone" → e se o cliente resolvesse sozinho 80% dos casos?
- "O sistema precisa ser em tempo real" → e se uma atualização a cada hora bastasse e custasse 10× menos?
- "Precisamos de mais gente" → e se removêssemos trabalho em vez de acrescentar pessoas?

## 9. Mudar o enquadramento

Olhe o mesmo problema por outros ângulos:
- **Ponto de vista de outra pessoa:** o cliente, o atendente, o desenvolvedor novo, o concorrente, o fiscal.
- **Escala de tempo:** como isso vai estar em 1 semana, 1 ano, 10 anos?
- **Escala de tamanho:** e se fosse para 10 usuários? Para 10 milhões?
- **Problema ou oportunidade?** O defeito pode ser vendido como recurso? (A fila longa vira "lista de espera exclusiva".)
- **Quem já resolveu?** Que outra área convive com esse problema há décadas?

## 10. Critério de sucesso

Antes de gerar ideias, combine como o resultado vai ser medido:
- uma métrica, como "abandono do cadastro abaixo de 20%" ou "tempo de resposta abaixo de 300 ms";
- ou um critério observável, como "a equipe fecha o mês sem horas extras".

Sem isso, a avaliação vira opinião.
