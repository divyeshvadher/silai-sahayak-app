
import { createRoot } from 'react-dom/client';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import App from './App.tsx';
import './index.css';

// Initialize the app
createRoot(document.getElementById("root")!).render(<App />);

// Call the element loader after the app has been rendered the first time
defineCustomElements(window);
