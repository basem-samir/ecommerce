import React, { useState } from 'react';
import { Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--black)', color: 'var(--white)', paddingTop: '80px', paddingBottom: '24px', marginTop: 'auto' }}>
      <div className="container footer-grid">

        {/* Support */}
        <div>
          <h4 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '24px' }}>Support</h4>
          <p style={{ marginBottom: '16px', fontSize: '16px', lineHeight: '24px' }}>111 Bijoy sarani, Dhaka,<br />DH 1515, Bangladesh.</p>
          <p style={{ marginBottom: '16px', fontSize: '16px' }}>exclusive@gmail.com</p>
          <p style={{ fontSize: '16px' }}>+88015-88888-9999</p>
        </div>

        {/* Account */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '8px' }}>Account</h4>
          <a href="/account">My Account</a>
          <a href="/login">Login / Register</a>
          <a href="/cart">Cart</a>
          <a href="/wishlist">Wishlist</a>
          <a href="/products">Shop</a>
        </div>

        {/* Quick Link */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '8px' }}>Quick Link</h4>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms Of Use</a>
          <a href="#">FAQ</a>
          <a href="/contact">Contact</a>
        </div>

        {/* Download App */}
        <div>
          <h4 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '24px' }}>Download App</h4>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Save $3 with App New User Only</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://github.com" alt="QR Code" style={{ width: '80px', height: '80px', backgroundColor: 'var(--white)', padding: '4px', borderRadius: '4px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
              <a href="#" style={{ display: 'block', height: '36px' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" style={{ height: '100%', objectFit: 'contain' }} />
              </a>
              <a href="#" style={{ display: 'block', height: '36px' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" style={{ height: '100%', objectFit: 'contain' }} />
              </a>
            </div>
          </div>
        </div>

      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>
        &copy; Copyright Rimel 2022. All right reserved
      </div>
    </footer>
  );
};

export default Footer;
