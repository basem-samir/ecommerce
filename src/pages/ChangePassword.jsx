import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ChangePassword = () => {
  const { user } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New passwords don't match!");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          currentPassword,
          password: newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage(data.message || 'Update failed');
      }
    } catch (error) {
      setMessage('Server error');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '40px 0', marginBottom: '40px' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Home / <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Change Password</span>
        </div>
        <div style={{ fontSize: '14px' }}>
          Welcome! <span style={{ color: 'var(--primary)' }}>{user?.name || 'Guest'}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '100px', marginBottom: '140px' }}>
        
        {/* Sidebar */}
        <aside style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontWeight: '500', marginBottom: '8px' }}>Manage My Account</h4>
            <Link to="/dashboard" style={{ color: 'var(--text-secondary)', marginLeft: '16px', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/account" style={{ color: 'var(--text-secondary)', marginLeft: '16px', textDecoration: 'none' }}>My Profile</Link>
            <Link to="/change-password" style={{ color: 'var(--primary)', marginLeft: '16px', textDecoration: 'none' }}>Change Password</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontWeight: '500', marginBottom: '8px' }}>My Orders</h4>
            <Link to="/orders" style={{ color: 'var(--text-secondary)', marginLeft: '16px', textDecoration: 'none' }}>Order History</Link>
            <Link to="/returns" style={{ color: 'var(--text-secondary)', marginLeft: '16px', textDecoration: 'none' }}>My Returns</Link>
            <Link to="/cancellations" style={{ color: 'var(--text-secondary)', marginLeft: '16px', textDecoration: 'none' }}>My Cancellations</Link>
          </div>



        </aside>

        {/* Edit Profile Form */}
        <div style={{ flex: 1, padding: '40px 80px', boxShadow: '0px 1px 13px rgba(0, 0, 0, 0.05)', borderRadius: '4px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '500', color: 'var(--primary)', marginBottom: '16px' }}>Change Password</h2>
          
          {message && <div style={{ marginBottom: '16px', color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}

          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={{ backgroundColor: 'var(--secondary)', padding: '16px', border: 'none', borderRadius: '4px' }} required />
              <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ backgroundColor: 'var(--secondary)', padding: '16px', border: 'none', borderRadius: '4px' }} required />
              <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ backgroundColor: 'var(--secondary)', padding: '16px', border: 'none', borderRadius: '4px' }} required />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '32px', marginTop: '8px' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => { setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setMessage(''); }}>Cancel</span>
              <button type="submit" className="btn-primary" style={{ padding: '16px 48px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Changes</button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default ChangePassword;
