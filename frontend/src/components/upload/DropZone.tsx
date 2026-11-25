import { useCallback, useState } from 'react'
import { Upload, Plus } from 'lucide-react'
import { FILE_LIMITS } from '../../config/api'

interface DropZoneProps {
  accept: string
  multiple?: boolean
  onFiles: (files: File[]) => void
  label?: string
  sublabel?: string
  disabled?: boolean
  compact?: boolean
}

export function DropZone({
  accept,
  multiple = false,
  onFiles,
  label,
  sublabel,
  disabled = false,
  compact = false,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      const files = Array.from(e.dataTransfer.files)
      if (files.length) onFiles(multiple ? files : [files[0]])
    },
    [disabled, multiple, onFiles],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length) onFiles(multiple ? files : [files[0]])
      e.target.value = ''
    },
    [multiple, onFiles],
  )

  if (compact) {
    return (
      <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-brand-border text-brand-muted hover:border-primary hover:text-primary hover:bg-primary-50 transition-all cursor-pointer text-sm font-medium ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <Plus className="w-4 h-4" />
        Add more files
        <input type="file" accept={accept} multiple={multiple} className="sr-only" onChange={handleChange} disabled={disabled} />
      </label>
    )
  }

  return (
    <label
      className={`upload-zone ${isDragging ? 'border-primary bg-primary-50' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? 'bg-primary text-white' : 'bg-primary-50 text-primary'}`}>
        <Upload className="w-7 h-7" />
      </div>
      <div className="text-center">
        <p className="text-secondary font-semibold text-lg">
          {label || (multiple ? 'Drop PDF files here' : 'Drop your file here')}
        </p>
        <p className="text-brand-muted text-sm mt-1">
          {sublabel || `or click to browse — max ${FILE_LIMITS.maxSizeMB} MB`}
        </p>
      </div>
      <p className="text-xs text-brand-muted border border-brand-border rounded-lg px-3 py-1.5">
        {accept.split(',').join(' · ').toUpperCase().replace(/\./g, '')}
      </p>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={handleChange}
        disabled={disabled}
      />
    </label>
  )
}
