# 02 · Front-end

Vale para qualquer interface que roda no navegador ou no aparelho do usuário: sites, SPAs (React, Vue, Angular, Svelte), frameworks com SSR (Next.js, Nuxt, SvelteKit, Remix, Astro), apps mobile (React Native, Flutter) e desktop (Electron).

Princípio central: **tudo que está no cliente pode ser lido e alterado pelo usuário.** O front melhora a experiência; quem protege é o servidor.

## Sumário
- FE-01 Segredos em variáveis públicas do bundler
- FE-02 XSS via innerHTML / dangerouslySetInnerHTML
- FE-03 Token de sessão em localStorage
- FE-04 Autorização só no front ou só no middleware
- FE-05 Envio duplicado
- FE-06 Resposta antiga sobrescrevendo a nova
- FE-07 Vazamento de memória e estado desatualizado
- FE-08 Sem estados de carregamento, erro e vazio
- FE-09 Datas e fusos exibidos errado
- FE-10 Hydration mismatch no SSR
- FE-11 Cache antigo depois do deploy
- FE-12 Acessibilidade ignorada
- FE-13 Bundle pesado e página lenta

---

## FE-01 · Segredos em variáveis públicas do bundler
**Gravidade:** Crítico

**Por que importa:** variáveis com prefixo `NEXT_PUBLIC_`, `VITE_`, `REACT_APP_`, `EXPO_PUBLIC_`, `PUBLIC_` (SvelteKit/Astro), `NUXT_PUBLIC_` e tudo que é lido em código de cliente é embutido no JavaScript entregue ao navegador. Apps mobile também: o binário pode ser descompilado.

**Como detectar:** liste as variáveis públicas no `.env` e no painel de deploy; faça build de produção e procure os valores dentro da pasta gerada; no Flutter/React Native, procure chaves no código Dart/JS e em `google-services.json`/`Info.plist` com chaves que não deveriam estar ali.

**Como corrigir:**
1. Só chaves feitas para serem públicas podem ficar no cliente (anon key do Supabase **com RLS**, publishable key do Stripe, ID do Google Analytics, chave de Maps **restrita por domínio/app**).
2. Tudo o mais vai para o servidor: crie uma rota (API route, server action, função serverless) que usa o segredo e devolve só o resultado.
3. Revogue e troque qualquer segredo que já foi publicado (IA-01).

**Como testar:** busca no build (IA-01); DevTools → Network: nenhuma requisição do navegador envia chave secreta.

---

## FE-02 · XSS via innerHTML / dangerouslySetInnerHTML
**Gravidade:** Crítico

**Por que importa:** HTML vindo do usuário, de um CMS, de markdown ou da **resposta de um LLM** pode conter `<script>`, `onerror=` ou links `javascript:`. Executado na página, rouba sessão e age em nome do usuário.

