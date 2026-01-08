import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Modal from '../Modal';

export default function MarketingLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: '/product', label: 'Product' },
    { href: '/#how-it-works', label: 'How it works' },
    { href: '/#use-cases', label: 'Use cases' },
    { href: '/#security', label: 'Security' },
    { href: '/#integrations', label: 'Integrations' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/#faq', label: 'FAQ' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                  <path d="M12 2L4 6v12l8 4 8-4V6l-8-4z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">GeoCustody</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/app/login" className="text-sm text-gray-600 hover:text-primary-600">
                Sign in
              </Link>
              <button
                onClick={() => setDemoModalOpen(true)}
                className="btn-primary btn-sm"
              >
                Book a demo
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-100">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-gray-600 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <Link to="/app/login" className="block py-2 text-gray-600">
                  Sign in
                </Link>
                <button
                  onClick={() => {
                    setDemoModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="btn-primary btn-sm w-full"
                >
                  Book a demo
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main content */}
      <main>
        <Outlet context={{ setDemoModalOpen, setPricingModalOpen }} />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                    <path d="M12 2L4 6v12l8 4 8-4V6l-8-4z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">GeoCustody</span>
              </div>
              <p className="text-gray-400 text-sm">
                Chain-of-custody verification powered by Telefónica Open Gateway.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/product" className="hover:text-white">Overview</a></li>
                <li><a href="/#how-it-works" className="hover:text-white">How it works</a></li>
                <li><a href="/#use-cases" className="hover:text-white">Use cases</a></li>
                <li><a href="/#pricing" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
                <li><a href="#" className="hover:text-white">Compliance</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="mailto:sales@placeholder" className="hover:text-white">sales@placeholder</a></li>
                <li><a href="mailto:support@placeholder" className="hover:text-white">support@placeholder</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} GeoCustody. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      <Modal open={demoModalOpen} onClose={() => setDemoModalOpen(false)} title="Book a Demo">
        <form className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input type="text" className="input" placeholder="Your name" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" placeholder="work@company.com" />
          </div>
          <div>
            <label className="label">Company</label>
            <input type="text" className="input" placeholder="Company name" />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea className="input" rows="3" placeholder="Tell us about your use case" />
          </div>
          <button type="button" className="btn-primary w-full" onClick={() => setDemoModalOpen(false)}>
            Request Demo
          </button>
          <p className="text-xs text-gray-500 text-center">
            This is a demo form. No data is submitted.
          </p>
        </form>
      </Modal>

      {/* Pricing Modal */}
      <Modal open={pricingModalOpen} onClose={() => setPricingModalOpen(false)} title="Request Pricing">
        <form className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input type="text" className="input" placeholder="Your name" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" placeholder="work@company.com" />
          </div>
          <div>
            <label className="label">Company Size</label>
            <select className="input">
              <option>1-50 employees</option>
              <option>51-200 employees</option>
              <option>201-1000 employees</option>
              <option>1000+ employees</option>
            </select>
          </div>
          <div>
            <label className="label">Estimated Assets</label>
            <select className="input">
              <option>Less than 100</option>
              <option>100-500</option>
              <option>500-2000</option>
              <option>2000+</option>
            </select>
          </div>
          <button type="button" className="btn-primary w-full" onClick={() => setPricingModalOpen(false)}>
            Request Pricing
          </button>
          <p className="text-xs text-gray-500 text-center">
            This is a demo form. No data is submitted.
          </p>
        </form>
      </Modal>
    </div>
  );
}
