# Portão de qualidade (rubrica de entrega)

Passe o site por esta rubrica **antes** de dizer que está pronto. Ela segue os critérios do júri do Awwwards (Design, Usabilidade, Criatividade e Conteúdo) mais os requisitos técnicos. Dê uma nota de 0 a 10 a cada critério, **com a evidência** (captura, medição ou trecho de código). Abaixo de 7 em qualquer item = corrigir e repetir.

## 1. Design (peso 40%)
- [ ] A identidade é própria e coerente (paleta, tipografia, forma, motion) e bate com `brief.json`.
- [ ] Escala tipográfica dramática: o maior texto é ≥ 4× o corpo; no máximo 2 famílias + 1 detalhe.
- [ ] Um acento de cor; neutros tingidos; contraste AA (texto 4,5:1; grande 3:1).
- [ ] Composição com intenção: grade, assimetria, respiro vertical (`--space-section`).
- [ ] Imagens com tratamento consistente; nada de foto genérica.
- [ ] Passou na lista de [anti-clichês](anti-cliches.md).
- [ ] Comparado lado a lado com 2 referências do acervo: nível de acabamento equivalente, aparência **diferente**.

## 2. Usabilidade (peso 30%)
- [ ] Navegação clara em ≤ 5 itens visíveis; menu funciona em teclado e toque.
- [ ] Foco visível; ordem de tabulação lógica; alvos de toque ≥ 44 px.
- [ ] `prefers-reduced-motion` desliga/reduz todo movimento; nada essencial depende de hover.
- [ ] Responsivo de verdade em **1440, 768 e 390 px** (sem rolagem horizontal indesejada).
- [ ] Estados: hover, focus, active, disabled, carregando, erro, vazio e 404.
- [ ] A ação principal é óbvia na primeira dobra.

## 3. Criatividade (peso 20%)
- [ ] Há **um** gesto de assinatura memorável (transição, hero, interação, 3D leve) que serve ao conceito.
- [ ] A ideia do site cabe em uma frase e o conceito é **memorável em 5 segundos**.
- [ ] Há pelo menos **um momento "uau"** que o visitante lembra depois (normalmente o próprio gesto de assinatura).
- [ ] **Todo 3D é WebGL real e ultrarrealista (PBR, ambiente, sombras); imagem recortada = nota 0.** **Todo objeto 3D tem referência visual detalhada** (imagem com várias vistas ou vídeo) em `referencias-3d/<objeto>/`, e o render foi **comparado** com ela (silhueta, proporção, material, luz). Sem referência = nota 0 neste item.
- [ ] Teste da logo coberta: reconhece-se a marca/tema pelo visual e pelo texto.

## 4. Conteúdo (peso 10%)
- [ ] O scroll conta uma história com começo, meio e fim (não é uma pilha de seções soltas).
- [ ] Títulos concretos e específicos; microcopy com personalidade; sem texto de enchimento.
- [ ] Prova real (números, nomes, casos), não genérica.
- [ ] Direitos de imagem/fonte/ícone conferidos; créditos quando exigido.

## 5. Requisitos técnicos (obrigatórios)
| Item | Meta | Como medir |
|---|---|---|
| Lighthouse desktop (Desempenho) | ≥ 90 | Lighthouse no Chrome |
| Lighthouse celular (Desempenho) | ≥ 75 | idem, simulando rede lenta |
| LCP | < 2,5 s | Lighthouse / PageSpeed |
| CLS | < 0,1 | idem; `aspect-ratio` nas imagens |
| Acessibilidade | ≥ 95 | Lighthouse + teste de teclado |
| Peso da primeira dobra | < ~1 MB (3D leve: ≈ 200 KB de cena) | aba Rede, com cache desligado |
| Console | sem erros | DevTools |
| Fluidez | 60 fps no scroll e nas animações, inclusive em celular de gama média | aba Desempenho (FPS) + aparelho real |
| 3D | pôster até o WebGL ligar (depois da entrada), compilação paralela, sem GPU = sem 3D, render sob demanda; A/B de TBT com e sem 3D | [3d-leve.md](3d-leve.md) |

## Exemplo medido (Atelier Lume, 2026-11-16, Lighthouse 13)
| Versão | Desempenho desktop | Desempenho celular | Acessibilidade | Observação |
|---|---|---|---|---|
| 1: sem 3D, receitas originais | 86 | não medido | 91 | falhou: contraste do texto esmaecido (1,4:1), `aria-label` em `<p>`, fontes por `@import` |
| 2: + diamante 3D ligado no carregamento | 62 | falhou (NO_FCP) | 100 | TBT 1.960 ms: `getContext('webgl2')` bloqueou 250–750 ms |
| 3: pôster + 3D após a entrada | **80** | **61** | 100 | LCP 0,7 s (desktop) / 3,0 s (celular); TBT 380 / 2.480 ms |
| 4: + otimizações de thread principal | 84 | 61 | 100 | ainda abaixo da meta no celular |
A versão 3 **não atinge** a meta de desempenho (≥ 90 desktop, ≥ 75 celular). Gargalo restante: thread principal (Estilo e Layout 0,8 s no desktop e 3,2 s no celular; SplitText, ScrollTrigger e Lenis). Ideias ainda não aplicadas: dividir texto (SplitText) só quando a seção se aproxima, `content-visibility: auto` nas seções sem pin, não chamar `ScrollTrigger.refresh()` na carga, fontes hospedadas no próprio site. A máquina de teste é fraca (o Lighthouse avisa CPU mais lenta que o esperado): compare **versões na mesma máquina**, não notas absolutas.

## Exemplo medido (Grão Raro, HTML + GSAP, 2026-11-16, projeto de teste)
| Etapa | Desempenho desktop | Desempenho celular | Acessibilidade | Observação |
|---|---|---|---|---|
| primeira versão | 98 | 64–67 | 96 | contraste do manifesto com opacidade .35 (3:1 falhou); TBT 2,4–3 s no celular |
| após as correções | 96–98 | 67–75 (oscila) | **100** | opacidade mínima .5; divisão de texto só ao se aproximar; sem `text-rendering` global; `content-visibility` nas seções de baixo |
Boas práticas 100 e SEO 100 nas duas. A nota de celular varia entre rodadas na mesma máquina: rode 2 ou 3 vezes e relate a faixa. Lições em `elementos.md`, seção 9. O `scripts/verificar-site.mjs` automatiza as checagens de contraste, console, overflow e movimento reduzido.

## Como relatar
Responda em uma tabela: critério, nota, evidência, correção feita. Diga também **o que não foi testado** (ex.: celular real, leitor de tela). Não declare "nível Awwwards": declare o que foi medido.
