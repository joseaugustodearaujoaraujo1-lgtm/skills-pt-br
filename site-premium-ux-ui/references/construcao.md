# Construção com os starters (passo 4 do fluxo)

Comece **sempre** pelo projeto-base e pelos módulos prontos; escreva código do zero só para o gesto que nenhum deles cobre.

## 1. Se houver 3D: portões antes de modelar
Referências → imagens molde → aprovação → Blender → aprovação → Three.js (< 200 KB) → aprovação → vídeo-prévia do site → aprovação, nesta ordem ([pipeline-3d.md](pipeline-3d.md), [aprovacoes.md](aprovacoes.md)). Sem usuário, pare e espere. `estado-3d.mjs --objeto <obj> exigir --etapa site` precisa passar antes de criar o projeto. Prompts em [prompts-3d.md](prompts-3d.md).

## 2. Criar o projeto
```bash
node <skill>/scripts/criar-projeto.mjs --stack html|next --nome "<Marca>" --tema "<assunto>" --adjetivos "a,b,c" --publico "..." \
  --descricao "<até 155 caracteres>" --saida ./meu-site --cores "fundo=#..,superficie=#..,texto=#..,acento=#.." \
  [--entrada sobe|desce|da-esquerda|da-direita|opacidade|nenhuma] [--porta 3005] [--ref3d "objeto=caminho"] [--3d sim] --instalar
```
Gera o brief e os tokens (se `design/brief.json` ainda não existe), baixa as fontes locais (título, corpo e a mono de detalhe), escreve a paleta escura da seção de contraste, copia o projeto-base (`starters/html` ou `starters/next`) e instala.

| Opção | O que faz |
|---|---|
| `--cores` | grava a paleta **escolhida** no bloco 3 em `tokens.css`, gera o acento suave e escolhe o texto do botão (avisa abaixo de 4,5:1). Sem ela fica a paleta gerada para o tema, e o script avisa (teste cego, rodadas 1, 3 e 3b) |
| `--entrada` | direção em que o hero, os títulos, os itens e os passos entram (`data-entrada` no `<html>`). Escolha a que a ideia central pede; o padrão `sobe` só serve se o conceito não disser outra coisa (teste cego, rodada 1). Num elemento, `data-entrada` vale só para ele e para o que está dentro |
| `--porta` | porta do servidor (padrão 3001 no HTML, 3000 no Next). O servidor HTML também aceita `npm run serve -- 3005`, `node servir.mjs --porta 3005` ou `PORT=3005`, e pula para a porta seguinte se a escolhida estiver ocupada, dizendo qual usou |
| `--ref3d`, `--3d` | repassados ao brief (objetos 3D e suas referências) |

O projeto-base já traz hero em CSS, menu, manifesto, trilho horizontal, números, passos, contato, rodapé, acessibilidade e as lições de desempenho medidas ([elementos.md](elementos.md) §9).

## 3. Módulos prontos → [../starters/modulos/README.md](../starters/modulos/README.md)
Sete peças (seis medidas nos sites da galeria, mais a base do elemento 3D), cada uma com README (quando usar, parâmetros, armadilhas) e exemplo que passa no verificador com 0 FAIL:

| Gesto que o conceito pede | Módulo |
|---|---|
| elemento 3D ultrarrealista (só Three.js, < 200 KB) | `07-elemento-threejs` |
| giro por quadros (só para imagens que não são o elemento 3D) | `01-giro-3d-quadros` |
| seção presa enquanto uma timeline anda | `02-trecho-fixo-timeline` |
| galeria que corre de lado | `03-galeria-horizontal` |
| foto em barras (meio-tom) | `04-meio-tom` |
| painel de vidro sobre imagem ou 3D | `05-painel-vidro` |
| cursor com rótulo | `06-cursor-customizado` |

Copie `modulo.css` e `modulo.js` para `src/`, cole o trecho de `modulo.html` e ajuste pelos `data-*`.

