# Go

Exemplos de correção para os IDs desta skill com a biblioteca padrão (`net/http`, `database/sql`, `log/slog`) e pacotes maduros (`golang.org/x/crypto`, `pgx`, `go-playground/validator`, `golang-jwt/jwt/v5`). Os exemplos não foram compilados aqui: confira imports e versões.

## Sumário
1. Configuração validada no boot — OPS-08, IA-01
2. Senhas — IA-07
3. Autenticação por padrão e dono do recurso — IA-03, API-01, IA-08
4. Validação e DTOs — IA-09, API-04
5. JWT — API-03
6. Timeouts — API-12
7. Retry com backoff — API-13
8. Dinheiro — FIN-01, FIN-07
9. Débito atômico e transação — FIN-02, API-15
10. Webhooks — API-18, FIN-04
11. SSRF com checagem na conexão — API-08
12. Erros e logs — IA-10, API-17
13. Ferramentas

---

## 1. Configuração validada no boot (OPS-08, IA-01)

```go
type Config struct {
	DatabaseURL   string `env:"DATABASE_URL,required"`
	JWTSecret     string `env:"JWT_SECRET,required"`
	WebhookSecret string `env:"WEBHOOK_SECRET,required"`
}

func mustLoadConfig() Config {
	var c Config
	if err := env.Parse(&c); err != nil { // github.com/caarlos0/env
		log.Fatalf("configuração inválida: %v", err)
	}
	if len(c.JWTSecret) < 32 {
		log.Fatal("JWT_SECRET precisa de pelo menos 32 caracteres")
	}
	return c
}
```

## 2. Senhas (IA-07)

```go
import "golang.org/x/crypto/bcrypt"

func HashPassword(plain string) ([]byte, error) {
	return bcrypt.GenerateFromPassword([]byte(plain), 12)
}

func VerifyPassword(hash []byte, plain string) bool {
	return bcrypt.CompareHashAndPassword(hash, []byte(plain)) == nil
}
```

Alternativa: `golang.org/x/crypto/argon2` (`argon2.IDKey`) com salt aleatório.

## 3. Autenticação por padrão e dono do recurso (IA-03, API-01, IA-08)

```go
func main() {
	public := http.NewServeMux()
	public.HandleFunc("POST /api/login", login)

	private := http.NewServeMux()
	private.HandleFunc("GET /api/orders/{id}", getOrder)
	private.Handle("DELETE /api/admin/users/{id}", requireRole("admin", http.HandlerFunc(deleteUser)))

	root := http.NewServeMux()
	root.Handle("/api/login", public)
	root.Handle("/", requireUser(private)) // todo o resto exige login

	srv := &http.Server{
		Addr:              ":8080",
		Handler:           root,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
	}
	log.Fatal(srv.ListenAndServe())
}

func getOrder(w http.ResponseWriter, r *http.Request) {
	user := userFrom(r.Context()) // definido pelo middleware a partir do token
	var o OrderDTO
	err := db.QueryRowContext(r.Context(),
		`SELECT id, total_cents, status FROM orders WHERE id = $1 AND user_id = $2`, // parâmetros, nunca fmt.Sprintf
		r.PathValue("id"), user.ID,
	).Scan(&o.ID, &o.TotalCents, &o.Status)
	if errors.Is(err, sql.ErrNoRows) {
		http.Error(w, "Pedido não encontrado", http.StatusNotFound)
		return
	}
	if err != nil {
		internalError(w, r, err)
		return
	}
	writeJSON(w, http.StatusOK, o)
}
```

Os padrões `"GET /path/{id}"` e `r.PathValue` exigem Go 1.22+. Com chi/gin/echo, a ideia é a mesma: grupo de rotas protegido por middleware.

## 4. Validação e DTOs (IA-09, API-04)

