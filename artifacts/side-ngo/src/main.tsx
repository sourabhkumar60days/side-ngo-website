(window as any).__API_URL__ = import.meta.env.VITE_API_URL;
import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

setBaseUrl("https://side-ngo-api.onrender.com");

createRoot(document.getElementById("root")!).render(<App />);
