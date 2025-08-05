'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface GTagEvent {
  event_category?: string;
  event_label?: string;
  value?: number;
  page_path?: string;
  page_search?: string;
  page_title?: string;
  user_id?: string;
  user_email?: string;
  is_authenticated?: boolean;
  [key: string]: string | number | boolean | undefined; // More specific index signature
}

type GTagCommand = 'event' | 'set' | 'config' | 'js';

declare global {
  interface Window {
    gtag: (
      command: GTagCommand,
      action: string,
      data?: GTagEvent | string
    ) => void;
    dataLayer: Array<{
      'gtm.start': number;
      event: string;
      [key: string]: unknown;
    }>;
  }
}

export const useAnalytics = () => {
  const pathname = usePathname();
  
  // Move searchParams inside the effect to avoid SSR issues
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      if (pathname) {
        // Track page views
        window.gtag?.('event', 'page_view', {
          page_path: pathname,
          page_search: searchParams.toString(),
        });
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, [pathname]);

  const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
  ) => {
    try {
      window.gtag?.('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    } catch (error) {
      console.error('Track event error:', error);
    }
  };

  const setUserProperties = (properties: Record<string, string | undefined>) => {
    try {
      window.gtag?.('set', 'user_properties', properties);
    } catch (error) {
      console.error('Set user properties error:', error);
    }
  };

  return { trackEvent, setUserProperties };
};

// Example usage of custom events:
/*
const { trackEvent } = useAnalytics();

// Track form submission
trackEvent('submit', 'form', 'company_registration');

// Track button click
trackEvent('click', 'button', 'save_company');

// Track error
trackEvent('error', 'api', 'company_creation_failed');
*/ 