import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAssets, getSites } from '../../../utils/api';

export default function EmployeeAssets() {
  const [assets, setAssets] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [siteFilter, setSiteFilter] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [assetsData, sitesData] = await Promise.all([
          getAssets(),
          getSites()
        ]);
        setAssets(assetsData);
        setSites(sitesData);
      } catch (err) {
        console.error('Failed to load assets:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = !search || 
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.tag_id.toLowerCase().includes(search.toLowerCase()) ||
      (asset.serial && asset.serial.toLowerCase().includes(search.toLowerCase()));
    const matchesSite = !siteFilter || asset.current_site_id === parseInt(siteFilter);
    return matchesSearch && matchesSite;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
          <p className="text-gray-500">Browse and manage asset catalog</p>
        </div>
        <Link to="/app/employee/scan" className="btn-primary btn-sm flex items-center gap-2 w-fit">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          Scan Asset
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, tag ID, or serial..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="input"
            >
              <option value="">All Sites</option>
              {sites.map(site => (
                <option key={site.id} value={site.id}>{site.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map(asset => (
          <Link
            key={asset.id}
            to={`/app/employee/assets/${asset.id}`}
            className="card hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-mono text-sm text-primary-600">{asset.tag_id}</p>
                <h3 className="font-semibold text-gray-900">{asset.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                asset.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                asset.status === 'CHECKED_OUT' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {asset.status}
              </span>
            </div>
            
            <div className="text-sm text-gray-500 space-y-1">
              <p>Type: {asset.asset_type}</p>
              {asset.serial && <p>Serial: {asset.serial}</p>}
              {asset.site_name && <p>Site: {asset.site_name}</p>}
              {asset.custodian_name && <p>Custodian: {asset.custodian_name}</p>}
            </div>

            <div className="mt-3 pt-3 border-t flex items-center justify-between">
              <span className={`px-2 py-1 text-xs rounded-full ${
                asset.sensitivity === 'HIGH' ? 'bg-red-100 text-red-700' :
                asset.sensitivity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {asset.sensitivity} sensitivity
              </span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No assets found matching your criteria.
        </div>
      )}
    </div>
  );
}
