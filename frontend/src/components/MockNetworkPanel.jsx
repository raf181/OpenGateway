import { useMockNetwork } from '../contexts/MockNetworkContext';

export default function MockNetworkPanel() {
  const { mockContext, updateMockContext, resetMockContext, panelOpen, setPanelOpen } = useMockNetwork();

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setPanelOpen(!panelOpen)}
        className="fixed bottom-4 right-4 z-40 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
        title="Mock Network Panel"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      </button>

      {/* Panel */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform ${panelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Mock Network Panel</h3>
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
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
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
        </div>
      </div>
    </>
  );
}
