import { useState } from 'react'
import { Unlock, Eye, EyeOff, Trash2 } from 'lucide-react'
import { ToolPageHeader } from '../../components/common/ToolPageHeader'
import { DropZone } from '../../components/upload/DropZone'
import { ProcessingScreen } from '../../components/common/ProcessingScreen'
import { DownloadScreen } from '../../components/download/DownloadScreen'
import { ErrorAlert } from '../../components/common/ErrorAlert'
import { useFileUpload } from '../../hooks/useFileUpload'
import { useJobPoller } from '../../hooks/useJobPoller'
import { unlockPdf } from '../../services/api'
import { validatePdfFile } from '../../utils/validation'
import { formatBytes } from '../../utils/format'
import type { UploadedFile, DownloadInfo, ToolStep } from '../../types'

export function UnlockPdfPage() {
  const [step, setStep] = useState<ToolStep>('upload')
  const [file, setFile] = useState<UploadedFile | null>(null)
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
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

  const handleUnlock = async () => {
    if (!file || !password) { setError('Please enter the document password.'); return }
    setError(null)
    setStep('processing')
    try {
      const job = await unlockPdf({ fileId: file.fileId, sessionToken, password })
      const result = await startPolling(job.jobId!)
      if (result.status === 'completed') {
        setDownload({ jobId: result.jobId, fileId: result.fileId!, fileName: result.fileName!, fileSize: result.fileSize!, downloadToken: result.downloadToken!, sessionToken })
        setStep('download')
      } else {
        setError(result.errorMessage || 'Incorrect password or the file is not password-protected.')
        setStep('configure')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unlock failed.')
      setStep('configure')
    } finally {
      setPassword('')
    }
  }

  const reset = () => { setStep('upload'); setFile(null); setDownload(null); setError(null); setPassword('') }

  return (
    <div>
      <ToolPageHeader title="Unlock PDF" description="Remove password protection from your PDF using the authorized password." color="#0F766E" bgColor="#F0FDFA" icon={<Unlock className="w-7 h-7" />} step={step === 'upload' ? 1 : step === 'configure' ? 2 : step === 'processing' ? 3 : 4} totalSteps={4} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {error && <div className="mb-6"><ErrorAlert message={error} onDismiss={() => setError(null)} /></div>}

        {step === 'upload' && (
          <div className="space-y-4">
            <DropZone accept=".pdf,application/pdf" onFiles={handleFile} label="Drop your protected PDF here" sublabel="Upload a password-protected PDF" disabled={uploading} />
            <p className="text-xs text-brand-muted text-center">Only remove protection from documents you own or are authorized to access.</p>
          </div>
        )}

        {step === 'configure' && file && (
          <div className="space-y-6">
            <div className="card flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 flex-shrink-0">
                <Unlock className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-secondary truncate">{file.originalName}</p>
                <p className="text-sm text-brand-muted">{formatBytes(file.size)}</p>
              </div>
              <button onClick={reset} className="text-brand-muted hover:text-brand-error p-1"><Trash2 className="w-4 h-4" /></button>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Document password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter the document password"
                  className="input-field pr-12"
                  onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                />
                <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-secondary">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={reset} className="btn-secondary">Change file</button>
              <button onClick={handleUnlock} disabled={!password} className="btn-primary flex-1" style={{ backgroundColor: '#0F766E' }}>
                <Unlock className="w-4 h-4" />
                Unlock PDF
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && <ProcessingScreen message="Removing password protection..." />}
        {step === 'download' && download && <DownloadScreen {...download} onReset={reset} relatedToolIds={['protect-pdf', 'compress-pdf']} />}
      </div>
    </div>
  )
}
