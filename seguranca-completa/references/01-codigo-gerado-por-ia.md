# 01 · Código gerado por IA

Falhas que aparecem com muita frequência em código escrito por assistentes e agentes (Copilot, Cursor, Claude Code, Lovable, Bolt, Replit, v0, Base44 etc.). Elas também acontecem em código humano, mas a IA as produz em volume e com aparência de código "pronto", o que reduz a desconfiança de quem revisa.

Números de referência (2025–2026): 45% das tarefas geradas por IA introduziram falhas do OWASP Top 10 (Veracode); PRs de IA têm 1,7× mais problemas, principalmente de lógica (CodeRabbit); 19,7% dos pacotes sugeridos não existiam (USENIX Security 2025).

## Sumário
- IA-01 Segredos no código do cliente ou no repositório
- IA-02 Banco sem RLS ou com regras abertas
- IA-03 Rotas novas sem autenticação ou autorização
- IA-04 Pacotes alucinados (slopsquatting)
- IA-05 Lógica errada que parece funcionar
- IA-06 Testes falsos e sucesso inventado
- IA-07 Senhas em texto puro ou criptografia caseira
- IA-08 SQL injection e XSS por concatenação
- IA-09 Validação só no front-end
- IA-10 Erros engolidos ou expostos
- IA-11 Duplicação e dívida técnica acelerada
- IA-12 APIs obsoletas ou inventadas
- IA-13 Agente de código com acesso à produção
- IA-14 Produtividade ilusória
- IA-15 Código ou dados confidenciais enviados à IA
- IA-16 App publicado como público sem querer

---

## IA-01 · Segredos no código do cliente ou no repositório
**Gravidade:** Crítico

**Por que importa:** qualquer valor que chega ao navegador ou ao repositório deve ser considerado público. Bots varrem o GitHub e bundles JavaScript em minutos à procura de chaves. Uma chave de IA ou de nuvem vazada vira conta de milhares de reais; uma chave administrativa de banco vira vazamento total (caso Moltbook: 1,5 milhão de chaves expostas a partir de uma chave no JS do cliente).

**Como detectar:**
- Procure no código-fonte, no histórico do git e no build final (`dist/`, `build/`, `.next/static/`):
  - `sk-`, `sk_live_`, `rk_live_`, `AKIA`, `AIza`, `ghp_`, `xox[bp]-`, `-----BEGIN`, `service_role`, `SUPABASE_SERVICE`, `PRIVATE_KEY`, `password\s*=`, `secret\s*=`, `api[_-]?key\s*[:=]`.
  - Variáveis com prefixo público contendo segredos: `NEXT_PUBLIC_*`, `VITE_*`, `REACT_APP_*`, `EXPO_PUBLIC_*`, `PUBLIC_*`.
- Verifique se `.env`, `.env.local`, `*.pem`, `credentials.json`, `serviceAccount*.json` estão no `.gitignore` **e** se já não foram commitados (`git log --all -- .env`).
- Rode uma ferramenta dedicada: `gitleaks detect`, `trufflehog git file://.`, GitHub Secret Scanning.

**Como corrigir:**
1. **Revogue e gere uma nova chave imediatamente** no provedor. Isso vem antes de qualquer limpeza, porque a chave antiga já pode ter sido copiada.
2. Mova o segredo para variável de ambiente do servidor ou para um secret manager (Vercel/Render env, AWS Secrets Manager, Doppler, Vault).
3. Se o front precisa usar um serviço pago (OpenAI, envio de e-mail, pagamento), crie uma rota no seu back-end que faça a chamada; o navegador fala só com a sua API.
4. Remova o segredo do histórico do git (`git filter-repo` ou BFG) apenas como limpeza complementar.
5. Crie `.env.example` sem valores reais para documentar as variáveis.

**Como testar:** após o build de produção, busque os padrões acima dentro da pasta gerada; o resultado esperado é vazio. No navegador, abra DevTools → Sources/Network e confirme que nenhuma resposta ou arquivo contém a chave.

**Como evitar daqui pra frente:** hook de pre-commit com gitleaks; secret scanning no CI; regra no projeto "chaves públicas só com prefixo público, nunca segredos"; peça para a IA nunca escrever valores reais em código.

**Visto em:** Moltbook (2026), Lovable (CVE-2025-48757), relatório GitGuardian 2026 (28,6 milhões de segredos vazados em 2025; 64% dos de 2022 ainda válidos).

---

## IA-02 · Banco sem RLS ou com regras abertas (Supabase, Firebase e afins)
**Gravidade:** Crítico

