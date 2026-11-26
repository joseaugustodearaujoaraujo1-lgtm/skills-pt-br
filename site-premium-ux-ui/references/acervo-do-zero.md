# Montar o acervo do zero (guia)

O acervo é uma **base local de sites premiados** (Awwwards e One Page Love), com capturas e medidas. Ele alimenta a pesquisa de referências (`pesquisar-referencias.mjs`, `opcoes.mjs`, `montar-brief.mjs`) e a geração de `padroes.md` e `padroes-ux.md`. No computador do autor ele tem ~1.800 sites coletados, 910 utilizáveis. Este guia refaz o mesmo acervo em qualquer máquina.

## Regra de ouro: o bruto nunca sobe ao GitHub

| Fica só no computador | Pode subir |
|---|---|
| Capturas (`*.jpg`), HTML, `dados.json`, `estrutura.json`, `acervo.json` | Os scripts de coleta (`scripts/acervo/`, só código) |
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

Os scripts ficam em `scripts/acervo/` e usam Playwright, Chromium em 1440×900 (desktop) e 390×844 (celular).

## 3. Fazer a lista de sites

A coleta lê um arquivo de lista: `sites.json` (`[{ "titulo", "url", "ano", "nicho", "generos", "estilos" }]`) ou um `.txt` com uma URL por linha.

- **Awwwards** (rode no SEU computador; a nuvem costuma ser recusada):
  ```bash
  node scripts/acervo/listar-awwwards.mjs --categoria fashion --paginas 3 --saida sites-fashion.json
  node scripts/acervo/listar-awwwards.mjs --sotd --paginas 5 --saida sites-sotd.json
  ```
  Lê só as páginas públicas de listagem e a página de cada site (para achar o link "Visit site"). Depende do HTML do Awwwards: se mudar e nada for achado, o script avisa, e você monta o `sites.json` à mão. Categorias úteis: `fashion`, `architecture`, `technology`, `e-commerce`, `photography`, `art`, `food-beverage`.
- **CSS Design Awards** (premiação do mesmo nível; funciona também na nuvem, onde o Awwwards é recusado):
  ```bash
  node scripts/acervo/listar-cssda.mjs --paginas 12 --saida sites-cssda.json
  ```
  Na nuvem do Claude Code, rode com `NODE_USE_ENV_PROXY=1` (o `fetch` do Node não usa o proxy sozinho).
- **One Page Love:** o próprio site pede para agentes usarem a **API oficial** (`https://onepagelove.com/api`, plano grátis com chave) em vez de raspar o HTML. Gere o `sites.json` com ela (campos: título, URL, ano, gênero, estilo) e rode com `--fonte onepagelove`.
- **Seus favoritos:** qualquer lista de URLs vale.

Boas maneiras (já embutidas nos scripts, não remova): pausa de 2,5 s, no máximo 3 abas, só leitura, sem login nem formulário.

## 4. Capturar e medir

```bash
node scripts/acervo/coletar.mjs --lista sites-fashion.json --fonte awwwards --limite 100 --abas 2
```

Para cada site: espera o preloader acabar (a página para de mudar, até 10 s), salva `desktop.jpg`, `desktop-scroll.jpg` e `mobile.jpg`, e grava `dados.json` e `estrutura.json` (versão 3). **Retoma sozinho**: sites com `estrutura.json` são pulados; falhas ficam com `"erro"` e são ignoradas pelos outros scripts. Faça em lotes de 50 a 100.

O `estrutura.json` mede (DOM e CSS computado, 1440×900):

| Bloco | Campos |
|---|---|
| `pagina` | `alturaVh`, `secoes`, `palavras`, `paddingVerticalMedianoPx`, `rolagemVirtual` |
| `menu` | `links`, `altura`, `fixo`, `hamburguer`, `textoEmCaixaAlta`, `transparente` |
| `preloader` | `existe`, `comPorcentagem` |
| `hero` | `video`, `canvas`, `imagemGrande`, `botoes` |
| `titulo` | `px`, `emVw`, `peso`, `entrelinha`, `trackingEm`, `caixaAlta`, `serifa`, `alinhamento`, `palavras` |
| `corpo` | `px`, `entrelinha`, `h2`, `h3` |
| `rolagem` | `lenis`, `locomotive`, `pinSpacer`, `sticky`, `carrossel`, `scrollSnap` |
| `efeitos` | `clipPath`, `mixBlend`, `backdropFilter`, `filtro`, `gradiente`, `textoGradiente`, `sombra` |
| `forma` | `botaoPilula`, `grid`, `raioCartaoMedianoPx` |
| `midia` | `img`, `imgLazy`, `imgSrcset`, `svg`, `video`, `videoAuto`, `canvas`, `iframe` |
| `motion` | `duracoesMs`, `curvas`, `animacoesAtivas`, `marquee`, `prefersReducedMotion` |
| `rodape`, raiz | `rodape.existe`, `rodape.maiorTextoPx`, `cursorCustom`, `larguraMaxMedianaPx` |

