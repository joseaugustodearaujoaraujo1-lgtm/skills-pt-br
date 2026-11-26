# Referências do objeto 3D: cafeteira de pressão (tipo moka)

Sem usuário para enviar fotos, as referências foram buscadas em fontes abertas (`aprovacoes.md`, "Sem usuário"), com `scripts/buscar-fotos-livres.mjs` no Wikimedia Commons. **Uso: só estudo de forma, material e luz.** Nenhuma delas aparece no site.

| Arquivo | Fonte | Autor | Licença | O que se usou |
|---|---|---|---|---|
| `t0-00.jpg` | https://commons.wikimedia.org/wiki/File:Moka_KILT._01.jpg | Coyau | CC BY-SA 3.0 | silhueta de ampulheta, coletor que abre para cima, alça preta em "7", válvula na caldeira |
| `t0-01.jpg` | https://commons.wikimedia.org/wiki/File:Moka_KILT._13.jpg | Coyau | CC BY-SA 3.0 | as peças separadas: coletor, funil com tubo, caldeira com rosca |
| `t0-02.jpg` | https://commons.wikimedia.org/wiki/File:Moka_coffee_pot.jpg | Michele Bucelli | CC BY-SA 4.0 | luz de cozinha real (pouco útil) |
| `t0-03.jpg` | https://commons.wikimedia.org/wiki/File:Moka_Pot.jpeg | Xenon 77 (presumido) | CC BY-SA 4.0 | corpo facetado, pegador da tampa |

**O que NÃO copiar:** o desenho octogonal registrado de marcas italianas, logos e nomes (a foto `t0-03` tem uma marca no corpo). A Fervo tem 12 faces, ampulheta própria e nenhuma marca no corpo.

## Molde (aprovado; sem gerador de imagem autorizado)
O molde é o próprio modelo em código (`src/cena.js`) renderizado em 4 vistas: `molde/frente.png`, `molde/perfil.png`, `molde/tresquartos.png`, `molde/topo.png`, e a folha `molde-4-vistas.png`. Regera com `npm run render`.
O molde ultrarrealista por IA (folha de 4 vistas e vídeo giratório) está em `../../IMAGENS.md`, com prompt.

## Comparação com as referências reais (`comparacao-lado-a-lado.jpg`)
O portão de igualdade numérico (IoU) não prova nada aqui: molde e site saem do mesmo código (daria 1,0). A prova é a comparação com as fotos:
- **Proporção:** referência KILT (t0-00) ≈ 1,55 de altura para 1 de largura do corpo; Fervo 17,5 / 10,0 ≈ 1,75 (mais alta de propósito, para caber a vista explodida na coluna; registrado como decisão de projeto). Cintura na junção caldeira/coletor nos dois.
- **Peças:** referência t0-01 mostra 3 peças + tampa; a Fervo tem 5 (caldeira, funil, filtro + junta, coletor, tampa), que é o que uma moka real tem quando se tira a junta.
- **Material e luz:** inox escovado (anéis de rugosidade) com reflexo de estúdio (RoomEnvironment + PMREM), baquelite com verniz; sombra de contato no chão. Diferença visível: as fotos têm mais contraste nos reflexos e marcas de uso; o render é mais limpo.
- **Limite honesto:** facetas sem chanfro nas arestas e rosca simplificada; o realismo é de "render de catálogo", não de foto.
