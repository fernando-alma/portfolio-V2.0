import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SliderComponent from './SliderComponent';

export default function InfiniteSlider() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar proyectos');
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

  // Professional: agency !== 'Proyecto de estudio'
  // Study: agency === 'Proyecto de estudio'
  const professionalProjects = projects.filter(
    (p) => p.agency && p.agency !== 'Proyecto de estudio'
  );
  
  const studyProjects = projects.filter(
    (p) => p.agency === 'Proyecto de estudio'
  );

  if (loading) {
    return (
      <div className="sliders-section" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'white', fontSize: '1.2rem' }}>Cargando proyectos...</p>
      </div>
    );
  }

  return (
    <div className="sliders-section" id="proyectos">
      <div className="sliders-content-wrapper">
        {/* Section 1: Professional Projects */}
        <h2 className="section-title">Algunos de mis proyectos profesionales</h2>
        <p className="section-description">
          Proyectos profesionales realizados bajo mi marca personal Soulware y en colaboración con la agencia de marketing digital Under Agency.
        </p>
        <SliderComponent projects={professionalProjects} sliderId="professional" />

        {/* Section 2: Study Projects */}
        <h2 className="section-title" style={{ marginTop: '5rem' }}>Algunos de mis proyectos de estudio</h2>
        <p className="section-description">
          Proyectos académicos desarrollados con fines de aprendizaje y perfeccionamiento de habilidades técnicas.
        </p>
        <SliderComponent projects={studyProjects} sliderId="study" />

        {/* Button to catalog */}
        <div className="view-all-section">
          <Link to="/portfolio-completo" className="portfolio-btn">
            Ver portfolio completo
          </Link>
        </div>
      </div>
    </div>
  );
}
