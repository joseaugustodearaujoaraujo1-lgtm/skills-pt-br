# C# / .NET (ASP.NET Core)

Exemplos de correção para os IDs desta skill com .NET 8+, ASP.NET Core (Minimal APIs ou Controllers) e EF Core. Os exemplos não foram compilados aqui: confira namespaces e versões no projeto.

## Sumário
1. Configuração validada no boot — OPS-08, IA-01
2. Senhas — IA-07
3. Autenticação por padrão e papéis — IA-03, API-06
4. Filtro pelo dono e SQL parametrizado — API-01, IA-08
5. Validação e DTOs — IA-09, API-04
6. JWT — API-03
7. Rate limit — API-02, API-05
8. Timeouts e resiliência — API-12, API-13
9. Dinheiro — FIN-01, FIN-07
10. Débito atômico e transação — FIN-02, API-15
11. Webhooks — API-18, FIN-04
12. Erros, logs e configuração — IA-10, API-17, API-09
13. Ferramentas

---

## 1. Configuração validada no boot (OPS-08, IA-01)

```csharp
public sealed class PaymentOptions
{
    [Required, MinLength(32)] public string WebhookSecret { get; init; } = "";
    [Required, Url] public string ApiBaseUrl { get; init; } = "";
}

builder.Services.AddOptions<PaymentOptions>()
    .Bind(builder.Configuration.GetSection("Payment"))
    .ValidateDataAnnotations()
    .ValidateOnStart(); // a aplicação não sobe com configuração inválida
```

Segredos: variáveis de ambiente, Azure Key Vault ou `dotnet user-secrets` no desenvolvimento; nunca em `appsettings.json` versionado.

## 2. Senhas (IA-07)

```csharp
// ASP.NET Core Identity já faz isso. Fora dele:
var hasher = new PasswordHasher<User>(); // PBKDF2 com salt e iterações
user.PasswordHash = hasher.HashPassword(user, rawPassword);
var result = hasher.VerifyHashedPassword(user, user.PasswordHash, rawPassword);
bool ok = result != PasswordVerificationResult.Failed;
```

Alternativa: `BCrypt.Net-Next` (`BCrypt.HashPassword(raw, 12)` / `BCrypt.Verify(raw, hash)`).

## 3. Autenticação por padrão e papéis (IA-03, API-06)

```csharp
builder.Services.AddAuthorization(options =>
{
    // toda rota exige usuário autenticado, a não ser que use [AllowAnonymous]
    options.FallbackPolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    options.AddPolicy("Admin", p => p.RequireRole("admin"));
});

app.MapPost("/api/login", Login).AllowAnonymous();
app.MapDelete("/api/admin/users/{id:guid}", DeleteUser).RequireAuthorization("Admin");
```

## 4. Filtro pelo dono e SQL parametrizado (API-01, IA-08)

```csharp
app.MapGet("/api/orders/{id:guid}", async (Guid id, ClaimsPrincipal principal, AppDb db) =>
{
    var userId = Guid.Parse(principal.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var order = await db.Orders
        .Where(o => o.Id == id && o.UserId == userId)       // dono na própria consulta
        .Select(o => new OrderDto(o.Id, o.TotalCents, o.Status))
        .FirstOrDefaultAsync();
    return order is null ? Results.NotFound() : Results.Ok(order);
});

// SQL bruto: FromSql com interpolação é parametrizado; FromSqlRaw com concatenação NÃO é
var list = await db.Orders.FromSql($"SELECT * FROM orders WHERE user_id = {userId}").ToListAsync();
```

Filtro global por tenant: `modelBuilder.Entity<Order>().HasQueryFilter(o => o.TenantId == _tenant.Id);`.

## 5. Validação e DTOs (IA-09, API-04)

```csharp
public sealed record UpdateProfileRequest(
    [property: Required, StringLength(100, MinimumLength = 1)] string Name,
    [property: StringLength(500)] string? Bio);

public sealed record ProfileResponse(Guid Id, string Name, string? Bio);
```

- Nunca faça bind direto na entidade EF (`[FromBody] User user`): permite enviar `Role`, `Balance`.
- Em Minimal APIs, valide com FluentValidation ou um filtro de endpoint (no .NET 8 os DataAnnotations não são validados automaticamente em Minimal APIs).
- Rejeite campos desconhecidos: `JsonSerializerOptions.UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow` (.NET 8+).

## 6. JWT (API-03)

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true, ValidIssuer = "minha-api",
            ValidateAudience = true, ValidAudience = "minha-app",
            ValidateLifetime = true, ClockSkew = TimeSpan.FromSeconds(30),
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha256 }, // algoritmo fixo
        };
    });
```

Cookies de sessão: `options.Cookie.HttpOnly = true; SecurePolicy = CookieSecurePolicy.Always; SameSite = SameSiteMode.Lax;`.

## 7. Rate limit (API-02, API-05)

```csharp
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    o.AddPolicy("login", ctx => RateLimitPartition.GetFixedWindowLimiter(
        ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 10, Window = TimeSpan.FromMinutes(15) }));
});

