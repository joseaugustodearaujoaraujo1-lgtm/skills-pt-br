# Montar o acervo do zero (guia)

O acervo é uma **base local de sites premiados** (Awwwards e One Page Love), com capturas e medidas. Ele alimenta a pesquisa de referências (`pesquisar-referencias.mjs`, `opcoes.mjs`, `montar-brief.mjs`) e a geração de `padroes.md` e `padroes-ux.md`. No computador do autor ele tem ~1.800 sites coletados, 910 utilizáveis. Este guia refaz o mesmo acervo em qualquer máquina.

## Regra de ouro: o bruto nunca sobe ao GitHub

| Fica só no computador | Pode subir |
|---|---|
| Capturas (`*.jpg`), HTML, `dados.json`, `estrutura.json`, `acervo.json` | Os scripts de coleta (código) |
| Qualquer arquivo copiado do site original | `padroes.md`, `padroes-ux.md` (números e resumos escritos por nós) |
| | Fichas destiladas em a pasta `acervo-destilado` dentro de `references` (opcional, ver §7) |

Motivos: direitos autorais (capturas são obra de terceiros), tamanho (arquivos grandes passam de 100 MB, o GitHub recusa) e a base muda sempre. Acrescente ao `.gitignore` do repositório: `acervos-design/`, `acervo/`.

## 1. Pasta e formato

Pasta padrão: `~/Documents/acervos-design/acervo/`. Outra pasta: variável `ACERVO=/caminho` (os scripts da skill respeitam).

```
acervo/
  awwwards/final/
    acervo.json                 lista de todos os sites desta fonte
    <slug>/
      desktop.jpg               1ª dobra, 1440×900, depois de esperar o preloader
      desktop-scroll.jpg        depois de 1 rolagem de teste
      mobile.jpg                390 px
      dados.json                o registro do site (mesmo objeto de acervo.json)
      estrutura.json            medidas (§4)
  onepagelove/final/            mesma estrutura
```

Cada item de `acervo.json` (e o `dados.json` do site) tem estes campos; os scripts da skill leem exatamente estes:

| Campo | Para quê |
|---|---|
| `slug`, `titulo`, `url`, `urlFinal` | identificação (`urlFinal` = depois de redirecionamentos) |
| `ano`, `nicho`, `generos[]`, `estilos[]` | filtros por tema (`temas.json` mapeia tema → nichos) |
| `http`, `tituloPagina`, `erroDesktop` | `qualidade.mjs` descarta erro, bloqueio e domínio parado |
| `libs` | `{gsap, scrollTrigger, lenis, locomotive, three, canvas, video, lottie, rive, swiper, barba, splitText, framerMotion}` (booleano ou contagem) |
| `fontes[]` | famílias de fonte usadas |

## 2. Ambiente

```bash
mkdir -p ~/Documents/acervos-design && cd ~/Documents/acervos-design
npm init -y && npm i playwright && npx playwright install chromium
```

Todos os scripts abaixo usam Playwright, Chromium em 1440×900 (desktop) e 390×844 (celular).

## 3. Coletar a lista de sites (por fonte)

1. **Awwwards:** páginas `https://www.awwwards.com/websites/sites_of_the_day/` e `https://www.awwwards.com/websites/<categoria>/?page=N` (ex.: `fashion`, `architecture`, `technology`, `e-commerce`). Para cada card guarde `titulo`, a URL do site, o `ano` e a categoria (`nicho`).
2. **One Page Love:** `https://onepagelove.com/gallery/` e as listas `genre/<gênero>` e `style/<estilo>` (`scroll-effects`, `3d`, `typographic`, `editorial`, `horizontal-layout`). Guarde também `generos[]` e `estilos[]`.
3. Gere o `slug` (minúsculas, sem acento, hífens) e o `acervo.json`.

Boas maneiras (obrigatório): espere 2 a 3 s entre páginas, no máximo 2 abas ao mesmo tempo, identifique o navegador normalmente, só leitura (sem login nem formulário), pare se a fonte bloquear. O Awwwards costuma recusar conexões de nuvem: **rode no seu computador**, com a sua internet.

## 4. Capturar e medir cada site

Para cada item, abra o site em 1440×900 e faça:

1. **Espere o preloader acabar** (a página para de mudar, até ~12 s). Sem isso a captura pega só a tela de carregamento (problema real do acervo antigo).
2. Salve `desktop.jpg`; role uma vez e salve `desktop-scroll.jpg`; repita em 390 px para `mobile.jpg`.
3. Registre `http`, `tituloPagina`, `urlFinal`, `libs` (procure `window.gsap`, `ScrollTrigger`, `Lenis`, `THREE`, `<canvas>`, `<video>`…) e `fontes`.
4. Rode a extração de `estrutura.json` (versão 3), medida no DOM e no CSS computado:

