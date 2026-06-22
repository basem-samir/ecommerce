import React from 'react';

const NotFound = () => {
  return (
    <div className="container" style={{ paddingBottom: '140px' }}>
      <div style={{ padding: '40px 0', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '80px' }}>
        Home / <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>404 Error</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '40px' }}>
        <h1 className="heading-large">404 Not Found</h1>
        <p style={{ fontSize: '16px' }}>Your visited page not found. You may go home page.</p>
        <button className="btn-primary" style={{ marginTop: '40px' }}>Back to home page</button>
      </div>
    </div>
  );
};

export default NotFound;
