/* eslint-disable react/no-unescaped-entities */
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import logo from '../../public/image1.png';

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
      <Link href="/" className="navbar-brand" style={{ display: 'inline-block', overflow: 'hidden', height: '60px', width: '180px' }}>
        <img src={logo.src} alt="Image 1" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.5)' }} />
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
