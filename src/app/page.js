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
          {/* Webinar Icon */}
          <div
            style={{
              fontSize: '5rem',
              marginBottom: '1rem',
              filter: 'drop-shadow(0 0 12px rgba(249,115,22,0.4))',
            }}
          >
            📚
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '1rem',
            }}
          >
            <span
              style={{
                background:
                  'linear-gradient(135deg, #F97316, #F5B942, #C026D3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              IEEE Industry 360' Webinar Quiz
            </span>
            <br />
            <span style={{ color: 'var(--sky-mist)' }}>
              Knowledge Challenge
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'rgba(220,231,245,0.7)',
              marginBottom: '2rem',
              lineHeight: 1.7,
            }}
          >
            Test your knowledge from today's IEEE Industry 360 webinar.
            Answer 10 questions within 10 minutes. The participant with the
            highest score and fastest completion time will be selected as the
            winner.
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
                        fontSize: '1.05rem',
                        padding: '16px 36px',
                      }}
                    >
                      📖 Read Guidelines
                    </button>
                  </Link>

                  <Link href="/quiz">
                    <button
                      className="btn-fire"
                      style={{
                        fontSize: '1.05rem',
                        padding: '16px 36px',
                      }}
                    >
                      🚀 Start Quiz
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register">
                    <button
                      className="btn-primary"
                      style={{
                        fontSize: '1.05rem',
                        padding: '16px 36px',
                      }}
                    >
                      📝 Register Now
                    </button>
                  </Link>

                  <Link href="/login">
                    <button
                      className="btn-secondary"
                      style={{
                        fontSize: '1.05rem',
                        padding: '16px 36px',
                      }}
                    >
                      🔑 Login
                    </button>
                  </Link>
                </>
              )}
            </div>
          )}

          <div
            style={{
              marginTop: '3rem',
              padding: '1.5rem',
              background: 'rgba(249,115,22,0.1)',
              border: '1px solid rgba(249,115,22,0.2)',
              borderRadius: '14px',
              fontSize: '0.9rem',
              color: 'rgba(220,231,245,0.8)',
            }}
          >
            <span
              style={{
                color: 'var(--dragon-gold)',
                fontWeight: 700,
              }}
            >
              🏆 Winner's Prize:
            </span>{' '}
            Rs. 4,000 – Rs. 5,000 exclusive gift box courtesy of our valued Gift
            Partner!
          </div>
        </div>
      </div>
    </>
  );
}