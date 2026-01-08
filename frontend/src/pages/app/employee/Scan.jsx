import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssetByTag } from '../../../utils/api';

export default function Scan() {
  const [tagId, setTagId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleScan = async (e) => {
    e.preventDefault();
    if (!tagId.trim()) return;

    setLoading(true);
    setError('');

    try {
      const asset = await getAssetByTag(tagId.trim());
      navigate(`/app/employee/assets/${asset.id}`);
    } catch (err) {
      setError('Asset not found with that tag ID');
    } finally {
      setLoading(false);
    }
  };

  const sampleTags = [
    { id: 'TOOL-001', name: 'Power Drill', sensitivity: 'LOW' },
    { id: 'EQUIP-001', name: 'Diagnostic Scanner', sensitivity: 'MEDIUM' },
    { id: 'DEVICE-001', name: 'Network Analyzer', sensitivity: 'HIGH' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Scan Asset</h1>
        <p className="text-gray-500">Scan a QR code or enter a tag ID manually</p>
      </div>

      {/* Manual Entry */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Enter Tag ID</h2>
        
        <form onSubmit={handleScan} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <input
              type="text"
              value={tagId}
              onChange={(e) => setTagId(e.target.value.toUpperCase())}
              placeholder="e.g., TOOL-001"
              className="input text-lg font-mono"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || !tagId.trim()}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Looking up...' : 'Look Up Asset'}
          </button>
        </form>
      </div>

      {/* QR Scanner Placeholder */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Scan QR Code</h2>
        <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <p className="text-sm">Camera scanner not available in demo</p>
            <p className="text-xs mt-1">Use manual entry or sample tags below</p>
          </div>
        </div>
      </div>

      {/* Sample Tags */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sample Tags (Demo)</h2>
        <p className="text-sm text-gray-500 mb-4">Click a tag to look it up:</p>
        
        <div className="space-y-2">
          {sampleTags.map(tag => (
            <button
              key={tag.id}
              onClick={() => {
                setTagId(tag.id);
                navigate(`/app/employee/assets/${tag.id === 'TOOL-001' ? 1 : tag.id === 'EQUIP-001' ? 3 : 5}`);
              }}
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-primary-600">{tag.id}</span>
                <span className="text-gray-900">{tag.name}</span>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                tag.sensitivity === 'HIGH' ? 'bg-red-100 text-red-700' :
                tag.sensitivity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {tag.sensitivity}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
