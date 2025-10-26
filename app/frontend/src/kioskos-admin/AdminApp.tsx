import { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import CMSHome from './CMSHome';

export default function AdminApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Verificar si hay un token válido y no ha expirado
    const token = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('tokenExpiration');
    
    if (token && expirationTime) {
      const now = Date.now();
      const expiration = parseInt(expirationTime, 10);
      
      if (now < expiration) {
        // Token válido y no expirado
        setLoggedIn(true);
      } else {
        // Token expirado, limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
      }
    }
    
    setChecking(false);
  }, []);

  // Verificar periódicamente si la sesión ha expirado (cada minuto)
  useEffect(() => {
    if (!loggedIn) return;

    const interval = setInterval(() => {
      const expirationTime = localStorage.getItem('tokenExpiration');
      
      if (expirationTime) {
        const now = Date.now();
        const expiration = parseInt(expirationTime, 10);
        
        if (now >= expiration) {
          // Sesión expirada, cerrar sesión
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiration');
          setLoggedIn(false);
        }
      }
    }, 60000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, [loggedIn]);

  // Mostrar nada mientras se verifica la sesión
  if (checking) {
    return null;
  }

  return loggedIn ? <CMSHome /> : <AdminLogin onLogin={() => setLoggedIn(true)} />;
}
