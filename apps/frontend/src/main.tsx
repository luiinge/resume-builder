import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import ProfileListPage from './pages/ProfileListPage';
import ProfileEditPage from './pages/ProfileEditPage';
import TemplateListPage from './pages/TemplateListPage';
import TemplateEditorPage from './pages/TemplateEditorPage';
import GeneratePage from './pages/GeneratePage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="/profiles" replace />} />
          <Route path="profiles" element={<ProfileListPage />} />
          <Route path="profiles/:id" element={<ProfileEditPage />} />
          <Route path="templates" element={<TemplateListPage />} />
          <Route path="templates/:id" element={<TemplateEditorPage />} />
          <Route path="generate" element={<GeneratePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
