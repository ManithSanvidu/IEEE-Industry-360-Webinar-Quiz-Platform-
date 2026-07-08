'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DragonBackground from '@/components/DragonBackground';
import Navbar from '@/components/Navbar';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const authRes = await fetch('/api/auth/me');
        const authData = await authRes.json();
        if (!authData.user) { router.push('/login'); return; }
        if (!authData.user.is_admin) { router.push('/'); return; }
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        if (data.leaderboard) setLeaderboard(data.leaderboard);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [router]);

  const formatTime = (s) => {
    if (!s) return '--';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const getRankEmoji = (i) => ['🥇', '🥈', '🥉'][i] || `#${i + 1}`;

  return (
    <>
      <DragonBackground />
      <Navbar />
      <div className="page-container" style={{ paddingTop: '100px' }}>
        <div className="leaderboard-card" style={{ zIndex: 1 }}>
          <div className="leaderboard-header">
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏆</div>
            <h2>IEEE Industry 360 Webinar Leaderboard</h2>
            <p style={{ color: 'rgba(220,231,245,0.5)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Top warriors of the quiz realm</p>
          </div>
          <div style={{ padding: '1.5rem' }}>
            {loading ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'rgba(220,231,245,0.5)' }}>Loading leaderboard...</p>
            ) : leaderboard.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'rgba(220,231,245,0.5)' }}>No completions yet. Be the first!</p>
            ) : (
              <table className="data-table" style={{ border: 'none' }}>
                <thead><tr><th>Rank</th><th>Name</th><th>Score</th><th>Time</th></tr></thead>
                <tbody>
                  {leaderboard.map((entry, i) => (
                    <tr key={i} style={i === 0 ? { background: 'rgba(255,215,0,0.05)' } : {}}>
                      <td><span className={`rank-badge ${i < 3 ? `rank-${i + 1}` : ''}`} style={i >= 3 ? { background: 'rgba(220,231,245,0.1)' } : {}}>{i < 3 ? getRankEmoji(i) : i + 1}</span></td>
                      <td style={{ fontWeight: i === 0 ? 700 : 400, color: i === 0 ? 'var(--dragon-gold)' : 'var(--sky-mist)' }}>{entry.name}</td>
                      <td><span style={{ color: 'var(--fire-orange)', fontWeight: 700 }}>{entry.score}/10</span></td>
                      <td style={{ color: 'rgba(220,231,245,0.6)' }}>{formatTime(entry.time_taken_seconds)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
