import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { getAssets, getSites, getApprovals } from '../../../utils/api';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ assets: 0, myAssets: 0, pendingApprovals: 0 });
  const [recentAssets, setRecentAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [assets, approvals] = await Promise.all([
          getAssets(),
          user.role !== 'EMPLOYEE' ? getApprovals() : Promise.resolve([])
        ]);
        
        const myAssets = assets.filter(a => a.current_custodian_id === user.id);
        
        setStats({
          assets: assets.length,
          myAssets: myAssets.length,
          pendingApprovals: approvals.length
        });
        
        setRecentAssets(assets.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
        <p className="text-gray-500">Here's what's happening with your assets today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.assets}</p>
              <p className="text-sm text-gray-500">Total Assets</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.myAssets}</p>
              <p className="text-sm text-gray-500">My Checked Out</p>
            </div>
          </div>
        </div>

        {user.role !== 'EMPLOYEE' && (
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
                <p className="text-sm text-gray-500">Pending Approvals</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link to="/app/employee/scan" className="card hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Scan Asset</p>
            <p className="text-xs text-gray-500">QR or NFC tag</p>
          </div>
        </Link>

        <Link to="/app/employee/assets" className="card hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">View Assets</p>
            <p className="text-xs text-gray-500">Browse catalog</p>
          </div>
        </Link>

        <Link to="/app/audit" className="card hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Audit Trail</p>
            <p className="text-xs text-gray-500">View history</p>
          </div>
        </Link>

        {user.role !== 'EMPLOYEE' && (
          <Link to="/app/manager/approvals" className="card hover:shadow-md transition-shadow flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Approvals</p>
              <p className="text-xs text-gray-500">{stats.pendingApprovals} pending</p>
            </div>
          </Link>
        )}
      </div>

      {/* Recent Assets */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Assets</h2>
          <Link to="/app/employee/assets" className="text-sm text-primary-600 hover:text-primary-700">
            View all →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3 font-medium">Tag ID</th>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Sensitivity</th>
                <th className="pb-3 font-medium">Site</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentAssets.map(asset => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="py-3">
                    <Link to={`/app/employee/assets/${asset.id}`} className="text-primary-600 hover:text-primary-700 font-mono text-sm">
                      {asset.tag_id}
                    </Link>
                  </td>
                  <td className="py-3 text-gray-900">{asset.name}</td>
                  <td className="py-3">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      asset.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                      asset.status === 'CHECKED_OUT' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      asset.sensitivity === 'HIGH' ? 'bg-red-100 text-red-700' :
                      asset.sensitivity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {asset.sensitivity}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500 text-sm">{asset.site_name || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
