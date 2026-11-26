# Portões de aprovação do 3D e da prévia do site

Antes de construir uma experiência com elemento 3D, o usuário aprova **quatro** coisas, nesta ordem. Cada parada termina com uma pergunta (`AskUserQuestion`: **Aprovar** · **Alterar**, o usuário descreve o quê) e só avança com aprovação explícita dada nesta conversa. Detalhe de cada etapa em [pipeline-3d.md](pipeline-3d.md).

## 0. Referências do elemento
Peça imagens de referência de como o elemento é (vários ângulos e closes de material), ou descrição e esboço se ele for inventado. Sem referência, não gere o molde.

## 1. Imagens molde → "o que precisa alterar?"
Vistas `frente`, `lado`, `tres-quartos`, `costas`, `topo` e detalhes, mesmo objeto e mesma luz. Mostre e peça ao usuário para verificar. Ajuste até aprovar.

## 2. Molde 3D no Blender → "o que precisa alterar?"
Exatamente igual às imagens molde aprovadas, renderizado nas mesmas vistas, com a comparação lado a lado. Ajuste até aprovar.

## 3. Elemento em Three.js (< 200 KB) → "o que precisa alterar?"
Só código Three.js, igual ao molde do Blender, com a comparação das três etapas, a página interativa e `verificar-3d.mjs` com 0 FAIL. Ajuste até aprovar.

## 4. Vídeo-prévia de como o SITE vai ficar → "o que precisa alterar?"
- Depois das três aprovações e **antes** de construir o site: hero, o elemento em cena, o scroll de assinatura e 2–3 seções, com a paleta, a tipografia e o estilo escolhidos.
- Como gerar: protótipo do hero com o elemento Three.js aprovado, gravado (screencast por CDP/Playwright, MP4 H.264 com ffmpeg, `playsinline` para ver no celular).
- Só depois da aprovação construa o site completo e rode os portões de qualidade.

## Regras
- **Nunca aprove no lugar do usuário**, nem em teste ou automação. Sem usuário para responder: pare e espere.
- Registre cada aprovação com `scripts/estado-3d.mjs` (com as palavras do usuário). Alterar uma etapa anula as aprovações seguintes.
- Custo, conta nova ou serviço pago (gerador de imagem, instalação do Blender) pedem autorização própria.
- Marca de terceiros: só forma, material e luz; o elemento sai sem a marca, a menos que o usuário seja o dono ou tenha licença. Diga isso ao usuário.
