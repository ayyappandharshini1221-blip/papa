'use client';

import { useEffect, useState } from 'react';

const Rain = () => {
  const [raindrops, setRaindrops] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const createRaindrops = () => {
      const drops = [];
      const numberOfDrops = 100; // Adjust for more or less rain

      for (let i = 0; i < numberOfDrops; i++) {
        const left = Math.random() * 100;
        const duration = 0.5 + Math.random() * 0.5; // Raindrop fall speed
        const delay = Math.random() * 5;

        drops.push(
          <div
            key={i}
            className="raindrop"
            style={{
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      }
      setRaindrops(drops);
    };

    createRaindrops();
    
    // Optional: regenerate rain on window resize
    window.addEventListener('resize', createRaindrops);
    return () => window.removeEventListener('resize', createRaindrops);
  }, []);

  return <div className="rain-container">{raindrops}</div>;
};

export default Rain;
