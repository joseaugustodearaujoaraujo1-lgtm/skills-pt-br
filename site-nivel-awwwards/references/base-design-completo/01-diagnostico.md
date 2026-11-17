# 01 · Diagnóstico

Como avaliar um site de forma objetiva antes de mudar qualquer coisa. Sem diagnóstico, "melhorar" vira gosto pessoal.

## Sumário
1. Testes rápidos
2. Script de inventário
3. Rubrica de 10 dimensões
4. Como registrar

---

## 1. Testes rápidos

**Teste dos 5 segundos.** Olhe o primeiro quadro da página (sem rolar) por 5 segundos e responda:
- O que é isso?
- Para quem é?
- O que eu devo fazer agora?

Se alguma resposta não for óbvia, a hierarquia ou o texto do topo precisam de trabalho antes de qualquer ajuste estético.

**Teste de desfocar (squint test).** Desfoque a vista ou aplique `filter: blur(6px)` na página. O que continua visível são os elementos de maior peso. Eles deveriam ser: título principal, ação principal e, no máximo, uma imagem de apoio. Se o que se destaca é um banner de cookies, um ícone decorativo ou um bloco de cor sem função, o peso visual está mal distribuído.

```js
// cole no console para o squint test; rode de novo com '' para desfazer
document.body.style.filter = 'blur(6px)';
```

**Teste do celular.** Abra em 375px de largura:
- Há rolagem horizontal?
- Os textos estão legíveis sem zoom (corpo com pelo menos 16px)?
- Os botões são fáceis de tocar (cerca de 44px de altura)?
- A ação principal aparece sem rolar muito?

**Teste do teclado.** Navegue só com Tab, Shift+Tab, Enter e Esc:
- O foco é sempre visível?
- A ordem faz sentido?
- Menus e modais abrem e fecham pelo teclado?

## 2. Script de inventário

Cole no console do navegador (ou rode com a ferramenta de JavaScript do navegador). Ele conta o que a página realmente usa:

```js
(() => {
  const visible = [...document.querySelectorAll('body *')].filter((el) => el.getClientRects().length > 0);
  const tally = (pick) => {
    const counts = new Map();
    for (const el of visible) {
      const value = pick(getComputedStyle(el), el);
      if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return [...counts].sort((a, b) => b[1] - a[1]).slice(0, 25);
  };
  const hasText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
  return {
    fontes: tally((s) => s.fontFamily.split(',')[0].trim()),
    tamanhosDeTexto: tally((s, el) => (hasText(el) ? s.fontSize : null)),
    pesos: tally((s, el) => (hasText(el) ? s.fontWeight : null)),
    alturasDeLinha: tally((s, el) => (hasText(el) ? s.lineHeight : null)),
    coresDeTexto: tally((s, el) => (hasText(el) ? s.color : null)),
    fundos: tally((s) => (s.backgroundColor !== 'rgba(0, 0, 0, 0)' ? s.backgroundColor : null)),
    raios: tally((s) => (s.borderRadius !== '0px' ? s.borderRadius : null)),
    sombras: tally((s) => (s.boxShadow !== 'none' ? s.boxShadow : null)),
    espacamentos: tally((s) => (s.paddingTop !== '0px' ? s.paddingTop : null)),
  };
})();
```

**Como ler o resultado:**
- **Mais de 2 famílias de fonte** (sem contar a de código): falta de critério.
- **Mais de 8 a 10 tamanhos de texto diferentes:** não existe escala; há valores quebrados como 15px, 17px, 19px.
- **Muitos cinzas parecidos** (ex.: `#666`, `#6b6b6b`, `#707070`): falta de tokens.
- **Mais de 3 raios ou de 3 sombras diferentes:** componentes feitos um a um, sem sistema.
- **Espaçamentos sem padrão** (13px, 18px, 22px): falta escala de espaço.

## 3. Rubrica de 10 dimensões

Dê nota a cada dimensão com evidência:
- **0** = quebrado ou ausente;
- **1** = fraco, atrapalha;
- **2** = aceitável;
- **3** = bom, consistente e intencional.

