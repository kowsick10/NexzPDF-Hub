import { useState } from 'react'
import { Scissors, Trash2 } from 'lucide-react'
import { ToolPageHeader } from '../../components/common/ToolPageHeader'
import { DropZone } from '../../components/upload/DropZone'
import { ProcessingScreen } from '../../components/common/ProcessingScreen'
import { DownloadScreen } from '../../components/download/DownloadScreen'
import { ErrorAlert } from '../../components/common/ErrorAlert'
import { useFileUpload } from '../../hooks/useFileUpload'
import { useJobPoller } from '../../hooks/useJobPoller'
import { splitPdf } from '../../services/api'
import { validatePdfFile, validatePageRange } from '../../utils/validation'
import { formatBytes } from '../../utils/format'
import type { UploadedFile, DownloadInfo, ToolStep } from '../../types'

type Mode = 'ranges' | 'extract' | 'all'

export function SplitPdfPage() {
  const [step, setStep] = useState<ToolStep>('upload')
  const [file, setFile] = useState<UploadedFile | null>(null)
  const [mode, setMode] = useState<Mode>('ranges')
  const [ranges, setRanges] = useState('')
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

  const handleSplit = async () => {
    if (!file) return
    if (mode === 'ranges') {
      const v = validatePageRange(ranges, file.pageCount || 999)
      if (!v.valid) { setError(v.error!); return }
    }
    setError(null)
    setStep('processing')
    try {
      const job = await splitPdf({ fileId: file.fileId, sessionToken, mode, ranges: mode === 'ranges' ? ranges : undefined })
      const result = await startPolling(job.jobId!)
      if (result.status === 'completed') {
        setDownload({ jobId: result.jobId, fileId: result.fileId!, fileName: result.fileName!, fileSize: result.fileSize!, downloadToken: result.downloadToken!, sessionToken })
        setStep('download')
      } else {
        setError(result.errorMessage || 'Split failed.')
        setStep('configure')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Split failed.')
      setStep('configure')
    }
  }

  const reset = () => { setStep('upload'); setFile(null); setDownload(null); setError(null); setRanges('') }

  return (
    <div>
      <ToolPageHeader title="Split PDF" description="Split a PDF into separate pages or extract specific page ranges." color="#7C3AED" bgColor="#F5F3FF" icon={<Scissors className="w-7 h-7" />} step={step === 'upload' ? 1 : step === 'configure' ? 2 : step === 'processing' ? 3 : 4} totalSteps={4} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {error && <div className="mb-6"><ErrorAlert message={error} onDismiss={() => setError(null)} /></div>}

        {step === 'upload' && <DropZone accept=".pdf,application/pdf" onFiles={handleFile} disabled={uploading} />}

        {step === 'configure' && file && (
          <div className="space-y-6">
            <div className="card flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 flex-shrink-0">
                <Scissors className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-secondary truncate">{file.originalName}</p>
                <p className="text-sm text-brand-muted">{formatBytes(file.size)}{file.pageCount ? ` · ${file.pageCount} pages` : ''}</p>
              </div>
              <button onClick={reset} className="text-brand-muted hover:text-brand-error p-1"><Trash2 className="w-4 h-4" /></button>
            </div>

            <div>
              <h3 className="font-semibold text-secondary mb-3">Split method</h3>
              <div className="space-y-2">
                {[
                  { id: 'ranges' as Mode, label: 'Custom page ranges', desc: 'Specify pages to extract, e.g. 1-3, 5, 7-10' },
                  { id: 'extract' as Mode, label: 'Extract all pages', desc: 'Save every page as a separate PDF file (ZIP output)' },
                  { id: 'all' as Mode, label: 'Split into individual pages', desc: 'Split the entire document into single-page PDFs' },
                ].map((m) => (
                  <label key={m.id} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${mode === m.id ? 'border-purple-400 bg-purple-50' : 'border-brand-border hover:border-purple-200'}`}>
                    <input type="radio" name="mode" value={m.id} checked={mode === m.id} onChange={() => setMode(m.id)} className="accent-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-secondary text-sm">{m.label}</p>
                      <p className="text-xs text-brand-muted">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {mode === 'ranges' && (
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Page ranges {file.pageCount ? `(1 – ${file.pageCount})` : ''}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1-3, 5, 7-10"
                  value={ranges}
                  onChange={(e) => setRanges(e.target.value)}
                  className="input-field"
                />
                <p className="text-xs text-brand-muted mt-2">Separate ranges or pages with commas. Output is a single PDF or ZIP depending on range count.</p>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={reset} className="btn-secondary">Change file</button>
              <button onClick={handleSplit} className="btn-primary flex-1">
                <Scissors className="w-4 h-4" />
                Split PDF
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && <ProcessingScreen message="Splitting your PDF..." />}
        {step === 'download' && download && <DownloadScreen {...download} onReset={reset} relatedToolIds={['merge-pdf', 'compress-pdf']} />}
      </div>
    </div>
  )
}
