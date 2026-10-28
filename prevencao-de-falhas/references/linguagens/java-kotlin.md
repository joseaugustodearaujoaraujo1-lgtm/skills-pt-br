# Java / Kotlin (Spring Boot)

Exemplos de correção para os IDs desta skill com Spring Boot 3, Spring Security 6, Spring Data JPA e Jakarta Validation. Kotlin usa as mesmas APIs; há notas no final. Os exemplos não foram compilados aqui: confira imports e versões no projeto.

## Sumário
1. Configuração validada no boot — OPS-08, IA-01
2. Senhas — IA-07
3. Autenticação por padrão e papéis — IA-03, API-06, FE-04
4. Filtro pelo dono e SQL parametrizado — API-01, IA-08
5. Validação e DTOs — IA-09, API-04
6. JWT — API-03
7. Timeouts e resiliência — API-12, API-13
8. Dinheiro — FIN-01, FIN-07
9. Débito atômico e transação — FIN-02, API-15
10. Webhooks — API-18, FIN-04
11. Erros e logs — IA-10, API-17
12. Kotlin
13. Ferramentas

---

## 1. Configuração validada no boot (OPS-08, IA-01)

```java
@Validated
@ConfigurationProperties(prefix = "app")
public record AppProperties(
    @NotBlank String jwtIssuer,
    @NotBlank @Size(min = 32) String jwtSecret,
    @NotEmpty List<String> allowedOrigins
) {}
```

Ative com `@EnableConfigurationProperties(AppProperties.class)`. Se faltar valor, a aplicação não sobe. Segredos via variáveis de ambiente ou Vault/Secrets Manager, nunca em `application.yml` versionado.

## 2. Senhas (IA-07)

```java
@Bean
PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12); // ou Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8()
}

// cadastro
user.setPasswordHash(passwordEncoder.encode(rawPassword));
// login
boolean ok = passwordEncoder.matches(rawPassword, user.getPasswordHash());
```

## 3. Autenticação por padrão e papéis (IA-03, API-06, FE-04)

```java
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain api(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/login", "/api/signup").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()) // nega por padrão
            .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .build();
    }
}

// checagem também no método, perto da regra de negócio
@PreAuthorize("hasRole('ADMIN')")
public void deleteUser(UUID id) { ... }
```

## 4. Filtro pelo dono e SQL parametrizado (API-01, IA-08)

```java
public interface OrderRepository extends JpaRepository<Order, UUID> {
    Optional<Order> findByIdAndUserId(UUID id, UUID userId); // nunca só findById(id)
}

@GetMapping("/api/orders/{id}")
public OrderDto get(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) {
    UUID userId = UUID.fromString(jwt.getSubject()); // vem do token, não do corpo
    return orders.findByIdAndUserId(id, userId)
        .map(OrderDto::from)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
}

// SQL nativo: sempre parâmetros
jdbcTemplate.query("SELECT id, total_cents FROM orders WHERE user_id = ?", mapper, userId);
// ERRADO: "SELECT ... WHERE id = '" + id + "'"
```

## 5. Validação e DTOs (IA-09, API-04)

```java
public record UpdateProfileRequest(
    @NotBlank @Size(max = 100) String name,
    @Size(max = 500) String bio
) {}

public record ProfileResponse(UUID id, String name, String bio) {
    static ProfileResponse from(User u) { return new ProfileResponse(u.getId(), u.getName(), u.getBio()); }
}

@PatchMapping("/api/me")
public ProfileResponse update(@Valid @RequestBody UpdateProfileRequest req, @AuthenticationPrincipal Jwt jwt) {
    User user = users.updateProfile(UUID.fromString(jwt.getSubject()), req.name(), req.bio());
    return ProfileResponse.from(user);
}
```

- Nunca receba a entidade JPA no `@RequestBody` (permite mass assignment de `role`, `balance`).
- Rejeite campos desconhecidos: `spring.jackson.deserialization.fail-on-unknown-properties=true`.
- Nunca serialize a entidade direto na resposta.

## 6. JWT (API-03)

Prefira o Resource Server do Spring com um provedor de identidade (Keycloak, Auth0, Cognito). Com chave simétrica própria:

```java
@Bean
JwtDecoder jwtDecoder(AppProperties props) {
    SecretKey key = new SecretKeySpec(props.jwtSecret().getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();
    OAuth2TokenValidator<Jwt> validators = new DelegatingOAuth2TokenValidator<>(
        JwtValidators.createDefaultWithIssuer(props.jwtIssuer()), // valida exp, nbf e iss
        new JwtClaimValidator<List<String>>("aud", aud -> aud != null && aud.contains("minha-app")));
    decoder.setJwtValidator(validators);
    return decoder;
}
```

## 7. Timeouts e resiliência (API-12, API-13)

```java
HttpClient http = HttpClient.newBuilder()
    .connectTimeout(Duration.ofSeconds(2))
    .followRedirects(HttpClient.Redirect.NEVER)
    .build();

HttpRequest request = HttpRequest.newBuilder(URI.create(url))
    .timeout(Duration.ofSeconds(5)) // timeout da resposta
    .GET().build();
```

- `RestClient`/`WebClient`: configure timeouts na fábrica de requisições.
- Retry com backoff e circuit breaker: Resilience4j (`@Retry`, `@CircuitBreaker`) ou Spring Retry com `@Backoff(delay = 500, multiplier = 2, random = true)`, só em operações idempotentes.
- Banco: `spring.datasource.hikari.connection-timeout` e `jakarta.persistence.query.timeout`.

