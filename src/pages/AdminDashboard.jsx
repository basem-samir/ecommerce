import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import Loader from '../components/Loader';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/stats`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchAdminStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container mobile-stack" style={{ padding: '40px 0', minHeight: '60vh', display: 'flex', gap: '48px' }}>
        <AdminSidebar />
        <div style={{ flex: 1 }}><Loader type="skeleton-table" /></div>
      </div>
    );
  }

  // Formatting Pie Chart
  const pieData = [
    { name: 'Processing', value: stats.statusCounts['Processing'] || 0, color: '#eab308' },
    { name: 'Shipped', value: stats.statusCounts['Shipped'] || 0, color: '#3b82f6' },
    { name: 'Delivered', value: stats.statusCounts['Delivered'] || 0, color: '#22c55e' },
    { name: 'Returned', value: (stats.statusCounts['Returned'] || 0) + (stats.statusCounts['Return Requested'] || 0), color: '#f97316' },
    { name: 'Cancelled', value: stats.statusCounts['Cancelled'] || 0, color: '#ef4444' },
    { name: 'Return Rejected', value: stats.statusCounts['Return Rejected'] || 0, color: '#991b1b' }
  ].filter(item => item.value > 0);

  return (
    <div className="container mobile-stack" style={{ padding: '40px 0', minHeight: '60vh', display: 'flex', gap: '48px' }}>
      <AdminSidebar />
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>Platform Analytics</h2>
        
        {/* Top Cards */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px', padding: '24px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Total Revenue</span>
            <span style={{ fontSize: '32px', fontWeight: '600', color: '#22c55e', marginTop: '8px' }}>${stats.totalRevenue?.toFixed(2)}</span>
          </div>
          <div style={{ flex: '1 1 200px', padding: '24px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Total Orders</span>
            <span style={{ fontSize: '32px', fontWeight: '600', color: 'var(--primary)', marginTop: '8px' }}>{stats.totalOrders}</span>
          </div>
          <div style={{ flex: '1 1 200px', padding: '24px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Total Users</span>
            <span style={{ fontSize: '32px', fontWeight: '600', color: '#3b82f6', marginTop: '8px' }}>{stats.totalUsers}</span>
          </div>
          <div style={{ flex: '1 1 200px', padding: '24px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Total Products</span>
            <span style={{ fontSize: '32px', fontWeight: '600', color: '#f97316', marginTop: '8px' }}>{stats.totalProducts}</span>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          {/* Revenue Over Time */}
          {stats.revenueTimeline && stats.revenueTimeline.length > 0 && (
            <div style={{ flex: 2, minWidth: '400px', backgroundColor: '#fff', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '24px' }}>Revenue Timeline</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.revenueTimeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
                    tick={{fontSize: 12}} 
                  />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip 
                    formatter={(value) => `$${Number(value).toFixed(2)}`}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Status Breakdown */}
          {pieData.length > 0 && (
            <div style={{ flex: 1, minWidth: '300px', backgroundColor: '#fff', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '24px', textAlign: 'center' }}>Global Order Statuses</h3>
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
