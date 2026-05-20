import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import About from '../components/About';
import InfiniteSlider from '../components/InfiniteSlider';
import Education from '../components/Education';
import Technologies from '../components/Technologies';
import Contact from '../components/Contact';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        // Delay slightly to ensure layout has rendered
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <>
      <About />
      <InfiniteSlider />
      <Education />
      <Technologies />
      <Contact />
    </>
  );
}
