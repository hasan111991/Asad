import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Portal Root Error Boundary caught exception:', error, errorInfo);
  }

  handleReload = () => {
    window.location.href = window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#123B28] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-16 h-16 rounded-2xl bg-[#087A43] border-2 border-[#C9A227] flex items-center justify-center text-[#C9A227] shadow-xl mb-4 font-serif font-black text-sm">
            PML-N
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif mb-2 text-white">
            Chaudhry Asad Hanif Jutt – Official Portal
          </h1>
          <p className="text-xs text-emerald-200 max-w-md mb-6">
            The application encountered a browser initialization note. You can refresh or load the portal directly.
          </p>

          <button
            onClick={this.handleReload}
            className="px-6 py-2.5 rounded-xl bg-[#087A43] hover:bg-[#066135] text-white font-bold text-xs border border-[#C9A227] shadow-lg transition-colors cursor-pointer"
          >
            Reload Official Portal
          </button>

          {this.state.error && (
            <details className="mt-8 text-left max-w-md w-full bg-emerald-950/60 p-3 rounded-xl border border-emerald-800 text-[11px] text-emerald-300">
              <summary className="cursor-pointer font-mono font-bold text-[#C9A227]">
                Technical Diagnostic Details
              </summary>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-[10px] text-slate-300 overflow-x-auto">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>
    </React.StrictMode>
  );
}