```go
type UpdateProfileRequest struct {
	Name string  `json:"name" validate:"required,min=1,max=100"`
	Bio  *string `json:"bio" validate:"omitempty,max=500"`
}

func decodeStrict(r *http.Request, dst any) error {
	r.Body = http.MaxBytesReader(nil, r.Body, 1<<20) // limite de 1 MB
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields() // rejeita role, balance etc.
	if err := dec.Decode(dst); err != nil {
		return err
	}
	return validate.Struct(dst) // github.com/go-playground/validator/v10
}
```

Use structs de resposta separadas das structs do banco; campos internos com `json:"-"`.

## 5. JWT (API-03)

```go
import "github.com/golang-jwt/jwt/v5"

func parseToken(raw string, secret []byte) (*jwt.RegisteredClaims, error) {
	claims := &jwt.RegisteredClaims{}
	_, err := jwt.ParseWithClaims(raw, claims,
		func(t *jwt.Token) (any, error) { return secret, nil },
		jwt.WithValidMethods([]string{"HS256"}), // algoritmo fixo
		jwt.WithIssuer("minha-api"),
		jwt.WithAudience("minha-app"),
		jwt.WithExpirationRequired(),
	)
	if err != nil {
		return nil, err
	}
	return claims, nil
}
```

## 6. Timeouts (API-12)

```go
var httpClient = &http.Client{
	Timeout: 10 * time.Second, // o padrão é SEM timeout
	CheckRedirect: func(*http.Request, []*http.Request) error {
		return http.ErrUseLastResponse // não segue redirects automaticamente
	},
}

func callPartner(ctx context.Context, url string) (*http.Response, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	return httpClient.Do(req)
}
```

Banco: sempre `QueryContext`/`ExecContext` com contexto que tem prazo; `db.SetMaxOpenConns`, `SetConnMaxLifetime`.

## 7. Retry com backoff (API-13)

```go
// Use só para leituras ou escritas com Idempotency-Key.
func withRetry(ctx context.Context, attempts int, fn func() error) error {
	var err error
	for i := 0; i < attempts; i++ {
		if err = fn(); err == nil {
			return nil
		}
		capDelay := time.Duration(math.Min(float64(time.Second)*math.Pow(2, float64(i)), float64(10*time.Second)))
		delay := capDelay/2 + time.Duration(rand.Int64N(int64(capDelay/2)+1)) // jitter
		select {
		case <-time.After(delay):
		case <-ctx.Done():
			return ctx.Err()
		}
	}
	return err
}
```

`rand.Int64N` é de `math/rand/v2` (Go 1.22+). Circuit breaker: `github.com/sony/gobreaker`.

## 8. Dinheiro (FIN-01, FIN-07)

```go
type Cents int64 // nunca float64 para dinheiro

func SplitCents(total Cents, parts int) []Cents {
	base, rest := total/Cents(parts), total%Cents(parts)
	out := make([]Cents, parts)
	for i := range out {
		out[i] = base
		if Cents(i) < rest {
			out[i]++
		}
	}
	return out
}
```

Para juros e percentuais: `github.com/shopspring/decimal` (`decimal.RequireFromString("19.90")`), arredondando uma vez com `Round(2)`.

## 9. Débito atômico e transação (FIN-02, API-15)

```go
var ErrInsufficientFunds = errors.New("saldo insuficiente")

func Transfer(ctx context.Context, db *sql.DB, from, to string, amount Cents, ref string) error {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback() // sem efeito se Commit já ocorreu

	res, err := tx.ExecContext(ctx,
		`UPDATE accounts SET balance_cents = balance_cents - $1 WHERE id = $2 AND balance_cents >= $1`,
		amount, from)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return ErrInsufficientFunds
	}
	if _, err = tx.ExecContext(ctx,
		`UPDATE accounts SET balance_cents = balance_cents + $1 WHERE id = $2`, amount, to); err != nil {
		return err
	}
	if _, err = tx.ExecContext(ctx,
		`INSERT INTO ledger_entries (reference_id, account_id, amount_cents) VALUES ($1, $2, $3), ($1, $4, $5)`,
		ref, from, -amount, to, amount); err != nil {
		return err
	}
	return tx.Commit()
}
```

## 10. Webhooks (API-18, FIN-04)

