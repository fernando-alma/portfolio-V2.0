<template>
  <div class="contact-section-wrapper">
    <!-- El fondo original se mantiene aquí, fuera del contenedor principal -->
    <div class="background-animation"></div>
    
    <div class="contact-container">
      <div class="main-title">
        <h2>Trabajemos Juntos</h2>
      </div>

      <div class="content-wrapper">
        <!-- Columna Izquierda: Información de contacto -->
        <div class="contact-info">
          <h3>Ponte en Contacto</h3>
          <p class="intro-text">
            ¿Listo para dar vida a tus ideas? Hablemos sobre cómo podemos trabajar juntos para crear algo increíble. Siempre estoy abierto a nuevas oportunidades y proyectos interesantes.
          </p>
          <ul class="contact-links">
            <li>
              <a :href="'mailto:' + myEmail">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span>{{ myEmail }}</span>
              </a>
            </li>
            <li>
              <a :href="myLinkedIn" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                <span>{{ myLinkedIn.replace('https://www.', '') }}</span>
              </a>
            </li>
            <li>
              <a :href="myGitHub" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                <span>{{ myGitHub.replace('https://', '') }}</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Columna Derecha: Formulario -->
        <div class="form-container">
          <form @submit.prevent="handleSubmit" class="contact-form">
            <h4>Enviar un Mensaje</h4>
            <div class="input-group">
              <input type="text" id="name" v-model="formData.name" placeholder="Tu Nombre" required />
            </div>
            <div class="input-group">
              <input type="email" id="email" v-model="formData.email" placeholder="Tu Email" required />
            </div>
            <div class="input-group">
              <textarea id="message" v-model="formData.message" rows="5" placeholder="Tu mensaje" required></textarea>
            </div>
            <button type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Enviando...' : 'Enviar Mensaje' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Feedback -->
    <div v-if="feedback.show" class="modal-overlay" @click="closeFeedback">
      <div class="modal-content" @click.stop :class="{ 'is-error': feedback.isError }">
        <h4>{{ feedback.title }}</h4>
        <p>{{ feedback.message }}</p>
        <button @click="closeFeedback" class="close-btn">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactSection",
  data() {
    return {
      // Reemplaza con tus datos reales
      myEmail: "fernando.g.dileo@email.com",
      myLinkedIn: "https://www.linkedin.com/in/fernando-dileo/",
      myGitHub: "https://github.com/tu-usuario",
      
      isSubmitting: false,
      formData: {
        name: '',
        email: '',
        message: '',
      },
      feedback: {
        show: false,
        isError: false,
        title: '',
        message: '',
      }
    };
  },
  methods: {
    async handleSubmit() {
      this.isSubmitting = true;

      try {
        const response = await fetch('https://formspree.io/f/TU_ENDPOINT_DE_FORMSPREE', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: JSON.stringify(this.formData)
        });

        if (response.ok) {
          this.showFeedback(false, '¡Mensaje Enviado!', 'Gracias por contactarme, Fernando. Te responderé a la brevedad.');
          // Limpiar formulario
          this.formData.name = '';
          this.formData.email = '';
          this.formData.message = '';
        } else {
          throw new Error('Hubo un problema con la respuesta del servidor.');
        }
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
        this.showFeedback(true, 'Error al Enviar', 'Lo siento, hubo un problema técnico. Por favor, intenta de nuevo o contáctame directamente por email.');
      } finally {
        this.isSubmitting = false;
      }
    },
    showFeedback(isError, title, message) {
      this.feedback = {
        show: true,
        isError,
        title,
        message
      };
    },
    closeFeedback() {
      this.feedback.show = false;
    }
  }
};
</script>

<style scoped>
/* Estilos del contenedor principal y fondo */
.contact-section-wrapper {
  position: relative;
  width: 100%;
  font-family: 'Montserrat', sans-serif;
  padding: 3rem 2rem; /* Espaciado generoso */
  
  overflow: hidden; /* Clave para que el fondo no se desborde */
}

