import { useState } from 'react'
import { Image, Trash2 } from 'lucide-react'
import { ToolPageHeader } from '../../components/common/ToolPageHeader'
import { DropZone } from '../../components/upload/DropZone'
import { ProcessingScreen } from '../../components/common/ProcessingScreen'
import { DownloadScreen } from '../../components/download/DownloadScreen'
import { ErrorAlert } from '../../components/common/ErrorAlert'
import { useFileUpload } from '../../hooks/useFileUpload'
import { useJobPoller } from '../../hooks/useJobPoller'
import { jpgToPdf } from '../../services/api'
import { validateImageFile } from '../../utils/validation'
import { formatBytes } from '../../utils/format'
import type { UploadedFile, DownloadInfo, ToolStep } from '../../types'

type Orientation = 'portrait' | 'landscape'
type PageSize = 'a4' | 'letter' | 'original'
type Margin = 'none' | 'small' | 'medium'

export function JpgToPdfPage() {
  const [step, setStep] = useState<ToolStep>('upload')
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [orientation, setOrientation] = useState<Orientation>('portrait')
  const [pageSize, setPageSize] = useState<PageSize>('a4')
  const [margin, setMargin] = useState<Margin>('small')
  const [error, setError] = useState<string | null>(null)
  const [download, setDownload] = useState<DownloadInfo | null>(null)

  const { uploadFiles, uploading, sessionToken } = useFileUpload()
  const { startPolling } = useJobPoller()

  const handleFiles = async (newFiles: File[]) => {
    setError(null)
    for (const f of newFiles) {
      const v = validateImageFile(f)
      if (!v.valid) { setError(v.error!); return }
    }
    const results = await uploadFiles(newFiles)
    if (results.length) {
      setFiles((prev) => [...prev, ...results])
      if (step === 'upload') setStep('configure')
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.fileId !== id))
    if (files.length <= 1) setStep('upload')
  }

  const handleConvert = async () => {
    if (!files.length) return
    setError(null)
    setStep('processing')
    try {
      const job = await jpgToPdf({ fileIds: files.map((f) => f.fileId), sessionToken, orientation, pageSize, margin })
      const result = await startPolling(job.jobId!)
      if (result.status === 'completed') {
        setDownload({ jobId: result.jobId, fileId: result.fileId!, fileName: result.fileName!, fileSize: result.fileSize!, downloadToken: result.downloadToken!, sessionToken })
        setStep('download')
      } else {
        setError(result.errorMessage || 'Conversion failed.')
        setStep('configure')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed.')
      setStep('configure')
    }
  }

  const reset = () => { setStep('upload'); setFiles([]); setDownload(null); setError(null) }

  return (
    <div>
      <ToolPageHeader title="JPG to PDF" description="Convert JPG, JPEG and PNG images into a single PDF document." color="#D97706" bgColor="#FFFBEB" icon={<Image className="w-7 h-7" />} step={step === 'upload' ? 1 : step === 'configure' ? 2 : step === 'processing' ? 3 : 4} totalSteps={4} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {error && <div className="mb-6"><ErrorAlert message={error} onDismiss={() => setError(null)} /></div>}

        {step === 'upload' && <DropZone accept=".jpg,.jpeg,.png,image/jpeg,image/png" multiple onFiles={handleFiles} label="Drop images here" sublabel="JPG and PNG images accepted" disabled={uploading} />}

        {step === 'configure' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-secondary">Images ({files.length})</h3>
                <DropZone accept=".jpg,.jpeg,.png,image/jpeg,image/png" multiple onFiles={handleFiles} disabled={uploading} compact />
              </div>
              <div className="space-y-2">
                {files.map((f, i) => (
                  <div key={f.fileId} className="flex items-center gap-3 p-3 bg-brand-surface rounded-xl border border-brand-border">
                    <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-secondary truncate">{f.originalName}</p>
                      <p className="text-xs text-brand-muted">{formatBytes(f.size)}</p>
                    </div>
                    <button onClick={() => removeFile(f.fileId)} className="text-brand-muted hover:text-brand-error p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Orientation</label>
                <select value={orientation} onChange={(e) => setOrientation(e.target.value as Orientation)} className="input-field text-sm">
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Page size</label>
                <select value={pageSize} onChange={(e) => setPageSize(e.target.value as PageSize)} className="input-field text-sm">
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="original">Original image size</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Margin</label>
                <select value={margin} onChange={(e) => setMargin(e.target.value as Margin)} className="input-field text-sm">
                  <option value="none">No margin</option>
                  <option value="small">Small margin</option>
                  <option value="medium">Medium margin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={reset} className="btn-secondary">Start over</button>
              <button onClick={handleConvert} className="btn-primary flex-1">
                <Image className="w-4 h-4" />
                Convert to PDF
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && <ProcessingScreen message="Converting images to PDF..." />}
        {step === 'download' && download && <DownloadScreen {...download} onReset={reset} relatedToolIds={['compress-pdf', 'merge-pdf']} />}
      </div>
    </div>
  )
}