## 4. Depois de criar
1. Troque todo texto **[entre colchetes]** por conteúdo real (o verificador reprova). Provas e dados que faltam: não invente ([perguntas.md](perguntas.md), 1.2).
2. Aplique o estilo e a paleta escolhidos (guia do estilo em [base-estilos/](base-estilos/)) e os **componentes das plataformas**: todo site usa componentes ou transições de reactbits.dev, transitions.dev ou naocodei.com ([componentes-plataformas.md](componentes-plataformas.md): nomes reais, peso e combinação por tipo de página; preço e licença em [plataformas.md](plataformas.md)).
3. Ajuste as seções ao estudo de referências (passo 3), sem copiar o protegido.
4. Cada seção recebe o gesto dela, do `DIRECAO.md` ([direcao-criativa.md](direcao-criativa.md) §2). Seção sem gesto não está pronta.
5. Imagens: reais (do cliente ou abertas, com crédito); a imagem essencial que ainda não existe vira placeholder sem texto, com a cara da imagem final ([elementos.md](elementos.md) §3), e entra na lista de imagens ([entrega.md](entrega.md)). Vídeo com pôster.
6. **O starter é ponto de partida, não layout** (teste cego, rodada 4). Mantenha: `servir.mjs`, `package.json`, a carga de fontes e tokens, o Lenis e o registro do GSAP no topo do `main.js`, o `data-entrada` e o verificador. Pode apagar sem medo: o HTML de todas as seções de exemplo (hero em duas colunas, faixa escura de números, cartões), o CSS delas e os blocos do `main.js` que procuram esses seletores. Reescreva o `index.html` a partir do `DIRECAO.md` e mantenha o `main.js` em sincronia (seletor sem elemento não dá erro, mas é código morto).
7. **Animação de entrada por CSS e GSAP nunca no mesmo elemento** (teste cego, rodada 4: o `gsap.to` leu o `transform` no meio da animação CSS e deixou vãos). O que o GSAP anima recebe `data-entrada="nenhuma"`; use `gsap.fromTo` com valores explícitos e `immediateRender: false` quando a animação depende de rolagem.
8. **Contraste em todos os estados** (teste cego, rodada 4). O verificador mede o texto no estado em que a página abre. Texto sobre uma camada que só aparece com a rolagem (água que sobe, véu que escurece) precisa de fundo próprio que garanta contraste também antes da camada chegar.
9. **CSS novo não anula o celular** (teste cego, rodada 4). Regras acrescentadas no fim do `estilo.css` vencem os `@media` do starter que vêm antes. Escreva cada componente já com a versão de celular dentro do mesmo bloco, ou ponha os `@media` depois, e confira as telas `m-*` do `juiz.mjs`.
10. **Mudou a tipografia ou a paleta depois do brief?** O `tokens.css` é a fonte da verdade (o `criar-projeto.mjs` não refaz o brief existente). Edite o `tokens.css` direto e baixe os pesos que o título usa: `baixar-fontes.mjs --familias "Fonte:wght@400;700"` (sem `wght`, vem só o 400). Apague os arquivos de fonte antigos só depois de conferir que o CSS não os cita.
11. **Fotos livres: olhe cada uma** (teste cego, rodada 5). `buscar-fotos-livres.mjs` devolve candidatas, não escolhidas: a busca por lugar traz o lugar errado ("tiradentes" acha o enforcado; Paraty entra em "casario colonial") e várias têm marca d'água ou data impressa. Abra cada candidata, descarte as turvas, de baixa resolução (hero ≥ 1600 px) ou com cenário que contraria o briefing (ex.: balcão de inox num restaurante "de fogão a lenha"). Converta para WebP com o mesmo tratamento de cor em todas (`ffmpeg -vf "eq=saturation=..."` ou ImageMagick `convert`) e creditte autor e licença no rodapé.
12. **Fontes do briefing** (teste cego, rodada 5): se o estilo recomendado traz fontes que contrariam o briefing, passe `--fontes "Título,Corpo,Detalhe"` ao `criar-projeto.mjs` em vez de editar o `tokens.css` depois.
13. **Cabeçalho fixo não cobre títulos** (teste cego, rodada 4). Toda seção tem `scroll-margin-top` e respiro no topo maiores que a altura do cabeçalho; no celular, a barra fixa de ação some quando a seção de contato aparece e não cobre texto (espaço no fim de cada seção igual à altura dela).

## 5. Onde está cada receita
- Tipografia, grade, imagem, vídeo, scroll, animação, cursor, preloader e acabamento: [elementos.md](elementos.md). Desempenho no celular: §9.
- Scroll de assinatura: [scroll-avancado.md](scroll-avancado.md). 3D: [3d-leve.md](3d-leve.md).
- Números medidos nos premiados (tamanho do título, fontes, fundo escuro, stack): [padroes.md](padroes.md) e [padroes-ux.md](padroes-ux.md).
- Regras de ouro de design (uma ação por tela, hierarquia antes de estética, contraste, celular primeiro, conteúdo real): [base-design-completo/_SKILL-original.md](base-design-completo/_SKILL-original.md) §5.
- Skills que combinam: `frontend-design`, `gsap-*`, `scroll-craft`, `motion-design`, `desenvolvedor-de-solucoes`, `karpathy-guidelines`.

## 6. Rodar
HTML: `npm run build && npm run serve`. Next: `npm run dev` (ou `npm run build && npm start`). Use a URL que o servidor imprimir nos portões (passo 5).
