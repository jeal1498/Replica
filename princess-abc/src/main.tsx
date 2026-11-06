import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { GameProvider } from './app/store';
import { initPWA } from './app/pwa';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode><GameProvider><App /></GameProvider></StrictMode>,
);
initPWA();
