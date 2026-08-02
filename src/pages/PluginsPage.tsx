import React from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { Box } from 'lucide-react';

export const PluginsPage: React.FC = () => (
  <EmptyState
    title="Plugin Marketplace & Extensions"
    description="Explore and manage installed VisualStack IDE plugins."
    icon={<Box size={32} />}
  />
);

export default PluginsPage;
