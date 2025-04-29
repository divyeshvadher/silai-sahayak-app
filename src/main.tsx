
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize the app for web
if (typeof document !== 'undefined') {
  createRoot(document.getElementById("root")!).render(<App />);
}

// Expo entry point is handled by App.tsx directly
// No need for additional setup here
