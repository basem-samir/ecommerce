import React, { useState } from 'react';
import { Phone, Mail } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Name, Email, and Message are required!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        showToast('Message sent successfully!');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to send message');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while sending the message');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container">
      <div style={{ padding: '40px 0', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '40px' }}>
        Home / <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Contact</span>
      </div>

      <div style={{ display: 'flex', gap: '30px', marginBottom: '140px' }}>
        
        {/* Info Panel */}
        <div style={{ width: '340px', padding: '40px', boxShadow: '0px 1px 13px rgba(0, 0, 0, 0.05)', borderRadius: '4px' }}>
          
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '32px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary)', color: 'var(--white)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Phone size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '500' }}>Call To Us</h3>
            </div>
            <p style={{ fontSize: '14px', marginBottom: '16px' }}>We are available 24/7, 7 days a week.</p>
            <p style={{ fontSize: '14px' }}>Phone: +8801611112222</p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary)', color: 'var(--white)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Mail size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '500' }}>Write To US</h3>
            </div>
            <p style={{ fontSize: '14px', marginBottom: '16px' }}>Fill out our form and we will contact you within 24 hours.</p>
            <p style={{ fontSize: '14px', marginBottom: '16px' }}>Emails: customer@exclusive.com</p>
            <p style={{ fontSize: '14px' }}>Emails: support@exclusive.com</p>
          </div>

        </div>

        {/* Contact Form */}
        <div style={{ flex: 1, padding: '40px', boxShadow: '0px 1px 13px rgba(0, 0, 0, 0.05)', borderRadius: '4px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px', height: '100%' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <input required type="text" placeholder="Your Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ backgroundColor: 'var(--secondary)' }} />
              <input required type="email" placeholder="Your Email *" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ backgroundColor: 'var(--secondary)' }} />
              <input type="tel" placeholder="Your Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ backgroundColor: 'var(--secondary)' }} />
            </div>
            <textarea required placeholder="Your Message" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} style={{ flex: 1, backgroundColor: 'var(--secondary)', resize: 'none' }}></textarea>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
              <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '16px 48px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Contact;
