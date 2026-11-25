import asyncio
import uuid
import time
from typing import Callable, Awaitable, Optional
from dataclasses import dataclass, field
from app.config import settings


@dataclass
class Job:
    job_id: str
    status: str = "pending"
    file_id: Optional[str] = None
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    download_token: Optional[str] = None
    error_message: Optional[str] = None
    progress: Optional[int] = None
    created_at: float = field(default_factory=time.time)


class JobManager:
    def __init__(self) -> None:
        self._jobs: dict[str, Job] = {}
        self._semaphore = asyncio.Semaphore(settings.max_concurrent_jobs)
        self._lock = asyncio.Lock()

    def create_job(self) -> Job:
        job = Job(job_id=str(uuid.uuid4()))
        self._jobs[job.job_id] = job
        return job

    def get_job(self, job_id: str) -> Optional[Job]:
        return self._jobs.get(job_id)

    def _update(self, job_id: str, **kwargs) -> None:
        job = self._jobs.get(job_id)
        if job:
            for k, v in kwargs.items():
                setattr(job, k, v)

    async def run_job(
        self,
        processor: Callable[[], Awaitable[dict]],
    ) -> Job:
        job = self.create_job()

        async def _run():
            async with self._semaphore:
                self._update(job.job_id, status="processing")
                try:
                    result = await asyncio.wait_for(
                        processor(),
                        timeout=settings.max_processing_seconds,
                    )
                    self._update(
                        job.job_id,
                        status="completed",
                        file_id=result.get("file_id"),
                        file_name=result.get("filename"),
                        file_size=result.get("size"),
                        download_token=result.get("token"),
                    )
                except asyncio.TimeoutError:
                    self._update(job.job_id, status="failed", error_message="Processing timed out.")
                except Exception as e:
                    self._update(job.job_id, status="failed", error_message=str(e))

        asyncio.create_task(_run())
        return job

    def cancel_job(self, job_id: str) -> bool:
        job = self._jobs.get(job_id)
        if job and job.status in ("pending", "processing"):
            self._update(job_id, status="cancelled")
            return True
        return False

    def cleanup_old_jobs(self, max_age_seconds: int = 7200) -> int:
        cutoff = time.time() - max_age_seconds
        old = [jid for jid, j in self._jobs.items() if j.created_at < cutoff]
        for jid in old:
            del self._jobs[jid]
        return len(old)


job_manager = JobManager()
