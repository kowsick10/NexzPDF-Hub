import { Mail, Building } from 'lucide-react'
import { brand } from '../config/brand'

export function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-4xl font-bold text-secondary mb-4">Contact Us</h1>
      <p className="text-brand-muted mb-10">Have a question, feedback or bug report? We'd love to hear from you.</p>

      <div className="space-y-6">
        <div className="card flex items-start gap-4">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-secondary">Email</h2>
            <a href={`mailto:${brand.contact.email}`} className="text-primary hover:underline text-sm mt-1 block">
              {brand.contact.email}
            </a>
          </div>
        </div>

        <div className="card flex items-start gap-4">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-secondary">Company</h2>
            <p className="text-brand-muted text-sm mt-1">{brand.company}</p>
            <a
              href={brand.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm mt-1 block"
            >
              {brand.contact.website}
            </a>
          </div>
        </div>
      </div>

      <p className="text-xs text-brand-muted mt-10">
        Please do not send us copies of your personal or confidential documents via email.
        All file processing happens directly through the tool interface.
      </p>
    </div>
  )
}
