'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import InteractiveMessage from './components/InteractiveMessage';
import CuboNegro from './components/CuboNegro';

export default function HomePage() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 6000),
      setTimeout(() => setStage(2), 9000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (stage === 0) return <LoadingScreen />;
  if (stage === 1) return <InteractiveMessage />;

  return <CuboNegro />;
}
