import React from 'react';

interface State {
  hasError: boolean;
  error: any;
}

export class ErrorBoundary extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.error('Uncaught error in component tree:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
          <div className="max-w-xl text-center">
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-slate-300 mb-4">An unexpected error occurred while rendering the application. You can try reloading the page.</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-cyan-600 rounded">Reload</button>
            </div>
            <pre className="text-xs text-left mt-4 bg-black/20 p-2 rounded break-words">{String(this.state.error)}</pre>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
