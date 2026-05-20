import React, { useState } from 'react';

export default function Contact() {
  const myLinkedIn = "https://www.linkedin.com/in/fernando-alma/";
  const myGitHub = "https://github.com/fernando-alma";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [feedback, setFeedback] = useState({
    show: false,
    isError: false,
    title: '',
    message: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const closeFeedback = () => {
    setFeedback((prev) => ({ ...prev, show: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/mdkwnyod', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFeedback({
          show: true,
          isError: false,
          title: '¡Mensaje Enviado!',
          message: 'Gracias por contactarme. Te responderé a la brevedad.'
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Hubo un problema con la respuesta del servidor.');
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setFeedback({
        show: true,
        isError: true,
        title: 'Error al Enviar',
        message: 'Lo siento, hubo un problema técnico. Por favor, intenta de nuevo o contáctame directamente por redes.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-section-wrapper" id="contacto">
      <div className="background-animation"></div>
      
      <div className="contact-container">
        <div className="main-title">
          <h2>Trabajemos Juntos</h2>
        </div>

        <div className="content-wrapper">
          {/* Left Column: Info */}
          <div className="contact-info">
            <h3>Ponte en Contacto</h3>
            <p className="intro-text">
              ¿Listo para dar vida a tus ideas? Hablemos sobre cómo podemos trabajar juntos para crear algo increíble. Siempre estoy abierto a nuevas oportunidades y proyectos interesantes.
            </p>
            <ul className="contact-links">
              <li>
                <a href={myLinkedIn} target="_blank" rel="noopener noreferrer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  <span>{myLinkedIn.replace('https://www.', '')}</span>
                </a>
              </li>
              <li>
                <a href={myGitHub} target="_blank" rel="noopener noreferrer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  <span>{myGitHub.replace('https://', '')}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Right Column: Form */}
          <div className="form-container">
            <form onSubmit={handleSubmit} className="contact-form">
              <h4>Enviar un Mensaje</h4>
              <div className="input-group">
                <input 
                  type="text" 
                  id="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Tu Nombre" 
                  required 
                />
              </div>
              <div className="input-group">
                <input 
                  type="email" 
                  id="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="Tu Email" 
                  required 
                />
              </div>
              <div className="input-group">
                <textarea 
                  id="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  rows={5} 
                  placeholder="Tu mensaje" 
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {feedback.show && (
        <div className="modal-overlay" onClick={closeFeedback}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ borderColor: feedback.isError ? '#e53e3e' : '' }}>
            <h4 style={{ color: feedback.isError ? '#e53e3e' : '#fff' }}>{feedback.title}</h4>
            <p>{feedback.message}</p>
            <button onClick={closeFeedback} className="close-btn" style={{ background: feedback.isError ? '#e53e3e' : '' }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