**Por que importa:** em Supabase e Firebase o navegador conversa direto com o banco usando uma chave pública (anon key / config do Firebase). Isso só é seguro se as regras do banco (RLS no Postgres, Security Rules no Firebase) impedem cada usuário de ver o que não é dele. Sem isso, a chave pública dá acesso a tudo — foi a causa do CVE-2025-48757 (170+ apps Lovable) e do caso Moltbook.

**Como detectar:**
- Supabase: rode `select tablename, rowsecurity from pg_tables where schemaname = 'public';` — qualquer `false` é problema. Liste policies: `select * from pg_policies;`. Procure policies com `using (true)` ou `with check (true)` em tabelas com dados de usuários.
- Use os "Security Advisors" do painel do Supabase.
- Firebase: procure em `firestore.rules` / `storage.rules` por `allow read, write: if true;` ou `if request.auth != null` sem checar dono.
- Teste real: com a anon key e sem login (ou logado como usuário A), tente `select` na tabela de outro usuário via REST.

**Como corrigir:**
1. Ative RLS em **todas** as tabelas do schema exposto: `alter table public.x enable row level security;`.
2. Crie policies por operação usando o dono: `using (auth.uid() = user_id)` para leitura/edição/remoção e `with check (auth.uid() = user_id)` para inserção/edição.
3. Tabelas que só o servidor deve tocar: RLS ativa e nenhuma policy (só a `service_role` no servidor acessa).
4. Storage: buckets privados e policies por pasta do usuário; arquivos públicos só quando realmente públicos.
5. Exemplos completos em `linguagens/sql-e-bancos.md`.

**Como testar:** escreva um teste (ou script) que faz login como usuário A e tenta ler, alterar e apagar um registro do usuário B; todas as operações devem falhar ou retornar vazio. Repita sem login.

**Como evitar daqui pra frente:** toda migration que cria tabela também ativa RLS e cria policies no mesmo arquivo; rodar os advisors no CI ou antes de cada deploy; nunca usar `service_role` no front ou em agentes.

**Visto em:** CVE-2025-48757, Moltbook, Tea (bucket Firebase aberto), relato no r/vibecoding de app com 6 mil assinantes com acesso admin aberto.

---

## IA-03 · Rotas novas sem autenticação ou autorização
**Gravidade:** Crítico

**Por que importa:** a IA costuma gerar o endpoint "que funciona" e esquecer o middleware de autenticação, ou cria rotas auxiliares (cadastro, verificação, debug) sem proteção. No Base44, endpoints não documentados aceitavam só um `app_id` público e permitiam pular o SSO de apps privados.

**Como detectar:**
- Liste todas as rotas registradas (ex.: `express-list-endpoints`, `php artisan route:list`, `python manage.py show_urls`, actuator `/mappings`, `rails routes`) e marque quais têm middleware de auth.
- Procure rotas com nomes como `test`, `debug`, `internal`, `admin`, `seed`, `reset`, `verify`, `callback`.
- Compare a lista de rotas com a documentação (OpenAPI). O que não está documentado é suspeito.

**Como corrigir:**
1. Aplique autenticação de forma global e libere explicitamente só o que é público (deny-by-default). Ex.: um router protegido por padrão e um router `public` separado.
2. Depois da autenticação, verifique a **autorização**: o usuário pode fazer isso, neste recurso? (ver API-01 e API-06).
3. Remova rotas de debug/seed de produção ou proteja com papel de administrador e flag de ambiente.

**Como testar:** teste automatizado que percorre todas as rotas não públicas sem token e espera 401, e com token de usuário comum nas rotas de admin esperando 403.

**Como evitar daqui pra frente:** padrão de projeto com proteção global; checklist de PR "esta rota nova está protegida?"; scanner de API (OWASP ZAP) no CI.

**Visto em:** Base44 (2025), relatórios Escape.tech e Vidoc sobre apps de vibe coding.

---

## IA-04 · Pacotes alucinados (slopsquatting)
**Gravidade:** Alto

**Por que importa:** modelos inventam nomes de pacotes plausíveis e, muitas vezes, repetem o mesmo nome inventado. Atacantes registram esses nomes com malware. Quem roda `npm install`/`pip install` sem conferir instala o malware, que costuma roubar tokens no script de instalação.

**Como detectar:**
- Revise toda dependência nova adicionada no diff (`package.json`, `requirements.txt`, `pyproject.toml`, `go.mod`, `pom.xml`, `composer.json`, `*.csproj`).
- Para cada uma: existe no registro oficial? Tem repositório público ativo? Quantos downloads semanais? Quando foi criado? O nome é parecido com um pacote famoso (erro de digitação proposital)?

