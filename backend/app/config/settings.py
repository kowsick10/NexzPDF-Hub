import os
from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "nexPDF tool API"
    app_version: str = "1.0.0"
    debug: bool = False

    # File limits
    max_file_size_mb: int = 25
    max_upload_files: int = 10
    max_combined_size_mb: int = 100
    max_pdf_pages: int = 200
    file_retention_minutes: int = 60
    max_processing_seconds: int = 120
    max_concurrent_jobs: int = 2

    # Storage
    upload_dir: str = str(Path("/tmp/nexpdf/uploads"))
    jobs_dir: str = str(Path("/tmp/nexpdf/jobs"))

    # Security
    allowed_origins: str = "http://localhost:5173,http://localhost:3000"
    rate_limit_per_minute: int = 30

    # Token secret for download tokens
    token_secret: str = "change-me-in-production-use-random-32-chars"

    class Config:
        env_file = ".env"
        env_prefix = "NEXPDF_"

    @property
    def max_file_size_bytes(self) -> int:
        return self.max_file_size_mb * 1024 * 1024

    @property
    def max_combined_size_bytes(self) -> int:
        return self.max_combined_size_mb * 1024 * 1024

    @property
    def upload_path(self) -> Path:
        p = Path(self.upload_dir)
        p.mkdir(parents=True, exist_ok=True)
        return p

    @property
    def jobs_path(self) -> Path:
        p = Path(self.jobs_dir)
        p.mkdir(parents=True, exist_ok=True)
        return p

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]


settings = Settings()
