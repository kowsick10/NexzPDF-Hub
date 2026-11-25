import { useState } from 'react'
import { Merge, Trash2, GripVertical } from 'lucide-react'
import { ToolPageHeader } from '../../components/common/ToolPageHeader'
import { DropZone } from '../../components/upload/DropZone'
import { ProcessingScreen } from '../../components/common/ProcessingScreen'
import { DownloadScreen } from '../../components/download/DownloadScreen'
import { ErrorAlert } from '../../components/common/ErrorAlert'
import { useFileUpload } from '../../hooks/useFileUpload'
import { useJobPoller } from '../../hooks/useJobPoller'
import { mergePdf } from '../../services/api'
import { validatePdfFile } from '../../utils/validation'
import { formatBytes } from '../../utils/format'
import type { UploadedFile, DownloadInfo, ToolStep } from '../../types'

export function MergePdfPage() {
  const [step, setStep] = useState<ToolStep>('upload')
  const [error, setError] = useState<string | null>(null)
  const [download, setDownload] = useState<DownloadInfo | null>(null)
  const [orderedFiles, setOrderedFiles] = useState<UploadedFile[]>([])

  const { uploadFiles, uploading, sessionToken } = useFileUpload()
  const { startPolling } = useJobPoller()

  const handleFiles = async (files: File[]) => {
    setError(null)
    for (const f of files) {
      const v = validatePdfFile(f)
      if (!v.valid) { setError(v.error!); return }
    }
    const results = await uploadFiles(files)
    if (results.length) {
      setOrderedFiles((prev) => [...prev, ...results])
      if (step === 'upload') setStep('configure')
    }
  }

  const removeFile = (fileId: string) => {
    setOrderedFiles((prev) => prev.filter((f) => f.fileId !== fileId))
    if (orderedFiles.length <= 1) setStep('upload')
  }

  const moveFile = (from: number, to: number) => {
    setOrderedFiles((prev) => {
      const arr = [...prev]
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return arr
    })
  }

  const handleMerge = async () => {
    if (orderedFiles.length < 2) { setError('Please add at least 2 PDF files to merge.'); return }
    setError(null)
    setStep('processing')
    try {
      const job = await mergePdf({ fileIds: orderedFiles.map((f) => f.fileId), sessionToken })
      const result = await startPolling(job.jobId!)
      if (result.status === 'completed') {
        setDownload({
          jobId: result.jobId,
          fileId: result.fileId!,
          fileName: result.fileName!,
          fileSize: result.fileSize!,
          downloadToken: result.downloadToken!,
          sessionToken,
        })
        setStep('download')
      } else {
        setError(result.errorMessage || 'Merge failed.')
        setStep('configure')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Merge failed.')
      setStep('configure')
    }
  }

  const reset = () => {
    setStep('upload')
    setOrderedFiles([])
    setDownload(null)
    setError(null)
  }

  return (
    <div>
      <ToolPageHeader
        title="Merge PDF"
        description="Combine multiple PDF files into one single document in your chosen order."
        color="#2563EB"
        bgColor="#EFF6FF"
        icon={<Merge className="w-7 h-7" />}
        step={step === 'upload' ? 1 : step === 'configure' ? 2 : step === 'processing' ? 3 : 4}
        totalSteps={4}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {error && <div className="mb-6"><ErrorAlert message={error} onDismiss={() => setError(null)} /></div>}

        {step === 'upload' && (
          <DropZone
            accept=".pdf,application/pdf"
            multiple
            onFiles={handleFiles}
            label="Drop PDF files here"
            sublabel="Select 2 or more PDF files to merge"
            disabled={uploading}
          />
        )}

        {step === 'configure' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-secondary">Files to merge ({orderedFiles.length})</h2>
                <DropZone accept=".pdf,application/pdf" multiple onFiles={handleFiles} disabled={uploading} compact />
              </div>
              {orderedFiles.map((f, i) => (
                <div key={f.fileId} className="flex items-center gap-3 p-3 bg-brand-surface rounded-xl border border-brand-border">
                  <GripVertical className="w-4 h-4 text-brand-muted flex-shrink-0" />
                  <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary truncate">{f.originalName}</p>
                    <p className="text-xs text-brand-muted">{formatBytes(f.size)}{f.pageCount ? ` · ${f.pageCount} pages` : ''}</p>
                  </div>
                  <div className="flex gap-1">
                    <button disabled={i === 0} onClick={() => moveFile(i, i - 1)} className="p-1.5 rounded-lg hover:bg-primary-50 disabled:opacity-30 transition-colors text-xs">↑</button>
                    <button disabled={i === orderedFiles.length - 1} onClick={() => moveFile(i, i + 1)} className="p-1.5 rounded-lg hover:bg-primary-50 disabled:opacity-30 transition-colors text-xs">↓</button>
                    <button onClick={() => removeFile(f.fileId)} className="p-1.5 rounded-lg hover:bg-red-50 text-brand-muted hover:text-brand-error transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setStep('upload'); setOrderedFiles([]); setError(null) }} className="btn-secondary">
                Start over
              </button>
              <button onClick={handleMerge} disabled={orderedFiles.length < 2 || uploading} className="btn-primary flex-1">
                <Merge className="w-4 h-4" />
                Merge {orderedFiles.length} PDFs
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && <ProcessingScreen message="Merging your PDF files..." />}

        {step === 'download' && download && (
          <DownloadScreen
            {...download}
            onReset={reset}
            relatedToolIds={['split-pdf', 'compress-pdf', 'rotate-pdf']}
          />
        )}
      </div>
    </div>
  )
}
