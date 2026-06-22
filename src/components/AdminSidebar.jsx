import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Analytics', path: '/admin/dashboard' },
    { name: 'Orders', path: '/admin/orders' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Categories', path: '/admin/categories' },
    { name: 'Coupons', path: '/admin/coupons' },
    { name: 'Users', path: '/admin/users' },
  ];

  return (
    <aside className="admin-sidebar">
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--black)', marginBottom: '16px' }}>Admin Dashboard</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {navItems.map(item => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link 
              key={item.name} 
              to={item.path} 
              style={{ 
                color: isActive ? 'white' : 'var(--text-secondary)', 
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                padding: '12px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.2s ease',
              }}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default AdminSidebar;
