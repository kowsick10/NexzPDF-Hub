import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Merge, Scissors, Minimize2, Image, FileImage, FileText,
  RotateCw, Lock, Unlock, Shield, UserX, Zap, Smartphone, ChevronDown,
  ArrowRight, CheckCircle2,
} from 'lucide-react'
import { brand } from '../config/brand'
import { tools } from '../config/tools'

const toolIcons: Record<string, React.ReactNode> = {
  'merge-pdf': <Merge className="w-6 h-6" />,
  'split-pdf': <Scissors className="w-6 h-6" />,
  'compress-pdf': <Minimize2 className="w-6 h-6" />,
  'jpg-to-pdf': <Image className="w-6 h-6" />,
  'pdf-to-jpg': <FileImage className="w-6 h-6" />,
  'word-to-pdf': <FileText className="w-6 h-6" />,
  'rotate-pdf': <RotateCw className="w-6 h-6" />,
  'protect-pdf': <Lock className="w-6 h-6" />,
  'unlock-pdf': <Unlock className="w-6 h-6" />,
}

const faqs = [
  { q: 'Is NexzPDF Hub free to use?', a: 'Yes. All nine PDF tools are completely free with no registration required. You can process files immediately without creating an account.' },
  { q: 'Are my files secure?', a: 'Your files are uploaded over an encrypted HTTPS connection, processed in isolated temporary directories, and automatically deleted after 60 minutes. We never access or share your documents.' },
  { q: 'What is the maximum file size?', a: 'Each file can be up to 25 MB and you can upload up to 10 files per operation with a combined maximum of 100 MB.' },
  { q: 'Which file formats are supported?', a: 'We support PDF files for most tools. JPG to PDF accepts JPG and PNG images. Word to PDF accepts DOC and DOCX files.' },
  { q: 'When are my files deleted?', a: 'All uploaded files and processed outputs are automatically deleted within 60 minutes of processing. You can also delete your files immediately using the Delete Files button on the download screen.' },
  { q: 'Does NexzPDF Hub work on mobile?', a: 'Yes. NexzPDF Hub is fully responsive and works on all modern browsers on smartphones, tablets and desktop computers.' },
]

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const filteredTools = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <CheckCircle2 className="w-4 h-4" />
            Free · No registration · Secure
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-secondary mb-6 leading-tight text-balance">
            Every PDF Tool<br />
            <span className="text-primary">You Need</span>
          </h1>
          <p className="text-lg sm:text-xl text-brand-muted mb-10 max-w-2xl mx-auto text-balance">
            Merge, split, compress, convert and secure your PDF files with simple, fast and free online tools.
          </p>
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
            <input
              type="search"
              placeholder="Search tools — merge, compress, convert..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-brand-border shadow-card focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary text-secondary bg-white"
            />
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="py-16 px-4 bg-white" id="tools">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-heading mb-3">
              {searchQuery ? `Results for "${searchQuery}"` : 'PDF Tools'}
            </h2>
            {!searchQuery && (
              <p className="section-subheading">Everything you need to work with PDF files</p>
            )}
          </div>

          {filteredTools.length === 0 ? (
            <div className="text-center py-16 text-brand-muted">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No tools matched your search. Try a different term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <Link key={tool.id} to={tool.path} className="tool-card group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" style={{ backgroundColor: tool.bgColor }}>
                      <span style={{ color: tool.color }}>{toolIcons[tool.id]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-secondary group-hover:text-primary transition-colors">{tool.name}</h3>
                      <p className="text-sm text-brand-muted mt-1 leading-relaxed">{tool.shortDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-medium gap-1 mt-auto" style={{ color: tool.color }}>
                    Use tool
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-16 px-4 bg-brand-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-3">Why choose {brand.name}?</h2>
            <p className="section-subheading">Built for everyone who works with PDFs</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <CheckCircle2 className="w-6 h-6" />, title: 'Free to use', desc: 'All tools are completely free with no hidden fees or premium tiers.' },
              { icon: <UserX className="w-6 h-6" />, title: 'No registration', desc: 'Start processing immediately. No account or email required.' },
              { icon: <Shield className="w-6 h-6" />, title: 'Secure processing', desc: 'Files are processed over HTTPS in isolated environments and never shared.' },
              { icon: <Zap className="w-6 h-6" />, title: 'Fast conversion', desc: 'Optimised processing pipelines deliver results in seconds.' },
              { icon: <Minimize2 className="w-6 h-6" />, title: 'Auto file deletion', desc: 'All files are automatically deleted within 60 minutes of processing.' },
              { icon: <Smartphone className="w-6 h-6" />, title: 'Works everywhere', desc: 'Fully responsive on mobile, tablet and desktop browsers.' },
            ].map((item, i) => (
              <div key={i} className="card flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 text-primary">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-secondary mb-1">{item.title}</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-3">How it works</h2>
            <p className="section-subheading">Three simple steps to process your PDF</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Upload your file', desc: 'Drag and drop or click to select your PDF or other supported document.' },
              { step: '2', title: 'Configure and process', desc: 'Choose your settings and click process. Our servers handle the rest.' },
              { step: '3', title: 'Download your result', desc: 'Your processed file is ready instantly. Download and delete when done.' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl mb-4 shadow-lg shadow-primary/30">
                  {item.step}
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute translate-x-32 -translate-y-7 text-brand-border">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
                <h3 className="font-semibold text-secondary mb-2">{item.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-brand-surface">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-3">Frequently asked questions</h2>
            <p className="section-subheading">Answers to common questions about {brand.name}</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="card cursor-pointer" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-medium text-secondary">{faq.q}</h3>
                  <ChevronDown className={`w-5 h-5 text-brand-muted flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </div>
                {openFaq === i && (
                  <p className="text-brand-muted text-sm mt-3 leading-relaxed animate-fade-in">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
