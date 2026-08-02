import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { AppRoutes } from './routes';

export const App: React.FC = () => {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </AppErrorBoundary>
  );
};

export default App;
