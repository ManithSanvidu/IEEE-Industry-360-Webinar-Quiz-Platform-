'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DragonBackground from '@/components/DragonBackground';
import Navbar from '@/components/Navbar';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', isAdminRequest: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(data.message);
      if (form.isAdminRequest) {
        setTimeout(() => router.push('/login'), 1500);
      } else {
        setTimeout(() => router.push('/instructions'), 1500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DragonBackground />
      <Navbar />
      <div className="page-container">
        <div className="glass-card" style={{ maxWidth: 460, width: '100%', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div className="dragon-icon">📝</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              <span className="fire-text">Participant Details</span>
            </h1>
            <p style={{ color: 'rgba(220,231,245,0.6)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Enter your name and email to play the quiz
            </p>
          </div>

          <div style={{
            background: 'rgba(249,115,22,0.1)',
            border: '1px solid rgba(249,115,22,0.25)',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            color: 'var(--dragon-gold)'
          }}>
            ⚠️ Please register with the <strong>same email</strong> you used to register for the webinar.
          </div>

          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input id="register-name" className="input-field" type="text" placeholder="Enter your full name" required
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input id="register-email" className="input-field" type="email" placeholder="your.email@example.com" required
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <input 
                type="checkbox" 
                id="admin-request" 
                checked={form.isAdminRequest} 
                onChange={e => setForm({...form, isAdminRequest: e.target.checked})} 
              />
              <label htmlFor="admin-request" style={{ color: 'rgba(220,231,245,0.8)', fontSize: '0.9rem', cursor: 'pointer' }}>
                Register as Admin
              </label>
            </div>

            {form.isAdminRequest && (
              <div className="form-group">
                <label className="form-label">Password</label>
                <input id="register-password" className="input-field" type="password" placeholder="Enter password for admin access" required
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
            )}

            <button id="register-submit" type="submit" className="btn-fire" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? '🔄 Preparing...' : (form.isAdminRequest ? 'Register Admin' : 'Play Now')}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
