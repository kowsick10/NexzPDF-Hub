import { brand } from '../config/brand'

export function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-4xl font-bold text-secondary mb-2">Privacy Policy</h1>
      <p className="text-brand-muted mb-10">Last updated: November 2026</p>

      <div className="space-y-8 text-brand-muted leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-secondary mb-3">1. Files you upload</h2>
          <p>Files uploaded to {brand.name} are stored temporarily in isolated server directories solely for the purpose of processing your request. All uploaded files and processing outputs are automatically deleted within 60 minutes. You can delete your files immediately using the Delete Files button on the download screen.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary mb-3">2. Data we do not collect</h2>
          <p>We do not require registration, collect personal information, read your document contents, store passwords you enter for PDF operations, or sell data to third parties.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary mb-3">3. Analytics</h2>
          <p>We may collect anonymous usage data such as page views and tool usage counts to improve the service. No personal identifiers are collected.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary mb-3">4. Security</h2>
          <p>All file transfers are encrypted using HTTPS. Files are processed in isolated temporary environments with restricted permissions. Session tokens are used only to authorize file access within a single browser session.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary mb-3">5. Contact</h2>
          <p>Questions about this privacy policy may be directed to <a href={`mailto:${brand.contact.email}`} className="text-primary hover:underline">{brand.contact.email}</a>.</p>
        </section>
      </div>
    </div>
  )
}
