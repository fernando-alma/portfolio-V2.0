import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoUrl from '../assets/logoportfolio.png';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { 
      id: 1, 
      nombre: 'Experiencia', 
      enlace: '#experiencia',
      icon: (
        <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 2H9a2 2 0 0 0-2 2v2H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4V4a2 2 0 0 0-2-2z"/>
          <path d="M7 6h10"/>
          <path d="M3 11h18"/>
        </svg>
      )
    },
    { 
      id: 2, 
      nombre: 'Proyectos', 
      enlace: '#proyectos',
      icon: (
        <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1"/>
          <rect width="7" height="5" x="14" y="3" rx="1"/>
          <rect width="7" height="9" x="14" y="12" rx="1"/>
          <rect width="7" height="5" x="3" y="16" rx="1"/>
        </svg>
      )
    },
    { 
      id: 3, 
      nombre: 'Tecnologías', 
      enlace: '#tecnologías',
      icon: (
        <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
      )
    },
    { 
      id: 4, 
      nombre: 'Contacto', 
      enlace: '#contacto',
      icon: (
        <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      )
    },
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
              <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>Inicio</span>
              <svg className="nav-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
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
                {nav.icon}
                <span>{nav.nombre}</span>
                <svg className="nav-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"/>
                  <polyline points="7 7 17 7 17 17"/>
                </svg>
              </a>
            </li>
          ))}
          <li className="desktop-only">
            <Link to="/portfolio-completo" className="nav-item" onClick={closeMenu}>
              Portfolio Completo
            </Link>
          </li>
          <li className="desktop-only">
            <Link to="/panel-admin" className="nav-item" onClick={closeMenu}>
              Admin
            </Link>
          </li>
        </ul>

        <div className="nav-mobile-buttons">
          <Link to="/panel-admin" className="mobile-btn-outline" onClick={closeMenu}>
            Admin
          </Link>
          <Link to="/portfolio-completo" className="mobile-btn-filled" onClick={closeMenu}>
            Portfolio Completo
          </Link>
        </div>
      </div>
    </nav>
  );
}
