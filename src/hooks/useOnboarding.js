import { useState, useEffect } from 'react';

const STORAGE_KEY_PREFIX = 'playspot_tour_v1_';

export const useOnboarding = (roleKey) => {
  const storageKey = `${STORAGE_KEY_PREFIX}${roleKey}`;
  const [showTour, setShowTour] = useState(false);
  const [tourHighlight, setTourHighlight] = useState(null);

  useEffect(() => {
    const done = localStorage.getItem(storageKey);
    if (!done) {
      const t = setTimeout(() => setShowTour(true), 900);
      return () => clearTimeout(t);
    }
  }, [storageKey]);

  const finishTour = () => {
    localStorage.setItem(storageKey, '1');
    setShowTour(false);
    setTourHighlight(null);
  };

  const retakeTour = () => {
    localStorage.removeItem(storageKey);
    setShowTour(true);
  };

  return { showTour, finishTour, retakeTour, tourHighlight, setTourHighlight };
};
