import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAsset, getSites, getUsers, getAuditEvents, checkoutAsset, returnAsset, transferAsset } from '../../../utils/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useMockNetwork } from '../../../contexts/MockNetworkContext';
import Modal from '../../../components/Modal';

// Component to show expandable raw API response
function RawResponseViewer({ data, title }) {
  const [expanded, setExpanded] = useState(false);
  
  if (!data) return null;
  
  return (
    <div className="mt-3 border-t pt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
      >
        <svg 
          className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {title || 'View Raw Response'}
      </button>
      {expanded && (
        <pre className="mt-2 p-2 bg-gray-900 text-green-400 rounded text-xs overflow-x-auto max-h-64 overflow-y-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default function AssetDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { mockContext, setPanelOpen } = useMockNetwork();
  
  const [asset, setAsset] = useState(null);
  const [sites, setSites] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [actionModal, setActionModal] = useState(null); // 'checkout', 'return', 'transfer'
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [actionResult, setActionResult] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [assetData, sitesData, usersData, eventsData] = await Promise.all([
          getAsset(id),
          getSites(),
          getUsers().catch(() => []),
          getAuditEvents({ asset_id: id, limit: 20 })
        ]);
        setAsset(assetData);
        setSites(sitesData);
        setUsers(usersData);
        setEvents(eventsData);
        if (assetData.current_site_id) {
          setSelectedSite(assetData.current_site_id.toString());
        } else if (sitesData.length > 0) {
          setSelectedSite(sitesData[0].id.toString());
        }
      } catch (err) {
        console.error('Failed to load asset:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleAction = async (action) => {
    setActionLoading(true);
    setActionResult(null);

    try {
      const payload = {
        asset_id: parseInt(id),
        site_id: parseInt(selectedSite),
        mock_context: mockContext
      };

      let result;
      if (action === 'checkout') {
        result = await checkoutAsset(payload);
      } else if (action === 'return') {
        result = await returnAsset(payload);
      } else if (action === 'transfer') {
        result = await transferAsset({ ...payload, target_user_id: parseInt(selectedUser) });
      }

      setActionResult(result);
      
      // Refresh asset data if successful
      if (result.success) {
        const updatedAsset = await getAsset(id);
        setAsset(updatedAsset);
        const updatedEvents = await getAuditEvents({ asset_id: id, limit: 20 });
        setEvents(updatedEvents);
      }
    } catch (err) {
      setActionResult({
        success: false,
        decision: 'ERROR',
        reason: err.message,
        message: 'Action failed'
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Asset not found</p>
        <Link to="/app/employee/assets" className="text-primary-600 hover:underline mt-2 inline-block">
          ← Back to assets
        </Link>
      </div>
    );
  }

  const canCheckout = asset.status === 'AVAILABLE';
  const canReturn = asset.status === 'CHECKED_OUT' && (asset.current_custodian_id === user.id || user.role !== 'EMPLOYEE');
  const canTransfer = asset.status === 'CHECKED_OUT' && (asset.current_custodian_id === user.id || user.role !== 'EMPLOYEE');

  return (
    <div>
      <div className="mb-6">
        <Link to="/app/employee/assets" className="text-primary-600 hover:underline text-sm">
          ← Back to assets
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Asset Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-mono text-sm text-primary-600">{asset.tag_id}</p>
                <h1 className="text-2xl font-bold text-gray-900">{asset.name}</h1>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                asset.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                asset.status === 'CHECKED_OUT' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {asset.status}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{asset.asset_type}</p>
              </div>
              {asset.serial && (
                <div>
                  <p className="text-sm text-gray-500">Serial</p>
                  <p className="font-medium">{asset.serial}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Sensitivity</p>
                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                  asset.sensitivity === 'HIGH' ? 'bg-red-100 text-red-700' :
                  asset.sensitivity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {asset.sensitivity}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Site</p>
                <p className="font-medium">{asset.site_name || 'Not assigned'}</p>
              </div>
              {asset.custodian_name && (
                <div>
                  <p className="text-sm text-gray-500">Current Custodian</p>
                  <p className="font-medium">{asset.custodian_name}</p>
                </div>
              )}
              {asset.description && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-700">{asset.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Custody Timeline */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Custody History</h2>
            
            {events.length === 0 ? (
              <p className="text-gray-500 text-sm">No custody events recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {events.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        event.decision === 'ALLOW' ? 'bg-green-500' :
                        event.decision === 'DENY' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`} />
                      {index < events.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{event.action}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          event.decision === 'ALLOW' ? 'bg-green-100 text-green-700' :
                          event.decision === 'DENY' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {event.decision}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        by {event.actor_name} at {event.site_name || 'Unknown site'}
                        {event.target_user_name && ` → ${event.target_user_name}`}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <Link to="/app/audit" className="text-sm text-primary-600 hover:underline mt-4 inline-block">
              View full audit trail →
            </Link>
          </div>
        </div>

        {/* Actions Panel */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
            
            <div className="space-y-3">
              <button
                onClick={() => setActionModal('checkout')}
                disabled={!canCheckout}
                className="w-full btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Check Out
              </button>
              
              <button
                onClick={() => setActionModal('return')}
                disabled={!canReturn}
                className="w-full btn-secondary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Return
              </button>
              
              <button
                onClick={() => setActionModal('transfer')}
                disabled={!canTransfer}
                className="w-full btn-secondary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Transfer
              </button>
            </div>

            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => setPanelOpen(true)}
                className="w-full text-sm text-orange-600 hover:text-orange-700 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
                Configure Mock Network
              </button>
            </div>
          </div>

          {/* Mock Status */}
          <div className="card bg-orange-50 border-orange-200">
            <h3 className="text-sm font-semibold text-orange-800 mb-2">Mock Network Status</h3>
            <div className="text-xs text-orange-700 space-y-1">
              <p>Phone: {mockContext.claimed_phone === mockContext.network_phone ? '✓ Match' : '✗ Mismatch'}</p>
              <p>Location: {mockContext.network_lat.toFixed(4)}, {mockContext.network_lon.toFixed(4)}</p>
              <p>SIM Swap: {mockContext.sim_swap_recent ? '⚠ Recent' : '✓ None'}</p>
              <p>Device Swap: {mockContext.device_swap_recent ? '⚠ Recent' : '✓ None'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      <Modal
        open={!!actionModal}
        onClose={() => {
          setActionModal(null);
          setActionResult(null);
        }}
        title={
          actionModal === 'checkout' ? 'Check Out Asset' :
          actionModal === 'return' ? 'Return Asset' :
          'Transfer Asset'
        }
      >
        {actionResult ? (
          <div>
            <div className={`p-4 rounded-lg mb-4 ${
              actionResult.success ? 'bg-green-50 border border-green-200' :
              actionResult.decision === 'STEP_UP' ? 'bg-yellow-50 border border-yellow-200' :
              'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  actionResult.success ? 'bg-green-100 text-green-700' :
                  actionResult.decision === 'STEP_UP' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {actionResult.decision}
                </span>
                <span className={`text-sm font-medium ${
                  actionResult.success ? 'text-green-800' :
                  actionResult.decision === 'STEP_UP' ? 'text-yellow-800' :
                  'text-red-800'
                }`}>
                  {actionResult.message}
                </span>
              </div>
              <p className={`text-sm ${
                actionResult.success ? 'text-green-700' :
                actionResult.decision === 'STEP_UP' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {actionResult.reason}
              </p>
              
              {actionResult.approval_id && (
                <p className="text-sm text-yellow-700 mt-2">
                  Approval request #{actionResult.approval_id} created for manager review.
                </p>
              )}
            </div>

            {actionResult.verification && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Verification Results</h4>
                
                {/* Summary Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="flex items-center gap-1">
                    <span className={actionResult.verification.number_verified ? 'text-green-600' : 'text-red-600'}>
                      {actionResult.verification.number_verified ? '✓' : '✗'}
                    </span>
                    <span>Number Verified</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={actionResult.verification.inside_geofence ? 'text-green-600' : 'text-red-600'}>
                      {actionResult.verification.inside_geofence ? '✓' : '✗'}
                    </span>
                    <span>Inside Geofence</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={!actionResult.verification.sim_swap_detected ? 'text-green-600' : 'text-yellow-600'}>
                      {!actionResult.verification.sim_swap_detected ? '✓' : '⚠'}
                    </span>
                    <span>SIM Swap: {actionResult.verification.sim_swap_detected ? 'Detected' : 'None'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={!actionResult.verification.device_swap_detected ? 'text-green-600' : 'text-yellow-600'}>
                      {!actionResult.verification.device_swap_detected ? '✓' : '⚠'}
                    </span>
                    <span>Device Swap: {actionResult.verification.device_swap_detected ? 'Detected' : 'None'}</span>
                  </div>
                </div>

                {/* Detailed API Response */}
                {actionResult.verification.details && (
                  <div className="space-y-2 text-xs border-t pt-3">
                    <h5 className="font-medium text-gray-600">API Details</h5>
                    
                    {/* Location Details */}
                    {actionResult.verification.details.location_verification && (
                      <div className="bg-white rounded p-2 border">
                        <div className="font-medium text-gray-700 mb-1">📍 Location Verification</div>
                        <div className="text-gray-600 space-y-0.5">
                          <p>Result: <span className="font-mono">{actionResult.verification.details.location_verification.verification_result}</span></p>
                          {actionResult.verification.details.location_verification.match_rate !== null && (
                            <p>Match Rate: <span className="font-mono">{actionResult.verification.details.location_verification.match_rate}%</span></p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* SIM Swap Details */}
                    {actionResult.verification.details.risk_signals && (
                      <div className="bg-white rounded p-2 border">
                        <div className="font-medium text-gray-700 mb-1">🔐 Risk Signals</div>
                        <div className="text-gray-600 space-y-0.5">
                          <p>SIM Swap: <span className={`font-mono ${actionResult.verification.details.risk_signals.sim_swap_recent ? 'text-yellow-600' : 'text-green-600'}`}>
                            {actionResult.verification.details.risk_signals.sim_swap_recent ? 'Yes' : 'No'}
                          </span></p>
                          {actionResult.verification.details.risk_signals.latest_sim_change && (
                            <p className="text-gray-500">Last SIM change: {new Date(actionResult.verification.details.risk_signals.latest_sim_change).toLocaleString()}</p>
                          )}
                          <p>Device Swap: <span className={`font-mono ${actionResult.verification.details.risk_signals.device_swap_recent ? 'text-yellow-600' : 'text-green-600'}`}>
                            {actionResult.verification.details.risk_signals.device_swap_recent ? 'Yes' : 'No'}
                          </span></p>
                          {actionResult.verification.details.risk_signals.latest_device_change && (
                            <p className="text-gray-500">Last device change: {new Date(actionResult.verification.details.risk_signals.latest_device_change).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Number Verification Details */}
                    {actionResult.verification.details.number_verification && (
                      <div className="bg-white rounded p-2 border">
                        <div className="font-medium text-gray-700 mb-1">📱 Number Verification</div>
                        <div className="text-gray-600 space-y-0.5">
                          <p>Match: <span className={`font-mono ${actionResult.verification.details.number_verification.match ? 'text-green-600' : 'text-red-600'}`}>
                            {actionResult.verification.details.number_verification.match ? 'Yes' : 'No'}
                          </span></p>
                          {actionResult.verification.details.number_verification.note && (
                            <p className="text-gray-500 italic">{actionResult.verification.details.number_verification.note}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Raw JSON Response Toggle */}
                <RawResponseViewer 
                  data={actionResult.verification.details} 
                  title="View Raw API Response" 
                />
              </div>
            )}

            <button
              onClick={() => {
                setActionModal(null);
                setActionResult(null);
              }}
              className="btn-primary w-full"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="label">Site</label>
              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className="input"
              >
                {sites.map(site => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>

            {actionModal === 'transfer' && (
              <div>
                <label className="label">Transfer to</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="input"
                >
                  <option value="">Select user...</option>
                  {users.filter(u => u.id !== user.id).map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-xs text-orange-800">
                This action will be verified using the Mock Network Panel settings.
                <button
                  onClick={() => setPanelOpen(true)}
                  className="text-orange-600 underline ml-1"
                >
                  Configure
                </button>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActionModal(null)}
                className="btn-secondary flex-1"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(actionModal)}
                className="btn-primary flex-1"
                disabled={actionLoading || (actionModal === 'transfer' && !selectedUser)}
              >
                {actionLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
