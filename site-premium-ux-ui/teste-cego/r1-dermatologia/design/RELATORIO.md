# Relatório — Estrato Dermatologia (hero + 2 seções)
Modo: A · do zero · Objetivo da página: levar o visitante a pedir uma avaliação · Ação principal: **Agendar avaliação**
Servido em http://localhost:3201/ (`node servir.mjs 3201`, pasta `public/`). Escolhas e motivos em `design/DECISOES.md`; direção em `design/DIRECAO.md`.

## Portão automático (`verificar-site.mjs --lighthouse`)
**APROVADO: 0 FAIL, 3 WARN** (o mesmo aviso nas 3 larguras). Relatório e capturas em `verificacao/`.

| | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| desktop | 100 | 100 | 100 | 100 | 0,4 s | 0 ms | 0 |
| celular | 100 | 100 | 100 | 100 | 0,9 s | 10–20 ms | 0 |

WARN justificado: **emoji** é o "©" do rodapé (`\p{Extended_Pictographic}` inclui o ©); não há emoji na página.
Correções feitas no caminho: contraste de "varia por região" (4,32 → 5,33:1), da marca gigante do rodapé (1,16 → 3,46:1), textos de 11 px subidos para 12 px, confirmação do formulário que aparecia antes do envio (`[hidden]` vencido por `display:flex`) e imagem do exame que saía vazia na captura de página inteira (`decoding="async"`).

## Rubrica (nota própria, sem o juiz, que foi dispensado)
| Critério | Nota | Evidência |
|---|---|---|
| Design (40%) | 7,5 | Paleta Minimalism de origem com um acento (sálvia escura); 2 famílias + mono de detalhe; H1 de ~120 px contra corpo de ~16 px (≈ 7×); fundo que escurece por camada (`--c1` → `--c3` → musgo). Fraco: as imagens são placeholders desenhados, o que limita o acabamento. |
| Usabilidade (30%) | 8 | Ação principal na primeira dobra (topo e hero) e formulário com erro por campo, tremor e confirmação; alvos ≥ 44 px; foco visível; movimento reduzido mostra tudo; 1440/768/390 sem rolagem horizontal. Menu some no celular (≤ 860 px) e fica só o botão de agendar: com duas seções, aceitável. |
| Criatividade (20%) | 7 | Ideia de uma frase ("descer pelas camadas da pele"), gesto por seção visível em tela parada (corte em três fatias, faixas por profundidade com amostra circular do tecido, exame com linha de leitura) e régua de profundidade que acompanha a página. Sem 3D. |
| Conteúdo (10%) | 7 | Texto específico do assunto (espessuras aproximadas das camadas, queixas por camada, passos da consulta), sem números nem depoimentos inventados. Falta prova real (equipe, CRM, endereço). |

Anti-clichês: sem jaleco, sem azul hospitalar, sem cruz, sem estrelas, sem gradiente roxo, sem cards iguais com ícone. Regra "tudo se revela de cima para baixo" seguida em hero, títulos, faixas, exame, passos e rodapé.

## Componentes das plataformas
| Componente | Plataforma | Licença | Uso |
|---|---|---|---|
| Animated Content / Fade Content (ideia) | reactbits.dev | MIT + Commons Clause | reescrito como recorte de cima para baixo nas faixas e passos |
| Magnet | reactbits.dev | MIT + Commons Clause | botões (só com mouse) |
| Success check | transitions.dev (core) | MIT | confirmação do pedido (círculo e traço desenhados) |
| Error state shake | transitions.dev (core) | MIT | campo obrigatório inválido |
Código reescrito em GSAP/CSS; nada copiado.

## Sugestões que dependem do cliente
- Nome real, endereço, canal de agendamento (o formulário hoje só confirma na tela, **não envia**), e nome e CRM do responsável técnico (exigência do CFM).
- As duas imagens de `IMAGENS.md`.
- Próxima rodada: 3D leve sugerido pela skill (forma orgânica "respirando") passando pelos portões de molde e prévia.

## Não verificado
Juiz Awwwards (dispensado), celular real, rede lenta real, Safari e Firefox, leitor de tela, navegação completa por teclado (só foco e formulário foram conferidos).
