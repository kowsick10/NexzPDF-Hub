import { Link } from 'react-router-dom'
import { FileX, Home, ArrowRight } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mb-6">
        <FileX className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-5xl font-bold text-secondary mb-4">404</h1>
      <p className="text-xl font-semibold text-secondary mb-2">Page not found</p>
      <p className="text-brand-muted mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex gap-4">
        <Link to="/" className="btn-primary">
          <Home className="w-4 h-4" />
          Go home
        </Link>
        <Link to="/all-tools" className="btn-secondary">
          All tools
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
