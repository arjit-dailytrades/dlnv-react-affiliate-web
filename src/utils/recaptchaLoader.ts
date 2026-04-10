import { useEffect } from "react";
import { environment } from "../environments/environment";

export default function RecaptchaLoader() {
  useEffect(() => {
    const v3SiteKey = environment.SITE_KEY_V3;

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${v3SiteKey}`;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
