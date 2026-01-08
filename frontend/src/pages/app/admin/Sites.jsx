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
    address: '',
    latitude: '',
    longitude: '',
    geofence_radius_m: 100,
  });

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
      address: '',
      latitude: '',
      longitude: '',
      geofence_radius_m: 100,
    });
    setShowModal(true);
  };

  const openEditModal = (site) => {
    setEditingSite(site);
    setFormData({
      name: site.name,
      address: site.address || '',
      latitude: site.latitude.toString(),
      longitude: site.longitude.toString(),
      geofence_radius_m: site.geofence_radius_m,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        geofence_radius_m: parseInt(formData.geofence_radius_m),
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Management</h1>
          <p className="text-gray-500">Configure sites and geofence boundaries</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          Add Site
        </button>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sites.map(site => (
          <div key={site.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{site.name}</h3>
                <p className="text-sm text-gray-500">{site.address}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(site)}
                  className="text-primary-600 hover:text-primary-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(site.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Simple SVG Map Placeholder */}
            <div className="relative bg-gray-100 rounded-lg h-48 mb-4 overflow-hidden">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                {/* Grid lines */}
                <defs>
                  <pattern id={`grid-${site.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="400" height="200" fill={`url(#grid-${site.id})`} />
                
                {/* Geofence circle */}
                <circle
                  cx="200"
                  cy="100"
                  r={Math.min(80, site.geofence_radius_m / 5)}
                  fill="rgba(99, 102, 241, 0.1)"
                  stroke="rgba(99, 102, 241, 0.5)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                
                {/* Center marker */}
                <circle cx="200" cy="100" r="6" fill="#6366f1" />
                <circle cx="200" cy="100" r="3" fill="white" />
                
                {/* Coordinates label */}
                <text x="200" y="150" textAnchor="middle" className="text-xs" fill="#6b7280">
                  {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}
                </text>
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Latitude</p>
                <p className="font-mono">{site.latitude.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-gray-500">Longitude</p>
                <p className="font-mono">{site.longitude.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-gray-500">Geofence Radius</p>
                <p className="font-semibold">{site.geofence_radius_m} meters</p>
              </div>
              <div>
                <p className="text-gray-500">Assets</p>
                <p className="font-semibold">{site.asset_count || 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sites.length === 0 && (
        <div className="card text-center py-12">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <p className="text-gray-500">No sites configured yet</p>
          <button onClick={openCreateModal} className="btn-primary mt-4">
            Add Your First Site
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingSite ? 'Edit Site' : 'Add New Site'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="e.g., Main Warehouse"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input"
              placeholder="123 Main St, City, State"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                className="input"
                placeholder="40.7128"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                className="input"
                placeholder="-74.0060"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Geofence Radius (meters)
            </label>
            <input
              type="number"
              value={formData.geofence_radius_m}
              onChange={(e) => setFormData({ ...formData, geofence_radius_m: e.target.value })}
              className="input"
              min="10"
              max="10000"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Device must be within this radius for location verification to pass
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {editingSite ? 'Save Changes' : 'Create Site'}
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
