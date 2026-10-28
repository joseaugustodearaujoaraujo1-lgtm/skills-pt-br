---
name: criatividade-aplicada
description: Método para gerar ideias muito criativas e, ao mesmo tempo, entregar soluções profissionais, viáveis e bem justificadas, em qualquer área (software, produto, arquitetura, UX, depuração, negócios, marketing, processos, conteúdo, educação). Separa a fase de gerar ideias da fase de julgar, usa técnicas concretas (reformulação do problema, primeiros princípios, SCAMPER, analogias de outras áreas, inversão, restrições artificiais, TRIZ, caixa morfológica, pré-mortem) e entrega um leque de opções (segura, ousada, fora da caixa) com recomendação. Use sempre que alguém estiver travado num problema, pedir ideias, alternativas, brainstorm, "algo diferente", "fora da caixa" ou inovação, quando a solução óbvia não serve ou ficou cara demais, quando houver uma decisão com várias saídas possíveis, ou quando um bug ou desafio técnico resistir às abordagens normais — mesmo que a pessoa não use a palavra "criatividade".
---

# Criatividade Aplicada

Criatividade sem método gera ideias bonitas e inviáveis. Profissionalismo sem criatividade repete a mesma solução de sempre, mesmo quando ela não serve. Esta skill junta os dois: **gera ideias com liberdade e decide com rigor**, e as duas coisas acontecem em momentos separados.

O resultado esperado é que a pessoa receba:
- opções que não tinha considerado;
- a explicação de por que cada uma funciona ou não;
- uma recomendação clara;
- o próximo passo mais barato para testar.

## 1. Quando usar e com que intensidade

Use quando houver um problema sem solução óbvia, várias saídas possíveis, uma solução que ficou cara ou lenta demais, um bug que resiste, ou um pedido explícito de ideias.

Ajuste a intensidade ao tamanho do problema e diga qual vai usar:

| Intensidade | Quando | O que entregar |
|---|---|---|
| **Rápida** | dúvida pontual, decisão pequena, conversa | 3 opções (segura, ousada, fora da caixa) em poucas linhas, com recomendação |
| **Padrão** | problema real de projeto, produto ou negócio | as 5 fases abaixo, de 10 a 20 ideias geradas, 3 a 5 avaliadas, recomendação e teste |
| **Profunda** | decisão importante, estratégica ou difícil de reverter | todas as fases, várias técnicas de geração, pré-mortem, critérios com peso e plano de experimento |

Se não estiver claro, pergunte em uma frase qual intensidade a pessoa quer. Problemas simples não precisam do processo inteiro.

## 2. As 5 fases

### Fase 1 — Entender (o problema certo vale mais que a ideia certa)
Antes de gerar ideias, confira se o problema está bem formulado. Detalhes em `references/01-entender-o-problema.md`.
- Escreva o problema em uma frase e reformule como **"Como poderíamos… [resultado] para [quem], sem [restrição]?"**.
- Pergunte "por quê?" até chegar à causa (5 porquês). O pedido costuma ser uma solução disfarçada de problema ("preciso de um app" pode significar "preciso que clientes agendem sem me ligar").
- Liste as restrições e separe as **reais** (lei, orçamento, física, prazo) das **supostas** ("sempre foi assim", "o cliente não aceitaria"). As supostas são onde moram as ideias novas.
- Defina como será reconhecido o sucesso (métrica ou critério observável).

### Fase 2 — Divergir (quantidade e variedade, sem julgar)
Gere muitas ideias antes de avaliar qualquer uma. Julgar cedo demais mata as ideias diferentes. Use pelo menos **duas técnicas diferentes** de `references/02-tecnicas-de-geracao.md`, porque cada técnica empurra para uma direção:
- **Primeiros princípios:** o que é fundamentalmente verdade aqui? Monte a solução a partir disso, e não da forma como os outros fazem.
- **Analogia de outra área:** como um hospital, uma companhia aérea, um jogo ou a natureza resolve um problema parecido?
- **Inversão:** como garantir que o problema piore? Depois inverta cada resposta.
- **Restrições artificiais:** e se fosse de graça? Em 1 dia? Sem tela? Para 1 milhão de pessoas? Sem código?
- **SCAMPER:** substituir, combinar, adaptar, modificar, propor outro uso, eliminar, reverter.

Inclua de propósito algumas ideias absurdas: elas costumam conter um pedaço aproveitável. Para problemas de software, use também `references/04-software-e-tecnologia.md`; para outras áreas, `references/05-negocios-e-outras-areas.md`.

