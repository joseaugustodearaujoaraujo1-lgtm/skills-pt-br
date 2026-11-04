# Python (FastAPI, Django, Flask)

Exemplos de correção para os IDs desta skill. Os exemplos principais usam FastAPI, Pydantic v2, SQLAlchemy 2 e `httpx`; há notas para Django e Flask. Os princípios valem para qualquer framework.

## Sumário
1. Configuração validada no boot — IA-01, OPS-08
2. Senhas — IA-07
3. SQL parametrizado e filtro pelo dono — IA-08, API-01
4. Validação e allowlist de campos — IA-09, API-04
5. Autenticação por padrão, JWT e papéis — IA-03, API-03, API-06
6. Rate limit — API-02, API-05
7. Timeout, retry e backoff — API-12, API-13
8. Dinheiro — FIN-01, FIN-07
9. Débito atômico e transação — FIN-02, API-15
10. Webhooks e idempotência — API-18, FIN-04, FIN-03
11. SSRF — API-08
12. Logs e erros — API-17, IA-10
13. LLMs e agentes — AGT-04, AGT-05
14. Django e Flask
15. Testes
16. Ferramentas

---

## 1. Configuração validada no boot (IA-01, OPS-08)

```python
# config.py — falha ao iniciar se faltar algo
from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    environment: str = Field(pattern="^(development|test|production)$")
    database_url: str
    jwt_secret: SecretStr = Field(min_length=32)
    webhook_secret: SecretStr


settings = Settings()  # lê variáveis de ambiente / .env
```

`SecretStr` evita que o valor apareça em `repr()` e logs.

## 2. Senhas (IA-07)

```python
import bcrypt


def hash_password(plain: str) -> bytes:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt(rounds=12))


def verify_password(plain: str, stored_hash: bytes) -> bool:
    return bcrypt.checkpw(plain.encode(), stored_hash)
```

Alternativa: `argon2-cffi` (`PasswordHasher().hash()` / `.verify()`). Em Django, use o sistema de auth nativo (já usa PBKDF2/argon2).

## 3. SQL parametrizado e filtro pelo dono (IA-08, API-01)

```python
from fastapi import HTTPException
from sqlalchemy import select, text

# ERRADO: injeção e IDOR
# cursor.execute(f"SELECT * FROM orders WHERE id = {order_id}")


def get_order(session, order_id, current_user):
    order = session.scalar(
        select(Order).where(Order.id == order_id, Order.user_id == current_user.id)
    )
    if order is None:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    return order


# SQL bruto: sempre com parâmetros nomeados
def count_orders(session, user_id):
    return session.execute(
        text("SELECT count(*) FROM orders WHERE user_id = :uid"), {"uid": user_id}
    ).scalar_one()
```

## 4. Validação e allowlist de campos (IA-09, API-04)

```python
from pydantic import BaseModel, ConfigDict, Field


class UpdateProfile(BaseModel):
    model_config = ConfigDict(extra="forbid")  # rejeita role, balance, is_admin...
    name: str = Field(min_length=1, max_length=100)
    bio: str | None = Field(default=None, max_length=500)


class ProfileOut(BaseModel):  # DTO de saída: só o necessário
    id: int
    name: str
    bio: str | None


@app.patch("/me", response_model=ProfileOut)
def update_me(data: UpdateProfile, user=Depends(require_user), session=Depends(get_session)):
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    session.commit()
    return user
```

`response_model` garante que campos como `password_hash` não saiam na resposta.

## 5. Autenticação por padrão, JWT e papéis (IA-03, API-03, API-06)

