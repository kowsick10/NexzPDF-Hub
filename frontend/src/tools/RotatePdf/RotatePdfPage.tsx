import { useState } from 'react'
import { RotateCw, Trash2 } from 'lucide-react'
import { ToolPageHeader } from '../../components/common/ToolPageHeader'
import { DropZone } from '../../components/upload/DropZone'
import { ProcessingScreen } from '../../components/common/ProcessingScreen'
import { DownloadScreen } from '../../components/download/DownloadScreen'
import { ErrorAlert } from '../../components/common/ErrorAlert'
import { useFileUpload } from '../../hooks/useFileUpload'
import { useJobPoller } from '../../hooks/useJobPoller'
import { rotatePdf } from '../../services/api'
import { validatePdfFile } from '../../utils/validation'
import { formatBytes } from '../../utils/format'
import type { UploadedFile, DownloadInfo, ToolStep } from '../../types'

type Degrees = 90 | 180 | 270

export function RotatePdfPage() {
  const [step, setStep] = useState<ToolStep>('upload')
  const [file, setFile] = useState<UploadedFile | null>(null)
  const [globalRotation, setGlobalRotation] = useState<Degrees>(90)
  const [error, setError] = useState<string | null>(null)
  const [download, setDownload] = useState<DownloadInfo | null>(null)

  const { uploadFiles, uploading, sessionToken } = useFileUpload()
  const { startPolling } = useJobPoller()

  const handleFile = async (files: File[]) => {
    setError(null)
    const v = validatePdfFile(files[0])
    if (!v.valid) { setError(v.error!); return }
    const results = await uploadFiles([files[0]])
    if (results.length) { setFile(results[0]); setStep('configure') }
  }

  const handleRotate = async () => {
    if (!file) return
    setError(null)
    setStep('processing')
    const pageCount = file.pageCount || 1
    const rotations = Array.from({ length: pageCount }, (_, i) => ({ page: i + 1, degrees: globalRotation }))
    try {
      const job = await rotatePdf({ fileId: file.fileId, sessionToken, rotations })
      const result = await startPolling(job.jobId!)
      if (result.status === 'completed') {
        setDownload({ jobId: result.jobId, fileId: result.fileId!, fileName: result.fileName!, fileSize: result.fileSize!, downloadToken: result.downloadToken!, sessionToken })
        setStep('download')
      } else {
        setError(result.errorMessage || 'Rotation failed.')
        setStep('configure')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Rotation failed.')
      setStep('configure')
    }
  }

  const reset = () => { setStep('upload'); setFile(null); setDownload(null); setError(null) }

  return (
    <div>
      <ToolPageHeader title="Rotate PDF" description="Rotate all PDF pages by 90°, 180° or 270°." color="#EA580C" bgColor="#FFF7ED" icon={<RotateCw className="w-7 h-7" />} step={step === 'upload' ? 1 : step === 'configure' ? 2 : step === 'processing' ? 3 : 4} totalSteps={4} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {error && <div className="mb-6"><ErrorAlert message={error} onDismiss={() => setError(null)} /></div>}

        {step === 'upload' && <DropZone accept=".pdf,application/pdf" onFiles={handleFile} disabled={uploading} />}

        {step === 'configure' && file && (
          <div className="space-y-6">
            <div className="card flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 flex-shrink-0">
                <RotateCw className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-secondary truncate">{file.originalName}</p>
                <p className="text-sm text-brand-muted">{formatBytes(file.size)}{file.pageCount ? ` · ${file.pageCount} pages` : ''}</p>
              </div>
              <button onClick={reset} className="text-brand-muted hover:text-brand-error p-1"><Trash2 className="w-4 h-4" /></button>
            </div>

            <div>
              <h3 className="font-semibold text-secondary mb-3">Rotation (all pages)</h3>
              <div className="grid grid-cols-3 gap-3">
                {([90, 180, 270] as Degrees[]).map((deg) => (
                  <label key={deg} className={`flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${globalRotation === deg ? 'border-orange-400 bg-orange-50' : 'border-brand-border hover:border-orange-200'}`}>
                    <input type="radio" name="rotation" value={deg} checked={globalRotation === deg} onChange={() => setGlobalRotation(deg)} className="sr-only" />
                    <RotateCw className="w-6 h-6 text-orange-500" style={{ transform: `rotate(${deg - 90}deg)` }} />
                    <span className="font-medium text-secondary text-sm">{deg}°</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={reset} className="btn-secondary">Change file</button>
              <button onClick={handleRotate} className="btn-primary flex-1" style={{ backgroundColor: '#EA580C' }}>
                <RotateCw className="w-4 h-4" />
                Rotate PDF
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && <ProcessingScreen message="Rotating your PDF pages..." />}
        {step === 'download' && download && <DownloadScreen {...download} onReset={reset} relatedToolIds={['merge-pdf', 'split-pdf']} />}
      </div>
    </div>
  )
}
