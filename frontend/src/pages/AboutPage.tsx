import { brand } from '../config/brand'
import { Shield, Zap, Heart } from 'lucide-react'

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-4xl font-bold text-secondary mb-4">{brand.name}</h1>
      <p className="text-xl text-brand-muted mb-12">{brand.tagline}</p>

      <section className="card mb-8 flex flex-col sm:flex-row items-center gap-6">
        <img
          src="/nexpdf-logo.png"
          alt="NexzPDF Hub logo"
          className="h-24 w-auto max-w-full object-contain"
        />
        <div>
          <h2 className="text-xl font-semibold text-secondary mb-2">About {brand.name}</h2>
          <p className="text-brand-muted leading-relaxed">
            {brand.name} is developed by the <strong>{brand.developer}</strong>. It provides fast,
            accessible and secure PDF tools that help individuals and businesses work with documents easily.
          </p>
        </div>
      </section>

      <div className="prose prose-slate max-w-none space-y-8">
        <section className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary">
              <Heart className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-secondary">Our mission</h2>
          </div>
          <p className="text-brand-muted leading-relaxed">
            {brand.name} is built by {brand.company} to make PDF processing simple, accessible and free for everyone.
            We believe that essential document tools should not require expensive subscriptions, account registrations or software downloads.
          </p>
        </section>

        <section className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-secondary">Privacy and security</h2>
          </div>
          <p className="text-brand-muted leading-relaxed">
            Your documents are uploaded over encrypted HTTPS connections and processed in isolated temporary environments.
            All files are automatically deleted within 60 minutes of processing. We never read, analyse or share your documents.
            Passwords entered for PDF protection are never logged or stored.
          </p>
        </section>

        <section className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-secondary">Technology</h2>
          </div>
          <p className="text-brand-muted leading-relaxed">
            {brand.name} runs entirely on open-source libraries. PDF processing is performed server-side using Python-based tools
            including pypdf, Pillow and pypdfium2. No third-party cloud processing services receive your documents.
          </p>
        </section>
      </div>
    </div>
  )
}
