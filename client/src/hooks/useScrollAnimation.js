import { useEffect, useRef } from 'react';

/**
 * Custom hook that adds an IntersectionObserver to trigger
 * a CSS class ('visible') when each observed element enters the viewport.
 * Requires the target elements to have the 'animate-on-scroll' class in index.css.
 *
 * @param {string} selector - CSS selector of elements to observe
 * @param {IntersectionObserverInit} [options]
 */
const useScrollAnimation = (selector = '.animate-on-scroll', options = {}, deps = []) => {
  const defaultOptions = { threshold: 0.12, ...options };

  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once animated, unobserve to avoid re-triggering
          observer.unobserve(entry.target);
        }
      });
    }, defaultOptions);

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, ...deps]);
};

export default useScrollAnimation;
