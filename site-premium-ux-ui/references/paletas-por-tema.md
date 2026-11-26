# Paleta por tema: como montar a melhor paleta para o conteúdo do site

A paleta nasce do **tema e da personalidade da marca**, validada pelos arquétipos que os premiados usam. O gerador faz o cálculo (OKLCH, neutros tingidos, contraste conferido); você decide o matiz do acento e justifica.

```bash
node ~/.claude/skills/site-premium-ux-ui/scripts/gerar-paleta.mjs --tema "restaurante" [--tom escuro|claro] [--acento 35] [--variante 1] [--croma 0.16] [--json]
node ~/.claude/skills/site-premium-ux-ui/scripts/gerar-paleta.mjs --listar     # temas reconhecidos
```
Saída: variáveis CSS (`--bg`, `--surface`, `--surface-2`, `--line`, `--text`, `--text-muted`, `--accent`, `--accent-soft`, `--on-accent`) e um relatório de contraste (texto ≥ 7:1, texto mudo ≥ 4,5:1, acento ≥ 3:1).

## Método (7 passos)
1. **Tema → emoção.** Que sensação o visitante deve ter (calma, desejo, confiança, energia, curiosidade)? Escreva três adjetivos.
2. **Tom do fundo.** O que os premiados fazem: Awwwards tende ao **escuro** (~51%); One Page Love ao claro. Escolha pelo tema: luxo, tecnologia, música, jogos e automotivo → escuro; saúde, alimentação, arquitetura, educação → claro.
3. **Neutros tingidos.** Fundo e texto nunca são `#000`/`#fff`: têm um leve matiz do tema (quente para moda/arquitetura/alimentação, frio para tecnologia/finanças). É o que dá "calor" ao conjunto.
4. **Um acento.** Mais de 40% dos premiados não têm acento; os que têm usam **um**, em área pequena (botão, link, destaque). O matiz vem do tema (tabela abaixo); ajuste por contraste e para **fugir do óbvio do concorrente**.
5. **Contraste primeiro.** Texto sobre fundo ≥ 7:1; texto mudo ≥ 4,5:1; texto sobre o acento ≥ 4,5:1. Se o acento não passa como texto, use-o só como preenchimento.
6. **Teste de uso real.** Aplique em hero, botão, link, card, foco e erro; confira também em escala de cinza (o visual precisa se sustentar sem cor).
7. **Registre a justificativa** em `docs/IDENTIDADE.md`: tema → emoção → tom → matiz → por que difere dos concorrentes.

## Estratégia de acento por tema (ponto de partida)
| Tema | Tom | Matiz do acento (OKLCH) | Ideia |
|---|---|---|---|
| Moda, beleza | claro | 20°, 350°, 0° | neutros quentes + um acento contido |
| Luxo, joias, hotel | escuro | 85° (dourado dessaturado) | preto quente + dourado discreto |
| Arquitetura, imobiliário | claro | 45°, 145°, 250° | cores de material (concreto, areia, terra) |
| Tecnologia, IA | escuro | 265°, 290°, 195° | azul/violeta/ciano frio, brilho controlado |
| Finanças | escuro | 160°, 255° | verde ou azul sóbrio, números grandes |
| Saúde, bem-estar | claro | 160°, 200°, 140° | verdes/azuis suaves, calma |
| Alimentação | claro | 35°, 20°, 100° | tomate, mostarda, cacau sobre creme |
| Educação | claro | 255°, 45°, 145° | claro e amigável, um acento vibrante |
| Arte, cultura, portfólio | claro/auto | 30°, 15°, 330° | a obra dá a cor; paleta neutra |
| Música, eventos | escuro | 330°, 130°, 55° | acento elétrico, tipografia gigante |
| Jogos, esportes | escuro | 145°, 330°, 125°, 30° | contraste alto, energia |
| Sustentabilidade, ONG | claro | 145°, 90°, 40° | musgo, oliva, argila (evitar verde-folha de clichê) |
| Infantil | claro | 30°, 350°, 255° | mais de um acento é aceitável, com neutro firme |
Lista completa e notas por tema em `scripts/temas.json`.

## O que os dados dizem (910 sites)
Arquétipos de cor mais comuns, por tom + matiz: veja `~/.claude/skills/identidade-visual/references/paletas.md`: "escuro sem acento" 28% no Awwwards, "claro sem acento" 25% no One Page Love. Paletas médias têm 6 a 7 cores computadas, mas as **decisivas** são fundo, texto e um acento.

## Erros comuns
- Acento saturado demais em grandes áreas (cansa e desvaloriza).
- Preto puro com branco puro (frio e "digital"): tinja.
- Verde "folha" para tudo que é natural; azul "corporativo" para tudo que é B2B; roxo para tudo que é IA.
- Paleta sem teste em hover, foco, erro e modo de alto contraste.
- Copiar a paleta inteira de um site de referência: use a **estratégia**, não os valores.
