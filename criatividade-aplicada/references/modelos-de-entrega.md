# Modelos de entrega

Formatos prontos para apresentar o resultado. Escolha pelo tamanho do problema (intensidade rápida, padrão ou profunda, ver `SKILL.md`).

## Sumário
1. Leque rápido (intensidade rápida)
2. Leque de soluções (intensidade padrão)
3. Relatório de ideação (intensidade profunda)
4. Proposta de uma página
5. Exemplo preenchido

---

## 1. Leque rápido

```markdown
**Problema, reformulado:** <uma frase: "Como poderíamos…?">

- **Segura:** <ideia> — <por que funciona> · risco: <...>
- **Ousada:** <ideia> — <ganho esperado> · risco: <...>
- **Fora da caixa:** <ideia> — <o que muda na forma de ver o problema> · risco: <...>

**Recomendo:** <qual> porque <motivo>. **Primeiro passo:** <ação pequena e concreta>.
```

## 2. Leque de soluções

```markdown
# <Tema>

## O problema
- **Como está:** <situação atual com dados, se houver>
- **Reformulação:** Como poderíamos <resultado> para <quem>, <condição>?
- **Causa provável:** <o que os porquês revelaram>
- **Restrições reais:** <...> · **Suposições questionadas:** <...>
- **Sucesso será:** <métrica ou critério observável>

## Ideias geradas (<N> ideias, técnicas: <quais>)
<lista curta das mais interessantes, agrupadas por tema>

## As opções
### 1. Segura — <nome>
<o que é, em 2–3 frases> · Impacto: <...> · Esforço: <...> · Risco: <...> · Reversível: <sim/não>

### 2. Ousada — <nome>
<...>

### 3. Fora da caixa — <nome>
<...>

## Recomendação
- **Escolha:** <opção ou combinação> — **porque:** <2–3 critérios decisivos>
- **Trade-off aceito:** <o que se perde>
- **Risco principal e mitigação:** <...>
- **Primeiro passo (menor teste):** <experimento, critério de sucesso, prazo>
- **Mudaria de ideia se:** <sinal que faria voltar para outra opção>
```

## 3. Relatório de ideação

Acrescente ao leque de soluções:
- **Matriz impacto × esforço** com todas as candidatas posicionadas.
- **Tabela de critérios** com nota e justificativa por opção (inclusive os critérios eliminatórios).
- **Pré-mortem** da opção recomendada: motivos de fracasso, mitigação, sinal de alerta.
- **Plano de experimento:** hipótese, teste, métrica, critério de sucesso e de fracasso, prazo, custo máximo.
- **Perguntas em aberto** que precisam de dados ou de decisão de outra pessoa.

## 4. Proposta de uma página

Para levar a ideia a quem decide (gestor, cliente, sócio):

```markdown
# <Título da proposta>
**Problema:** <1–2 frases com o impacto em números ou fatos>
**Proposta:** <a solução em 2–3 frases>
**Por que esta e não outra:** <comparação curta com a alternativa óbvia>
**Resultado esperado:** <métrica e prazo>
**Custo e esforço:** <...>
**Riscos e como reduzimos:** <...>
**Primeiro passo:** <teste pequeno, com prazo e critério de sucesso>
**Decisão pedida:** <o que precisa ser aprovado agora>
```

## 5. Exemplo preenchido (leque rápido)

Para um exemplo com as 5 fases completas (intensidade padrão), veja `exemplo-completo.md`.

**Problema, reformulado:** Como poderíamos fazer mais clientes novos concluírem o cadastro no celular, sem perder os dados de que precisamos para a entrega?

- **Segura:** reduzir o formulário a nome, celular e CEP, com o endereço preenchido pelo CEP. Padrão comprovado, risco baixo.
- **Ousada:** cadastro só no momento da primeira compra: a pessoa navega e monta o carrinho sem conta, e os dados são pedidos uma vez, no checkout. Ganho potencialmente grande; exige ajustar o fluxo de pedido.
- **Fora da caixa:** cadastro pelo WhatsApp: a pessoa manda "oi", recebe um link já identificado pelo número e confirma o endereço numa tela. Usa o canal onde o público já está; depende de integração e de consentimento claro.

**Recomendo:** começar pela segura (resultado em dias) e testar a ousada em 20% dos acessos. **Primeiro passo:** medir hoje o abandono por campo para confirmar onde as pessoas desistem.
