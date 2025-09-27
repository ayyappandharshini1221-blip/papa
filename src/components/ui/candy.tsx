'use client';

import { useEffect, useState } from 'react';

const candyTypes = ['🍬', '🍭', '🍫', '🍩', '🍪', '🍰'];

const Candy = () => {
  const [candies, setCandies] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const createCandies = () => {
      const newCandies = [];
      const numberOfCandies = 50; // Adjust for more or less candy

      for (let i = 0; i < numberOfCandies; i++) {
        const left = Math.random() * 100;
        const duration = 4 + Math.random() * 6; // Candy fall speed (slower than rain)
        const delay = Math.random() * 10;
        const type = candyTypes[Math.floor(Math.random() * candyTypes.length)];

        newCandies.push(
          <div
            key={i}
            className="candy"
            style={{
              left: `${left}vw`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          >
            {type}
          </div>
        );
      }
      setCandies(newCandies);
    };

    createCandies();

    window.addEventListener('resize', createCandies);
    return () => window.removeEventListener('resize', createCandies);
  }, []);

  return <div className="candy-container">{candies}</div>;
};

export default Candy;
