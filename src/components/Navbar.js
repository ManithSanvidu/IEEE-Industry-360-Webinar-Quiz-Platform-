/* eslint-disable react/no-unescaped-entities */
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.user) setUser(d.user); }).catch(() => { });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        <img src="/image1.png" alt="Industry 360 Logo" style={{ height: '40px', objectFit: 'contain' }} />
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            <Link href="/instructions">📜 Guidelines</Link>
            {user.is_admin && <Link href="/leaderboard">🏆 Leaderboard</Link>}
            {user.is_admin && <Link href="/admin">⚡ Admin</Link>}
            <span style={{ color: 'var(--dragon-gold)', fontSize: '0.85rem' }}>Hi, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : null}
      </div>
    </nav>
  );
}
