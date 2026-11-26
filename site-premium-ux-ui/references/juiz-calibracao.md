# Calibração do juiz Awwwards (2026-11-23)

Para quem mantém a skill. **Não passe este arquivo ao juiz**: ele julga sem saber o que se espera.

## Como foi feita
- Material gerado por `scripts/juiz.mjs` (7 telas em 1440×900 e 7 em 390×844, folha única e fatos).
- Os sites foram renomeados para "site V/W/X/Y/Z". Um subagente **novo** para cada site em cada rodada, só com `juiz.md` e o material.
- Degradado de propósito: cópia da POLPA **fora de `galeria/`** (no scratchpad, nunca no repositório) com uma folha `degradar.css` que troca toda a tipografia por Arial, reduz os títulos a ~5 vw e esconde as anotações à mão, as colagens e os selos. Cores, renders 3D e textos ficaram iguais, para testar se o juiz se deixa levar pela imagem bonita.

## Resultado por rodada (média ponderada)

| Rodada | Regras | V · TAINÁ (forte) | W · BRUMA | X · POLPA | Y · AURA (média) | Z · POLPA degradada |
|---|---|---|---|---|---|---|
| 1 | tetos iniciais | | | 4,55 | 4,85 | 4,50 |
| 2 | tetos por intenção, desconto por defeito, 3D de render vale | | | 6,00 | 5,75 | 5,40 |
| 3 | defeito descontado uma vez só; tipografia sem caráter limita Criatividade | | 6,00 | 6,15 | 6,20 | 5,05 |
| 4 | Usabilidade: menu escondido no hero aceito se houver ação; cookies só pelo teto | 6,20 | | | 6,20 | 5,45 |
| **5** | **desconto só para defeito que esconde título, ação ou menu (máx. −1,0)** | **6,45** | | | **5,90** | **5,45** |

Notas da rodada 5 por critério (Design / Usabilidade / Criatividade / Conteúdo):
- V · TAINÁ: 6,5 / 6 / 7 / 6,5.
- Y · AURA: 5,5 / 6,5 / 5,5 / 6,5.
- Z · degradada: 5 (teto da fonte do sistema) / 6 / 5 (teto da tipografia sem caráter) / 6,5.

## O que cada rodada ensinou
1. **Tetos grossos achatam tudo.** "Algo quebrado = máximo 4" pegou os três sites por sobreposições pequenas (muitas eram animação no meio), e "3D que é imagem = máximo 4" puniu renders de modelo 3D, que o próprio `replica/PROTOCOLO.md` manda usar. Resultado: os três entre 4,5 e 4,9, sem separação.
2. **Defeito contado duas vezes** (em Design e em Usabilidade) fez o site forte cair abaixo do degradado em Usabilidade.
3. **Sem tipografia própria, o degradado ainda tirava 6,5 em Criatividade** por causa dos renders 3D. O teto "tipografia sem caráter: Criatividade ≤ 5" resolveu.
4. **A POLPA original não serve como "forte"**: Design 7 e Criatividade 7,5, mas sem ação principal e com o menu escondido (Usabilidade 4 a 6). A rubrica também exige ação clara, e o juiz está certo. A BRUMA teve o mesmo padrão.
5. **Falhas pequenas de acabamento já estão na âncora 7.** Descontá-las de novo punia o site mais rico (mais elementos, mais colisões). Com o desconto restrito ao que esconde título, ação ou menu, a TAINÁ separou da AURA.

## Leitura dos números
- **Separação:** forte > média > degradada, cerca de 0,5 entre cada um. Em quatro rodadas seguidas o degradado nunca passou de 5,45.
- **Variação** entre juízes diferentes no mesmo site: cerca de ±0,3 (AURA 6,20 / 6,20 / 5,90). Por isso a regra 7 do `juiz.md`: perto do corte, rode um segundo juiz e fique com a menor nota.
- **Nenhum site da galeria passa de 7,5.** É esperado: são réplicas de estudo (fotos provisórias, textos curtos, corpo de 12 px). As correções que o juiz devolve são concretas e coincidem entre juízes diferentes (ex.: AURA, menu cobrindo "PERTO DE TUDO"; TAINÁ, hero sem nome nem gesto; POLPA, sem ação principal).

## Limites conhecidos
- O juiz não vê movimento: julga só o que as telas paradas mostram.
- `fatos.md` mede o maior texto da página inteira; se esse texto está escondido (ex.: h1 fora da tela), a escala aparece maior do que a que se vê.
- Sites de palco com WebGL levam cerca de 6 min para capturar sem GPU.

## Quando recalibrar
Ao mudar âncoras ou tetos do `juiz.md`: repita com V (TAINÁ), Y (AURA) e Z (degradado, recriado como descrito acima). A ordem tem que se manter, e Z precisa ficar ≤ 5,5.
