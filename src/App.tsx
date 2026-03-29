import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import BudgetsPage from "./pages/Budgets";
import DashboardPage from "./pages/Dashboard";
import GoalsPage from "./pages/Goals";
import ReportsPage from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import TemplatesPage from "./pages/Templates";
import TransactionsPage from "./pages/Transactions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="budgets" element={<BudgetsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
