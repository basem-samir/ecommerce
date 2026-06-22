import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [error, setError] = useState('');
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isForgotPassword) {
      setIsLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/forgotpassword`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (res.ok) {
          setResetEmailSent(true);
        } else {
          setError(data.message || 'Error sending reset email');
        }
      } catch (err) {
        setError('An error occurred');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    let res;
    if (isLogin) {
      res = await login(email, password);
    } else {
      res = await register(name, email, password);
    }

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', gap: '120px', marginTop: '60px', marginBottom: '140px', justifyContent: 'center' }}>
      
      {/* Side Image */}
      <div className="hide-on-mobile" style={{ flex: 1.2, backgroundColor: '#CBE4E8', height: '780px', display: 'flex', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1000" alt="Login" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', maxWidth: '400px' }}>
        
        {/* Toggle Buttons */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', borderBottom: '2px solid #eaeaea' }}>
          {!isForgotPassword ? (
            <>
              <button 
                onClick={() => { setIsLogin(true); setError(''); }}
                style={{ 
                  padding: '12px 0', 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  backgroundColor: 'transparent', 
                  border: 'none', 
                  borderBottom: isLogin ? '2px solid var(--primary)' : '2px solid transparent', 
                  color: isLogin ? 'var(--black)' : 'var(--text-secondary)', 
                  cursor: 'pointer', 
                  marginBottom: '-2px', 
                  transition: 'all 0.2s ease' 
                }}
              >
                Log In
              </button>
              <button 
                onClick={() => { setIsLogin(false); setError(''); }}
                style={{ 
                  padding: '12px 0', 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  backgroundColor: 'transparent', 
                  border: 'none', 
                  borderBottom: !isLogin ? '2px solid var(--primary)' : '2px solid transparent', 
                  color: !isLogin ? 'var(--black)' : 'var(--text-secondary)', 
                  cursor: 'pointer', 
                  marginBottom: '-2px', 
                  transition: 'all 0.2s ease' 
                }}
              >
                Create Account
              </button>
            </>
          ) : (
            <button 
              onClick={() => { setIsForgotPassword(false); setError(''); setResetEmailSent(false); }}
              style={{ 
                padding: '12px 0', 
                fontSize: '18px', 
                fontWeight: '600', 
                backgroundColor: 'transparent', 
                border: 'none', 
                color: 'var(--text-secondary)', 
                cursor: 'pointer', 
                marginBottom: '-2px', 
                transition: 'all 0.2s ease' 
              }}
            >
              &larr; Back to Login
            </button>
          )}
        </div>

        <h1 style={{ fontSize: '36px', fontWeight: '500', marginBottom: '24px', fontFamily: 'var(--font-inter)' }}>
          {isForgotPassword ? 'Reset Password' : isLogin ? 'Log in to Exclusive' : 'Create an account'}
        </h1>
        <p style={{ marginBottom: '48px', color: 'var(--black)' }}>
          {isForgotPassword 
            ? resetEmailSent ? 'Check your email for the reset link!' : 'Enter your email to receive a password reset link.' 
            : isLogin ? 'Enter your details below' : 'Enter your details below to create an account'}
        </p>
        
        {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}

        {!resetEmailSent && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px', width: '100%' }}>
            {!isLogin && !isForgotPassword && (
              <input 
                type="text" 
                placeholder="Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ borderBottom: '1px solid var(--black)', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0', backgroundColor: 'transparent', padding: '8px 0' }} 
                required
              />
            )}
            
            <input 
              type="text" 
              placeholder={isForgotPassword ? "Email address" : "Email or Phone Number"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderBottom: '1px solid var(--black)', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0', backgroundColor: 'transparent', padding: '8px 0' }} 
              required
            />

            {!isForgotPassword && (
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ borderBottom: '1px solid var(--black)', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0', backgroundColor: 'transparent', padding: '8px 0' }} 
                required
              />
            )}
            
            {isForgotPassword ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                <button type="submit" disabled={isLoading} className="btn-primary" style={{ padding: '16px 48px', width: '100%', opacity: isLoading ? 0.7 : 1 }}>
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            ) : isLogin ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <button type="submit" className="btn-primary" style={{ padding: '16px 48px' }}>Log In</button>
                <button type="button" onClick={() => { setIsForgotPassword(true); setError(''); }} style={{ color: 'var(--primary)', fontWeight: '400', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>Forget Password?</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                <button type="submit" className="btn-primary" style={{ padding: '16px 48px', width: '100%' }}>Create Account</button>
              </div>
            )}
          </form>
        )}
      </div>

    </div>
  );
};

export default AuthPage;
