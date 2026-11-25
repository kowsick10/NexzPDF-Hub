from pydantic import BaseModel, field_validator
from typing import Literal, Optional


class MergeRequest(BaseModel):
    fileIds: list[str]
    sessionToken: str

    @field_validator("fileIds")
    @classmethod
    def validate_file_ids(cls, v: list[str]) -> list[str]:
        if len(v) < 2:
            raise ValueError("At least 2 files required for merge")
        if len(v) > 10:
            raise ValueError("Maximum 10 files per merge")
        return v


class SplitRequest(BaseModel):
    fileId: str
    sessionToken: str
    mode: Literal["ranges", "extract", "all"]
    ranges: Optional[str] = None
    pages: Optional[list[int]] = None


class CompressRequest(BaseModel):
    fileId: str
    sessionToken: str
    level: Literal["low", "recommended", "high"]


class JpgToPdfRequest(BaseModel):
    fileIds: list[str]
    sessionToken: str
    orientation: Literal["portrait", "landscape"] = "portrait"
    pageSize: Literal["a4", "letter", "original"] = "a4"
    margin: Literal["none", "small", "medium"] = "small"


class PdfToJpgRequest(BaseModel):
    fileId: str
    sessionToken: str
    quality: Literal["standard", "high"] = "high"
    pages: Optional[list[int]] = None


class WordToPdfRequest(BaseModel):
    fileId: str
    sessionToken: str


class RotateRequest(BaseModel):
    fileId: str
    sessionToken: str
    rotations: list[dict]


class ProtectRequest(BaseModel):
    fileId: str
    sessionToken: str
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 1:
            raise ValueError("Password cannot be empty")
        if len(v) > 128:
            raise ValueError("Password too long")
        return v


class UnlockRequest(BaseModel):
    fileId: str
    sessionToken: str
    password: str


class DeleteFilesRequest(BaseModel):
    session_token: str
