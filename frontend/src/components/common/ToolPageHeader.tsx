import { Link } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'

interface ToolPageHeaderProps {
  title: string
  description: string
  color: string
  bgColor: string
  icon: React.ReactNode
  step?: number
  totalSteps?: number
}

export function ToolPageHeader({ title, description, color, bgColor, icon, step, totalSteps }: ToolPageHeaderProps) {
  return (
    <div className="bg-white border-b border-brand-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-secondary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to tools
        </Link>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bgColor }}>
            <span style={{ color }}>{icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">{title}</h1>
            <p className="text-brand-muted mt-1 text-sm sm:text-base">{description}</p>
          </div>
        </div>

        {step && totalSteps && (
          <div className="flex items-center gap-3 mt-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${i < step ? 'bg-primary' : 'bg-brand-border'}`}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 mt-4 text-xs text-brand-muted">
          <Shield className="w-3.5 h-3.5" />
          Files are processed securely and deleted automatically after 60 minutes
        </div>
      </div>
    </div>
  )
}
