# 04 · Criatividade em software e tecnologia

Perguntas e padrões que geram soluções diferentes em arquitetura, produto, UX, dados, IA e depuração. Use junto com as técnicas gerais de `02-tecnicas-de-geracao.md`.

## Sumário
1. Perguntas que abrem o problema
2. Arquitetura e infraestrutura
3. Produto e funcionalidades
4. UX e interface
5. Dados e desempenho
6. IA: quando usar e quando não usar
7. Depuração criativa
8. Dívida técnica e legado
9. Cuidados profissionais

---

## 1. Perguntas que abrem o problema

- **E se não construirmos?** Existe serviço, biblioteca, planilha, formulário ou processo manual que resolve por enquanto?
- **E se removermos em vez de adicionar?** Menos campos, menos telas, menos opções, menos serviços.
- **E se mudarmos o problema de lugar?** Resolver no banco em vez do código, no processo em vez do sistema, antes do dado entrar em vez de depois.
- **E se fosse assíncrono?** O usuário precisa esperar por isso, ou pode receber depois?
- **E se fosse calculado antes?** Pré-processar, gerar estático, cachear.
- **E se o usuário fizesse uma parte?** Autoatendimento, configuração, curadoria.
- **E se reaproveitássemos o que já existe?** Componente, dado ou integração que já está no projeto.
- **Qual é a versão de 1 dia disto?** Ela costuma revelar o essencial.

## 2. Arquitetura e infraestrutura

| Situação | Ideias fora do óbvio |
|---|---|
| Sistema lento | cache no lugar certo (CDN, aplicação, banco); gerar páginas estáticas; mover trabalho pesado para filas; trocar tempo real por atualização periódica; desnormalizar uma leitura crítica |
| Custo alto de nuvem | desligar ambientes fora do horário; trocar sempre-ligado por sob demanda (serverless) ou o contrário, se o uso for constante; compactar e expirar dados; medir antes de otimizar |
| Picos de acesso | fila com processamento no ritmo possível; página de espera; pré-aquecimento antes de campanhas; degradação elegante (desligar o que não é essencial) |
| Integração instável | fila + retry com backoff; outbox; cache da última resposta boa; modo offline |
| Deploys com medo | feature flags; deploy gradual; testes nas rotas críticas; ambiente de preview por PR |
| "Precisamos de microsserviços" | monólito modular primeiro; extrair só o módulo com necessidade real de escala ou equipe separada |

## 3. Produto e funcionalidades

- **Resolver o trabalho, não a feature pedida** (`01-entender-o-problema.md`, jobs to be done).
- **Padrões inteligentes:** escolher bem o padrão elimina configuração para 80% dos usuários.
- **Fazer o caminho comum ficar trivial** e deixar o raro possível (atalhos, modo avançado).
- **Começar pelo "mágico mínimo":** a menor versão que entrega o momento "uau" (ex.: o primeiro relatório pronto em 1 minuto).
- **Recurso escondido no dado:** o sistema já tem dados que respondem perguntas que o usuário nem fez (ex.: "seus clientes compram mais às sextas").
- **Produto como serviço manual primeiro** ("Mágico de Oz"): uma pessoa faz manualmente nos bastidores o que o sistema faria, até a demanda provar que vale automatizar.

## 4. UX e interface

- **Eliminar etapas:** cada passo e cada campo removido aumenta a conclusão.
- **Preencher pelo usuário:** CEP → endereço; CNPJ → razão social; foto → leitura do documento (com consentimento).
- **Adiar perguntas:** peça só o necessário agora e o resto quando fizer sentido.
- **Mostrar em vez de explicar:** exemplos preenchidos, prévias ao vivo, estados vazios que ensinam.
- **Desfazer em vez de confirmar:** "Arquivado. Desfazer" é mais rápido e menos irritante que "Tem certeza?" (para ações reversíveis).
- **Feedback imediato:** atualização otimista da interface, com reversão se falhar.
- Para o lado visual, use a skill `melhoria-de-design`, se disponível.

## 5. Dados e desempenho

- **Mudar a pergunta:** em vez de calcular tudo, calcular só o que mudou (incremental).
- **Aproximação suficiente:** contagens aproximadas, amostragem e percentis estimados custam muito menos e bastam para muitos painéis.
- **Mover o cálculo para perto do dado:** agregação no banco em vez de trazer tudo para a aplicação.
- **Índice certo antes de mais servidor.**
- **Expirar o que não é usado:** dados antigos para armazenamento frio; logs com retenção.

## 6. IA: quando usar e quando não usar

Pergunte primeiro: **uma regra simples resolve?** Se sim, prefira a regra: mais barata, previsível e testável.

IA costuma ser uma boa ideia para:
- linguagem natural, classificação de texto livre, resumo, extração de dados de documentos;
- busca por significado (embeddings);
- rascunhos que uma pessoa revisa.

IA costuma ser uma má ideia para:
- cálculos exatos e regras de negócio determinísticas;
- decisões com consequência legal ou financeira sem revisão humana;
- qualquer coisa que precise ser sempre igual.

Ideias híbridas criativas:
- a IA classifica e a regra decide;
- a IA sugere e a pessoa aprova;
- a IA gera o teste e o humano valida;
- a IA extrai e o sistema valida com schema.

Ao propor IA, inclua custo por uso, latência, privacidade dos dados e plano para quando ela errar. A skill `prevencao-de-falhas` (AGT-01 a AGT-12) cobre os riscos.

## 7. Depuração criativa

Quando um bug resiste às abordagens normais:
- **Hipóteses múltiplas:** liste pelo menos 3 causas possíveis antes de testar qualquer uma; teste a mais barata de descartar primeiro.
- **Bisseção:** `git bisect` no histórico; desligar metade dos módulos, configurações ou dados até isolar.
- **Mudar uma coisa por vez** e anotar o resultado.
- **Inverter a pergunta:** em vez de "por que falha aqui?", "por que funciona ali?". Compare os dois ambientes, dados ou versões.
- **Reduzir ao mínimo:** monte o menor exemplo que reproduz o problema. Muitas vezes, ao reduzir, a causa aparece.
- **Explicar em voz alta** (pato de borracha): explicar linha a linha revela a suposição errada.
- **Desconfiar do "impossível":** cache, fuso horário, versão diferente em produção, variável de ambiente, dado sujo, concorrência.
- **Observar em vez de supor:** log temporário, debugger, inspeção da rede, consulta direta ao banco.

## 8. Dívida técnica e legado

- **Estrangular em vez de reescrever:** substitua partes do sistema antigo aos poucos, por trás de uma interface estável (strangler fig).
- **Testes de caracterização:** antes de mexer no legado, escreva testes que registram o comportamento atual, mesmo que estranho.
- **Investir onde dói:** refatore os arquivos que mais mudam e mais quebram, não os mais feios.
- **Apagar código** é uma das melhorias mais seguras e subestimadas.

## 9. Cuidados profissionais

- Toda ideia técnica ousada vem com **plano de reversão** e **um teste barato**.
- Não sacrifique segurança, privacidade ou acessibilidade por uma solução engenhosa.
- Prefira tecnologias que a equipe consegue manter. A solução brilhante que só uma pessoa entende vira risco.
- Antes de implementar, siga as regras de autorização do ambiente e do usuário.
