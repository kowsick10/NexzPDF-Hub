export const API_BASE_URL = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env['VITE_API_URL'] ?? '/api'

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/health`,
  tools: `${API_BASE_URL}/tools`,
  upload: `${API_BASE_URL}/files/upload`,
  merge: `${API_BASE_URL}/pdf/merge`,
  split: `${API_BASE_URL}/pdf/split`,
  compress: `${API_BASE_URL}/pdf/compress`,
  jpgToPdf: `${API_BASE_URL}/pdf/jpg-to-pdf`,
  pdfToJpg: `${API_BASE_URL}/pdf/pdf-to-jpg`,
  wordToPdf: `${API_BASE_URL}/pdf/word-to-pdf`,
  rotate: `${API_BASE_URL}/pdf/rotate`,
  protect: `${API_BASE_URL}/pdf/protect`,
  unlock: `${API_BASE_URL}/pdf/unlock`,
  job: (id: string) => `${API_BASE_URL}/jobs/${id}`,
  cancelJob: (id: string) => `${API_BASE_URL}/jobs/${id}/cancel`,
  download: (fileId: string) => `${API_BASE_URL}/download/${fileId}`,
  deleteFile: (fileId: string) => `${API_BASE_URL}/files/${fileId}`,
  deleteJobFiles: (jobId: string) => `${API_BASE_URL}/jobs/${jobId}/files`,
} as const

export const FILE_LIMITS = {
  maxSizeBytes: 25 * 1024 * 1024,
  maxSizeMB: 25,
  maxFiles: 10,
  maxCombinedMB: 100,
  maxPages: 200,
  retentionMinutes: 60,
  acceptedPdf: '.pdf,application/pdf',
  acceptedImages: '.jpg,.jpeg,.png,image/jpeg,image/png',
  acceptedWord: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
} as const
