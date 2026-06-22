import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Calculations
  const validOrders = orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Return Rejected');
  const totalSpent = validOrders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
  const totalOrders = orders.length;

  const statusCounts = orders.reduce((acc, o) => {
    const status = o.status || 'Processing';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const processingCount = statusCounts['Processing'] || 0;
  const shippedCount = statusCounts['Shipped'] || 0;
  const deliveredCount = statusCounts['Delivered'] || 0;
  const returnedCount = (statusCounts['Returned'] || 0) + (statusCounts['Return Requested'] || 0);
  const cancelledCount = statusCounts['Cancelled'] || 0;
  const returnRejectedCount = statusCounts['Return Rejected'] || 0;

  // Pie Chart Data
  const pieData = [
    { name: 'Processing', value: processingCount, color: '#eab308' }, // Yellow
    { name: 'Shipped', value: shippedCount, color: '#3b82f6' }, // Blue
    { name: 'Delivered', value: deliveredCount, color: '#22c55e' }, // Green
    { name: 'Returned', value: returnedCount, color: '#f97316' }, // Orange
    { name: 'Cancelled', value: cancelledCount, color: '#ef4444' }, // Red
    { name: 'Return Rejected', value: returnRejectedCount, color: '#991b1b' } // Dark Red
  ].filter(item => item.value > 0);

  // Bar Chart Data (Orders over time)
  const barData = validOrders.map(o => ({
    date: new Date(o.createdAt).toLocaleDateString(),
    amount: o.totalPrice
  })).reverse(); // Oldest to newest

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '40px 0', marginBottom: '40px' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Home / <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Dashboard</span>
        </div>
        <div style={{ fontSize: '14px' }}>
          Welcome! <span style={{ color: 'var(--primary)' }}>{user?.name || 'Guest'}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '100px', marginBottom: '140px' }}>
        
        {/* Sidebar */}
        <aside style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '24px', flexShrink: 0 }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontWeight: '500', marginBottom: '8px' }}>Manage My Account</h4>
            <Link to="/dashboard" style={{ color: 'var(--primary)', marginLeft: '16px', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/account" style={{ color: 'var(--text-secondary)', marginLeft: '16px', textDecoration: 'none' }}>My Profile</Link>
            <Link to="/change-password" style={{ color: 'var(--text-secondary)', marginLeft: '16px', textDecoration: 'none' }}>Change Password</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontWeight: '500', marginBottom: '8px' }}>My Orders</h4>
            <Link to="/orders" style={{ color: 'var(--text-secondary)', marginLeft: '16px', textDecoration: 'none' }}>Order History</Link>
            <Link to="/returns" style={{ color: 'var(--text-secondary)', marginLeft: '16px', textDecoration: 'none' }}>My Returns</Link>
            <Link to="/cancellations" style={{ color: 'var(--text-secondary)', marginLeft: '16px', textDecoration: 'none' }}>My Cancellations</Link>
          </div>
        </aside>

        {/* Dashboard Content */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '24px', fontWeight: '500', color: 'var(--primary)', marginBottom: '24px' }}>Your Dashboard</h2>
          
          {loading ? (
            <Loader type="skeleton-table" />
          ) : (
            <>
              {/* Stat Cards */}
              <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 120px', padding: '24px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Total Spent</span>
                  <span style={{ fontSize: '28px', fontWeight: '600', color: 'var(--primary)', marginTop: '8px' }}>${totalSpent.toFixed(2)}</span>
                </div>
                <div style={{ flex: '1 1 120px', padding: '24px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Processing</span>
                  <span style={{ fontSize: '28px', fontWeight: '600', color: '#eab308', marginTop: '8px' }}>{processingCount}</span>
                </div>
                <div style={{ flex: '1 1 120px', padding: '24px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Shipped</span>
                  <span style={{ fontSize: '28px', fontWeight: '600', color: '#3b82f6', marginTop: '8px' }}>{shippedCount}</span>
                </div>
                <div style={{ flex: '1 1 120px', padding: '24px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Delivered</span>
                  <span style={{ fontSize: '28px', fontWeight: '600', color: '#22c55e', marginTop: '8px' }}>{deliveredCount}</span>
                </div>
                <div style={{ flex: '1 1 120px', padding: '24px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Returned</span>
                  <span style={{ fontSize: '28px', fontWeight: '600', color: '#f97316', marginTop: '8px' }}>{returnedCount}</span>
                </div>
                <div style={{ flex: '1 1 120px', padding: '24px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Cancelled</span>
                  <span style={{ fontSize: '28px', fontWeight: '600', color: '#ef4444', marginTop: '8px' }}>{cancelledCount}</span>
                </div>
                <div style={{ flex: '1 1 120px', padding: '24px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.2' }}>Return Rejected</span>
                  <span style={{ fontSize: '28px', fontWeight: '600', color: '#991b1b', marginTop: '8px' }}>{returnRejectedCount}</span>
                </div>
              </div>

              {/* Charts Section */}
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                {/* Pie Chart */}
                {totalOrders > 0 && (
                  <div style={{ flex: 1, minWidth: '300px', backgroundColor: '#fff', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px', textAlign: 'center' }}>Orders by Status</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={pieData.length === 1 ? 0 : 5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '16px' }}>
                      {pieData.map((entry, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                          <span style={{ width: '12px', height: '12px', backgroundColor: entry.color, borderRadius: '50%' }}></span>
                          {entry.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bar Chart */}
                {barData.length > 0 && (
                  <div style={{ flex: 2, minWidth: '400px', backgroundColor: '#fff', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px' }}>Spending Over Time</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" tick={{fontSize: 12}} />
                        <YAxis tick={{fontSize: 12}} />
                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                        <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
