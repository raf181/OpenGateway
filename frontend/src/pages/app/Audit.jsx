import { useState, useEffect } from 'react';
import { getAuditEvents, verifyAuditChain } from '../../utils/api';

export default function Audit() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chainValid, setChainValid] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [filters, setFilters] = useState({
    event_type: '',
    user_id: '',
    asset_id: '',
    decision: '',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const params = {};
      if (filters.event_type) params.event_type = filters.event_type;
      if (filters.decision) params.decision = filters.decision;
      
      const data = await getAuditEvents(params);
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyChain = async () => {
    setVerifying(true);
    try {
      const result = await verifyAuditChain();
      setChainValid(result.valid);
    } catch (err) {
      console.error('Failed to verify chain:', err);
      setChainValid(false);
    } finally {
      setVerifying(false);
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'CHECKOUT':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        );
      case 'RETURN':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        );
      case 'TRANSFER':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getDecisionColor = (decision) => {
    switch (decision) {
      case 'ALLOW':
        return 'bg-green-100 text-green-700';
      case 'DENY':
        return 'bg-red-100 text-red-700';
      case 'STEP_UP':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'CHECKOUT':
        return 'bg-yellow-100 text-yellow-600';
      case 'RETURN':
        return 'bg-green-100 text-green-600';
      case 'TRANSFER':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
          <p className="text-gray-500">Complete custody history with tamper-evident chain</p>
        </div>
        <div className="flex items-center gap-4">
          {chainValid !== null && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              chainValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {chainValid ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">Chain Valid</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">Chain Invalid</span>
                </>
              )}
            </div>
          )}
          <button
            onClick={handleVerifyChain}
            disabled={verifying}
            className="btn-secondary"
          >
            {verifying ? 'Verifying...' : 'Verify Chain'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Filters</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Event Type</label>
            <select
              value={filters.event_type}
              onChange={(e) => setFilters({ ...filters, event_type: e.target.value })}
              className="input text-sm"
            >
              <option value="">All Types</option>
              <option value="CHECKOUT">Checkout</option>
              <option value="RETURN">Return</option>
              <option value="TRANSFER">Transfer</option>
              <option value="INVENTORY_CLOSE">Inventory Close</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Decision</label>
            <select
              value={filters.decision}
              onChange={(e) => setFilters({ ...filters, decision: e.target.value })}
              className="input text-sm"
            >
              <option value="">All Decisions</option>
              <option value="ALLOW">Allow</option>
              <option value="DENY">Deny</option>
              <option value="STEP_UP">Step Up</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-end">
            <button onClick={loadEvents} className="btn-primary text-sm">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Chain Explanation */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <div>
            <h3 className="font-medium text-purple-900">Tamper-Evident Hash Chain</h3>
            <p className="text-sm text-purple-700 mt-1">
              Each audit event contains a hash of the previous event, creating an immutable chain. 
              If any historical record is modified, the chain verification will fail, ensuring 
              complete audit integrity for compliance and legal purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Events Timeline */}
      {events.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500">No audit events found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={event.id} className="card">
              <div className="flex items-start gap-4">
                {/* Event Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getEventColor(event.event_type)}`}>
                  {getEventIcon(event.event_type)}
                </div>

                {/* Event Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-semibold text-gray-900">{event.event_type}</span>
                      <span className="text-gray-500 mx-2">•</span>
                      <span className="text-gray-700">{event.asset?.name || 'Unknown Asset'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getDecisionColor(event.decision)}`}>
                        {event.decision}
                      </span>
                      <span className="text-xs text-gray-400">#{event.id}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Actor</p>
                      <p className="text-gray-900">{event.actor?.full_name || 'System'}</p>
                    </div>
                    {event.target_user && (
                      <div>
                        <p className="text-xs text-gray-500">Target User</p>
                        <p className="text-gray-900">{event.target_user.full_name}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500">Site</p>
                      <p className="text-gray-900">{event.site?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Timestamp</p>
                      <p className="text-gray-900">{new Date(event.timestamp).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Verification Results */}
                  {event.verification_results && Object.keys(event.verification_results).length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-xs text-gray-500 mb-2">Verification Results</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(event.verification_results).map(([key, value]) => (
                          <span
                            key={key}
                            className={`px-2 py-1 text-xs rounded ${
                              value === true || value === 'VERIFIED'
                                ? 'bg-green-100 text-green-700'
                                : value === false
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {key}: {typeof value === 'boolean' ? (value ? '✓' : '✗') : String(value)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hash Info */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 text-gray-400">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span className="font-mono truncate max-w-xs" title={event.event_hash}>
                        {event.event_hash?.substring(0, 16)}...
                      </span>
                    </div>
                    {event.prev_hash && (
                      <div className="flex items-center gap-1 text-gray-400">
                        <span>← prev:</span>
                        <span className="font-mono truncate max-w-xs" title={event.prev_hash}>
                          {event.prev_hash.substring(0, 8)}...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
