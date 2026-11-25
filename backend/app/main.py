import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.middleware.rate_limit import RateLimitMiddleware
from app.routes import upload, pdf_tools, jobs
from app.services.file_service import cleanup_expired

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nexpdf")


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings.upload_path.mkdir(parents=True, exist_ok=True)
    settings.jobs_path.mkdir(parents=True, exist_ok=True)
    deleted = cleanup_expired()
    logger.info(f"Startup cleanup: removed {deleted} expired entries")

    async def periodic_cleanup():
        while True:
            await asyncio.sleep(300)
            try:
                n = cleanup_expired()
                if n:
                    logger.info(f"Periodic cleanup: removed {n} expired entries")
            except Exception as e:
                logger.error(f"Cleanup error: {e}")

    task = asyncio.create_task(periodic_cleanup())
    yield
    task.cancel()


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="nexPDF tool API – All Your PDF Needs. One Place. By Nexzware.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(RateLimitMiddleware, calls=settings.rate_limit_per_minute, period=60)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.url.path}: {type(exc).__name__}")
    return JSONResponse(status_code=500, content={"detail": "An internal error occurred. Please try again."})


@app.get("/api/health")
async def health():
    return {"status": "ok", "version": settings.app_version}


@app.get("/api/tools")
async def list_tools():
    return {
        "tools": [
            {"id": "merge-pdf", "name": "Merge PDF", "path": "/merge-pdf"},
            {"id": "split-pdf", "name": "Split PDF", "path": "/split-pdf"},
            {"id": "compress-pdf", "name": "Compress PDF", "path": "/compress-pdf"},
            {"id": "jpg-to-pdf", "name": "JPG to PDF", "path": "/jpg-to-pdf"},
            {"id": "pdf-to-jpg", "name": "PDF to JPG", "path": "/pdf-to-jpg"},
            {"id": "word-to-pdf", "name": "Word to PDF", "path": "/word-to-pdf"},
            {"id": "rotate-pdf", "name": "Rotate PDF", "path": "/rotate-pdf"},
            {"id": "protect-pdf", "name": "Protect PDF", "path": "/protect-pdf"},
            {"id": "unlock-pdf", "name": "Unlock PDF", "path": "/unlock-pdf"},
        ]
    }


app.include_router(upload.router, prefix="/api")
app.include_router(pdf_tools.router, prefix="/api")
app.include_router(jobs.router, prefix="/api")
