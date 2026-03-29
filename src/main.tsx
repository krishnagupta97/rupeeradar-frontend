import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AppProvider } from "./contexts/AppContext.tsx";
import { FinanceDataProvider } from "./contexts/FinanceDataContext.tsx";
import "./index.css";
import { mockUser } from "./static.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider initialUser={mockUser}>
      <FinanceDataProvider>
        <App />
      </FinanceDataProvider>
    </AppProvider>
  </StrictMode>,
);
