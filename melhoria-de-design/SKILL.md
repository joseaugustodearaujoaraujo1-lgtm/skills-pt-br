---
name: melhoria-de-design
description: Processo completo para diagnosticar e melhorar o design de sites e interfaces web existentes (landing pages, sites institucionais, portfólios, e-commerce, SaaS, dashboards), com rubrica de avaliação, tipografia, cor e contraste, espaçamento, layout, componentes, motion, conversão, acessibilidade e como evitar a "cara de site feito por IA", além de exemplos prontos em CSS puro, Tailwind e React e referências como naocodei.com (motion) e pinstack.app (componentes). Use sempre que alguém pedir para melhorar, modernizar, repaginar, deixar mais bonito/profissional, revisar o visual, dar identidade, corrigir layout quebrado no celular, avaliar um site ou uma tela, ou quando um site parecer genérico, amador ou "feito por IA" — mesmo que a pessoa não use a palavra "design". Também serve para criar páginas novas com o mesmo padrão de qualidade.
---

# Melhoria de Design

Esta skill guia a melhoria visual e de experiência de sites e interfaces web. Ela serve para qualquer stack (HTML/CSS puro, Tailwind, React, Vue, Svelte, WordPress, construtores) e qualquer tipo de site.

O que "melhorar" significa aqui:
- a pessoa entende em segundos o que o site é e o que fazer;
- a hierarquia guia o olhar;
- tudo é consistente;
- funciona bem no celular e para todos;
- o site tem identidade própria em vez de parecer um modelo genérico.

Enfeite que atrapalha essas coisas é piora, não melhoria.

## 1. Entender o contexto (antes de tocar em qualquer coisa)

Descubra, perguntando só o que não estiver claro:
- **Objetivo da página:** vender, gerar contato, apresentar portfólio, informar, cadastrar? Qual é a ação principal?
- **Público:** quem visita e em que aparelho (a maioria acessa pelo celular?).
- **Identidade existente:** logo, cores e fontes da marca que precisam ser mantidas? Existe design system ou arquivo de tokens no projeto?
- **Stack e restrições:** onde o código está, o que pode ser alterado, prazo.
- **Referências:** sites que a pessoa gosta (e por quê) e o que ela não quer.

Respeite sempre o que já existe e funciona. Precedência: as palavras do usuário, depois o design system do projeto, depois as suas escolhas.

## 2. Escolher o nível de intervenção

Pergunte qual nível aplicar, recomendando um com base no diagnóstico inicial:

| Nível | O que muda | Quando |
|---|---|---|
| **1 · Ajuste fino** | Espaçamento, escala tipográfica, contraste, alinhamento, estados de botões e links, responsividade. Identidade e estrutura ficam iguais. | O site é bom, mas está "quase lá"; pouco tempo; marca consolidada. |
| **2 · Repaginação** | Sistema de tokens novo (cor, tipo, espaço, raio, sombra), componentes refeitos, motion leve, ajustes de estrutura nas seções. | O site parece datado, inconsistente ou amador, mas o conteúdo e a estrutura servem. |
| **3 · Redesign** | Nova direção visual, nova arquitetura da página, novo conteúdo de seções (com aprovação). | O site não cumpre o objetivo, ou a marca mudou. |

Nos níveis 2 e 3, apresente a direção proposta (paleta, fontes, ideia de layout, uma seção de exemplo) e espere aprovação antes de aplicar no site inteiro.

## 3. Processo

### Passo 1 — Capturar o estado atual
- Prints em desktop (~1440px) e celular (~375px), nos modos claro e escuro se existirem.
- Inventário do que está em uso: famílias de fonte, tamanhos, cores, espaçamentos, raios, sombras. O script de inventário está em `references/01-diagnostico.md`.
- Anote o objetivo da página e a ação principal.

### Passo 2 — Diagnosticar
Use a rubrica de 10 dimensões de `references/01-diagnostico.md` e dê nota de 0 a 3 em cada uma, sempre com evidência (o que você viu e onde). Faça também o teste dos 5 segundos e o teste de desfocar a vista (squint test), descritos no mesmo arquivo.

### Passo 3 — Priorizar
Ordene os problemas por **impacto no objetivo ÷ esforço**. Em geral, a ordem que mais rende é:
1. hierarquia e clareza da ação principal;
2. tipografia;
3. espaçamento;
4. cor e contraste;
5. componentes e estados;
6. responsividade;
7. motion e acabamento.

Proponha as 5 a 10 mudanças de maior retorno; não tente consertar tudo de uma vez.

### Passo 4 — Propor
Mostre ao usuário o diagnóstico resumido, as mudanças priorizadas e, nos níveis 2 e 3, os tokens propostos. Explique cada mudança em linguagem simples ("o botão principal some no fundo; vou aumentar o contraste e deixá-lo como o único botão cheio da página").

