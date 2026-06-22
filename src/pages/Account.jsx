import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Account = () => {
  const { user } = useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.name?.split(' ')[0] || '');
      setLastName(user.name?.split(' ')[1] || '');
      setEmail(user.email || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          address
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Profile updated successfully!');
        // Update local storage and context
        localStorage.setItem('userInfo', JSON.stringify(data));
        window.location.reload(); // Quick refresh to update context
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
          Home / <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>My Account</span>
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
            <Link to="/account" style={{ color: 'var(--primary)', marginLeft: '16px', textDecoration: 'none' }}>My Profile</Link>
            <Link to="/change-password" style={{ color: 'var(--text-secondary)', marginLeft: '16px', textDecoration: 'none' }}>Change Password</Link>
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
          <h2 style={{ fontSize: '20px', fontWeight: '500', color: 'var(--primary)', marginBottom: '16px' }}>Edit Your Profile</h2>
          
          {message && <div style={{ marginBottom: '16px', color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}

          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ display: 'flex', gap: '40px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label>First Name</label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} style={{ backgroundColor: 'var(--secondary)' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label>Last Name</label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} style={{ backgroundColor: 'var(--secondary)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '40px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ backgroundColor: 'var(--secondary)' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label>Address</label>
                <input type="text" placeholder="Your Address" value={address} onChange={e => setAddress(e.target.value)} style={{ backgroundColor: 'var(--secondary)' }} />
              </div>
            </div>

            {/* Password changes moved to separate page */}

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '32px', marginTop: '8px' }}>
              <span style={{ cursor: 'pointer' }}>Cancel</span>
              <button type="submit" className="btn-primary" style={{ padding: '16px 48px' }}>Save Changes</button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Account;