Detecção por heurística (ex.: serifa por nome de fonte, preloader por elemento fixo de tela cheia): confirme visualmente em caso de dúvida. Para medir um site avulso: `node scripts/acervo/extrair-estrutura.mjs <url>`.

Outros scripts: `recapturar.mjs` (hero e rolagem em N pontos, desktop ou celular, para estudar uma referência), `buscar.mjs` (filtra por texto, nicho, estilo, lib e ano).

Depois da coleta: `node scripts/acervo/classificar.mjs` dá um tema a cada site que veio sem categoria (lendo título, descrição e o início da página).

## 5. Limpar

Não apague nada: o filtro é por código. `scripts/qualidade.mjs` descarta (`capturaInvalida`) status ≥ 400 e títulos de bloqueio ("just a moment", "403", "domain for sale"…). Os scripts também ignoram páginas de listagem do One Page Love e `estrutura.json` com `erro` ou `versao < 3`.

Depois de coletar tudo, **recapture** as referências que for estudar (hero e rolagem em 5 pontos, desktop e celular), porque muitas capturas em lote pegam o intro.

## 6. Gerar o que a skill usa

```bash
cd site-premium-ux-ui
node scripts/gerar-padroes.mjs        # → references/padroes.md (medianas e % por característica)
node scripts/gerar-padroes-ux.mjs     # → references/padroes-ux.md (recursos mais comuns)
node scripts/pesquisar-referencias.mjs --tema "joalheria" --recursos "3d,scroll" --limite 12   # teste
```

Critério de pronto: `gerar-padroes.mjs` exige ao menos 20 sites com `estrutura.json` v3. O alvo é 500 ou mais, metade de cada fonte. O ranking de `pesquisar-referencias.mjs` deve devolver 12 sites com capturas abertas.

## 7. Destilado (o que pode ir para o GitHub)

```bash
node scripts/acervo/destilar.mjs   # → references/acervo-destilado/indice.json e README.md
```
O índice guarda só fatos medidos e o endereço público de cada site, sem captura, texto ou código. Quando não há acervo local (nuvem, outro computador), `pesquisar-referencias.mjs` usa esse índice automaticamente: o agente recebe sites reais para abrir, em vez de depender só da pesquisa ao vivo.

Opcional, à mão: escreva na pasta `acervo-destilado` dentro de `references` uma ficha por site, com palavras suas: `slug`, `url`, `ano`, `nicho`, 1 frase da ideia, técnica de destaque (ex.: "título por linhas com máscara"), recursos (`gsap`, `three`…) e a nota de 0 a 10 de acabamento. Sem trechos de texto, sem imagem, sem código do site. Ajuda o agente a escolher sem abrir cada site.

## 8. Manter

- Reexecute §3–4 a cada 2 ou 3 meses; só entram sites novos (o `slug` já existente é pulado).
- Reexecute §6 depois de cada coleta. Os arquivos `padroes*.md` trazem a data e o tamanho da amostra.
- Sem o acervo (nuvem, outro computador) a skill continua funcionando: `pesquisar-referencias.mjs` avisa e a pesquisa vira ao vivo (`pesquisa.md`, camada 2), com resultado mais fraco.

## Teste feito

Os scripts foram rodados de ponta a ponta sobre sites locais (captura, medição, `buscar.mjs`, `recapturar.mjs` e `pesquisar-referencias.mjs` lendo o resultado). A coleta ao vivo no Awwwards não pôde ser testada na nuvem (conexão recusada): rode `listar-awwwards.mjs` no seu computador e, se o HTML tiver mudado, ajuste o seletor ou monte o `sites.json` à mão.
