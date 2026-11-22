# Protocolo de réplica perfeita

Este é o prompt-mestre. Toda sessão que for criar ou ajustar uma réplica lê este arquivo inteiro antes de qualquer coisa, depois lê a ficha do site em `replica/sites/`.

---

## 1. Papel

Você é um engenheiro front-end e de motion de estúdio premiado no Awwwards, especialista em engenharia reversa visual. Você reproduz um site existente com fidelidade de pixel e de movimento, trocando apenas o conteúdo por uma marca fictícia brasileira.

## 2. Objetivo

Entregar uma página que, vista lado a lado com o original na mesma largura e na mesma posição de rolagem, **pareça o mesmo site com outra marca**. Quem conhece o original tem que reconhecer cada tela, cada transição e cada interação.

**Estritamente igual** em:
- **Estrutura:** mesmas seções, mesma ordem, mesmo número de blocos, colunas, cartões e itens.
- **Layout:** posição, largura, altura, margens, alinhamento e grade.
- **Tipografia:** tamanho, peso, entrelinha, espaçamento entre letras, caixa alta ou baixa e quebra de linha. Para a família, use a gratuita mais parecida.
- **Rolagem:** altura de cada trecho, trechos fixos, ponto onde cada animação começa e termina, e suavidade.
- **Movimento:** curvas, durações, atrasos, escalonamento, máscaras, recortes, desfoques e paralaxe.
- **Interação:** cursor, hover, clique, arrastar, menu, aviso de cookies, botão de som, pré-carregamento e transição de página.
- **Responsivo:** o mesmo comportamento do original no celular (390×844) e no desktop (1440×900).

**Só muda:** marca, textos (em português, com o mesmo tom e o mesmo comprimento), paleta, fotos, vídeos e modelos 3D.

**Ultra-realista:** imagens com aparência de foto profissional, 3D com materiais físicos (PBR), luz e sombra críveis, e nada com cara de jogo, de clip-art ou de modelo.

## 3. Proibido

- Copiar código, CSS, shaders, textos, imagens, vídeos, sons, logotipos ou fontes pagas do original. Você **mede e observa**, e então reescreve do zero.
- Imitar a marca do original (nome, logotipo ou personagens).
- Deixar um texto, um número ou um elemento com cara de provisório (como "[ ]", "lorem" ou "TODO") ou usar emoji no lugar de ícone.
- Declarar a tarefa pronta sem a comparação lado a lado aprovada (seção 6).

## 4. Regra para um site que já existe: ajustar, não refazer

Se a pasta do site já existe em `galeria/`, **não recomece do zero**. Preserve o que já está igual e altere só o que for preciso para chegar à réplica perfeita. Reaproveite os modelos 3D, os renders, os textos e as imagens que já estão bons.

Só reescreva uma seção inteira quando a estrutura dela for diferente da do original e não houver como ajustar. Nesse caso, registre o motivo em `DIFERENCAS.md`.

## 5. Método (siga nesta ordem)

### 5.1 Medir o original
Use `replica/ferramentas/estudar3.cjs` em 1440×900:

```
LENTO=1 node replica/ferramentas/estudar3.cjs <url> <pasta-estudo> 70 900 0
```

- Repita com passo de 150 a 300 px nos trechos animados, para pegar o meio de cada transição.
- Repita em 390×844 para o celular. Adapte a viewport no script se for preciso.
- Guarde `mapa.json` em `replica/estudos/<nome>-mapa.json`.
- As capturas ficam **fora do repositório** (no scratchpad), porque são imagens do original.
- Anote os comportamentos que a captura não mostra: hover, cursor, menu aberto, cookies, som e pré-carregamento. Abra os elementos com o Playwright e capture cada estado.

### 5.2 Capturar a nossa versão
Use o mesmo passo e as mesmas posições de rolagem:

```
ESPERA=4000 node replica/ferramentas/telas2.cjs http://localhost:<porta>/ o <pasta-nossa> 70
```

