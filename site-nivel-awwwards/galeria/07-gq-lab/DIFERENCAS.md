# ACORDE Lab × The Extraordinary Lab: diferenças medidas e status

O original foi medido com Playwright em 1440×900. A página dele não rola (a altura é de 900 px): a roda do mouse avança a experiência. Foram capturados 56 passos de 600 px de roda depois do clique que liga o som, e as caixas de texto da interface foram lidas em 6 passos-chave. A nossa versão foi capturada com os mesmos passos (`passos.cjs`). O mapa está em `replica/estudos/gq-lab-mapa.json`.

| Passo | Elemento | Original | Nosso (1º ciclo) | Gravidade | Status |
|---|---|---|---|---|---|
| 0 | Clique para começar | o clique em qualquer lugar liga o som e libera a rolagem | a faixa invisível dos capítulos (190 px no rodapé) engolia o clique no botão | estrutura | corrigido (a faixa só recebe clique durante os capítulos) |
| 6 | Esboço vira matéria | mesa vista do alto, sem o objeto | câmera colada no frasco, que já aparecia | layout | corrigido (frasco só a partir do passo 11; câmera alta) |
| 7–12 | Céu | azul-acinzentado suave, horizonte quente difuso, chão quase preto | faixa laranja chapada e chão cinza (erro no `smoothstep` do shader) | acabamento | corrigido |
| 12–28 | Escala do objeto | o objeto ocupa cerca de 1/4 do pedestal | frasco grande demais, a tampa cortada nas aproximações | layout | corrigido (escala 0,6 e câmeras recuadas) |
| 15–28 | Líquido | (relógio) | âmbar cinzento, sem leitura através do vidro | acabamento | corrigido (âmbar opaco com verniz por dentro do vidro) |
| 44 | Fecho | perfil lateral escuro com luz de recorte | tampa clara demais | acabamento | corrigido (luz de recorte, ambiente a 12%) |
| — | Menos movimento | — | 5 textos invisíveis | acessibilidade | corrigido (quadro parado + transcrição aberta) |

## Diferenças que ficam por escolha

- **Narração:** o original tem vozes gravadas sincronizadas com as legendas. Nós não temos vozes, então as legendas acompanham a rolagem (as palavras acendem conforme você avança) e o som é um ambiente gerado na hora pelo navegador. Se você gravar as falas da transcrição, eu sincronizo os áudios.
- **Objeto:** o relógio vira o frasco AC-07, modelado em three.js (vidro com transmissão, líquido âmbar, tampa octogonal de aço escovado com parafusos de latão).
- **Família:** Inter Tight no lugar da GT America (paga), e EB Garamond nas falas.
- **Textos de interface:** o original usa 10 e 11 px. Nós usamos no mínimo 12 px, para passar no portão de legibilidade.
- **Imagens:** não há fotos. Tudo é 3D em tempo real, como no original.

## Rodada final de comparação

| Passo | Elemento | Original | Antes | Status |
|---|---|---|---|---|
| todos | Clima | penumbra, brancos contidos | brancos estourados | corrigido (exposição 0,86, luzes mais baixas, mesa cinza-claro) |
| 0 | Título | cinza antes de acender | branco puro | corrigido (branco a 78%) |
| 6 | Mesa do esboço | vista de longe e do alto | câmera próxima | corrigido |
| 7–28 | Céu | laranja só numa faixa fina no horizonte | faixa laranja larga | corrigido |
| 12–28 | Objeto | pequeno sobre o pedestal | grande | corrigido (escala 0,5) |
| 36–40 | Tela de raio X | inclinada, com a sala escura em volta | enchia o quadro | corrigido (câmera recuada) |

Fica para quando houver material próprio: o original tem chão espelhado e modelos fotográficos; o nosso usa geometria e materiais feitos em código.
