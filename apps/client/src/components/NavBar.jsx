import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoUrl from '../assets/logoportfolio.png';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { id: 1, nombre: 'Experiencia', enlace: '#experiencia' },
    { id: 2, nombre: 'Proyectos', enlace: '#proyectos' },
    { id: 3, nombre: 'Tecnologías', enlace: '#tecnologías' },
    { id: 4, nombre: 'Contacto', enlace: '#contacto' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  };

  const handleNavClick = (enlace) => {
    closeMenu();
    if (location.pathname !== '/') {
      navigate('/' + enlace);
    } else {
      const element = document.querySelector(enlace);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img src={logoUrl} alt="Logo" className="navbar-logo" />
      </div>

      <button 
        className={`hamburger ${isMenuOpen ? 'is-active' : ''}`} 
        onClick={toggleMenu}
        aria-label="Abrir menú"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`navbar-menu ${isMenuOpen ? 'is-open' : ''}`}>
        <ul className="nav-list">
          <li>
            <Link to="/" className="nav-item" onClick={closeMenu}>
              Inicio
            </Link>
          </li>
          {navigation.map((nav) => (
            <li key={nav.id}>
              <a 
                href={nav.enlace}
                className="nav-item" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(nav.enlace);
                }}
              >
                {nav.nombre}
              </a>
            </li>
          ))}
          <li>
            <Link to="/portfolio-completo" className="nav-item" onClick={closeMenu}>
              Portfolio Completo
            </Link>
          </li>
          <li>
            <Link to="/panel-admin" className="nav-item" onClick={closeMenu}>
              Admin
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
