# 10-cartier · réplica de Cartier WAW

| | |
|---|---|
| **Original** | https://cartier-waw-0225.dev.60fps.fr/ |
| **Tema sugerido** | exposição imersiva de uma joalheria fictícia brasileira |
| **Nossa marca** | TURMALINA: joalheria brasileira fictícia, com a exposição imersiva "Gemas & Maravilhas" |
| **Pasta** | `galeria/10-cartier/` (copie a estrutura de `galeria/06-olea/`: `package.json`, `servir.mjs`, `src/`, `public/`) |
| **Porta local** | 3010 (`node servir.mjs 3010`) |
| **Artefato** | https://claude.ai/artifact/GnyuKaA46Xf55bVJQFUwQT, com o slug `7fe49ddf-ea48-4211-a8bb-be6d2525afa0`. Republique **neste** artefato. |
| **Situação** | Construída (1º ciclo). Nove salas em three.js, com a mesma navegação por gesto da roda, os pontos à direita, o título que entra letra por letra e o painel "Descobrir". verificar-site com 0 FAIL. Falta a rodada final de comparação (as peças e as salas do original são mais detalhadas). Detalhes em `galeria/10-cartier/DIFERENCAS.md`. |

## Tarefa

**Ajuste o que existe, não refaça.** Siga o protocolo e confira com `replica/PROTOCOLO.md` seção 5. Para criar do zero, use `replica/PROTOCOLO.md`. Antes de escrever código:

1. Estude o original inteiro, no desktop e no celular, e salve o mapa em `replica/estudos/cartier-mapa.json`.
2. Escreva em `galeria/10-cartier/PLANO.md` a lista de seções, com altura, elementos, animações e interações de cada uma, e qual conteúdo nosso entra no lugar de cada elemento (texto, foto, 3D).
3. Construa seção por seção e compare cada uma com o original antes de passar para a próxima.
4. Siga o ciclo das seções 5.3 a 5.6 do protocolo até atingir as tolerâncias de aceite.

Se o original bloquear o navegador automatizado, tente `LENTO=1`, um user-agent de navegador comum e esperas maiores. Se continuar bloqueado, avise o usuário e pule para o próximo site.

## Imagens

Imagens não essenciais: foto livre ou render 3D próprio. Imagens essenciais: acrescente em `galeria/IMAGENS-PARA-GERAR.md`, numa seção nova para este site.