```go
func validSignature(raw []byte, sigHex string, secret []byte) bool {
	mac := hmac.New(sha256.New, secret)
	mac.Write(raw)
	received, err := hex.DecodeString(sigHex)
	return err == nil && hmac.Equal(mac.Sum(nil), received) // tempo constante
}

func webhook(w http.ResponseWriter, r *http.Request) {
	raw, err := io.ReadAll(http.MaxBytesReader(w, r.Body, 1<<20))
	if err != nil || !validSignature(raw, r.Header.Get("X-Signature"), webhookSecret) {
		http.Error(w, "assinatura inválida", http.StatusBadRequest)
		return
	}
	var evt PaymentEvent
	if err := json.Unmarshal(raw, &evt); err != nil {
		http.Error(w, "payload inválido", http.StatusBadRequest)
		return
	}
	tx, err := db.BeginTx(r.Context(), nil)
	if err != nil {
		internalError(w, r, err)
		return
	}
	defer tx.Rollback()
	res, err := tx.ExecContext(r.Context(),
		`INSERT INTO processed_events (provider, event_id) VALUES ('psp', $1) ON CONFLICT DO NOTHING`, evt.ID)
	if err != nil {
		internalError(w, r, err)
		return
	}
	if n, _ := res.RowsAffected(); n == 1 && evt.Type == "payment.succeeded" {
		if _, err := tx.ExecContext(r.Context(),
			`UPDATE orders SET status = 'paid' WHERE payment_id = $1 AND status = 'pending'`, evt.PaymentID); err != nil {
			internalError(w, r, err)
			return
		}
	}
	if err := tx.Commit(); err != nil {
		internalError(w, r, err)
		return
	}
	w.WriteHeader(http.StatusOK)
}
```

## 11. SSRF com checagem na conexão (API-08)

Em Go dá para validar o IP **no momento da conexão**, o que também fecha a brecha de DNS rebinding:

```go
func safeDialer() *net.Dialer {
	return &net.Dialer{
		Timeout: 5 * time.Second,
		Control: func(network, address string, _ syscall.RawConn) error {
			host, _, err := net.SplitHostPort(address)
			if err != nil {
				return err
			}
			ip, err := netip.ParseAddr(host)
			if err != nil {
				return err
			}
			ip = ip.Unmap()
			if !ip.IsGlobalUnicast() || ip.IsPrivate() || ip.IsLoopback() || ip.IsLinkLocalUnicast() {
				return fmt.Errorf("destino não permitido: %s", ip)
			}
			return nil
		},
	}
}

var fetchClient = &http.Client{
	Timeout:   10 * time.Second,
	Transport: &http.Transport{DialContext: safeDialer().DialContext, Proxy: nil},
}
```

Valide também o esquema (`http`/`https`) antes de chamar.

## 12. Erros e logs (IA-10, API-17)

```go
var logger = slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
	ReplaceAttr: func(_ []string, a slog.Attr) slog.Attr {
		switch strings.ToLower(a.Key) {
		case "password", "token", "authorization", "cookie", "cpf", "card_number":
			return slog.String(a.Key, "[REDACTED]")
		}
		return a
	},
}))

func internalError(w http.ResponseWriter, r *http.Request, err error) {
	id := uuid.NewString()
	logger.Error("erro não tratado", "error_id", id, "path", r.URL.Path, "err", err)
	http.Error(w, "Erro interno. Código: "+id, http.StatusInternalServerError)
}
```

Nunca ignore erros com `_ =` em operações que importam; trate ou propague com contexto (`fmt.Errorf("salvando pedido: %w", err)`). Recupere panics num middleware para não derrubar o processo.

## 13. Ferramentas
- Código: `go vet`, `staticcheck`, `gosec`, `golangci-lint`, Semgrep (`p/golang`), `go test -race` (detecta condições de corrida).
- Dependências: `govulncheck`, `go mod verify`, Dependabot.
- Testes: `testing` + `httptest`, Testcontainers-Go (banco real), fuzzing nativo (`go test -fuzz`), k6/vegeta (carga).
