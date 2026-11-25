import { CheckCircle, Download, Trash2, RefreshCw, Home, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatBytes } from '../../utils/format'
import { getDownloadUrl, deleteJobFiles } from '../../services/api'
import { tools } from '../../config/tools'

interface DownloadScreenProps {
  jobId: string
  fileId: string
  fileName: string
  fileSize: number
  downloadToken: string
  sessionToken: string
  onReset: () => void
  relatedToolIds?: string[]
}

export function DownloadScreen({
  jobId,
  fileId,
  fileName,
  fileSize,
  downloadToken,
  sessionToken,
  onReset,
  relatedToolIds = [],
}: DownloadScreenProps) {
  const downloadUrl = getDownloadUrl(fileId, downloadToken)
  const relatedTools = tools.filter((t) => relatedToolIds.includes(t.id))

  const handleDelete = async () => {
    await deleteJobFiles(jobId, sessionToken)
    onReset()
  }

  return (
    <div className="flex flex-col items-center gap-8 py-10 animate-slide-up">
      {/* Success icon */}
      <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-brand-success" />
      </div>

      {/* File info */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-secondary mb-2">Done!</h2>
        <p className="text-brand-muted text-sm">{fileName}</p>
        <p className="text-brand-muted text-xs mt-1">{formatBytes(fileSize)}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <a
          href={downloadUrl}
          download={fileName}
          className="btn-primary flex-1 justify-center"
        >
          <Download className="w-4 h-4" />
          Download
        </a>
        <button onClick={handleDelete} className="btn-secondary flex-1 justify-center gap-2">
          <Trash2 className="w-4 h-4 text-brand-error" />
          <span className="text-brand-error">Delete files</span>
        </button>
      </div>

      {/* Secondary actions */}
      <div className="flex gap-4 text-sm">
        <button onClick={onReset} className="inline-flex items-center gap-1.5 text-brand-muted hover:text-secondary transition-colors">
          <RefreshCw className="w-4 h-4" />
          Process another
        </button>
        <Link to="/" className="inline-flex items-center gap-1.5 text-brand-muted hover:text-secondary transition-colors">
          <Home className="w-4 h-4" />
          Home
        </Link>
      </div>

      {/* Privacy note */}
      <p className="text-xs text-brand-muted text-center max-w-sm">
        Your files are automatically deleted after 60 minutes. Download them before they expire.
      </p>

      {/* Related tools */}
      {relatedTools.length > 0 && (
        <div className="w-full max-w-lg border-t border-brand-border pt-8">
          <h3 className="text-sm font-semibold text-secondary mb-4 text-center">You might also need</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {relatedTools.map((tool) => (
              <Link
                key={tool.id}
                to={tool.path}
                className="flex items-center gap-2 p-3 rounded-xl border border-brand-border hover:border-primary hover:bg-primary-50 transition-all group"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tool.color }} />
                <span className="text-xs font-medium text-secondary group-hover:text-primary transition-colors">{tool.name}</span>
                <ArrowRight className="w-3 h-3 text-brand-muted group-hover:text-primary ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
