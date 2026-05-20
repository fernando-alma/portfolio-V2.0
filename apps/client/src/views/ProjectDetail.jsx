import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Proyecto no encontrado');
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setActiveImage(data.image);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  if (loading) {
    return (
      <div className="project-detail-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'white', fontSize: '1.2rem' }}>Cargando detalles del proyecto...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-section" style={{ minHeight: '60vh', textAlign: 'center', padding: '4rem' }}>
        <h2 style={{ color: '#e53e3e', marginBottom: '1.5rem' }}>Proyecto no encontrado</h2>
        <Link to="/portfolio-completo" className="back-link">
          <i className="fas fa-arrow-left"></i> Volver al catálogo
        </Link>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(project.youtubeUrl);

  return (
    <div className="project-detail-section">
      <Link to="/portfolio-completo" className="back-link">
        <i className="fas fa-arrow-left"></i> Volver al catálogo
      </Link>

      <div className="detail-header">
        <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>{project.title}</h1>
        <div className="project-meta">
          <span>
            <i className="fas fa-folder"></i> {project.categoryLabel || project.category}
          </span>
          {project.agency && (
            <span className="agency">
              <i className="fas fa-building"></i> {project.agency}
            </span>
          )}
        </div>
      </div>

      {/* Main Media Display */}
      <div className="media-container">
        {embedUrl ? (
          <div className="video-wrapper">
            <iframe
              src={embedUrl}
              title={`YouTube video player for ${project.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <img src={activeImage} alt={project.title} className="main-image" />
        )}
      </div>

      {/* Gallery Section */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="gallery-container">
          <h3>Galería de Imágenes</h3>
          <div className="gallery-grid">
            {/* Include main image in gallery */}
            <img 
              src={project.image} 
              alt="Miniatura" 
              className={`gallery-img ${activeImage === project.image && !embedUrl ? 'active' : ''}`}
              onClick={() => {
                setActiveImage(project.image);
                // Clear youtube embed view focus if clicking images
                if (project.youtubeUrl) {
                  // Trigger state refresh by mutating activeImage
                }
              }} 
            />
            {project.gallery.map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt={`${project.title} captura ${index + 1}`}
                className={`gallery-img ${activeImage === imgUrl ? 'active' : ''}`}
                onClick={() => setActiveImage(imgUrl)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Content Columns */}
      <div className="project-body">
        {/* Left Column: Description */}
        <div className="description-col">
          <h3>Descripción</h3>
          <p>{project.longDescription || project.description}</p>
        </div>

        {/* Right Column: Stacks & Links */}
        <div className="info-col">
          <h4>Tecnologías</h4>
          <div className="tech-tags">
            {project.technologies.map((tech) => (
              <span className="tech-tag" key={tech}>
                {tech}
              </span>
            ))}
          </div>

          <div className="action-buttons">
            {project.webUrl && project.webUrl !== '#' && (
              <a href={project.webUrl} target="_blank" rel="noopener noreferrer" className="action-btn primary">
                <i className="fas fa-external-link-alt"></i> Visitar Sitio Web
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="action-btn secondary">
                <i className="fab fa-github"></i> Ver Código en GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