.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1248%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='url(%26quot%3b%23SvgjsLinearGradient1249%26quot%3b)'%3e%3c/rect%3e%3cpath d='M-85.16 377.31L-85.16 377.31' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M-85.16 377.31L71.06 402.18' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M-85.16 377.31L-71.68 558.36' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M-71.68 558.36L-71.68 558.36' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M-71.68 558.36L-48.22 675.35' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M-71.68 558.36L95.27 657.03' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M-48.22 675.35L-48.22 675.35' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M-48.22 675.35L95.27 657.03' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M-48.22 675.35L203.38 674.06' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M-48.22 675.35L71.06 402.18' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M71.06 402.18L71.06 402.18' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M71.06 402.18L224.77 525.55' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M71.06 402.18L-71.68 558.36' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M71.06 402.18L95.27 657.03' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M71.06 402.18L344.63 392.04' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M95.27 657.03L95.27 657.03' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M95.27 657.03L203.38 674.06' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M95.27 657.03L224.77 525.55' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M224.77 525.55L224.77 525.55' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M224.77 525.55L358.78 544.97' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M224.77 525.55L203.38 674.06' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M224.77 525.55L344.63 392.04' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M203.38 674.06L203.38 674.06' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M203.38 674.06L364.58 687.93' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M203.38 674.06L358.78 544.97' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M203.38 674.06L-71.68 558.36' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M344.63 392.04L344.63 392.04' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M344.63 392.04L358.78 544.97' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M344.63 392.04L530.78 541.81' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M358.78 544.97L358.78 544.97' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M358.78 544.97L364.58 687.93' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M358.78 544.97L530.78 541.81' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M364.58 687.93L364.58 687.93' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M364.58 687.93L531.31 677.21' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M364.58 687.93L224.77 525.55' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M530.78 541.81L530.78 541.81' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M530.78 541.81L531.31 677.21' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M530.78 541.81L666.33 552.31' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M530.78 541.81L646.16 677.8' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M531.31 677.21L531.31 677.21' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M531.31 677.21L646.16 677.8' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M531.31 677.21L666.33 552.31' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M531.31 677.21L358.78 544.97' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M643.13 225.5L643.13 225.5' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M643.13 225.5L659.93 401.7' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M659.93 401.7L659.93 401.7' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M659.93 401.7L807.12 400.25' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M666.33 552.31L666.33 552.31' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M666.33 552.31L646.16 677.8' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M666.33 552.31L659.93 401.7' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M666.33 552.31L826.05 544.14' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M646.16 677.8L646.16 677.8' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M860.49 79.39L860.49 79.39' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M860.49 79.39L858.69 199.42' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M860.49 79.39L981.17 60.5' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M860.49 79.39L969.31 223.11' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M860.49 79.39L995.35 -81.02' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M860.49 79.39L1107.24 87.26' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M860.49 79.39L643.13 225.5' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M858.69 199.42L858.69 199.42' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M858.69 199.42L969.31 223.11' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M858.69 199.42L981.17 60.5' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M858.69 199.42L983.07 349.71' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M858.69 199.42L807.12 400.25' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M858.69 199.42L643.13 225.5' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M807.12 400.25L807.12 400.25' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M807.12 400.25L826.05 544.14' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M807.12 400.25L983.07 349.71' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M807.12 400.25L666.33 552.31' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M826.05 544.14L826.05 544.14' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M826.05 544.14L824.93 702.68' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M824.93 702.68L824.93 702.68' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M824.93 702.68L961.8 705.98' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M824.93 702.68L646.16 677.8' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M824.93 702.68L666.33 552.31' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M995.35 -81.02L995.35 -81.02' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M995.35 -81.02L981.17 60.5' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M995.35 -81.02L1107.24 87.26' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M995.35 -81.02L1240.71 -92.7' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M981.17 60.5L981.17 60.5' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M981.17 60.5L1107.24 87.26' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M981.17 60.5L969.31 223.11' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M969.31 223.11L969.31 223.11' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M969.31 223.11L983.07 349.71' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M969.31 223.11L1128.35 231.56' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M969.31 223.11L1107.24 87.26' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M983.07 349.71L983.07 349.71' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M983.07 349.71L993.96 498.55' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M993.96 498.55L993.96 498.55' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M993.96 498.55L1124.81 560.26' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M993.96 498.55L826.05 544.14' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M993.96 498.55L1151.25 390.06' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M961.8 705.98L961.8 705.98' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M961.8 705.98L1156.94 645.38' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M961.8 705.98L993.96 498.55' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M961.8 705.98L826.05 544.14' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M961.8 705.98L1124.81 560.26' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1107.24 87.26L1107.24 87.26' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1107.24 87.26L1128.35 231.56' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1107.24 87.26L1283.05 90.4' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1128.35 231.56L1128.35 231.56' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1151.25 390.06L1151.25 390.06' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1151.25 390.06L1128.35 231.56' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1151.25 390.06L1124.81 560.26' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1151.25 390.06L983.07 349.71' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1124.81 560.26L1124.81 560.26' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1124.81 560.26L1156.94 645.38' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1124.81 560.26L1280.88 544.88' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1156.94 645.38L1156.94 645.38' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1240.71 -92.7L1240.71 -92.7' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1240.71 -92.7L1394.86 -67.42' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1240.71 -92.7L1283.05 90.4' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1240.71 -92.7L1107.24 87.26' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1240.71 -92.7L1452.09 83.5' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1283.05 90.4L1283.05 90.4' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1283.05 90.4L1452.09 83.5' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1283.05 90.4L1394.86 -67.42' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1283.05 90.4L1437.16 209.39' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1283.05 90.4L1128.35 231.56' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1280.88 544.88L1280.88 544.88' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1280.88 544.88L1424.72 492.65' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1280.88 544.88L1156.94 645.38' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1280.88 544.88L1151.25 390.06' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1280.88 544.88L1445.02 690.63' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1394.86 -67.42L1394.86 -67.42' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1394.86 -67.42L1452.09 83.5' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1394.86 -67.42L1537.84 45.92' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1394.86 -67.42L1603.28 -104.86' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1452.09 83.5L1452.09 83.5' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1452.09 83.5L1537.84 45.92' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1452.09 83.5L1437.16 209.39' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1437.16 209.39L1437.16 209.39' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1437.16 209.39L1543.74 257.65' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1437.16 209.39L1433.62 384.05' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1437.16 209.39L1537.84 45.92' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1433.62 384.05L1433.62 384.05' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1433.62 384.05L1424.72 492.65' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1433.62 384.05L1543.74 257.65' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1424.72 492.65L1424.72 492.65' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1424.72 492.65L1583.73 552.46' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1445.02 690.63L1445.02 690.63' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1445.02 690.63L1559.81 677' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1445.02 690.63L1583.73 552.46' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1445.02 690.63L1424.72 492.65' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1445.02 690.63L1156.94 645.38' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1445.02 690.63L1433.62 384.05' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1603.28 -104.86L1603.28 -104.86' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1603.28 -104.86L1537.84 45.92' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1603.28 -104.86L1452.09 83.5' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1537.84 45.92L1537.84 45.92' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1537.84 45.92L1543.74 257.65' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1537.84 45.92L1283.05 90.4' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1543.74 257.65L1543.74 257.65' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1543.74 257.65L1609.29 391.67' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1543.74 257.65L1452.09 83.5' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1543.74 257.65L1424.72 492.65' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1609.29 391.67L1609.29 391.67' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1609.29 391.67L1583.73 552.46' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1609.29 391.67L1433.62 384.05' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1583.73 552.46L1583.73 552.46' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1583.73 552.46L1559.81 677' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1583.73 552.46L1433.62 384.05' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1583.73 552.46L1543.74 257.65' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1559.81 677L1559.81 677' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1559.81 677L1424.72 492.65' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1559.81 677L1609.29 391.67' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1559.81 677L1280.88 544.88' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1559.81 677L1433.62 384.05' stroke='%23132e65' stroke-width='1.5'%3e%3c/path%3e%3ccircle r='5' cx='-85.16' cy='377.31' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='-71.68' cy='558.36' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='-48.22' cy='675.35' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='71.06' cy='402.18' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='95.27' cy='657.03' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='224.77' cy='525.55' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='203.38' cy='674.06' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='344.63' cy='392.04' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='358.78' cy='544.97' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='364.58' cy='687.93' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='530.78' cy='541.81' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='531.31' cy='677.21' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='643.13' cy='225.5' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='659.93' cy='401.7' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='666.33' cy='552.31' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='646.16' cy='677.8' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='860.49' cy='79.39' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='858.69' cy='199.42' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='807.12' cy='400.25' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='826.05' cy='544.14' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='824.93' cy='702.68' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='995.35' cy='-81.02' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='981.17' cy='60.5' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='969.31' cy='223.11' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='983.07' cy='349.71' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='993.96' cy='498.55' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='961.8' cy='705.98' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='1107.24' cy='87.26' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='1128.35' cy='231.56' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='1151.25' cy='390.06' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='1124.81' cy='560.26' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='1156.94' cy='645.38' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='1240.71' cy='-92.7' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='1283.05' cy='90.4' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='1280.88' cy='544.88' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='1394.86' cy='-67.42' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='1452.09' cy='83.5' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='1437.16' cy='209.39' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='1433.62' cy='384.05' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='1424.72' cy='492.65' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='1445.02' cy='690.63' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='1603.28' cy='-104.86' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='1537.84' cy='45.92' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='1543.74' cy='257.65' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='1609.29' cy='391.67' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='1583.73' cy='552.46' fill='%23132e65'%3e%3c/circle%3e%3ccircle r='5' cx='1559.81' cy='677' fill='%23132e65'%3e%3c/circle%3e%3cpath d='M-87.85 670.58L-87.85 670.58' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M-87.85 670.58L-73.36 552.63' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M-87.85 670.58L41.65 670.83' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M-87.85 670.58L59.25 525.1' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M-87.85 670.58L241.53 639.77' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M59.25 525.1L59.25 525.1' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M59.25 525.1L-73.36 552.63' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M59.25 525.1L41.65 670.83' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M59.25 525.1L241.53 639.77' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M340.12 700.89L340.12 700.89' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M340.12 700.89L241.53 639.77' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M340.12 700.89L373.4 561.62' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M340.12 700.89L529.74 536.97' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M340.12 700.89L41.65 670.83' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M340.12 700.89L667.35 699.96' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1111.19 258.13L1111.19 258.13' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1111.19 258.13L1121.27 382.43' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1111.19 258.13L1276.37 250.91' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1111.19 258.13L971.11 361.79' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1111.19 258.13L1271.84 356.14' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1593.05 391.86L1593.05 391.86' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1593.05 391.86L1585.82 259.17' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1593.05 391.86L1569.85 543.31' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1573.81 704.5L1573.81 704.5' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1573.81 704.5L1433.78 641.54' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1573.81 704.5L1569.85 543.31' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1573.81 704.5L1423.5 505.74' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1573.81 704.5L1278.05 659.8' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1573.81 704.5L1593.05 391.86' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1573.81 704.5L1418.77 393.7' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M-73.36 552.63L-73.36 552.63' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M-73.36 552.63L41.65 670.83' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M-73.36 552.63L241.53 639.77' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M-73.36 552.63L340.12 700.89' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M41.65 670.83L41.65 670.83' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M241.53 639.77L241.53 639.77' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M241.53 639.77L373.4 561.62' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M241.53 639.77L41.65 670.83' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M241.53 639.77L529.74 536.97' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M373.4 561.62L373.4 561.62' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M529.74 536.97L529.74 536.97' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M529.74 536.97L666.11 537.36' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M529.74 536.97L373.4 561.62' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M654.29 390.26L654.29 390.26' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M654.29 390.26L666.11 537.36' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M654.29 390.26L843.01 393.32' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M654.29 390.26L529.74 536.97' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M654.29 390.26L836.38 557.98' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M654.29 390.26L667.35 699.96' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M666.11 537.36L666.11 537.36' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M666.11 537.36L667.35 699.96' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M666.11 537.36L836.38 557.98' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M666.11 537.36L843.01 393.32' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M667.35 699.96L667.35 699.96' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M667.35 699.96L850.34 699.43' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M843.01 393.32L843.01 393.32' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M843.01 393.32L971.11 361.79' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M843.01 393.32L959.8 496.82' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M843.01 393.32L836.38 557.98' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M836.38 557.98L836.38 557.98' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M836.38 557.98L959.8 496.82' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M836.38 557.98L850.34 699.43' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M836.38 557.98L667.35 699.96' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M836.38 557.98L1008.59 702.84' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M850.34 699.43L850.34 699.43' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M850.34 699.43L1008.59 702.84' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M850.34 699.43L959.8 496.82' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M850.34 699.43L666.11 537.36' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M850.34 699.43L1097.28 707.75' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M971.11 361.79L971.11 361.79' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M971.11 361.79L959.8 496.82' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M971.11 361.79L1121.27 382.43' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M971.11 361.79L1098.01 535.15' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M971.11 361.79L836.38 557.98' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M959.8 496.82L959.8 496.82' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M959.8 496.82L1098.01 535.15' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M959.8 496.82L1121.27 382.43' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1008.59 702.84L1008.59 702.84' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1008.59 702.84L1097.28 707.75' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1008.59 702.84L1098.01 535.15' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1121.27 382.43L1121.27 382.43' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1121.27 382.43L1271.84 356.14' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1121.27 382.43L1098.01 535.15' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1098.01 535.15L1098.01 535.15' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1098.01 535.15L1097.28 707.75' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1098.01 535.15L1300.6 487.87' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1097.28 707.75L1097.28 707.75' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1097.28 707.75L1278.05 659.8' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1097.28 707.75L959.8 496.82' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1097.28 707.75L1300.6 487.87' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1243.78 -51.71L1243.78 -51.71' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1243.78 -51.71L1294.4 44.98' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1243.78 -51.71L1461.77 -108.15' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1243.78 -51.71L1457.67 63.51' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1243.78 -51.71L1276.37 250.91' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1243.78 -51.71L1111.19 258.13' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1294.4 44.98L1294.4 44.98' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1294.4 44.98L1457.67 63.51' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1276.37 250.91L1276.37 250.91' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1276.37 250.91L1271.84 356.14' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1276.37 250.91L1437.1 227.81' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1271.84 356.14L1271.84 356.14' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1271.84 356.14L1300.6 487.87' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1271.84 356.14L1418.77 393.7' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1300.6 487.87L1300.6 487.87' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1300.6 487.87L1423.5 505.74' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1300.6 487.87L1418.77 393.7' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1278.05 659.8L1278.05 659.8' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1278.05 659.8L1433.78 641.54' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1278.05 659.8L1300.6 487.87' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1278.05 659.8L1423.5 505.74' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1461.77 -108.15L1461.77 -108.15' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1461.77 -108.15L1590.79 -74.18' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1461.77 -108.15L1457.67 63.51' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1457.67 63.51L1457.67 63.51' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1457.67 63.51L1609.68 79.99' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1437.1 227.81L1437.1 227.81' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1437.1 227.81L1585.82 259.17' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1437.1 227.81L1457.67 63.51' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1437.1 227.81L1418.77 393.7' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1437.1 227.81L1271.84 356.14' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1437.1 227.81L1593.05 391.86' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1418.77 393.7L1418.77 393.7' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1418.77 393.7L1423.5 505.74' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1418.77 393.7L1593.05 391.86' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1418.77 393.7L1276.37 250.91' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1423.5 505.74L1423.5 505.74' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1433.78 641.54L1433.78 641.54' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1433.78 641.54L1423.5 505.74' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1590.79 -74.18L1590.79 -74.18' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1590.79 -74.18L1609.68 79.99' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1590.79 -74.18L1457.67 63.51' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1590.79 -74.18L1294.4 44.98' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1590.79 -74.18L1585.82 259.17' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1609.68 79.99L1609.68 79.99' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1609.68 79.99L1585.82 259.17' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1585.82 259.17L1585.82 259.17' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1585.82 259.17L1418.77 393.7' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1585.82 259.17L1457.67 63.51' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1585.82 259.17L1569.85 543.31' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1569.85 543.31L1569.85 543.31' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1569.85 543.31L1423.5 505.74' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1569.85 543.31L1433.78 641.54' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3cpath d='M1569.85 543.31L1418.77 393.7' stroke='hsl(228.5%2c 77.2%25%2c 51.5%25)' stroke-width='1.5'%3e%3c/path%3e%3ccircle r='25' cx='-87.85' cy='670.58' fill='url(%26quot%3b%23SvgjsRadialGradient1250%26quot%3b)'%3e%3c/circle%3e%3ccircle r='25' cx='59.25' cy='525.1' fill='url(%26quot%3b%23SvgjsRadialGradient1250%26quot%3b)'%3e%3c/circle%3e%3ccircle r='25' cx='340.12' cy='700.89' fill='url(%26quot%3b%23SvgjsRadialGradient1250%26quot%3b)'%3e%3c/circle%3e%3ccircle r='25' cx='1111.19' cy='258.13' fill='url(%26quot%3b%23SvgjsRadialGradient1250%26quot%3b)'%3e%3c/circle%3e%3ccircle r='25' cx='1593.05' cy='391.86' fill='url(%26quot%3b%23SvgjsRadialGradient1250%26quot%3b)'%3e%3c/circle%3e%3ccircle r='25' cx='1573.81' cy='704.5' fill='url(%26quot%3b%23SvgjsRadialGradient1250%26quot%3b)'%3e%3c/circle%3e%3ccircle r='5' cx='-73.36' cy='552.63' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='41.65' cy='670.83' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='241.53' cy='639.77' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='373.4' cy='561.62' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='529.74' cy='536.97' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='654.29' cy='390.26' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='666.11' cy='537.36' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='667.35' cy='699.96' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='843.01' cy='393.32' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='836.38' cy='557.98' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='850.34' cy='699.43' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='971.11' cy='361.79' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='959.8' cy='496.82' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='1008.59' cy='702.84' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='1121.27' cy='382.43' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='1098.01' cy='535.15' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='1097.28' cy='707.75' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='1243.78' cy='-51.71' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='1294.4' cy='44.98' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='1276.37' cy='250.91' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='1271.84' cy='356.14' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='1300.6' cy='487.87' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='1278.05' cy='659.8' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='1461.77' cy='-108.15' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='1457.67' cy='63.51' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='1437.1' cy='227.81' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='1418.77' cy='393.7' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='1423.5' cy='505.74' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='1433.78' cy='641.54' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='1590.79' cy='-74.18' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='1609.68' cy='79.99' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='1585.82' cy='259.17' fill='%238b9ad9'%3e%3c/circle%3e%3ccircle r='5' cx='1569.85' cy='543.31' fill='%238b9ad9'%3e%3c/circle%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1248'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3clinearGradient x1='15.28%25' y1='-39.29%25' x2='84.72%25' y2='139.29%25' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1249'%3e%3cstop stop-color='%230e2a47' offset='0'%3e%3c/stop%3e%3cstop stop-color='rgba(22%2c 4%2c 94%2c 1)' offset='1'%3e%3c/stop%3e%3c/linearGradient%3e%3cradialGradient id='SvgjsRadialGradient1250'%3e%3cstop stop-color='white' offset='0.1'%3e%3c/stop%3e%3cstop stop-color='%231735b3' offset='0.2'%3e%3c/stop%3e%3cstop stop-color='rgba(23%2c 53%2c 179%2c 0)' offset='1'%3e%3c/stop%3e%3c/radialGradient%3e%3c/defs%3e%3c/svg%3e");
  background-size: cover;
  background-position: center;
}

