# Finalizar a skill em 5 sessões (plano enxuto)

Cada sessão é nova no claude.ai/code, com o repositório **skills-pt-br**, e resolve **um bloco**. Sessão curta relê pouco contexto e gasta menos. O progresso fica em `STATUS-SKILL.md`: cada sessão lê esse arquivo primeiro e o atualiza no fim.

| Sessão | Itens | Modelo | Esforço |
|---|---|---|---|
| A | Pacotes dos 9 sites | Sonnet | médio |
| B | Juiz, nota de fidelidade, direção criativa | Opus | alto |
| C | Módulos em `starters/` | Sonnet | médio |
| D | Teste cego e correções | Opus | alto |
| E | `SKILL.md` enxuto | Opus | alto |

Faça na ordem A, B, C, D, E. Troque o modelo com `/model` e o esforço com `/effort` antes de colar o prompt.

## Regras comuns (já estão dentro de cada prompt)
- Imagem não essencial: placeholder do mesmo tamanho e proporção, em cor neutra da paleta, sem texto "lorem".
- Imagem ou vídeo essencial (pessoas, cenário-chave, vídeo do hero): não gere. Acrescente em `galeria/IMAGENS-PARA-GERAR.md` com número, arquivo, formato e prompt em português.
- Nunca copiar código, textos, imagens, logotipos ou fontes pagas de sites existentes.
- Capturas do original ficam fora do repositório.
- Commit e push ao fim, sem pull request. Se o push for rejeitado: `git fetch origin <branch> && git merge --no-edit FETCH_HEAD`, sem force.

---

## Sessão A: pacotes dos 9 sites (Sonnet, esforço médio)

```
Faça git fetch origin claude/awards-level-sites-requirements-o1dukq, mude para essa branch e trabalhe nela. Não abra pull request. Fale sempre em português.

Leia site-premium-ux-ui/STATUS-SKILL.md, site-premium-ux-ui/ROADMAP.md (Fase 1) e site-premium-ux-ui/replica/PROTOCOLO.md.

Tarefa: deixar cada site de site-premium-ux-ui/galeria/ (01-taina, 02-polpa, 04-aura, 05-bruma, 06-olea, 07-gq-lab, 08-mindmarket, 09-terminal, 10-cartier) como pacote liberável. NÃO mude a aparência nem o movimento de nenhum site.

Faça primeiro a BRUMA (05-bruma) à mão, como molde:
1. node scripts/gerar-pacote.mjs galeria/05-bruma já gerou o CLAUDE.md-esqueleto. Preencha todos os <PREENCHER> (alturas medidas, trechos fixos, regras do celular, armadilhas) lendo public/index.html, estilo.css e src/main.js.
2. Cores por papel no estilo.css (--cor-hero, --cor-fria etc.) e troca por ?tema=<nome>, com pelo menos 2 temas além do padrão.
3. Comportamento por atributos data-* no HTML (o JS lê os atributos). O resultado visual tem que ficar idêntico.
4. Capturas-alvo por seção em conceito/ (desktop 1440x900 e celular 390x844) com replica/ferramentas/telas2.cjs.
5. Arquivo PROMPT-DE-USO.md com perguntas iniciais e 3 caminhos: usar como está, trocar marca e paleta, ou construir do zero a partir do padrão.
6. Conferir: npm run build e PLAYWRIGHT_CORE=/opt/node-tools/node_modules/playwright-core node scripts/verificar-site.mjs http://localhost:3005/ --espera 4000 com 0 FAIL, e uma captura antes/depois sem diferença visível.

Depois repita nos outros 8 sites usando a BRUMA como molde: rode scripts/gerar-pacote.mjs, preencha o CLAUDE.md, aplique 2 a 4 e 5, e confira 6. Não releia o site inteiro: leia só o que precisa para preencher os <PREENCHER>.

Ao fim: atualize STATUS-SKILL.md (marque a sessão A), commit e push, e liste o que ficou pendente.
```

---

## Sessão B: juiz, nota de fidelidade e direção criativa (Opus, esforço alto)

```
Faça git fetch origin claude/awards-level-sites-requirements-o1dukq, mude para essa branch e trabalhe nela. Não abra pull request. Fale sempre em português.

Leia site-premium-ux-ui/STATUS-SKILL.md, ROADMAP.md (Fases 2 e 4), SKILL.md, references/rubrica.md e replica/PROTOCOLO.md.

Item 1, juiz Awwwards:
- references/juiz.md: instrução para um subagente avaliador. Nota 0 a 10 em Design (40%), Usabilidade (30%), Criatividade (20%) e Conteúdo (10%), com critérios objetivos por nota, lista de correções ordenadas por impacto e nota mínima para liberar (média ponderada >= 7,5 e nenhum critério abaixo de 6).
- scripts/juiz.mjs: captura o site em 1440x900 e 390x844 (6 a 8 telas-chave, não o site inteiro) e monta uma folha única para o juiz olhar.
- Calibre em 3 sites da galeria (um forte, um médio e um que você degrade de propósito). O juiz tem que separar os três. Se der nota alta ao degradado, endureça os critérios.

Item 2, nota de fidelidade:
- replica/ferramentas/fidelidade.py: compara original x nosso por tela (SSIM mais diferença de estrutura), com as tolerâncias do PROTOCOLO.md. Saída em texto: nota por tela e total. Só gere imagem de diferença quando a nota de uma tela cair abaixo do limite.

Item 3, direção criativa:
- Acrescente à skill uma etapa antes de qualquer código: ideia central em uma frase, gesto-assinatura por seção, uma regra que o site nunca quebra e o que ele NÃO faz. Crie references/direcao-criativa.md com banco de conceitos (o que o tema permite que ninguém fez) e exemplos bons e ruins. Regra: seção sem gesto não está pronta.

Ao fim: atualize STATUS-SKILL.md (marque a sessão B), commit e push.
```

