import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { SubmitIssuePage } from './pages/SubmitIssuePage';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { AuthPage } from './pages/AuthPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/report" element={<SubmitIssuePage />} />
        <Route path="/issue/:id" element={<IssueDetailPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/components" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
