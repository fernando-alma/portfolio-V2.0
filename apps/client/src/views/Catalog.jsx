import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Catalog() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = [
    { key: 'all', label: 'Todos', icon: '💼' },
    { key: 'wordpress', label: 'WordPress', icon: '📝' },
    { key: 'frontend', label: 'Frontend', icon: '💻' },
    { key: 'backend', label: 'Backend', icon: '⚙️' },
    { key: 'fullstack', label: 'Full Stack', icon: '🚀' }
  ];

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar catálogo');
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getAuthorDetails = (agency) => {
    const formatted = (agency || '').toUpperCase().trim();
    if (formatted === 'UNDER AGENCY') {
      return {
        name: 'UNDER Agency',
        role: 'Agencia de Marketing',
        avatar: '/uploads/underava.png'
      };
    } else if (formatted === 'SOULWARE') {
      return {
        name: 'Soulware',
        role: 'Marca Personal',
        avatar: '/uploads/soulava.png'
      };
    } else {
      return {
        name: 'Fernando Alma',
        role: 'Estudiante UTN',
        avatar: '/uploads/ferava.png'
      };
    }
  };

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter((p) => (p.category || '').toLowerCase() === activeFilter);

  if (loading) {
    return (
      <div className="catalog-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'white', fontSize: '1.2rem' }}>Cargando catálogo de proyectos...</p>
      </div>
    );
  }

  return (
    <div className="catalog-section">
      {/* Header */}
      <div className="catalog-header">
        <h1 className="section-title">Portfolio Completo</h1>
        <p className="catalog-subtitle">Explora todos mis proyectos organizados por categorías</p>
      </div>

      {/* Filter Tabs */}
      <div className="filters-container">
        {categories.map((cat) => {
          const count = cat.key === 'all'
            ? projects.length
            : projects.filter((p) => (p.category || '').toLowerCase() === cat.key).length;

          return (
            <button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              className={`filter-btn ${activeFilter === cat.key ? 'active' : ''}`}
            >
              <span style={{ marginRight: '6px' }}>{cat.icon}</span>
              {cat.label}
              <span style={{ marginLeft: '6px', fontSize: '0.8rem', opacity: 0.8 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Grid of Cards */}
      {filteredProjects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.6)' }}>
          <h3>No se encontraron proyectos</h3>
          <p>Intenta seleccionar otra categoría</p>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => {
            const author = getAuthorDetails(project.agency);
            return (
              <div className="project-card" key={project.id}>
                {/* Image & overlay */}
                <div className="image-wrapper">
                  <img src={project.image} alt={project.title} className="project-image" />
                  <span className="project-category">{project.categoryLabel || project.category}</span>
                </div>

                {/* Content */}
                <div className="card-content">
                  <div>
                    {/* Header: Agency tags */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                      <span className="project-category" style={{ position: 'static', padding: '2px 8px', fontSize: '0.7rem' }}>
                        {project.categoryLabel || project.category}
                      </span>
                      {project.agency && (
                        <span className="project-category" style={{ position: 'static', padding: '2px 8px', fontSize: '0.7rem', background: '#2754ff' }}>
                          {project.agency}
                        </span>
                      )}
                    </div>

                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description" style={{ minHeight: '60px' }}>{project.description}</p>

                    {/* Technologies list */}
                    <div className="project-tech" style={{ marginBottom: '1.5rem' }}>
                      {Array.isArray(project.technologies) 
                        ? project.technologies.join(', ') 
                        : project.technologies}
                    </div>
                  </div>

                  {/* Author Meta & Action button */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <img 
                        src={author.avatar} 
                        alt={author.name} 
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }} 
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a202c' }}>{author.name}</span>
                        <span style={{ fontSize: '0.7rem', color: '#718096' }}>{author.role}</span>
                      </div>
                    </div>
                    
                    <Link to={`/proyecto/${project.id}`} className="project-link-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                      Ver Detalle
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
