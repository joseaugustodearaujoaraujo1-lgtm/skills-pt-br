<div align="center">

# 🧰 Skills em português para agentes de código

**Três skills para Claude Code (e agentes compatíveis) que transformam o assistente em um parceiro mais cuidadoso, mais criativo e com melhor senso de design.**

![Skills](https://img.shields.io/badge/skills-3-6366F1?style=for-the-badge)
![Idioma](https://img.shields.io/badge/idioma-pt--BR-009C3B?style=for-the-badge)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-black?style=for-the-badge)

</div>

---

## Por que existem

Agentes de código escrevem rápido, mas repetem erros previsíveis: falhas de segurança, interfaces com "cara de IA" e soluções óbvias para problemas que pedem outro olhar. Cada skill abaixo guia o agente por um método com **checklists, exemplos de código e IDs estáveis**, em vez de depender de sorte.

| Skill | Para quê | Tamanho |
|---|---|---|
| [`prevencao-de-falhas`](prevencao-de-falhas/SKILL.md) | Evitar, detectar e corrigir falhas de software: código gerado por IA, front-end, APIs, pagamentos, agentes/LLMs e infraestrutura | 86 falhas catalogadas |
| [`melhoria-de-design`](melhoria-de-design/SKILL.md) | Melhorar o design de sites existentes: tipografia, cor, layout, componentes, motion e conversão | 3 níveis (ajuste fino, repaginação, redesign) |
| [`criatividade-aplicada`](criatividade-aplicada/SKILL.md) | Gerar ideias fora da caixa com método e entregar soluções viáveis | 5 fases, 3 intensidades |

## 🛡️ prevencao-de-falhas

Um atlas de **86 falhas reais** com identificador estável (`IA-01`, `FE-05`, `API-07`, `FIN-03`, `AGT-02`, `OPS-04`…), cada uma com sintoma, causa, como corrigir e como evitar.

- **Áreas:** código gerado por IA, front-end, back-end e APIs (alinhado ao OWASP API Top 10 2023), pagamentos e dinheiro, agentes e LLMs (OWASP LLM 2025, "lethal trifecta") e infraestrutura.
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

## Como instalar

Copie a pasta da skill desejada para o diretório de skills do seu agente. No Claude Code:

```bash
git clone https://github.com/joseaugustodearaujoaraujo1-lgtm/skills-pt-br.git
cp -r skills-pt-br/prevencao-de-falhas ~/.claude/skills/
cp -r skills-pt-br/melhoria-de-design ~/.claude/skills/
cp -r skills-pt-br/criatividade-aplicada ~/.claude/skills/
```

No Windows (PowerShell), o destino é `$HOME\.claude\skills\`. Reinicie a sessão do agente e a skill passa a ser sugerida quando a tarefa combinar com a descrição dela.

## Estrutura

```text
skills-pt-br/
├── prevencao-de-falhas/    # SKILL.md + references/ (por área e por linguagem)
├── melhoria-de-design/     # SKILL.md + references/ (incl. implementacao/)
└── criatividade-aplicada/  # SKILL.md + references/ (técnicas, exemplo, modelos)
```

Cada skill segue o mesmo formato: `SKILL.md` curto com o essencial e a pasta `references/` carregada **sob demanda**, para gastar poucos tokens.

## Status e limitações

- Os exemplos de código em JavaScript e Python tiveram a **sintaxe validada**; os exemplos em Java, C#, Go e PHP **não foram compilados**.
- Os exemplos de Tailwind e React não foram executados em um projeto real.
- As skills ainda **não passaram por avaliação formal de comportamento** (evals).
- Links de galerias de referência não foram abertos individualmente.

Sugestões e correções são bem-vindas via issues.

## Licença

[MIT](LICENSE) © José Augusto Araujo de Faria
