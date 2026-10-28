# 03 · Avaliação e decisão

Depois de gerar, é hora do rigor. Esta fase transforma uma lista de ideias numa recomendação defensável.

## Sumário
1. Organizar as ideias
2. Critérios explícitos
3. Matriz impacto × esforço
4. Pontuação ICE / RICE
5. Decisões reversíveis × irreversíveis
6. Pré-mortem
7. Menor teste viável
8. Como formular a recomendação

---

## 1. Organizar as ideias

1. **Agrupe** ideias parecidas por tema ou mecanismo.
2. **Combine** ideias complementares numa solução mais forte (a ideia A resolve o começo, a B resolve o fim).
3. **Resgate o núcleo** das ideias absurdas: o que nelas é aproveitável?
4. **Selecione** de 3 a 5 candidatas, garantindo variedade: pelo menos uma segura, uma ousada e uma fora da caixa.

## 2. Critérios explícitos

Combine os critérios antes de avaliar e diga quais são. Base recomendada:

| Critério | Pergunta |
|---|---|
| **Impacto** | Quanto isso move o critério de sucesso definido na fase 1? |
| **Viabilidade** | Temos (ou conseguimos) a tecnologia, as habilidades e o acesso necessários? |
| **Custo** | Quanto custa em dinheiro, tempo e manutenção futura? |
| **Risco** | O que pode dar errado, com que probabilidade e qual o estrago? |
| **Reversibilidade** | Se der errado, conseguimos desfazer? A que custo? |
| **Tempo até o resultado** | Quando começamos a ver efeito? |

Acrescente os do contexto: segurança e privacidade, conformidade legal (LGPD, regras do setor), aderência à marca, experiência do usuário, dependência de fornecedores.

Se algum critério for eliminatório (ex.: "precisa cumprir a LGPD"), aplique-o antes de pontuar.

## 3. Matriz impacto × esforço

|  | **Esforço baixo** | **Esforço alto** |
|---|---|---|
| **Impacto alto** | **Vitórias rápidas:** faça primeiro | **Apostas:** planeje e teste antes |
| **Impacto baixo** | **Ajustes:** faça se sobrar tempo | **Armadilhas:** evite |

Posicione cada candidata e justifique em uma frase. As melhores recomendações costumam combinar uma vitória rápida (resultado agora) com uma aposta (resultado grande depois).

## 4. Pontuação ICE / RICE

Para comparar muitas ideias de forma rápida, dê notas de 1 a 10:
- **ICE = Impacto × Confiança × Facilidade.**
  - *Confiança* é o quanto temos evidência de que vai funcionar, e não o quanto gostamos da ideia.
- **RICE = (Alcance × Impacto × Confiança) ÷ Esforço.** Útil quando o número de pessoas afetadas varia muito entre as ideias.

As notas são estimativas. Use-as para ordenar e discutir, não como verdade. Explique as notas mais altas e as mais baixas.

## 5. Decisões reversíveis × irreversíveis

- **Reversíveis ("porta de duas vias"):** dá para voltar atrás com pouco custo, como uma mudança de texto, uma feature com flag ou um teste A/B. Decida rápido, teste, aprenda.
- **Irreversíveis ("porta de uma via"):** voltar atrás é caro ou impossível, como migração de banco, troca de stack, contrato longo, demissão, publicação de dados. Estude mais, ouça mais pessoas, faça pré-mortem e prefira etapas que mantenham opções abertas.

Pergunte sempre: dá para transformar esta decisão irreversível em reversível? Por exemplo, com um piloto, uma migração gradual ou um contrato curto primeiro.

## 6. Pré-mortem

1. Imagine que a solução escolhida foi implementada e, 6 meses depois, **fracassou**.
2. Liste todos os motivos plausíveis do fracasso: técnicos, de adoção, de custo, de equipe, externos.
3. Para cada motivo forte, defina uma mitigação ou um sinal de alerta precoce.
4. Se um motivo não tiver mitigação e for provável, reconsidere a escolha.

O pré-mortem é mais eficaz que perguntar "o que pode dar errado?", porque dá permissão para criticar algo que parece decidido.

## 7. Menor teste viável

Antes de investir na solução inteira, desenhe o experimento mais barato que responde: **"isso funciona?"**

| Tipo de dúvida | Teste barato |
|---|---|
| As pessoas querem isso? | página de interesse com botão "quero", pesquisa curta, 5 entrevistas, pré-venda |
| Conseguem usar? | protótipo clicável ou de papel testado com 5 pessoas |
| Tecnicamente funciona? | prova de conceito descartável de algumas horas, com dados reais |
| Aguenta o volume? | teste de carga num ambiente de cópia |
| Vale o custo? | piloto com um cliente ou uma equipe, por 1 ou 2 semanas |
| Melhora a métrica? | teste A/B com critério de sucesso definido antes |

Para cada teste, defina:
- **hipótese:** "se fizermos X, a métrica Y melhora Z";
- **critério de sucesso e de fracasso**, decidido antes;
- **prazo e custo máximo.**

## 8. Como formular a recomendação

Uma boa recomendação tem:
1. **A escolha:** qual opção, ou combinação de opções.
2. **O porquê:** os 2 ou 3 critérios decisivos.
3. **O que se perde:** o principal trade-off aceito.
4. **O risco principal e a mitigação.**
5. **O primeiro passo concreto,** de preferência o menor teste viável, com prazo.
6. **O que mudaria a recomendação,** por exemplo: "se o teste mostrar menos de X, voltamos para a opção segura".

Formatos prontos em `modelos-de-entrega.md`.
