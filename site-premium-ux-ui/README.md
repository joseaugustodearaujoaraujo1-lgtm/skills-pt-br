# site-premium-ux-ui

Skill para agentes de código (Claude Code e compatíveis) que faz o agente entregar **experiências visuais** surreais, ultrarrealistas e leves, com UX/UI e movimento de nível **Awwwards**, em vez do site genérico que um agente faz sozinho.

**Elemento 3D:** referências do usuário → imagens molde → molde no Blender (opcional) → elemento só em Three.js com menos de 200 KB, com aprovação do usuário em cada etapa ([references/pipeline-3d.md](references/pipeline-3d.md)).

## Por que existe

Um agente sem método faz sites corretos e iguais entre si: grid de cards, gradiente roxo, animação de entrada em tudo, imagem de banco. O que o Awwwards premia é outra coisa: **uma ideia clara, um gesto de assinatura por seção, tipografia e ritmo de rolagem decididos, acabamento medido**. Esta skill transforma isso em processo, com portões que o agente não consegue pular.

## Como funciona (a lógica)

1. **O usuário escolhe, o agente recomenda.** Estilo, paleta e site de referência saem em opções, com uma recomendada e justificada.
2. **Evidência antes de gosto.** As opções vêm de um acervo de sites premiados (medidos: tamanho de título, espaçamento, tipo de rolagem, efeitos) e de pesquisa ao vivo.
3. **Referência é molde de estrutura, nunca cópia.** Ordem das seções, ritmo e movimento, sem copiar texto, imagem, logo, fonte paga ou código.
4. **Uma ideia, um gesto.** Antes de código, o agente escreve `DIRECAO.md`: ideia central, gesto de cada seção, o que o site nunca faz. Seção sem gesto não está pronta.
5. **"Nível Awwwards" não se declara, se mede.** O site só é entregue depois de passar por 3 portões:
   - **Verificador** automático (`verificar-site.mjs`): 0 falhas em contraste, responsivo (1440/768/390), texto cortado, imagens, movimento reduzido, nota de produção à vista.
   - **Fidelidade** (só em réplica): comparação pixel a pixel por tela, mínimo 75.
   - **Juiz** independente (`juiz.mjs` + subagente limpo): rubrica Awwwards (Design 40%, Usabilidade 30%, Criatividade 20%, Conteúdo 10%); libera com média ≥ 7,5 e nenhum critério abaixo de 6.

6. **Modelo certo por etapa.** O agente diz qual modelo está usando e recomenda o melhor para cada etapa (forte na direção criativa e no juiz, intermediário no resto), para gastar menos sem perder nota ([references/modelos.md](references/modelos.md)).

Fluxo: briefing → direção criativa → estudo de referências → construção (projeto-base + módulos prontos) → portões → entrega com relatório do que foi e do que não foi testado.

## O que tem aqui

| Pasta | Conteúdo |
|---|---|
| `SKILL.md` | O fluxo de 6 passos que o agente segue (começa por aqui) |
| `references/` | Detalhe de cada passo, rubrica, juiz, estilos, paletas, receitas de motion e 3D, padrões medidos |
| `scripts/` | Opções de referência, paleta, brief, criador de projeto, verificador, juiz, diagnóstico |
| `scripts/acervo/` | Coleta, medição e busca do acervo de sites premiados |
| `starters/` | Projeto-base HTML+GSAP e Next+GSAP, e 7 módulos reutilizáveis (giro por quadros, trecho fixo, galeria horizontal, meio-tom, vidro, cursor, elemento 3D em Three.js) |
| `galeria/` | 9 sites de exemplo (réplicas de sites premiados com marca fictícia) com `CLAUDE.md`, temas e capturas-alvo |
| `replica/` | Protocolo e ferramentas para refazer fielmente um site de referência |
| `teste-cego/` | Sites feitos por agentes limpos só com a skill, usados para calibrar |

## Instalar

```bash
git clone https://github.com/joseaugustodearaujoaraujo1-lgtm/skills-pt-br
cp -r skills-pt-br/site-premium-ux-ui ~/.claude/skills/
```
Para uso só em um projeto, copie para `.claude/skills/` dentro dele. A pasta `galeria/` é opcional (≈ 200 MB): para uma instalação leve, apague-a depois de copiar.

## Deixar completa e funcionando

