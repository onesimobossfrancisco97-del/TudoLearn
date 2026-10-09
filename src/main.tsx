import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress harmless Vite HMR WebSocket connection errors as per environment guidelines
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    const isViteWsError =
      event.message?.includes('WebSocket') ||
      event.filename?.includes('@vite/client') ||
      event.message?.includes('@vite/client') ||
      (event.error && String(event.error).includes('WebSocket'));

    if (isViteWsError) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const isViteWsRejection =
      event.reason?.message?.includes('WebSocket') ||
      String(event.reason).includes('WebSocket');

    if (isViteWsRejection) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(<App />);
