import { LoadingSpinner } from './LoadingSpinner'

interface ProcessingScreenProps {
  message?: string
  onCancel?: () => void
}

export function ProcessingScreen({ message = 'Processing your file...', onCancel }: ProcessingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 animate-fade-in">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-primary-100" />
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center">
            <LoadingSpinner size="sm" />
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-secondary font-semibold text-lg">{message}</p>
        <p className="text-brand-muted text-sm mt-2">This may take a few seconds</p>
      </div>
      {onCancel && (
        <button onClick={onCancel} className="text-sm text-brand-muted hover:text-brand-error transition-colors underline">
          Cancel
        </button>
      )}
    </div>
  )
}
