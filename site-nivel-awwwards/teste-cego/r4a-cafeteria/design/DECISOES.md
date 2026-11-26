# Decisões tomadas sem usuário (opção recomendada em cada pergunta)

| Pergunta / aprovação | Escolha | Motivo |
|---|---|---|
| "Posso começar?" | Sim | Sem usuário; regra do SKILL.md |
| Bloco 1 (sistema) | Respondido pelo briefing: cafeteria de especialidade, Campos do Jordão; casais e viajantes 25-45; ação = WhatsApp para encomendas; página única | Briefing do cliente |
| Material existente | Nada (sem fotos, sem logo) | Briefing; placeholders sem texto + IMAGENS.md |
| Stack | HTML + CSS + JS + GSAP (recomendada) | Imposta pelo briefing |
| Sites de referência (bloco 2) | Nenhum do acervo: `opcoes.mjs` avisou "acervo não encontrado" (0 sites). Sem rede/pesquisa ao vivo para capturar; usei o perfil "vitrine de produto" e estrutura própria | Acervo ausente neste ambiente |
| Estilo | Minimalism (recomendado pelo `opcoes.mjs`), ajustado ao calor: neutros tingidos de café, sem preto | Quente, artesanal, calmo; não pode parecer rede nem tecnologia escura |
| Paleta | Claro quente: fundo `#f6eee2`, superfície `#fbf6ee`, texto `#2b1c12`, acento terracota `#a4401d`; seção escura = café torrado `#3a2216` (não preto). Baseada em C1 (Assinatura) do `opcoes.mjs`, mais quente | Evita o clichê "preto + dourado" e o visual escuro de tecnologia |
| 3D | Não (briefing). Portões de aprovação do 3D: não se aplicam | Briefing |
| Scroll de assinatura | O recomendado era clip-path; usei clip-path (nível do café sobe de baixo) | Combina com a ideia central |
| Direção criativa: duas ideias | (A) "Nível do café sobe na xícara conforme se desce a serra" (recomendada) e (B) "Hora do dia da cafeteria". Escolhi A | Passa nos 5 testes, gesto diferente por seção |
| Aprovação do DIRECAO.md | Aprovado | Sem usuário |
| Componentes das plataformas | Split Text (reactbits.dev, via GSAP SplitText), Scroll Reveal do manifesto, Magnet nos botões, Noise (grão em CSS) | `opcoes.mjs` sugeriu; sem login/compra |

## Conteúdo a confirmar com o cliente (não inventado como fato)
- Número do WhatsApp: o link usa um número de teste (`5512999999999`); trocar pelo real.
- Nomes e notas dos cafés da seção "Na bancada" são especificação sugerida; confirmar com a cafeteria.
- Altitude 1.628 m: dado público de Campos do Jordão (cidade mais alta do Brasil); confirmar a redação.
- Endereço, horário, prazos e área de entrega: não informados; a página manda perguntar no WhatsApp.
- Sem depoimentos, avaliações ou prêmios (não existem no briefing).

## Notas da construção
- Fontes: o `criar-projeto.mjs` escolheu Instrument Serif + Inter + DM Mono (conferido contra o "não faz": não é Playfair+Inter). Mantidas.
- Momento-assinatura: na tela "meio" do `juiz.mjs` o nível já está em cerca de 90%; a palavra "devagar." aparece cortada só no topo pela linha. O quadro com a palavra partida ao meio acontece um pouco antes (em ~60% da subida). Ponto fraco registrado.
- Servidor: `node servir.mjs 4601` na pasta do projeto.

## Rodada de correções do juiz (6,85)
- A confirmar com o cliente: pesos e preços dos cartões (250 g R$ 52 / 250 g R$ 48 / 250 g R$ 48 / 500 g R$ 89), altitudes das fazendas no rótulo, retirada em Capivari e horário 9h às 18h todos os dias. Tudo é ilustrativo.
- Barra fixa do WhatsApp (celular): padding-bottom de 84 px no rodapé (não no main) para não aparecer faixa clara sob o fundo café.
- Círculos dos passos: enchimento estático por CSS (33/66/100%), sem animação, para aparecer em qualquer captura.
