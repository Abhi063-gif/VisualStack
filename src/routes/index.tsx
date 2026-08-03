import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));
const DesignerPage = lazy(() => import('../pages/DesignerPage'));
const BackendPage = lazy(() => import('../pages/BackendPage'));
const PreviewPage = lazy(() => import('../pages/PreviewPage'));
const PluginsPage = lazy(() => import('../pages/PluginsPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const DeploymentPage = lazy(() => import('../pages/DeploymentPage').then(m => ({ default: m.DeploymentPage })));

export const AppRoutes: React.FC = () => {
  return (
    <AppLayout>
      <Suspense fallback={<LoadingSpinner size={24} />}>
        <Routes>
          <Route path="/" element={<Navigate to="/designer" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/designer" element={<DesignerPage />} />
          <Route path="/backend" element={<BackendPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/deployment" element={<DeploymentPage />} />
          <Route path="/plugins" element={<PluginsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/designer" replace />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
};
