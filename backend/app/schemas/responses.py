from pydantic import BaseModel
from typing import Optional, Literal


class UploadResponse(BaseModel):
    fileId: str
    originalName: str
    size: int
    mimeType: str
    pageCount: Optional[int] = None


class JobResponse(BaseModel):
    jobId: str
    status: Literal["pending", "processing", "completed", "failed", "cancelled"]
    fileId: Optional[str] = None
    fileName: Optional[str] = None
    fileSize: Optional[int] = None
    downloadToken: Optional[str] = None
    errorMessage: Optional[str] = None
    progress: Optional[int] = None


class ErrorResponse(BaseModel):
    detail: str
    code: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    version: str
