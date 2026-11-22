# 06-olea · OLEA (réplica de Oryzo)

| | |
|---|---|
| **Original** | https://oryzo.ai/ |
| **Nossa marca** | OLEA: sabonete artesanal de azeite "feito com IA*" (Inteligência Artesanal) |
| **Pasta** | `galeria/06-olea/` |
| **Porta local** | 3006 (`node servir.mjs 3006`) |
| **Artefato** | https://claude.ai/artifact/4GAh5nPcwj4uK9EidyyUAY, com o slug `1a698b7c-7cee-478c-b41e-33cddf09d075`. Republique **neste** artefato. |
| **Situação** | Ajustada em 22/11/2026: as alturas batem no desktop (56 691 px) e no celular (51 314 × 51 317 px), cada palco começa e termina onde o original começa e termina, e verificar-site deu 0 FAIL. Veja `galeria/06-olea/DIFERENCAS.md`. Ainda faltam as fotos essenciais (OLEA 1 a 16 e 18). |

## Tarefa

**Ajuste, não refaça.** Siga `replica/PROTOCOLO.md`, seção 4: preserve o que já está igual e altere só o necessário. O ponto de partida é a seção 5 do protocolo: medir o original, capturar a nossa versão e escrever `DIFERENCAS.md` com todas as diferenças antes de editar.

## O que já existe e o que conferir

Sabonete 3D próprio (`src/sabonete.js`), giro já renderizado (`public/img/giro/00-47.webp`), bancada 3D (`src/cena-mesa.js`) e extras (`src/cenas-extra.js`). As alturas totais batem (56 691 px; medidas em `replica/estudos/oryzo-mapa.json`), mas **o usuário achou que não está parecido**. Diagnóstico conhecido: as últimas telas estão 1 ou 2 telas adiantadas. Comece pela intro desfocada com as alças vetoriais, pelo giro do objeto, pelo trecho "Feito com IA*", pelo painel de vidro com a bancada e pela galeria horizontal.

## Imagens

As essenciais estão listadas em `galeria/IMAGENS-PARA-GERAR.md`. Se aparecerem novas imagens essenciais, acrescente-as lá.
