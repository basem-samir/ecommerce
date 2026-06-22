import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { Trash2 } from 'lucide-react';
import Loader from '../components/Loader';

const AdminCoupons = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountPercent: '',
    expiryDate: '',
    isActive: true
  });
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    } else {
      fetchCoupons();
    }
  }, [user, navigate]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/coupons`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCoupons(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchCoupons();
        setShowModal(false);
        setFormData({ code: '', discountPercent: '', expiryDate: '', isActive: true });
        showToast('Coupon created successfully!');
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/coupons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        fetchCoupons();
        showToast('Coupon deleted!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mobile-stack" style={{ padding: '40px 0', minHeight: '60vh', display: 'flex', gap: '48px' }}>
      <AdminSidebar />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Coupon Management</h2>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Search coupons..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              style={{ padding: '8px 16px', border: '1px solid #eaeaea', borderRadius: '4px', width: '250px' }} 
            />
            <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}>+ Add Coupon</button>
          </div>
        </div>

        {loading ? <Loader type="skeleton-table" /> : (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #eaeaea' }}>
                <tr>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>CODE</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>DISCOUNT</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>STATUS</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>EXPIRY</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {coupons.filter(coupon => 
                  (coupon.code || '').toLowerCase().includes(searchTerm.toLowerCase())
                ).map(coupon => (
                  <tr key={coupon._id} style={{ borderBottom: '1px solid #eaeaea' }}>
                    <td style={{ padding: '16px 24px', fontWeight: '600' }}>{coupon.code}</td>
                    <td style={{ padding: '16px 24px' }}>{coupon.discountPercent}%</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', backgroundColor: coupon.isActive ? '#dcfce7' : '#fee2e2', color: coupon.isActive ? '#166534' : '#991b1b' }}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>{coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Never'}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <button onClick={() => handleDelete(coupon._id)} style={{ color: '#ef4444', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>No coupons found. Create one!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', width: '400px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Add New Coupon</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Coupon Code</label>
                <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="e.g. WELCOME10" style={{ padding: '10px', border: '1px solid #eaeaea', borderRadius: '4px', width: '100%', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Discount Percentage (%)</label>
                <input required type="number" min="1" max="100" value={formData.discountPercent} onChange={e => setFormData({...formData, discountPercent: e.target.value})} style={{ padding: '10px', border: '1px solid #eaeaea', borderRadius: '4px', width: '100%', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Expiry Date (Optional)</label>
                <input type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} style={{ padding: '10px', border: '1px solid #eaeaea', borderRadius: '4px', width: '100%', marginTop: '4px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', border: '1px solid #eaeaea', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '4px', fontWeight: '500' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', cursor: 'pointer', borderRadius: '4px', fontWeight: '500' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
