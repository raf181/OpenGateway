export default function AdminPolicies() {
  const policies = [
    {
      id: 1,
      name: 'Low Sensitivity Checkout',
      sensitivity: 'LOW',
      checks: ['User authenticated'],
      decision: 'ALLOW',
      description: 'Allows direct checkout without additional verification'
    },
    {
      id: 2,
      name: 'Medium Sensitivity Checkout',
      sensitivity: 'MEDIUM',
      checks: ['User authenticated', 'Number Verification'],
      decision: 'ALLOW if verified',
      description: 'Requires phone number verification via Open Gateway'
    },
    {
      id: 3,
      name: 'High Sensitivity Checkout',
      sensitivity: 'HIGH',
      checks: ['User authenticated', 'Number Verification', 'SIM Swap Check', 'Device Location'],
      decision: 'ALLOW if all pass',
      description: 'Full verification suite including location and device checks'
    },
    {
      id: 4,
      name: 'High Sensitivity - Location Fail',
      sensitivity: 'HIGH',
      checks: ['Number verified', 'Location outside geofence'],
      decision: 'STEP_UP',
      description: 'Requires manager approval when device is outside site boundary'
    },
    {
      id: 5,
      name: 'SIM Swap Detected',
      sensitivity: 'ANY',
      checks: ['SIM swap within 48 hours'],
      decision: 'DENY',
      description: 'Blocks all checkouts when recent SIM swap is detected'
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Policy Configuration</h1>
        <p className="text-gray-500">View the policy rules that govern custody decisions</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-medium text-blue-900">About Policy Engine</h3>
            <p className="text-sm text-blue-700 mt-1">
              The policy engine evaluates each custody request based on asset sensitivity and 
              verification results from Telefónica Open Gateway APIs. In this demo, policies 
              are read-only and demonstrate the decision flow.
            </p>
          </div>
        </div>
      </div>

      {/* Policy Rules */}
      <div className="space-y-4">
        {policies.map(policy => (
          <div key={policy.id} className="card border-l-4" style={{
            borderLeftColor: policy.decision === 'ALLOW' || policy.decision.includes('ALLOW') ? '#22c55e' :
                            policy.decision === 'STEP_UP' ? '#eab308' : '#ef4444'
          }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{policy.name}</h3>
                <p className="text-sm text-gray-500">{policy.description}</p>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                policy.decision === 'ALLOW' || policy.decision.includes('ALLOW') ? 'bg-green-100 text-green-700' :
                policy.decision === 'STEP_UP' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {policy.decision}
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Sensitivity</p>
                <span className={`px-2 py-0.5 text-xs rounded ${
                  policy.sensitivity === 'HIGH' ? 'bg-red-100 text-red-700' :
                  policy.sensitivity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                  policy.sensitivity === 'ANY' ? 'bg-gray-100 text-gray-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {policy.sensitivity}
                </span>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Required Checks</p>
                <div className="flex flex-wrap gap-1">
                  {policy.checks.map((check, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-xs bg-primary-50 text-primary-700 rounded">
                      {check}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Open Gateway APIs */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Open Gateway APIs Used</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Number Verification</h3>
                <p className="text-sm text-gray-500">
                  Validates that the user's registered phone number matches their device's SIM
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Device Location Verification</h3>
                <p className="text-sm text-gray-500">
                  Checks if the device is within the site's geofence boundary
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">SIM Swap Detection</h3>
                <p className="text-sm text-gray-500">
                  Detects if the SIM card was recently changed (fraud indicator)
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Device Swap Detection</h3>
                <p className="text-sm text-gray-500">
                  Identifies if the phone device (IMEI) was recently changed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
