# Etapa 5 — Deploy e DNS no Cloudflare

**Objetivo:** publicar o MVP com segurança, configurar o domínio no Cloudflare e garantir que dê para reverter.

**Esta etapa tem efeitos externos, possíveis custos e risco de indisponibilidade. Exija confirmação explícita antes de cada ação externa.**

## 5.0 Regras de credenciais

- **Nunca** peça, receba ou digite senhas, códigos 2FA, chaves de API ou tokens no chat.
- O usuário faz login nos painéis (registrador, Cloudflare, hospedagem) e cria **API tokens com escopo mínimo** (ex.: apenas `Zone → DNS → Edit` e `Zone → Zone → Read` na zona do domínio), guardando-os em variáveis de ambiente locais ou no gerenciador de segredos do CI.
- Se o fluxo exigir clicar em painéis, oriente o usuário passo a passo; ele executa e confirma o resultado.
- Tokens nunca vão para o Git, para logs ou para o front-end.

## 5.1 Pré-voo (checklist antes de publicar)

- [ ] Etapas 1 a 4 aprovadas; testes passando.
- [ ] Segredos de produção separados dos de staging; nenhum valor padrão ou de teste.
- [ ] `NODE_ENV=production`; *debug* e *stack traces* desligados; documentação protegida se necessário.
- [ ] CORS com origens exatas; cookies `Secure`.
- [ ] Documentos jurídicos publicados (privacidade, termos, cookies, troca/devolução, contato/SAC, dados do fornecedor).
- [ ] Banco de produção com backup automático e restauração testada.
- [ ] Migrações revisadas, com plano de reversão.
- [ ] Monitoramento e alertas configurados (uptime, erros, latência).
- [ ] Plano de resposta a incidentes e responsável definidos.
- [ ] Custos conhecidos e aprovados.

## 5.2 Escolha da hospedagem (compare e recomende)

| Opção | Bom para | Atenção |
|-------|----------|---------|
| Cloudflare Pages/Workers | Front estático/SSR leve, borda global, custo baixo | Limites de runtime; Node.js completo exige compatibilidade |
| Vercel / Netlify | Front Next.js/estático, previews por PR | Custos por tráfego/funções; verifique limites do plano |
| Render / Railway / Fly.io | API Node.js, banco gerenciado | Cold start em planos gratuitos; custos por instância |
| VPS (Hetzner, DigitalOcean, etc.) | Controle total, custo previsível | Você administra SO, patches, firewall, backup |
| Supabase (banco/auth/storage) | Backend gerenciado | RLS correta; não confundir com hospedar Express |

Verifique preços e limites **atuais** nas páginas oficiais antes de recomendar. Prefira provedores com região próxima aos usuários (latência) e com *backup* gerenciado.

## 5.3 CI/CD mínimo

1. Pipeline: instalar → *lint* → testes → *audit* → *build* → deploy em **staging** → testes de fumaça → promoção manual para produção.
2. Segredos no cofre do CI (não no repositório). Proteja a branch principal (revisão obrigatória).
3. Versionamento por tag; *rollback* = reimplantar a tag anterior.

## 5.4 DNS no Cloudflare — procedimento seguro

### Conceitos

| Registro | Uso |
|----------|-----|
| `A` / `AAAA` | Aponta nome para IP |
| `CNAME` | Alias para outro nome (ex.: `www` → `app.provedor.com`) |
| `MX` | E-mail (**não pode** ficar com proxy) |
| `TXT` | SPF, DKIM, DMARC, verificações |
| `CAA` | Quem pode emitir certificados |
| Proxy (nuvem laranja) | Tráfego passa pelo Cloudflare (CDN, WAF, DDoS); só para HTTP/HTTPS |
| DNS only (nuvem cinza) | Resolve direto, sem proteção |

### Passo a passo (migrar ou "renomear" o DNS)

1. **Inventário.** Exporte a zona atual (Cloudflare: *DNS → Import and Export → Export*; ou `dig`/painel do registrador) e registre todos os registros — inclusive e-mail e verificações. Esquecer `MX`/`TXT` derruba e-mails.
2. **Reduza o TTL** dos registros relevantes para 300 s com 24–48 h de antecedência (acelera troca e rollback).
3. **Adicione o site no Cloudflare** (*Add a site*) e revise os registros importados; corrija o que faltar.
4. **Troque os *nameservers*** no registrador pelos fornecidos pelo Cloudflare (ação do usuário). A propagação pode levar de minutos a 48 h.
5. **Crie/ajuste os registros** do sistema:
   - Front: `@` e `www` → hospedagem (CNAME/A) com proxy ligado se o provedor permitir.
   - API: `api` → origem da API com proxy ligado.
   - Staging: `staging` / `staging-api` com acesso restrito (Cloudflare Access ou IP allowlist).
