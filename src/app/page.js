'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DragonBackground from '@/components/DragonBackground';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => { if (d.user) setUser(d.user); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <DragonBackground />
      <Navbar />
      <div className="page-container" style={{ paddingTop: '100px' }}>
        <div style={{ textAlign: 'center', maxWidth: 700, zIndex: 1, position: 'relative' }}>
          <div className="dragon-icon" style={{ fontSize: '5rem', marginBottom: '1rem' }}>🐉</div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1rem'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #F97316, #F5B942, #C026D3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Dragon Quest</span>
            <br />
            <span style={{ color: 'var(--sky-mist)' }}>Webinar Quiz</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'rgba(220,231,245,0.7)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Test your knowledge from today&apos;s webinar session. Answer 10 questions in 10 minutes.
            The fastest and most accurate participant wins the dragon&apos;s treasure! 🔥
          </p>

          <div className="info-grid" style={{ marginBottom: '2.5rem' }}>
            <div className="info-card">
              <div className="info-value">10</div>
              <div className="info-label">Total Questions</div>
            </div>
            <div className="info-card">
              <div className="info-value">10</div>
              <div className="info-label">Minutes Duration</div>
            </div>
            <div className="info-card">
              <div className="info-value">1</div>
              <div className="info-label">Lucky Winner</div>
            </div>
          </div>

          {!loading && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {user ? (
                <>
                  <Link href="/instructions">
                    <button className="btn-secondary" style={{ fontSize: '1.05rem', padding: '16px 36px' }}>
                      📜 Read Guidelines
                    </button>
                  </Link>
                  <Link href="/quiz">
                    <button className="btn-fire" style={{ fontSize: '1.05rem', padding: '16px 36px' }}>
                      🔥 Start Quiz
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register">
                    <button className="btn-primary" style={{ fontSize: '1.05rem', padding: '16px 36px' }}>
                      📝 Register Now
                    </button>
                  </Link>
                  <Link href="/login">
                    <button className="btn-secondary" style={{ fontSize: '1.05rem', padding: '16px 36px' }}>
                      🔑 Login
                    </button>
                  </Link>
                </>
              )}
            </div>
          )}

          <div style={{
            marginTop: '3rem',
            padding: '1.5rem',
            background: 'rgba(249,115,22,0.1)',
            border: '1px solid rgba(249,115,22,0.2)',
            borderRadius: '14px',
            fontSize: '0.9rem',
            color: 'rgba(220,231,245,0.8)'
          }}>
            <span style={{ color: 'var(--dragon-gold)', fontWeight: 700 }}>🏆 Winner&apos;s Prize:</span> Rs. 4,000 – Rs.5,000 exclusive gift box courtesy of our valued Gift Partner!
          </div>
        </div>
      </div>
    </>
  );
}
