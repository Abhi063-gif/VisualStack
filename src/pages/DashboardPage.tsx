import React from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { LayoutDashboard, FolderKanban, PlaySquare, Box, Settings } from 'lucide-react';

export const DashboardPage: React.FC = () => (
  <EmptyState
    title="VisualStack Dashboard"
    description="Welcome to VisualStack Studio. Select or create a project to start designing."
    icon={<LayoutDashboard size={32} />}
  />
);

export const ProjectsPage: React.FC = () => (
  <EmptyState
    title="Project Management"
    description="Manage your .vstack project files and templates."
    icon={<FolderKanban size={32} />}
  />
);

export const PreviewPage: React.FC = () => (
  <EmptyState
    title="Live Application Preview"
    description="Connect local React + Express runtime server to test live interactions."
    icon={<PlaySquare size={32} />}
  />
);

export const PluginsPage: React.FC = () => (
  <EmptyState
    title="Plugin Marketplace & Extensions"
    description="Explore and manage installed VisualStack IDE plugins."
    icon={<Box size={32} />}
  />
);

export const SettingsPage: React.FC = () => (
  <EmptyState
    title="IDE Settings"
    description="Configure editor keybindings, theme tokens, and compiler outputs."
    icon={<Settings size={32} />}
  />
);

export default DashboardPage;
