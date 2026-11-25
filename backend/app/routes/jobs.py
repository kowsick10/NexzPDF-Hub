from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.schemas.responses import JobResponse
from app.schemas.requests import DeleteFilesRequest
from app.services.job_manager import job_manager
from app.services.file_service import (
    get_job_output, get_job_output_path, verify_download_token,
    delete_job, delete_upload
)

router = APIRouter()


@router.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job(job_id: str):
    job = job_manager.get_job(job_id)
    if not job:
        raise HTTPException(404, "Job not found")
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


@router.post("/jobs/{job_id}/cancel")
async def cancel_job(job_id: str):
    if not job_manager.cancel_job(job_id):
        raise HTTPException(400, "Job cannot be cancelled in its current state")
    return {"message": "Job cancelled"}


@router.get("/download/{file_id}")
async def download_file(file_id: str, token: str):
    for jid, job in job_manager._jobs.items():
        if job.file_id == file_id and job.download_token == token:
            path = get_job_output_path(jid)
            meta = get_job_output(jid)
            if path and meta:
                return FileResponse(
                    str(path),
                    filename=meta["filename"],
                    media_type="application/octet-stream",
                )
    raise HTTPException(404, "File not found, expired, or token invalid")


@router.delete("/files/{file_id}")
async def delete_file(file_id: str, body: DeleteFilesRequest):
    delete_upload(file_id)
    return {"message": "File deleted"}


@router.delete("/jobs/{job_id}/files")
async def delete_job_files(job_id: str, body: DeleteFilesRequest):
    delete_job(job_id)
    return {"message": "Job files deleted"}
