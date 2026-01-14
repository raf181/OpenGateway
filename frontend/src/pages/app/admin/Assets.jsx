import { useState, useEffect } from 'react';
import { getAssets, createAsset, updateAsset, deleteAsset, getSites } from '../../../utils/api';
import Modal from '../../../components/Modal';

export default function AdminAssets() {
  const [assets, setAssets] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [filter, setFilter] = useState({ status: '', site_id: '' });
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    category: '',
    site_id: '',
    is_sensitive: false,
    requires_manager_approval: false,
  });

  const [addHovered, setAddHovered] = useState(false);

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

  const openCreateModal = () => {
    setEditingAsset(null);
    setFormData({
      name: '',
      barcode: '',
      category: '',
      site_id: sites[0]?.id || '',
      is_sensitive: false,
      requires_manager_approval: false,
    });
    setShowModal(true);
  };

  const openEditModal = (asset) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      barcode: asset.barcode || '',
      category: asset.category || '',
      site_id: asset.site_id,
      is_sensitive: asset.is_sensitive || false,
      requires_manager_approval: asset.requires_manager_approval || false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAsset) {
        await updateAsset(editingAsset.id, formData);
      } else {
        await createAsset(formData);
      }
      setShowModal(false);
      await loadData();
    } catch (err) {
      console.error('Failed to save asset:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    try {
      await deleteAsset(id);
      await loadData();
    } catch (err) {
      console.error('Failed to delete asset:', err);
    }
  };

  const getStatusBadgeStyle = (status) => {
    const base = { padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500 };
    if (status === 'CHECKED_OUT') return { ...base, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' };
    if (status === 'AVAILABLE') return { ...base, backgroundColor: 'rgba(22, 163, 74, 0.15)', color: '#4ade80' };
    if (status === 'MAINTENANCE') return { ...base, backgroundColor: 'rgba(202, 138, 4, 0.15)', color: '#fbbf24' };
    return { ...base, backgroundColor: 'rgba(107, 114, 128, 0.15)', color: 'var(--fg-1)' };
  };

  const filteredAssets = assets.filter(asset => {
    if (filter.status && asset.status !== filter.status) return false;
    if (filter.site_id && asset.site_id !== parseInt(filter.site_id)) return false;
    return true;
  });

  const cardStyle = {
    backgroundColor: 'var(--bg-1)',
    borderRadius: 'var(--radius-2)',
    border: '1px solid var(--border)',
    overflow: 'hidden',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: 'var(--bg-0)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-1)',
    color: 'var(--fg-0)',
    fontSize: '14px',
    fontFamily: 'var(--font-ui)',
  };

  const checkboxStyle = {
    width: '18px',
    height: '18px',
    accentColor: 'var(--accent)',
    cursor: 'pointer',
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--fg-0)', margin: 0, fontFamily: 'var(--font-display)' }}>Asset Management</h1>
          <p style={{ color: 'var(--fg-1)', fontSize: '14px', marginTop: '4px' }}>Manage inventory and asset configuration</p>
        </div>
        <button
          onClick={openCreateModal}
          onMouseEnter={() => setAddHovered(true)}
          onMouseLeave={() => setAddHovered(false)}
          style={{
            padding: '10px 20px',
            backgroundColor: addHovered ? '#d4ff5a' : 'var(--accent)',
            border: 'none',
            borderRadius: 'var(--radius-1)',
            color: '#0b0d10',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            fontFamily: 'var(--font-ui)',
          }}
        >
          Add Asset
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
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
        <div style={{ marginLeft: 'auto', color: 'var(--fg-1)', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
          {filteredAssets.length} assets
        </div>
      </div>

      {/* Assets Table */}
      <div style={cardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-0)' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Asset</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Barcode</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Site</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 500, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Flags</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 500, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset, index) => (
              <AssetRow
                key={asset.id}
                asset={asset}
                index={index}
                getStatusBadgeStyle={getStatusBadgeStyle}
                onEdit={() => openEditModal(asset)}
                onDelete={() => handleDelete(asset.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingAsset ? 'Edit Asset' : 'Add New Asset'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--fg-1)', marginBottom: '6px' }}>Asset Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={inputStyle}
              placeholder="MacBook Pro 16-inch"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--fg-1)', marginBottom: '6px' }}>Barcode</label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                style={{ ...inputStyle, fontFamily: 'var(--font-mono)' }}
                placeholder="AST-2024-001"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--fg-1)', marginBottom: '6px' }}>Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={inputStyle}
                placeholder="Electronics"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--fg-1)', marginBottom: '6px' }}>Assigned Site</label>
            <select
              value={formData.site_id}
              onChange={(e) => setFormData({ ...formData, site_id: parseInt(e.target.value) })}
              style={inputStyle}
              required
            >
              {sites.map(site => (
                <option key={site.id} value={site.id}>{site.name}</option>
              ))}
            </select>
          </div>

          <div style={{ backgroundColor: 'var(--bg-0)', borderRadius: 'var(--radius-1)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.is_sensitive}
                onChange={(e) => setFormData({ ...formData, is_sensitive: e.target.checked })}
                style={checkboxStyle}
              />
              <div>
                <span style={{ fontSize: '14px', color: 'var(--fg-0)' }}>Sensitive Asset</span>
                <p style={{ fontSize: '12px', color: 'var(--fg-1)', margin: '2px 0 0' }}>Requires additional Open Gateway verification</p>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.requires_manager_approval}
                onChange={(e) => setFormData({ ...formData, requires_manager_approval: e.target.checked })}
                style={checkboxStyle}
              />
              <div>
                <span style={{ fontSize: '14px', color: 'var(--fg-0)' }}>Requires Manager Approval</span>
                <p style={{ fontSize: '12px', color: 'var(--fg-1)', margin: '2px 0 0' }}>Checkout requires explicit manager sign-off</p>
              </div>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px 16px',
                backgroundColor: 'var(--accent)',
                border: 'none',
                borderRadius: 'var(--radius-1)',
                color: '#0b0d10',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
              }}
            >
              {editingAsset ? 'Save Changes' : 'Create Asset'}
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              style={{
                flex: 1,
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-1)',
                color: 'var(--fg-0)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function AssetRow({ asset, index, getStatusBadgeStyle, onEdit, onDelete }) {
  const [editHovered, setEditHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);

  return (
    <tr style={{ borderTop: index > 0 ? '1px solid var(--border)' : 'none' }}>
      <td style={{ padding: '12px 16px' }}>
        <span style={{ fontWeight: 500, color: 'var(--fg-0)', fontSize: '14px' }}>{asset.name}</span>
      </td>
      <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--fg-1)', fontFamily: 'var(--font-mono)' }}>
        {asset.barcode || '-'}
      </td>
      <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--fg-1)' }}>
        {asset.category || '-'}
      </td>
      <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--fg-1)' }}>
        {asset.site?.name || 'Unknown'}
      </td>
      <td style={{ padding: '12px 16px' }}>
        <span style={getStatusBadgeStyle(asset.status)}>{asset.status.replace('_', ' ')}</span>
      </td>
      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
          {asset.is_sensitive && (
            <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
              Sensitive
            </span>
          )}
          {asset.requires_manager_approval && (
            <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', backgroundColor: 'rgba(202, 138, 4, 0.15)', color: '#fbbf24' }}>
              Approval
            </span>
          )}
        </div>
      </td>
      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
        <button
          onClick={onEdit}
          onMouseEnter={() => setEditHovered(true)}
          onMouseLeave={() => setEditHovered(false)}
          style={{
            background: 'none',
            border: 'none',
            color: editHovered ? '#d4ff5a' : 'var(--accent)',
            cursor: 'pointer',
            marginRight: '12px',
            fontSize: '14px',
            fontFamily: 'var(--font-ui)',
          }}
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          onMouseEnter={() => setDeleteHovered(true)}
          onMouseLeave={() => setDeleteHovered(false)}
          style={{
            background: 'none',
            border: 'none',
            color: deleteHovered ? '#fca5a5' : '#f87171',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'var(--font-ui)',
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
