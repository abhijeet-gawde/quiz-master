import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Questionnaire from '../pages/Questionnaire';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/quiz/:topicId" element={<Questionnaire />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
