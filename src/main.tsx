import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary'

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  const root = createRoot(rootElement);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} catch (error) {
  console.error('❌ Error rendering app:', error);
  // Fallback rendering
  rootElement.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #111827; color: white; font-family: Arial, sans-serif;">
      <div style="text-align: center;">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">Something went wrong</h1>
        <p style="color: #9ca3af; margin-bottom: 1.5rem;">We're working on fixing the problem.</p>
        <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.25rem; cursor: pointer; hover:background: #2563eb;">
          Reload Page
        </button>
      </div>
    </div>
  `;
}
