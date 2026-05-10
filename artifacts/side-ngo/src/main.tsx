import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

// Set backend URL
setBaseUrl("https://side-ngo-api.onrender.com");

// Force cookies (VERY IMPORTANT)
(window as any).fetch = ((originalFetch) => {
  return (url: any, options: any = {}) => {
    return originalFetch(url, {
      ...options,
      credentials: "include"
    });
  };
})(window.fetch);

createRoot(document.getElementById("root")!).render(<App />);
