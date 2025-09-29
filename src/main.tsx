import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent MetaMask from auto-connecting or showing connection errors
if (typeof window !== 'undefined') {
  // Disable MetaMask auto-connection
  window.addEventListener('load', () => {
    if (window.ethereum) {
      // Prevent automatic connection attempts
      window.ethereum.autoRefreshOnNetworkChange = false;
      
      // Suppress MetaMask connection errors
      const originalConsoleError = console.error;
      console.error = (...args) => {
        const message = args.join(' ');
        if (message.includes('MetaMask') || message.includes('Failed to connect')) {
          return; // Suppress MetaMask related errors
        }
        originalConsoleError.apply(console, args);
      };
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
