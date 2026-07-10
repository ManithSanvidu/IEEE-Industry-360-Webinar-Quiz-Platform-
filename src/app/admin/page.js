'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DragonBackground from '@/components/DragonBackground';
import Navbar from '@/components/Navbar';

export default function Admin() {
  const [tab, setTab] = useState('results');
  const [results, setResults] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, completedQuizzes: 0 });
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [isQuizActive, setIsQuizActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const authRes = await fetch('/api/auth/me');
        const authData = await authRes.json();
        if (!authData.user || !authData.user.is_admin) { router.push('/'); return; }
        const [resData, adminData, statusData] = await Promise.all([
          fetch('/api/admin/results').then(r => r.json()),
          fetch('/api/admin/manage').then(r => r.json()),
          fetch('/api/admin/quiz-status').then(r => r.json())
        ]);
        if (resData.results) setResults(resData.results);
        setStats({ totalUsers: resData.totalUsers || 0, completedQuizzes: resData.completedQuizzes || 0 });
        if (adminData.admins) setAdmins(adminData.admins);
        if (adminData.pendingAdmins) setPendingAdmins(adminData.pendingAdmins);
        setIsQuizActive(statusData.isActive || false);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [router]);

  const formatTime = (s) => {
    if (!s && s !== 0) return '--';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const makeAdmin = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/admin/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: 'success', text: data.message });
      setAdminEmail('');
      const adminData = await fetch('/api/admin/manage').then(r => r.json());
      if (adminData.admins) setAdmins(adminData.admins);
      if (adminData.pendingAdmins) setPendingAdmins(adminData.pendingAdmins);
    } catch (err) { setMsg({ type: 'error', text: err.message }); }
  };

  const approveAdmin = async (email) => {
    setMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/admin/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: 'success', text: data.message });
      const adminData = await fetch('/api/admin/manage').then(r => r.json());
      if (adminData.admins) setAdmins(adminData.admins);
      if (adminData.pendingAdmins) setPendingAdmins(adminData.pendingAdmins);
    } catch (err) { setMsg({ type: 'error', text: err.message }); }
  };

  const completedResults = results.filter(r => r.is_completed);
  const avgScore = completedResults.length ? (completedResults.reduce((a, r) => a + r.score, 0) / completedResults.length).toFixed(1) : 0;
  const avgTime = completedResults.length ? Math.round(completedResults.reduce((a, r) => a + (r.time_taken_seconds || 0), 0) / completedResults.length) : 0;

  const toggleQuizStatus = async () => {
    try {
      const newStatus = !isQuizActive;
      const res = await fetch('/api/admin/quiz-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        setIsQuizActive(data.isActive);
      } else {
        alert(data.error);
      }
    } catch(err) {
      alert('Error toggling quiz status');
    }
  };

  if (loading) {
    return (<><DragonBackground /><Navbar /><div className="page-container"><p>Loading admin dashboard...</p></div></>);
  }

  return (
    <>
      <DragonBackground />
      <Navbar />
      <div className="admin-container" style={{ zIndex: 1, position: 'relative' }}>
        <h1 className="section-title">⚡ Admin Dashboard</h1>

        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: 'var(--dragon-gold)', margin: 0 }}>🎮 Quiz Status</h2>
            <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(220,231,245,0.7)', fontSize: '0.9rem' }}>
              Current Status: {isQuizActive ? <span style={{ color: '#86efac', fontWeight: 'bold' }}>Active</span> : <span style={{ color: '#fdba74', fontWeight: 'bold' }}>Not Started</span>}
            </p>
          </div>
          <button 
            className={isQuizActive ? 'btn-secondary' : 'btn-fire'}
            style={{ padding: '12px 24px' }}
            onClick={toggleQuizStatus}
          >
            {isQuizActive ? '⏹️ Stop Quiz' : '🚀 Start Quiz for Everyone'}
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-value">{stats.totalUsers}</div><div className="stat-label">Total Participants</div></div>
          <div className="stat-card"><div className="stat-value">{stats.completedQuizzes}</div><div className="stat-label">Quizzes Completed</div></div>
          <div className="stat-card"><div className="stat-value">{avgScore}</div><div className="stat-label">Average Score</div></div>
          <div className="stat-card"><div className="stat-value">{formatTime(avgTime)}</div><div className="stat-label">Average Time</div></div>
        </div>

        <div className="tab-container">
          <button className={`tab-btn ${tab === 'results' ? 'active' : ''}`} onClick={() => setTab('results')}>📊 Results & Times</button>
          <button className={`tab-btn ${tab === 'leaderboard' ? 'active' : ''}`} onClick={() => setTab('leaderboard')}>🏆 Leaderboard</button>
          <button className={`tab-btn ${tab === 'admins' ? 'active' : ''}`} onClick={() => setTab('admins')}>👑 Manage Admins</button>
        </div>

        {tab === 'results' && (
          <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <h2 style={{ color: 'var(--dragon-gold)', marginBottom: '1rem' }}>📋 All Participant Results</h2>
            {results.length === 0 ? (
              <p style={{ color: 'rgba(220,231,245,0.5)', padding: '1rem' }}>No participants yet.</p>
            ) : (
              <table className="data-table">
                <thead><tr><th>Name</th><th>Email</th><th>Score</th><th>Time Taken</th><th>Status</th><th>Completed At</th></tr></thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{r.name}</td>
                      <td style={{ color: 'rgba(220,231,245,0.6)', fontSize: '0.85rem' }}>{r.email}</td>
                      <td>{r.score !== null ? <span style={{ color: 'var(--fire-orange)', fontWeight: 700 }}>{r.score}/10</span> : '--'}</td>
                      <td style={{ color: 'var(--dragon-gold)', fontWeight: 600 }}>{formatTime(r.time_taken_seconds)}</td>
                      <td>{r.is_completed ?
                        <span style={{ background: 'rgba(34,197,94,0.15)', color: '#86efac', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem' }}>Completed</span> :
                        r.attempt_id ?
                        <span style={{ background: 'rgba(249,115,22,0.15)', color: '#fdba74', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem' }}>In Progress</span> :
                        <span style={{ background: 'rgba(220,231,245,0.1)', color: 'rgba(220,231,245,0.4)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem' }}>Not Started</span>
                      }</td>
                      <td style={{ fontSize: '0.85rem', color: 'rgba(220,231,245,0.5)' }}>{r.completed_at ? new Date(r.completed_at).toLocaleString() : '--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'leaderboard' && (
          <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <h2 style={{ color: 'var(--dragon-gold)', marginBottom: '1rem' }}>🏆 Leaderboard (by Score → Time)</h2>
            {completedResults.length === 0 ? (
              <p style={{ color: 'rgba(220,231,245,0.5)', padding: '1rem' }}>No completions yet.</p>
            ) : (
              <table className="data-table">
                <thead><tr><th>Rank</th><th>Name</th><th>Email</th><th>Score</th><th>Time Taken</th></tr></thead>
                <tbody>
                  {completedResults.sort((a, b) => b.score - a.score || (a.time_taken_seconds || 999) - (b.time_taken_seconds || 999)).map((r, i) => (
                    <tr key={i} style={i === 0 ? { background: 'rgba(255,215,0,0.05)' } : {}}>
                      <td><span className={`rank-badge ${i < 3 ? `rank-${i + 1}` : ''}`} style={i >= 3 ? { background: 'rgba(220,231,245,0.1)' } : {}}>{i < 3 ? ['🥇','🥈','🥉'][i] : i + 1}</span></td>
                      <td style={{ fontWeight: i === 0 ? 700 : 400, color: i === 0 ? 'var(--dragon-gold)' : 'var(--sky-mist)' }}>{r.name}</td>
                      <td style={{ fontSize: '0.85rem', color: 'rgba(220,231,245,0.6)' }}>{r.email}</td>
                      <td><span style={{ color: 'var(--fire-orange)', fontWeight: 700 }}>{r.score}/10</span></td>
                      <td style={{ color: 'var(--dragon-gold)', fontWeight: 600 }}>{formatTime(r.time_taken_seconds)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'admins' && (
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ color: 'var(--dragon-gold)', marginBottom: '1rem' }}>👑 Admin Management</h2>
            <p style={{ color: 'rgba(220,231,245,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Appoint new admins by entering their registered email address.</p>
            
            {msg.text && <div className={msg.type === 'error' ? 'error-msg' : 'success-msg'}>{msg.text}</div>}

            <form onSubmit={makeAdmin} className="admin-form">
              <input className="input-field" type="email" placeholder="Enter user's email to make admin" required
                value={adminEmail} onChange={e => setAdminEmail(e.target.value)} />
              <button type="submit" className="btn-primary">👑 Make Admin</button>
            </form>

            <h3 style={{ color: 'var(--sky-mist)', marginBottom: '1rem', marginTop: '1rem' }}>Current Admins</h3>
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Added</th></tr></thead>
              <tbody>
                {admins.map((a, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{a.name}</td>
                    <td style={{ color: 'rgba(220,231,245,0.6)' }}>{a.email}</td>
                    <td style={{ fontSize: '0.85rem', color: 'rgba(220,231,245,0.5)' }}>{new Date(a.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 style={{ color: 'var(--sky-mist)', marginBottom: '1rem', marginTop: '2rem' }}>Pending Admin Requests</h3>
            {pendingAdmins.length === 0 ? (
              <p style={{ color: 'rgba(220,231,245,0.5)', padding: '1rem' }}>No pending requests.</p>
            ) : (
              <table className="data-table">
                <thead><tr><th>Name</th><th>Email</th><th>Requested</th><th>Action</th></tr></thead>
                <tbody>
                  {pendingAdmins.map((pa, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{pa.name}</td>
                      <td style={{ color: 'rgba(220,231,245,0.6)' }}>{pa.email}</td>
                      <td style={{ fontSize: '0.85rem', color: 'rgba(220,231,245,0.5)' }}>{new Date(pa.created_at).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className="btn-primary" 
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          onClick={() => approveAdmin(pa.email)}
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </>
  );
}