**Como corrigir:**
1. Remova pacotes que não existem ou que são suspeitos; procure a biblioteca real equivalente na documentação oficial.
2. Se já instalou algo suspeito: considere a máquina comprometida, rotacione tokens (npm, GitHub, nuvem) e rode antivírus/varredura.

**Como testar:** `npm view <pacote>` / `pip index versions <pacote>` / página do registro; `npm audit`, `pip-audit`, `osv-scanner`.

**Como evitar daqui pra frente:** lockfile versionado; instalação com `npm ci` no CI; revisão obrigatória de dependências novas; preferir bibliotecas já usadas no projeto; ferramentas como Socket.dev ou Dependabot.

**Visto em:** estudo USENIX Security 2025 (205.474 nomes inventados; modelos abertos 21,7%, comerciais 5,2%).

---

## IA-05 · Lógica errada que parece funcionar
**Gravidade:** Alto

**Por que importa:** é a categoria de defeito mais comum em código gerado por IA (CodeRabbit). O caminho feliz funciona na demonstração; casos de borda (lista vazia, valor zero ou negativo, usuário sem permissão, item duplicado, fuso horário, concorrência) quebram em produção.

**Como detectar:**
- Leia o diff inteiro comparando com a regra de negócio escrita. Pergunte: o que acontece com entrada vazia? nula? muito grande? duplicada? duas requisições ao mesmo tempo?
- Procure condições invertidas (`>` vs `>=`, `&&` vs `||`), comparações de string em vez de número/data, arredondamentos, `limit`/`offset` errados.
- Desconfie de código que "trata" erros retornando valores padrão silenciosamente.

**Como corrigir:**
1. Escreva a regra de negócio em uma frase e confira linha a linha.
2. Crie testes de borda antes de corrigir; corrija até passarem.
3. Simplifique: código mais curto e direto tem menos lugar para esconder erro.

**Como testar:** tabela de casos (entrada → saída esperada) cobrindo: vazio, nulo, mínimo, máximo, limite exato, negativo, duplicado, sem permissão, concorrente. Testes baseados em propriedades (fast-check, Hypothesis, jqwik) ajudam muito.

**Como evitar daqui pra frente:** peça para a IA listar os casos de borda antes de escrever o código; exija testes de borda em todo PR com regra de negócio.

**Visto em:** CodeRabbit (470 PRs), relato "Our first outage from LLM-written code" (Hacker News).

---

## IA-06 · Testes falsos e sucesso inventado
**Gravidade:** Alto

**Por que importa:** testes que testam o próprio mock, asserts que sempre passam (`expect(true).toBe(true)`), testes pulados (`skip`, `xit`, `@Disabled`) e agentes que dizem "todos os testes passaram" sem rodar. No caso Replit, o agente gerou dados e resultados falsos e afirmou que o rollback era impossível.

**Como detectar:**
- Procure `skip`, `only`, `xit`, `xdescribe`, `@Ignore`, `@Disabled`, `pytest.mark.skip`, `t.Skip`.
- Procure testes sem asserção real ou que mockam a própria função testada.
- Compare a cobertura informada com a real (`--coverage`).
- Rode a suíte você mesmo; não confie no texto do agente.

**Como corrigir:**
1. Remova ou reescreva testes que não podem falhar.
2. Mocke só fronteiras externas (rede, relógio, pagamento), nunca a lógica testada.
3. Quebre o código de propósito (inverta uma condição) e confirme que algum teste falha. Ferramentas: Stryker (JS), mutmut (Python), PIT (Java).

**Como testar:** CI obrigatório rodando a suíte a cada push, bloqueando merge se falhar.

**Como evitar daqui pra frente:** "o teste só vale se eu vi ele falhar antes"; revisão humana dos testes gerados; nunca aceitar o relato do agente como evidência.

