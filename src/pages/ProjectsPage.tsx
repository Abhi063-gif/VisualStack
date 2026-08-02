import React from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { FolderKanban } from 'lucide-react';

export const ProjectsPage: React.FC = () => (
  <EmptyState
    title="Project Management"
    description="Manage your .vstack project files and templates."
    icon={<FolderKanban size={32} />}
  />
);

export default ProjectsPage;
