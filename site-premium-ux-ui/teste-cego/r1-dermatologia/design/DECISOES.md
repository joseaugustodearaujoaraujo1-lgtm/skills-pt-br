# Decisões tomadas sem o usuário

Não havia usuário para responder perguntas nem aprovar etapas. Em cada ponto em que a skill manda perguntar ou aprovar, escolhi a opção que ela mesma recomenda. Abaixo, a escolha e o motivo.

| Etapa da skill | Pergunta / aprovação | Escolha | Motivo |
|---|---|---|---|
| Regra do CLAUDE.md | "Posso começar?" | Comecei direto | O pedido já autoriza a construção; nada fora da pasta do site foi alterado. |
| 0. Modo | A, B ou C | **A · do zero** | Não há site anterior. |
| 1.1 O que é | assunto, nome, cidade | Clínica de dermatologia em São Paulo, nome provisório **Estrato Dermatologia** | O briefing não deu nome. "Estrato" (camada) liga o nome à ideia central. Trocar quando o cliente informar o nome real. |
| 1.1 Objetivo | ação principal | **Agendar avaliação** | É a ação típica de clínica; o hero e a última seção levam a ela. |
| 1.1 Público e aparelho | — | Adultos de 25 a 60 anos em São Paulo, maioria no celular | Perfil comum de clínica dermatológica particular; por isso celular primeiro. |
| 1.1 Páginas | — | Uma página: hero + 2 seções (camadas tratadas e primeira consulta com pedido de agendamento) | Pedido do briefing. |
| 1.2 Material | logo, fotos, textos | Nenhum: placeholders e texto escrito por mim, sem números nem depoimentos | Regra de ouro da skill: conteúdo real, nada inventado. Imagens essenciais listadas em `IMAGENS.md`. |
| 1.2 Adjetivos | 3 adjetivos e o que evitar | **preciso, sereno, acolhedor**; evitar "hospitalar" | Combinação do banco de conceitos para clínica (luz clínica sem frieza). |
| 1.2 Stack | HTML+GSAP ou Next+GSAP | **HTML + CSS + JS + GSAP** | Marcada como recomendada em `perguntas.md` (mais leve, ideal para landing). |
| 2. Sites de referência | A, B, C + E recomendada | **E: [Decibel Health](https://decibelhealth.com/)**; A: [ONSKN](https://onskn.com/), B: [GlowGuide](https://www.glowguide.com/), C: [Lóvi](https://lovi.care/) | O acervo local (`~/Documents/acervos-design`) não existe nesta máquina e `opcoes.mjs` quebrou ao ler o `acervo.json`. Segui o plano B da skill (pesquisa ao vivo no One Page Love), olhei as capturas e recomendei a Decibel Health: saúde, fundo creme quente, hero dividido texto/imagem, serifa calma e um CTA só, que é o tom "cuidado, não hospital" pedido pelo tema. O site da Awwwards não respondeu pela rede deste ambiente. |
| 3. Estilo | 3 estilos + "você escolhe" | **Minimalism** (recomendado, 12 pts) | Primeiro do ranking de `escolher-estilo.mjs` para o tema saúde e os adjetivos "preciso" e "sereno"; o guia cita clínicas de estética como uso ideal. |
| 3. Paleta | recomendada, geradas ou digitar | **Paleta de origem do Minimalism** (Ivory `#F4EFE8`, Sage `#6B7F6E`, tinta `#1F2A22`, Sand `#C9BDAF`) | É a "Recomendada" que o `opcoes.mjs` imprime. Ajustes de contraste: texto mudo `#6B6F66` → `#5E625A` (4,49 → 5,45:1) e acento como texto `#6B7F6E` → `#4A5D4E` (3,76 → 6,19:1); o Sage original fica só em elementos grandes. Acrescentei tons de profundidade (`#E6DDD1`, `#D8CCBD`, musgo `#2B3A2F`) para o gesto das camadas. Observação: o `criar-projeto.mjs` gravou a paleta verde gerada (160°) em `tokens.css`, diferente da recomendada; sobrescrevi. |
| 3. 3D | pedir referências, molde, prévia | **Sem 3D** (sugestão da skill: "forma orgânica suave (blob) respirando") | Os portões de `aprovacoes.md` exigem referências do usuário, molde aprovado e vídeo-prévia aprovado; sem usuário e sem gerador de imagem, nada disso pode ser aprovado. O conceito de camadas é resolvido melhor por recorte. A sugestão fica registrada para uma próxima rodada. |
| 3. Scroll animado | recomendado, 2 alternativas | **Revelação por clip-path** (Zentry, Era Residence) | Recomendado pelo `opcoes.mjs` e por `scroll-avancado.md` para página institucional. Apoio: régua de profundidade fixa ligada à rolagem. |
| 3. Validar o brief | aprovação | Aprovado por mim | Sem usuário. Escolhas gravadas em `design/brief.json` (chave `escolhas` e `secoes`). |
| 3b. Portões do 3D | molde e vídeo-prévia | Não se aplica | Sem 3D. |
| 3c. Direção criativa | 2 ideias, uma recomendada | **"Camadas"**: a rolagem desce pelas camadas da pele | É a primeira ideia do banco de conceitos para dermatologia e o exemplo "bom" de `direcao-criativa.md`; casa com o scroll por clip-path. Alternativa não escolhida: "Antes e depois honesto" (divisor arrastável), que exigiria fotos reais de pacientes. |
| 3c. Aprovar `DIRECAO.md` | aprovação | Aprovado por mim | Sem usuário. |
| 4. Identidade | logo, tipografia | Logotipo tipográfico (Instrument Serif) com um traço de três camadas; Instrument Serif + Inter + DM Mono (rótulos e milímetros) | Tipografia que o brief gerou; DM Mono baixada à parte porque o `criar-projeto.mjs` só baixa título e corpo. |
| 5. Contato | telefone, endereço, CRM | Formulário de pedido de agendamento que mostra confirmação na tela, sem envio real | Não há dados reais; inventar telefone ou endereço violaria a regra de conteúdo real. **Pendente antes de publicar:** ligar o formulário a um canal real, endereço, e nome e CRM do responsável técnico (exigência do CFM para publicidade médica). |
| 6. Juiz | subagente | Não lançado | Dispensado pelo pedido. O resto do portão (verificador, capturas e rubrica) foi feito. |
