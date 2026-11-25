export interface ToolConfig {
  id: string
  name: string
  path: string
  description: string
  shortDesc: string
  color: string
  bgColor: string
  accepts: string
  category: 'organize' | 'convert' | 'security'
}

export const tools: ToolConfig[] = [
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    path: '/merge-pdf',
    description: 'Combine multiple PDF files into one single document in your chosen order.',
    shortDesc: 'Combine multiple PDFs into one',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    accepts: '.pdf',
    category: 'organize',
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    path: '/split-pdf',
    description: 'Split a PDF into separate pages or extract specific page ranges.',
    shortDesc: 'Split pages or extract ranges',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    accepts: '.pdf',
    category: 'organize',
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    path: '/compress-pdf',
    description: 'Reduce PDF file size while preserving quality for easy sharing.',
    shortDesc: 'Reduce file size',
    color: '#059669',
    bgColor: '#ECFDF5',
    accepts: '.pdf',
    category: 'organize',
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    path: '/jpg-to-pdf',
    description: 'Convert JPG, JPEG and PNG images into a single PDF document.',
    shortDesc: 'Convert images to PDF',
    color: '#D97706',
    bgColor: '#FFFBEB',
    accepts: '.jpg,.jpeg,.png',
    category: 'convert',
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    path: '/pdf-to-jpg',
    description: 'Convert each PDF page into a high-quality JPG image.',
    shortDesc: 'Convert PDF pages to images',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    accepts: '.pdf',
    category: 'convert',
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    path: '/word-to-pdf',
    description: 'Convert Word documents (DOC, DOCX) to PDF with formatting preserved.',
    shortDesc: 'Convert Word documents to PDF',
    color: '#0284C7',
    bgColor: '#F0F9FF',
    accepts: '.doc,.docx',
    category: 'convert',
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    path: '/rotate-pdf',
    description: 'Rotate PDF pages individually or all at once by 90°, 180° or 270°.',
    shortDesc: 'Rotate pages to correct orientation',
    color: '#EA580C',
    bgColor: '#FFF7ED',
    accepts: '.pdf',
    category: 'organize',
  },
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    path: '/protect-pdf',
    description: 'Password protect your PDF with AES-256 encryption to control access.',
    shortDesc: 'Add password protection',
    color: '#BE185D',
    bgColor: '#FDF2F8',
    accepts: '.pdf',
    category: 'security',
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    path: '/unlock-pdf',
    description: 'Remove password protection from your PDF using the authorized password.',
    shortDesc: 'Remove password protection',
    color: '#0F766E',
    bgColor: '#F0FDFA',
    accepts: '.pdf',
    category: 'security',
  },
]

export const getToolById = (id: string) => tools.find((t) => t.id === id)
export const getToolByPath = (path: string) => tools.find((t) => t.path === path)