app.UseRateLimiter();
app.MapPost("/api/login", Login).AllowAnonymous().RequireRateLimiting("login");
```

Limite de corpo: `builder.WebHost.ConfigureKestrel(k => k.Limits.MaxRequestBodySize = 1_000_000);`. Atrás de proxy, configure `ForwardedHeaders` para obter o IP real.

## 8. Timeouts e resiliência (API-12, API-13)

```csharp
builder.Services.AddHttpClient("psp", c =>
{
    c.BaseAddress = new Uri(paymentOptions.ApiBaseUrl);
    c.Timeout = TimeSpan.FromSeconds(10);
})
.AddStandardResilienceHandler(); // Microsoft.Extensions.Http.Resilience: retry com backoff+jitter, circuit breaker, timeout por tentativa
```

O retry padrão só deve ser usado em operações idempotentes ou com `Idempotency-Key`. EF Core: `options.UseNpgsql(cs, o => o.CommandTimeout(30))`.

## 9. Dinheiro (FIN-01, FIN-07)

```csharp
decimal price = 19.90m;                                  // decimal, nunca double
decimal total = Math.Round(price * 3, 2, MidpointRounding.AwayFromZero); // arredonde uma vez

static long[] SplitCents(long total, int parts)
{
    long @base = total / parts, rest = total % parts;
    return Enumerable.Range(0, parts).Select(i => @base + (i < rest ? 1 : 0)).ToArray();
}
```

EF Core: `[Precision(19, 4)] public decimal Amount { get; set; }` ou `long AmountCents`. Exibição: `total.ToString("C", new CultureInfo("pt-BR"))`.

## 10. Débito atômico e transação (FIN-02, API-15)

```csharp
public async Task TransferAsync(Guid from, Guid to, long amountCents, string referenceId)
{
    await using var tx = await _db.Database.BeginTransactionAsync();

    int debited = await _db.Accounts
        .Where(a => a.Id == from && a.BalanceCents >= amountCents)
        .ExecuteUpdateAsync(s => s.SetProperty(a => a.BalanceCents, a => a.BalanceCents - amountCents));
    if (debited == 0) throw new InsufficientFundsException();

    await _db.Accounts.Where(a => a.Id == to)
        .ExecuteUpdateAsync(s => s.SetProperty(a => a.BalanceCents, a => a.BalanceCents + amountCents));

    _db.LedgerEntries.AddRange(
        new LedgerEntry(referenceId, from, -amountCents),
        new LedgerEntry(referenceId, to, amountCents));
    await _db.SaveChangesAsync();
    await tx.CommitAsync();
}
```

`ExecuteUpdateAsync` existe no EF Core 7+. Lock otimista: propriedade `[Timestamp]`/`IsRowVersion()` ou `xmin` no Npgsql.

## 11. Webhooks (API-18, FIN-04)

```csharp
app.MapPost("/webhooks/pagamento", async (HttpRequest req, AppDb db, IOptions<PaymentOptions> opt) =>
{
    using var ms = new MemoryStream();
    await req.Body.CopyToAsync(ms);
    byte[] raw = ms.ToArray(); // corpo bruto

    byte[] expected = HMACSHA256.HashData(Encoding.UTF8.GetBytes(opt.Value.WebhookSecret), raw);
    byte[] received;
    try { received = Convert.FromHexString(req.Headers["X-Signature"].ToString()); }
    catch (FormatException) { return Results.BadRequest(); }
    if (!CryptographicOperations.FixedTimeEquals(expected, received)) return Results.BadRequest();

    var evt = JsonSerializer.Deserialize<PaymentEvent>(raw)!;
    await using var tx = await db.Database.BeginTransactionAsync();
    int inserted = await db.Database.ExecuteSqlAsync(
        $"INSERT INTO processed_events (provider, event_id) VALUES ('psp', {evt.Id}) ON CONFLICT DO NOTHING");
    if (inserted == 1 && evt.Type == "payment.succeeded")
        await db.Orders.Where(o => o.PaymentId == evt.PaymentId && o.Status == "pending")
            .ExecuteUpdateAsync(s => s.SetProperty(o => o.Status, "paid"));
    await tx.CommitAsync();
    return Results.Ok();
}).AllowAnonymous();
```

## 12. Erros, logs e configuração (IA-10, API-17, API-09)

```csharp
builder.Services.AddProblemDetails();
app.UseExceptionHandler(); // em produção, respostas genéricas sem stack trace

if (!app.Environment.IsDevelopment()) app.UseHsts();
app.UseHttpsRedirection();

builder.Services.AddCors(o => o.AddPolicy("web", p => p
    .WithOrigins("https://app.exemplo.com.br") // nunca AllowAnyOrigin com AllowCredentials
    .AllowCredentials().AllowAnyHeader().WithMethods("GET", "POST", "PATCH", "DELETE")));
```

- Logs estruturados (Serilog/Microsoft.Extensions.Logging): nunca logue o objeto inteiro de requisição; use destructuring policies ou `[LogProperties]` com campos selecionados; `Microsoft.Extensions.Compliance.Redaction` para dados sensíveis.
- `UseDeveloperExceptionPage` só em desenvolvimento.

## 13. Ferramentas
- Código: analisadores do SDK (`<AnalysisLevel>latest-recommended</AnalysisLevel>`), Security Code Scan, Semgrep (`p/csharp`), SonarQube.
- Dependências: `dotnet list package --vulnerable --include-transitive`, lock files (`RestorePackagesWithLockFile`), Dependabot.
- Testes: xUnit/NUnit, `WebApplicationFactory` para testes de integração, Testcontainers (Postgres/SQL Server reais), FsCheck (propriedades), Stryker.NET (mutação), NBomber/k6 (carga).