.contact-container {
  max-width: 1100px;
  margin: 0 auto;
  color: #e0e0e0;
  
}

.main-title {
  text-align: center;
  font-size: 1.3rem;
  margin-bottom: 3rem;
  font-weight: 700;
}

.content-wrapper {
  display: flex;
  gap: 3rem;
}

/* Columna Izquierda: Información */
.contact-info {
  flex: 1;
}

.contact-info h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.intro-text {
  line-height: 1.6;
  color: #b0b0b0;
  margin-bottom: 2rem;
}

.contact-links {
  list-style: none;
  padding: 0;
}

.contact-links li {
  margin-bottom: 1rem;
}

.contact-links a {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #e0e0e0;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-links a:hover {
  color: #6c63ff;
}

.contact-links svg {
  width: 24px;
  height: 24px;
}

/* Columna Derecha: Formulario */
.form-container {
  flex: 1;
  background-color: #14095bcd;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  color: #fff;
  border: #006affd2 1px solid;
}

.contact-form h4 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group input,
.input-group textarea {
  width: 95%;
  padding: 0.8rem;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  background-color: #f9f9f9;
  color: #333;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-group input:focus,
.input-group textarea:focus {
  outline: none;
  border-color: #6c63ff;
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
}

textarea {
  resize: vertical;
}

button[type="submit"] {
  width: 100%;
  padding: 1rem;
  background-color: #3209c7;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #3209c7c2;
  transform: translateY(-2px);
}

button[type="submit"]:disabled {
  background-color: #555;
  cursor: not-allowed;
}

/* Modal de Feedback */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  color: #333;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.modal-content h4 {
  margin-top: 0;
  font-size: 1.5rem;
  color: #00b894; /* Color de éxito */
}

.modal-content.is-error h4 {
  color: #d63031; /* Color de error */
}

.modal-content .close-btn {
  margin-top: 1.5rem;
  padding: 0.6rem 1.5rem;
  background-color: #1a1a2e;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* Estilos Responsivos */
@media (max-width: 768px) {
  .contact-section-wrapper {
    padding: 2rem 1rem;
  }
  .content-wrapper {
    flex-direction: column;
    gap: 2rem;
  }
  .main-title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
}
</style>