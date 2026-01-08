import { useState, useEffect } from 'react';
import { getApprovals, processApproval } from '../../../utils/api';

export default function Approvals() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    try {
      const data = await getApprovals();
      setApprovals(data);
    } catch (err) {
      console.error('Failed to load approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setProcessing(id);
    try {
      await processApproval(id, { action });
      await loadApprovals();
    } catch (err) {
      console.error('Failed to process approval:', err);
    } finally {
      setProcessing(null);
    }
  };

  const formatAction = (action) => {
    return action.replace(/_/g, ' ').toLowerCase();
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      APPROVED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
      EXPIRED: 'bg-gray-100 text-gray-700',
    };
    return styles[status] || styles.PENDING;
  };

  const pendingApprovals = approvals.filter(a => a.status === 'PENDING');
  const historyApprovals = approvals.filter(a => a.status !== 'PENDING');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Approval Requests</h1>
        <p className="text-gray-500">Review and process custody requests from your team</p>
      </div>

      {/* Pending Approvals */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          Pending Requests
          {pendingApprovals.length > 0 && (
            <span className="bg-yellow-100 text-yellow-700 text-sm px-2 py-0.5 rounded-full">
              {pendingApprovals.length}
            </span>
          )}
        </h2>

        {pendingApprovals.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No pending approvals</p>
            <p className="text-sm">All requests have been processed</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingApprovals.map(approval => (
              <div key={approval.id} className="card border-l-4 border-l-yellow-400">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {approval.asset?.name || 'Unknown Asset'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Tag: {approval.asset?.tag_id || 'N/A'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(approval.status)}`}>
                    {approval.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-500">Requested By</p>
                    <p className="font-medium">{approval.requester?.full_name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Action</p>
                    <p className="font-medium capitalize">{formatAction(approval.requested_action)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Sensitivity</p>
                    <p className="font-medium">{approval.asset?.sensitivity_level || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Requested</p>
                    <p className="font-medium">
                      {new Date(approval.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {approval.justification && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
                    <p className="text-gray-500 mb-1">Justification:</p>
                    <p className="text-gray-900">{approval.justification}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(approval.id, 'APPROVED')}
                    disabled={processing === approval.id}
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    {processing === approval.id ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleAction(approval.id, 'REJECTED')}
                    disabled={processing === approval.id}
                    className="btn-secondary flex-1 disabled:opacity-50 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">History</h2>

        {historyApprovals.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">
            <p>No approval history yet</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requester</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {historyApprovals.map(approval => (
                  <tr key={approval.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{approval.asset?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{approval.asset?.tag_id}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {approval.requester?.full_name || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {formatAction(approval.requested_action)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(approval.status)}`}>
                        {approval.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(approval.resolved_at || approval.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