6. **Valide** (comandos abaixo) antes de desligar o provedor antigo.
7. **Restaure TTL** para valor padrão (ex.: automático/1 h) após estabilizar.
8. **Plano de rollback:** manter os registros antigos exportados; voltar *nameservers* ou registros é a reversão.

Verificações:

```bash
dig +short NS exemplo.com
dig +short A exemplo.com
dig +short CNAME www.exemplo.com
dig +short MX exemplo.com
dig +short TXT exemplo.com
curl -sI https://exemplo.com | head -n 20        # status, HSTS, CSP, server
curl -s -o /dev/null -w "%{http_code} %{time_total}s\n" https://api.exemplo.com/health
```

Automação (opcional, só com token do usuário em variável de ambiente, nunca colado no chat):

```bash
# listar registros da zona
curl -s -H "Authorization: Bearer $CF_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records" | jq '.result[] | {id,type,name,content,proxied,ttl}'
# criar registro
curl -s -X POST -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records" \
  --data '{"type":"CNAME","name":"api","content":"app.provedor.com","ttl":1,"proxied":true}'
```

Mostre ao usuário o **diff** (o que será criado/alterado/removido) e peça confirmação antes de aplicar. Nunca apague registros que você não criou sem confirmar.

## 5.5 Configurações de segurança no Cloudflare

- **SSL/TLS:** modo **Full (strict)** com certificado válido na origem (ou *Origin CA*); **Always Use HTTPS**; **Minimum TLS 1.2**; **Automatic HTTPS Rewrites**.
- **HSTS:** ative só depois de confirmar que todo o site funciona em HTTPS (começar com `max-age` curto; `includeSubDomains`/`preload` apenas com certeza).
- **DNSSEC:** ative no Cloudflare e publique o registro DS no registrador.
- **WAF:** *Managed rules* ligadas; regras customizadas para rotas sensíveis (`/login`, `/api/auth/*`).
- **Rate limiting:** regras por IP/rota (ex.: 10 tentativas/min em login). Combine com o rate limit da API (defesa em camadas).
- **Bot Fight Mode / Turnstile:** proteção em formulários públicos (login, cadastro, contato).
- **Cache:** *Cache Rules* só para estáticos; **nunca** cachear respostas autenticadas ou com dados pessoais; respeitar `Cache-Control`.
- **Origem protegida:** aceite tráfego da origem somente de IPs do Cloudflare ou use *Cloudflare Tunnel*/mTLS (*Authenticated Origin Pulls*) para impedir acesso direto ao IP.
- **IP real:** configure a API para confiar no cabeçalho `CF-Connecting-IP` apenas quando a requisição vier do Cloudflare (impacta logs e rate limit).
- **E-mail:** `SPF`, `DKIM`, `DMARC` (começar com `p=none`, evoluir para `quarantine/reject`), registros `MX` sem proxy.
- **CAA** limitando as autoridades certificadoras.
- **Contas:** 2FA na conta do Cloudflare e do registrador; papéis mínimos para colaboradores; alertas de mudança de DNS.

## 5.6 Headers de segurança (na aplicação ou em *Transform Rules*)

`Strict-Transport-Security`, `Content-Security-Policy` (comece em modo *report-only*), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`. Teste com `securityheaders.com` ou equivalente.

## 5.7 Lançamento (go-live)

1. Janela combinada com o usuário, fora do horário de pico.
2. Deploy em staging → **testes de fumaça** (login, fluxo principal, pagamento em modo sandbox).
3. Promoção para produção → repetir fumaça com dados controlados.
4. Pagamento real de baixo valor (se aplicável) e estorno de teste, com autorização do usuário.
5. Monitorar erros e latência por 24–48 h; manter TTL baixo até estabilizar.
6. Registrar tudo em `docs/05-deploy.md`: versão, data, URLs, mudanças de DNS, responsáveis, plano de rollback.

## 5.8 Pós-deploy

- Alertas de uptime, erro 5xx, latência p95, uso de CPU/memória, falhas de pagamento, expiração de certificado.
- Rotina de patches e atualização de dependências.
- Revisão de logs de segurança e de acesso (e retenção mínima legal de 6 meses para registros de acesso a aplicações).
- Teste periódico de restauração de backup.

## 5.9 Critério de pronto e portão

- [ ] URL pública abre com HTTPS válido; redirecionamento HTTP→HTTPS ok.
- [ ] Nameservers e registros conferidos com `dig`; e-mail do domínio funcionando.
- [ ] Headers de segurança, WAF e rate limit ativos e testados.
- [ ] Origem não acessível diretamente (ou protegida).
- [ ] Rollback ensaiado ou documentado com passos exatos.
- [ ] Monitoramento e alertas ativos.
- [ ] `docs/05-deploy.md` preenchido. Diferencie: *configurado*, *verificado*, *pendente*.

Peça confirmação antes da Etapa 6 (gera tráfego de teste).
