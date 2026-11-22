# Prompt para finalizar a skill (sessão nova)

Cole o bloco abaixo numa sessão nova do claude.ai/code com o repositório **skills-pt-br**.
Objetivo: fazer qualquer agente com a skill `site-nivel-awwwards` entregar sites de nível Awwwards.

```
Faça git fetch origin claude/awards-level-sites-requirements-o1dukq, mude para essa branch e trabalhe nela. Não abra pull request. Fale sempre em português.

Leia por inteiro, nesta ordem:
1. site-nivel-awwwards/ROADMAP.md
2. site-nivel-awwwards/SKILL.md
3. site-nivel-awwwards/replica/PROTOCOLO.md
4. site-nivel-awwwards/references/rubrica.md e references/pesquisa.md

Contexto: a galeria tem 9 sites em site-nivel-awwwards/galeria/ (01-taina, 02-polpa, 04-aura, 05-bruma, 06-olea, 07-gq-lab, 08-mindmarket, 09-terminal, 10-cartier). Eles são a prova do que a skill consegue. A tarefa é transformar esse aprendizado em ferramentas que qualquer agente use. NÃO mexa na aparência desses sites, salvo no item 1.

Execute os itens na ordem, com commit e push ao fim de cada um.

ITEM 1 — Pacote piloto da BRUMA ALTA (galeria/05-bruma)
- CLAUDE.md na pasta do site: mapa de arquivos, como rodar (porta 3005), regras de rolagem (1 vh = 9 px em 900 de altura), regras do celular, armadilhas conhecidas.
- Cores por papel no CSS (--cor-hero, --cor-fria, etc.) e troca por ?tema=.
- Conteúdo mandando no comportamento por atributos data-* (sem mudar o resultado visual).
- Capturas-alvo por seção em conceito/ (nossas, nunca do original).
- Prompt de uso com perguntas iniciais e 3 caminhos (usar como está, trocar marca e paleta, ou construir do zero a partir do padrão).
- Conferir que continua igual e com 0 FAIL:
  PLAYWRIGHT_CORE=/opt/node-tools/node_modules/playwright-core node scripts/verificar-site.mjs http://localhost:3005/ --espera 4000
- Depois repetir o pacote nos outros 8 sites.

ITEM 2 — Juiz Awwwards
Crie references/juiz.md (instrução para um subagente avaliador) e scripts/juiz.mjs que captura o site em 1440x900 e 390x844 e monta a folha de telas. O juiz dá nota 0-10 em Design (40%), Usabilidade (30%), Criatividade (20%) e Conteúdo (10%), lista correções objetivas e define nota mínima (média ponderada >= 7,5, e nenhum critério abaixo de 6) para liberar. Teste o juiz em 3 sites da galeria e calibre as notas.

ITEM 3 — Nota de fidelidade automática
Crie replica/ferramentas/fidelidade.py: compara original x nosso por tela (SSIM e diferença de estrutura, tolerâncias do PROTOCOLO.md) e dá uma nota por tela e total. As capturas do original ficam fora do repositório.

ITEM 4 — Módulos reutilizáveis em starters/
Extraia dos 9 sites, com os números medidos e um exemplo mínimo que roda: giro de objeto 3D por quadros, trecho fixo com timeline GSAP, galeria horizontal, meio-tom, painel de vidro, cursor customizado, aviso de cookies e botão de som, pré-carregamento. Cada módulo: README curto, HTML/CSS/JS, parâmetros e armadilhas.

ITEM 5 — Direção criativa
Acrescente à skill uma etapa antes de qualquer código: ideia central em uma frase, gesto-assinatura por seção, uma regra que o site nunca quebra, e o que ele NÃO faz. Sem isso o agente não começa.

ITEM 6 — Teste cego
Rode a skill em 3 subagentes limpos (sem o seu contexto) com 3 briefings diferentes (ex.: clínica, joalheria, produto físico em 3D). Meça cada resultado com verificar-site.mjs, juiz e uma checagem visual. Cada falha vira uma regra escrita na skill. Repita até os 3 passarem.

ITEM 7 — SKILL.md enxuto
Reescreva o SKILL.md curto, só com o fluxo e links para os arquivos acima. Nada de texto repetido.

IMAGENS E VÍDEOS (regra para todos os itens)
- Imagem não essencial: deixe um placeholder do mesmo tamanho e proporção, com cor neutra da paleta (não use lorem nem texto provisório visível). Fica fácil de trocar depois.
- Imagem ou vídeo essencial (pessoas, cenário-chave, vídeo do hero): NÃO gere. Acrescente em galeria/IMAGENS-PARA-GERAR.md com número, arquivo, formato e prompt em português (foto ultra-realista, luz cinematográfica, sem texto) para o usuário gerar.

NUNCA copie código, textos, imagens, logotipos ou fontes pagas de sites existentes.
No fim: resumo do que mudou, o que ainda depende de mim e os links dos artefatos.
```

## O que fica com você

- **Imagens e vídeos essenciais:** gere pelos prompts de `galeria/IMAGENS-PARA-GERAR.md` e envie.
- **Acervo dos 910 sites:** rode a análise no seu computador (ou compartilhe a pasta `~/Documents/acervos-design` pelo Remote Control).
- **Seu olho nas telas finais:** diga o que não está parecido; isso vira regra.
