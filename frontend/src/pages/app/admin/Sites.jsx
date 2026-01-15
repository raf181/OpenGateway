import { useState, useEffect } from 'react';
import { getSites, createSite, updateSite, deleteSite } from '../../../utils/api';
import Modal from '../../../components/Modal';

export default function AdminSites() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    geofence_radius_meters: 500,
  });

  const [addHovered, setAddHovered] = useState(false);

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      const data = await getSites();
      setSites(data);
    } catch (err) {
      console.error('Failed to load sites:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingSite(null);
    setFormData({
      name: '',
      latitude: '',
      longitude: '',
      geofence_radius_meters: 500,
    });
    setShowModal(true);
  };

  const openEditModal = (site) => {
    setEditingSite(site);
    setFormData({
      name: site.name,
      latitude: site.latitude || '',
      longitude: site.longitude || '',
      geofence_radius_meters: site.geofence_radius_meters || 500,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        geofence_radius_meters: parseInt(formData.geofence_radius_meters),
      };
      
      if (editingSite) {
        await updateSite(editingSite.id, payload);
      } else {
        await createSite(payload);
      }
      setShowModal(false);
      await loadSites();
    } catch (err) {
      console.error('Failed to save site:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this site?')) return;
    try {
      await deleteSite(id);
      await loadSites();
    } catch (err) {
      console.error('Failed to delete site:', err);
    }
  };

  const cardStyle = {
    backgroundColor: 'var(--bg-1)',
    borderRadius: 'var(--radius-2)',
    border: '1px solid var(--border)',
    overflow: 'hidden',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'var(--bg-0)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-1)',
    color: 'var(--fg-0)',
    fontSize: '15px',
    fontFamily: 'var(--font-ui)',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    outline: 'none',
  };

  const inputFocusHandlers = {
    onFocus: (e) => {
      e.target.style.borderColor = 'var(--accent)';
      e.target.style.boxShadow = 'var(--shadow-focus)';
    },
    onBlur: (e) => {
      e.target.style.borderColor = 'var(--border)';
      e.target.style.boxShadow = 'none';
    },
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
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--fg-0)', margin: 0, fontFamily: 'var(--font-display)' }}>Site Management</h1>
          <p style={{ color: 'var(--fg-1)', fontSize: '14px', marginTop: '4px' }}>Manage warehouse locations and geofences</p>
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
          Add Site
        </button>
      </div>

      {/* Sites Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {sites.map(site => (
          <SiteCard
            key={site.id}
            site={site}
            cardStyle={cardStyle}
            onEdit={() => openEditModal(site)}
            onDelete={() => handleDelete(site.id)}
          />
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingSite ? 'Edit Site' : 'Add New Site'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--fg-0)', marginBottom: '8px' }}>Site Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={inputStyle}
              placeholder="Main Warehouse"
              required
              {...inputFocusHandlers}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--fg-0)', marginBottom: '8px' }}>Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                style={{ ...inputStyle, fontFamily: 'var(--font-mono)' }}
                placeholder="40.7128"
                {...inputFocusHandlers}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--fg-0)', marginBottom: '8px' }}>Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                style={{ ...inputStyle, fontFamily: 'var(--font-mono)' }}
                placeholder="-74.0060"
                {...inputFocusHandlers}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--fg-0)', marginBottom: '8px' }}>Geofence Radius (meters)</label>
            <input
              type="number"
              value={formData.geofence_radius_meters}
              onChange={(e) => setFormData({ ...formData, geofence_radius_meters: e.target.value })}
              style={{ ...inputStyle, fontFamily: 'var(--font-mono)' }}
              placeholder="500"
              min="50"
              max="10000"
              {...inputFocusHandlers}
            />
            <p style={{ fontSize: '12px', color: 'var(--fg-1)', marginTop: '6px' }}>Used for Open Gateway location verification</p>
          </div>

          {/* Map Preview Placeholder */}
          <div style={{
            backgroundColor: 'var(--bg-0)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-1)',
            height: '160px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--fg-1)',
            fontSize: '13px',
          }}>
            <svg style={{ width: 24, height: 24, marginRight: 8, opacity: 0.5 }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Map preview would appear here
          </div>

          <div style={{ display: 'flex', gap: '12px', paddingTop: '12px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '14px 16px',
                backgroundColor: 'var(--accent)',
                border: 'none',
                borderRadius: 'var(--radius-1)',
                color: '#0b0d10',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
              }}
            >
              {editingSite ? 'Save Changes' : 'Create Site'}
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              style={{
                flex: 1,
                padding: '14px 16px',
                backgroundColor: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-1)',
                color: 'var(--fg-0)',
                fontSize: '15px',
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

function SiteCard({ site, cardStyle, onEdit, onDelete }) {
  const [editHovered, setEditHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);

  return (
    <div style={cardStyle}>
      {/* Map placeholder */}
      <div style={{
        height: '120px',
        backgroundColor: 'var(--bg-0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid var(--border)',
      }}>
        <svg style={{ width: 40, height: 40, color: 'var(--fg-1)', opacity: 0.3 }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--fg-0)', margin: 0 }}>{site.name}</h3>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {site.latitude && site.longitude ? (
                <span style={{ fontSize: '13px', color: 'var(--fg-1)', fontFamily: 'var(--font-mono)' }}>
                  {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}
                </span>
              ) : (
                <span style={{ fontSize: '13px', color: 'var(--fg-1)', fontStyle: 'italic' }}>No coordinates set</span>
              )}
              <span style={{ fontSize: '12px', color: 'var(--fg-1)' }}>
                Geofence: {site.geofence_radius_meters || 500}m radius
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onEdit}
              onMouseEnter={() => setEditHovered(true)}
              onMouseLeave={() => setEditHovered(false)}
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: editHovered ? 'rgba(198, 255, 58, 0.2)' : 'rgba(198, 255, 58, 0.1)',
                border: 'none',
                borderRadius: 'var(--radius-1)',
                color: 'var(--accent)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
              }}
            >
              <svg style={{ width: 14, height: 14 }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
              </svg>
            </button>
            <button
              onClick={onDelete}
              onMouseEnter={() => setDeleteHovered(true)}
              onMouseLeave={() => setDeleteHovered(false)}
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: deleteHovered ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                border: 'none',
                borderRadius: 'var(--radius-1)',
                color: '#f87171',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
              }}
            >
              <svg style={{ width: 14, height: 14 }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '24px' }}>
          <div>
            <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--fg-0)' }}>{site.user_count || 0}</span>
            <span style={{ fontSize: '12px', color: 'var(--fg-1)', marginLeft: '4px' }}>Users</span>
          </div>
          <div>
            <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--fg-0)' }}>{site.asset_count || 0}</span>
            <span style={{ fontSize: '12px', color: 'var(--fg-1)', marginLeft: '4px' }}>Assets</span>
          </div>
        </div>
      </div>
    </div>
  );
}
