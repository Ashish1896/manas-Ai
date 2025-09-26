import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.tsx";
import "./index.css";
import { setupI18n } from "./i18n";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

setupI18n().then(() => {
  const root = document.getElementById("root")!;

  if (PUBLISHABLE_KEY) {
    createRoot(root).render(
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    );
  } else {
    console.warn(
      "VITE_CLERK_PUBLISHABLE_KEY is missing. Rendering app without Clerk authentication."
    );
    createRoot(root).render(<App />);
  }
});
