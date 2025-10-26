import React from 'react'
import ReactDOM from 'react-dom/client'
import AdminApp from './kioskos-admin/AdminApp';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import App from './kioskos-app/App';
import Home from './kioskos-app/Home';
import MiniJuegosDashboard from './kioskos-app/MiniJuegosDashboard';
import MemoriaGame from './kioskos-app/MemoriaGame';
import MemoriaGameSuccess from './kioskos-app/MemoriaGameSuccess';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="*" element={<App />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/minijuegos" element={<MiniJuegosDashboard />} />
        <Route path="/memoria-game" element={<MemoriaGame />} />
        <Route path="/memoria-success" element={<MemoriaGameSuccess />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
