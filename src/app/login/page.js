'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DragonBackground from '@/components/DragonBackground';
import Navbar from '@/components/Navbar';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.user.is_admin) {
        router.push('/admin');
      } else {
        router.push('/instructions');
      }
      router.refresh();
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
        <div className="glass-card" style={{ maxWidth: 440, width: '100%', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div className="dragon-icon">🔑</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              <span className="fire-text">Welcome Back</span>
            </h1>
            <p style={{ color: 'rgba(220,231,245,0.6)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Login to continue your quest
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
            ⚠️ Please login with the <strong>same name and email</strong> you used to register for the giveaway of the webinar.
          </div>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input id="login-email" className="input-field" type="email" placeholder="your.email@example.com" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input id="login-password" className="input-field" type="password" placeholder="Enter your password" required
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <button id="login-submit" type="submit" className="btn-fire" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? '🔄 Logging in...' : 'Login'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'rgba(220,231,245,0.6)' }}>
            Don&apos;t have an account? <Link href="/register" style={{ color: 'var(--main-purple)', textDecoration: 'none', fontWeight: 600 }}>Register here</Link>
          </p>
        </div>
      </div>
    </>
  );
}