**Como detectar:** `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `dangerouslySetInnerHTML`, `v-html`, `[innerHTML]` (Angular com `bypassSecurityTrust*`), `{@html}` (Svelte), bibliotecas de markdown com HTML habilitado, `href={url}` com URL controlada pelo usuário.

**Como corrigir:**
1. Prefira renderizar como texto; os frameworks escapam por padrão.
2. Quando HTML for necessário, sanitize com **DOMPurify** (`DOMPurify.sanitize(html)`) antes de inserir.
3. Markdown: renderizador com HTML desligado ou sanitizado (ex.: `react-markdown` sem `rehype-raw`, ou com `rehype-sanitize`).
4. URLs: aceite só `http:`/`https:`/`mailto:`; rejeite `javascript:` e `data:`.
5. Defina **Content-Security-Policy** sem `unsafe-inline` para scripts, como segunda camada.

**Como testar:** cadastre `<img src=x onerror=alert(1)>` e `[x](javascript:alert(1))` em todos os campos exibidos e confira que nada executa.

---

## FE-03 · Token de sessão em localStorage
**Gravidade:** Alto

**Por que importa:** qualquer script na página (inclusive via XSS ou dependência comprometida) lê o `localStorage` e envia o token para fora. O atacante fica logado como a vítima até o token expirar.

**Como detectar:** `localStorage.setItem('token'`, `sessionStorage` com JWT, access tokens longos (dias/semanas).

**Como corrigir:**
1. Prefira sessão em **cookie `HttpOnly`, `Secure`, `SameSite=Lax` (ou `Strict`)**; o JavaScript não consegue ler.
2. Com cookies, proteja contra CSRF: `SameSite`, token CSRF em formulários ou checagem de `Origin`.
3. Se a arquitetura exigir token no cliente (ex.: app mobile), use access token curto (5–15 min) + refresh token rotativo armazenado com segurança (Keychain/Keystore no mobile).
4. Use o SDK do provedor de auth, que já resolve armazenamento e renovação.

**Como testar:** no console do navegador, `document.cookie` não deve mostrar o cookie de sessão; o `localStorage` não deve conter tokens.

---

## FE-04 · Autorização só no front ou só no middleware
**Gravidade:** Crítico

**Por que importa:** esconder um botão ou redirecionar no cliente não protege nada; basta chamar a API diretamente. E mesmo no servidor, depender só de um middleware é frágil: no CVE-2025-29927 (Next.js, CVSS 9,1), um cabeçalho forjado fazia o middleware ser pulado.

**Como detectar:** rotas de API e server actions que confiam que "só o admin chega aqui porque a página é protegida"; checagem de papel apenas em componentes; `middleware.ts` como única barreira; versão do Next.js anterior a 12.3.5 / 13.5.9 / 14.2.25 / 15.2.3.

**Como corrigir:**
1. Verifique a sessão e a permissão **dentro** de cada rota de API, server action e loader, perto da consulta ao dado.
2. Centralize numa função (`requireUser()`, `requireRole('admin')`) chamada no início de cada handler.
3. Mantenha o framework atualizado; acompanhe os avisos de segurança.

**Como testar:** chame cada rota protegida com `curl`, sem cookie e com cookie de usuário comum; espere 401/403.

---

## FE-05 · Envio duplicado (duplo clique, F5, retry)
**Gravidade:** Alto (Crítico em pagamentos)

**Por que importa:** dois cliques rápidos, rede lenta, "voltar" e reenviar, ou retry automático geram dois pedidos, dois cadastros, duas cobranças.

**Como detectar:** botões de envio que continuam habilitados durante a requisição; ausência de chave de idempotência nas chamadas de escrita; formulários que fazem POST e não redirecionam (F5 reenvia).

**Como corrigir:**
1. No front: desabilite o botão e mostre carregamento durante o envio; padrão POST → redirect → GET.
2. **A correção de verdade é no servidor:** gere uma chave de idempotência por intenção do usuário (ex.: `crypto.randomUUID()` ao abrir o checkout) e envie em `Idempotency-Key`; o servidor ignora repetições (API-13, FIN-03).

**Como testar:** clique duas vezes rápido / dispare a mesma requisição duas vezes em paralelo; só um registro deve existir.

---

## FE-06 · Resposta antiga sobrescrevendo a nova
**Gravidade:** Médio

**Por que importa:** o usuário troca de filtro ou digita na busca; a requisição antiga, mais lenta, chega por último e a tela mostra dados que não correspondem à seleção.

**Como corrigir:**
1. Cancele a requisição anterior com `AbortController` (no cleanup do efeito).
2. Ou ignore respostas obsoletas com uma flag/ID da requisição.
3. Melhor: use uma biblioteca de dados (TanStack Query, SWR, RTK Query, Apollo) que já trata isso, além de cache e retry.
4. Debounce em buscas digitadas.

**Como testar:** simule rede lenta (DevTools → Throttling) e troque rápido de filtro; a tela deve sempre refletir a última seleção.

---

## FE-07 · Vazamento de memória e estado desatualizado
**Gravidade:** Médio

**Por que importa:** timers, listeners, websockets e assinaturas sem limpeza continuam rodando depois que o componente sai da tela; closures capturam valores antigos (stale closures) e geram comportamento errado e lentidão progressiva.

**Como detectar:** `useEffect` sem função de retorno que limpe `setInterval`, `addEventListener`, `subscribe`, `socket.on`; dependências faltando (lint `react-hooks/exhaustive-deps` desligado); memória crescendo no DevTools → Memory ao navegar.

**Como corrigir:** sempre retornar cleanup; manter o lint de hooks ativo; usar atualização funcional de estado (`setX(prev => ...)`); equivalentes em outros frameworks (`onUnmounted`, `ngOnDestroy`, `dispose` no Flutter).

---

## FE-08 · Sem estados de carregamento, erro e vazio
**Gravidade:** Médio

**Por que importa:** quando a API falha, o usuário vê tela branca ou spinner infinito, tenta de novo, duplica ações ou desiste. Lista vazia sem explicação parece bug.

**Como corrigir:** desenhe e implemente quatro estados para toda tela com dados: **carregando**, **erro** (mensagem que explica o que fazer + botão de tentar de novo), **vazio** (o que é e como começar) e **sucesso**. Use error boundaries (React) ou equivalentes para falhas inesperadas, e timeout nas requisições.

**Como testar:** DevTools → Network → offline / bloquear a URL da API; conta sem dados.

---

## FE-09 · Datas e fusos exibidos errado
**Gravidade:** Médio

**Por que importa:** datas "pulam" um dia (`new Date('2026-03-10')` é interpretado como UTC e vira dia 9 no Brasil), horários mudam no horário de verão de outros países, comparações de datas como texto falham.

**Como corrigir:**
1. Servidor e banco guardam instantes em **UTC** (`timestamptz` no Postgres) e trafegam em ISO 8601 com fuso (`2026-03-10T13:00:00Z`).
2. Converta para o fuso do usuário só na exibição, com `Intl.DateTimeFormat` (ou date-fns-tz / Luxon / Temporal).
3. Datas sem hora (aniversário, vencimento) trafegam como texto `YYYY-MM-DD` e não passam por `Date` com fuso.
4. Eventos futuros locais (ex.: consulta às 9h em São Paulo) guardam também o fuso IANA (`America/Sao_Paulo`).

**Como testar:** rode os testes com outro fuso (`TZ=America/New_York`, `TZ=Asia/Tokyo`) e em datas de transição de horário de verão.

---

## FE-10 · Hydration mismatch no SSR
**Gravidade:** Médio

**Por que importa:** quando o HTML gerado no servidor difere do primeiro render no cliente (por `Date.now()`, `Math.random()`, `window`, `localStorage`, locale diferente), o framework descarta e re-renderiza, gera avisos e às vezes mostra conteúdo errado ou piscando.

**Como corrigir:** valores dependentes do cliente só depois de montar (`useEffect` / `onMounted`), ou calculados no servidor e passados como props; datas formatadas com fuso e locale explícitos; componentes só de cliente marcados como tal (`'use client'`, `dynamic(..., { ssr: false })`, `<ClientOnly>`).

---

## FE-11 · Cache antigo depois do deploy
**Gravidade:** Médio

**Por que importa:** usuários com a aba aberta continuam com o JS antigo; ao navegar, tentam carregar chunks que não existem mais (`ChunkLoadError`) ou falam com uma API que mudou de formato.

**Como corrigir:** assets com hash no nome e cache longo; HTML com `Cache-Control: no-cache`; manter chunks antigos disponíveis por algum tempo após o deploy; capturar `ChunkLoadError` e recarregar a página; APIs compatíveis com a versão anterior durante a transição (versionamento).

---

## FE-12 · Acessibilidade ignorada
**Gravidade:** Médio (pode ser exigência legal: Lei Brasileira de Inclusão, ADA, EAA)

**Por que importa:** inputs sem label, contraste baixo, elementos clicáveis que não funcionam pelo teclado e modais que prendem o foco excluem usuários e quebram leitores de tela e automações.

**Como corrigir:** HTML semântico (`button`, `a`, `label`, `nav`, `main`); `label` associado a todo campo; contraste mínimo 4,5:1 para texto; foco visível; navegação completa por teclado; `alt` em imagens; mensagens de erro ligadas ao campo (`aria-describedby`); respeitar `prefers-reduced-motion`.

**Como testar:** axe DevTools / Lighthouse; navegar só com Tab/Enter/Esc; leitor de tela (NVDA, VoiceOver).

---

## FE-13 · Bundle pesado e página lenta
**Gravidade:** Médio

**Por que importa:** páginas lentas perdem usuários e posição no Google. Causas comuns: biblioteca inteira importada para usar uma função, imagens sem otimização, fontes demais, renderização no cliente do que poderia ser estático.

**Como corrigir:** analisar o bundle (`vite-bundle-visualizer`, `@next/bundle-analyzer`, `source-map-explorer`); importar só o necessário; code splitting por rota; imagens responsivas (`srcset`, WebP/AVIF, `loading="lazy"`); fontes com `display=swap` e subset; acompanhar Core Web Vitals (LCP, INP, CLS) com Lighthouse e dados reais.
