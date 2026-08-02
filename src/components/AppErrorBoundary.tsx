import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[AppErrorBoundary] Caught uncaught UI exception:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen bg-[#0e0f12] text-gray-200 flex flex-col items-center justify-center p-6 select-none">
          <div className="max-w-md w-full bg-[#14161b] border border-rose-500/40 p-6 rounded-lg shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertOctagon size={24} />
            </div>
            <h2 className="text-base font-bold text-gray-100">VisualStack IDE Error</h2>
            <p className="text-xs text-gray-400 mt-2 mb-4">
              An unexpected runtime error occurred in the IDE framework shell.
            </p>
            <div className="bg-[#0e0f12] border border-[#232733] p-3 rounded font-mono text-[11px] text-rose-400 text-left overflow-x-auto mb-6 max-h-32">
              {this.state.error?.message || 'Unknown Error'}
            </div>
            <Button onClick={this.handleReset} variant="default" className="w-full gap-2">
              <RotateCcw size={14} />
              <span>Reload VisualStack IDE</span>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
