import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAssets, getSites } from '../../../utils/api';

export default function EmployeeAssets() {
  const [assets, setAssets] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', site_id: '', search: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [assetsData, sitesData] = await Promise.all([getAssets(), getSites()]);
      setAssets(assetsData);
      setSites(sitesData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter(asset => {
    if (filter.status && asset.status !== filter.status) return false;
    if (filter.site_id && asset.site_id !== parseInt(filter.site_id)) return false;
    if (filter.search) {
      const query = filter.search.toLowerCase();
      if (!asset.name.toLowerCase().includes(query) && 
          !(asset.barcode || '').toLowerCase().includes(query)) {
        return false;
      }
    }
    return true;
  });

  const getStatusBadgeStyle = (status) => {
    const base = { padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500 };
    if (status === 'CHECKED_OUT') return { ...base, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' };
    if (status === 'AVAILABLE') return { ...base, backgroundColor: 'rgba(22, 163, 74, 0.15)', color: '#4ade80' };
    if (status === 'MAINTENANCE') return { ...base, backgroundColor: 'rgba(202, 138, 4, 0.15)', color: '#fbbf24' };
    return { ...base, backgroundColor: 'rgba(107, 114, 128, 0.15)', color: 'var(--fg-1)' };
  };

  const inputStyle = {
    padding: '10px 14px',
    backgroundColor: 'var(--bg-1)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-1)',
    color: 'var(--fg-0)',
    fontSize: '14px',
    fontFamily: 'var(--font-ui)',
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '2px solid rgba(242, 245, 247, 0.3)',
          borderTopColor: 'var(--accent)',
          animation: 'spin 0.6s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--bg-0)', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--fg-0)', margin: 0, fontFamily: 'var(--font-display)' }}>Browse Assets</h1>
        <p style={{ color: 'var(--fg-1)', fontSize: '14px', marginTop: '4px' }}>Find and checkout equipment</p>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div style={{ position: 'relative', flex: '1 1 250px', maxWidth: '400px' }}>
          <svg style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            width: 16, 
            height: 16, 
            color: 'var(--fg-1)',
            pointerEvents: 'none',
          }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            placeholder="Search assets..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            style={{ ...inputStyle, width: '100%', paddingLeft: '40px' }}
          />
        </div>
        
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          style={{ ...inputStyle, width: 'auto', minWidth: '150px' }}
        >
          <option value="">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="CHECKED_OUT">Checked Out</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>

        <select
          value={filter.site_id}
          onChange={(e) => setFilter({ ...filter, site_id: e.target.value })}
          style={{ ...inputStyle, width: 'auto', minWidth: '150px' }}
        >
          <option value="">All Sites</option>
          {sites.map(site => (
            <option key={site.id} value={site.id}>{site.name}</option>
          ))}
        </select>

        <div style={{ marginLeft: 'auto', color: 'var(--fg-1)', fontSize: '14px' }}>
          {filteredAssets.length} assets found
        </div>
      </div>

      {/* Assets Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {filteredAssets.map(asset => (
          <AssetCard
            key={asset.id}
            asset={asset}
            getStatusBadgeStyle={getStatusBadgeStyle}
          />
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--fg-1)',
        }}>
          <svg style={{ width: 48, height: 48, margin: '0 auto 16px', opacity: 0.4 }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
          <p style={{ fontSize: '16px', margin: 0 }}>No assets match your filters</p>
        </div>
      )}
    </div>
  );
}

function AssetCard({ asset, getStatusBadgeStyle }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/app/assets/${asset.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        backgroundColor: 'var(--bg-1)',
        borderRadius: 'var(--radius-2)',
        border: hovered ? '1px solid var(--accent)' : '1px solid var(--border)',
        padding: '20px',
        textDecoration: 'none',
        transition: 'border-color 0.2s, transform 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          backgroundColor: 'rgba(198, 255, 58, 0.1)',
          borderRadius: 'var(--radius-1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg style={{ width: 22, height: 22, color: 'var(--accent)' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        </div>
        <span style={getStatusBadgeStyle(asset.status)}>{asset.status.replace('_', ' ')}</span>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--fg-0)', margin: 0 }}>{asset.name}</h3>
      
      {asset.barcode && (
        <p style={{ fontSize: '13px', color: 'var(--fg-1)', margin: '4px 0 0', fontFamily: 'var(--font-mono)' }}>
          {asset.barcode}
        </p>
      )}

      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg style={{ width: 14, height: 14, color: 'var(--fg-1)' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span style={{ fontSize: '13px', color: 'var(--fg-1)' }}>{asset.site?.name || 'Unknown'}</span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {asset.is_sensitive && (
            <span style={{ 
              padding: '2px 8px', 
              borderRadius: '9999px', 
              fontSize: '10px', 
              backgroundColor: 'rgba(239, 68, 68, 0.15)', 
              color: '#f87171',
            }}>
              Sensitive
            </span>
          )}
          {asset.requires_manager_approval && (
            <span style={{ 
              padding: '2px 8px', 
              borderRadius: '9999px', 
              fontSize: '10px', 
              backgroundColor: 'rgba(202, 138, 4, 0.15)', 
              color: '#fbbf24',
            }}>
              Approval
            </span>
          )}
        </div>
      </div>

      {asset.status === 'AVAILABLE' && (
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          backgroundColor: 'rgba(22, 163, 74, 0.1)',
          borderRadius: 'var(--radius-1)',
          color: '#4ade80',
          fontSize: '13px',
          fontWeight: 500,
          textAlign: 'center',
        }}>
          Available for Checkout
        </div>
      )}
    </Link>
  );
}
