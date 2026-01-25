import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./i18n.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen text-zinc-100 text-lg font-semibold">
          Loading...
        </div>
      }
    >
      <App />
    </Suspense>
  </StrictMode>,
);
