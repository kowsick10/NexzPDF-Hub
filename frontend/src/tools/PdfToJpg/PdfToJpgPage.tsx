import { useState } from 'react'
import { FileImage, Trash2 } from 'lucide-react'
import { ToolPageHeader } from '../../components/common/ToolPageHeader'
import { DropZone } from '../../components/upload/DropZone'
import { ProcessingScreen } from '../../components/common/ProcessingScreen'
import { DownloadScreen } from '../../components/download/DownloadScreen'
import { ErrorAlert } from '../../components/common/ErrorAlert'
import { useFileUpload } from '../../hooks/useFileUpload'
import { useJobPoller } from '../../hooks/useJobPoller'
import { pdfToJpg } from '../../services/api'
import { validatePdfFile } from '../../utils/validation'
import { formatBytes } from '../../utils/format'
import type { UploadedFile, DownloadInfo, ToolStep } from '../../types'

export function PdfToJpgPage() {
  const [step, setStep] = useState<ToolStep>('upload')
  const [file, setFile] = useState<UploadedFile | null>(null)
  const [quality, setQuality] = useState<'standard' | 'high'>('high')
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

  const handleConvert = async () => {
    if (!file) return
    setError(null)
    setStep('processing')
    try {
      const job = await pdfToJpg({ fileId: file.fileId, sessionToken, quality })
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

  const reset = () => { setStep('upload'); setFile(null); setDownload(null); setError(null) }

  return (
    <div>
      <ToolPageHeader title="PDF to JPG" description="Convert each PDF page into a high-quality JPG image." color="#DC2626" bgColor="#FEF2F2" icon={<FileImage className="w-7 h-7" />} step={step === 'upload' ? 1 : step === 'configure' ? 2 : step === 'processing' ? 3 : 4} totalSteps={4} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {error && <div className="mb-6"><ErrorAlert message={error} onDismiss={() => setError(null)} /></div>}

        {step === 'upload' && <DropZone accept=".pdf,application/pdf" onFiles={handleFile} disabled={uploading} />}

        {step === 'configure' && file && (
          <div className="space-y-6">
            <div className="card flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 flex-shrink-0">
                <FileImage className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-secondary truncate">{file.originalName}</p>
                <p className="text-sm text-brand-muted">{formatBytes(file.size)}{file.pageCount ? ` · ${file.pageCount} pages → ${file.pageCount} JPG images` : ''}</p>
              </div>
              <button onClick={reset} className="text-brand-muted hover:text-brand-error p-1"><Trash2 className="w-4 h-4" /></button>
            </div>

            <div>
              <h3 className="font-semibold text-secondary mb-3">Image quality</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'standard' as const, label: 'Standard', desc: '150 DPI – smaller files' },
                  { id: 'high' as const, label: 'High quality', desc: '300 DPI – best clarity' },
                ].map((q) => (
                  <label key={q.id} className={`flex flex-col gap-1 p-4 rounded-xl border cursor-pointer transition-all ${quality === q.id ? 'border-red-400 bg-red-50' : 'border-brand-border hover:border-red-200'}`}>
                    <input type="radio" name="quality" value={q.id} checked={quality === q.id} onChange={() => setQuality(q.id)} className="sr-only" />
                    <span className="font-medium text-secondary text-sm">{q.label}</span>
                    <span className="text-xs text-brand-muted">{q.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <p className="text-xs text-brand-muted">Output: {file.pageCount && file.pageCount > 1 ? 'Multiple JPGs delivered as a ZIP file' : 'Single JPG image'}</p>

            <div className="flex gap-3">
              <button onClick={reset} className="btn-secondary">Change file</button>
              <button onClick={handleConvert} className="btn-primary flex-1">
                <FileImage className="w-4 h-4" />
                Convert to JPG
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && <ProcessingScreen message="Converting PDF pages to JPG..." />}
        {step === 'download' && download && <DownloadScreen {...download} onReset={reset} relatedToolIds={['jpg-to-pdf', 'compress-pdf']} />}
      </div>
    </div>
  )
}
