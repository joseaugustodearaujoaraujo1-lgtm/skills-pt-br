# PHP (Laravel e PHP puro)

Exemplos de correção para os IDs desta skill com Laravel 10+ e notas para PHP puro (PDO). Os exemplos não foram executados aqui: confira namespaces e versões.

## Sumário
1. Configuração e segredos — IA-01, OPS-08, API-09
2. Senhas — IA-07
3. Autenticação por padrão, dono do recurso e papéis — IA-03, API-01, API-06
4. SQL parametrizado — IA-08
5. Validação e mass assignment — IA-09, API-04
6. Rate limit — API-02, API-05
7. Timeouts e retry — API-12, API-13
8. Dinheiro — FIN-01, FIN-07
9. Débito atômico e transação — FIN-02, API-15
10. Webhooks — API-18, FIN-04
11. XSS — IA-08, FE-02
12. Uploads — API-16
13. Ferramentas

---

## 1. Configuração e segredos (IA-01, OPS-08, API-09)

- `.env` fora do repositório; `APP_DEBUG=false` e `APP_ENV=production` em produção (debug ligado expõe variáveis e stack traces).
- Leia `env()` só nos arquivos de `config/` e use `config('servico.chave')` no código (com `php artisan config:cache`, `env()` fora de `config/` retorna `null`).
- Falhe cedo se faltar configuração crítica, por exemplo num service provider:

```php
public function boot(): void
{
    foreach (['services.psp.secret', 'services.psp.webhook_secret'] as $key) {
        if (blank(config($key))) {
            throw new RuntimeException("Configuração obrigatória ausente: {$key}");
        }
    }
}
```

## 2. Senhas (IA-07)

```php
// Laravel
$user->password = Hash::make($request->input('password')); // bcrypt/argon2 conforme config/hashing.php
$ok = Hash::check($plain, $user->password);

// PHP puro
$hash = password_hash($plain, PASSWORD_ARGON2ID); // ou PASSWORD_BCRYPT
$ok = password_verify($plain, $hash);
```

Nunca `md5()`, `sha1()` ou `hash('sha256', ...)` para senha.

## 3. Autenticação por padrão, dono do recurso e papéis (IA-03, API-01, API-06)

```php
// routes/api.php
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');

Route::middleware('auth:sanctum')->group(function () { // tudo aqui exige login
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::delete('/admin/users/{user}', [AdminController::class, 'destroy'])->can('delete', 'user');
});

// OrderController
public function show(Request $request, string $id)
{
    // busca dentro das ordens do próprio usuário: 404 se for de outro
    $order = $request->user()->orders()->findOrFail($id);
    return new OrderResource($order);
}
```

- Policies (`php artisan make:policy`) para regras de autorização por recurso; `$this->authorize('update', $post)`.
- Route model binding sozinho (`Order $order`) **não** checa o dono; combine com policy ou escopo.

## 4. SQL parametrizado (IA-08)

```php
// ERRADO
// DB::select("SELECT * FROM orders WHERE id = " . $request->id);

$rows = DB::select('SELECT id, total_cents FROM orders WHERE user_id = ?', [$userId]);
$orders = Order::where('user_id', $userId)->whereRaw('status = ?', [$status])->get();

// PHP puro (PDO)
$pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]);
$stmt = $pdo->prepare('SELECT id, total_cents FROM orders WHERE id = :id AND user_id = :uid');
$stmt->execute(['id' => $id, 'uid' => $userId]);
```

Nomes de coluna dinâmicos (ordenação): só via allowlist (`in_array($sort, ['created_at', 'total'], true)`).

## 5. Validação e mass assignment (IA-09, API-04)

```php
class UpdateProfileRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:1', 'max:100'],
            'bio'  => ['nullable', 'string', 'max:500'],
        ];
    }
}

public function update(UpdateProfileRequest $request)
{
    $request->user()->update($request->validated()); // só os campos validados, nunca $request->all()
    return new ProfileResource($request->user());     // Resource controla o que sai
}

class User extends Model
{
    protected $fillable = ['name', 'bio'];                 // allowlist; role/balance ficam de fora
    protected $hidden = ['password', 'remember_token'];    // nunca serializados
}
```

Evite `protected $guarded = [];` (libera tudo).

## 6. Rate limit (API-02, API-05)

```php
// AppServiceProvider::boot()
RateLimiter::for('login', function (Request $request) {
    return [
        Limit::perMinute(5)->by($request->ip()),
        Limit::perMinute(5)->by(strtolower((string) $request->input('email'))),
    ];
});
```

