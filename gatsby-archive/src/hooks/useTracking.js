import { useEffect } from 'react';

export const useTracking = () => {
  const trackEvent = (eventName, properties = {}) => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture(eventName, properties);
    }
  };

  const trackPageView = (path) => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('$pageview', { path });
    }
  };

  // Track page views automatically
  useEffect(() => {
    if (typeof window !== 'undefined' && window.posthog) {
      const path = window.location.pathname;
      trackPageView(path);
    }
  }, []);

  return {
    trackEvent,
    trackPageView
  };
};
