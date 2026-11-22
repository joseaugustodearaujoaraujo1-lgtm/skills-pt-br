# Roteiro para a skill chegar ao nível Awwwards

Objetivo: qualquer agente com esta skill instalada entrega um site com UX/UI de nível Awwwards.

O Awwwards pontua Design (40%), Usabilidade (30%), Criatividade (20%) e Conteúdo (10%). Réplica fiel ensina a técnica, mas o que ganha prêmio é conceito próprio bem executado. Por isso o roteiro tem duas frentes: **execução** (técnica, igual aos melhores) e **direção criativa** (ideia que só aquele site poderia ter).

## Fase 1: Pacotes testados (maior ganho)
Cada site da galeria vira um pacote liberável, no formato:
- `CLAUDE.md` com mapa dos arquivos, regras de movimento e do celular, e como personalizar;
- código, imagens e renders prontos, e capturas-alvo por seção (desktop e celular);
- cores por papel (`--cor-hero`, `--cor-fria`...) com `?tema=` para trocar a paleta num lugar só;
- conteúdo que manda no comportamento por atributos (`data-*`), sem mexer no JS;
- prompt de uso com as perguntas iniciais (montar a demo, fazer o site do cliente ou usar só algumas peças).
Piloto: um site; depois os outros.

## Fase 2: Direção criativa (o que ganha prêmio)
- Briefing que termina em **uma ideia central** e **um gesto-assinatura** por seção.
- Banco de conceitos: o que o tema permite que ninguém fez.
- Regra: seção sem gesto não está pronta.

## Fase 3: Acervo destilado (910 sites)
Rodar a análise no computador do usuário (`~/Documents/acervos-design`) e guardar na skill só o destilado: medidas por tipo de seção, receitas por efeito, sites etiquetados por técnica. Não copiar conteúdo.

## Fase 4: Portões
- Fidelidade (nota por tela contra a referência).
- Qualidade e acessibilidade (`verificar-site.mjs`, 0 FAIL).
- Desempenho (Lighthouse por site).
- **Juiz com rubrica Awwwards:** um subagente avalia o site pronto em Design, Usabilidade, Criatividade e Conteúdo e devolve notas e correções. O site só sai com nota mínima.

## Fase 5: Mídia ultra-realista
- Gerador de imagem e vídeo conectado (essencial: pessoas, cenários, vídeo do hero).
- Pipeline 3D offline em WebP com transparência.
- Lista `IMAGENS-PARA-GERAR.md` como padrão de entrega.

## Fase 6: Teste cego
Rodar a skill em agente limpo, sem contexto, com 3 briefings diferentes, e medir com os portões. O que falhar vira regra na skill. Repetir até estabilizar. É assim que se confirma que "qualquer agente" consegue.

## Fase 7: SKILL.md enxuto
Entrada curta com o fluxo; o detalhe em `references/`, carregado só quando preciso.

## Como executar
O plano está em `PROMPT-FINALIZAR-SKILL.md` (5 sessões com modelo e esforço por tarefa) e o andamento em `STATUS-SKILL.md`.
O esqueleto de cada pacote sai de `scripts/gerar-pacote.mjs`.