Some e mostre o total (máximo 30) antes e depois.

### D1 · Objetivo e hierarquia
- **3:** o teste dos 5 segundos passa; a ação principal é o elemento mais forte; há um caminho claro de leitura (título → apoio → ação).
- **1:** vários elementos competem (3 botões iguais, imagem mais forte que o título); não fica claro o que fazer.
- **Sinais:** muitos botões do mesmo estilo; título genérico ("Bem-vindo"); ação principal abaixo da dobra no celular.

### D2 · Tipografia
- **3:** 1 ou 2 famílias, escala definida, corpo legível (16 a 18px, altura de linha 1,5 a 1,7), linhas de 45 a 75 caracteres, títulos com peso e espaçamento coerentes.
- **1:** muitas fontes e tamanhos; corpo pequeno ou cinza-claro; linhas longas demais; títulos que quebram mal.

### D3 · Cor e contraste
- **3:** paleta com função (neutros, um acento, cores semânticas); contraste AA em textos e componentes; o acento é usado com parcimônia e indica ação.
- **1:** texto cinza-claro sobre branco; acento em tudo; cores que não significam nada; links indistinguíveis do texto.

### D4 · Espaçamento e ritmo
- **3:** escala de espaço consistente; espaço interno de grupos menor que o externo; seções com respiro proporcional.
- **1:** elementos colados ou flutuando; espaçamentos aleatórios; margens que dobram ou somem.

### D5 · Layout e alinhamento
- **3:** grid claro, bordas alinhadas, largura de leitura controlada, composição variada entre seções sem perder coerência.
- **1:** tudo centralizado por padrão; elementos desalinhados por poucos pixels; seções todas iguais (título + 3 cards); conteúdo esticado em telas largas.

### D6 · Componentes e estados
- **3:** botões, cards, inputs e links seguem o mesmo sistema; todos têm hover, foco visível, ativo e desabilitado; formulários com labels e erros úteis.
- **1:** cada botão de um jeito; sem foco visível; placeholders no lugar de labels; carregamento e erro sem feedback.

### D7 · Responsividade
- **3:** funciona de 320px a telas largas; tipografia e espaçamentos fluidos; alvos de toque adequados; imagens recortadas com intenção.
- **1:** rolagem horizontal; texto minúsculo ou gigante no celular; menu que não abre; elementos sobrepostos.

### D8 · Acessibilidade
- **3:** HTML semântico, ordem lógica de títulos (h1 a h3), textos alternativos, navegação por teclado, foco visível, contraste AA, `prefers-reduced-motion` respeitado.
- **1:** divs clicáveis, imagens sem alt, foco removido (`outline: none` sem substituto), animações sem controle.
- **Ferramentas:** axe DevTools, Lighthouse, WAVE.

### D9 · Motion e interação
- **3:** poucas animações, coerentes entre si, com propósito (feedback, orientação, ênfase); durações curtas; nada essencial escondido atrás de animação.
- **1:** tudo anima ao rolar; conteúdo invisível até animar; animações longas, que travam ou dão enjoo; nenhum feedback ao clicar.

### D10 · Identidade e acabamento
- **3:** a página só poderia ser deste negócio. Fotos e imagens reais, um detalhe característico do assunto, ícones de uma única família, imagens com tratamento consistente.
- **1:** parece um modelo; fotos de banco genéricas; misto de estilos de ícone; padrões típicos de "feito por IA" (ver `08-cara-de-ia.md`).

## 4. Como registrar

Para cada nota abaixo de 3, registre:
- **Onde:** seção, componente ou seletor.
- **O que vi:** evidência concreta. Bom: "o botão secundário tem o mesmo peso que o principal". Ruim: "falta contraste".
- **Impacto:** o que isso causa para o visitante.
- **Correção proposta** e **esforço** (baixo, médio ou alto).

Depois priorize pelo impacto no objetivo da página dividido pelo esforço.
