import React from 'react';

export default function Technologies() {
  const techRow1 = [
    { name: "Java", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-plain.svg" },
    { name: "Spring Boot", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
    { name: "JavaScript", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg" },
    { name: "TypeScript", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-plain.svg" },
    { name: "Node.js", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-plain.svg" },
    { name: "Express", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
    { name: "Python", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-plain.svg" },
    { name: "Git", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-plain.svg" },
    { name: "GitHub", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  ];

  const techRow2 = [
    { name: "HTML5", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-plain.svg" },
    { name: "CSS3", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-plain.svg" },
    { name: "Sass", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" },
    { name: "React", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Vue.js", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
    { name: "WordPress", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg" },
    { name: "WooCommerce", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/woocommerce/woocommerce-plain.svg" },
    { name: "MySQL", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-plain-wordmark.svg" },
    { name: "PostgreSQL", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-plain-wordmark.svg" },
    { name: "Supabase", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" },
    { name: "MongoDB", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-plain.svg" },
  ];

  return (
    <section className="technologies-section" id="tecnologías">
      <h2>Mis Herramientas y Tecnologías</h2>

      {/* Row 1: Languages & Backend */}
      <div className="slider-container">
        <div 
          className="slider-track" 
          id="track1"
          style={{ 
            '--item-count': techRow1.length,
            'animationDuration': `${techRow1.length * 2.5}s`
          }}
        >
          {/* Original list */}
          {techRow1.map((tech) => (
            <div className="tech-item" key={tech.name}>
              <div className="logo-wrapper">
                <img src={tech.logoUrl} alt={tech.name} />
              </div>
              <p>{tech.name}</p>
            </div>
          ))}
          {/* Cloned list for infinite loop */}
          {techRow1.map((tech) => (
            <div className="tech-item" key={`${tech.name}-clone`} aria-hidden="true">
              <div className="logo-wrapper">
                <img src={tech.logoUrl} alt={tech.name} />
              </div>
              <p>{tech.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Frontend & Databases */}
      <div className="slider-container">
        <div 
          className="slider-track" 
          id="track2"
          style={{ 
            '--item-count': techRow2.length,
            'animationDuration': `${techRow2.length * 2.8}s`
          }}
        >
          {/* Original list */}
          {techRow2.map((tech) => (
            <div className="tech-item" key={tech.name}>
              <div className="logo-wrapper">
                <img src={tech.logoUrl} alt={tech.name} />
              </div>
              <p>{tech.name}</p>
            </div>
          ))}
          {/* Cloned list for infinite loop */}
          {techRow2.map((tech) => (
            <div className="tech-item" key={`${tech.name}-clone`} aria-hidden="true">
              <div className="logo-wrapper">
                <img src={tech.logoUrl} alt={tech.name} />
              </div>
              <p>{tech.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
