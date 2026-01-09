import { useMockNetwork } from '../contexts/MockNetworkContext';
import { useGateway } from '../contexts/GatewayContext';

export default function MockNetworkPanel() {
  const { mockContext, updateMockContext, resetMockContext, panelOpen, setPanelOpen } = useMockNetwork();
  const { status, loading, isRealApi, isMockMode } = useGateway();

  // Determine icon and color based on mode
  const getButtonStyle = () => {
    if (loading) return 'bg-gray-500 hover:bg-gray-600';
    if (isRealApi) return 'bg-green-500 hover:bg-green-600';
    return 'bg-orange-500 hover:bg-orange-600';
  };

  const getModeIcon = () => {
    if (loading) {
      return (
        <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    }
    if (isRealApi) {
      // Telefónica/API icon
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    }
    // Mock icon (network/wifi)
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    );
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setPanelOpen(!panelOpen)}
        className={`fixed bottom-4 right-4 z-40 text-white p-3 rounded-full shadow-lg transition-colors ${getButtonStyle()}`}
        title={isRealApi ? `Telefónica API (${status.mode})` : 'Mock Network Panel'}
      >
        {getModeIcon()}
      </button>

      {/* Panel */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform ${panelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            {isRealApi ? 'Telefónica Open Gateway' : 'Mock Network Panel'}
          </h3>
          <button
            onClick={() => setPanelOpen(false)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-60px)]">
          {/* Real API Mode Panel */}
          {isRealApi && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="font-medium text-green-800">Live API Connected</span>
                </div>
                <p className="text-sm text-green-700">
                  Using real Telefónica Open Gateway APIs in <strong>{status.mode}</strong> mode.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2 text-sm">Connection Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mode:</span>
                    <span className={`font-medium ${status.mode === 'production' ? 'text-red-600' : 'text-blue-600'}`}>
                      {status.mode.charAt(0).toUpperCase() + status.mode.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Credentials:</span>
                    <span className={status.has_credentials ? 'text-green-600' : 'text-red-600'}>
                      {status.has_credentials ? '✓ Configured' : '✗ Missing'}
                    </span>
                  </div>
                </div>
              </div>

              {status.available_apis && status.available_apis.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2 text-sm">Available APIs</h4>
                  <div className="flex flex-wrap gap-1">
                    {status.available_apis.map((api) => (
                      <span key={api} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                        {api}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 text-sm mb-1">How It Works</h4>
                <p className="text-xs text-blue-700">
                  All custody verifications use real Telefónica network APIs:
                </p>
                <ul className="text-xs text-blue-700 mt-2 space-y-1">
                  <li>• <strong>SIM Swap:</strong> Detects recent SIM changes</li>
                  <li>• <strong>Device Swap:</strong> Detects device changes</li>
                  <li>• <strong>Location:</strong> Verifies user position</li>
                  <li>• <strong>Number Verify:</strong> Confirms phone ownership</li>
                </ul>
              </div>

              {status.mode === 'sandbox' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <h4 className="font-medium text-yellow-800 text-sm mb-1">⚠️ Sandbox Limitations</h4>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    <li>• Location accuracy limited to 200m</li>
                    <li>• Number Verification needs mobile network</li>
                    <li>• Test phone numbers may be required</li>
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Mock Mode Panel */}
          {isMockMode && (
            <><div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-800">
              Configure mock Telefónica Open Gateway responses for testing.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2 text-sm">Number Verification</h4>
            <div className="space-y-2">
              <div>
                <label className="label text-xs">Claimed Phone</label>
                <input
                  type="text"
                  className="input text-sm"
                  value={mockContext.claimed_phone}
                  onChange={(e) => updateMockContext({ claimed_phone: e.target.value })}
                  placeholder="+34600000003"
                />
              </div>
              <div>
                <label className="label text-xs">Network Phone (simulated)</label>
                <input
                  type="text"
                  className="input text-sm"
                  value={mockContext.network_phone}
                  onChange={(e) => updateMockContext({ network_phone: e.target.value })}
                  placeholder="+34600000003"
                />
              </div>
              <div className={`text-xs px-2 py-1 rounded ${mockContext.claimed_phone === mockContext.network_phone ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {mockContext.claimed_phone === mockContext.network_phone ? '✓ Numbers match' : '✗ Numbers mismatch - will DENY'}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2 text-sm">Location Verification</h4>
            <div className="space-y-2">
              <div>
                <label className="label text-xs">Network Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  className="input text-sm"
                  value={mockContext.network_lat}
                  onChange={(e) => updateMockContext({ network_lat: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="label text-xs">Network Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  className="input text-sm"
                  value={mockContext.network_lon}
                  onChange={(e) => updateMockContext({ network_lon: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="text-xs text-gray-500">
                Main Warehouse: 40.4168, -3.7038 (r=200m)<br/>
                Field Office: 40.4500, -3.6800 (r=150m)
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2 text-sm">Risk Signals</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={mockContext.sim_swap_recent}
                  onChange={(e) => updateMockContext({ sim_swap_recent: e.target.checked })}
                  className="rounded text-primary-600"
                />
                <span className="text-sm text-gray-700">Recent SIM Swap</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={mockContext.device_swap_recent}
                  onChange={(e) => updateMockContext({ device_swap_recent: e.target.checked })}
                  className="rounded text-primary-600"
                />
                <span className="text-sm text-gray-700">Recent Device Swap</span>
              </label>
              {(mockContext.sim_swap_recent || mockContext.device_swap_recent) && (
                <div className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                  ⚠ Risk signals may trigger STEP_UP for sensitive assets
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={resetMockContext}
              className="w-full btn-secondary btn-sm text-sm"
            >
              Reset to Defaults
            </button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Presets:</strong></p>
            <button
              onClick={() => updateMockContext({
                claimed_phone: '+34600000003',
                network_phone: '+34600000003',
                network_lat: 40.4168,
                network_lon: -3.7038,
                sim_swap_recent: false,
                device_swap_recent: false
              })}
              className="text-primary-600 hover:underline block"
            >
              → Inside Main Warehouse (all OK)
            </button>
            <button
              onClick={() => updateMockContext({
                claimed_phone: '+34600000003',
                network_phone: '+34600000003',
                network_lat: 40.5000,
                network_lon: -3.7000,
                sim_swap_recent: false,
                device_swap_recent: false
              })}
              className="text-primary-600 hover:underline block"
            >
              → Outside geofence
            </button>
            <button
              onClick={() => updateMockContext({
                claimed_phone: '+34600000003',
                network_phone: '+34999999999',
                network_lat: 40.4168,
                network_lon: -3.7038,
                sim_swap_recent: false,
                device_swap_recent: false
              })}
              className="text-primary-600 hover:underline block"
            >
              → Phone mismatch
            </button>
            <button
              onClick={() => updateMockContext({
                claimed_phone: '+34600000003',
                network_phone: '+34600000003',
                network_lat: 40.4168,
                network_lon: -3.7038,
                sim_swap_recent: true,
                device_swap_recent: false
              })}
              className="text-primary-600 hover:underline block"
            >
              → SIM swap detected
            </button>
          </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
