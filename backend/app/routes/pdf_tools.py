import asyncio
from pathlib import Path
from fastapi import APIRouter, HTTPException
from app.schemas.requests import (
    MergeRequest, SplitRequest, CompressRequest, JpgToPdfRequest,
    PdfToJpgRequest, WordToPdfRequest, RotateRequest, ProtectRequest, UnlockRequest,
)
from app.schemas.responses import JobResponse
from app.services.job_manager import job_manager
from app.services.file_service import (
    get_upload_path, get_upload_meta, save_job_output
)

router = APIRouter()


def _get_verified_path(file_id: str, session_token: str) -> Path:
    path = get_upload_path(file_id)
    if not path:
        raise HTTPException(404, "File not found or has expired")
    return path


def _job_response(job) -> JobResponse:
    return JobResponse(
        jobId=job.job_id,
        status=job.status,
        fileId=job.file_id,
        fileName=job.file_name,
        fileSize=job.file_size,
        downloadToken=job.download_token,
        errorMessage=job.error_message,
        progress=job.progress,
    )


@router.post("/pdf/merge", response_model=JobResponse)
async def merge(req: MergeRequest):
    paths = [_get_verified_path(fid, req.sessionToken) for fid in req.fileIds]

    async def processor():
        from app.processors.merge import merge_pdfs
        loop = asyncio.get_event_loop()
        data = await loop.run_in_executor(None, merge_pdfs, paths)
        return save_job_output(job.job_id, data, "merged.pdf", req.sessionToken)

    job = await job_manager.run_job(processor)
    return _job_response(job)


@router.post("/pdf/split", response_model=JobResponse)
async def split(req: SplitRequest):
    path = _get_verified_path(req.fileId, req.sessionToken)

    async def processor():
        from app.processors.split import split_pdf
        loop = asyncio.get_event_loop()
        data, filename = await loop.run_in_executor(None, split_pdf, path, req.mode, req.ranges)
        return save_job_output(job.job_id, data, filename, req.sessionToken)

    job = await job_manager.run_job(processor)
    return _job_response(job)


@router.post("/pdf/compress", response_model=JobResponse)
async def compress(req: CompressRequest):
    path = _get_verified_path(req.fileId, req.sessionToken)
    meta = get_upload_meta(req.fileId)
    orig_name = meta["original_name"] if meta else "compressed.pdf"
    out_name = orig_name.rsplit(".", 1)[0] + "_compressed.pdf"

    async def processor():
        from app.processors.compress import compress_pdf
        loop = asyncio.get_event_loop()
        data = await loop.run_in_executor(None, compress_pdf, path, req.level)
        return save_job_output(job.job_id, data, out_name, req.sessionToken)

    job = await job_manager.run_job(processor)
    return _job_response(job)


@router.post("/pdf/jpg-to-pdf", response_model=JobResponse)
async def jpg_to_pdf(req: JpgToPdfRequest):
    paths = [_get_verified_path(fid, req.sessionToken) for fid in req.fileIds]

    async def processor():
        from app.processors.jpg_to_pdf import jpg_to_pdf as convert
        loop = asyncio.get_event_loop()
        data = await loop.run_in_executor(None, convert, paths, req.orientation, req.pageSize, req.margin)
        return save_job_output(job.job_id, data, "images.pdf", req.sessionToken)

    job = await job_manager.run_job(processor)
    return _job_response(job)


@router.post("/pdf/pdf-to-jpg", response_model=JobResponse)
async def pdf_to_jpg(req: PdfToJpgRequest):
    path = _get_verified_path(req.fileId, req.sessionToken)
    pages_zero = [p - 1 for p in req.pages] if req.pages else None

    async def processor():
        from app.processors.pdf_to_jpg import pdf_to_jpg as convert
        loop = asyncio.get_event_loop()
        data, filename = await loop.run_in_executor(None, convert, path, req.quality, pages_zero)
        return save_job_output(job.job_id, data, filename, req.sessionToken)

    job = await job_manager.run_job(processor)
    return _job_response(job)


@router.post("/pdf/word-to-pdf", response_model=JobResponse)
async def word_to_pdf(req: WordToPdfRequest):
    path = _get_verified_path(req.fileId, req.sessionToken)
    meta = get_upload_meta(req.fileId)
    orig_name = meta["original_name"] if meta else "document.pdf"
    out_name = orig_name.rsplit(".", 1)[0] + ".pdf"

    async def processor():
        from app.processors.word_to_pdf import word_to_pdf as convert
        loop = asyncio.get_event_loop()
        data = await loop.run_in_executor(None, convert, path)
        return save_job_output(job.job_id, data, out_name, req.sessionToken)

    job = await job_manager.run_job(processor)
    return _job_response(job)


@router.post("/pdf/rotate", response_model=JobResponse)
async def rotate(req: RotateRequest):
    path = _get_verified_path(req.fileId, req.sessionToken)
    meta = get_upload_meta(req.fileId)
    orig_name = meta["original_name"] if meta else "rotated.pdf"
    out_name = orig_name.rsplit(".", 1)[0] + "_rotated.pdf"

    async def processor():
        from app.processors.rotate import rotate_pdf
        loop = asyncio.get_event_loop()
        data = await loop.run_in_executor(None, rotate_pdf, path, req.rotations)
        return save_job_output(job.job_id, data, out_name, req.sessionToken)

    job = await job_manager.run_job(processor)
    return _job_response(job)


@router.post("/pdf/protect", response_model=JobResponse)
async def protect(req: ProtectRequest):
    path = _get_verified_path(req.fileId, req.sessionToken)
    meta = get_upload_meta(req.fileId)
    orig_name = meta["original_name"] if meta else "protected.pdf"
    out_name = orig_name.rsplit(".", 1)[0] + "_protected.pdf"
    password = req.password

    async def processor():
        from app.processors.protect import protect_pdf
        loop = asyncio.get_event_loop()
        data = await loop.run_in_executor(None, protect_pdf, path, password)
        return save_job_output(job.job_id, data, out_name, req.sessionToken)

    job = await job_manager.run_job(processor)
    return _job_response(job)


@router.post("/pdf/unlock", response_model=JobResponse)
async def unlock(req: UnlockRequest):
    path = _get_verified_path(req.fileId, req.sessionToken)
    meta = get_upload_meta(req.fileId)
    orig_name = meta["original_name"] if meta else "unlocked.pdf"
    out_name = orig_name.rsplit(".", 1)[0] + "_unlocked.pdf"
    password = req.password

    async def processor():
        from app.processors.unlock import unlock_pdf
        loop = asyncio.get_event_loop()
        data = await loop.run_in_executor(None, unlock_pdf, path, password)
        return save_job_output(job.job_id, data, out_name, req.sessionToken)

    job = await job_manager.run_job(processor)
    return _job_response(job)
