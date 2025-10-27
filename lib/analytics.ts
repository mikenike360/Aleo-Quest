import Plausible from 'plausible-tracker';

const plausible = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  ? Plausible({
      domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
      apiHost: process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST || 'https://plausible.io',
    })
  : null;

export function trackPageview(path?: string) {
  if (plausible) {
    plausible.trackPageview({}, { url: path });
  }
}

export function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>
) {
  if (plausible) {
    plausible.trackEvent(eventName, { props });
  }
}

export { plausible };

