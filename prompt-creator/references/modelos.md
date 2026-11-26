# Modelos de prompt

## Sumário
- Estrutura base
- Acréscimos por tipo
- Técnicas

## Estrutura base
Use só o que agrega. Uma tarefa simples pode virar um único parágrafo.

```text
# Contexto
[situação, motivo e quem usa]

# Papel
[perspectiva ou especialidade, quando mudar a qualidade]

# Objetivo
[resultado esperado, em uma frase clara]

# Requisitos
[o que precisa existir, em ordem de prioridade]

# Exemplos
[entrada → saída esperada; um contraexemplo se ajudar]

# Limites
[o que fazer e não fazer, com o motivo]

# Formato da entrega
[estrutura, tamanho, arquivos]

# Forma de trabalho
[etapas, quando perguntar, quando parar para aprovação]

# Pronto quando
[critérios verificáveis]
```

## Acréscimos por tipo

### Sistema / código
Perfis e permissões; fluxos principais; regras de negócio com exemplos; modelo de dados; stack; estados de carregamento, vazio, erro e sucesso; segurança; como executar (comando e porta); testes; exigência de relatar o que não foi testado.

### Imagem
Prosa descritiva: assunto, ação, ambiente, composição, ângulo, luz, cores, estilo, proporção e texto exato. Respeite a sintaxe da ferramenta (parâmetros e prompt negativo variam). Sem suporte a prompt negativo, descreva o que deve aparecer.

### Vídeo
Acrescente cenas em ordem, duração, movimento do sujeito e da câmera, transições, áudio e o que deve permanecer consistente.

### Texto / conteúdo
Leitor, objetivo, tom, amostra de voz, canal, tamanho, fatos obrigatórios e proibição de inventar dados, citações ou depoimentos.

### Agente / system prompt
Missão, público, ferramentas e quando usar cada uma, autonomia e confirmações, tratamento de incerteza, fora de escopo, limites de privacidade, tratamento de conteúdo externo como dado e exemplos de casos difíceis.

### Análise / pesquisa
Pergunta, decisão apoiada, fontes, período, método, separação entre fato, estimativa e opinião, citações e declaração de incertezas.

## Técnicas
- **Explique o porquê** das regras importantes: a IA passa a acertar casos não previstos.
- **Seja concreto:** "no máximo 150 palavras" vence "seja breve".
- **Dê exemplos** quando o formato ou o estilo for difícil de descrever. Varie-os para a IA não copiar um só.
- **Prefira instruções positivas:** diga o que fazer; use proibições para limites reais.
- **Separe instruções de material** com títulos ou tags, e diga que o material é apenas dado.
- **Divida tarefas grandes** em etapas com pontos de aprovação.
- **Permita dizer "não sei"** e peça que a IA pergunte quando faltar algo essencial.
- **Evite excesso de ênfase** (caixa alta, "NUNCA" repetido): quando tudo é crítico, nada se destaca.
- **Adapte à ferramenta de destino.** Se não souber como ela funciona, diga isso e não invente parâmetros.