```python
import jwt  # PyJWT
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request

ALGORITHM = "HS256"


def require_user(request: Request, session=Depends(get_session)):
    token = request.cookies.get("session")
    if not token:
        raise HTTPException(status_code=401, detail="Não autenticado")
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret.get_secret_value(),
            algorithms=[ALGORITHM],  # algoritmo fixo
            audience="minha-app",
            issuer="minha-api",
            options={"require": ["exp", "sub"]},
        )
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Sessão inválida ou expirada")
    user = session.get(User, int(payload["sub"]))
    if user is None:
        raise HTTPException(status_code=401, detail="Sessão inválida")
    return user


def require_role(role: str):
    def checker(user=Depends(require_user)):
        if user.role != role:
            raise HTTPException(status_code=403, detail="Sem permissão")
        return user
    return checker


app = FastAPI()
public = APIRouter()
private = APIRouter(dependencies=[Depends(require_user)])  # tudo aqui exige login
admin = APIRouter(dependencies=[Depends(require_role("admin"))])
# app.include_router(public); app.include_router(private); app.include_router(admin, prefix="/admin")
```

Cookie da sessão: `response.set_cookie("session", token, httponly=True, secure=True, samesite="lax", max_age=900)`.

## 6. Rate limit (API-02, API-05)

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address, storage_uri="redis://localhost:6379")


@app.post("/login")
@limiter.limit("10/15minutes")
def login(request: Request, data: LoginIn):
    ...
```

Com várias instâncias, use storage compartilhado (Redis). Limite também o tamanho do corpo no proxy (nginx `client_max_body_size`) ou no servidor ASGI.

## 7. Timeout, retry e backoff (API-12, API-13)

```python
import random
import time

import httpx

RETRYABLE = {429, 502, 503, 504}
client = httpx.Client(timeout=httpx.Timeout(5.0, connect=2.0))


def get_with_retry(url: str, retries: int = 3) -> httpx.Response:
    """Use só para leituras ou escritas com Idempotency-Key."""
    for attempt in range(retries + 1):
        try:
            response = client.get(url)
            if response.status_code not in RETRYABLE or attempt == retries:
                return response
        except httpx.TransportError:
            if attempt == retries:
                raise
        cap = min(2 ** attempt, 10)
        time.sleep(cap / 2 + random.random() * cap / 2)  # backoff exponencial com jitter
    raise RuntimeError("inalcançável")
```

`requests` não tem timeout padrão: sempre `requests.get(url, timeout=(2, 5))`. Para retry declarativo, `tenacity`.

## 8. Dinheiro (FIN-01, FIN-07)

```python
from decimal import ROUND_HALF_UP, Decimal

price = Decimal("19.90")  # sempre a partir de string, nunca Decimal(19.9)


