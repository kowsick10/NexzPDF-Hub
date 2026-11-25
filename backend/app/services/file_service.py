import uuid
import os
import re
import hashlib
import hmac
import time
import shutil
from pathlib import Path
from typing import Optional
from app.config import settings

ALLOWED_MIME_TYPES = {
    "application/pdf": b"%PDF",
    "image/jpeg": b"\xff\xd8\xff",
    "image/png": b"\x89PNG",
    "application/msword": b"\xd0\xcf\x11\xe0",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": b"PK\x03\x04",
}

FILE_EXTENSIONS = {
    "application/pdf": ".pdf",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
}


def sanitize_filename(name: str) -> str:
    name = os.path.basename(name)
    name = re.sub(r"[^\w\s\-.]", "", name)
    name = re.sub(r"\s+", "_", name.strip())
    return name[:100] or "file"


def validate_file_signature(data: bytes, mime_type: str) -> bool:
    signature = ALLOWED_MIME_TYPES.get(mime_type)
    if not signature:
        return False
    return data[:len(signature)] == signature


def generate_file_id() -> str:
    return str(uuid.uuid4())


def generate_download_token(file_id: str, session_token: str) -> str:
    msg = f"{file_id}:{session_token}:{int(time.time() // 3600)}"
    return hmac.new(settings.token_secret.encode(), msg.encode(), hashlib.sha256).hexdigest()


def verify_download_token(file_id: str, session_token: str, token: str) -> bool:
    current = generate_download_token(file_id, session_token)
    prev_msg = f"{file_id}:{session_token}:{int(time.time() // 3600) - 1}"
    prev = hmac.new(settings.token_secret.encode(), prev_msg.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(current, token) or hmac.compare_digest(prev, token)


def save_upload(file_id: str, data: bytes, original_name: str, mime_type: str) -> Path:
    ext = FILE_EXTENSIONS.get(mime_type, ".bin")
    upload_dir = settings.upload_path / file_id
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_path = upload_dir / f"file{ext}"
    file_path.write_bytes(data)
    meta_path = upload_dir / "meta.txt"
    safe_name = sanitize_filename(original_name)
    meta_path.write_text(f"{safe_name}\n{mime_type}\n{len(data)}\n{time.time()}\n", encoding="utf-8")
    return file_path


def get_upload_path(file_id: str) -> Optional[Path]:
    upload_dir = settings.upload_path / file_id
    if not upload_dir.exists():
        return None
    for f in upload_dir.iterdir():
        if f.name.startswith("file"):
            return f
    return None


def get_upload_meta(file_id: str) -> Optional[dict]:
    meta_path = settings.upload_path / file_id / "meta.txt"
    if not meta_path.exists():
        return None
    lines = meta_path.read_text(encoding="utf-8").splitlines()
    return {
        "original_name": lines[0] if lines else "file",
        "mime_type": lines[1] if len(lines) > 1 else "",
        "size": int(lines[2]) if len(lines) > 2 else 0,
        "uploaded_at": float(lines[3]) if len(lines) > 3 else 0,
    }


def save_job_output(job_id: str, data: bytes, filename: str, session_token: str) -> dict:
    job_dir = settings.jobs_path / job_id
    job_dir.mkdir(parents=True, exist_ok=True)
    output_path = job_dir / filename
    output_path.write_bytes(data)
    file_id = generate_file_id()
    token = generate_download_token(file_id, session_token)
    meta = job_dir / "output_meta.txt"
    meta.write_text(f"{file_id}\n{filename}\n{len(data)}\n{token}\n{session_token}\n{time.time()}\n", encoding="utf-8")
    return {"file_id": file_id, "filename": filename, "size": len(data), "token": token}


def get_job_output(job_id: str) -> Optional[dict]:
    meta_path = settings.jobs_path / job_id / "output_meta.txt"
    if not meta_path.exists():
        return None
    lines = meta_path.read_text(encoding="utf-8").splitlines()
    return {
        "file_id": lines[0],
        "filename": lines[1],
        "size": int(lines[2]),
        "token": lines[3],
        "session_token": lines[4],
        "created_at": float(lines[5]) if len(lines) > 5 else 0,
    }


def get_job_output_path(job_id: str) -> Optional[Path]:
    meta = get_job_output(job_id)
    if not meta:
        return None
    path = settings.jobs_path / job_id / meta["filename"]
    return path if path.exists() else None


def delete_upload(file_id: str) -> None:
    upload_dir = settings.upload_path / file_id
    if upload_dir.exists():
        shutil.rmtree(upload_dir, ignore_errors=True)


def delete_job(job_id: str) -> None:
    job_dir = settings.jobs_path / job_id
    if job_dir.exists():
        shutil.rmtree(job_dir, ignore_errors=True)


def cleanup_expired() -> int:
    cutoff = time.time() - (settings.file_retention_minutes * 60)
    deleted = 0
    for base in [settings.upload_path, settings.jobs_path]:
        if not base.exists():
            continue
        for entry in base.iterdir():
            try:
                if entry.stat().st_mtime < cutoff:
                    shutil.rmtree(entry, ignore_errors=True)
                    deleted += 1
            except Exception:
                pass
    return deleted
