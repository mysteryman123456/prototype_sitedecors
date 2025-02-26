import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SessionProvider } from './context/SessionContext';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
<SessionProvider>
    <App />
</SessionProvider>
);

reportWebVitals();
