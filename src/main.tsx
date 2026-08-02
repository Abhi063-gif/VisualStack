import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { registerDefaultComponents } from './features/designer/components/registry/DefaultComponents';
import { graphManager } from './features/logic/graph/GraphManager';
import { logicService } from './features/logic/services/LogicService';
import { variableManager } from './features/logic/variables/VariableManager';

registerDefaultComponents();

// Expose visualstack debugging namespace on window
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).visualstack = {
    graphManager,
    logicService,
    variableManager,
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
