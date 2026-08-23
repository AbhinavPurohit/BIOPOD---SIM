import React, { StrictMode, ReactNode, ErrorInfo } from 'react';
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

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('BioPod App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070B08] text-[#FAF8F2] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md bg-[#0D1810] border border-[#1E3F27] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#1A3320] text-[#69B82F] flex items-center justify-center mx-auto text-2xl">
              🌿
            </div>
            <h1 className="text-xl font-bold font-mono text-[#FAF8F2]">BioPod Application Initializing</h1>
            <p className="text-xs text-[#8C9A8F] leading-relaxed">
              An unexpected runtime error was caught. Please reload the application or verify browser compatibility.
            </p>
            {this.state.error && (
              <pre className="text-[10px] text-left bg-[#050A07] p-3 rounded-lg border border-[#172D1E] text-[#A8DDA2] overflow-x-auto">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#1E5C33] hover:bg-[#277943] text-white text-xs font-mono font-bold rounded-xl transition-all cursor-pointer shadow-md"
            >
              RELOAD APPLICATION
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
