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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="icon linkedin" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a href={profile.whatsappUrl} target="_blank" rel="noopener noreferrer" className="icon whatsapp" aria-label="WhatsApp">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.457 5.709 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
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
