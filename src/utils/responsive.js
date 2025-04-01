/**
 * Utility functions for responsive design
 */

// Breakpoints for different screen sizes
export const BREAKPOINTS = {
  MOBILE: 0,
  TABLET: 768,
  DESKTOP: 1024,
  LARGE_DESKTOP: 1440
};

/**
 * Check if the current screen is a PC (tablet or larger)
 * @returns {boolean} True if screen width is >= tablet breakpoint
 */
export function isPcScreen() {
  // #ifdef H5
  return window.innerWidth >= BREAKPOINTS.TABLET;
  // #endif
  
  // #ifndef H5
  return false; // Mobile platforms always return false
  // #endif
}

/**
 * Get the current screen size category
 * @returns {string} 'mobile', 'tablet', 'desktop', or 'large-desktop'
 */
export function getScreenSize() {
  // #ifdef H5
  const width = window.innerWidth;
  
  if (width >= BREAKPOINTS.LARGE_DESKTOP) {
    return 'large-desktop';
  } else if (width >= BREAKPOINTS.DESKTOP) {
    return 'desktop';
  } else if (width >= BREAKPOINTS.TABLET) {
    return 'tablet';
  } else {
    return 'mobile';
  }
  // #endif
  
  // #ifndef H5
  return 'mobile';
  // #endif
}

/**
 * Add a resize event listener with debounce
 * @param {Function} callback Function to call on resize
 * @param {number} delay Debounce delay in ms
 * @returns {Function} Function to remove the event listener
 */
export function addResizeListener(callback, delay = 250) {
  // #ifdef H5
  let timeoutId;
  
  const handleResize = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback();
    }, delay);
  };
  
  window.addEventListener('resize', handleResize);
  
  // Return function to remove listener
  return () => {
    window.removeEventListener('resize', handleResize);
    clearTimeout(timeoutId);
  };
  // #endif
  
  // #ifndef H5
  // Return no-op function for non-H5 platforms
  return () => {};
  // #endif
}
