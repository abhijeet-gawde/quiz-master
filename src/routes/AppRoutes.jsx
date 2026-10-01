import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import QuickNotes from '../pages/QuickNotes';
import Questionnaire from '../pages/Questionnaire';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/quiz/:topicId" element={<Questionnaire />} />
      <Route path="/quick-notes/:topicId" element={<QuickNotes />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
