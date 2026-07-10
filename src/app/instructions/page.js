'use client';
import Link from 'next/link';
import DragonBackground from '@/components/DragonBackground';
import Navbar from '@/components/Navbar';

export default function Instructions() {
  return (
    <>
      <DragonBackground />
      <Navbar />
      <div className="instructions-container" style={{ zIndex: 1, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="dragon-icon" style={{ fontSize: '3.5rem' }}>📜</div>
          <h1 className="section-title" style={{ fontSize: '2.2rem' }}>Quiz Guidelines</h1>
          <p style={{ color: 'rgba(220,231,245,0.6)' }}>Everything you need to know before you play</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {/* Box 1 */}
          <div className="glass-card" style={{ flex: '1 1 280px', padding: '1.5rem', textAlign: 'center', maxWidth: '400px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
            <h3 style={{ color: 'var(--dragon-gold)', marginBottom: '0.5rem', fontSize: '1.2rem', textTransform: 'uppercase' }}>Quiz Format</h3>
            <p style={{ color: 'rgba(220,231,245,0.7)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              10 questions in 10 mins. No negative marking.
            </p>
          </div>
          
          {/* Box 2 */}
          <div className="glass-card" style={{ flex: '1 1 280px', padding: '1.5rem', textAlign: 'center', maxWidth: '400px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📌</div>
            <h3 style={{ color: 'var(--dragon-gold)', marginBottom: '0.5rem', fontSize: '1.2rem', textTransform: 'uppercase' }}>Strict Rules</h3>
            <p style={{ color: 'rgba(220,231,245,0.7)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              No search engines allowed. Independent attempts only.
            </p>
          </div>
        </div>
        
        {/* Box 3 - Centered beneath */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', maxWidth: '400px', width: '100%', background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(245,185,66,0.1))' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏆</div>
            <h3 style={{ color: 'var(--dragon-gold)', marginBottom: '0.5rem', fontSize: '1.2rem', textTransform: 'uppercase' }}>Winner's Prize</h3>
            <p style={{ color: 'rgba(220,231,245,0.7)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Fastest perfect score wins an exclusive gift box!
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/quiz">
            <button className="btn-fire" style={{ fontSize: '1.15rem', padding: '16px 48px', borderRadius: '50px' }}>
              🔥 Start Quiz Now
            </button>
          </Link>
          <p style={{ marginTop: '1.2rem', fontSize: '0.85rem', color: 'rgba(220,231,245,0.5)' }}>
            Best of luck! Listen carefully and think quickly.
          </p>
        </div>
      </div>
    </>
  );
}
