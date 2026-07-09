'use client';
import { useEffect, useState } from 'react';

export default function DragonBackground() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      color: ['#F5C05B', '#E86C3B', '#1C3652', '#EAE0C8'][Math.floor(Math.random() * 4)]
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(p);
  }, []);

  return (
    <div className="dragon-bg">
      <div className="dragon-bg-shape" style={{ width: 400, height: 400, top: '-10%', right: '-5%', background: '#1C3652' }} />
      <div className="dragon-bg-shape" style={{ width: 300, height: 300, bottom: '-5%', left: '-5%', background: '#0A1118' }} />
      <div className="dragon-bg-shape" style={{ width: 350, height: 350, top: '40%', left: '30%', background: '#101E2E' }} />
      {particles.map(p => (
        <div key={p.id} className="dragon-particle" style={{
          left: `${p.left}%`, top: `${p.top}%`,
          width: p.size, height: p.size,
          background: p.color,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`
        }} />
      ))}
    </div>
  );
}
