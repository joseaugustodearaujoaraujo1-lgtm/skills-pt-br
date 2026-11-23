# taina: pacote do site

## Como rodar
```
npm install
npm run build        # gera public/app.js
npm run serve        # http://localhost:3003/
PLAYWRIGHT_CORE=/opt/node-tools/node_modules/playwright-core node ../../scripts/verificar-site.mjs http://localhost:3003/ --espera 4000   # precisa dar 0 FAIL
```

## Mapa de arquivos
- `src/`: JS de origem (esbuild empacota em `public/app.js`). Não edite `app.js`.
- `public/app.js`
- `public/creditos.json`
- `public/estilo.css`
- `public/fonts`
- `public/img`
- `public/index.html`
- `public/prancha.js`

## Seções (ordem da página)
- `conteudo (<main>)`
- `inicio (<section>)`
- `hall (<section>)`
- `loja (<section>)`
- `redes (<section>)`
- `rodape (<footer>)`

## Cores por papel
- `--cor-escura: #0f2b2b`
- `--cor-preta: #0b1414`
- `--cor-fundo: #f3f1ea`
- `--cor-fundo-2: #e3e2d6`
- `--cor-neutra: #6e7a76`
- `--cor-destaque: #ff5b3a`
- `--cor-destaque-2: #c8381a`
- `--cor-suave: #a9bcb7`
- `--cor-texto: #12211f`
- `--f-sans: 'Mona Sans', system-ui, sans-serif`
- `--f-serif: 'DM Serif Display', Georgia, serif`
- `--f-mao: 'Caveat', cursive`
- `--ease: cubic-bezier(.22, 1, .36, 1)`
- `--cor-neutra-2: #4c5a57`
- `--cor-destaque-claro: #ffb39e`
- `--cor-destaque-claro-2: #ffc9b8`
Trocar a paleta: `?tema=<nome>`. Temas prontos: quente, frio, mono (blocos `html[data-paleta="..."]` no fim do :root).

## Atributos data-* que controlam comportamento
- `data-escuro-em`
- `data-cartao-a`
- `data-cartao-b`
- `data-deslocamento`
- `data-claro-em`
- `data-giro`
- `data-abertura`
- `data-abertura-celular`

### O que cada atributo faz (o JS lê; mude no HTML, não no JS)
- `data-escuro-em` (`.hero`): fração do scroll do hero em que o topo fixo vira escuro.
- `data-cartao-a`, `data-cartao-b` (`.hero`): tamanho do cartão central na 1ª e na 2ª fase do encolhimento (`largura altura`).
- `data-deslocamento` (`.horizontal`): quantas larguras de janela o trilho horizontal percorre.
- `data-claro-em` (`.horizontal`): fração do scroll em que o topo fixo passa a claro.
- `data-giro`, `data-abertura`, `data-abertura-celular` (`.leque`): graus entre cartas do leque das redes e a abertura lateral (fração da largura) no desktop e no celular.

## Regras de rolagem
- Altura total medida: 13.399 px no desktop (1440x900, 1 vh = 9 px) e 12.095 px no celular (390x844).
- Por seção no desktop: hero 1800 (200vh), manifesto 1026, horizontal 3141 (349vh), dentro/fora (`.otot`) 1800 (200vh), grupo preto (hall da fama + loja) 2084, loja 909, parcerias 792, redes 963, rodapé 955.
- Trechos fixos (`position: sticky; top: 0`) com timeline GSAP presa à rolagem (`scrub: true`): `.hero-palco` (200vh: retrato branco com prancha 3D, a foto encolhe num cartão central, fundo escurece, letreiros correm e a assinatura se desenha), `.horiz-palco` (349vh: trilho horizontal anda 1,9 largura de janela e o fundo clareia do escuro ao claro) e `.otot-palco` (200vh: objeto entra pela esquerda, perfil pela direita, foto final sobe e cobre a tela com `clip-path`).
- O progresso de cada trecho é a altura da seção menos a janela: mudar `height` muda a velocidade.
- Lenis controla a rolagem suave; não use scroll nativo em animações.

## Regras do celular (390x844)
- Abaixo de 861 px (`largo` falso): o hero continua fixo (200vh), mas `.horizontal` e `.otot` viram blocos normais (`height: auto`, `position: relative`) sem timeline; o hall vira 2 colunas sem paralaxe.
- Lenis só liga com ponteiro fino. Sem scroll horizontal (medido: 0). Links do menu com 44 px de altura mínima.
- Com `prefers-reduced-motion` nenhuma animação roda e o manifesto aparece inteiro.

## Armadilhas conhecidas
- `public/app.js` é gerado: `npm run build` depois de mexer em `src/`.
- Cores por papel (`--cor-*`). Os fundos animados do trecho horizontal leem o tema com `cor('--cor-...')` no JS; o cinza-azulado `#cfd3cc` do cartão do hero e a cor da fumaça (`[24, 96, 92]` em `main.js`) são fixos e não acompanham `?tema=`.
- `.manifesto-texto` é quebrado em palavras por JS preservando `<em>`: não aninhe outras tags.
- A cena 3D da prancha (`src/prancha.js`) e a fumaça (`src/fumaca.js`) usam canvas/WebGL; no verificador sem GPU o quadro pode demorar. Os renders das pranchas do hall são gerados por `gerar-renders.mjs` (servidor ligado na porta 3003).
- `data-cartao-a` e `data-cartao-b` são `"largura altura"` com unidade (ex. `66vw 67vh`).

## Imagens
- Essenciais (o usuário gera): ver `../IMAGENS-PARA-GERAR.md`.
- Não essenciais: placeholder de mesma proporção.
- Sem lista própria em `../IMAGENS-PARA-GERAR.md`: as pranchas são renders 3D nossos (`gerar-renders.mjs`) e as fotos de surf em `public/img/` (retrato, tubo, aérea, por do sol...) são provisórias. Se for lançar com a marca real, gere retrato, surf e aéreas ultra-realistas com o mesmo nome e proporção (pares `*.webp` e `*-pb.webp` em preto e branco).

## Capturas-alvo
Em `conceito/`: `d-NN.jpg` (desktop 1440x900) e `m-NN.jpg` (celular 390x844), uma por tela na ordem da rolagem. 
Refazer: `ESPERA=4500 node ../../replica/ferramentas/telas2.cjs http://localhost:PORTA/ d conceito N 1440` e o mesmo com `m` e `390`.
