export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'

export interface UploadedFile {
  fileId: string
  originalName: string
  size: number
  mimeType: string
  pageCount?: number
}

export interface JobResult {
  jobId: string
  status: JobStatus
  fileId?: string
  fileName?: string
  fileSize?: number
  downloadToken?: string
  errorMessage?: string
  progress?: number
}

export interface ApiError {
  detail: string
  code?: string
}

export interface MergeRequest {
  fileIds: string[]
  sessionToken: string
}

export interface SplitRequest {
  fileId: string
  sessionToken: string
  mode: 'ranges' | 'extract' | 'all'
  ranges?: string
  pages?: number[]
}

export interface CompressRequest {
  fileId: string
  sessionToken: string
  level: 'low' | 'recommended' | 'high'
}

export interface JpgToPdfRequest {
  fileIds: string[]
  sessionToken: string
  orientation: 'portrait' | 'landscape'
  pageSize: 'a4' | 'letter' | 'original'
  margin: 'none' | 'small' | 'medium'
}

export interface PdfToJpgRequest {
  fileId: string
  sessionToken: string
  quality: 'standard' | 'high'
  pages?: number[]
}

export interface WordToPdfRequest {
  fileId: string
  sessionToken: string
}

export interface RotateRequest {
  fileId: string
  sessionToken: string
  rotations: { page: number; degrees: 90 | 180 | 270 }[]
}

export interface ProtectRequest {
  fileId: string
  sessionToken: string
  password: string
}

export interface UnlockRequest {
  fileId: string
  sessionToken: string
  password: string
}

export interface DownloadInfo {
  jobId: string
  fileId: string
  fileName: string
  fileSize: number
  downloadToken: string
  sessionToken: string
}

export type ToolStep = 'upload' | 'configure' | 'processing' | 'download'
