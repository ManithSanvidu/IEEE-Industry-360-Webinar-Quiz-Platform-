/* eslint-disable react/no-unescaped-entities */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DragonBackground from '@/components/DragonBackground';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <DragonBackground />
      <Navbar />

      <div className="page-container" style={{ paddingTop: '100px' }}>
        <div
          style={{
            textAlign: 'center',
            maxWidth: 700,
            zIndex: 1,
            position: 'relative',
          }}
        >
          {/* Pill Badge */}
          <div
            style={{
              display: 'inline-block',
              border: '1px solid rgba(245, 192, 91, 0.3)',
              background: 'rgba(245, 192, 91, 0.05)',
              padding: '6px 16px',
              borderRadius: '20px',
              color: 'var(--dragon-gold)',
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >
            ✧ Industry 360 Live ✧
          </div>

          <h1
            style={{
              fontSize: 'clamp(3rem, 7vw, 4.5rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-sans)',
              textTransform: 'uppercase',
              letterSpacing: '-1px'
            }}
          >
            <span style={{ color: '#FFFFFF', display: 'block', marginBottom: '0.2rem' }}>
              IEEE Industry 360'
            </span>
            <span style={{ color: '#FFFFFF', display: 'block', fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '0.5rem' }}>
              Webinar Quiz
            </span>
            <span
              style={{
                background: 'linear-gradient(to right, var(--fire-orange), var(--dragon-gold))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'block'
              }}
            >
              Knowledge Challenge
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              color: 'rgba(226,232,240,0.8)',
              marginBottom: '2.5rem',
              lineHeight: 1.6,
              maxWidth: '600px',
              margin: '0 auto 2.5rem auto',
            }}
          >
            Test your knowledge from today's IEEE Industry 360 webinar.
            Answer 10 questions within 10 minutes. The participant with the
            highest score and fastest completion time will be selected as the winner.
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
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {user ? (
                <>
                  <Link href="/instructions">
                    <button
                      className="btn-secondary"
                      style={{
                        padding: '16px 40px',
                        fontSize: '1.05rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>📖</span> Read Guidelines
                    </button>
                  </Link>

                  <Link href="/quiz">
                    <button
                      className="btn-fire"
                      style={{
                        padding: '16px 40px',
                        fontSize: '1.05rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>🚀</span> Start Quiz
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register">
                    <button
                      className="btn-fire"
                      style={{
                        padding: '16px 40px',
                        fontSize: '1.05rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>🚀</span> Play Now
                    </button>
                  </Link>

                  <Link href="/login">
                    <button
                      className="btn-secondary"
                      style={{
                        padding: '16px 40px',
                        fontSize: '1.05rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>⚙️</span> Admin Login
                    </button>
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Divider pattern similar to the image (optional subtlety) */}
          <div style={{ marginTop: '3rem', opacity: 0.3, display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem', color: 'var(--dragon-gold)' }}>♦</span>
            <span style={{ fontSize: '1.5rem', color: 'var(--dragon-gold)' }}>♦</span>
            <span style={{ fontSize: '1.5rem', color: 'var(--dragon-gold)' }}>♦</span>
          </div>

          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              fontSize: '0.9rem',
              color: 'rgba(226,232,240,0.6)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            <span style={{ color: 'var(--dragon-gold)', fontWeight: 700 }}>🏆 Winner's Prize:</span>{' '}
            Rs. 4,000 – Rs. 5,000 exclusive gift box courtesy of our valued Gift Partner!
          </div>

          {/* QR Code Section */}
          <div
            style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              display: 'inline-block',
            }}
          >
            <p style={{ color: 'var(--dragon-gold)', fontWeight: 'bold', marginBottom: '1rem', fontSize: '1.1rem' }}>
              📱 Scan to Play on Mobile
            </p>
            <div style={{ background: 'white', padding: '10px', borderRadius: '8px', display: 'inline-block' }}>
              {/* Using a free QR Code generation API */}
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://ieee-industry-360-webinar.vercel.app/" 
                alt="QR Code for Quiz" 
                style={{ display: 'block', width: '160px', height: '160px' }} 
              />
            </div>
            <p style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: 'rgba(220,231,245,0.6)' }}>
              ieee-industry-360-webinar.vercel.app
            </p>
          </div>
        </div>
      </div>
    </>
  );
}