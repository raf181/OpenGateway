import { useOutletContext } from 'react-router-dom';

export default function Landing() {
  const { setDemoModalOpen, setPricingModalOpen } = useOutletContext();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Prove who handled an asset. Prove where it happened.
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              GeoCustody is an enterprise custody and inventory platform that authorizes asset actions using Telefónica Open Gateway network verification. Reduce losses, fix inventory accuracy, and stop "off-site" transactions.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setDemoModalOpen(true)} className="btn-primary">
                Book a demo
              </button>
              <button onClick={() => setPricingModalOpen(true)} className="btn-secondary">
                Request pricing
              </button>
            </div>
            <p className="mt-8 text-sm text-gray-500">
              Designed for warehouses, field teams, and regulated operations.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 mb-8">
            Trusted by teams that manage high-value equipment and regulated inventory.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {['Company A', 'Company B', 'Company C', 'Company D', 'Company E'].map((name, i) => (
              <div key={i} className="w-32 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Chain-of-custody meets network-grade verification
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              GeoCustody turns asset handling into verified transactions. Every check-out, transfer, return, and inventory closure can require proof that the employee is on site and using the expected mobile identity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Verified on-site actions', icon: '📍', desc: 'Network-based location verification confirms physical presence at authorized sites.' },
              { title: 'Employee-to-number binding', icon: '📱', desc: 'Bind employee sessions to verified mobile numbers for identity assurance.' },
              { title: 'Fraud-aware approvals', icon: '🛡️', desc: 'Detect SIM swaps and device changes to prevent unauthorized access.' },
              { title: 'Immutable audit trail', icon: '📋', desc: 'Tamper-evident logging of all custody events with hash-chain verification.' },
            ].map((feature, i) => (
              <div key={i} className="card text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Authorize actions in real time
            </h2>
          </div>

          <div className="grid md:grid-cols-5 gap-6 mb-12">
            {[
              { step: '1', title: 'Scan the asset', desc: 'QR code or NFC tag identification' },
              { step: '2', title: 'Verify identity', desc: 'Number verification via Open Gateway' },
              { step: '3', title: 'Verify location', desc: 'Network-based geofence check' },
              { step: '4', title: 'Apply policy', desc: 'Evaluate rules and risk signals' },
              { step: '5', title: 'Record custody', desc: 'Immutable audit trail entry' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto bg-primary-50 border border-primary-200 rounded-xl p-6">
            <p className="text-primary-800 text-center">
              <strong>Not GPS. Not guesswork.</strong> Location checks are network-based to reduce spoofing. Telefónica Open Gateway provides carrier-grade verification that cannot be faked by apps.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Built for operational control
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Inventory & Custody</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Asset catalog with QR/NFC tagging</li>
                <li>• Full custody lifecycle tracking</li>
                <li>• Exception handling and alerts</li>
                <li>• Multi-site support</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Authorization & Policy</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Role-based access control</li>
                <li>• Configurable geofences</li>
                <li>• Manager approval workflows</li>
                <li>• Sensitivity-based policy rules</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Audit & Reporting</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Complete event timeline</li>
                <li>• Compliance reports</li>
                <li>• CSV export capability</li>
                <li>• Real-time alerts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Where GeoCustody fits
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Warehouse Tools', desc: 'Track high-value tools and ensure they are checked out and returned on-site.' },
              { title: 'Field Service Kits', desc: 'Verify technicians have the right equipment when arriving at customer sites.' },
              { title: 'Datacenter Hardware', desc: 'Secure chain-of-custody for servers, drives, and networking equipment.' },
              { title: 'Medical Devices', desc: 'Comply with regulations requiring verified handling of medical equipment.' },
              { title: 'Construction Equipment', desc: 'Prevent off-site use of expensive machinery and tools.' },
              { title: 'Regulated Inventory', desc: 'Meet audit requirements for controlled substances and materials.' },
            ].map((useCase, i) => (
              <div key={i} className="card">
                <h3 className="font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                <p className="text-sm text-gray-600">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Integrations
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="text-2xl mb-2">📡</div>
              <h3 className="font-semibold text-gray-900">Telefónica Open Gateway</h3>
              <p className="text-xs text-gray-500 mt-1">Number Verification, Device Location, SIM Swap, Device Swap</p>
            </div>
            <div className="card text-center">
              <div className="text-2xl mb-2">🔐</div>
              <h3 className="font-semibold text-gray-900">SSO Providers</h3>
              <p className="text-xs text-gray-500 mt-1">Azure AD, Okta, Google Workspace, Keycloak</p>
            </div>
            <div className="card text-center">
              <div className="text-2xl mb-2">🔗</div>
              <h3 className="font-semibold text-gray-900">Webhooks & API</h3>
              <p className="text-xs text-gray-500 mt-1">REST API, Webhook notifications</p>
            </div>
            <div className="card text-center">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold text-gray-900">Enterprise Systems</h3>
              <p className="text-xs text-gray-500 mt-1">ServiceNow, SAP, Intune (optional)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Security and privacy by design
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              GeoCustody performs transaction-based verification. It does not run continuous tracking. You control retention and access to logs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Security</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ End-to-end encryption</li>
                <li>✓ SOC 2 Type II compliant infrastructure</li>
                <li>✓ Role-based access control</li>
                <li>✓ Audit logging with tamper detection</li>
                <li>✓ Regular penetration testing</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Privacy</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ No continuous location tracking</li>
                <li>✓ Transaction-based verification only</li>
                <li>✓ Configurable data retention</li>
                <li>✓ GDPR compliant</li>
                <li>✓ Data processing agreements available</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              See it in action
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'Asset Dashboard', desc: 'View all assets, their status, and current custody assignments.' },
              { title: 'Verification Flow', desc: 'Real-time feedback on number and location verification.' },
              { title: 'Manager Approvals', desc: 'Review and approve step-up requests from employees.' },
              { title: 'Audit Timeline', desc: 'Complete history of all custody events with verification details.' },
            ].map((item, i) => (
              <div key={i} className="card">
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-4">
                  <span className="text-gray-400">Screenshot placeholder</span>
                </div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Pricing
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { 
                name: 'Starter', 
                price: 'Contact us', 
                features: ['Up to 100 assets', 'Up to 10 users', 'Basic reporting', 'Email support'] 
              },
              { 
                name: 'Business', 
                price: 'Contact us', 
                features: ['Up to 1,000 assets', 'Up to 50 users', 'Advanced reporting', 'SSO integration', 'Priority support'],
                popular: true
              },
              { 
                name: 'Enterprise', 
                price: 'Contact us', 
                features: ['Unlimited assets', 'Unlimited users', 'Custom integrations', 'Dedicated support', 'SLA guarantees', 'On-premise option'] 
              },
            ].map((tier, i) => (
              <div key={i} className={`card ${tier.popular ? 'ring-2 ring-primary-600' : ''}`}>
                {tier.popular && (
                  <div className="text-xs font-semibold text-primary-600 mb-2">MOST POPULAR</div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">{tier.price}</p>
                <ul className="mt-6 space-y-2">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="text-sm text-gray-600 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 space-y-2">
                  <button onClick={() => setDemoModalOpen(true)} className="btn-primary w-full btn-sm">
                    Book a demo
                  </button>
                  <button onClick={() => setPricingModalOpen(true)} className="btn-secondary w-full btn-sm">
                    Request pricing
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              { q: 'What is Telefónica Open Gateway?', a: 'Telefónica Open Gateway is a set of network APIs that provide carrier-grade verification services including number verification, device location verification, and fraud detection signals like SIM swap detection.' },
              { q: 'Does GeoCustody track employees continuously?', a: 'No. GeoCustody only verifies location at the moment of a custody transaction. There is no continuous tracking or location history stored.' },
              { q: 'What happens if verification fails?', a: 'Depending on your policy configuration, failed verification can result in denial, or a step-up approval request that requires manager authorization.' },
              { q: 'Can GeoCustody work offline?', a: 'Basic scanning works offline, but verification requires network connectivity as it uses Telefónica Open Gateway APIs.' },
              { q: 'Is the audit trail really tamper-proof?', a: 'The audit trail uses a hash chain where each event includes a hash of the previous event. Any modification would break the chain and be immediately detectable.' },
              { q: 'What mobile networks are supported?', a: 'GeoCustody uses Telefónica Open Gateway, which supports verification on Telefónica and partner networks. Coverage varies by region.' },
            ].map((item, i) => (
              <div key={i} className="card">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Stop guessing. Start proving custody.
          </h2>
          <p className="mt-4 text-lg text-primary-100">
            GeoCustody makes asset handling verifiable with network-grade authorization.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setDemoModalOpen(true)} className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
              Book a demo
            </button>
            <button onClick={() => setPricingModalOpen(true)} className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              Request pricing
            </button>
          </div>
          <p className="mt-8 text-sm text-primary-200">
            Built for enterprise security and operational reality.
          </p>
        </div>
      </section>
    </div>
  );
}
