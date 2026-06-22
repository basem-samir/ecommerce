import React from 'react';

const TopBar = () => {
  return (
    <div style={{ backgroundColor: 'var(--black)', color: 'var(--white)', padding: '12px 0', fontSize: '14px' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!</span>
          <a href="#" style={{ fontWeight: '600', textDecoration: 'underline' }}>ShopNow</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <span>English</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
