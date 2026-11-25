import { Link } from 'react-router-dom'
import { brand } from '../../config/brand'
import { tools } from '../../config/tools'

export function Footer() {
  return (
    <footer className="bg-secondary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="w-full max-w-[280px] rounded-lg bg-white p-2.5 mb-4">
              <img
                src="/nexpdf-logo.png"
                alt="NexzPDF Hub"
                className="block h-auto w-full object-contain"
              />
            </div>
            <p className="text-gray-500 text-xs">By {brand.company}</p>
          </div>

          {/* PDF Tools */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">PDF Tools</h3>
            <ul className="space-y-2.5">
              {tools.map((tool) => (
                <li key={tool.id}>
                  <Link to={tool.path} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-gray-400 text-sm hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 text-sm hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/all-tools" className="text-gray-400 text-sm hover:text-white transition-colors">All Tools</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2.5">
              <li><Link to="/privacy-policy" className="text-gray-400 text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="text-gray-400 text-sm hover:text-white transition-colors">Terms and Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {brand.year} {brand.company}. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            {brand.name} &mdash; {brand.tagline}
          </p>
        </div>
      </div>
    </footer>
  )
}
