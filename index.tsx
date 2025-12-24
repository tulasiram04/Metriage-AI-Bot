import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

// Global handlers to surface silent crashes
window.addEventListener('error', (e) => {
  console.error('Global window error:', e.error || e.message, e);
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  // Create a root element if missing to avoid crashes
  const el = document.createElement('div');
  el.id = 'root';
  document.body.appendChild(el);
}

try {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (err) {
  console.error('Failed to mount React app:', err);
  // Render a minimal safe fallback DOM so the user sees something
  const fallback = document.createElement('div');
  fallback.style.background = '#020617';
  fallback.style.color = '#fff';
  fallback.style.padding = '20px';
  fallback.innerText = 'Application failed to start. Check the console for errors.';
  document.body.appendChild(fallback);
}