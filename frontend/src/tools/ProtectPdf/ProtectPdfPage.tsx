import { useState } from 'react'
import { Lock, Eye, EyeOff, Trash2 } from 'lucide-react'
import { ToolPageHeader } from '../../components/common/ToolPageHeader'
import { DropZone } from '../../components/upload/DropZone'
import { ProcessingScreen } from '../../components/common/ProcessingScreen'
import { DownloadScreen } from '../../components/download/DownloadScreen'
import { ErrorAlert } from '../../components/common/ErrorAlert'
import { useFileUpload } from '../../hooks/useFileUpload'
import { useJobPoller } from '../../hooks/useJobPoller'
import { protectPdf } from '../../services/api'
import { validatePdfFile, validatePassword } from '../../utils/validation'
import { formatBytes } from '../../utils/format'
import type { UploadedFile, DownloadInfo, ToolStep } from '../../types'

export function ProtectPdfPage() {
  const [step, setStep] = useState<ToolStep>('upload')
  const [file, setFile] = useState<UploadedFile | null>(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
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

  const handleProtect = async () => {
    if (!file) return
    const v = validatePassword(password, confirm)
    if (!v.valid) { setError(v.error!); return }
    setError(null)
    setStep('processing')
    try {
      const job = await protectPdf({ fileId: file.fileId, sessionToken, password })
      const result = await startPolling(job.jobId!)
      if (result.status === 'completed') {
        setDownload({ jobId: result.jobId, fileId: result.fileId!, fileName: result.fileName!, fileSize: result.fileSize!, downloadToken: result.downloadToken!, sessionToken })
        setStep('download')
      } else {
        setError(result.errorMessage || 'Protection failed.')
        setStep('configure')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Protection failed.')
      setStep('configure')
    } finally {
      setPassword('')
      setConfirm('')
    }
  }

  const reset = () => { setStep('upload'); setFile(null); setDownload(null); setError(null); setPassword(''); setConfirm('') }

  return (
    <div>
      <ToolPageHeader title="Protect PDF" description="Add AES-256 password protection to your PDF." color="#BE185D" bgColor="#FDF2F8" icon={<Lock className="w-7 h-7" />} step={step === 'upload' ? 1 : step === 'configure' ? 2 : step === 'processing' ? 3 : 4} totalSteps={4} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {error && <div className="mb-6"><ErrorAlert message={error} onDismiss={() => setError(null)} /></div>}

        {step === 'upload' && <DropZone accept=".pdf,application/pdf" onFiles={handleFile} disabled={uploading} />}

        {step === 'configure' && file && (
          <div className="space-y-6">
            <div className="card flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 flex-shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-secondary truncate">{file.originalName}</p>
                <p className="text-sm text-brand-muted">{formatBytes(file.size)}</p>
              </div>
              <button onClick={reset} className="text-brand-muted hover:text-brand-error p-1"><Trash2 className="w-4 h-4" /></button>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="input-field pr-12"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-secondary">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Confirm password</label>
              <input
                type={showPass ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password"
                className="input-field"
                autoComplete="new-password"
              />
            </div>

            <div className="p-3 bg-pink-50 rounded-xl text-xs text-pink-700">
              Your password is never stored or logged. Keep it safe — it cannot be recovered.
            </div>

            <div className="flex gap-3">
              <button onClick={reset} className="btn-secondary">Change file</button>
              <button onClick={handleProtect} disabled={!password} className="btn-primary flex-1" style={{ backgroundColor: '#BE185D' }}>
                <Lock className="w-4 h-4" />
                Protect PDF
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && <ProcessingScreen message="Encrypting your PDF..." />}
        {step === 'download' && download && <DownloadScreen {...download} onReset={reset} relatedToolIds={['unlock-pdf', 'merge-pdf']} />}
      </div>
    </div>
  )
}
