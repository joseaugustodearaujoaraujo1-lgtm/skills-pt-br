# Modelo e esforço por etapa

A nota de um site depende mais da **direção criativa** e do **juiz** do que da digitação do código. Gaste o modelo forte onde ele muda a nota e o modelo barato onde o trabalho é mecânico.

## O que o agente consegue saber (e o que não)

| Sabe | Não sabe |
|---|---|
| O próprio modelo, quando o ambiente informa (no Claude Code ele vem nas instruções da sessão; no terminal, `/model` mostra e troca) | O plano do usuário, quanto do limite já foi gasto e quais modelos a conta libera |
| Qual agente está rodando (Claude Code, Cursor, Codex…), pelas ferramentas e instruções que recebeu | O preço exato do momento |
| O modelo dos **subagentes** que ele mesmo cria (a ferramenta de subagente aceita escolher o modelo) | Trocar o modelo da sessão principal sozinho: **só o usuário troca** |

Se o ambiente não disser o modelo, **não adivinhe**: diga "não consigo ver qual modelo está ativo" e dê a recomendação assim mesmo.

## Na prática (obrigatório no passo 1)

1. Na primeira resposta, diga em uma linha o agente e o modelo em uso, se souber.
2. Diga qual modelo e esforço a próxima etapa pede (tabela abaixo) e, se for diferente do atual, como trocar: no Claude Code, `/model <nome>` (e `/effort` ou o seletor de esforço, quando existir); nos outros agentes, o seletor de modelo da interface.
3. Repita a sugestão **só quando a etapa muda de faixa** (ex.: do briefing para a direção criativa). Não interrompa o trabalho a cada passo.
4. Subagentes (juiz, teste cego, estudo de referência) você mesmo cria com o modelo da tabela.

## Tabela

Famílias Claude: **Opus** (mais forte e mais caro), **Sonnet** (equilíbrio), **Haiku** (rápido e barato). Os números de versão mudam; use o mais novo da família. Em outros provedores, troque pelo equivalente (o mais forte de raciocínio, o intermediário, o rápido).

| Etapa | Modelo | Esforço | Por quê |
|---|---|---|---|
| 1. Briefing, perguntas, `opcoes.mjs`, `montar-brief.mjs` | Sonnet | médio | Conversa e scripts prontos |
| 2. Direção criativa (`DIRECAO.md`), momento-assinatura, composição por seção | **Opus** | alto | É onde a nota de Criatividade e o 8 em Design nascem |
| 3. Estudo de referências (recaptura, escolher uma por seção) | Sonnet | médio | Olhar capturas e anotar |
| 4. Construção: estrutura, seções, starters e módulos | Sonnet | alto | Muito código, padrão conhecido |
| 4. Construção: 3D, shader, scroll avançado, réplica fiel | **Opus** | alto | Erros caros, exige raciocínio espacial |
| 5. Verificador e correções de FAIL | Sonnet (Haiku se forem só ajustes de texto/CSS) | médio | Mecânico |
| 5. Juiz (subagente limpo) | **Opus** | alto | Julgamento calibrado; modelo fraco dá nota generosa |
| 5. Correções pedidas pelo juiz | Sonnet; Opus se a correção mexe na ideia | alto | Depende do tamanho |
| 6. Entrega, relatório, `IMAGENS.md` | Sonnet ou Haiku | baixo | Texto |
| Teste cego da skill (agentes que constroem) | Sonnet | alto | Simula o usuário comum |
| Análise do acervo (classificar, fichas) | Haiku ou Sonnet | baixo | Volume, pouca decisão |

## Custo (para avisar o usuário)

- Um site completo costuma gastar mais na construção (volume) do que na direção (poucas mensagens, mas decisivas). Usar Opus **só** na direção e no juiz dá quase toda a qualidade por uma fração do custo.
- Se o usuário disser que está perto do limite, proponha: Sonnet em tudo, Opus apenas no juiz final.