**No primeiro uso, o agente confere a máquina e pede sua permissão** para instalar o que falta; nada é instalado sem a sua resposta ([references/preparacao.md](references/preparacao.md)). Para só conferir à mão: `node scripts/preparar.mjs`.

Os comandos abaixo são o caminho manual.

```bash
cd ~/.claude/skills/site-premium-ux-ui
npm i playwright && npx playwright install chromium     # verificador, juiz, acervo
node scripts/diagnostico.mjs                            # diz o que ainda falta
```
Obrigatórios: Node 20+, Playwright e Chromium. Opcional no 3D: Blender 4.x ou mais novo (no PATH ou em `BLENDER=caminho`); as imagens molde o próprio agente faz, sem gerador pago. Recomendados: `ffmpeg` (converter imagens e vídeos) e Python 3 (só para réplicas).

**Acervo de sites premiados (opcional, deixa as referências muito melhores).** Sem ele a skill funciona, mas pesquisa ao vivo e acha menos referências. Para montar o seu, no **seu computador** (o Awwwards recusa conexões de nuvem):

```bash
node scripts/acervo/listar-awwwards.mjs --categoria fashion --paginas 3 --saida sites.json
node scripts/acervo/coletar.mjs --lista sites.json --fonte awwwards --limite 100
node scripts/gerar-padroes.mjs && node scripts/gerar-padroes-ux.mjs
```
Guia completo, formatos e boas maneiras em [references/acervo-do-zero.md](references/acervo-do-zero.md). O acervo bruto (capturas) fica só na sua máquina e já está no `.gitignore`: são obras de terceiros e arquivos grandes.

**Imagens e vídeos principais** (pessoas, cenário-chave, vídeo do hero) a skill não gera: ela escreve os prompts em `IMAGENS.md` e deixa placeholder neutro. Gere no gerador de sua preferência, converta com `ffmpeg` e troque os arquivos. É o que mais pesa na nota final.

## Usar

Abra o agente na pasta do projeto e peça um site em linguagem natural. O agente carrega a skill, **faz as perguntas** (briefing, 5 opções de referência, estilo, paleta, 3D e scroll), mostra a direção criativa para você aprovar, constrói e roda os portões. Você responde e aprova; ele recomenda sempre uma opção.

Para rodar os portões à mão em qualquer site:
```bash
node scripts/verificar-site.mjs http://localhost:3000 --saida ./verificacao --lighthouse
node scripts/juiz.mjs http://localhost:3000 --saida ./juiz --direcao design/DIRECAO.md
```

## Prompt de exemplo: site simples

Cole numa sessão nova, com a skill instalada:

```
Use a skill site-premium-ux-ui para criar um site de uma página para a "Café Serra", uma cafeteria
de especialidade em Campos do Jordão (SP). Público: casais e viajantes de 25 a 45 anos que valorizam
café de origem. Três adjetivos: quente, artesanal, calmo. Não quero parecer: cafeteria de rede, nem
visual escuro de tecnologia. Seções: abertura, nossa história, cardápio com 6 itens, os grãos (3 origens),
visite-nos (endereço, horário, WhatsApp) e rodapé. Ação principal: abrir o WhatsApp para encomendas.
Stack: HTML + CSS + JS + GSAP. Sem 3D. Ainda não tenho fotos nem logotipo: use placeholders neutros e
liste em IMAGENS.md o que eu preciso gerar. Faça as perguntas do briefing, me mostre as 5 opções de
referência e a direção criativa para eu aprovar antes de construir. No fim, rode o verificador e o juiz
e me entregue o relatório com o que foi e o que não foi testado.
```

## Limites honestos

- Nenhum site feito pela skill foi avaliado pelo júri real do Awwwards. O juiz é um modelo, calibrado com sites de nível conhecido. Em testes cegos (agente limpo, só com a skill), as notas foram 6,75; 7,05; 7,50 (liberada) e, na rodada 4, 7,15; 7,05; 7,35 depois de uma rodada de correções. O que mais segura a nota hoje são as imagens provisórias.
- O juiz só vê o plano B do 3D (sem GPU na nuvem). Imagens e vídeos essenciais dependem de você.
- Cores definidas dentro do JS ou do 3D não seguem o `?tema=` dos sites da galeria.
- A coleta ao vivo do Awwwards depende do HTML dele, que muda; o One Page Love pede o uso da API oficial.

Índice completo de arquivos e limites: [references/mapa-da-skill.md](references/mapa-da-skill.md).
