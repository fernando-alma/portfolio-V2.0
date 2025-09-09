<template>
  <div class="body-container">
    <div class="timeline-container">
      <h2 class="section-title">Experiencia</h2>
      <div class="timeline">
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h3 class="role">
              <i class="fas fa-briefcase"></i> Programador Web FullStack
            </h3>
            <p class="company">
              <i class="fas fa-building"></i> Under Agency – Agencia de Marketing Digital
            </p>
            <span class="date">
              <i class="fas fa-calendar-alt"></i> Octubre 2022 – Marzo 2025
            </span>
            <p class="description">
              Lideré el desarrollo y maquetado de sitios web en WordPress, incluyendo landing pages, webs institucionales, inmobiliarias y tiendas e-commerce. 
              Gestioné servidores (WHM, cPanel), hosting, correos y DNS. Integré APIs, pasarelas de pago y personalicé backends con JetEngine. 
              Brindé soporte técnico, resolución de bugs y mejoras continuas, liderando además un equipo de dos desarrolladores en formación.
            </p>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h3 class="role">
              <i class="fas fa-briefcase"></i> Fundador y Programador Web FullStack
            </h3>
            <p class="company">
              <i class="fas fa-building"></i> Soulware – Marca personal
            </p>
            <span class="date">
              <i class="fas fa-calendar-alt"></i> Julio 2023 – Presente
            </span>
            <p class="description">
              Fundé Soulware, marca personal dedicada al desarrollo de soluciones web personalizadas para clientes locales e internacionales. 
              Gestiono proyectos de inicio a fin, incluyendo diseño UI/UX, desarrollo técnico, branding y presencia digital. 
              Algunos proyectos destacados: Termet, Vera Reciclados, Casita de Flor y Victoria.
            </p>
          </div>
        </div>
      </div>

      <h2 class="section-title">Educación</h2>
      <div class="timeline">
        <div class="timeline-item" v-for="(edu, index) in education" :key="index">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h3 class="role">
              <i class="fas fa-graduation-cap"></i> {{ edu.role }}
            </h3>
            <p class="company">
              <i class="fas fa-university"></i> {{ edu.company }}
            </p>
            <span class="date">
              <i class="fas fa-calendar-alt"></i> {{ edu.date }}
            </span>
          </div>
        </div>
      </div>

      <h2 class="section-title">Certificaciones</h2>
      <div class="timeline">
        <div class="timeline-item" v-for="(cert, index) in certifications" :key="index">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h3 class="role">
              <i class="fas fa-certificate"></i> {{ cert.role }}
            </h3>
            <p class="company">
              <i class="fas fa-building"></i> {{ cert.company }}
            </p>
            <span class="date">
              <i class="fas fa-calendar-alt"></i> {{ cert.date }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Experience",
  data() {
    return {
      education: [
        { role: "Tecnicatura Superior en Programación", company: "UTN – San Rafael", date: "2024 – 2025 (último semestre)" },
        { role: "Diplomatura en Programación Web – FullStack", company: "UTN – Buenos Aires", date: "2023 – 2024" },
        { role: "Ingeniería en Informática", company: "Universidad de Mendoza", date: "2022 – 2023 (parcial)" },
        { role: "Ingeniería Electrónica", company: "Universidad de Mendoza", date: "2014 – 2021 (parcial)" }
      ],
      certifications: [
        { role: "ONE | Tech Foundation – Especialización Back-End", company: "Oracle & Alura Latam", date: "2025 – Actualidad" },
        { role: "Fullstack Java", company: "Codo a Codo 4.0 – Gobierno de CABA", date: "2024" },
        { role: "Desarrollo Web Fullstack (Java)", company: "Egg Cooperation", date: "2021" }
      ]
    };
  }
};
</script>

<style scoped>
.body-container {
  max-width: 100%;
}

.timeline-container {
  max-width: 60%;
  margin: 0 auto;
  padding: 1.4rem;
}

.section-title {
  text-align: left;
  margin-top: 4rem;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: bold;
  background: linear-gradient(90deg, #fff, #ccc);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.timeline {
  position: relative;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 2px solid #ddd;
}

.timeline-item {
  margin-bottom: 2rem;
  position: relative;
}

.timeline-dot {
  position: absolute;
  left: -30px;
  top: 8px;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px rgba(50, 9, 199, 0.44);
}

.timeline-content {
  background: #3209c7;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.role {
  text-align: left;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #ffffff;
}

.company {
  text-align: left;
  font-size: 1.3rem;
  color: #ffffff;
  margin-bottom: 0.3rem;
}

.date {
  text-align: left;
  font-size: 1.1rem;
  color: #ffffff;
  margin-bottom: 0.8rem;
  display: block;
}

.description {
  text-align: left;
  font-size: 1.2rem;
  line-height: 1.5;
  color: #ffffff;
}

i {
  margin-right: 8px;
}
</style>


