# Direção criativa: Vésper

## As duas ideias oferecidas (sem usuário, escolhida a recomendada)
1. **Uma luz só (recomendada, escolhida):** o site é escuro e uma única luz, que o visitante conduz, acende a pedra faceta por faceta. Hero: a pedra 3D sobre a marca gigante, só iluminada onde a luz está. Uau: mover o cursor e ver as facetas dispararem em tempo real. *Por quê:* casa com o 3D com ray tracing (a luz é de fato calculada dentro da pedra), com o estilo escuro escolhido e com o nome da marca (Vésper, a primeira luz da noite).
2. **Lupa:** o cursor é uma lente que amplia a peça e revela a lapidação. Ficou de fora porque depende de fotos macro de alta resolução que ainda não existem.

## Ideia central (uma frase)
**Uma luz só atravessa o escuro e acende a pedra, faceta por faceta.**

Cinco testes: (1) 11 palavras; (2) trocando a marca por uma pousada ou um SaaS, "acende a pedra, faceta por faceta" deixa de valer; (3) o hero cabe num guardanapo: um círculo de luz, um diamante e a palavra VÉSPER cortada no pé; (4) gera um gesto diferente por seção (abaixo); (5) com a logo coberta, o diamante e as cotas de lapidação dizem "joalheria".

## Gestos por seção
| Seção | Gesto-assinatura | De onde vem na ideia | Como se vê numa tela parada |
|---|---|---|---|
| Hero | A luz (o cursor; no toque, uma órbita lenta) é a única fonte: ela acende as facetas do diamante 3D e só ilumina a parte da marca gigante VÉSPER que está perto dela. | "uma luz só atravessa o escuro" | Tela escura; o diamante no centro, na frente da palavra VÉSPER cortada no pé da tela; um halo quente em volta da pedra; as letras perto da pedra claras, as das pontas apagadas. |
| A lapidação | Pin + scrub: a rolagem gira e inclina a pedra (de cima, de perfil, de baixo) e leva a luz até a parte descrita; uma linha de cota com o ângulo real (34,5° na coroa, 40,75° no pavilhão) se desenha da pedra até o texto, que acende. | "acende a pedra, faceta por faceta" | A pedra de perfil à esquerda; uma cota fina com "34,5°" ligada ao passo "Coroa" aceso; os outros passos em cinza quente. |
| Peças e visita | Cada peça surge de um círculo de luz que se abre a partir de um ponto (clip-path) e fica num poço de luz; o resto da tela continua escuro. A chamada final é o único bloco em acento. | "a luz acende uma peça por vez" | Uma peça já iluminada e a seguinte meio revelada dentro de um círculo; botão "Agendar visita" em acento. |

## A regra que o site nunca quebra
**Nada aparece sem a luz:** toda revelação é um círculo de luz que se abre a partir de um ponto. Nada sobe de baixo para cima, nada entra só por fade. O acento `#dbb155` só aparece no que é clicável e no centro da luz.

## O que o site NÃO faz
- Dourado em tudo (fundo preto com moldura, linhas e títulos dourados).
- Partículas, brilhos piscando, estrelinhas e "glitter" em CSS.
- Fonte script de convite de casamento.
- Carrossel de produtos e cards iguais com sombra.
- Frases como "luxo e exclusividade em cada detalhe"; números, prêmios ou depoimentos inventados.

## Momento "uau"
No hero, mover o cursor e ver o diamante responder: as facetas trocam de clarão e soltam cores (dispersão) conforme a luz passa, porque o reflexo é calculado dentro da pedra, não é uma foto. A mesma luz acende as letras da marca atrás dela.

## Componentes das plataformas usados (regra permanente)
| Onde | Componente | Plataforma | Licença | Adaptação |
|---|---|---|---|---|
| Hero, marca | Blur Text (https://reactbits.dev/text-animations/blur-text) | reactbits.dev | MIT + Commons Clause | reescrito em CSS: as letras saem do escuro (desfoque e brilho), sem subir |
| Hero, luz que segue o cursor | Spotlight Card (https://reactbits.dev/components/spotlight-card) | reactbits.dev | MIT + Commons Clause | a ideia do holofote radial que segue o ponteiro, aplicada à página e à máscara da marca |
| Lapidação, passos | Scroll Reveal (https://reactbits.dev/text-animations/scroll-reveal) | reactbits.dev | MIT + Commons Clause | o passo ativo acende; os outros ficam em cinza quente (contraste ≥ 4,5:1) |
| Botões | Magnet (https://reactbits.dev/animations/magnet) | reactbits.dev | MIT + Commons Clause | já no projeto-base (GSAP quickTo) |
| Textura | Noise (https://reactbits.dev/animations/noise) | reactbits.dev | MIT + Commons Clause | grão estático em SVG, sem canvas |
| Formulário | Success check (https://transitions.dev) | transitions.dev (core, grátis) | MIT | traço do check desenhado em SVG ao enviar |
| Ritmo do hero | microtexto em colunas e marca gigante no pé (técnica) | ORE (Awwwards) | só referência | conteúdo, fonte e imagens próprios |
