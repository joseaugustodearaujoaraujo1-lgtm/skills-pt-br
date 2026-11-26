<div align="center">

# 🧰 Skills em português para agentes de código

**Sete skills para Claude Code (e agentes compatíveis) que transformam o assistente em um parceiro mais cuidadoso, mais criativo, capaz de criar prompts a partir do que você quer, capaz de criar sites com design nível Awwwards (com 10 estilos visuais e paletas para escolher), e capaz de levar um MVP do requisito à produção com atenção à lei.**

![Skills](https://img.shields.io/badge/skills-7-6366F1?style=for-the-badge)
![Idioma](https://img.shields.io/badge/idioma-pt--BR-009C3B?style=for-the-badge)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-black?style=for-the-badge)

</div>

---

## Por que existem

Agentes de código escrevem rápido, mas repetem erros previsíveis: falhas de segurança, interfaces com "cara de IA", soluções óbvias para problemas que pedem outro olhar, projetos lançados sem escopo, sem documentação, sem teste de carga e sem olhar para a lei. Cada skill abaixo guia o agente por um método com **checklists, exemplos de código e IDs estáveis**, em vez de depender de sorte.

| Skill | Para quê | Tamanho |
|---|---|---|
| [`seguranca-completa`](seguranca-completa/SKILL.md) | Evitar, detectar e corrigir falhas de software: código gerado por IA, front-end, APIs, pagamentos, agentes/LLMs e infraestrutura | 92 falhas catalogadas |
| [`site-premium-ux-ui`](site-premium-ux-ui/SKILL.md) | Cria sites do zero com design, identidade e movimento nível Awwwards / One Page Love: sugere referências de um acervo de sites premiados (que você monta com os scripts da skill), estilos, paletas, componentes das plataformas, projeto-base HTML+GSAP ou Next.js+GSAP, e um verificador automático | Fluxo de 6 passos, 10 estilos, 2 projetos-base, 6 módulos, verificador e juiz. [Leia o README da skill](site-premium-ux-ui/README.md) |
| [`criatividade`](criatividade/SKILL.md) | Gerar ideias fora da caixa com método e entregar soluções viáveis | 5 fases, 3 intensidades |
| [`mvp-completo`](mvp-completo/SKILL.md) | Conduzir qualquer MVP do requisito ao teste de carga, com portões de aprovação entre as etapas | 7 etapas, 8 referências |
| [`judicial-sistema`](judicial-sistema/SKILL.md) | Transformar a lei brasileira em requisitos e documentos para reduzir o risco de processos e multas | 8 áreas jurídicas, 10 referências |
| [`velocidade-sistema`](velocidade-sistema/SKILL.md) | Auditar e otimizar a velocidade de sites e apps web (front-end, API, banco, infra) com um checklist priorizado | 31 técnicas, 4 áreas + medição |
| [`prompt-creator`](prompt-creator/SKILL.md) | Criar, melhorar e revisar prompts, entrevistando o usuário antes de escrever | 7 passos, 3 referências |

## 🛡️ seguranca-completa

Um atlas de **92 falhas reais** com identificador estável (`IA-01`, `FE-05`, `API-07`, `FIN-03`, `AGT-02`, `OPS-04`…), cada uma com sintoma, causa, como corrigir e como evitar.

- **Áreas:** código gerado por IA, front-end, back-end e APIs (alinhado ao OWASP API Top 10 2023), pagamentos e dinheiro, agentes e LLMs (OWASP LLM 2025, "lethal trifecta"), infraestrutura e **LGPD e privacidade**.
- **Linguagens:** guias para JavaScript/TypeScript, Python, Java/Kotlin, C#/.NET, Go, PHP e SQL.
- **Modos de uso:** de uma checagem rápida até uma auditoria completa, com relatório e plano de correção.
- Inclui `checklist-pre-deploy.md` e `casos-reais.md`.

## 🎨 site-premium-ux-ui

Substitui e reúne as antigas `design-completo` e `estilos-paletas-design` em **uma skill só**, que conduz o site do briefing ao portão de qualidade **com o usuário escolhendo** as decisões de gosto.

- **Perguntas primeiro:** objetivo, público, 3 adjetivos, o que não quer parecer, material disponível e stack (só **HTML + CSS + JS + GSAP** ou **Next.js + GSAP**).
- **Escolhas em opções:** 3 estilos entre 10 (+ o recomendado); **3 paletas para o tema escuro e 3 para o claro** (OKLCH, contraste AA/AAA conferido por script); **5 opções de site de referência**: A, B e C (sites nível Awwwards ou One Page Love), **D** campo livre (o usuário sugere e a skill pesquisa de novo) e **E** a recomendada, com justificativa.
- **Todo o conteúdo das duas skills antigas** em `references/base-design-completo/` (diagnóstico com rubrica de 10 dimensões, tipografia, cor, layout, componentes, motion, conversão, "cara de IA", implementação em CSS puro, Tailwind e React) e `references/base-estilos/` (os 10 estilos com tokens e componentes).
- **Plataformas** com preço, licença e limites verificados: [tasteskill.dev](https://tasteskill.dev), [transitions.dev](https://transitions.dev), [reactbits.dev](https://reactbits.dev), [naocodei.com](https://naocodei.com) e [pinstack.app](https://pinstack.app) (sem login nem compra pelo agente).
- **Receitas de construção:** tipografia, scroll (GSAP + ScrollTrigger + SplitText + Lenis), imagem, vídeo e **3D real em WebGL** (three.js com material PBR, ambiente HDRI e sombras; imagem recortada não conta como 3D).
- **Portões de aprovação do 3D** (`references/aprovacoes.md`): a skill **pede imagens de referência do elemento** ao usuário sempre que o objeto existe (dispensa só para elementos inventados, como um personagem de história), gera o **molde ultrarrealista de 4 vistas** e pergunta se ficou bom ou precisa alterar; depois gera um **vídeo-prévia de como o site vai ficar** e pergunta de novo. Só constrói com as duas aprovações. Marcas de terceiros vistas nas referências não vão para o molde nem para o site.
- **Site de referência como molde:** reproduz de perto a estrutura, o ritmo do scroll e o motion de um site premiado escolhido, sem copiar texto, imagens, logo, fontes pagas ou código.
- **Acervo local opcional:** os scripts de pesquisa leem um acervo de capturas em `~/Documents/acervos-design/acervo` (ou `ACERVO=<pasta>`). Sem ele, a skill segue com pesquisa ao vivo no Awwwards e One Page Love.
- **Portão de qualidade:** notas no estilo Awwwards com evidência, Lighthouse, contraste, 1440/768/390 px e `prefers-reduced-motion`.
- Scripts Node sem dependências: `opcoes.mjs`, `gerar-paleta.mjs`, `escolher-estilo.mjs`, `montar-brief.mjs`, `baixar-fontes.mjs`.

## 💡 criatividade

Separa **gerar ideias** (com liberdade) de **julgar** (com critério).

1. **Entender** o problema certo (5 porquês, "Como poderíamos…?").
2. **Divergir** com técnicas (SCAMPER, analogias, inversão, restrições artificiais, TRIZ…).
3. **Convergir** com critérios, matriz impacto × esforço e decisões reversíveis vs. irreversíveis.
4. **Testar** com pré-mortem e o menor experimento possível.
5. **Entregar** um leque: opção **segura**, **ousada** e **fora da caixa**, com recomendação e primeiro passo.

Veja o [exemplo completo](criatividade/references/exemplo-completo.md), um caso resolvido do começo ao fim.

## 🚀 mvp-completo

Conduz **qualquer MVP** (loja virtual, SaaS, API, site com painel) em **sete etapas**, cada uma com entradas, atividades, entregáveis, critério de pronto e **portão de aprovação**: o agente só avança com a confirmação do usuário, e ações externas (deploy, DNS, tráfego de teste) exigem confirmação específica.

| # | Etapa | Entregável principal |
|---|---|---|
| 1 | Requisitos, segurança e questões jurídicas | Escopo MoSCoW, RF/RNF com números, inventário de dados, modelagem de ameaças (STRIDE) e matriz jurídica |
| 2 | Design do sistema | Arquitetura, modelo de dados, **logo futurista e ativos-chave (ícones, 3D, motions) aprovados antes do layout**, design system claro/escuro com contraste AA, storyboard de scrollytelling com GSAP e briefs de mídia |
| 3 | API segura | Estrutura MVC + Service Layer, mapa OWASP API Top 10 (2023) com testes, bcrypt, JWT, validação, rate limit e endpoints da LGPD |
| 4 | Otimização de velocidade | `docs/04-performance.md` com métricas antes/depois e o checklist de 31 técnicas da skill `velocidade-sistema` |
| 5 | Documentação da API | OpenAPI 3.1, guia de uso, catálogo de erros, lint da spec e testes de contrato |
| 6 | Deploy e DNS no Cloudflare | Pré-voo, CI/CD, troca segura de DNS (TTL, exportação, rollback), SSL Full (strict), DNSSEC, WAF, rate limit e headers de segurança |
| 7 | Teste de carga com k6 | Cenários smoke, load, stress, spike e soak, thresholds, script-base e relatório de capacidade |

- **Prompts de mídia com IA** (`media-prompts.md`): estrutura de prompt para imagens e vídeos ultrarrealistas, com comandos de realismo, exemplo completo e **compressão com ffmpeg para vídeos abaixo de ~1,4 MB**.
- **Credenciais:** nunca pede nem aceita senhas, tokens ou chaves no chat; o usuário cria tokens com escopo mínimo e os guarda em variáveis de ambiente.
- Diferencia sempre o que foi *planejado*, *aprovado*, *implementado*, *testado* e *publicado*.
- Funciona sozinha e se integra com `judicial-sistema` (Etapas 1 e 6), `seguranca-completa` (Etapa 3) e `velocidade-sistema` (Etapa 4).

## ⚖️ judicial-sistema

Traduz a **legislação brasileira** em requisitos técnicos, documentos e checklists, para construir sistemas que reduzam o risco de processos, multas e danos a usuários.

- **Áreas cobertas:**
  - **LGPD:** bases legais, direitos do titular, incidentes, dados de crianças, sanções.
  - **CDC e e-commerce:** informações obrigatórias, arrependimento de 7 dias, garantia, SAC.
  - **Marco Civil:** guarda de registros por 6 meses e responsabilidade por conteúdo de terceiros.
  - **Propriedade intelectual:** licenças open source, fontes, imagens, marcas e conteúdo de IA.
  - **Pagamentos e fiscal:** PCI DSS, Pix, nota fiscal e antifraude.
  - **Crimes cibernéticos e testes autorizados:** inclui k6 e testes de segurança.
  - **Contratos do desenvolvedor:** cessão de código, DPA, SLA e limites de responsabilidade.
  - **Acessibilidade, cookies, marketing, ECA Digital e IA.**
- **Entregas:** matriz jurídica, relatório de conformidade com severidade, `checklist-pre-lancamento.md` com itens críticos que bloqueiam o lançamento e `templates-documentos.md` (política de privacidade, termos, cookies, ROPA, RIPD, plano de incidentes e DPA).
- **Honestidade:** não é aconselhamento jurídico e não garante ausência de processos; indica quando procurar advogado(a) ou contador(a) e manda confirmar a vigência de normas recentes.

## ⚡ velocidade-sistema

Audita e otimiza a **performance** de um site ou app web seguindo um checklist de **31 técnicas**, sempre medindo antes e depois.

- **Método:** entender a stack, medir a linha de base (LCP, INP, CLS, TTFB, bundle), auditar com status por item (feito, parcial, falta, não se aplica), priorizar por impacto ÷ esforço, implementar em passos pequenos e entregar um relatório curto.
- **Áreas do checklist:** interface e carregamento (skeleton, WebP/AVIF, lazy load, SSR/SSG, code splitting, fontes, cache), API e back-end (paginação, paralelismo, timeouts, filas, Brotli/GZIP, Redis), banco de dados (N+1, índices, pool de conexões), infraestrutura (CDN, região, balanceamento) e medição (OpenTelemetry, RUM, testes em redes e celulares lentos).
- **Honestidade:** não marca um item como feito sem mostrar o arquivo ou trecho onde isso aparece.

## ✍️ prompt-creator

Descobre **o que a pessoa quer fazer** antes de escrever qualquer prompt.

1. **Escutar** e resumir o pedido.
2. **Entrevistar** em rodadas de até 3 perguntas, com opções e recomendação, aprofundando respostas vagas.
3. **Confirmar** o entendimento, com critérios de pronto verificáveis.
4. **Escrever** o prompt, usando só as seções necessárias.
5. **Revisar** com checklist.
6. **Testar** em contexto limpo, somente com autorização.
7. **Entregar e ajustar** com base no retorno.

As perguntas só são puladas se o usuário pedir; nesse caso, as suposições ficam visíveis.

## Como instalar

Copie a pasta da skill desejada para o diretório de skills do seu agente. No Claude Code:

```bash
git clone https://github.com/joseaugustodearaujoaraujo1-lgtm/skills-pt-br.git
cp -r skills-pt-br/seguranca-completa ~/.claude/skills/
cp -r skills-pt-br/site-premium-ux-ui ~/.claude/skills/
cp -r skills-pt-br/criatividade ~/.claude/skills/
cp -r skills-pt-br/mvp-completo ~/.claude/skills/
cp -r skills-pt-br/judicial-sistema ~/.claude/skills/
cp -r skills-pt-br/prompt-creator ~/.claude/skills/
```

No Windows (PowerShell), o destino é `$HOME\.claude\skills\`. Reinicie a sessão do agente e a skill passa a ser sugerida quando a tarefa combinar com a descrição dela.

## Estrutura

```text
skills-pt-br/
├── seguranca-completa/       # SKILL.md + references/ (por área e por linguagem)
├── site-premium-ux-ui/    # SKILL.md + scripts/ + references/ (incl. base-design-completo/ e base-estilos/)
├── criatividade/     # SKILL.md + references/ (técnicas, exemplo, modelos)
├── mvp-completo/   # SKILL.md + references/ (uma por etapa + media-prompts)
├── judicial-sistema/   # SKILL.md + references/ (por área jurídica + checklist + templates)
├── velocidade-sistema/  # SKILL.md (checklist de 31 técnicas de performance)
└── prompt-creator/  # SKILL.md + references/ (perguntas, modelos, checklist) + evals/
```

Cada skill segue o mesmo formato: `SKILL.md` curto com o essencial e a pasta `references/` carregada **sob demanda**, para gastar poucos tokens.

## Status e limitações

- Os exemplos de código em JavaScript e Python tiveram a **sintaxe validada**; os exemplos em Java, C#, Go e PHP **não foram compilados**.
- Os exemplos de Tailwind e React não foram executados em um projeto real.
- Os exemplos de `mvp-completo` (Express, GSAP, OpenAPI, k6, ffmpeg e Cloudflare) **não foram executados nem testados em um projeto real**; confira versões e flags antes de usar.
- Em `judicial-sistema`, os textos legais são resumos educativos escritos de memória, **sem verificação linha a linha nas fontes oficiais**, e **não substituem assessoria jurídica**. Confirme a vigência de normas recentes (ECA Digital, regulação de IA, responsabilidade de plataformas no art. 19 do Marco Civil, prazos da ANPD).
- Em `site-premium-ux-ui`, as paletas geradas por script têm contraste **medido**; as cores dos guias de estilo marcadas como *(aprox.)* ou *(derivado)* continuam estimativas. Os scripts de pesquisa (`pesquisar-referencias.mjs`, `opcoes.mjs`, `gerar-padroes.mjs`) usam o acervo local de capturas (defina `ACERVO` com a pasta; os scripts para montá-lo estão em `scripts/acervo/`). Sem ele, usam o índice destilado de 139 sites premiados que vai no repositório, e a pesquisa ao vivo descrita na skill complementa. Preços das plataformas verificados em novembro de 2026.
- As skills ainda **não passaram por avaliação formal de comportamento** (evals).
- Em `prompt-creator`, há 3 casos de teste em `evals/evals.json` que **ainda não foram executados**.
- Links de galerias de referência não foram abertos individualmente.

Sugestões e correções são bem-vindas via issues.

## Licença

[MIT](LICENSE) © José Augusto Araujo de Faria
