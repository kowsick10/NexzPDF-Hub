import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { AllToolsPage } from './pages/AllToolsPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { MergePdfPage } from './tools/MergePdf/MergePdfPage'
import { SplitPdfPage } from './tools/SplitPdf/SplitPdfPage'
import { CompressPdfPage } from './tools/CompressPdf/CompressPdfPage'
import { JpgToPdfPage } from './tools/JpgToPdf/JpgToPdfPage'
import { PdfToJpgPage } from './tools/PdfToJpg/PdfToJpgPage'
import { WordToPdfPage } from './tools/WordToPdf/WordToPdfPage'
import { RotatePdfPage } from './tools/RotatePdf/RotatePdfPage'
import { ProtectPdfPage } from './tools/ProtectPdf/ProtectPdfPage'
import { UnlockPdfPage } from './tools/UnlockPdf/UnlockPdfPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="all-tools" element={<AllToolsPage />} />
          <Route path="merge-pdf" element={<MergePdfPage />} />
          <Route path="split-pdf" element={<SplitPdfPage />} />
          <Route path="compress-pdf" element={<CompressPdfPage />} />
          <Route path="jpg-to-pdf" element={<JpgToPdfPage />} />
          <Route path="pdf-to-jpg" element={<PdfToJpgPage />} />
          <Route path="word-to-pdf" element={<WordToPdfPage />} />
          <Route path="rotate-pdf" element={<RotatePdfPage />} />
          <Route path="protect-pdf" element={<ProtectPdfPage />} />
          <Route path="unlock-pdf" element={<UnlockPdfPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy-policy" element={<PrivacyPage />} />
          <Route path="terms-and-conditions" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