def to_cents(value: Decimal) -> int:
    return int((value * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def split_cents(total: int, parts: int) -> list[int]:
    base, rest = divmod(total, parts)
    return [base + (1 if i < rest else 0) for i in range(parts)]


assert sum(split_cents(10000, 3)) == 10000  # [3334, 3333, 3333]
```

No banco: `Numeric(19, 4)` (SQLAlchemy) ou inteiros em centavos (`BigInteger`). Em Django: `DecimalField(max_digits=19, decimal_places=2)`. Biblioteca de dinheiro com moeda: `py-moneyed`.

## 9. Débito atômico e transação (FIN-02, API-15)

```python
from sqlalchemy import update


class InsufficientFunds(Exception):
    pass


def transfer(session, from_id: int, to_id: int, amount_cents: int, reference_id: str):
    with session.begin():  # commit no fim ou rollback em exceção
        result = session.execute(
            update(Account)
            .where(Account.id == from_id, Account.balance_cents >= amount_cents)
            .values(balance_cents=Account.balance_cents - amount_cents)
        )
        if result.rowcount == 0:
            raise InsufficientFunds()
        session.execute(
            update(Account)
            .where(Account.id == to_id)
            .values(balance_cents=Account.balance_cents + amount_cents)
        )
        session.add_all([
            LedgerEntry(reference_id=reference_id, account_id=from_id, amount_cents=-amount_cents),
            LedgerEntry(reference_id=reference_id, account_id=to_id, amount_cents=amount_cents),
        ])
```

Django: `with transaction.atomic(): Account.objects.filter(id=from_id, balance_cents__gte=amount).update(balance_cents=F("balance_cents") - amount)` e confira o retorno (linhas afetadas). Lock explícito: `select_for_update()`.

## 10. Webhooks e idempotência (API-18, FIN-04, FIN-03)

```python
import hashlib
import hmac
import json
import time

from sqlalchemy import update
from sqlalchemy.dialects.postgresql import insert


def verify_signature(raw_body: bytes, signature_hex: str, timestamp: str, secret: bytes) -> bool:
    if abs(time.time() - int(timestamp)) > 300:  # rejeita replay antigo
        return False
    expected = hmac.new(secret, f"{timestamp}.".encode() + raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature_hex)  # comparação em tempo constante


@app.post("/webhooks/pagamento")
async def payment_webhook(request: Request, session=Depends(get_session)):
    raw = await request.body()  # corpo bruto, antes de qualquer parse
    if not verify_signature(raw, request.headers.get("x-signature", ""),
                            request.headers.get("x-timestamp", "0"),
                            settings.webhook_secret.get_secret_value().encode()):
        raise HTTPException(status_code=400, detail="Assinatura inválida")
    event = json.loads(raw)
    with session.begin():
        inserted = session.execute(
            insert(ProcessedEvent)
            .values(provider="psp", event_id=event["id"])
            .on_conflict_do_nothing()
        )
        if inserted.rowcount == 1 and event["type"] == "payment.succeeded":
            session.execute(
                update(Order)
                .where(Order.payment_id == event["data"]["id"], Order.status == "pending")
                .values(status="paid")
            )
    return {"ok": True}
```

O formato exato da assinatura muda por provedor; use o SDK oficial quando existir (`stripe.Webhook.construct_event`). Para idempotência de requisições, use a tabela `idempotency_keys` de `sql-e-bancos.md` com a mesma lógica do exemplo em JS.

## 11. SSRF (API-08)

```python
import ipaddress
import socket
from urllib.parse import urlparse


def assert_public_url(raw: str) -> str:
    url = urlparse(raw)
    if url.scheme not in ("http", "https") or not url.hostname:
        raise ValueError("URL não permitida")
    for info in socket.getaddrinfo(url.hostname, url.port or 443):
        ip = ipaddress.ip_address(info[4][0])
        if ip.version == 6 and ip.ipv4_mapped:
            ip = ip.ipv4_mapped
        if not ip.is_global:  # cobre privado, loopback, link-local (169.254.x.x), reservado
            raise ValueError("Destino não permitido")
    return raw


# httpx.get(assert_public_url(user_url), follow_redirects=False, timeout=5)
```

Há uma janela entre a consulta DNS e a conexão (DNS rebinding); para recursos muito expostos, faça as buscas num serviço isolado sem acesso à rede interna.

## 12. Logs e erros (API-17, IA-10)

```python
import logging
import re
import uuid

from fastapi.responses import JSONResponse

SENSITIVE = re.compile(r"(password|senha|token|authorization|cpf|card)\S*", re.IGNORECASE)


class RedactFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        if isinstance(record.args, dict):
            record.args = {k: "[REDACTED]" if SENSITIVE.search(k) else v for k, v in record.args.items()}
        return True


logger = logging.getLogger("app")
logger.addFilter(RedactFilter())


@app.exception_handler(Exception)
async def unhandled(request: Request, exc: Exception):
    error_id = str(uuid.uuid4())
    logger.exception("erro não tratado %s em %s", error_id, request.url.path)
    return JSONResponse(status_code=500, content={"error": "Erro interno.", "error_id": error_id})
```

Nunca `except: pass`. Em produção: `DEBUG = False` (Django) / `debug=False` (Flask/FastAPI). Com `structlog`, use um processor de redaction.

## 13. LLMs e agentes (AGT-04, AGT-05)

```python
from typing import Literal, Union

from pydantic import BaseModel, Field, TypeAdapter, ValidationError


class LookupOrder(BaseModel):
    action: Literal["lookup_order"]
    order_id: int


class Escalate(BaseModel):
    action: Literal["escalate"]
    reason: str = Field(max_length=500)


AgentAction = TypeAdapter(Union[LookupOrder, Escalate])


def run_action(model_output: str, current_user):
    try:
        action = AgentAction.validate_json(model_output)  # saída do modelo é entrada não confiável
    except ValidationError:
        return escalate_to_human("Resposta do modelo inválida")
    if isinstance(action, LookupOrder):
        return get_order(session, action.order_id, current_user)  # dono checado pelo código
    return escalate_to_human(action.reason)


def run_agent(task, max_steps: int = 20, max_cost_usd: float = 0.5):
    cost = 0.0
    for _ in range(max_steps):
        done, usage = agent_step(task)
        cost += usage.cost_usd
        if cost > max_cost_usd:
            raise RuntimeError("Orçamento da execução excedido")
        if done:
            return
    raise RuntimeError("Limite de passos atingido")
```

## 14. Django e Flask

- **Dono do recurso (API-01):** `get_object_or_404(Order, pk=pk, user=request.user)`; em DRF, sobrescreva `get_queryset()` para `Order.objects.filter(user=self.request.user)`.
- **Mass assignment (API-04):** em `ModelForm`/`ModelSerializer` liste `fields = [...]` explicitamente; nunca `fields = "__all__"` em entrada; `read_only_fields` para papel, saldo, status.
- **Auth por padrão (IA-03):** DRF `DEFAULT_PERMISSION_CLASSES = ["rest_framework.permissions.IsAuthenticated"]`; Django `LoginRequiredMiddleware` (5.1+).
- **XSS (IA-08):** templates escapam por padrão; cuidado com `|safe`, `mark_safe` e `{% autoescape off %}`. Para HTML de usuário, `nh3` (sanitizador).
- **SQL:** `Model.objects.raw("... WHERE id = %s", [id])`; nunca f-string.
- **Configuração (API-09):** `python manage.py check --deploy`; `SECURE_*` settings, `CSRF_COOKIE_SECURE`, `SESSION_COOKIE_SECURE`, `ALLOWED_HOSTS` restrito.
- **Flask:** `app.config["SESSION_COOKIE_HTTPONLY"] = True`, `SESSION_COOKIE_SECURE = True`, `SESSION_COOKIE_SAMESITE = "Lax"`; Flask-Limiter para rate limit; Flask-WTF para CSRF.

## 15. Testes

```python
# pytest + httpx/TestClient
def test_api01_nao_retorna_pedido_de_outro_usuario(client, cookie_a, pedido_de_b):
    response = client.get(f"/orders/{pedido_de_b.id}", cookies=cookie_a)
    assert response.status_code == 404


def test_fin07_soma_das_parcelas_igual_ao_total():
    for total in range(1, 5000, 37):
        for parts in range(1, 13):
            assert sum(split_cents(total, parts)) == total
```

Concorrência (FIN-02): dispare requisições em paralelo com `asyncio.gather` + `httpx.AsyncClient` contra um banco real (não SQLite em memória, que não reproduz locks do Postgres).

## 16. Ferramentas
- Segredos: `gitleaks`, `detect-secrets`.
- Código: `bandit`, `ruff` (regras `S` do flake8-bandit), Semgrep (`p/python`, `p/django`, `p/flask`), `mypy --strict`.
- Dependências: `pip-audit`, `uv lock`/`pip-tools` com hashes (`--require-hashes`), `osv-scanner`.
- Testes: `pytest`, `hypothesis` (propriedades), `mutmut` (mutação), `locust` (carga).