| Bloco | Campos |
|---|---|
| `versao`, `erro` | `3`; só presente se falhou |
| `pagina` | `alturaVh`, `secoes`, `palavras`, `paddingVerticalMedianoPx`, `rolagemVirtual` |
| `menu` | `links`, `altura`, `fixo`, `hamburguer`, `textoEmCaixaAlta`, `transparente` |
| `preloader` | `existe`, `comPorcentagem` |
| `hero` | `video`, `canvas`, `imagemGrande`, `botoes` |
| `titulo` | `px`, `emVw`, `peso`, `entrelinha`, `trackingEm`, `caixaAlta`, `serifa`, `alinhamento`, `palavras` |
| `corpo` | `px`, `entrelinha`, `h` |
| `rolagem` | `lenis`, `locomotive`, `pinSpacer`, `sticky`, `carrossel`, `scrollSnap` |
| `efeitos` | `clipPath`, `mixBlend`, `backdropFilter`, `filtro`, `gradiente`, `textoGradiente`, `sombra` |
| `forma` | `botaoPilula`, `grid`, `raioCartaoMedianoPx` |
| `midia` | `img`, `imgLazy`, `imgSrcset`, `svg`, `video`, `videoAuto`, `canvas`, `iframe` |
| `motion` | `duracoesMs`, `curvas`, `animacoesAtivas`, `marquee`, `prefersReducedMotion` |
| `rodape` | `existe`, `maiorTextoPx` |
| raiz | `cursorCustom`, `larguraMaxMedianaPx` |

Rode em lote (50 a 100 por vez), com 2 abas, e **retome** de onde parou (pule o que já tem `estrutura.json`). Sites que falham ficam com `"erro"` e são ignorados pelos scripts.

## 5. Limpar

Não apague nada: o filtro é por código. `scripts/qualidade.mjs` descarta (`capturaInvalida`) status ≥ 400 e títulos de bloqueio ("just a moment", "403", "domain for sale"…). Os scripts também ignoram páginas de listagem do One Page Love e `estrutura.json` com `erro` ou `versao < 3`.

Depois de coletar tudo, **recapture** as referências que for estudar (hero e rolagem em 5 pontos, desktop e celular), porque muitas capturas em lote pegam o intro.

## 6. Gerar o que a skill usa

```bash
cd site-nivel-awwwards
node scripts/gerar-padroes.mjs        # → references/padroes.md (medianas e % por característica)
node scripts/gerar-padroes-ux.mjs     # → references/padroes-ux.md (recursos mais comuns)
node scripts/pesquisar-referencias.mjs --tema "joalheria" --recursos "3d,scroll" --limite 12   # teste
```

Critério de pronto: `gerar-padroes.mjs` exige ao menos 20 sites com `estrutura.json` v3. O alvo é 500 ou mais, metade de cada fonte. O ranking de `pesquisar-referencias.mjs` deve devolver 12 sites com capturas abertas.

## 7. Destilado (o que pode ir para o GitHub)

Se quiser levar o conhecimento para outras máquinas sem levar o bruto, escreva na pasta `acervo-destilado` dentro de `references` uma ficha por site, com palavras suas: `slug`, `url`, `ano`, `nicho`, 1 frase da ideia, técnica de destaque (ex.: "título por linhas com máscara"), recursos (`gsap`, `three`…) e a nota de 0 a 10 de acabamento. Sem trechos de texto, sem imagem, sem código do site. Um índice por nicho e por técnica ajuda a busca.

## 8. Manter

- Reexecute §3–4 a cada 2 ou 3 meses; só entram sites novos (o `slug` já existente é pulado).
- Reexecute §6 depois de cada coleta. Os arquivos `padroes*.md` trazem a data e o tamanho da amostra.
- Sem o acervo (nuvem, outro computador) a skill continua funcionando: `pesquisar-referencias.mjs` avisa e a pesquisa vira ao vivo (`pesquisa.md`, camada 2), com resultado mais fraco.

## O que falta neste repositório

Os scripts `coletar.mjs`, `extrair-estrutura.mjs`, `recapturar.mjs`, `buscar.mjs` e `servidor.mjs` existem só no computador do autor (`~/Documents/acervos-design`). Copie-os (só código, nunca as capturas) para `site-nivel-awwwards/scripts/acervo/` para que este guia fique executável em outra máquina.
