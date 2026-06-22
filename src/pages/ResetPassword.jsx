import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setAuthData } = useContext(AuthContext);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/resetpassword/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess('Password reset successfully! Redirecting...');
        // Optionally auto-login the user:
        // localStorage.setItem('token', data.token);
        // fetch me... (for simplicity, we'll just redirect to login)
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Error resetting password');
      }
    } catch (err) {
      setError('An error occurred while resetting password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', gap: '120px', marginTop: '60px', marginBottom: '140px', justifyContent: 'center' }}>
      
      {/* Side Image */}
      <div className="hide-on-mobile" style={{ flex: 1.2, backgroundColor: '#CBE4E8', height: '780px', display: 'flex', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1000" alt="Reset Password" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', maxWidth: '400px' }}>
        
        <h1 style={{ fontSize: '36px', fontWeight: '500', marginBottom: '24px', fontFamily: 'var(--font-inter)' }}>
          Set New Password
        </h1>
        <p style={{ marginBottom: '48px', color: 'var(--black)' }}>
          Please enter your new password below.
        </p>
        
        {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
        {success && <div style={{ color: 'var(--primary)', marginBottom: '16px' }}>{success}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px', width: '100%' }}>
          
          <input 
            type="password" 
            placeholder="New Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ borderBottom: '1px solid var(--black)', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0', backgroundColor: 'transparent', padding: '8px 0' }} 
            required
          />

          <input 
            type="password" 
            placeholder="Confirm New Password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ borderBottom: '1px solid var(--black)', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0', backgroundColor: 'transparent', padding: '8px 0' }} 
            required
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            <button type="submit" disabled={isLoading} className="btn-primary" style={{ padding: '16px 48px', width: '100%', opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default ResetPassword;
