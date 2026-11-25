import { Link } from 'react-router-dom'
import { ArrowRight, Merge, Scissors, Minimize2, Image, FileImage, FileText, RotateCw, Lock, Unlock } from 'lucide-react'
import { tools } from '../config/tools'

const toolIcons: Record<string, React.ReactNode> = {
  'merge-pdf': <Merge className="w-7 h-7" />,
  'split-pdf': <Scissors className="w-7 h-7" />,
  'compress-pdf': <Minimize2 className="w-7 h-7" />,
  'jpg-to-pdf': <Image className="w-7 h-7" />,
  'pdf-to-jpg': <FileImage className="w-7 h-7" />,
  'word-to-pdf': <FileText className="w-7 h-7" />,
  'rotate-pdf': <RotateCw className="w-7 h-7" />,
  'protect-pdf': <Lock className="w-7 h-7" />,
  'unlock-pdf': <Unlock className="w-7 h-7" />,
}

export function AllToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-secondary mb-4">All PDF Tools</h1>
        <p className="text-lg text-brand-muted">Every tool you need to work with PDF files, completely free</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link key={tool.id} to={tool.path} className="tool-card group">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: tool.bgColor }}>
              <span style={{ color: tool.color }}>{toolIcons[tool.id]}</span>
            </div>
            <div>
              <h2 className="font-semibold text-secondary text-lg group-hover:text-primary transition-colors">{tool.name}</h2>
              <p className="text-sm text-brand-muted mt-1 leading-relaxed">{tool.description}</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium mt-auto" style={{ color: tool.color }}>
              Use tool <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
