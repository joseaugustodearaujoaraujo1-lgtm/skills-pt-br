# Catálogo naocodei — 66 efeitos

Levantado em 25/10/2026; o site pode ter mudado desde então. Extração do código: botão "Copiar efeito" ou `window.CODIGOS["<ID>"]` na página correspondente (veja `06-motion.md`, seção 8). Crédito: Não Codei (naocodei.com).

## CSS — https://naocodei.com/free-code-css/

Os efeitos de entrada animam quando o container recebe a classe `.run` (no site real, adicione via `IntersectionObserver`). Marcados com **JS**: precisam de um trecho de JavaScript, já incluído no snippet.

### a01–a10 · O que todo site usa
| ID | Efeito | Quando usar |
|---|---|---|
| a01 | Aparecer (fade) | Entrada mínima, textos secundários |
| a02 | Subir e aparecer | Padrão de entrada de seções ao rolar |
| a03 | Elevar no hover | Cards e botões (transição, volta sozinha) |
| a04 | Entrar crescendo (mola) | Modais, badges, ícones de destaque |
| a05 | Cascata (via `--i`) | Listas, grids de cards, features |
| a06 | Deslizar da lateral | Toasts, avisos, menus, mensagens |
| a07 | Pulsar | Chamar atenção para CTA ou status sem mover |
| a08 | Girar | Loaders e ícones de carregamento |
| a09 | Sublinhado que cresce | Links de menu e de texto |
| a10 | Brilho que atravessa | Botão principal, badge "novo", card premium |

### a11–a20 · Quando o site amadurece
| ID | Efeito | Quando usar |
|---|---|---|
| a11 | Barra de progresso (scaleX) | Progresso de leitura, upload, etapas |
| a12 | Sanfona (`grid-template-rows` 0fr→1fr) | FAQ, detalhes expansíveis |
| a13 | Flutuar | Ilustrações e mockups do hero |
| a14 | Respirar | Indicador "ao vivo", CTA em repouso |
| a15 | Esqueleto carregando | Estados de loading de cards e listas |
| a16 | Quicar | Ícone de "role para baixo", notificações |
| a17 | Esteira infinita (marquee) | Logos de clientes, depoimentos |
| a18 | Contador de números **JS** | Métricas e estatísticas |
| a19 | Máquina de escrever (`steps()`) | Headline do hero, terminal |
| a20 | Gradiente em movimento | Fundos de hero, bordas, botões |

### a21–a30 · Raros (use 1–2 por site)
| ID | Efeito | Quando usar |
|---|---|---|
| a21 | Cortina que revela | Títulos de seção marcantes |
| a22 | Traço SVG que se desenha | Ilustrações de linha, logos, ícones |
| a23 | Card que vira (flip) | Antes/depois, pergunta/resposta, equipe |
| a24 | Inclinar em 3D **JS** | Cards de produto, pricing em destaque |
| a25 | Onda no clique (ripple) **JS** | Feedback de botões |
| a26 | Desfoque que resolve | Entrada de imagens/títulos (pesa: use pouco) |
| a27 | Texto em onda | Palavra de destaque, estados divertidos |
| a28 | Forma que se transforma (blob) | Fundos orgânicos, molduras de foto |
| a29 | Texto com falha (glitch) | Estética tech/gamer, 404 |
| a30 | Ímã no cursor **JS** | CTA principal (desktop) |

## JavaScript — https://naocodei.com/free-code/

JS puro, sem biblioteca. Nos efeitos de rolagem, troque o container `.mini` da vitrine pela janela. Os efeitos de canvas e shader param sozinhos fora da tela.

### j01–j08 · Rolagem (a rolagem controla o efeito, ida e volta)
| ID | Efeito | Quando usar |
|---|---|---|
| j01 | Cartões que empilham (sticky stack) | Etapas, features, cases |
| j02 | Galeria horizontal (scroll vertical → lateral) | Portfólio, cases de agência |
| j03 | Sequência de quadros (estilo Apple) | Produto girando, storytelling |
| j04 | Texto que se preenche | Manifesto, frase de impacto |
| j05 | Máscara que revela | Imagem de destaque, transição de seção |
| j06 | Faixas que se montam | Títulos e composições editoriais |
| j07 | Linha do tempo | História, roadmap, "como funciona" |
| j08 | Objeto que gira | Produto ou ícone 3D-like ligado ao scroll |

### j09–j14 · Cursor e física
| ID | Efeito | Quando usar |
|---|---|---|
| j09 | Cursor personalizado | Portfólio/agência (desktop apenas) |
| j10 | Rolagem com inércia (smooth scroll) | Sites editoriais (cuidado com acessibilidade) |
| j11 | Arrastar para deslizar | Carrosséis e galerias |
| j12 | Luz no cursor (spotlight) | Grids de cards, fundos escuros |
| j13 | Partículas que fogem | Hero interativo |
| j14 | Botão elástico | CTA principal |

### j15–j19 · Texto
| ID | Efeito | Quando usar |
|---|---|---|
| j15 | Embaralhar letras (scramble) | Títulos tech, hover em links |
| j16 | Revelar palavras | Headline do hero |
| j17 | Palavras que trocam | "Feito para [designers/devs/times]" |
| j18 | Odômetro | Métricas, preços, contadores grandes |
| j19 | Contador regressivo | Lançamentos, ofertas, eventos |

### j20–j24 · Listas e layout (técnica FLIP)
| ID | Efeito | Quando usar |
|---|---|---|
| j20 | Reordenar lista | Rankings, kanban, ordenação |
| j21 | Filtro de galeria | Portfólio e catálogos com categorias |
| j22 | Janela que nasce (do elemento clicado) | Abrir detalhes/modal a partir de um card |
| j23 | Painéis que expandem | Galeria em acordeão horizontal, serviços |
| j24 | Carregar mais | Blogs, listas longas |

### j25–j27 · Dados
| ID | Efeito | Quando usar |
|---|---|---|
| j25 | Gráfico de barras | Dashboards, comparativos |
| j26 | Anel de progresso | KPIs, metas, habilidades |
| j27 | Gráfico de linha | Crescimento, séries temporais |

### j28–j30 · Tela e transição
| ID | Efeito | Quando usar |
|---|---|---|
| j28 | Partículas conectadas (canvas) | Fundo de hero tech/rede |
| j29 | Confete | Sucesso de formulário, conquista |
| j30 | Transição de telas (View Transitions API) | Navegação com sensação de app |

### j31–j36 · Canvas e shader (efeitos de maior impacto)
| ID | Efeito | Quando usar |
|---|---|---|
| j31 | Fundo com shader (WebGL) | Hero premium |
| j32 | Texto de partículas | Logo ou palavra do hero |
| j33 | Rastro de fluido | Hero interativo, portfólio criativo |
| j34 | Malha que ondula | Fundo abstrato animado |
| j35 | Viagem pelas estrelas | Espaço, lançamento, "warp" |
| j36 | Gotas que se fundem (metaballs) | Fundos orgânicos, marcas criativas |