### Passo 5 — Implementar
Siga esta ordem, porque cada camada se apoia na anterior:
1. **Tokens:** variáveis de cor, tipo, espaço, raio, sombra e motion, num lugar só.
2. **Tipografia e espaçamento globais.**
3. **Layout e grid** das seções.
4. **Componentes** (botões, cards, formulários, navegação) com todos os estados.
5. **Conteúdo visual:** imagens, ícones, ilustrações.
6. **Motion**, por último e com moderação.

Regras de implementação:
- Mudanças pequenas e verificáveis.
- Mantenha o conteúdo do usuário. Melhorias de texto são sugestões, nunca invenções: não crie depoimentos, números ou logos de clientes.
- Respeite a stack: não troque CSS por Tailwind, nem adicione biblioteca, sem combinar.
- Exemplos prontos em `references/implementacao/`.

### Passo 6 — Verificar
- Prints de antes e depois, lado a lado, em desktop e celular.
- Modo escuro, se existir; contraste dos textos e botões; navegação por teclado com foco visível; `prefers-reduced-motion`; console sem erros; sem rolagem horizontal em 375px.
- Refaça a rubrica e mostre a nota antes e depois.
- Se o projeto tiver a skill `prevencao-de-falhas`, os itens FE-12 (acessibilidade) e FE-13 (performance) complementam esta verificação.

## 4. Qual referência carregar

| Preciso de… | Arquivo |
|---|---|
| Avaliar um site, dar notas, achar problemas | `references/01-diagnostico.md` |
| Escolher fontes, montar escala, hierarquia de texto | `references/02-tipografia.md` |
| Paleta, tokens de cor, modo escuro, contraste | `references/03-cor-e-contraste.md` |
| Espaçamento, grid, alinhamento, responsivo | `references/04-layout-e-espaco.md` |
| Botões, cards, menu, hero, formulários, pricing, footer | `references/05-componentes.md` |
| Animações e microinterações | `references/06-motion.md` e `references/catalogo-naocodei.md` |
| A página precisa converter (vender, gerar contato) | `references/07-conversao.md` |
| O site parece genérico ou "feito por IA" | `references/08-cara-de-ia.md` |
| Inspiração, galerias, fontes, ícones, cores | `references/09-referencias.md` |
| Código pronto | `references/implementacao/css-puro.md`, `tailwind.md` ou `react.md` (só o da stack) |

## 5. Regras de ouro

1. **Uma ação principal por tela.** Ela é o elemento de maior destaque; o resto é secundário.
2. **Hierarquia antes de estética.** Se tudo chama atenção, nada chama.
3. **Poucas decisões, repetidas com consistência:** 1 ou 2 famílias de fonte, uma escala de tamanhos, uma escala de espaços, um acento de cor, um raio, uma ou duas sombras.
4. **Espaço é estrutura.** O espaço dentro de um grupo é menor que o espaço entre grupos.
5. **Contraste legível sempre:** texto com 4,5:1, texto grande e componentes com 3:1.
6. **Celular primeiro.** A maior parte das visitas vem do celular; teste em 375px antes de considerar pronto.
7. **Identidade vem do assunto**, não de tendência: materiais, vocabulário, fotos reais e dados reais do negócio.
8. **Motion com propósito:** feedback, orientação ou ênfase. Anime só `transform` e `opacity` e respeite `prefers-reduced-motion`.
9. **Conteúdo real:** nada de lorem ipsum, números inventados ou depoimentos falsos.
10. **Prove com antes e depois.** Mostre prints e a nota da rubrica, não só a descrição.

## 6. Formato do relatório

```markdown
# Melhoria de design — <site/página>
Nível: <1/2/3> · Objetivo da página: <...> · Ação principal: <...>

## Diagnóstico (nota 0–3)
| Dimensão | Antes | Depois | Evidência |
|---|---|---|---|
| Hierarquia e objetivo | 1 | 3 | CTA competia com 3 botões iguais no hero |
| ... | | | |

## Mudanças feitas (por prioridade)
1. <mudança> — <por quê> — <arquivos>

## Antes e depois
<prints desktop e celular>

## Sugestões que dependem de você
- <ex.: fotos reais da equipe, depoimentos verdadeiros, texto do hero>

## Não verificado
- <ex.: navegadores antigos, modo escuro do sistema operacional>
```

## 7. Criar uma página do zero

Siga as mesmas referências. A ordem muda:
1. Objetivo, público e conteúdo real.
2. Estrutura das seções (`07-conversao.md` tem roteiros por tipo de site).
3. Direção visual ancorada no assunto (`08-cara-de-ia.md`, seção "Como dar identidade").
4. Tokens.
5. Componentes.
6. Motion.
7. Verificação.

Proponha a direção e espere aprovação antes de construir a página inteira.

## 8. Autorização e uso de sites externos

- Antes de editar arquivos, navegar em sites ou instalar dependências, siga as regras de autorização do ambiente e do usuário.
- Nos sites de referência, não faça login nem crie contas. Itens pagos (PRO) ou que exigem login ficam por conta do usuário, com o acesso dele.
- Use referências como inspiração de princípios (hierarquia, espaçamento, composição). Nunca copie marca, logo, texto ou imagens de terceiros.
