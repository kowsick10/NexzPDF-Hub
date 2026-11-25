export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._\-\s]/g, '').trim()
}

export function getFileExtension(name: string): string {
  return name.split('.').pop()?.toLowerCase() || ''
}

export function truncateFilename(name: string, maxLength = 40): string {
  if (name.length <= maxLength) return name
  const ext = getFileExtension(name)
  const base = name.substring(0, name.lastIndexOf('.'))
  const truncated = base.substring(0, maxLength - ext.length - 4)
  return `${truncated}...${ext}`
}
