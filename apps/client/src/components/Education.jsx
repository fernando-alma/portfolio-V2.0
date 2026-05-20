import React, { useEffect, useState } from 'react';

export default function Education() {
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch experiences
    const fetchExp = fetch('/api/experience')
      .then((res) => {
        if (!res.ok) throw new Error('Error fetching experiences');
        return res.json();
      })
      .then((data) => {
        // Sort by order or date
        const sorted = data.sort((a, b) => (a.order || 0) - (b.order || 0));
        setExperiences(sorted);
      });

    // Fetch education & certifications
    const fetchEdu = fetch('/api/education')
      .then((res) => {
        if (!res.ok) throw new Error('Error fetching education');
        return res.json();
      })
      .then((data) => {
        const sorted = data.sort((a, b) => (a.order || 0) - (b.order || 0));
        setEducations(sorted.filter((item) => item.type === 'EDUCATION'));
        setCertifications(sorted.filter((item) => item.type === 'CERTIFICATION'));
      });

    Promise.all([fetchExp, fetchEdu])
      .then(() => setLoading(false))
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="body-container" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'white', fontSize: '1.2rem' }}>Cargando experiencia y educación...</p>
      </div>
    );
  }

  return (
    <div className="body-container" id="experiencia">
      <div className="timeline-container">
        {/* Experience Section */}
        {experiences.length > 0 && (
          <>
            <h2 className="section-title">Experiencia</h2>
            <div className="timeline">
              {experiences.map((exp) => (
                <div className="timeline-item" key={exp.id}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h3 className="role">
                      <i className="fas fa-briefcase"></i> {exp.role}
                    </h3>
                    <div className="company-date">
                      <p className="company">
                        <i className="fas fa-building"></i> {exp.company}
                      </p>
                      <span className="date">
                        <i className="fas fa-calendar-alt"></i> {exp.startDate} – {exp.endDate || 'Presente'}
                      </span>
                    </div>
                    <p className="description">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Education Section */}
        {educations.length > 0 && (
          <>
            <h2 className="section-title">Educación</h2>
            <div className="timeline">
              {educations.map((edu) => (
                <div className="timeline-item" key={edu.id}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h3 className="role">
                      <i className="fas fa-graduation-cap"></i> {edu.role}
                    </h3>
                    <div className="company-date">
                      <p className="company">
                        <i className="fas fa-university"></i> {edu.company}
                      </p>
                      <span className="date">
                        <i className="fas fa-calendar-alt"></i> {edu.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Certifications Section */}
        {certifications.length > 0 && (
          <>
            <h2 className="section-title">Certificaciones</h2>
            <div className="timeline">
              {certifications.map((cert) => (
                <div className="timeline-item" key={cert.id}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h3 className="role">
                      <i className="fas fa-certificate"></i> {cert.role}
                    </h3>
                    <div className="company-date">
                      <p className="company">
                        <i className="fas fa-building"></i> {cert.company}
                      </p>
                      <span className="date">
                        <i className="fas fa-calendar-alt"></i> {cert.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