---

## Sessão C: módulos em `starters/` (Sonnet, esforço médio)

```
Faça git fetch origin claude/awards-level-sites-requirements-o1dukq, mude para essa branch e trabalhe nela. Não abra pull request. Fale sempre em português.

Leia site-premium-ux-ui/STATUS-SKILL.md e o CLAUDE.md de cada site de galeria/ (já são o mapa; não releia os sites inteiros).

Tarefa: extrair para site-premium-ux-ui/starters/ os 6 módulos mais usados, com os números medidos nos sites: (1) giro de objeto 3D por quadros, (2) trecho fixo com timeline GSAP presa à rolagem, (3) galeria horizontal, (4) meio-tom, (5) painel de vidro, (6) cursor customizado.
Cada módulo em sua pasta, com: README curto (quando usar, parâmetros, armadilhas), HTML, CSS e JS, e um exemplo mínimo que roda (npm run build e node servir.mjs) e passa no verificar-site.mjs com 0 FAIL.
Reescreva o código a partir dos nossos sites; não copie nada de sites de terceiros.
Os módulos de cookies, botão de som e pré-carregamento ficam para depois, só se sobrar tempo.

Ao fim: atualize STATUS-SKILL.md (marque a sessão C), commit e push.
```

---

## Sessão D: teste cego e correções (Opus, esforço alto)

```
Faça git fetch origin claude/awards-level-sites-requirements-o1dukq, mude para essa branch e trabalhe nela. Não abra pull request. Fale sempre em português.

Leia site-premium-ux-ui/STATUS-SKILL.md, SKILL.md, references/juiz.md e references/direcao-criativa.md.

Tarefa: provar que um agente limpo consegue fazer um site de nível Awwwards usando só a skill.

Rodada 1 (um briefing só):
- Briefing: uma clínica de dermatologia em São Paulo (confirme com o usuário se quiser outro).
- Lance um subagente limpo (Agent, sem seu contexto) dando só o caminho da skill e o briefing. Peça um site de uma página com hero e 2 seções (não o site inteiro), em uma pasta de teste fora de galeria/.
- Meça com scripts/verificar-site.mjs (0 FAIL) e scripts/juiz.mjs (nota mínima do juiz).
- Para cada falha ou nota baixa, escreva uma regra curta na skill (no arquivo certo em references/) e rode a rodada de novo até passar.

Rodadas 2 e 3 só se a rodada 1 passar de primeira ou em no máximo 2 correções:
- Briefing 2: joalheria de luxo. Briefing 3: produto físico com 3D.
- Mesma medição. Cada falha vira regra.

Registre em references/teste-cego.md: briefing, nota, falhas e a regra criada por cada falha.
Ao fim: atualize STATUS-SKILL.md (marque a sessão D), commit e push.
```

---

## Sessão E: `SKILL.md` enxuto (Opus, esforço alto)

```
Faça git fetch origin claude/awards-level-sites-requirements-o1dukq, mude para essa branch e trabalhe nela. Não abra pull request. Fale sempre em português.

Leia site-premium-ux-ui/STATUS-SKILL.md, SKILL.md e a lista de arquivos em references/, starters/, scripts/ e replica/.

Tarefa: reescrever o SKILL.md curto, só com o fluxo, em ordem: briefing, direção criativa, estudo de referências, construção com starters, portões (verificar-site, fidelidade, juiz), entrega e imagens. Cada passo aponta para o arquivo de detalhe, carregado só quando preciso. Sem texto repetido, sem regra duplicada. Confira que todo link aponta para um arquivo que existe.

Ao fim: atualize STATUS-SKILL.md (marque a sessão E), commit e push.
```

---

## O que fica com você
- **Imagens e vídeos essenciais:** gere pelos prompts de `galeria/IMAGENS-PARA-GERAR.md`.
- **Acervo dos 910 sites:** análise no seu computador, em Sonnet, em lotes de 50 a 100 sites. O destilado vai para `references/acervo-destilado/`. Não suba as capturas.
- **Seu olho nas telas finais:** diga o que não está parecido; isso vira regra.
