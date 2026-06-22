import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import Loader from '../components/Loader';

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [usersList, setUsersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      const data = await res.json();
      setUsersList(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Failed to update user role', error);
    }
  };

  const handleBanToggle = async (userId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${userId}/ban`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Failed to toggle ban status', error);
    }
  };

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${userToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Failed to delete user', error);
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  return (
    <div className="container mobile-stack" style={{ padding: '40px 0', minHeight: '60vh', display: 'flex', gap: '48px' }}>
      <AdminSidebar />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600' }}>User Management</h2>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ padding: '8px 16px', border: '1px solid #eaeaea', borderRadius: '4px', width: '300px' }} 
          />
        </div>
        
        {loading ? (
          <Loader type="skeleton-table" />
        ) : (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div className="table-responsive-wrapper">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #eaeaea' }}>
                  <tr>
                    <th style={{ padding: '16px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>NAME</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>EMAIL</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>ROLE</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.filter(u => 
                    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
                  ).map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid #eaeaea', backgroundColor: u.isBanned ? '#fee2e2' : 'transparent' }}>
                      <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>
                        {u.name} {u.isBanned && <span style={{ color: '#ef4444', fontSize: '12px', marginLeft: '8px' }}>(Banned)</span>}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px' }}>{u.email}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <select 
                          value={u.role} 
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          disabled={u._id === user._id}
                          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #eaeaea', outline: 'none', cursor: u._id === user._id ? 'not-allowed' : 'pointer' }}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleBanToggle(u._id)} 
                            disabled={u._id === user._id || u.role === 'admin'}
                            style={{ padding: '6px 12px', border: '1px solid', backgroundColor: 'transparent', color: (u._id === user._id || u.role === 'admin') ? '#ccc' : (u.isBanned ? '#22c55e' : '#f97316'), borderColor: (u._id === user._id || u.role === 'admin') ? '#ccc' : (u.isBanned ? '#22c55e' : '#f97316'), borderRadius: '4px', cursor: (u._id === user._id || u.role === 'admin') ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: '500' }}
                          >
                            {u.isBanned ? 'Unban' : 'Ban'}
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(u._id)} 
                            disabled={u._id === user._id || u.role === 'admin'}
                            style={{ padding: '6px 12px', border: '1px solid #ef4444', backgroundColor: 'transparent', color: (u._id === user._id || u.role === 'admin') ? '#ccc' : '#ef4444', borderColor: (u._id === user._id || u.role === 'admin') ? '#ccc' : '#ef4444', borderRadius: '4px', cursor: (u._id === user._id || u.role === 'admin') ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: '500' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', width: '400px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#fee2e2', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px' }}>
              <i className="lucide AlertTriangle" style={{ color: '#ef4444', fontSize: '24px' }}></i>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Delete User</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px', lineHeight: '1.5' }}>
              Are you sure you want to delete this user account? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button onClick={cancelDelete} style={{ padding: '10px 20px', border: '1px solid #eaeaea', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '4px', fontWeight: '500', flex: 1 }}>Cancel</button>
              <button onClick={confirmDelete} style={{ padding: '10px 20px', border: 'none', backgroundColor: '#ef4444', color: 'white', cursor: 'pointer', borderRadius: '4px', fontWeight: '500', flex: 1 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
