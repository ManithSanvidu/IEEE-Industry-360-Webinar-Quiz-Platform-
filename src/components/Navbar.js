/* eslint-disable react/no-unescaped-entities */
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.user) setUser(d.user); }).catch(() => { });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="navbar" style={{ justifyContent: 'flex-end' }}>
      <button 
        className="mobile-menu-btn" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? '✖' : '☰'}
      </button>
      <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {user ? (
          <>
            <Link href="/instructions" onClick={closeMenu}>📜 Guidelines</Link>
            {user.is_admin && <Link href="/leaderboard" onClick={closeMenu}>🏆 Leaderboard</Link>}
            {user.is_admin && <Link href="/admin" onClick={closeMenu}>⚡ Admin</Link>}
            <span style={{ color: 'var(--dragon-gold)', fontSize: '0.85rem' }}>Hi, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : null}
      </div>
    </nav>
  );
}
