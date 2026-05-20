import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  const [profile, setProfile] = useState({
    profilePic: '',
    jobTitle: 'FullStack Developer',
    description: '',
    cvUrl: '',
    githubUrl: 'https://github.com/fernando-alma',
    linkedinUrl: 'https://www.linkedin.com/in/fernando-alma',
    whatsappUrl: 'https://wa.me/+5492615407274'
  });

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener perfil');
        return res.json();
      })
      .then((data) => {
        if (data) setProfile(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="about-section">
      <div className="content">
        {/* Left Side: Avatar & Action Buttons */}
        <div className="left-section">
          {profile.profilePic && (
            <img 
              className="profile-image" 
              src={profile.profilePic} 
              alt="Imagen de perfil de Fernando Gonzalo Alma Dileo" 
            />
          )}
          <p className="job-title">{profile.jobTitle}</p>

          <div className="buttons-container">
            {profile.cvUrl && (
              <a href={profile.cvUrl} download className="download-btn">
                Descargar CV
              </a>
            )}
            <Link to="/portfolio-completo" className="download-btn portfolio-btn">
              Ver portfolio completo
            </Link>
          </div>

          <div className="social-icons">
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="icon github" aria-label="GitHub">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="icon linkedin" aria-label="LinkedIn">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href={profile.whatsappUrl} target="_blank" rel="noopener noreferrer" className="icon whatsapp" aria-label="WhatsApp">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.167 1.45 4.887 1.455 5.4 0 9.794-4.382 9.797-9.768.002-2.607-1.01-5.059-2.85-6.902C16.642 2.096 14.195.84 11.593.84c-5.399 0-9.794 4.384-9.798 9.771-.001 1.83.493 3.616 1.432 5.176l-1.01 3.693 3.83-1.006zm13.883-7.56c-.296-.148-1.755-.866-2.027-.964-.271-.099-.468-.148-.666.149-.197.296-.764.964-.936 1.162-.172.196-.345.222-.64.074-.297-.148-1.255-.462-2.39-1.474-.883-.788-1.48-1.761-1.653-2.059-.172-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.148-.174.197-.297.296-.495.099-.198.05-.371-.025-.52-.075-.148-.666-1.608-.912-2.202-.24-.577-.482-.499-.666-.508-.172-.008-.37-.01-.567-.01s-.518.074-.79.37c-.272.296-1.037 1.014-1.037 2.474 0 1.462 1.062 2.873 1.21 3.071.148.198 2.092 3.194 5.068 4.482.708.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Right Side: Text & Bio */}
        <div className="right-section">
          <div className="about-info">
            <h1 className="title">Sobre mí</h1>
            <div className="description">
              {profile.description.split('\n\n').map((paragraph, index) => (
                <p key={index} style={{ marginBottom: '1.2rem' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
