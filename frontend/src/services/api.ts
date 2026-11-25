import axios, { AxiosError } from 'axios'
import { API_ENDPOINTS } from '../config/api'
import type {
  UploadedFile, JobResult, MergeRequest, SplitRequest, CompressRequest,
  JpgToPdfRequest, PdfToJpgRequest, WordToPdfRequest, RotateRequest,
  ProtectRequest, UnlockRequest,
} from '../types'

const client = axios.create({
  timeout: 180000,
  withCredentials: false,
})

export function getSessionToken(): string {
  let token = sessionStorage.getItem('nexpdf_session')
  if (!token) {
    token = crypto.randomUUID()
    sessionStorage.setItem('nexpdf_session', token)
  }
  return token
}

function handleError(error: unknown): never {
  if (error instanceof AxiosError) {
    const detail = error.response?.data?.detail || error.message
    throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail))
  }
  throw error
}

export async function uploadFile(file: File, sessionToken: string): Promise<UploadedFile> {
  try {
    const form = new FormData()
    form.append('file', file)
    form.append('session_token', sessionToken)
    const { data } = await client.post<UploadedFile>(API_ENDPOINTS.upload, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  } catch (e) { handleError(e) }
}

export async function mergePdf(req: MergeRequest): Promise<JobResult> {
  try {
    const { data } = await client.post<JobResult>(API_ENDPOINTS.merge, req)
    return data
  } catch (e) { handleError(e) }
}

export async function splitPdf(req: SplitRequest): Promise<JobResult> {
  try {
    const { data } = await client.post<JobResult>(API_ENDPOINTS.split, req)
    return data
  } catch (e) { handleError(e) }
}

export async function compressPdf(req: CompressRequest): Promise<JobResult> {
  try {
    const { data } = await client.post<JobResult>(API_ENDPOINTS.compress, req)
    return data
  } catch (e) { handleError(e) }
}

export async function jpgToPdf(req: JpgToPdfRequest): Promise<JobResult> {
  try {
    const { data } = await client.post<JobResult>(API_ENDPOINTS.jpgToPdf, req)
    return data
  } catch (e) { handleError(e) }
}

export async function pdfToJpg(req: PdfToJpgRequest): Promise<JobResult> {
  try {
    const { data } = await client.post<JobResult>(API_ENDPOINTS.pdfToJpg, req)
    return data
  } catch (e) { handleError(e) }
}

export async function wordToPdf(req: WordToPdfRequest): Promise<JobResult> {
  try {
    const { data } = await client.post<JobResult>(API_ENDPOINTS.wordToPdf, req)
    return data
  } catch (e) { handleError(e) }
}

export async function rotatePdf(req: RotateRequest): Promise<JobResult> {
  try {
    const { data } = await client.post<JobResult>(API_ENDPOINTS.rotate, req)
    return data
  } catch (e) { handleError(e) }
}

export async function protectPdf(req: ProtectRequest): Promise<JobResult> {
  try {
    const { data } = await client.post<JobResult>(API_ENDPOINTS.protect, req)
    return data
  } catch (e) { handleError(e) }
}

export async function unlockPdf(req: UnlockRequest): Promise<JobResult> {
  try {
    const { data } = await client.post<JobResult>(API_ENDPOINTS.unlock, req)
    return data
  } catch (e) { handleError(e) }
}

export async function getJob(jobId: string): Promise<JobResult> {
  try {
    const { data } = await client.get<JobResult>(API_ENDPOINTS.job(jobId))
    return data
  } catch (e) { handleError(e) }
}

export async function cancelJob(jobId: string): Promise<void> {
  try {
    await client.post(API_ENDPOINTS.cancelJob(jobId))
  } catch (e) { handleError(e) }
}

export function getDownloadUrl(fileId: string, token: string): string {
  return `${API_ENDPOINTS.download(fileId)}?token=${token}`
}

export async function deleteFile(fileId: string, sessionToken: string): Promise<void> {
  try {
    await client.delete(API_ENDPOINTS.deleteFile(fileId), {
      data: { session_token: sessionToken },
    })
  } catch { /* best-effort */ }
}

export async function deleteJobFiles(jobId: string, sessionToken: string): Promise<void> {
  try {
    await client.delete(API_ENDPOINTS.deleteJobFiles(jobId), {
      data: { session_token: sessionToken },
    })
  } catch { /* best-effort */ }
}

export async function pollJob(
  jobId: string,
  onProgress?: (job: JobResult) => void,
  intervalMs = 1000,
  maxWaitMs = 120000,
): Promise<JobResult> {
  const start = Date.now()
  while (Date.now() - start < maxWaitMs) {
    const job = await getJob(jobId)
    onProgress?.(job)
    if (job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') {
      return job
    }
    await new Promise((r) => setTimeout(r, intervalMs))
  }
  throw new Error('Processing timed out. Please try again.')
}
