import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function SliderComponent({ projects, sliderId }) {
  if (!projects || projects.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.6)' }}>
        No hay proyectos disponibles en esta categoría.
      </div>
    );
  }

  return (
    <div className="infinite-slider-container" id={sliderId}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        loop={projects.length >= 3}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={true}
        pagination={{ clickable: true }}
        breakpoints={{
          480: {
            slidesPerView: 1,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        }}
        className="swiper-container"
      >
        {projects.map((project) => (
          <SwiperSlide key={project.id}>
            <div className="project-card">
              <div className="image-wrapper">
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-image"
                  loading="lazy"
                />
                <span className="project-category">{project.categoryLabel || project.category}</span>
              </div>
              <div className="card-content">
                <div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <p className="project-tech">
                    {Array.isArray(project.technologies) 
                      ? project.technologies.join(', ') 
                      : project.technologies}
                  </p>
                </div>
                <Link to={`/proyecto/${project.id}`} className="project-link-btn">
                  Ver detalle
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
