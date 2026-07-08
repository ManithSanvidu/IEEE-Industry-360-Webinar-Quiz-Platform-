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
      color: ['#C026D3', '#F97316', '#F5B942', '#1F4E79'][Math.floor(Math.random() * 4)]
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(p);
  }, []);

  return (
    <div className="dragon-bg">
      <div className="dragon-bg-shape" style={{ width: 400, height: 400, top: '-10%', right: '-5%', background: '#C026D3' }} />
      <div className="dragon-bg-shape" style={{ width: 300, height: 300, bottom: '-5%', left: '-5%', background: '#F97316' }} />
      <div className="dragon-bg-shape" style={{ width: 250, height: 250, top: '40%', left: '30%', background: '#1F4E79' }} />
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
