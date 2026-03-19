import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Modal from '../Modal';
import { useI18n } from '../../i18n';

export default function MarketingLayout() {
  const { lang, setLang, t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: '/product', label: t('product') },
    { href: '/#how-it-works', label: t('howItWorks') },
    { href: '/#use-cases', label: t('useCases') },
    { href: '/#security', label: t('security') },
    { href: '/#integrations', label: t('integrations') },
    { href: '/#pricing', label: t('pricing') },
    { href: '/#faq', label: t('faq') },
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
              <button
                onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
                className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-600 hover:text-primary-600"
              >
                {lang === 'es' ? 'EN' : 'ES'}
              </button>
              <Link to="/app/login" className="text-sm text-gray-600 hover:text-primary-600">
                {t('signIn')}
              </Link>
              <button
                onClick={() => setDemoModalOpen(true)}
                className="btn-primary btn-sm"
              >
                {t('requestDemo')}
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
                  {t('signIn')}
                </Link>
                <button
                  onClick={() => {
                    setDemoModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="btn-primary btn-sm w-full"
                >
                  {t('requestDemo')}
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
                {t('custodyTagline')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('product')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/product" className="hover:text-white">{t('platformOverview')}</a></li>
                <li><a href="/#how-it-works" className="hover:text-white">{t('howItWorks')}</a></li>
                <li><a href="/#use-cases" className="hover:text-white">{t('useCases')}</a></li>
                <li><a href="/#pricing" className="hover:text-white">{t('pricing')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('company')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">{t('privacy')}</a></li>
                <li><a href="#" className="hover:text-white">{t('security')}</a></li>
                <li><a href="#" className="hover:text-white">{t('compliance')}</a></li>
                <li><a href="#" className="hover:text-white">{t('status')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('contact')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="mailto:sales@placeholder" className="hover:text-white">sales@placeholder</a></li>
                <li><a href="mailto:support@placeholder" className="hover:text-white">support@placeholder</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} GeoCustody. {t('rightsReserved')}
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      <Modal open={demoModalOpen} onClose={() => setDemoModalOpen(false)} title="Solicitar demo">
        <form className="space-y-4">
          <div>
            <label className="label">Nombre</label>
            <input type="text" className="input" placeholder="Tu nombre" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" placeholder="work@company.com" />
          </div>
          <div>
            <label className="label">Empresa</label>
            <input type="text" className="input" placeholder="Nombre de la empresa" />
          </div>
          <div>
            <label className="label">Mensaje</label>
            <textarea className="input" rows="3" placeholder="Cuentanos tu caso de uso" />
          </div>
          <button type="button" className="btn-primary w-full" onClick={() => setDemoModalOpen(false)}>
            Enviar solicitud
          </button>
          <p className="text-xs text-gray-500 text-center">
            Este es un formulario de demostracion. No se envian datos.
          </p>
        </form>
      </Modal>

      {/* Pricing Modal */}
      <Modal open={pricingModalOpen} onClose={() => setPricingModalOpen(false)} title="Solicitar precios">
        <form className="space-y-4">
          <div>
            <label className="label">Nombre</label>
            <input type="text" className="input" placeholder="Tu nombre" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" placeholder="work@company.com" />
          </div>
          <div>
            <label className="label">Tamano de empresa</label>
            <select className="input">
              <option>1-50 empleados</option>
              <option>51-200 empleados</option>
              <option>201-1000 empleados</option>
              <option>1000+ empleados</option>
            </select>
          </div>
          <div>
            <label className="label">Activos estimados</label>
            <select className="input">
              <option>Menos de 100</option>
              <option>100-500</option>
              <option>500-2000</option>
              <option>2000+</option>
            </select>
          </div>
          <button type="button" className="btn-primary w-full" onClick={() => setPricingModalOpen(false)}>
            Enviar solicitud
          </button>
          <p className="text-xs text-gray-500 text-center">
            Este es un formulario de demostracion. No se envian datos.
          </p>
        </form>
      </Modal>
    </div>
  );
}
