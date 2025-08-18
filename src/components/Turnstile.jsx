import { useEffect, useRef } from "react";

export default function Turnstile({ onToken }) {
  const elRef = useRef(null);
  const cbRef = useRef(onToken); // keep a stable callback ref
  const widgetIdRef = useRef(null); // for reset if needed
  const loadedRef = useRef(false); // prevent double render in StrictMode

  cbRef.current = onToken; // always latest callback, but ref identity stable

  const siteKey =
    import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

  useEffect(() => {
    if (!elRef.current || loadedRef.current) return;
    loadedRef.current = true;

    const render = () => {
      // Clear previous widget just in case
      if (elRef.current) elRef.current.innerHTML = "";
      try {
        widgetIdRef.current = window.turnstile.render(elRef.current, {
          sitekey: siteKey,
          callback: (t) => cbRef.current && cbRef.current(t),
        });
      } catch (e) {
        console.log(`Error:${e}`);
      }
    };

    if (window.turnstile) {
      render();
    } else {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true;
      s.defer = true;
      s.onload = render;
      document.body.appendChild(s);
    }

    return () => {
      // cleanup
      try {
        if (window.turnstile && widgetIdRef.current) {
          window.turnstile.reset(widgetIdRef.current);
        }
      } catch {
        if (elRef.current) elRef.current.innerHTML = "";
        widgetIdRef.current = null;
      }
    };
  }, []);

  return <div ref={elRef} className="my-2" />;
}
