# Prompts prontos para colar

Cada prompt abaixo serve para **uma sessão nova** no claude.ai/code com o repositório **skills-pt-br**. Faça uma sessão por site: assim cada uma tem o contexto inteiro só para aquele site, e a réplica sai mais fiel.

Toda a regra está em `replica/PROTOCOLO.md`, e os detalhes de cada site estão em `replica/sites/`. O prompt só aponta para esses arquivos e reforça o essencial.

**Dica:** no fim do prompt, escreva o que você achou diferente do original. Uma observação sua vale mais do que qualquer medição.

---

## Ajustar um site que já existe

Troque `<FICHA>` pela ficha do site:
- `01-taina`
- `02-polpa`
- `04-aura`
- `05-bruma`
- `06-olea`

```
Faça git fetch origin claude/awards-level-sites-requirements-o1dukq, mude para essa branch e trabalhe nela.

Leia por inteiro site-premium-ux-ui/replica/PROTOCOLO.md e depois site-premium-ux-ui/replica/sites/<FICHA>.md.

Tarefa: deixar esta réplica ESTRITAMENTE IGUAL ao original, mudando só o conteúdo (marca, textos, paleta, imagens e 3D).
NÃO refaça do zero: preserve o que já está igual e altere só o necessário.

Antes de editar:
1. Meça o original tela por tela (desktop 1440x900 e celular 390x844), com passos menores nos trechos animados.
2. Capture a nossa versão nas mesmas posições.
3. Escreva DIFERENCAS.md com cada diferença (estrutura, layout, tipografia, movimento, interação e acabamento).

Depois, corrija em ciclos (corrigir, capturar e comparar) até atingir as tolerâncias do protocolo:
- altura das seções com até 1% de diferença;
- posição com até 8 px;
- fonte com até 1 px;
- início e fim das animações com até 2% do trecho;
- o mesmo número de elementos.

O resultado tem que ser ultra-realista e passar no verificar-site.mjs com 0 FAIL.
Não copie código, textos, imagens nem fontes pagas do original.

No fim, republique no mesmo artefato, faça commit e push e me mostre o link e uma imagem com o original e o nosso lado a lado.
Fale sempre em português.

O que eu achei diferente: <escreva aqui>
```

---

## Criar um site novo

Troque `<FICHA>` pela ficha do site:
- `07-gq-lab`
- `08-mindmarket`
- `09-terminal`
- `10-cartier`
- `11-montfort`
- `12-animejs`
- `13-zentry`
- `14-kpr`
- `15-den-of-wolves`
- `16-zizo`
- `17-bruno-simon`

```
Faça git fetch origin claude/awards-level-sites-requirements-o1dukq, mude para essa branch e trabalhe nela.

Leia por inteiro site-premium-ux-ui/replica/PROTOCOLO.md e depois site-premium-ux-ui/replica/sites/<FICHA>.md.

Tarefa: criar uma réplica ESTRITAMENTE IGUAL ao site original da ficha, mudando só o conteúdo para uma marca fictícia brasileira (nome, textos em português, paleta, imagens e 3D próprios).
Tem que ser igual em estrutura, layout, tamanhos, tipografia, rolagem, animações e interações (cursor, menu, cookies, som e pré-carregamento), no desktop e no celular.

Antes de escrever código:
1. Estude o original inteiro.
2. Salve o mapa das seções.
3. Escreva PLANO.md seção por seção, com o conteúdo nosso que entra em cada elemento.

Construa e compare seção por seção, em ciclos (corrigir, capturar e comparar), até atingir as tolerâncias do protocolo.
O resultado tem que ser ultra-realista e passar no verificar-site.mjs com 0 FAIL.

Não copie código, textos, imagens nem fontes pagas do original.
Imagens não essenciais: foto livre ou render 3D próprio.
Imagens essenciais (pessoas, cenário-chave, vídeo do hero): acrescente em galeria/IMAGENS-PARA-GERAR.md com o prompt, que eu gero.

No fim, publique um artefato novo, anote o link na ficha, faça commit e push e me mostre o link e uma imagem com o original e o nosso lado a lado.
Fale sempre em português.
```

---

## Por que os prompts são escritos assim

- **Papel e objetivo mensuráveis.** "Estritamente igual" vira tolerâncias em números (1%, 8 px, 1 px, 2%). Assim a sessão sabe quando terminou e não para no "parecido".
- **Medir antes de editar.** A lista `DIFERENCAS.md` obriga a sessão a ver todas as diferenças antes de mexer, e evita corrigir só o que é fácil.
- **Ordem de gravidade.** Primeiro estrutura, depois layout, tipografia e movimento, e por último acabamento. Polir a cor de uma seção que está no lugar errado é trabalho perdido.
- **Ciclos curtos com captura.** Cada correção é conferida em imagem lado a lado, e não "de cabeça".
- **Ajustar, não refazer.** Para os sites que já existem, isso preserva o que já está bom e concentra o esforço no que está diferente.
- **Uma sessão por site.** O contexto da sessão fica todo para um original só.
- **Proibições explícitas.** Fidelidade de estrutura e movimento sem copiar nada protegido.
