import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * PrivateRoute - Protege rutas que requieren autenticación.
 * Si no hay un JWT en localStorage, redirige al usuario a la página principal.
 */
export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/panel-admin/login" replace />;
  }

  return children;
}
