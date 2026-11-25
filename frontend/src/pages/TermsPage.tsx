import { brand } from '../config/brand'

export function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-4xl font-bold text-secondary mb-2">Terms and Conditions</h1>
      <p className="text-brand-muted mb-10">Last updated: November 2026</p>

      <div className="space-y-8 text-brand-muted leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-secondary mb-3">1. Use of the service</h2>
          <p>{brand.name} is provided free of charge by {brand.company} for personal and commercial use. You may use the service to process documents you own or have authorization to process.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary mb-3">2. Acceptable use</h2>
          <p>You agree not to use {brand.name} to process documents containing illegal content, to attempt to bypass security measures, to overload the service with automated requests, or to process documents without authorization from their owner.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary mb-3">3. Limitation of liability</h2>
          <p>The service is provided "as is" without warranties of any kind. {brand.company} is not liable for any loss of data, documents or business arising from use of the service. Always keep backups of important documents before processing.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary mb-3">4. File retention</h2>
          <p>Files are automatically deleted within 60 minutes of processing. {brand.company} accepts no liability for files that cannot be downloaded after expiry. Download your processed files promptly.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary mb-3">5. Changes to these terms</h2>
          <p>We may update these terms at any time. Continued use of {brand.name} constitutes acceptance of the current terms.</p>
        </section>
      </div>
    </div>
  )
}
