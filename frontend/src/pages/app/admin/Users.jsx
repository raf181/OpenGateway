import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser, getSites } from '../../../utils/api';
import Modal from '../../../components/Modal';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone_number: '',
    role: 'EMPLOYEE',
    home_site_id: '',
    password: '',
  });

  const [addHovered, setAddHovered] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, sitesData] = await Promise.all([getUsers(), getSites()]);
      setUsers(usersData);
      setSites(sitesData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      full_name: '',
      phone_number: '+1',
      role: 'EMPLOYEE',
      home_site_id: sites[0]?.id || '',
      password: '',
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      full_name: user.full_name,
      phone_number: user.phone_number,
      role: user.role,
      home_site_id: user.home_site_id,
      password: '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;
      
      if (editingUser) {
        await updateUser(editingUser.id, payload);
      } else {
        await createUser(payload);
      }
      setShowModal(false);
      await loadData();
    } catch (err) {
      console.error('Failed to save user:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      await loadData();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const getRoleBadgeStyle = (role) => {
    const base = { padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500 };
    if (role === 'ADMIN') return { ...base, backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' };
    if (role === 'MANAGER') return { ...base, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' };
    return { ...base, backgroundColor: 'rgba(107, 114, 128, 0.15)', color: 'var(--fg-1)' };
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
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--fg-0)', margin: 0, fontFamily: 'var(--font-display)' }}>User Management</h1>
          <p style={{ color: 'var(--fg-1)', fontSize: '14px', marginTop: '4px' }}>Manage team members and their access</p>
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
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div style={cardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-0)' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Home Site</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 500, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <UserRow
                key={user.id}
                user={user}
                index={index}
                getRoleBadgeStyle={getRoleBadgeStyle}
                onEdit={() => openEditModal(user)}
                onDelete={() => handleDelete(user.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--fg-0)', marginBottom: '8px' }}>Full Name</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              style={inputStyle}
              placeholder="John Doe"
              required
              {...inputFocusHandlers}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--fg-0)', marginBottom: '8px' }}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={inputStyle}
              placeholder="john@example.com"
              required
              {...inputFocusHandlers}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--fg-0)', marginBottom: '8px' }}>Phone Number</label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              style={{ ...inputStyle, fontFamily: 'var(--font-mono)' }}
              placeholder="+1234567890"
              required
              {...inputFocusHandlers}
            />
            <p style={{ fontSize: '12px', color: 'var(--fg-1)', marginTop: '6px' }}>Used for Open Gateway number verification</p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--fg-0)', marginBottom: '8px' }}>Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={inputStyle}
              {...inputFocusHandlers}
            >
              <option value="EMPLOYEE">Employee - Basic checkout access</option>
              <option value="MANAGER">Manager - Can approve step-up requests</option>
              <option value="ADMIN">Admin - Full system access</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--fg-0)', marginBottom: '8px' }}>Home Site</label>
            <select
              value={formData.home_site_id}
              onChange={(e) => setFormData({ ...formData, home_site_id: parseInt(e.target.value) })}
              style={inputStyle}
              required
              {...inputFocusHandlers}
            >
              {sites.map(site => (
                <option key={site.id} value={site.id}>{site.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--fg-0)', marginBottom: '8px' }}>
              {editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={inputStyle}
              placeholder="••••••••"
              required={!editingUser}
              {...inputFocusHandlers}
            />
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
              {editingUser ? 'Save Changes' : 'Create User'}
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

function UserRow({ user, index, getRoleBadgeStyle, onEdit, onDelete }) {
  const [editHovered, setEditHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);
  
  return (
    <tr style={{ borderTop: index > 0 ? '1px solid var(--border)' : 'none' }}>
      <td style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'rgba(198, 255, 58, 0.15)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ color: 'var(--accent)', fontWeight: 500, fontSize: '13px' }}>
              {user.full_name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <span style={{ fontWeight: 500, color: 'var(--fg-0)', fontSize: '14px' }}>{user.full_name}</span>
        </div>
      </td>
      <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--fg-1)' }}>{user.email}</td>
      <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--fg-1)', fontFamily: 'var(--font-mono)' }}>{user.phone_number}</td>
      <td style={{ padding: '12px 16px' }}>
        <span style={getRoleBadgeStyle(user.role)}>{user.role}</span>
      </td>
      <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--fg-1)' }}>{user.home_site?.name || 'Unknown'}</td>
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
          disabled={user.role === 'ADMIN'}
          style={{
            background: 'none',
            border: 'none',
            color: deleteHovered && user.role !== 'ADMIN' ? '#fca5a5' : '#f87171',
            cursor: user.role === 'ADMIN' ? 'not-allowed' : 'pointer',
            opacity: user.role === 'ADMIN' ? 0.5 : 1,
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