Paginação com limite: `Order::where(...)->paginate(min((int) $request->input('per_page', 20), 100));`.

## 7. Timeouts e retry (API-12, API-13)

```php
$response = Http::connectTimeout(2)
    ->timeout(5)
    ->retry(3, fn (int $attempt) => (2 ** $attempt) * 100 + random_int(0, 100), throw: false) // backoff + jitter
    ->withHeaders(['Idempotency-Key' => "order-{$order->id}"])
    ->post($url, $payload);
```

Com Guzzle puro: `['timeout' => 5, 'connect_timeout' => 2]`. Só faça retry de escrita com chave de idempotência.

## 8. Dinheiro (FIN-01, FIN-07)

```php
use Brick\Money\Money;

$price = Money::of('19.90', 'BRL');               // string, nunca float
$total = $price->multipliedBy(3);
[$a, $b, $c] = Money::of('100.00', 'BRL')->split(3); // 33,34 + 33,33 + 33,33, sem perder centavo
echo $total->formatTo('pt_BR');
```

Sem biblioteca: inteiros em centavos e `intdiv`. No banco: `DECIMAL(19,4)` ou `BIGINT` em centavos (cast `'decimal:2'` no Eloquent retorna string; não converta para float).

## 9. Débito atômico e transação (FIN-02, API-15)

```php
DB::transaction(function () use ($fromId, $toId, $amountCents, $referenceId) {
    $debited = DB::table('accounts')
        ->where('id', $fromId)
        ->where('balance_cents', '>=', $amountCents)
        ->decrement('balance_cents', $amountCents); // UPDATE atômico; retorna linhas afetadas

    if ($debited === 0) {
        throw new InsufficientFundsException();
    }

    DB::table('accounts')->where('id', $toId)->increment('balance_cents', $amountCents);

    DB::table('ledger_entries')->insert([
        ['reference_id' => $referenceId, 'account_id' => $fromId, 'amount_cents' => -$amountCents],
        ['reference_id' => $referenceId, 'account_id' => $toId, 'amount_cents' => $amountCents],
    ]);
});
```

Lock explícito quando precisar ler antes: `Account::whereKey($id)->lockForUpdate()->first()` dentro da transação.

## 10. Webhooks (API-18, FIN-04)

```php
public function handle(Request $request)
{
    $raw = $request->getContent(); // corpo bruto
    $expected = hash_hmac('sha256', $raw, config('services.psp.webhook_secret'));
    if (! hash_equals($expected, (string) $request->header('X-Signature'))) { // tempo constante
        abort(400, 'Assinatura inválida');
    }

    $event = json_decode($raw, true, flags: JSON_THROW_ON_ERROR);

    DB::transaction(function () use ($event) {
        $inserted = DB::table('processed_events')->insertOrIgnore([
            'provider' => 'psp',
            'event_id' => $event['id'],
        ]);
        if ($inserted === 1 && $event['type'] === 'payment.succeeded') {
            Order::where('payment_id', $event['data']['id'])
                ->where('status', 'pending')
                ->update(['status' => 'paid']);
        }
    });

    return response()->noContent();
}
```

Exclua a rota de webhook da verificação CSRF (ela é autenticada pela assinatura). Para Stripe, use `Stripe\Webhook::constructEvent`.

## 11. XSS (IA-08, FE-02)

- Blade: `{{ $valor }}` escapa; `{!! $valor !!}` **não** escapa — só para HTML já sanitizado.
- Sanitização de HTML de usuário: `mews/purifier` (HTML Purifier) ou `symfony/html-sanitizer`.
- PHP puro: `htmlspecialchars($valor, ENT_QUOTES | ENT_HTML5, 'UTF-8')` em toda saída.

## 12. Uploads (API-16)

```php
$request->validate([
    'avatar' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'], // KB; checa o tipo real
]);

$path = $request->file('avatar')->store("avatars/{$request->user()->id}", 'private'); // nome aleatório
$url = Storage::disk('private')->temporaryUrl($path, now()->addMinutes(10));    // URL assinada
```

Nunca salve uploads dentro de `public/` com o nome original.

## 13. Ferramentas
- Código: PHPStan / Larastan (nível alto), Psalm (com análise de taint), Semgrep (`p/php`, `p/laravel`), Enlightn.
- Dependências: `composer audit`, `composer.lock` versionado, Dependabot.
- Testes: PHPUnit/Pest com `RefreshDatabase`, testes HTTP (`$this->actingAs($userA)->getJson("/api/orders/{$pedidoDeB->id}")->assertNotFound()`), Infection (mutação).
