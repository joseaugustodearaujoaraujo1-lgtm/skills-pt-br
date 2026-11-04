<div align="center">

# 🧰 Skills em português para agentes de código

**Sete skills para Claude Code (e agentes compatíveis) que transformam o assistente em um parceiro mais cuidadoso, mais criativo, com melhor senso de design e um catálogo de 10 estilos visuais, e capaz de levar um MVP do requisito à produção com atenção à lei.**

![Skills](https://img.shields.io/badge/skills-7-6366F1?style=for-the-badge)
![Idioma](https://img.shields.io/badge/idioma-pt--BR-009C3B?style=for-the-badge)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-black?style=for-the-badge)

</div>

---

## Por que existem

Agentes de código escrevem rápido, mas repetem erros previsíveis: falhas de segurança, interfaces com "cara de IA", soluções óbvias para problemas que pedem outro olhar, projetos lançados sem escopo, sem documentação, sem teste de carga e sem olhar para a lei. Cada skill abaixo guia o agente por um método com **checklists, exemplos de código e IDs estáveis**, em vez de depender de sorte.

| Skill | Para quê | Tamanho |
|---|---|---|
| [`prevencao-de-falhas`](prevencao-de-falhas/SKILL.md) | Evitar, detectar e corrigir falhas de software: código gerado por IA, front-end, APIs, pagamentos, agentes/LLMs e infraestrutura | 92 falhas catalogadas |
| [`melhoria-de-design`](melhoria-de-design/SKILL.md) | Melhorar o design de sites existentes: tipografia, cor, layout, componentes, motion e conversão | 3 níveis (ajuste fino, repaginação, redesign) |
| [`criatividade-aplicada`](criatividade-aplicada/SKILL.md) | Gerar ideias fora da caixa com método e entregar soluções viáveis | 5 fases, 3 intensidades |
| [`mvp-end-to-end-delivery`](mvp-end-to-end-delivery/SKILL.md) | Conduzir qualquer MVP do requisito ao teste de carga, com portões de aprovação entre as etapas | 7 etapas, 8 referências |
| [`dev-legal-compliance-br`](dev-legal-compliance-br/SKILL.md) | Transformar a lei brasileira em requisitos e documentos para reduzir o risco de processos e multas | 8 áreas jurídicas, 10 referências |
| [`estilos-de-design`](estilos-de-design/SKILL.md) | Escolher, descrever e aplicar estilos visuais de interface com paleta, tipografia, componentes, tokens CSS e acessibilidade | 10 estilos, 1 guia por estilo |
| [`omelhorar-otmizacao-site`](omelhorar-otmizacao-site/SKILL.md) | Auditar e otimizar a velocidade de sites e apps web (front-end, API, banco, infra) com um checklist priorizado | 31 técnicas, 4 áreas + medição |

## 🛡️ prevencao-de-falhas

Um atlas de **92 falhas reais** com identificador estável (`IA-01`, `FE-05`, `API-07`, `FIN-03`, `AGT-02`, `OPS-04`…), cada uma com sintoma, causa, como corrigir e como evitar.

- **Áreas:** código gerado por IA, front-end, back-end e APIs (alinhado ao OWASP API Top 10 2023), pagamentos e dinheiro, agentes e LLMs (OWASP LLM 2025, "lethal trifecta"), infraestrutura e **LGPD e privacidade**.
- **Linguagens:** guias para JavaScript/TypeScript, Python, Java/Kotlin, C#/.NET, Go, PHP e SQL.
- **Modos de uso:** de uma checagem rápida até uma auditoria completa, com relatório e plano de correção.
- Inclui `checklist-pre-deploy.md` e `casos-reais.md`.

## 🎨 melhoria-de-design

Um processo de seis passos para diagnosticar e melhorar o visual de um site **sem reinventar o que já funciona**.

- **Diagnóstico** com rubrica de 10 dimensões e testes rápidos.
- **Referências** de tipografia (escala com `clamp()`), cor em OKLCH e contraste WCAG AA, layout, componentes e motion (respeitando `prefers-reduced-motion`).
- **Implementação** em CSS puro, Tailwind e React.
- Capítulo dedicado a **evitar a "cara de IA"** e outro a **conversão**.
- Catálogo de efeitos de movimento baseado no site [naocodei.com](https://naocodei.com) (crédito a Não Codei; o catálogo é um índice de referência, não redistribui o código do site).

## 💡 criatividade-aplicada

Separa **gerar ideias** (com liberdade) de **julgar** (com critério).

1. **Entender** o problema certo (5 porquês, "Como poderíamos…?").
2. **Divergir** com técnicas (SCAMPER, analogias, inversão, restrições artificiais, TRIZ…).
3. **Convergir** com critérios, matriz impacto × esforço e decisões reversíveis vs. irreversíveis.
4. **Testar** com pré-mortem e o menor experimento possível.
5. **Entregar** um leque: opção **segura**, **ousada** e **fora da caixa**, com recomendação e primeiro passo.

Veja o [exemplo completo](criatividade-aplicada/references/exemplo-completo.md), um caso resolvido do começo ao fim.

## 🚀 mvp-end-to-end-delivery

Conduz **qualquer MVP** (loja virtual, SaaS, API, site com painel) em **sete etapas**, cada uma com entradas, atividades, entregáveis, critério de pronto e **portão de aprovação**: o agente só avança com a confirmação do usuário, e ações externas (deploy, DNS, tráfego de teste) exigem confirmação específica.

| # | Etapa | Entregável principal |
|---|---|---|
| 1 | Requisitos, segurança e questões jurídicas | Escopo MoSCoW, RF/RNF com números, inventário de dados, modelagem de ameaças (STRIDE) e matriz jurídica |
| 2 | Design do sistema | Arquitetura, modelo de dados, design system claro/escuro com contraste AA, storyboard de scrollytelling com GSAP e briefs de mídia |
| 3 | API segura | Estrutura MVC + Service Layer, mapa OWASP API Top 10 (2023) com testes, bcrypt, JWT, validação, rate limit e endpoints da LGPD |
| 4 | Otimização de velocidade | `docs/04-performance.md` com métricas antes/depois e o checklist de 31 técnicas da skill `omelhorar-otmizacao-site` |
| 5 | Documentação da API | OpenAPI 3.1, guia de uso, catálogo de erros, lint da spec e testes de contrato |
| 6 | Deploy e DNS no Cloudflare | Pré-voo, CI/CD, troca segura de DNS (TTL, exportação, rollback), SSL Full (strict), DNSSEC, WAF, rate limit e headers de segurança |
| 7 | Teste de carga com k6 | Cenários smoke, load, stress, spike e soak, thresholds, script-base e relatório de capacidade |

- **Prompts de mídia com IA** (`media-prompts.md`): estrutura de prompt para imagens e vídeos ultrarrealistas, com comandos de realismo, exemplo completo e **compressão com ffmpeg para vídeos abaixo de ~1,4 MB**.
- **Credenciais:** nunca pede nem aceita senhas, tokens ou chaves no chat; o usuário cria tokens com escopo mínimo e os guarda em variáveis de ambiente.
- Diferencia sempre o que foi *planejado*, *aprovado*, *implementado*, *testado* e *publicado*.
- Funciona sozinha e se integra com `dev-legal-compliance-br` (Etapas 1 e 6), `prevencao-de-falhas` (Etapa 3) e `omelhorar-otmizacao-site` (Etapa 4).

## ⚖️ dev-legal-compliance-br

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

## 🎭 estilos-de-design

Um catálogo de **10 estilos de interface**, cada um descrito em um arquivo próprio e carregado **sob demanda** (a skill só lê o estilo escolhido, para gastar poucos tokens).

| Estilo | Em uma frase |
|---|---|
| **Neomorphism** | Material único cinza-azulado com relevo e rebaixo por duas sombras opostas |
| **Minimalism** | Marfim quente, verde-sálvia, tipografia fina e muito respiro |
| **Brutalism** | Papel, tinta e verde-lima ácido, raio 0, bordas pretas e sombra dura |
| **Glassmorphism** | Vidro fosco translúcido sobre fundo colorido, com glow azul |
| **Claymorphism** | Argila inflada em creme, preto e dourado, com raios enormes |
| **Bento Grid** | Mosaico modular de cards de tamanhos variados com um acento laranja |
| **Pixel Art** | Interface 8-bit: grade de pixels, bevel, cantos em degrau e dither |
| **Typography Luxury** | Preto profundo, dourado metálico e serifa Playfair |
| **Dark Mode** | Tema escuro premium com elevação por luminosidade |
| **Cyberpunk** | Neon ciano e magenta, cantos chanfrados, HUD e glitch |

- **Cada guia tem 12 ou 13 seções:** essência, quando usar e evitar, paleta com hex, tipografia, grade e raios, sombras e profundidade, ícones, **todos os componentes** (botões, formulários, navegação, cards, tabelas, gráficos, feedback), motion, tokens e receitas em CSS, acessibilidade, erros comuns e compatibilidade com os outros estilos.
- **No `SKILL.md`:** tabela de escolha rápida por necessidade, comparativo de tokens, matriz de compatibilidade e o passo a passo para montar um **seletor de temas** com vários estilos no mesmo site (tokens por `data-style`, overrides estruturais, fallbacks e `prefers-reduced-motion`).
- **Origem:** 8 estilos foram descritos a partir de pranchas de referência (3 por estilo, geradas por IA). **Dark mode e cyberpunk não tinham pranchas**: seus guias foram escritos por boas práticas e convenções do gênero e devem ser tratados como propostas.
- Combina com `melhoria-de-design` (diagnóstico e níveis de intervenção).

## ⚡ omelhorar-otmizacao-site

Audita e otimiza a **performance** de um site ou app web seguindo um checklist de **31 técnicas**, sempre medindo antes e depois.

- **Método:** entender a stack, medir a linha de base (LCP, INP, CLS, TTFB, bundle), auditar com status por item (feito, parcial, falta, não se aplica), priorizar por impacto ÷ esforço, implementar em passos pequenos e entregar um relatório curto.
- **Áreas do checklist:** interface e carregamento (skeleton, WebP/AVIF, lazy load, SSR/SSG, code splitting, fontes, cache), API e back-end (paginação, paralelismo, timeouts, filas, Brotli/GZIP, Redis), banco de dados (N+1, índices, pool de conexões), infraestrutura (CDN, região, balanceamento) e medição (OpenTelemetry, RUM, testes em redes e celulares lentos).
- **Honestidade:** não marca um item como feito sem mostrar o arquivo ou trecho onde isso aparece.

## Como instalar

Copie a pasta da skill desejada para o diretório de skills do seu agente. No Claude Code:

```bash
git clone https://github.com/joseaugustodearaujoaraujo1-lgtm/skills-pt-br.git
cp -r skills-pt-br/prevencao-de-falhas ~/.claude/skills/
cp -r skills-pt-br/melhoria-de-design ~/.claude/skills/
cp -r skills-pt-br/criatividade-aplicada ~/.claude/skills/
cp -r skills-pt-br/mvp-end-to-end-delivery ~/.claude/skills/
cp -r skills-pt-br/dev-legal-compliance-br ~/.claude/skills/
cp -r skills-pt-br/estilos-de-design ~/.claude/skills/
```

No Windows (PowerShell), o destino é `$HOME\.claude\skills\`. Reinicie a sessão do agente e a skill passa a ser sugerida quando a tarefa combinar com a descrição dela.

## Estrutura

```text
skills-pt-br/
├── prevencao-de-falhas/       # SKILL.md + references/ (por área e por linguagem)
├── melhoria-de-design/        # SKILL.md + references/ (incl. implementacao/)
├── criatividade-aplicada/     # SKILL.md + references/ (técnicas, exemplo, modelos)
├── mvp-end-to-end-delivery/   # SKILL.md + references/ (uma por etapa + media-prompts)
├── dev-legal-compliance-br/   # SKILL.md + references/ (por área jurídica + checklist + templates)
├── estilos-de-design/         # SKILL.md + references/ (um guia por estilo de interface)
└── omelhorar-otmizacao-site/  # SKILL.md (checklist de 31 técnicas de performance)
```

Cada skill segue o mesmo formato: `SKILL.md` curto com o essencial e a pasta `references/` carregada **sob demanda**, para gastar poucos tokens.

## Status e limitações

- Os exemplos de código em JavaScript e Python tiveram a **sintaxe validada**; os exemplos em Java, C#, Go e PHP **não foram compilados**.
- Os exemplos de Tailwind e React não foram executados em um projeto real.
- Os exemplos de `mvp-end-to-end-delivery` (Express, GSAP, OpenAPI, k6, ffmpeg e Cloudflare) **não foram executados nem testados em um projeto real**; confira versões e flags antes de usar.
- Em `dev-legal-compliance-br`, os textos legais são resumos educativos escritos de memória, **sem verificação linha a linha nas fontes oficiais**, e **não substituem assessoria jurídica**. Confirme a vigência de normas recentes (ECA Digital, regulação de IA, responsabilidade de plataformas no art. 19 do Marco Civil, prazos da ANPD).
- Em `estilos-de-design`, as cores marcadas como *(aprox.)* ou *(derivado)* foram estimadas das pranchas ou deduzidas, e os contrastes citados são **estimativas, não medições**; confirme com a marca e com uma ferramenta de contraste antes de usar em produção. Os trechos de CSS não foram executados em um projeto real.
- As skills ainda **não passaram por avaliação formal de comportamento** (evals).
- Links de galerias de referência não foram abertos individualmente.

Sugestões e correções são bem-vindas via issues.

## Licença

[MIT](LICENSE) © José Augusto Araujo de Faria
