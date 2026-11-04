# 02 · Técnicas de geração de ideias

Cada técnica empurra o pensamento para uma direção diferente. Use pelo menos duas por problema, e anote todas as ideias sem julgar. A avaliação vem depois (`03-avaliacao-e-decisao.md`).

## Sumário
1. Regras da fase de geração
2. SCAMPER
3. Analogias de outras áreas
4. Inversão
5. Restrições artificiais
6. Escala extrema (10× e 1/10)
7. Combinação forçada
8. Caixa morfológica
9. Princípios da TRIZ
10. Provocação ("e se…?")
11. Seis chapéus
12. Personas improváveis
13. A pior ideia possível
14. Como escolher a técnica

---

## 1. Regras da fase de geração

- **Quantidade primeiro.** As melhores ideias costumam surgir depois das 10 primeiras, quando as óbvias acabam.
- **Nada de "mas".** Não avalie durante a geração; anote e siga.
- **Aproveite e amplie.** "Sim, e…" em vez de "não, porque…".
- **Inclua ideias absurdas.** Elas abrem caminhos que as sensatas não abrem.
- **Variedade de tipos:** tecnológicas, de processo, de comunicação, de modelo de negócio, de "não fazer".
- **Anote em frases curtas e concretas** ("o CEP preenche o endereço automaticamente"), não em temas vagos ("melhorar o formulário").

## 2. SCAMPER

Aplique cada verbo à solução atual ou ao produto:

| Letra | Pergunta | Exemplo (cadastro de app) |
|---|---|---|
| **S**ubstituir | O que trocar por outra coisa? | senha → link mágico por e-mail ou login com Google |
| **C**ombinar | O que juntar? | cadastro + primeira compra num só passo |
| **A**daptar | O que copiar de outro contexto? | checkout de convidado dos e-commerces |
| **M**odificar | O que aumentar, diminuir ou mudar a forma? | de 11 campos para 3; o resto depois |
| **P**ropor outro uso | Para que mais isso serve? | o endereço pedido serve também para calcular o frete na hora |
| **E**liminar | O que remover? | eliminar a confirmação de e-mail obrigatória antes do primeiro uso |
| **R**everter | E se a ordem fosse inversa? | usar o app primeiro e cadastrar só ao salvar algo |

## 3. Analogias de outras áreas

Pergunte: **quem convive com um problema parecido, em outra área, e como resolve?** Abstraia o problema (ex.: "reduzir espera") e procure em áreas distantes:
- **Aviação:** checklists, redundância, cultura de relatar quase-acidentes. Bom para qualidade e segurança.
- **Hospitais:** triagem por gravidade. Bom para filas de suporte e priorização de bugs.
- **Restaurantes:** a cozinha prepara a "mise en place" antes do pico. Bom para cache, pré-processamento e preparação de estoque.
- **Jogos:** progressão, recompensa imediata, tutorial embutido na primeira fase. Bom para onboarding e engajamento.
- **Natureza (biomimética):** formigas encontram caminhos curtos, ilustrando a otimização distribuída; o sistema imunológico detecta o que é estranho, ilustrando a detecção de anomalias.
- **Logística:** consolidar entregas, centros de distribuição. Bom para filas, batch e CDN.
- **Varejo físico:** o produto mais procurado fica no fundo da loja. Bom para a arquitetura de navegação, usada com ética.

Depois traga a solução de volta e adapte ao contexto real.

## 4. Inversão

1. Pergunte o contrário: **"Como garantir que o problema piore?"**
2. Liste as respostas (são fáceis e divertidas de gerar).
3. Inverta cada uma para obter uma ideia.

Exemplo: "como fazer o cliente desistir do cadastro?"
- pedir tudo de uma vez → pedir em etapas;
- esconder o progresso → mostrar a barra de progresso;
- dar erro só no final → validar campo a campo;
- obrigar a criar senha complexa → login sem senha.

## 5. Restrições artificiais

Imponha uma restrição que não existe para forçar caminhos novos:
- **Sem dinheiro:** e se o orçamento fosse zero?
- **Em 1 dia:** o que daria para entregar até amanhã?
- **Sem tecnologia:** como resolveríamos só com papel e pessoas?
- **Sem a peça principal:** e se não pudéssemos usar banco de dados, tela, e-mail ou reunião?
- **Só uma frase:** se a solução tivesse de caber numa frase, qual seria?
- **Sem pedir nada ao usuário:** o que daria para descobrir sozinho (localização, histórico, padrão de uso), com consentimento?

## 6. Escala extrema (10× e 1/10)

- **10× maior:** se tivéssemos 10× mais usuários, dados ou pedidos, o que quebraria? Que solução aguentaria? Isso revela a arquitetura certa ou o gargalo real.
- **10× melhor:** o que precisaria ser verdade para o resultado ser 10× melhor, e não 10%? Obriga a mudar a abordagem, não a ajustar.
- **1/10 do custo ou do tempo:** o que cortaríamos? O que sobra costuma ser o essencial.

## 7. Combinação forçada

Escolha um conceito aleatório ou de outra área e force uma conexão com o problema. Exemplos de conceito: assinatura de revista, fila de banco, playlist, leilão, receita de bolo, GPS, academia.

