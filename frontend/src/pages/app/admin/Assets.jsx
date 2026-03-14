import { useState, useEffect } from 'react';
import { getAssets, createAsset, updateAsset, deleteAsset, getSites } from '../../../utils/api';
import Modal from '../../../components/Modal';

export default function AdminAssets() {
  const [assets, setAssets] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [formData, setFormData] = useState({
    tag_id: '',
    name: '',
    description: '',
    sensitivity_level: 'LOW',
    site_id: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [assetsData, sitesData] = await Promise.all([
        getAssets(),
        getSites()
      ]);
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
      tag_id: '',
      name: '',
      description: '',
      sensitivity_level: 'LOW',
      site_id: sites[0]?.id || '',
    });
    setShowModal(true);
  };

  const openEditModal = (asset) => {
    setEditingAsset(asset);
    setFormData({
      tag_id: asset.tag_id,
      name: asset.name,
      description: asset.description || '',
      sensitivity_level: asset.sensitivity_level,
      site_id: asset.site_id,
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
    if (!confirm('Seguro que deseas eliminar este activo?')) return;
    try {
      await deleteAsset(id);
      await loadData();
    } catch (err) {
      console.error('Failed to delete asset:', err);
    }
  };

  const getSensitivityStyle = (level) => {
    const styles = {
      HIGH: 'bg-red-100 text-red-700',
      MEDIUM: 'bg-yellow-100 text-yellow-700',
      LOW: 'bg-gray-100 text-gray-700',
    };
    return styles[level] || styles.LOW;
  };

  const getStatusStyle = (status) => {
    const styles = {
      AVAILABLE: 'bg-green-100 text-green-700',
      CHECKED_OUT: 'bg-yellow-100 text-yellow-700',
      MAINTENANCE: 'bg-gray-100 text-gray-700',
      RETIRED: 'bg-red-100 text-red-700',
    };
    return styles[status] || styles.AVAILABLE;
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion de activos</h1>
          <p className="text-gray-500">Crea, edita y gestiona activos rastreados</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          Agregar activo
        </button>
      </div>

      {/* Assets Table */}
      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID etiqueta</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sitio</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sensibilidad</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Custodio</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {assets.map(asset => (
              <tr key={asset.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap font-mono text-sm text-primary-600">
                  {asset.tag_id}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{asset.name}</div>
                  {asset.description && (
                    <div className="text-xs text-gray-500 truncate max-w-xs">{asset.description}</div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {asset.site?.name || 'Desconocido'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(asset.status)}`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getSensitivityStyle(asset.sensitivity_level)}`}>
                    {asset.sensitivity_level}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {asset.current_custodian?.full_name || '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <button
                    onClick={() => openEditModal(asset)}
                    className="text-primary-600 hover:text-primary-800 mr-3"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingAsset ? 'Editar activo' : 'Agregar activo'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID de etiqueta</label>
            <input
              type="text"
              value={formData.tag_id}
              onChange={(e) => setFormData({ ...formData, tag_id: e.target.value.toUpperCase() })}
              className="input font-mono"
              placeholder="ej.: TOOL-001"
              required
              disabled={editingAsset}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="ej.: Taladro electrico"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              rows={2}
              placeholder="Descripcion opcional..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sitio</label>
            <select
              value={formData.site_id}
              onChange={(e) => setFormData({ ...formData, site_id: parseInt(e.target.value) })}
              className="input"
              required
            >
              {sites.map(site => (
                <option key={site.id} value={site.id}>{site.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de sensibilidad</label>
            <select
              value={formData.sensitivity_level}
              onChange={(e) => setFormData({ ...formData, sensitivity_level: e.target.value })}
              className="input"
            >
              <option value="LOW">Baja - Retiro basico</option>
              <option value="MEDIUM">Media - Requiere verificacion de numero</option>
              <option value="HIGH">Alta - Verificacion completa + ubicacion</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {editingAsset ? 'Guardar cambios' : 'Crear activo'}
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
