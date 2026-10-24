declare global {
  interface Window {
    grecaptcha?: {
      enterprise: {
        ready: (callback: () => void) => void;
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
      };
    };
  }
}

export const RECAPTCHA_SITE_KEY = '6LezH_8tAAAAAFEZSCw7gJOltuCCob7xjnJxZkAN';

/**
 * Execute Google reCAPTCHA Enterprise and return a verification token
 * @param action - the name of the user action (e.g. 'checkout', 'newsletter', 'login')
 * @returns verification token string or null if not available
 */
export async function executeRecaptcha(action: string): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    if (!window.grecaptcha?.enterprise) {
      // If reCAPTCHA is still initializing, wait briefly
      await new Promise<void>((resolve) => {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (window.grecaptcha?.enterprise || attempts > 20) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
    }

    if (!window.grecaptcha?.enterprise) {
      return null;
    }

    return await new Promise<string>((resolve, reject) => {
      window.grecaptcha!.enterprise.ready(async () => {
        try {
          const token = await window.grecaptcha!.enterprise.execute(RECAPTCHA_SITE_KEY, { action });
          resolve(token);
        } catch (err) {
          reject(err);
        }
      });
    });
  } catch (err) {
    console.warn('[reCAPTCHA Enterprise] Execution notice:', err);
    return null;
  }
}
