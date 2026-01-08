import { useOutletContext } from 'react-router-dom';

export default function Product() {
  const { setDemoModalOpen, setPricingModalOpen } = useOutletContext();

  return (
    <div>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Platform Overview
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              GeoCustody combines inventory management with network-grade verification to create a complete chain-of-custody solution.
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">System Architecture</h2>
          
          <div className="max-w-4xl mx-auto">
            <svg viewBox="0 0 800 500" className="w-full h-auto">
              {/* Background */}
              <rect x="0" y="0" width="800" height="500" fill="#f8fafc" rx="8"/>
              
              {/* User Layer */}
              <g>
                <rect x="50" y="40" width="140" height="80" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" rx="8"/>
                <text x="120" y="75" textAnchor="middle" className="text-sm" fill="#1e40af" fontWeight="600">Employee</text>
                <text x="120" y="95" textAnchor="middle" className="text-xs" fill="#1e40af">Mobile App</text>
              </g>
              
              <g>
                <rect x="230" y="40" width="140" height="80" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" rx="8"/>
                <text x="300" y="75" textAnchor="middle" className="text-sm" fill="#1e40af" fontWeight="600">Manager</text>
                <text x="300" y="95" textAnchor="middle" className="text-xs" fill="#1e40af">Approvals</text>
              </g>
              
              <g>
                <rect x="410" y="40" width="140" height="80" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" rx="8"/>
                <text x="480" y="75" textAnchor="middle" className="text-sm" fill="#1e40af" fontWeight="600">Admin</text>
                <text x="480" y="95" textAnchor="middle" className="text-xs" fill="#1e40af">Dashboard</text>
              </g>

              {/* Arrows down */}
              <path d="M120 120 L120 160" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              <path d="M300 120 L300 160" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              <path d="M480 120 L480 160" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>

              {/* API Gateway */}
              <rect x="100" y="170" width="400" height="60" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" rx="8"/>
              <text x="300" y="205" textAnchor="middle" fill="#92400e" fontWeight="600">GeoCustody API Gateway</text>

              {/* Arrow down */}
              <path d="M300 230 L300 270" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>

              {/* Core Services */}
              <g>
                <rect x="50" y="280" width="150" height="70" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" rx="8"/>
                <text x="125" y="310" textAnchor="middle" fill="#166534" fontWeight="600">Policy Engine</text>
                <text x="125" y="330" textAnchor="middle" className="text-xs" fill="#166534">Rules & Decisions</text>
              </g>

              <g>
                <rect x="225" y="280" width="150" height="70" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" rx="8"/>
                <text x="300" y="310" textAnchor="middle" fill="#166534" fontWeight="600">Custody Service</text>
                <text x="300" y="330" textAnchor="middle" className="text-xs" fill="#166534">Transactions</text>
              </g>

              <g>
                <rect x="400" y="280" width="150" height="70" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" rx="8"/>
                <text x="475" y="310" textAnchor="middle" fill="#166534" fontWeight="600">Audit Service</text>
                <text x="475" y="330" textAnchor="middle" className="text-xs" fill="#166534">Hash Chain</text>
              </g>

              {/* Arrows */}
              <path d="M300 350 L300 390" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              
              {/* External Services */}
              <g>
                <rect x="580" y="170" width="170" height="180" fill="#fce7f3" stroke="#ec4899" strokeWidth="2" rx="8"/>
                <text x="665" y="200" textAnchor="middle" fill="#9d174d" fontWeight="600">Telefónica</text>
                <text x="665" y="220" textAnchor="middle" fill="#9d174d" fontWeight="600">Open Gateway</text>
                <text x="665" y="260" textAnchor="middle" className="text-xs" fill="#9d174d">• Number Verification</text>
                <text x="665" y="280" textAnchor="middle" className="text-xs" fill="#9d174d">• Location Verification</text>
                <text x="665" y="300" textAnchor="middle" className="text-xs" fill="#9d174d">• SIM Swap Detection</text>
                <text x="665" y="320" textAnchor="middle" className="text-xs" fill="#9d174d">• Device Swap Detection</text>
              </g>

              {/* Arrow to external */}
              <path d="M500 200 L570 200" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>

              {/* Database */}
              <g>
                <ellipse cx="300" cy="420" rx="100" ry="20" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2"/>
                <rect x="200" y="420" width="200" height="40" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2"/>
                <ellipse cx="300" cy="460" rx="100" ry="20" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2"/>
                <text x="300" y="445" textAnchor="middle" fill="#4338ca" fontWeight="600">Database</text>
              </g>

              {/* Arrow marker */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8"/>
                </marker>
              </defs>
            </svg>
          </div>
        </div>
      </section>

      {/* Core Components */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Core Components</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🔐 Policy Engine</h3>
              <p className="text-gray-600 mb-4">
                Evaluates verification results against configurable rules to make authorization decisions.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Number mismatch → DENY</li>
                <li>• Outside geofence → DENY or STEP_UP (based on sensitivity)</li>
                <li>• High sensitivity + risk signals → STEP_UP</li>
                <li>• Medium sensitivity + SIM swap → STEP_UP</li>
                <li>• All checks pass → ALLOW</li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">📦 Custody Service</h3>
              <p className="text-gray-600 mb-4">
                Manages the full lifecycle of asset custody transactions.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• CHECK_OUT - Employee takes custody</li>
                <li>• CHECK_IN/RETURN - Asset returned</li>
                <li>• TRANSFER - Custody to another employee</li>
                <li>• INVENTORY_CLOSE - Cycle count verification</li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">📋 Audit Service</h3>
              <p className="text-gray-600 mb-4">
                Maintains a tamper-evident log of all custody events.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Hash chain linking each event</li>
                <li>• Verification summary stored</li>
                <li>• Chain integrity verification</li>
                <li>• Query by asset, user, or time range</li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">📡 Open Gateway Integration</h3>
              <p className="text-gray-600 mb-4">
                Leverages Telefónica's network APIs for verification.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Number Verification - Confirm device identity</li>
                <li>• Device Location - Network-based geofencing</li>
                <li>• SIM Swap Detection - Fraud signal</li>
                <li>• Device Swap Detection - Fraud signal</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to see it in action?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Book a demo to see how GeoCustody can secure your asset operations.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setDemoModalOpen(true)} className="btn-primary">
              Book a demo
            </button>
            <button onClick={() => setPricingModalOpen(true)} className="btn-secondary">
              Request pricing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
