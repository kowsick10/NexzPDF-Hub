import time
from collections import defaultdict
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from app.config import settings


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, calls: int = 30, period: int = 60):
        super().__init__(app)
        self.calls = calls
        self.period = period
        self._store: dict[str, list[float]] = defaultdict(list)

    def _get_client_ip(self, request: Request) -> str:
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.client.host if request.client else "unknown"

    async def dispatch(self, request: Request, call_next):
        if not request.url.path.startswith("/api/"):
            return await call_next(request)

        ip = self._get_client_ip(request)
        now = time.time()
        window_start = now - self.period

        self._store[ip] = [t for t in self._store[ip] if t > window_start]

        if len(self._store[ip]) >= self.calls:
            raise HTTPException(429, "Too many requests. Please slow down.")

        self._store[ip].append(now)
        return await call_next(request)
