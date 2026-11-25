import io
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from app.config import settings
from app.services.file_service import (
    generate_file_id, validate_file_signature, save_upload, sanitize_filename
)
from app.schemas.responses import UploadResponse

try:
    from pypdf import PdfReader
    HAS_PYPDF = True
except ImportError:
    HAS_PYPDF = False

router = APIRouter()

ALLOWED_MIME = {
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

EXTENSION_MIME = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


@router.post("/files/upload", response_model=UploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    session_token: str = Form(...),
):
    if not file.filename:
        raise HTTPException(400, "No filename provided")

    ext = "." + file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    mime = EXTENSION_MIME.get(ext, file.content_type or "")

    if mime not in ALLOWED_MIME:
        raise HTTPException(400, f"File type not supported. Allowed: PDF, JPG, PNG, DOC, DOCX")

    data = await file.read()

    if len(data) == 0:
        raise HTTPException(400, "File is empty")

    if len(data) > settings.max_file_size_bytes:
        raise HTTPException(413, f"File exceeds the {settings.max_file_size_mb} MB limit")

    if not validate_file_signature(data, mime):
        raise HTTPException(400, "File content does not match the expected format")

    page_count = None
    if mime == "application/pdf" and HAS_PYPDF:
        try:
            reader = PdfReader(io.BytesIO(data))
            page_count = len(reader.pages)
            if page_count > settings.max_pdf_pages:
                raise HTTPException(400, f"PDF exceeds the {settings.max_pdf_pages} page limit")
        except Exception:
            pass

    file_id = generate_file_id()
    save_upload(file_id, data, file.filename, mime)

    return UploadResponse(
        fileId=file_id,
        originalName=sanitize_filename(file.filename),
        size=len(data),
        mimeType=mime,
        pageCount=page_count,
    )
