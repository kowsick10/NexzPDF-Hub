import { FILE_LIMITS } from '../config/api'

export interface ValidationResult {
  valid: boolean
  error?: string
}

export function validatePdfFile(file: File): ValidationResult {
  if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
    return { valid: false, error: 'Only PDF files are accepted.' }
  }
  if (file.size === 0) {
    return { valid: false, error: 'The file is empty.' }
  }
  if (file.size > FILE_LIMITS.maxSizeBytes) {
    return { valid: false, error: `File exceeds the ${FILE_LIMITS.maxSizeMB} MB limit.` }
  }
  return { valid: true }
}

export function validateImageFile(file: File): ValidationResult {
  const validTypes = ['image/jpeg', 'image/png']
  const validExts = ['.jpg', '.jpeg', '.png']
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!validTypes.includes(file.type) && !validExts.includes(ext)) {
    return { valid: false, error: 'Only JPG and PNG images are accepted.' }
  }
  if (file.size === 0) {
    return { valid: false, error: 'The file is empty.' }
  }
  if (file.size > FILE_LIMITS.maxSizeBytes) {
    return { valid: false, error: `File exceeds the ${FILE_LIMITS.maxSizeMB} MB limit.` }
  }
  return { valid: true }
}

export function validateWordFile(file: File): ValidationResult {
  const validTypes = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  const validExts = ['.doc', '.docx']
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!validTypes.includes(file.type) && !validExts.includes(ext)) {
    return { valid: false, error: 'Only DOC and DOCX files are accepted.' }
  }
  if (file.size === 0) {
    return { valid: false, error: 'The file is empty.' }
  }
  if (file.size > FILE_LIMITS.maxSizeBytes) {
    return { valid: false, error: `File exceeds the ${FILE_LIMITS.maxSizeMB} MB limit.` }
  }
  return { valid: true }
}

export function validatePassword(password: string, confirm: string): ValidationResult {
  if (password.length < 4) {
    return { valid: false, error: 'Password must be at least 4 characters.' }
  }
  if (password !== confirm) {
    return { valid: false, error: 'Passwords do not match.' }
  }
  return { valid: true }
}

export function validatePageRange(range: string, totalPages: number): ValidationResult {
  if (!range.trim()) {
    return { valid: false, error: 'Please enter a page range.' }
  }
  const parts = range.split(',').map((s) => s.trim())
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number)
      if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
        return { valid: false, error: `Invalid range "${part}". Pages must be between 1 and ${totalPages}.` }
      }
    } else {
      const page = Number(part)
      if (isNaN(page) || page < 1 || page > totalPages) {
        return { valid: false, error: `Invalid page "${part}". Must be between 1 and ${totalPages}.` }
      }
    }
  }
  return { valid: true }
}
