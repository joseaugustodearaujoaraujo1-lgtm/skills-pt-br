# polpa: pacote do site

## Como rodar
```
npm install
npm run build        # gera public/app.js
npm run serve        # http://localhost:3002/
PLAYWRIGHT_CORE=/opt/node-tools/node_modules/playwright-core node ../../scripts/verificar-site.mjs http://localhost:3002/ --espera 4000   # precisa dar 0 FAIL
```

## Mapa de arquivos
- `src/`: JS de origem (esbuild empacota em `public/app.js`). Não edite `app.js`.
- `public/app.js`
- `public/estilo.css`
- `public/fonts`
- `public/img`
- `public/index.html`
- `public/picole.js`

## Seções (ordem da página)
- `conteudo (<main>)`
- `inicio (<section>)`
- `sabores (<section>)`
- `momentos (<section>)`

## Cores por papel
- `--cor-destaque: #ff6fae`
- `--cor-destaque-claro: #ffa3cc`
- `--cor-texto: #4a0b2c`
- `--cor-escura: #5c0f36`
- `--cor-acento: #ffb21a`
- `--cor-claro: #fff3d6`
- `--cor-papel: #cfa66c`
- `--cor-papel-tinta: #5b2f0b`
- `--f-titulo: 'Anton', Impact, sans-serif`
- `--f-corpo: 'Inter Tight', system-ui, sans-serif`
- `--f-mao: 'Nothing You Could Do', cursive`
- `--ease: cubic-bezier(.22, 1, .36, 1)`
- `--cor-gelo: #9ad8ff`
- `--cor-limao: #b8ef7a`
- `--cor-papel-2: #c39457`
- `--cor-acai: #d6a2ff`
- `--cor-papel-3: #d9b47a`
- `--cor-destaque-2: #ff8fc4`
- `--cor-acento-2: #ffd36b`
- `--cor-acento-3: #ffe066`
Trocar a paleta: `?tema=<nome>`. Temas prontos: quente, frio, mono (blocos `html[data-paleta="..."]` no fim do :root).

## Atributos data-* que controlam comportamento
- `data-sabores`
- `data-v`
- `data-deslocamento`

### O que cada atributo faz (o JS lê; mude no HTML, não no JS)
- `data-v` (peças `.p` da colagem): velocidade de paralaxe (fração da altura) e giro de cada peça.
- `data-sabores` (`.hero-picole`): lista, separada por vírgula, dos sabores que o picolé 3D alterna ao clicar (precisa existir no `picole.js`).
- `data-deslocamento` (`.faixa`): quanto o letreiro da faixa curva corre ao longo do caminho (`startOffset`, ex. `-60%`).

## Regras de rolagem
- Altura total medida: 14.570 px no desktop (1440x900, 1 vh = 9 px) e 7.342 px no celular (390x844).
- Por seção no desktop: hero 900 (100vh), colagem 1890, frutada 1008, momentos 9047 (inclui o trecho fixado do trilho horizontal), bora 825, rodapé 900.
- Sem `position: sticky`: o trecho fixo é um `pin` do ScrollTrigger em `.trilho-janela` (só em largura >= 861 px). O trilho `.trilho` anda `scrollWidth - innerWidth` px e a rolagem fixada tem o mesmo comprimento (`end: '+=' + dist()`, `scrub: 1`), com `invalidateOnRefresh`. As palavras gigantes `.voa` giram e sobem/descem usando `containerAnimation` do trilho.
- Hero: as letras de `.hero-grande` se espalham entre 0 e 45% da altura do hero (`scrub`), com valores aleatórios a cada carga (por isso duas capturas do hero nunca são idênticas).
- Lenis controla a rolagem suave; não use scroll nativo em animações.

## Regras do celular (390x844)
- Abaixo de 861 px o trilho horizontal fixado não existe (`ScrollTrigger.matchMedia`): as palavras viram lista normal (seção de 2397 px).
- As demais animações (colagem em paralaxe, texto que acende, frutada, bora, pilha do rodapé) continuam, sem Lenis (só com ponteiro fino).
- Sem scroll horizontal (medido: 0). Aviso do verificador: 1 texto abaixo de 12 px no celular.

## Armadilhas conhecidas
- `public/app.js` é gerado: `npm run build` depois de mexer em `src/`.
- `src/picole.js` (picolé 3D com three.js) é carregado por `import()` direto, fora do bundle (`/* sem bundle */`): ele precisa estar copiado em `public/` com o nome `picole.js`; sem GPU (ou `saveData`) fica o render `img/picole-*-N.webp`. As cores do 3D estão no próprio `picole.js` e não seguem `?tema=`.
- Cores por papel (`--cor-*`); as cores de sabor (gelo, limão, açaí...) também são papéis e mudam com o tema.
- `.kraft-texto` e `.hero-grande .sobe` são quebrados em palavras e letras por JS: mantenha como texto puro.
- O som é um "ploc" gerado com `AudioContext` e só liga depois do botão de som.
- `data-v` nas peças da colagem (`.p`) é a velocidade de paralaxe e o giro: positivo sobe, negativo desce.

## Imagens
- Essenciais (o usuário gera): ver `../IMAGENS-PARA-GERAR.md`.
- Não essenciais: placeholder de mesma proporção.
- Sem lista própria em `../IMAGENS-PARA-GERAR.md`: os picolés (`img/picole-<sabor>-N.webp`) são renders 3D nossos (`gerar-renders.mjs`, servidor ligado) e o resto é CSS. Não há foto essencial pendente.

## Capturas-alvo
Em `conceito/`: `d-NN.jpg` (desktop 1440x900) e `m-NN.jpg` (celular 390x844), uma por tela na ordem da rolagem. 
Refazer: `ESPERA=4500 node ../../replica/ferramentas/telas2.cjs http://localhost:PORTA/ d conceito N 1440` e o mesmo com `m` e `390`.
