import { useState } from 'react'
import { Minimize2, Trash2 } from 'lucide-react'
import { ToolPageHeader } from '../../components/common/ToolPageHeader'
import { DropZone } from '../../components/upload/DropZone'
import { ProcessingScreen } from '../../components/common/ProcessingScreen'
import { DownloadScreen } from '../../components/download/DownloadScreen'
import { ErrorAlert } from '../../components/common/ErrorAlert'
import { useFileUpload } from '../../hooks/useFileUpload'
import { useJobPoller } from '../../hooks/useJobPoller'
import { compressPdf } from '../../services/api'
import { validatePdfFile } from '../../utils/validation'
import { formatBytes } from '../../utils/format'
import type { UploadedFile, DownloadInfo, ToolStep } from '../../types'

type Level = 'low' | 'recommended' | 'high'

const levels: { id: Level; label: string; desc: string }[] = [
  { id: 'low', label: 'Low compression', desc: 'Better quality, larger file' },
  { id: 'recommended', label: 'Recommended', desc: 'Balanced quality and size' },
  { id: 'high', label: 'High compression', desc: 'Smaller file, lower quality' },
]

export function CompressPdfPage() {
  const [step, setStep] = useState<ToolStep>('upload')
  const [file, setFile] = useState<UploadedFile | null>(null)
  const [level, setLevel] = useState<Level>('recommended')
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

  const handleCompress = async () => {
    if (!file) return
    setError(null)
    setStep('processing')
    try {
      const job = await compressPdf({ fileId: file.fileId, sessionToken, level })
      const result = await startPolling(job.jobId!)
      if (result.status === 'completed') {
        setDownload({ jobId: result.jobId, fileId: result.fileId!, fileName: result.fileName!, fileSize: result.fileSize!, downloadToken: result.downloadToken!, sessionToken })
        setStep('download')
      } else {
        setError(result.errorMessage || 'Compression failed.')
        setStep('configure')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Compression failed.')
      setStep('configure')
    }
  }

  const reset = () => { setStep('upload'); setFile(null); setDownload(null); setError(null) }

  return (
    <div>
      <ToolPageHeader title="Compress PDF" description="Reduce PDF file size while preserving quality." color="#059669" bgColor="#ECFDF5" icon={<Minimize2 className="w-7 h-7" />} step={step === 'upload' ? 1 : step === 'configure' ? 2 : step === 'processing' ? 3 : 4} totalSteps={4} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {error && <div className="mb-6"><ErrorAlert message={error} onDismiss={() => setError(null)} /></div>}

        {step === 'upload' && <DropZone accept=".pdf,application/pdf" onFiles={handleFile} disabled={uploading} />}

        {step === 'configure' && file && (
          <div className="space-y-6">
            <div className="card flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
                <Minimize2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-secondary truncate">{file.originalName}</p>
                <p className="text-sm text-brand-muted">Original size: {formatBytes(file.size)}</p>
              </div>
              <button onClick={reset} className="text-brand-muted hover:text-brand-error transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
            </div>

            <div>
              <h3 className="font-semibold text-secondary mb-3">Compression level</h3>
              <div className="space-y-2">
                {levels.map((l) => (
                  <label key={l.id} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${level === l.id ? 'border-primary bg-primary-50' : 'border-brand-border hover:border-primary/50'}`}>
                    <input type="radio" name="level" value={l.id} checked={level === l.id} onChange={() => setLevel(l.id)} className="accent-primary" />
                    <div>
                      <p className="font-medium text-secondary text-sm">{l.label}</p>
                      <p className="text-xs text-brand-muted">{l.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={reset} className="btn-secondary">Change file</button>
              <button onClick={handleCompress} className="btn-primary flex-1">
                <Minimize2 className="w-4 h-4" />
                Compress PDF
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && <ProcessingScreen message="Compressing your PDF..." />}
        {step === 'download' && download && <DownloadScreen {...download} onReset={reset} relatedToolIds={['merge-pdf', 'split-pdf']} />}
      </div>
    </div>
  )
}
