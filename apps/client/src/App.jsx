import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './views/Home';
import Catalog from './views/Catalog';
import ProjectDetail from './views/ProjectDetail';
import AdminPanel from './views/AdminPanel';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio-completo" element={<Catalog />} />
            <Route path="/proyecto/:id" element={<ProjectDetail />} />
            <Route path="/panel-admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
