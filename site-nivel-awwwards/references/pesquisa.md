# Pesquisa de referências (aprofundada, por projeto)

Objetivo: para **cada site novo**, achar sites de referência de design, layout e UX/UI que fiquem bons **naquele tema** e decidir, **seção por seção**, o que aprender de cada um. A pesquisa tem 3 camadas: acervo local (rápida, grátis), pesquisa ao vivo (atual) e análise (o que importa).

## Camada 1 — Acervo local (910 sites, offline)
```bash
node ~/.claude/skills/site-nivel-awwwards/scripts/pesquisar-referencias.mjs --tema "joalheria" --recursos "3d,scroll,tipografia,cursor" --libs gsap --desde 2022 --limite 12
```
- `--tema` aceita o texto livre do briefing; o script reconhece ~25 temas (`gerar-paleta.mjs --listar`) e mapeia para os nichos do Awwwards e do One Page Love.
- `--recursos`: `3d, scroll, tipografia, horizontal, experimental, editorial, video, cursor, preloader, marquee, pin, canvas`. `cursor`, `preloader`, `marquee` e `pin` só pontuam nos sites que já têm `estrutura.json` (coleta estrutural).
- Resultado: ranking com os motivos da pontuação e a pasta de capturas de cada site (`desktop.jpg`, `desktop-scroll.jpg`, `mobile.jpg`, `dados.json`, `estrutura.json`).
- Para mais controle use `buscar.mjs` (filtros por nicho, estilo, libs, ano, texto) na pasta do acervo.
- **Atenção: muitas capturas do acervo pegam o site ainda no preloader/intro** (ex.: Bennett & Clive aparece só como o nome gigante; GQ & AP, uma tela preta com logo). Para estudar layout e UX, **recapture as referências escolhidas** (próximo passo).

## Camada 2 — Pesquisa ao vivo (o que está premiado agora)
O acervo envelhece. Complemente com o que foi premiado recentemente **no mesmo nicho**:
1. **Awwwards**: `https://www.awwwards.com/websites/<categoria>/` (ex.: `fashion`, `architecture`, `technology`, `e-commerce`) e `https://www.awwwards.com/websites/sites_of_the_day/`. Abra pelo navegador embutido (ou `tavily_extract`); se o site bloquear, volte ao acervo.
2. **One Page Love**: `https://onepagelove.com/gallery/` e as listas `genre/<gênero>` e `style/<estilo>` (`scroll-effects`, `3d`, `typographic`, `editorial`, `horizontal-layout`).
3. Anote 5 a 8 sites novos com URL; **abra cada um no navegador embutido** em 1440 px e 390 px. Se for útil, rode `coletar.mjs` no acervo para guardar capturas e dados (ver `referencias-ui`).
4. Procure também **fora do nicho** a mesma necessidade (ex.: para uma joalheria, o hero de uma marca de relógios ou de uma galeria de arte).

### Recaptura em profundidade (obrigatória para as 3–6 referências escolhidas)
```bash
cd ~/Documents/acervos-design
node recapturar.mjs --slug bennett-and-clive --espera 12000 --pontos 5          # desktop 1440: hero + 4 pontos da rolagem
node recapturar.mjs --slug bennett-and-clive --largura 390 --pontos 4           # celular
node recapturar.mjs --url https://exemplo.com --nome ref-nova                    # site que não está no acervo
```
Espera o intro terminar (a página para de mudar) e grava `recaptura-d-1..N.jpg` (e `recaptura-m-*.jpg`) na pasta do site, sem sobrescrever nada. Abra as imagens em ordem: o que aparece depois do intro é o layout real (hero, ordem das seções, ritmo). Em 1 minuto por site, evita decidir olhando uma tela de carregamento.

## Camada 3 — Análise (o que realmente se aprende)
Abra as capturas de **3 a 6 sites** e preencha, para cada um, em poucas linhas (modelo em `brief.json > secoes`):
| Pergunta | O que registrar |
|---|---|
| Qual a **ideia** do site? | uma frase |
| Como é o **hero**? | tipo (título gigante, vídeo, 3D, imagem), onde está o título, o que se move |
| Como a página **se ordena**? | seções na ordem; onde está a prova e a chamada |
| Qual o **ritmo** do scroll? | revelações, seções fixadas, horizontal, parada para respirar |
| Quais **tokens**? | fontes, escala do título, paleta, raio, espaçamento (veja `dados.json`) |
| O que **não copiar** | layout inteiro, texto, imagens, fontes pagas, logo |
| O que **adaptar** | a técnica (ex.: "título por linhas com máscara"), não o resultado |

Depois escolha **1 referência por seção** do site novo (hero, manifesto, conteúdo, prova, chamada, rodapé) e registre no `brief.json` (`secoes[].referencia`), junto do componente da biblioteca (`biblioteca-componentes`) e do efeito (`elementos.md`).

## Regras
- Referência é **qualidade e técnica**, nunca molde: não reproduza layout, texto, imagem, logo, fonte paga ou código de nenhum site.
- Cite a fonte de cada decisão ("hero inspirado na técnica de X") no documento de design do projeto.
- Se achar um padrão que se repete entre 3 ou mais referências, é candidato a regra do projeto; se aparece em um só, é gosto.
- Pesquisa ao vivo abre páginas externas: use só leitura (sem login, sem formulários).

## Encaixe de layout (novo)
A sugestão de sites usa **toda a base** de sites válidos (`pesquisar-referencias.mjs --todos`) e soma até **6 pontos de encaixe de layout** (`scripts/layout.mjs`) ao ranking por assunto e recursos. Cada tipo de página tem um perfil de estrutura ideal:

| Perfil | Temas | Estrutura ideal |
|---|---|---|
| vitrine de produto | alimentação, beleza, moda, luxo, automotivo, infantil, e-commerce | 4–9 seções, pouco texto, muitas imagens, hero com mídia, seções fixadas |
| portfólio e galeria | portfólio, arte, arquitetura, agência | 3–9 seções, texto mínimo, 10+ imagens, rolagem horizontal ou fixada |
| produto digital | tecnologia, IA, fintech, educação | 6–13 seções, texto médio, seções fixadas |
| institucional | corporativo, saúde, sustentabilidade, imobiliário | 5–11 seções, mais texto |
| editorial | editorial | 5–16 seções, texto longo, hero de tipografia |
| evento e experiência | eventos, música, esportes, jogos, viagem | 3–9 seções, hero de mídia, muito movimento |

Use `--tipo vitrine|portfólio|saas|institucional|editorial|evento` para forçar o perfil. Sites ainda sem `estrutura.json` não ganham esses pontos e aparecem marcados "layout ainda não medido". Para medir os que faltam: `CONC=2 node extrair-estrutura.mjs` (retomável) e, ao terminar, `node scripts/gerar-padroes.mjs`.
