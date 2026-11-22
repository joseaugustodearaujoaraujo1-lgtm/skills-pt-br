# Tarefa: refazer a réplica 06 (OLEA) estritamente igual ao oryzo.ai

## O que é

- **Original:** https://oryzo.ai/ (Awwwards), porta-copos de cortiça "feito com IA".
- **Nossa versão:** OLEA, sabonete artesanal de azeite. Código em `site-nivel-awwwards/galeria/06-olea/`.
- **Publicada em:** https://claude.ai/artifact/4GAh5nPcwj4uK9EidyyUAY (slug `1a698b7c-7cee-478c-b41e-33cddf09d075`). Republicar no mesmo artefato.

A versão atual **não está parecida o bastante** com o original. O objetivo desta sessão é uma réplica perfeita.

## Regra principal

O site tem que ser **estritamente igual** ao original em:
- estrutura e layout;
- tamanhos, posições e tipografia (tamanho, peso, espaçamento);
- comportamento de rolagem: seções fixas, alturas de cada trecho, momento em que cada coisa entra e sai;
- animações e interações: cursor, hover, giro do objeto, transições, vidro, brilho;
- elementos de interface: cabeçalho, botões, aviso de cookies, som, menu.

**Só muda o conteúdo:** marca fictícia, textos em português, paleta, imagens e objetos 3D próprios.
O resultado tem que ser **extremamente ultra-realista**.

## Proibido

- Copiar código, textos, imagens, logotipos ou fontes pagas do original.
- Recriar visualmente a marca deles: a marca é OLEA, e o objeto é o sabonete 3D nosso.

## Como trabalhar

1. Estudar o original de novo, tela por tela, com `site-nivel-awwwards/replica/ferramentas/estudar3.cjs`:
   - usar `LENTO=1` e passos de 900 px;
   - capturar também passos menores nos trechos animados.
2. Capturar a nossa versão com `telas2.cjs` no mesmo passo.
3. Montar folhas lado a lado com `lado-or.py` e corrigir **cada diferença**, tela por tela, até não haver diferença visível de estrutura nem de movimento.
4. Conferir que as alturas das seções batem com `replica/estudo-oryzo/mapa.json`.
5. Rodar o portão `scripts/verificar-site.mjs` até dar 0 FAIL.
6. Gerar o bundle com esbuild, republicar no mesmo artefato, fazer commit e push na branch `claude/awards-level-sites-requirements-o1dukq`.
7. Mostrar ao usuário o link e uma imagem com o original e o nosso lado a lado.

## O que já existe e pode ser reaproveitado

- **`src/sabonete.js`:** sabonete 3D próprio (three.js), com carimbo OLEA e variantes de cor. A sequência de giro já está renderizada em `public/img/giro/00-47.webp`.
- **`src/cena-mesa.js`:** bancada 3D com base de corte, lápis, estilete e prateleira.
- **`src/cenas-extra.js`:** pilhas, sabonetes coloridos e azeitonas.
- **`gerar-renders.mjs`, `gerar-mesa.mjs`, `gerar-extras.mjs`:** renderizam tudo em WebP com transparência. O site não carrega three.js.
- **`cena/preparar.py`:** imagens provisórias e créditos.
- **Servidor local:** `node servir.mjs 3006`.

As imagens com pessoas são provisórias. O usuário vai gerar as definitivas conforme `galeria/IMAGENS-PARA-GERAR.md` (seção 06).

## Comunicação

- Falar sempre em português.
- O usuário quer abrir o site no navegador: sempre entregar o link do artefato.
