import { useState } from 'react'
import { FileText, Trash2 } from 'lucide-react'
import { ToolPageHeader } from '../../components/common/ToolPageHeader'
import { DropZone } from '../../components/upload/DropZone'
import { ProcessingScreen } from '../../components/common/ProcessingScreen'
import { DownloadScreen } from '../../components/download/DownloadScreen'
import { ErrorAlert } from '../../components/common/ErrorAlert'
import { useFileUpload } from '../../hooks/useFileUpload'
import { useJobPoller } from '../../hooks/useJobPoller'
import { wordToPdf } from '../../services/api'
import { validateWordFile } from '../../utils/validation'
import { formatBytes } from '../../utils/format'
import type { UploadedFile, DownloadInfo, ToolStep } from '../../types'

export function WordToPdfPage() {
  const [step, setStep] = useState<ToolStep>('upload')
  const [file, setFile] = useState<UploadedFile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [download, setDownload] = useState<DownloadInfo | null>(null)

  const { uploadFiles, uploading, sessionToken } = useFileUpload()
  const { startPolling } = useJobPoller()

  const handleFile = async (files: File[]) => {
    setError(null)
    const v = validateWordFile(files[0])
    if (!v.valid) { setError(v.error!); return }
    const results = await uploadFiles([files[0]])
    if (results.length) { setFile(results[0]); setStep('configure') }
  }

  const handleConvert = async () => {
    if (!file) return
    setError(null)
    setStep('processing')
    try {
      const job = await wordToPdf({ fileId: file.fileId, sessionToken })
      const result = await startPolling(job.jobId!)
      if (result.status === 'completed') {
        setDownload({ jobId: result.jobId, fileId: result.fileId!, fileName: result.fileName!, fileSize: result.fileSize!, downloadToken: result.downloadToken!, sessionToken })
        setStep('download')
      } else {
        setError(result.errorMessage || 'Conversion failed. Ensure LibreOffice is installed on the server.')
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
      <ToolPageHeader title="Word to PDF" description="Convert Word documents (DOC, DOCX) to PDF with formatting preserved." color="#0284C7" bgColor="#F0F9FF" icon={<FileText className="w-7 h-7" />} step={step === 'upload' ? 1 : step === 'configure' ? 2 : step === 'processing' ? 3 : 4} totalSteps={4} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {error && <div className="mb-6"><ErrorAlert message={error} onDismiss={() => setError(null)} /></div>}

        {step === 'upload' && (
          <div className="space-y-4">
            <DropZone accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onFiles={handleFile} label="Drop your Word document here" sublabel="DOC and DOCX files accepted" disabled={uploading} />
            <div className="text-xs text-brand-muted text-center p-3 bg-blue-50 rounded-xl">
              Conversion uses LibreOffice. Complex documents may have minor formatting differences.
            </div>
          </div>
        )}

        {step === 'configure' && file && (
          <div className="space-y-6">
            <div className="card flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-secondary truncate">{file.originalName}</p>
                <p className="text-sm text-brand-muted">{formatBytes(file.size)}</p>
              </div>
              <button onClick={reset} className="text-brand-muted hover:text-brand-error p-1"><Trash2 className="w-4 h-4" /></button>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
              Formatting including images, tables and fonts will be preserved as accurately as possible. Documents using uncommon fonts may show minor differences.
            </div>

            <div className="flex gap-3">
              <button onClick={reset} className="btn-secondary">Change file</button>
              <button onClick={handleConvert} className="btn-primary flex-1">
                <FileText className="w-4 h-4" />
                Convert to PDF
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && <ProcessingScreen message="Converting Word document to PDF..." />}
        {step === 'download' && download && <DownloadScreen {...download} onReset={reset} relatedToolIds={['compress-pdf', 'merge-pdf']} />}
      </div>
    </div>
  )
}