### Fase 3 — Convergir (julgar com critérios, não com gosto)
Agrupe ideias parecidas, combine as complementares e escolha de 3 a 5 para avaliar. Detalhes em `references/03-avaliacao-e-decisao.md`.
- Critérios explícitos: **impacto** no objetivo, **viabilidade** técnica, **custo** (dinheiro e tempo), **risco** e **reversibilidade**. Acrescente os critérios do contexto (segurança, legal, marca).
- Matriz impacto × esforço para achar as "vitórias rápidas" e as "apostas".
- Separe decisões reversíveis (teste rápido, decida rápido) das irreversíveis (estude mais, envolva mais gente).

### Fase 4 — Testar (a menor prova possível)
Para a opção recomendada:
- **Pré-mortem:** "Daqui a 6 meses isso deu errado. Quais são os motivos mais prováveis?" Ajuste a solução para cada motivo forte.
- **Menor teste viável:** o experimento mais barato e rápido que mostra se a ideia funciona (protótipo de papel, página falsa de interesse, script de 50 linhas, teste com 5 usuários, piloto de uma semana).
- Defina antes o que conta como sucesso e como fracasso.

### Fase 5 — Entregar (formato profissional)
Use os modelos de `references/modelos-de-entrega.md`. O padrão é o **leque de soluções**:
- **Segura:** a abordagem comprovada; menor risco.
- **Ousada:** melhora bastante o resultado, com risco controlado.
- **Fora da caixa:** muda a forma de ver o problema; mais incerta, potencialmente muito melhor.
- **Recomendação:** qual seguir, por quê, e o primeiro passo concreto.

## 3. Regras de ouro

1. **Gere primeiro, julgue depois.** Nunca as duas coisas na mesma lista.
2. **A primeira ideia é a de todo mundo.** Use-a como ponto de partida, não de chegada.
3. **Questione o problema antes da solução.** Muitas vezes a melhor ideia é resolver outro problema, o certo.
4. **Restrição é combustível.** Pergunte quais restrições são reais; brinque com as supostas.
5. **Pegue emprestado de outras áreas.** A maioria das inovações é uma ideia transplantada de outro contexto.
6. **Fazer menos também é criativo.** Remover, simplificar, não construir e reaproveitar o que já existe são opções legítimas, muitas vezes as melhores.
7. **Ousadia com rede de proteção.** Toda ideia ousada vem acompanhada de seus riscos e de um teste barato.
8. **Honestidade sobre incertezas.** Diferencie o que é fato, o que é suposição e o que é palpite. Não invente dados, casos ou estudos para tornar uma ideia convincente.
9. **Criatividade dentro dos limites:** nada de soluções ilegais, antiéticas, inseguras ou que enganem pessoas, por mais engenhosas que sejam (ver `references/06-armadilhas.md`).
10. **Termine com um próximo passo pequeno e concreto.** Ideia sem próximo passo não sai do papel.

## 4. Qual referência carregar

| Preciso de… | Arquivo |
|---|---|
| Reformular o problema, achar a causa, mapear restrições | `references/01-entender-o-problema.md` |
| Técnicas para gerar ideias | `references/02-tecnicas-de-geracao.md` |
| Avaliar, priorizar, decidir, testar | `references/03-avaliacao-e-decisao.md` |
| Problemas de software, arquitetura, produto, UX, bugs | `references/04-software-e-tecnologia.md` |
| Negócios, marketing, processos, conteúdo, educação | `references/05-negocios-e-outras-areas.md` |
| Evitar vieses e ideias vazias, limites éticos | `references/06-armadilhas.md` |
| Formato da resposta | `references/modelos-de-entrega.md` |
| Ver o método aplicado do começo ao fim | `references/exemplo-completo.md` |

## 5. Postura na conversa

- Seja generoso nas ideias e rigoroso nas conclusões.
- Faça perguntas que abrem o problema ("o que aconteceria se não fizéssemos nada?", "quem já resolveu algo parecido em outra área?"), mas sem transformar a conversa num interrogatório.
- Explique o raciocínio por trás de cada ideia em uma frase. Isso ensina a pessoa a pensar assim também.
- Respeite a decisão final de quem pediu. Se discordar, diga por quê, uma vez, com argumentos.
- Antes de executar qualquer ideia (criar arquivos, rodar comandos, contratar serviços, publicar), siga as regras de autorização do ambiente e do usuário. Gerar ideias não autoriza executá-las.
