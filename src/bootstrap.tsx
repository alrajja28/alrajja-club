import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { BackendRoot } from './backend/BackendRoot';
import './index.css';
import './club-theme.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BackendRoot><App /></BackendRoot>
  </StrictMode>,
);
