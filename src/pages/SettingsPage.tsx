import React from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { Settings } from 'lucide-react';

export const SettingsPage: React.FC = () => (
  <EmptyState
    title="IDE Settings"
    description="Configure editor keybindings, theme tokens, and compiler outputs."
    icon={<Settings size={32} />}
  />
);

export default SettingsPage;