Exemplo, problema "clientes esquecem de renovar o plano":
- **playlist** → renovação automática com "próximos itens" que o cliente pode ajustar;
- **GPS** → aviso proativo, como "faltam 7 dias, recalculando…";
- **academia** → plano anual com congelamento permitido.

## 8. Caixa morfológica

Divida a solução em dimensões e liste opções para cada uma. Depois combine opções de linhas diferentes, inclusive combinações improváveis.

| Dimensão | Opção A | Opção B | Opção C | Opção D |
|---|---|---|---|---|
| Canal | app | WhatsApp | site | presencial |
| Quem inicia | cliente | empresa | parceiro | automático |
| Momento | antes da compra | durante | depois | recorrente |
| Pagamento | por uso | assinatura | grátis com anúncio | pago por terceiro |

Uma combinação como "WhatsApp + automático + depois + pago por terceiro" pode gerar uma ideia que ninguém teria em brainstorm livre.

## 9. Princípios da TRIZ

A TRIZ é uma metodologia de invenção baseada no estudo de milhares de patentes. Alguns princípios que funcionam bem fora da engenharia:

| Princípio | Ideia | Exemplo em software/negócio |
|---|---|---|
| Segmentação | dividir em partes independentes | dividir o cadastro em etapas; filas por tipo de tarefa |
| Extração | separar a parte problemática | mover o processamento pesado para um job assíncrono |
| Qualidade local | cada parte ajustada à sua função | cache diferente por tipo de dado |
| Assimetria | quebrar a simetria | planos com preços não lineares; leitura e escrita separadas (CQRS) |
| Ação prévia | fazer antes de ser necessário | pré-carregar, pré-calcular, deixar respostas prontas |
| Amortecimento antecipado | preparar a proteção antes | feature flags, rollback, plano B |
| Inversão | fazer o oposto | o cliente busca o dado (pull) em vez de a empresa empurrar (push) |
| Dinamismo | tornar adaptável | limites que se ajustam à carga; interface que se adapta ao uso |
| Ação parcial ou excessiva | fazer um pouco menos ou um pouco mais do que o pedido | entregar 80% agora e o resto depois; mandar mais dados para evitar várias chamadas |
| Intermediário | usar um mediador | fila, proxy, marketplace |
| Autosserviço | o sistema serve a si mesmo | auto-recuperação, autoatendimento do cliente |
| Cópia | usar uma cópia barata no lugar do original | ambiente de teste, protótipo, simulação, dados sintéticos |
| Descartável | trocar o durável pelo barato e descartável | containers efêmeros, links temporários |
| Mudança de parâmetro | mudar estado, frequência, escala | de tempo real para lote; de diário para semanal |

## 10. Provocação ("e se…?")

Faça uma afirmação deliberadamente impossível ou absurda e use-a como trampolim (técnica de Edward de Bono):
- "E se o cliente pagasse para nos dar feedback?" → programa de beta testers que pagam menos.
- "E se o site não tivesse botões?" → fluxo guiado por conversa, ou ações por gestos.
- "E se o bug fosse um recurso?" → o comportamento inesperado que os usuários adoram vira funcionalidade oficial.

Pergunte o que há de útil na provocação, sem julgar se ela é possível.

## 11. Seis chapéus

Olhe a mesma questão por seis ângulos, um de cada vez:
- **Branco:** fatos e dados. O que sabemos e o que falta saber?
- **Vermelho:** emoções e intuição. O que sentimos sobre isso?
- **Preto:** riscos. O que pode dar errado?
- **Amarelo:** benefícios. O que pode dar muito certo?
- **Verde:** criatividade. Que alternativas existem?
- **Azul:** processo. O que decidimos e qual o próximo passo?

É útil para sair de discussões travadas, porque separa crítica de criação.

## 12. Personas improváveis

Pergunte como diferentes pessoas resolveriam o problema:
- Um engenheiro da NASA, com redundância e checklists.
- Uma criança de 8 anos, com a pergunta mais simples possível.
- Um concorrente agressivo: como nos venceria?
- Um designer de games: como tornaria isso divertido?
- Um auditor ou advogado: o que exigiria?
- Alguém com orçamento zero.
- A empresa de referência do setor (Apple, Nubank, Amazon, Mercado Livre…): como faria?

## 13. A pior ideia possível

Gere de propósito as piores ideias que conseguir, depois pergunte o que cada uma tem de aproveitável ou o que o oposto dela sugere. Reduz a pressão de "ter uma boa ideia" e frequentemente revela algo útil.

## 14. Como escolher a técnica

| Situação | Técnicas que mais rendem |
|---|---|
| Melhorar algo que já existe | SCAMPER, inversão, princípios da TRIZ |
| Problema parecido com outros conhecidos | analogias, personas |
| Precisa de ruptura, não de ajuste | escala 10×, primeiros princípios (`01-entender-o-problema.md`), provocação |
| Muitas variáveis combináveis | caixa morfológica |
| Time travado ou discutindo | seis chapéus, pior ideia possível |
| Pouco recurso | restrições artificiais, "1/10 do custo", fazer menos |