## 8. Dinheiro (FIN-01, FIN-07)

```java
BigDecimal price = new BigDecimal("19.90");          // sempre de String, nunca new BigDecimal(19.9)
BigDecimal total = price.multiply(BigDecimal.valueOf(3));
BigDecimal rounded = total.setScale(2, RoundingMode.HALF_UP); // arredonde uma vez, no fim

static long[] splitCents(long total, int parts) {
    long base = total / parts, rest = total % parts;
    long[] out = new long[parts];
    for (int i = 0; i < parts; i++) out[i] = base + (i < rest ? 1 : 0);
    return out;
}
```

Comparação: `a.compareTo(b) == 0` (não `equals`, que considera a escala). JPA: `@Column(precision = 19, scale = 4) BigDecimal amount` ou `long amountCents`. Biblioteca com moeda: Joda-Money ou JSR 354 (Moneta).

## 9. Débito atômico e transação (FIN-02, API-15)

```java
public interface AccountRepository extends JpaRepository<Account, UUID> {
    @Modifying
    @Query("UPDATE Account a SET a.balanceCents = a.balanceCents - :amount " +
           "WHERE a.id = :id AND a.balanceCents >= :amount")
    int debit(@Param("id") UUID id, @Param("amount") long amount);

    @Modifying
    @Query("UPDATE Account a SET a.balanceCents = a.balanceCents + :amount WHERE a.id = :id")
    int credit(@Param("id") UUID id, @Param("amount") long amount);
}

@Transactional
public void transfer(UUID from, UUID to, long amountCents, String referenceId) {
    if (accounts.debit(from, amountCents) == 0) throw new InsufficientFundsException();
    accounts.credit(to, amountCents);
    ledger.saveAll(List.of(
        new LedgerEntry(referenceId, from, -amountCents),
        new LedgerEntry(referenceId, to, amountCents)));
}
```

Alternativas: lock pessimista (`@Lock(LockModeType.PESSIMISTIC_WRITE)` numa consulta), lock otimista (`@Version`). Lembre: `@Transactional` só funciona em chamadas vindas de fora do bean (proxy).

## 10. Webhooks (API-18, FIN-04)

```java
static boolean validSignature(byte[] rawBody, String signatureHex, byte[] secret) throws GeneralSecurityException {
    Mac mac = Mac.getInstance("HmacSHA256");
    mac.init(new SecretKeySpec(secret, "HmacSHA256"));
    byte[] expected = mac.doFinal(rawBody);
    byte[] received = HexFormat.of().parseHex(signatureHex);
    return MessageDigest.isEqual(expected, received); // tempo constante
}

@PostMapping(value = "/webhooks/pagamento", consumes = MediaType.APPLICATION_JSON_VALUE)
@Transactional
public ResponseEntity<Void> webhook(@RequestBody byte[] raw, @RequestHeader("X-Signature") String sig) throws Exception {
    if (!validSignature(raw, sig, secret)) return ResponseEntity.badRequest().build();
    PaymentEvent event = objectMapper.readValue(raw, PaymentEvent.class);
    int inserted = jdbcTemplate.update(
        "INSERT INTO processed_events (provider, event_id) VALUES ('psp', ?) ON CONFLICT DO NOTHING", event.id());
    if (inserted == 1 && "payment.succeeded".equals(event.type())) {
        orderService.markPaid(event.paymentId());
    }
    return ResponseEntity.ok().build();
}
```

`ON CONFLICT` é sintaxe do Postgres; no MySQL use `INSERT IGNORE`. `HexFormat` existe a partir do Java 17.

## 11. Erros e logs (IA-10, API-17)

```java
@RestControllerAdvice
class GlobalErrors {
    private static final Logger log = LoggerFactory.getLogger(GlobalErrors.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail invalid(MethodArgumentNotValidException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.UNPROCESSABLE_ENTITY, "Dados inválidos");
    }

    @ExceptionHandler(Exception.class)
    ProblemDetail unexpected(Exception e) {
        String errorId = UUID.randomUUID().toString();
        log.error("erro não tratado {}", errorId, e);
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno");
        pd.setProperty("errorId", errorId);
        return pd;
    }
}
```

- `server.error.include-stacktrace=never` e `server.error.include-message=never` em produção.
- Actuator: exponha só `health` publicamente (`management.endpoints.web.exposure.include=health`).
- Logs: não logue DTOs inteiros com dados sensíveis; use `toString()` que omite campos sensíveis ou máscara no Logback (`%replace`) / Logstash encoder com masking.

## 12. Kotlin

- Mesmas APIs do Spring; DTOs como `data class` com anotações `@field:NotBlank`, `@field:Size(max = 100)` (o `field:` é necessário para a validação funcionar).
- Dinheiro: `BigDecimal("19.90")`; nunca `Double`.
- Coroutines: use `withTimeout(5_000) { ... }` em chamadas externas.
- Android: segredos não ficam no APK (é descompilável); tokens no `EncryptedSharedPreferences`/Keystore; validação sempre no servidor.

## 13. Ferramentas
- Código: SpotBugs + FindSecBugs, Semgrep (`p/java`, `p/kotlin`), SonarQube, Error Prone.
- Dependências: OWASP Dependency-Check, `gradle dependencies --write-locks` / Maven Enforcer, Dependabot.
- Testes: JUnit 5, Testcontainers (Postgres real para testar locks e concorrência), jqwik (propriedades), PIT (mutação), Gatling/k6 (carga).