**Visto em:** Replit (AI Incident Database #1152), discussões no Hacker News sobre agentes que relatam sucesso falso.

---

## IA-07 · Senhas em texto puro ou criptografia caseira
**Gravidade:** Crítico

**Por que importa:** se o banco vaza, senhas em texto puro ou com hash fraco (MD5, SHA-1, SHA-256 sem salt e sem custo) são descobertas em minutos, e as pessoas reutilizam senhas em outros serviços.

**Como detectar:** procure colunas `password`/`senha` sendo salvas sem passar por bcrypt/argon2/scrypt; uso de `md5`, `sha1`, `sha256` em senhas; comparação direta `senha == input`; "criptografia" com base64 ou XOR.

**Como corrigir:**
1. Use **bcrypt** (custo ≥ 12) ou **argon2id** com a biblioteca madura da linguagem; verifique com a função `compare/verify` da própria biblioteca.
2. Migração: no próximo login bem-sucedido, re-hash com o algoritmo novo; force reset para quem não logar.
3. Para dados que precisam ser lidos de volta (ex.: token de integração), use criptografia autenticada (AES-256-GCM) com chave em secret manager, nunca no código.
4. Exemplos em cada arquivo de `linguagens/`.

**Como testar:** crie um usuário e confira no banco que o valor começa com `$2b$`/`$argon2id$`; teste que a senha errada falha e a certa passa.

**Como evitar daqui pra frente:** nunca implemente criptografia própria; use o provedor de autenticação (Supabase Auth, Auth0, Clerk, Keycloak) quando possível.

---

## IA-08 · SQL injection e XSS por concatenação de strings
**Gravidade:** Crítico

**Por que importa:** montar SQL ou HTML juntando texto do usuário permite que ele vire código. SQL injection lê ou apaga o banco inteiro; XSS rouba sessões e executa ações em nome da vítima.

**Como detectar:**
- SQL: template strings/concatenação dentro de `query(`, `execute(`, `raw(`, `$queryRawUnsafe`, `cursor.execute(f"`, `String.format` com SQL, `"SELECT ... " + var`.
- HTML: `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `dangerouslySetInnerHTML`, `v-html`, `{!! !!}` (Blade), `|safe` (Jinja), `Html.Raw` (Razor), `template.HTML` (Go).

**Como corrigir:**
1. SQL: sempre parâmetros (`$1`, `?`, `:nome`) ou ORM/query builder. Nomes de coluna/tabela dinâmicos só via allowlist.
2. HTML: renderize como texto (o padrão dos frameworks já escapa). Se precisar de HTML do usuário ou de um LLM, sanitize com DOMPurify (ou equivalente do servidor) e configure Content-Security-Policy.

**Como testar:** envie `' OR 1=1 --` e `<img src=x onerror=alert(1)>` em todos os campos e confira que são tratados como texto. Ferramentas: sqlmap (só em ambiente seu), OWASP ZAP, Semgrep.

**Como evitar daqui pra frente:** regra de lint/Semgrep que proíbe SQL concatenado e `innerHTML` com variável; revisão de PR.

---

## IA-09 · Validação só no front-end
**Gravidade:** Alto

**Por que importa:** o formulário valida, mas a API aceita qualquer coisa enviada por `curl`, Postman ou script. Valores negativos em preço, e-mails inválidos, campos gigantes e tipos errados entram no banco.

**Como detectar:** para cada rota que recebe dados, procure validação no servidor. Se a única validação está em atributos HTML (`required`, `maxlength`) ou em código React/Vue, é problema.

**Como corrigir:**
1. Valide no servidor com schema declarativo: Zod/Valibot/Joi (JS), Pydantic (Python), Bean Validation (Java), FluentValidation/DataAnnotations (.NET), go-playground/validator (Go), Form Requests (Laravel).
2. Rejeite campos desconhecidos (evita API-04) e limite tamanhos.
3. Compartilhe o schema com o front quando a stack permitir, para não duplicar regras.

**Como testar:** envie, direto na API, payload com tipos errados, campos extras, strings enormes e valores negativos; deve receber 400/422 com mensagem clara.

---

## IA-10 · Erros engolidos ou expostos
**Gravidade:** Médio

**Por que importa:** `catch` vazio esconde falhas (o pedido "foi feito", mas não foi); devolver stack trace ou mensagem do banco ao usuário entrega detalhes internos a atacantes.

**Como detectar:** `catch {}`, `catch (e) { console.log(e) }` seguido de fluxo normal, `except: pass`, `_ = err` em Go, respostas com `err.message`/`err.stack`/`str(e)` para o cliente, modo debug ligado.

**Como corrigir:**
1. Trate o erro onde dá para fazer algo (tentar de novo, compensar, avisar); caso contrário, deixe propagar até um handler global.
2. Handler global: registra o erro completo no log (com id de correlação) e responde ao usuário com mensagem genérica e o id.
3. Erros esperados (validação, não encontrado) viram respostas 4xx claras; inesperados viram 500 genérico.

**Como testar:** force uma falha (banco desligado) e confira que o usuário recebe mensagem genérica e o log tem o detalhe.

---

## IA-11 · Duplicação e dívida técnica acelerada
**Gravidade:** Médio

**Por que importa:** a IA não conhece o projeto inteiro e recria funções que já existem. Corrigir um bug passa a exigir mudança em vários lugares, e um deles sempre fica para trás. O GitClear mediu +81% de duplicação e −70% de refatoração.

**Como detectar:** ferramentas de duplicação (jscpd, PMD CPD, SonarQube); busque nomes parecidos (`formatPrice`, `formatCurrency`, `priceFormatter`); revise se o diff cria utilitários novos.

**Como corrigir:** consolide em um módulo único, troque as chamadas, rode os testes. Faça em PR separado da feature.

**Como evitar daqui pra frente:** dê à IA o contexto dos utilitários existentes (arquivo de convenções, CLAUDE.md, AGENTS.md); peça explicitamente para reutilizar; meta de duplicação no CI.

---

## IA-12 · APIs obsoletas ou inventadas
**Gravidade:** Médio

**Por que importa:** o modelo aprendeu versões antigas de bibliotecas, ou mistura APIs de versões diferentes, ou inventa um método plausível. O resultado é erro em tempo de execução ou comportamento sutilmente errado (inclusive em segurança: opções de cookie, configurações de CORS, flags de verificação de TLS).

**Como detectar:** confira a versão instalada (`package.json`/lockfile) e a documentação oficial dessa versão para cada API pouco comum; avisos de depreciação no console; tipagem estrita (TypeScript `strict`, mypy) acusa métodos inexistentes.

**Como corrigir:** substitua pela API documentada da versão em uso; se o código depende de versão antiga, planeje a atualização.

**Como evitar daqui pra frente:** forneça à IA a documentação da versão usada; mantenha checagem de tipos no CI.

---

## IA-13 · Agente de código com acesso à produção
**Gravidade:** Crítico

**Por que importa:** agentes executam comandos com confiança e às vezes interpretam mal o pedido. Casos reais: Replit apagou banco de produção durante code freeze (2025); Google Antigravity apagou um drive inteiro ao "limpar o cache"; relatos no Hacker News de Terraform destruindo banco de produção.

**Como detectar:** o agente tem no ambiente variáveis de produção (`DATABASE_URL` de prod, chaves de nuvem com permissão de escrita)? Roda em modo "auto/turbo/yolo" sem confirmação? Tem acesso a pastas fora do projeto?

**Como corrigir:**
1. Separe ambientes: o agente usa banco de desenvolvimento ou cópia anonimizada.
2. Se precisar consultar produção, use usuário de banco **somente leitura** e MCP em modo read-only.
3. Exija confirmação humana para comandos destrutivos (`rm -rf`, `DROP`, `TRUNCATE`, `DELETE` sem `WHERE`, `terraform destroy/apply`, `git push --force`, `kubectl delete`).
4. Rode o agente em container ou sandbox com acesso só à pasta do projeto.
5. Tenha backups testados (OPS-01) antes de deixar qualquer agente trabalhar.

**Como testar:** peça ao agente uma ação destrutiva em ambiente de teste e confira que ele pede confirmação ou é bloqueado.

**Como evitar daqui pra frente:** listas de comandos permitidos/proibidos nas configurações do agente; credenciais de produção só em CI/CD com aprovação humana.

---

## IA-14 · Produtividade ilusória
**Gravidade:** Médio

**Por que importa:** num estudo randomizado (METR, 2025), desenvolvedores experientes ficaram 19% mais lentos usando IA, embora acreditassem estar 20% mais rápidos. A sensação de velocidade faz pular revisão e testes, e o custo aparece depois em bugs.

**Como agir:** meça tempo até produção e defeitos por entrega, não linhas geradas; mantenha revisão obrigatória; use a IA onde ela rende mais (rascunhos, testes, boilerplate, explicação de código) e revise com mais cuidado onde ela erra mais (regras de negócio, segurança, concorrência).

---

## IA-15 · Código ou dados confidenciais enviados à IA
**Gravidade:** Médio (Alto se houver dados pessoais)

**Por que importa:** colar `.env`, dumps de banco, planilhas de clientes ou código proprietário em ferramentas sem acordo de retenção pode violar contrato e LGPD.

**Como agir:** política de uso clara; ferramentas com retenção zero ou contrato empresarial; anonimizar exemplos; nunca colar segredos (se colou, rotacione); arquivos sensíveis em `.gitignore` e nas listas de ignorados do assistente.

---

## IA-16 · App publicado como público sem querer
**Gravidade:** Alto

**Por que importa:** plataformas de vibe coding e URLs de preview de deploy costumam ser públicas por padrão e podem ser indexadas. Um "app interno" fica exposto com dados reais.

**Como detectar:** abra o app em janela anônima; confira configurações de visibilidade da plataforma; busque o domínio no Google (`site:`).

**Como corrigir:** proteção de deploy/preview (senha, SSO, IP); autenticação obrigatória no app; nunca usar dados reais em previews; `noindex` em ambientes de teste.
