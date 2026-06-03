import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Home from './views/Home';
import Catalog from './views/Catalog';
import ProjectDetail from './views/ProjectDetail';
import AdminLogin from './views/AdminLogin';
import AdminPanel from './views/AdminPanel';

// Componente interno para poder usar useLocation dentro del Router
function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/panel-admin');

  return (
    <div className="app-container">
      <NavBar />
      <main className="main-content">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/portfolio-completo" element={<Catalog />} />
          <Route path="/proyecto/:id" element={<ProjectDetail />} />
          <Route path="/panel-admin/login" element={<AdminLogin />} />

          {/* Ruta protegida: Panel de Administración */}
          <Route
            path="/panel-admin"
            element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      {/* Footer solo en rutas públicas */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

