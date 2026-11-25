import { useState, useCallback } from 'react'
import { uploadFile, getSessionToken } from '../services/api'
import type { UploadedFile } from '../types'

interface UseFileUploadReturn {
  uploadedFiles: UploadedFile[]
  uploading: boolean
  uploadError: string | null
  uploadFiles: (files: File[]) => Promise<UploadedFile[]>
  removeFile: (fileId: string) => void
  reset: () => void
  sessionToken: string
}

export function useFileUpload(): UseFileUploadReturn {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const sessionToken = getSessionToken()

  const uploadFiles = useCallback(async (files: File[]): Promise<UploadedFile[]> => {
    setUploading(true)
    setUploadError(null)
    const results: UploadedFile[] = []
    try {
      for (const file of files) {
        const result = await uploadFile(file, sessionToken)
        results.push(result)
      }
      setUploadedFiles((prev) => [...prev, ...results])
      return results
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Upload failed. Please try again.'
      setUploadError(msg)
      return results
    } finally {
      setUploading(false)
    }
  }, [sessionToken])

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.fileId !== fileId))
  }, [])

  const reset = useCallback(() => {
    setUploadedFiles([])
    setUploadError(null)
  }, [])

  return { uploadedFiles, uploading, uploadError, uploadFiles, removeFile, reset, sessionToken }
}