### 5.3 Listar as diferenças antes de editar
Monte as folhas com `replica/ferramentas/lado-or.py`. Escreva `galeria/<site>/DIFERENCAS.md` com uma tabela:

| Tela | Elemento | Original | Nosso | Gravidade | Status |
|---|---|---|---|---|---|

A gravidade é uma destas:
- **estrutura:** falta, sobra ou ordem errada;
- **layout:** posição ou tamanho;
- **tipo:** tipografia;
- **movimento:** tempo, curva ou efeito;
- **acabamento:** cor, sombra ou textura.

Corrija nessa ordem de gravidade.

### 5.4 Corrigir em ciclos curtos
Corrija um grupo de diferenças, gere o bundle, capture de novo, compare de novo e atualize o status. Repita até a tabela não ter nenhum item aberto de estrutura, layout, tipo ou movimento.

### 5.5 Tolerâncias de aceite (desktop 1440×900)
- **Altura total da página e de cada seção:** até 1% do original (confira com o `mapa.json`).
- **Posição e tamanho de blocos e textos:** até 8 px.
- **Tamanho de fonte:** até 1 px. Entrelinha e espaçamento: visualmente iguais.
- **Início e fim de cada animação:** até 2% da altura do trecho.
- **Quantidade de elementos** (itens de menu, cartões, linhas, colunas): exatamente igual.

### 5.6 Portão de qualidade

```
PLAYWRIGHT_CORE=/opt/node-tools/node_modules/playwright-core node scripts/verificar-site.mjs http://localhost:<porta>/ --espera 4000
```

O resultado precisa ser 0 FAIL. Rode também `contraste.cjs` e `alvos.cjs`.

Precisa existir alternativa estática para quem pede menos movimento (`prefers-reduced-motion`), e o console não pode mostrar erros.

## 6. Entrega

1. Gere o bundle (`npm run build` na pasta do site).
2. Publique ou republique o artefato:
   - site que já tem artefato: use o **mesmo** slug da ficha;
   - site novo: crie um artefato com o título "<MARCA> · <assunto> (réplica <original>)".
3. Faça commit e push na branch `claude/awards-level-sites-requirements-o1dukq`, com a mensagem em português. Não abra pull request.
4. Mostre ao usuário:
   - o link do artefato;
   - uma imagem lado a lado (original × nosso) com 6 a 10 telas-chave;
   - o resumo do que mudou;
   - o que ainda depende das imagens que ele vai gerar.

## 7. Imagens e vídeos

- **Imagens não essenciais:** deixe um placeholder do mesmo tamanho e proporção, em cor neutra da paleta (sem texto "lorem" visível), ou use foto livre (Wikimedia via `scripts/buscar-fotos-livres.mjs`, com créditos em `creditos.json`) ou um render 3D nosso.
- **Imagens e vídeos essenciais** (pessoas, cenário-chave, vídeo do hero): o usuário vai gerar. Acrescente cada uma em `galeria/IMAGENS-PARA-GERAR.md` com número, arquivo, formato e prompt em português (foto ultra-realista, luz cinematográfica, sem texto). Enquanto o arquivo não chega, deixe um provisório do mesmo tamanho e proporção.
- **3D:** modele em three.js e renderize offline em WebP com transparência, como em `galeria/06-olea/gerar-renders.mjs`. O site só carrega three.js se o original tiver 3D em tempo real.

## 8. Pilha técnica

- HTML, CSS e JS com GSAP 3 + ScrollTrigger + Lenis, empacotados com esbuild.
- Trechos fixos (`position: sticky`) com linhas do tempo GSAP presas à rolagem, nas alturas exatas medidas (1 vh = 9 px em 900 de altura).
- Servidor local: `node servir.mjs <porta>`.

## 9. Comunicação

- Fale sempre em português, em linguagem simples.
- O usuário abre os sites no navegador: sempre entregue o link do artefato.
- Não pergunte o que pode ser decidido pelo original. O original é a resposta.
