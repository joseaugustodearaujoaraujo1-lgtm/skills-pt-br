# 08 · Evitando a "cara de site feito por IA"

Ferramentas de geração de interface tendem a produzir os mesmos padrões. Eles não são errados em si, mas, repetidos em milhares de sites, deixam a página genérica e com cara de modelo. A pessoa percebe, mesmo sem saber explicar. Se o usuário pedir explicitamente um desses estilos, siga o pedido.

## Sumário
1. Sinais mais comuns
2. Como dar identidade
3. Exercício rápido

---

## 1. Sinais mais comuns

**Cor e fundo**
- Gradiente roxo-azul (ou roxo-rosa) no hero, sobre fundo branco.
- Fundo quase preto com um único acento neon (verde-ácido, ciano, magenta).
- Bege-creme (`#F4F1EA`) com título serifado e acento terracota, como "elegância" padrão.
- Texto com gradiente em todos os títulos.
- Blobs desfocados coloridos e "orbs" flutuando no fundo.
- Glassmorphism (vidro fosco) em todos os cards.

**Tipografia e layout**
- Inter ou Space Grotesk em tudo, sem outra decisão tipográfica.
- Tudo centralizado: hero, seções, textos, cards.
- Seções em sequência idêntica: título centralizado + subtítulo + 3 cards.
- Sobretítulos numerados ("01 / 02 / 03") sem que o conteúdo seja uma sequência.
- Hero com `100vh`, título enorme e quase nenhum conteúdo.

**Componentes e detalhes**
- `rounded-2xl` + sombra grande em absolutamente tudo.
- Cards com uma barra colorida na lateral ou no topo.
- Emojis ou ícones genéricos (✨, 🚀, ⚡) como marcadores de seção.
- Badges "Novo" ou "IA" em todo lugar.
- Dashboards falsos e gráficos decorativos sem dados reais.
- Fotos de banco de imagem (aperto de mãos, pessoas sorrindo para o notebook).
- Depoimentos de "João Silva, CEO" sem foto nem empresa.

**Texto**
- "Revolucione seu negócio", "Eleve sua experiência", "Desbloqueie seu potencial".
- Frases com a estrutura "Não é só X, é Y".
- Listas de três adjetivos ("Rápido. Seguro. Inteligente.").

## 2. Como dar identidade

**Comece pelo mundo do assunto.** Pergunte: o que só este negócio teria? Materiais, ferramentas, vocabulário, documentos, lugares, unidades de medida. Exemplos:
- **Padaria artesanal:** textura de papel kraft, fotos reais da fornada com luz quente, horário da fornada em destaque, tipografia com calor manual.
- **Escritório de contabilidade:** grid rigoroso, números tabulares, tabelas reais de prazos fiscais, uma serifa sóbria e muito espaço.
- **Oficina mecânica:** fotos reais da equipe trabalhando, preços de serviços em lista clara, tipografia condensada e robusta, cores da fachada.
- **Portfólio de dev:** prints e trechos de código reais dos projetos, métricas de resultado, uma mono como terceira voz tipográfica.

**Tome uma decisão ousada e mantenha o resto calmo.** Escolha uma: uma tipografia marcante nos títulos, uma cor inesperada mas coerente, um layout assimétrico, um elemento gráfico recorrente (moldura, linha, carimbo, grade). Um ponto de ousadia com tudo ao redor sóbrio parece intencional; vários pontos competindo parecem bagunça.

**Use conteúdo real como design:**
- fotos do lugar, da equipe e do produto;
- prints do sistema;
- números verdadeiros;
- citações reais de clientes.

Isso diferencia mais do que qualquer efeito.

**Escolha neutros e fontes com intenção:**
- cinzas inclinados para o matiz da marca (`03-cor-e-contraste.md`);
- um par tipográfico que combine com o tom (`02-tipografia.md`), e não a fonte padrão do framework.

**Varie a composição:** alterne layouts entre seções, use assimetria, deixe um elemento dominante por seção (`04-layout-e-espaco.md`).

**Estrutura que significa algo:** numere só o que é sequência; use sobretítulos só quando ajudam a navegar; cada borda, fundo e sombra precisa marcar um papel (separar, agrupar, destacar), não decorar.

**Detalhe característico:** inclua pelo menos um detalhe que só esse assunto teria, como conteúdo e não como enfeite. Exemplos: a unidade real (kg, m², sessões, horas), a convenção do ramo (número de registro profissional, tabela de horários), o termo técnico que o cliente reconhece.

## 3. Exercício rápido

Antes de propor uma direção visual, responda:
1. Se eu tirar o logo, alguém reconhece de quem é este site? Se não, falta identidade.
2. Qual é a **única** decisão visual marcante desta página?
3. Que conteúdo real (foto, número, documento) posso usar no lugar de um enfeite?
4. Esta seção poderia estar em qualquer outro site? Se sim, o que a torna específica?
5. Quais dos sinais da seção 1 estão presentes, e foram escolha consciente ou padrão?
