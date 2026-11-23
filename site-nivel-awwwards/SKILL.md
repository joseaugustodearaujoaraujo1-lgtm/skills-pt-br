---
name: site-nivel-awwwards
description: Skill única para criar sites, landing pages, portfólios e lojas do zero com design, identidade visual, UX/UI, componentes e movimento de nível Awwwards e One Page Love. Pergunta, em ordem fixa e com opções (e campo para digitar), qual site de referência o usuário prefere (3 sugestões do acervo de sites premiados + 1 recomendada, com links clicáveis), a stack (HTML+CSS+JS+GSAP ou Next.js+GSAP), o estilo (entre 10, com opção de deixar a escolha para a skill) e a paleta (a recomendada ou a que o usuário escrever); se houver 3D, pergunta se o usuário gera a imagem ou vídeo de referência (com prompt de comandos de barra) ou se a skill faz, e sempre sugere um elemento 3D leve. Sempre usa componentes das plataformas reactbits.dev, transitions.dev e naocodei.com (com pinstack e tasteskill.dev de referência), inclui todo o conteúdo de design-completo e estilos-paletas-design, monta brief em JSON com tokens CSS, tem receitas de código e portão de qualidade. Use SEMPRE que o pedido envolver site nível Awwwards, premiado, One Page Love, design incrível ou profissional, identidade visual, escolha de paleta ou estilo, hero, scroll, animação ou 3D, mesmo sem citar esses nomes.
---

# Site nível Awwwards / One Page Love

Fluxo em seis passos, na ordem. Cada passo aponta para o arquivo de detalhe: abra-o só quando chegar nele.

> **Caminhos:** `<skill>` é a pasta desta skill (a que tem este arquivo), normalmente `~/.claude/skills/site-nivel-awwwards/`. Os scripts acham o playwright-core e o Chromium sozinhos nos caminhos comuns; se não acharem, defina `PLAYWRIGHT_CORE` e `CHROME` (teste cego, rodada 1).
> **Sem usuário para responder** (teste, automação): em cada pergunta ou aprovação, inclusive o "Posso começar?" e os portões do 3D, escolha a opção recomendada e registre a escolha e o motivo em `design/DECISOES.md` (teste cego, rodada 1).
> Valem as regras do `CLAUDE.md`: "Posso começar?" antes de usar ferramentas; autorização para etapas novas, custos, publicações e operações externas. Nas plataformas externas: sem login, sem conta, sem compra.

## Princípios
1. **O usuário escolhe, você recomenda.** Estilo, paleta e referência sempre em opções, com uma recomendada e justificada.
2. **Evidência antes de gosto.** As opções vêm do acervo, da pesquisa ao vivo e de dados medidos.
3. **A referência Awwwards é o molde de estrutura e experiência**: ordem e proporção das seções, grid, hierarquia, ritmo, tipo de scroll e motion (medidos com a skill `reanimate`). Nunca o protegido: texto, imagem, vídeo, logo, marca, fonte paga e código.
4. **Uma ideia, um gesto.** Um conceito claro e um efeito de assinatura; menos efeitos, melhor acabamento.
5. **3D é 3D de verdade** (geometria em WebGL, material PBR, girável), igual ao molde aprovado. Depois do 3D, sempre se sugere um scroll avançado.
6. **Medir para declarar.** "Nível Awwwards" não se declara: o juiz libera.

## 1. Briefing → [references/perguntas.md](references/perguntas.md)
Na primeira resposta, diga o agente e o modelo em uso (se souber) e o modelo e esforço que cada etapa pede ([modelos.md](references/modelos.md)): Opus na direção criativa, no 3D e no juiz; Sonnet no resto. Só o usuário troca o modelo da sessão; subagentes você cria com o modelo certo.
Diga o modo de trabalho: **A · do zero**, **B · refazer** ou **C · reajustar**. Em B e C, capture e diagnostique antes de propor ([01-diagnostico.md](references/base-design-completo/01-diagnostico.md); níveis em [_SKILL-original.md](references/base-design-completo/_SKILL-original.md) §2).
Pergunte em três blocos com `AskUserQuestion` (sempre com "Outro"): **1** entender o sistema, as provas e a stack; **2** sites de referência (A, B, C + E recomendada, com links); **3** estilo, paleta, 3D e scroll, sempre com a opção recomendada primeiro. Entre o bloco 1 e o 2:
```bash
node <skill>/scripts/opcoes.mjs --tema "<assunto>" --adjetivos "a,b,c" --recursos "3d,scroll,tipografia" [--tipo vitrine|portfólio|saas|institucional|editorial|evento]
```
Abra as capturas antes de mostrar os sites (ranking e encaixe de layout em [pesquisa.md](references/pesquisa.md)). Feche com `montar-brief.mjs` (`design/brief.json` + `tokens.css`) e valide o brief com o usuário.

## 2. Direção criativa → [references/direcao-criativa.md](references/direcao-criativa.md)
Antes de qualquer código, escreva `design/DIRECAO.md`: ideia central em uma frase, gesto-assinatura por seção (visível numa tela parada), uma regra que o site nunca quebra e o que ele **não** faz. Ofereça duas ideias, recomende uma e aprove com o usuário. Depois, a identidade visual (mesmo arquivo). **Seção sem gesto não está pronta.** Obrigatórios também: um **momento-assinatura** visível numa captura parada e **composições diferentes entre seções vizinhas** (§2b e §2c).

## 3. Estudo de referências → [references/pesquisa.md](references/pesquisa.md)
Recapture as 3 a 6 referências escolhidas (depois do preloader, em 1440 e 390 px) e escolha uma por seção, com o que adaptar e o que não copiar (`brief.json > secoes[].referencia`). Em réplica, siga [replica/PROTOCOLO.md](replica/PROTOCOLO.md).

## 4. Construção com starters → [references/construcao.md](references/construcao.md)
Se houver 3D, passe antes pelos portões de [aprovacoes.md](references/aprovacoes.md). Depois:
```bash
node <skill>/scripts/criar-projeto.mjs --stack html|next --nome "<Marca>" --tema "<assunto>" --saida ./meu-site --cores "fundo=#..,superficie=#..,texto=#..,acento=#.." --entrada <direção> --instalar
```
Use os módulos de [starters/modulos/](starters/modulos/README.md) para os gestos que eles cobrem e as receitas de [elementos.md](references/elementos.md) para o resto.

## 5. Portões (nesta ordem)
1. **Verificador:** `node <skill>/scripts/verificar-site.mjs <url> --saida ./verificacao --lighthouse` com **0 FAIL**; depois olhe as capturas e passe a rubrica ([rubrica.md](references/rubrica.md)).
2. **Fidelidade** (só em réplica): `replica/ferramentas/fidelidade.py`, toda tela ≥ 75 ([replica/PROTOCOLO.md](replica/PROTOCOLO.md) §5.5).
3. **Juiz:** `node <skill>/scripts/juiz.mjs <url> --saida ./juiz --direcao design/DIRECAO.md` e um subagente limpo com `juiz/PEDIDO-AO-JUIZ.md` ([juiz.md](references/juiz.md)). Libera com **média ≥ 7,5 e nenhum critério < 6**. Corrija na ordem devolvida e chame um juiz novo a cada rodada.

## 6. Entrega e imagens → [references/entrega.md](references/entrega.md)
Relatório com o que foi medido e o que **não** foi testado. Imagens e vídeos essenciais não se geram: vão para `IMAGENS.md` com prompt, e o site fica com placeholder sem texto à vista.

Índice de arquivos, scripts e limites conhecidos: [references/mapa-da-skill.md](references/mapa-da-skill.md).
