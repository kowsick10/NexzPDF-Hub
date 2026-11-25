import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { tools } from '../../config/tools'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [convertOpen, setConvertOpen] = useState(false)

  const convertTools = tools.filter((t) => t.category === 'convert')

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
            <img
              src="/nexpdf-logo.png"
              alt="NexzPDF Hub"
              className="h-10 w-auto max-w-[220px] object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-primary bg-primary-50' : 'text-brand-muted hover:text-secondary hover:bg-brand-surface'}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/all-tools"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-primary bg-primary-50' : 'text-brand-muted hover:text-secondary hover:bg-brand-surface'}`
              }
            >
              All Tools
            </NavLink>

            {/* Convert dropdown */}
            <div className="relative" onMouseLeave={() => setConvertOpen(false)}>
              <button
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-brand-muted hover:text-secondary hover:bg-brand-surface transition-colors"
                onMouseEnter={() => setConvertOpen(true)}
                onClick={() => setConvertOpen((o) => !o)}
              >
                Convert PDF
                <ChevronDown className={`w-4 h-4 transition-transform ${convertOpen ? 'rotate-180' : ''}`} />
              </button>
              {convertOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-brand-border py-2 z-50">
                  {convertTools.map((tool) => (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:bg-brand-surface transition-colors"
                      onClick={() => setConvertOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tool.color }} />
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-primary bg-primary-50' : 'text-brand-muted hover:text-secondary hover:bg-brand-surface'}`
              }
            >
              Contact Us
            </NavLink>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-secondary hover:bg-brand-surface transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-brand-border py-3 space-y-1 animate-fade-in">
            <NavLink to="/" end className="block px-4 py-2.5 rounded-lg text-sm font-medium text-secondary hover:bg-brand-surface" onClick={() => setMenuOpen(false)}>Home</NavLink>
            <NavLink to="/all-tools" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-secondary hover:bg-brand-surface" onClick={() => setMenuOpen(false)}>All Tools</NavLink>
            <div className="px-4 py-2 text-xs font-semibold text-brand-muted uppercase tracking-wider">Convert PDF</div>
            {convertTools.map((tool) => (
              <NavLink key={tool.id} to={tool.path} className="block px-6 py-2 rounded-lg text-sm text-secondary hover:bg-brand-surface" onClick={() => setMenuOpen(false)}>
                {tool.name}
              </NavLink>
            ))}
            <NavLink to="/contact" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-secondary hover:bg-brand-surface" onClick={() => setMenuOpen(false)}>Contact Us</NavLink>
          </div>
        )}
      </nav>
    </header>
  )
}
