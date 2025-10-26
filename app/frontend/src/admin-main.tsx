import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './kioskos-admin/AdminApp';
import './kioskos-admin/admin.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
