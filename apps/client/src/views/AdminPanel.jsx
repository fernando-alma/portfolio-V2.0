import React, { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('projects');

  // Core data states
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);

  // Loading and feedback states
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  // Modal States
  const [projectModal, setProjectModal] = useState({ open: false, mode: 'create', data: null });
  const [expModal, setExpModal] = useState({ open: false, mode: 'create', data: null });
  const [eduModal, setEduModal] = useState({ open: false, mode: 'create', data: null });

  // Form Fields
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'wordpress',
    categoryLabel: 'WordPress',
    agency: '',
    description: '',
    longDescription: '',
    technologies: '',
    image: '',
    gallery: '',
    youtubeUrl: '',
    githubUrl: '',
    webUrl: ''
  });

  const [profileForm, setProfileForm] = useState({
    profilePic: '',
    jobTitle: '',
    description: '',
    cvUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    whatsappUrl: ''
  });

  const [expForm, setExpForm] = useState({
    role: '',
    company: '',
    description: '',
    startDate: '',
    endDate: '',
    order: 0
  });

  const [eduForm, setEduForm] = useState({
    role: '',
    company: '',
    date: '',
    type: 'EDUCATION',
    order: 0
  });

  // Verify token on mount
  useEffect(() => {
    if (token) {
      fetch('/api/profile')
        .then((res) => {
          if (res.status === 401) {
            handleLogout();
          }
        });
    }
  }, [token]);

  // Load active tab data
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setFeedback({ message: '', type: '' });

    let fetchPromise = Promise.resolve();

    if (activeTab === 'projects') {
      fetchPromise = fetch('/api/projects')
        .then((res) => res.json())
        .then((data) => setProjects(data));
    } else if (activeTab === 'profile') {
      fetchPromise = fetch('/api/profile')
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
          if (data) {
            setProfileForm({
              profilePic: data.profilePic || '',
              jobTitle: data.jobTitle || '',
              description: data.description || '',
              cvUrl: data.cvUrl || '',
              githubUrl: data.githubUrl || '',
              linkedinUrl: data.linkedinUrl || '',
              whatsappUrl: data.whatsappUrl || ''
            });
          }
        });
    } else if (activeTab === 'experience') {
      fetchPromise = fetch('/api/experience')
        .then((res) => res.json())
        .then((data) => setExperiences(data.sort((a, b) => (a.order || 0) - (b.order || 0))));
    } else if (activeTab === 'education') {
      fetchPromise = fetch('/api/education')
        .then((res) => res.json())
        .then((data) => setEducation(data.sort((a, b) => (a.order || 0) - (b.order || 0))));
    }

    fetchPromise
      .catch((err) => showFeedback('Error al cargar datos: ' + err.message, 'error'))
      .finally(() => setLoading(false));
  }, [token, activeTab]);

  const showFeedback = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Credenciales inválidas');
      }
      localStorage.setItem('token', data.token);
      setToken(data.token);
      showFeedback('Sesión iniciada con éxito');
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUsername('');
    setPassword('');
  };

  // Helper for file uploads
  const handleFileUpload = async (e, onUploadSuccess) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      showFeedback('Subiendo archivo...', 'info');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al subir archivo');
      onUploadSuccess(data.url);
      showFeedback('Archivo subido con éxito');
    } catch (err) {
      showFeedback('Error de subida: ' + err.message, 'error');
    }
  };

  // Profile Submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });
      if (!res.ok) throw new Error('Error al actualizar perfil');
      showFeedback('Perfil actualizado con éxito');
    } catch (err) {
      showFeedback(err.message, 'error');
    }
  };

  // Project Submit
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...projectForm,
      technologies: projectForm.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      gallery: projectForm.gallery ? projectForm.gallery.split(',').map((g) => g.trim()).filter(Boolean) : []
    };

    const url = projectModal.mode === 'create' ? '/api/projects' : `/api/projects/${projectModal.data.id}`;
    const method = projectModal.mode === 'create' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error al guardar proyecto');
      showFeedback('Proyecto guardado con éxito');
      setProjectModal({ open: false, mode: 'create', data: null });
      setActiveTab('');
      setTimeout(() => setActiveTab('projects'), 50);
    } catch (err) {
      showFeedback(err.message, 'error');
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este proyecto?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al eliminar proyecto');
      showFeedback('Proyecto eliminado');
      setActiveTab('');
      setTimeout(() => setActiveTab('projects'), 50);
    } catch (err) {
      showFeedback(err.message, 'error');
    }
  };

  // Experience Submit
  const handleExpSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...expForm,
      order: Number(expForm.order)
    };

    const url = expModal.mode === 'create' ? '/api/experience' : `/api/experience/${expModal.data.id}`;
    const method = expModal.mode === 'create' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error al guardar experiencia');
      showFeedback('Experiencia guardada con éxito');
      setExpModal({ open: false, mode: 'create', data: null });
      setActiveTab('');
      setTimeout(() => setActiveTab('experience'), 50);
    } catch (err) {
      showFeedback(err.message, 'error');
    }
  };

  const deleteExp = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta experiencia?')) return;
    try {
      const res = await fetch(`/api/experience/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al eliminar');
      showFeedback('Experiencia eliminada');
      setActiveTab('');
      setTimeout(() => setActiveTab('experience'), 50);
    } catch (err) {
      showFeedback(err.message, 'error');
    }
  };

  // Education Submit
  const handleEduSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...eduForm,
      order: Number(eduForm.order)
    };

    const url = eduModal.mode === 'create' ? '/api/education' : `/api/education/${eduModal.data.id}`;
    const method = eduModal.mode === 'create' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error al guardar educación');
      showFeedback('Educación/Certificación guardada');
      setEduModal({ open: false, mode: 'create', data: null });
      setActiveTab('');
      setTimeout(() => setActiveTab('education'), 50);
    } catch (err) {
      showFeedback(err.message, 'error');
    }
  };

  const deleteEdu = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este registro?')) return;
    try {
      const res = await fetch(`/api/education/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al eliminar');
      showFeedback('Educación eliminada');
      setActiveTab('');
      setTimeout(() => setActiveTab('education'), 50);
    } catch (err) {
      showFeedback(err.message, 'error');
    }
  };

  // Login view
  if (!token) {
    return (
      <div className="admin-container">
        <form className="login-card" onSubmit={handleLogin}>
          <h3>Acceso Panel de Administración</h3>
          {loginError && <p className="error-msg">{loginError}</p>}
          
          <div className="form-group">
            <label>Usuario</label>
            <input 
              type="text" 
              placeholder="Usuario" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="login-btn">Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <h2>Panel de Control FullStack</h2>
        <div className="header-actions">
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Salir
          </button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback.message && (
        <div style={{
          padding: '1rem',
          marginBottom: '2rem',
          borderRadius: '8px',
          background: feedback.type === 'error' ? 'rgba(229, 62, 62, 0.2)' : 'rgba(72, 187, 120, 0.2)',
          border: feedback.type === 'error' ? '1px solid #e53e3e' : '1px solid #48bb78',
          color: feedback.type === 'error' ? '#e53e3e' : '#48bb78',
          fontWeight: 600
        }}>
          {feedback.message}
        </div>
      )}

      {/* Tab Selectors */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Proyectos
        </button>
        <button 
          className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
          onClick={() => setActiveTab('experience')}
        >
          Experiencia
        </button>
        <button 
          className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
          onClick={() => setActiveTab('education')}
        >
          Educación
        </button>
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Sobre Mí
        </button>
      </div>

      {/* Active Tab Panel */}
      <div className="tab-content">
        {loading && <p>Cargando datos...</p>}

        {/* ----------------- PROJECTS TAB ----------------- */}
        {!loading && activeTab === 'projects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Gestión de Proyectos</h3>
              <button className="tab-btn active" onClick={() => openProjectModal('create')}>
                + Nuevo Proyecto
              </button>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Miniatura</th>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Agencia</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => (
                  <tr key={proj.id}>
                    <td>
                      <img src={proj.image} alt={proj.title} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    </td>
                    <td><strong>{proj.title}</strong></td>
                    <td>{proj.categoryLabel}</td>
                    <td>{proj.agency || 'N/A'}</td>
                    <td className="actions-cell">
                      <button className="btn-edit" onClick={() => openProjectModal('edit', proj)}>
                        Editar
                      </button>
                      <button className="btn-delete" onClick={() => deleteProject(proj.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ----------------- PROFILE TAB ----------------- */}
        {!loading && activeTab === 'profile' && (
          <div>
            <h3>Datos Personales (Sobre Mí)</h3>
            <form className="admin-form" onSubmit={handleProfileSubmit}>
              
              <div className="form-group">
                <label>Foto de Perfil</label>
                <input 
                  type="text" 
                  value={profileForm.profilePic} 
                  onChange={(e) => setProfileForm({ ...profileForm, profilePic: e.target.value })} 
                  placeholder="/uploads/..."
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileUpload(e, (url) => setProfileForm({ ...profileForm, profilePic: url }))} 
                  style={{ marginTop: '0.5rem' }}
                />
              </div>

              <div className="form-group">
                <label>Archivo CV (PDF)</label>
                <input 
                  type="text" 
                  value={profileForm.cvUrl} 
                  onChange={(e) => setProfileForm({ ...profileForm, cvUrl: e.target.value })} 
                  placeholder="/uploads/..."
                />
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={(e) => handleFileUpload(e, (url) => setProfileForm({ ...profileForm, cvUrl: url }))} 
                  style={{ marginTop: '0.5rem' }}
                />
              </div>

              <div className="form-group full-width">
                <label>Título Profesional</label>
                <input 
                  type="text" 
                  value={profileForm.jobTitle} 
                  onChange={(e) => setProfileForm({ ...profileForm, jobTitle: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group full-width">
                <label>Descripción Biográfica</label>
                <textarea 
                  rows={8}
                  value={profileForm.description} 
                  onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })} 
                  required 
                ></textarea>
              </div>

              <div className="form-group">
                <label>GitHub URL</label>
                <input 
                  type="url" 
                  value={profileForm.githubUrl} 
                  onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>LinkedIn URL</label>
                <input 
                  type="url" 
                  value={profileForm.linkedinUrl} 
                  onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })} 
                />
              </div>
              <div className="form-group full-width">
                <label>WhatsApp URL</label>
                <input 
                  type="url" 
                  value={profileForm.whatsappUrl} 
                  onChange={(e) => setProfileForm({ ...profileForm, whatsappUrl: e.target.value })} 
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">Guardar Cambios</button>
              </div>
            </form>
          </div>
        )}

        {/* ----------------- EXPERIENCE TAB ----------------- */}
        {!loading && activeTab === 'experience' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Experiencia Laboral</h3>
              <button className="tab-btn active" onClick={() => openExpModal('create')}>
                + Añadir Experiencia
              </button>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rol</th>
                  <th>Empresa</th>
                  <th>Fechas</th>
                  <th>Orden</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {experiences.map((exp) => (
                  <tr key={exp.id}>
                    <td><strong>{exp.role}</strong></td>
                    <td>{exp.company}</td>
                    <td>{exp.startDate} - {exp.endDate || 'Presente'}</td>
                    <td>{exp.order}</td>
                    <td className="actions-cell">
                      <button className="btn-edit" onClick={() => openExpModal('edit', exp)}>
                        Editar
                      </button>
                      <button className="btn-delete" onClick={() => deleteExp(exp.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ----------------- EDUCATION TAB ----------------- */}
        {!loading && activeTab === 'education' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Educación y Certificaciones</h3>
              <button className="tab-btn active" onClick={() => openEduModal('create')}>
                + Añadir Registro
              </button>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Título / Rol</th>
                  <th>Institución</th>
                  <th>Período</th>
                  <th>Tipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {education.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.role}</strong></td>
                    <td>{item.company}</td>
                    <td>{item.date}</td>
                    <td>{item.type === 'EDUCATION' ? 'Educación' : 'Certificación'}</td>
                    <td className="actions-cell">
                      <button className="btn-edit" onClick={() => openEduModal('edit', item)}>
                        Editar
                      </button>
                      <button className="btn-delete" onClick={() => deleteEdu(item.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------
          PROJECTS MODAL
      ---------------------------------------------------- */}
      {projectModal.open && (
        <div className="modal-overlay" onClick={() => setProjectModal({ open: false, mode: 'create', data: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', textAlign: 'left' }}>
            <h4 style={{ marginBottom: '1.5rem' }}>{projectModal.mode === 'create' ? 'Nuevo Proyecto' : 'Editar Proyecto'}</h4>
            <form onSubmit={handleProjectSubmit} className="admin-form">
              
              <div className="form-group">
                <label>Título</label>
                <input 
                  type="text" 
                  value={projectForm.title} 
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Agencia / Autor</label>
                <input 
                  type="text" 
                  value={projectForm.agency} 
                  onChange={(e) => setProjectForm({ ...projectForm, agency: e.target.value })} 
                  placeholder="UNDER AGENCY, SOULWARE, etc."
                />
              </div>

              <div className="form-group">
                <label>Categoría Filtro (key)</label>
                <select 
                  value={projectForm.category} 
                  onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                >
                  <option value="wordpress">wordpress</option>
                  <option value="frontend">frontend</option>
                  <option value="backend">backend</option>
                  <option value="fullstack">fullstack</option>
                </select>
              </div>
              <div className="form-group">
                <label>Etiqueta Categoría (Label)</label>
                <input 
                  type="text" 
                  value={projectForm.categoryLabel} 
                  onChange={(e) => setProjectForm({ ...projectForm, categoryLabel: e.target.value })} 
                  placeholder="WordPress, Front End, etc."
                  required 
                />
              </div>

              <div className="form-group full-width">
                <label>Descripción Corta</label>
                <input 
                  type="text" 
                  value={projectForm.description} 
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group full-width">
                <label>Descripción Larga (Detalles)</label>
                <textarea 
                  rows={4}
                  value={projectForm.longDescription} 
                  onChange={(e) => setProjectForm({ ...projectForm, longDescription: e.target.value })} 
                ></textarea>
              </div>

              <div className="form-group full-width">
                <label>Tecnologías (separadas por coma)</label>
                <input 
                  type="text" 
                  value={projectForm.technologies} 
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })} 
                  placeholder="React, Sass, Node.js"
                  required 
                />
              </div>

              <div className="form-group">
                <label>Imagen Principal (Miniatura)</label>
                <input 
                  type="text" 
                  value={projectForm.image} 
                  onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })} 
                  required 
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileUpload(e, (url) => setProjectForm({ ...projectForm, image: url }))} 
                  style={{ marginTop: '0.5rem' }}
                />
              </div>
              <div className="form-group">
                <label>Galería (Urls separadas por coma)</label>
                <input 
                  type="text" 
                  value={projectForm.gallery} 
                  onChange={(e) => setProjectForm({ ...projectForm, gallery: e.target.value })} 
                  placeholder="/uploads/captura1.png, /uploads/captura2.png"
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileUpload(e, (url) => {
                    const current = projectForm.gallery ? projectForm.gallery.split(',').map(s=>s.trim()).filter(Boolean) : [];
                    current.push(url);
                    setProjectForm({ ...projectForm, gallery: current.join(', ') });
                  })} 
                  style={{ marginTop: '0.5rem' }}
                />
              </div>

              <div className="form-group">
                <label>YouTube Video URL</label>
                <input 
                  type="url" 
                  value={projectForm.youtubeUrl} 
                  onChange={(e) => setProjectForm({ ...projectForm, youtubeUrl: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>GitHub URL</label>
                <input 
                  type="url" 
                  value={projectForm.githubUrl} 
                  onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })} 
                />
              </div>
              <div className="form-group full-width">
                <label>Web Prod URL</label>
                <input 
                  type="url" 
                  value={projectForm.webUrl} 
                  onChange={(e) => setProjectForm({ ...projectForm, webUrl: e.target.value })} 
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setProjectModal({ open: false, mode: 'create', data: null })}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">Guardar</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          EXPERIENCE MODAL
      ---------------------------------------------------- */}
      {expModal.open && (
        <div className="modal-overlay" onClick={() => setExpModal({ open: false, mode: 'create', data: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', textAlign: 'left' }}>
            <h4 style={{ marginBottom: '1.5rem' }}>{expModal.mode === 'create' ? 'Añadir Experiencia' : 'Editar Experiencia'}</h4>
            <form onSubmit={handleExpSubmit} className="admin-form">
              
              <div className="form-group full-width">
                <label>Rol / Puesto</label>
                <input 
                  type="text" 
                  value={expForm.role} 
                  onChange={(e) => setExpForm({ ...expForm, role: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group full-width">
                <label>Empresa / Organización</label>
                <input 
                  type="text" 
                  value={expForm.company} 
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group full-width">
                <label>Descripción de Funciones</label>
                <textarea 
                  rows={4}
                  value={expForm.description} 
                  onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} 
                  required 
                ></textarea>
              </div>

              <div className="form-group">
                <label>Fecha Inicio</label>
                <input 
                  type="text" 
                  placeholder="Octubre 2022"
                  value={expForm.startDate} 
                  onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Fecha Fin (vacío = Presente)</label>
                <input 
                  type="text" 
                  placeholder="Marzo 2025"
                  value={expForm.endDate} 
                  onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })} 
                />
              </div>
              <div className="form-group full-width">
                <label>Orden visual</label>
                <input 
                  type="number" 
                  value={expForm.order} 
                  onChange={(e) => setExpForm({ ...expForm, order: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setExpModal({ open: false, mode: 'create', data: null })}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">Guardar</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          EDUCATION/CERTIFICATION MODAL
      ---------------------------------------------------- */}
      {eduModal.open && (
        <div className="modal-overlay" onClick={() => setEduModal({ open: false, mode: 'create', data: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', textAlign: 'left' }}>
            <h4 style={{ marginBottom: '1.5rem' }}>{eduModal.mode === 'create' ? 'Añadir Registro' : 'Editar Registro'}</h4>
            <form onSubmit={handleEduSubmit} className="admin-form">
              
              <div className="form-group full-width">
                <label>Título / Rol</label>
                <input 
                  type="text" 
                  value={eduForm.role} 
                  onChange={(e) => setEduForm({ ...eduForm, role: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group full-width">
                <label>Institución / Empresa</label>
                <input 
                  type="text" 
                  value={eduForm.company} 
                  onChange={(e) => setEduForm({ ...eduForm, company: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Período / Fecha</label>
                <input 
                  type="text" 
                  placeholder="2024 - 2025"
                  value={eduForm.date} 
                  onChange={(e) => setEduForm({ ...eduForm, date: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Tipo</label>
                <select 
                  value={eduForm.type} 
                  onChange={(e) => setEduForm({ ...eduForm, type: e.target.value })}
                >
                  <option value="EDUCATION">Educación</option>
                  <option value="CERTIFICATION">Certificación</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Orden visual</label>
                <input 
                  type="number" 
                  value={eduForm.order} 
                  onChange={(e) => setEduForm({ ...eduForm, order: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setEduModal({ open: false, mode: 'create', data: null })}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">Guardar</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
