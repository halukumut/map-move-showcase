type Options = {
  apiKey: string;
  libraries?: string[];
  version?: string;
  channel?: string;
};

let loaderPromise: Promise<void> | null = null;

export default function loadGoogleMaps(opts: Options) {
  if (loaderPromise) return loaderPromise;

  const { apiKey, libraries = [], version = "weekly", channel } = opts;

  loaderPromise = new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("window is undefined"));
    if ((window as any).google && (window as any).google.maps) return resolve();

    const script = document.createElement("script");
    const libs = libraries.length ? `&libraries=${libraries.join(",")}` : "";
    const ch = channel ? `&channel=${encodeURIComponent(channel)}` : "";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}${libs}&v=${encodeURIComponent(version)}${ch}`;
    script.async = true;
    script.defer = true;

    // Provide a visible auth-failure hook used by Google Maps when key/auth fails
    const prevAuthFailure = (window as any).gm_authFailure;
    (window as any).gm_authFailure = function authFail() {
      const msg = 'Google Maps authentication failed: check API key, billing, and API enablement.';
      console.error(msg);
      reject(new Error(msg));
      // restore previous handler if any
      if (prevAuthFailure) try { prevAuthFailure(); } catch (e) {}
    };

    const cleanup = () => {
      try {
        if ((window as any).gm_authFailure === authFail) (window as any).gm_authFailure = prevAuthFailure;
      } catch (e) {}
    };

    // resolve when google.maps is available
    script.onload = () => {
      if ((window as any).google && (window as any).google.maps) {
        cleanup();
        resolve();
      } else {
        cleanup();
        reject(new Error("Google Maps loaded but `window.google.maps` is not available"));
      }
    };

    script.onerror = (ev) => {
      cleanup();
      const err = new Error("Failed to load Google Maps script. Possible causes: invalid API key, network issue, or API not enabled.");
      console.error(err.message, ev);
      reject(err);
    };

    // Fallback: if script does not call onerror or gm_authFailure, reject after timeout
    const timeout = setTimeout(() => {
      if (!(window as any).google || !(window as any).google.maps) {
        const err = new Error("Timed out waiting for Google Maps to initialize. Check API key and network.");
        console.error(err.message);
        cleanup();
        reject(err);
      }
    }, 15000);

    // attach finally to resolve/reject to clear timeout
    const wrapResolve = (fn: () => void) => { try { fn(); } finally { clearTimeout(timeout); } };

    const originalResolve = resolve;
    const originalReject = reject;

    resolve = () => wrapResolve(originalResolve as any);
    // @ts-ignore reassign
    reject = (err: any) => wrapResolve(() => originalReject(err));

    document.head.appendChild(script);
  });

  return loaderPromise;
}

export function resetGoogleMapsLoader() {
  loaderPromise = null;
}
