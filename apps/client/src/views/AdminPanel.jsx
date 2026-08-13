import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────
// AdminPanel — Dashboard completo con CRUD de todos los datos
// ─────────────────────────────────────────────────────────────

// Helper: initial project form state
const emptyProject = {
  title: '', agency: '', category: 'wordpress', categoryLabel: 'WordPress',
  description: '', longDescription: '', technologies: '',
  image: '', gallery: '', youtubeUrl: '', githubUrl: '', webUrl: '', featured: false
};
const emptyExp = { role: '', company: '', description: '', startDate: '', endDate: '', order: '' };
const emptyEdu = { role: '', company: '', date: '', type: 'EDUCATION', order: '' };
const emptyCat = { key: '', label: '', icon: '', order: '0' };

export default function AdminPanel() {
  const token = localStorage.getItem('token') || '';
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('projects');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  // Data
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [profile, setProfile] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    profilePic: '', jobTitle: '', description: '',
    cvUrl: '', githubUrl: '', linkedinUrl: '', whatsappUrl: ''
  });

  // Project modal
  const [projModal, setProjModal] = useState({ open: false, mode: 'create', data: null });
  const [projForm, setProjForm] = useState(emptyProject);

  // Category modal
  const [catModal, setCatModal] = useState({ open: false, mode: 'create', data: null });
  const [catForm, setCatForm] = useState(emptyCat);

  // Experience modal
  const [expModal, setExpModal] = useState({ open: false, mode: 'create', data: null });
  const [expForm, setExpForm] = useState(emptyExp);

  // Education modal
  const [eduModal, setEduModal] = useState({ open: false, mode: 'create', data: null });
  const [eduForm, setEduForm] = useState(emptyEdu);

  // ── Verify token on mount ──
  useEffect(() => {
    if (token) {
      fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => { if (res.status === 401) { localStorage.removeItem('token'); navigate('/panel-admin/login'); } })
        .catch(() => {});
    }
  }, []);

  // ── Load tab data ──
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setFeedback({ message: '', type: '' });
    let p = Promise.resolve();

    if (activeTab === 'projects') {
      p = Promise.all([
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/categories').then(r => r.json())
      ]).then(([projs, cats]) => {
        setProjects(Array.isArray(projs) ? projs : []);
        setCategories(Array.isArray(cats) ? cats : []);
      });
    } else if (activeTab === 'categories') {
      p = fetch('/api/categories').then(r => r.json()).then(cats => setCategories(Array.isArray(cats) ? cats : []));
    } else if (activeTab === 'profile') {
      p = fetch('/api/profile').then(r => r.json()).then(data => {
        setProfile(data);
        if (data) setProfileForm({
          profilePic: data.profilePic || '', jobTitle: data.jobTitle || '',
          description: data.description || '', cvUrl: data.cvUrl || '',
          githubUrl: data.githubUrl || '', linkedinUrl: data.linkedinUrl || '',
          whatsappUrl: data.whatsappUrl || ''
        });
      });
    } else if (activeTab === 'experience') {
      p = fetch('/api/experience').then(r => r.json()).then(d => setExperiences(d.sort((a, b) => (a.order||0)-(b.order||0))));
    } else if (activeTab === 'education') {
      p = fetch('/api/education').then(r => r.json()).then(d => setEducation(d.sort((a, b) => (a.order||0)-(b.order||0))));
    }

    p.catch(err => showFeedback('Error al cargar: ' + err.message, 'error'))
     .finally(() => setLoading(false));
  }, [token, activeTab]);

  const showFeedback = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 5000);
  };

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/panel-admin/login'); };

  // ── File upload helper ──
  const uploadFile = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al subir archivo');
    return data.url;
  };

  // ── Profile ──
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileForm)
      });
      if (!res.ok) throw new Error('Error al actualizar perfil');
      showFeedback('Perfil actualizado con éxito ✓');
    } catch (err) { showFeedback(err.message, 'error'); }
  };

  // ── Categories ──
  const openCatModal = (mode, data = null) => {
    setCatModal({ open: true, mode, data });
    setCatForm(mode === 'edit' && data ? {
      key: data.key, label: data.label, icon: data.icon || '', order: data.order !== undefined ? String(data.order) : '0'
    } : emptyCat);
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    const url = catModal.mode === 'create' ? '/api/categories' : `/api/categories/${catModal.data.id}`;
    const method = catModal.mode === 'create' ? 'POST' : 'PUT';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...catForm, order: Number(catForm.order) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar categoría');
      showFeedback(`Categoría ${catModal.mode === 'create' ? 'creada' : 'actualizada'} ✓`);
      setCatModal({ open: false, mode: 'create', data: null });
      setActiveTab(''); setTimeout(() => setActiveTab('categories'), 50);
    } catch (err) { showFeedback(err.message, 'error'); }
  };

  const deleteCat = async (id) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al eliminar');
      showFeedback('Categoría eliminada');
      setActiveTab(''); setTimeout(() => setActiveTab('categories'), 50);
    } catch (err) { showFeedback(err.message, 'error'); }
  };

  // ── Projects ──
  const toggleFeatured = async (id, currentFeatured) => {
    try {
      const res = await fetch(`/api/projects/${id}/featured`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ featured: !currentFeatured })
      });
      if (!res.ok) throw new Error('Error al actualizar estado de destacado');
      const data = await res.json();
      setProjects(prev => prev.map(p => p.id === id ? { ...p, featured: data.project.featured } : p));
      showFeedback(`Proyecto ${data.project.featured ? 'marcado como destacado ★' : 'desmarcado de destacados'}`);
    } catch (err) { showFeedback(err.message, 'error'); }
  };

  const openProjModal = (mode, data = null) => {
    setProjModal({ open: true, mode, data });
    setProjForm(mode === 'edit' && data ? {
      title: data.title, agency: data.agency || '',
      category: data.category, categoryLabel: data.categoryLabel,
      description: data.description, longDescription: data.longDescription || '',
      technologies: data.technologies ? data.technologies.join(', ') : '',
      image: data.image, gallery: data.gallery ? data.gallery.join(', ') : '',
      youtubeUrl: data.youtubeUrl || '', githubUrl: data.githubUrl || '', webUrl: data.webUrl || '',
      featured: Boolean(data.featured)
    } : emptyProject);
  };

  const handleProjSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...projForm,
      technologies: projForm.technologies.split(',').map(t => t.trim()).filter(Boolean),
      gallery: projForm.gallery ? projForm.gallery.split(',').map(g => g.trim()).filter(Boolean) : []
    };
    const url = projModal.mode === 'create' ? '/api/projects' : `/api/projects/${projModal.data.id}`;
    const method = projModal.mode === 'create' ? 'POST' : 'PUT';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error al guardar proyecto');
      showFeedback(`Proyecto ${projModal.mode === 'create' ? 'creado' : 'actualizado'} con éxito ✓`);
      setProjModal({ open: false, mode: 'create', data: null });
      setActiveTab(''); setTimeout(() => setActiveTab('projects'), 50);
    } catch (err) { showFeedback(err.message, 'error'); }
  };

  const deleteProject = async (id) => {
    if (!confirm('¿Eliminar este proyecto?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Error al eliminar');
      showFeedback('Proyecto eliminado');
      setActiveTab(''); setTimeout(() => setActiveTab('projects'), 50);
    } catch (err) { showFeedback(err.message, 'error'); }
  };

  // ── Experience ──
  const openExpModal = (mode, data = null) => {
    setExpModal({ open: true, mode, data });
    setExpForm(mode === 'edit' && data ? {
      role: data.role, company: data.company, description: data.description,
      startDate: data.startDate, endDate: data.endDate || '', order: data.order || ''
    } : emptyExp);
  };

  const handleExpSubmit = async (e) => {
    e.preventDefault();
    const url = expModal.mode === 'create' ? '/api/experience' : `/api/experience/${expModal.data.id}`;
    const method = expModal.mode === 'create' ? 'POST' : 'PUT';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...expForm, order: Number(expForm.order) })
      });
      if (!res.ok) throw new Error('Error al guardar experiencia');
      showFeedback(`Experiencia ${expModal.mode === 'create' ? 'creada' : 'actualizada'} ✓`);
      setExpModal({ open: false, mode: 'create', data: null });
      setActiveTab(''); setTimeout(() => setActiveTab('experience'), 50);
    } catch (err) { showFeedback(err.message, 'error'); }
  };

  const deleteExp = async (id) => {
    if (!confirm('¿Eliminar esta experiencia?')) return;
    try {
      await fetch(`/api/experience/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      showFeedback('Experiencia eliminada');
      setActiveTab(''); setTimeout(() => setActiveTab('experience'), 50);
    } catch (err) { showFeedback(err.message, 'error'); }
  };

  // ── Education ──
  const openEduModal = (mode, data = null) => {
    setEduModal({ open: true, mode, data });
    setEduForm(mode === 'edit' && data ? {
      role: data.role, company: data.company, date: data.date, type: data.type, order: data.order || ''
    } : emptyEdu);
  };

  const handleEduSubmit = async (e) => {
    e.preventDefault();
    const url = eduModal.mode === 'create' ? '/api/education' : `/api/education/${eduModal.data.id}`;
    const method = eduModal.mode === 'create' ? 'POST' : 'PUT';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...eduForm, order: Number(eduForm.order) })
      });
      if (!res.ok) throw new Error('Error al guardar');
      showFeedback(`Registro ${eduModal.mode === 'create' ? 'creado' : 'actualizado'} ✓`);
      setEduModal({ open: false, mode: 'create', data: null });
      setActiveTab(''); setTimeout(() => setActiveTab('education'), 50);
    } catch (err) { showFeedback(err.message, 'error'); }
  };

  const deleteEdu = async (id) => {
    if (!confirm('¿Eliminar este registro?')) return;
    try {
      await fetch(`/api/education/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      showFeedback('Registro eliminado');
      setActiveTab(''); setTimeout(() => setActiveTab('education'), 50);
    } catch (err) { showFeedback(err.message, 'error'); }
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="admin-dashboard">

      {/* Top Bar */}
      <div className="admin-topbar">
        <h2><i className="fas fa-layer-group" style={{ marginRight: '0.6rem', color: '#2754ff' }}></i>Panel de Control</h2>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Salir
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="admin-nav-tabs">
        {[
          { key: 'projects',   icon: 'fa-folder-open', label: 'Proyectos' },
          { key: 'categories', icon: 'fa-tags',        label: 'Categorías' },
          { key: 'experience', icon: 'fa-briefcase',    label: 'Experiencia' },
          { key: 'education',  icon: 'fa-graduation-cap', label: 'Educación' },
          { key: 'profile',    icon: 'fa-user-circle',  label: 'Sobre Mí' },
        ].map(t => (
          <button
            key={t.key}
            className={`nav-tab-btn ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            <i className={`fas ${t.icon}`}></i>{t.label}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {feedback.message && (
        <div className={`feedback-banner ${feedback.type}`}>
          <i className={`fas ${feedback.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
          {feedback.message}
        </div>
      )}

      {loading && (
        <div className="tab-pane" style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '4rem' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '1.5rem' }}></i>
          <p style={{ marginTop: '1rem' }}>Cargando...</p>
        </div>
      )}

      {/* ═══════════════════════════════════════
          TAB: PROYECTOS
      ═══════════════════════════════════════ */}
      {!loading && activeTab === 'projects' && (
        <div className="tab-pane">
          <div className="pane-header">
            <h3>Gestión de Proyectos</h3>
            <button className="add-btn" onClick={() => openProjModal('create')}>
              <i className="fas fa-plus"></i> Nuevo Proyecto
            </button>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '45px', textAlign: 'center' }} title="Destacado">★</th>
                  <th className="hide-mobile">Imagen</th>
                  <th>Título</th>
                  <th className="hide-mobile">Categoría</th>
                  <th className="hide-mobile">Agencia</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id}>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className="btn-icon"
                        title={p.featured ? "Quitar de destacados" : "Marcar como destacado"}
                        onClick={() => toggleFeatured(p.id, p.featured)}
                        style={{ color: p.featured ? '#f59e0b' : 'rgba(255, 255, 255, 0.25)', fontSize: '1.1rem', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                      >
                        <i className={p.featured ? "fas fa-star" : "far fa-star"}></i>
                      </button>
                    </td>
                    <td className="hide-mobile">
                      <img className="thumb-img" src={p.image} alt={p.title} />
                    </td>
                    <td>
                      <strong>{p.title}</strong>
                      {p.featured && (
                        <span className="cat-badge" style={{ marginLeft: '0.5rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                          Destacado
                        </span>
                      )}
                    </td>
                    <td className="hide-mobile"><span className="cat-badge">{p.categoryLabel}</span></td>
                    <td className="hide-mobile">{p.agency || '—'}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn-icon edit" title="Editar" onClick={() => openProjModal('edit', p)}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn-icon delete" title="Eliminar" onClick={() => deleteProject(p.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '2rem' }}>Sin proyectos aún</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          TAB: CATEGORÍAS
      ═══════════════════════════════════════ */}
      {!loading && activeTab === 'categories' && (
        <div className="tab-pane">
          <div className="pane-header">
            <h3>Categorías de Proyectos</h3>
            <button className="add-btn" onClick={() => openCatModal('create')}>
              <i className="fas fa-plus"></i> Nueva Categoría
            </button>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre (Label)</th>
                  <th className="hide-mobile">Key (Slug)</th>
                  <th className="hide-mobile">Icono</th>
                  <th className="hide-mobile">Orden</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id}>
                    <td><strong>{cat.label}</strong></td>
                    <td className="hide-mobile"><code>{cat.key}</code></td>
                    <td className="hide-mobile">{cat.icon ? <><i className={`fas ${cat.icon}`} style={{ marginRight: '0.4rem' }}></i>{cat.icon}</> : '—'}</td>
                    <td className="hide-mobile">{cat.order}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn-icon edit" title="Editar" onClick={() => openCatModal('edit', cat)}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn-icon delete" title="Eliminar" onClick={() => deleteCat(cat.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '2rem' }}>Sin categorías registradas</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          TAB: EXPERIENCIA
      ═══════════════════════════════════════ */}
      {!loading && activeTab === 'experience' && (
        <div className="tab-pane">
          <div className="pane-header">
            <h3>Experiencia Laboral</h3>
            <button className="add-btn" onClick={() => openExpModal('create')}>
              <i className="fas fa-plus"></i> Añadir
            </button>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rol / Puesto</th>
                  <th className="hide-mobile">Empresa</th>
                  <th className="hide-mobile">Período</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {experiences.map(exp => (
                  <tr key={exp.id}>
                    <td><strong>{exp.role}</strong></td>
                    <td className="hide-mobile">{exp.company}</td>
                    <td className="hide-mobile">{exp.startDate} — {exp.endDate || 'Presente'}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn-icon edit" onClick={() => openExpModal('edit', exp)}><i className="fas fa-edit"></i></button>
                        <button className="btn-icon delete" onClick={() => deleteExp(exp.id)}><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {experiences.length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '2rem' }}>Sin registros</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          TAB: EDUCACIÓN
      ═══════════════════════════════════════ */}
      {!loading && activeTab === 'education' && (
        <div className="tab-pane">
          <div className="pane-header">
            <h3>Educación y Certificaciones</h3>
            <button className="add-btn" onClick={() => openEduModal('create')}>
              <i className="fas fa-plus"></i> Añadir
            </button>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Título / Rol</th>
                  <th className="hide-mobile">Institución</th>
                  <th className="hide-mobile">Tipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {education.map(item => (
                  <tr key={item.id}>
                    <td><strong>{item.role}</strong></td>
                    <td className="hide-mobile">{item.company}</td>
                    <td className="hide-mobile">
                      <span className="cat-badge" style={{ background: item.type === 'EDUCATION' ? 'rgba(72,187,120,0.14)' : 'rgba(245,101,101,0.14)', color: item.type === 'EDUCATION' ? '#68d391' : '#fc8181' }}>
                        {item.type === 'EDUCATION' ? 'Educación' : 'Certificación'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn-icon edit" onClick={() => openEduModal('edit', item)}><i className="fas fa-edit"></i></button>
                        <button className="btn-icon delete" onClick={() => deleteEdu(item.id)}><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {education.length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '2rem' }}>Sin registros</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          TAB: SOBRE MÍ (PROFILE)
      ═══════════════════════════════════════ */}
      {!loading && activeTab === 'profile' && (
        <div className="tab-pane">
          <div className="admin-form-section">
            <h3><i className="fas fa-user-circle" style={{ marginRight: '0.5rem', color: '#2754ff' }}></i>Datos Personales — Sobre Mí</h3>

            <form onSubmit={handleProfileSubmit}>
              <div className="admin-form-grid">

                {/* Foto de perfil con preview */}
                <div className="form-field">
                  <label>Foto de Perfil</label>
                  {profileForm.profilePic && (
                    <img className="profile-preview-img" src={profileForm.profilePic} alt="Foto actual" />
                  )}
                  <input
                    type="text"
                    value={profileForm.profilePic}
                    onChange={e => setProfileForm({ ...profileForm, profilePic: e.target.value })}
                    placeholder="/uploads/foto_perfil.jpeg"
                  />
                  <input
                    type="file" accept="image/*"
                    onChange={async e => {
                      try {
                        showFeedback('Subiendo imagen...', 'info');
                        const url = await uploadFile(e.target.files[0]);
                        setProfileForm(f => ({ ...f, profilePic: url }));
                        showFeedback('Imagen subida ✓');
                      } catch (err) { showFeedback(err.message, 'error'); }
                    }}
                  />
                  <span className="hint">Podés escribir la URL directamente o subir una imagen nueva</span>
                </div>

                {/* CV */}
                <div className="form-field">
                  <label>Archivo CV (PDF)</label>
                  {profileForm.cvUrl && (
                    <a href={profileForm.cvUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.82rem', color: '#90cdf4', marginBottom: '0.5rem', display: 'block' }}>
                      <i className="fas fa-file-pdf" style={{ marginRight: '0.3rem' }}></i>Ver CV actual
                    </a>
                  )}
                  <input
                    type="text"
                    value={profileForm.cvUrl}
                    onChange={e => setProfileForm({ ...profileForm, cvUrl: e.target.value })}
                    placeholder="/uploads/cv.pdf"
                  />
                  <input
                    type="file" accept=".pdf"
                    onChange={async e => {
                      try {
                        showFeedback('Subiendo PDF...', 'info');
                        const url = await uploadFile(e.target.files[0]);
                        setProfileForm(f => ({ ...f, cvUrl: url }));
                        showFeedback('CV subido ✓');
                      } catch (err) { showFeedback(err.message, 'error'); }
                    }}
                  />
                </div>

                {/* Título profesional */}
                <div className="form-field">
                  <label>Título Profesional</label>
                  <input
                    type="text"
                    value={profileForm.jobTitle}
                    onChange={e => setProfileForm({ ...profileForm, jobTitle: e.target.value })}
                    placeholder="FullStack Developer"
                    required
                  />
                </div>

                {/* Descripción */}
                <div className="form-field">
                  <label>Descripción Biográfica</label>
                  <textarea
                    rows={8}
                    value={profileForm.description}
                    onChange={e => setProfileForm({ ...profileForm, description: e.target.value })}
                    required
                  ></textarea>
                </div>

                {/* Links sociales */}
                <div className="form-field">
                  <label>GitHub URL</label>
                  <input type="url" value={profileForm.githubUrl} onChange={e => setProfileForm({ ...profileForm, githubUrl: e.target.value })} placeholder="https://github.com/..." />
                </div>
                <div className="form-field">
                  <label>LinkedIn URL</label>
                  <input type="url" value={profileForm.linkedinUrl} onChange={e => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="form-field">
                  <label>WhatsApp URL</label>
                  <input type="url" value={profileForm.whatsappUrl} onChange={e => setProfileForm({ ...profileForm, whatsappUrl: e.target.value })} placeholder="https://wa.me/..." />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save">
                    <i className="fas fa-save" style={{ marginRight: '0.4rem' }}></i>Guardar Cambios
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          MODAL: PROYECTO (Crear / Editar)
      ═══════════════════════════════════════ */}
      {projModal.open && (
        <div className="admin-modal-overlay" onClick={() => setProjModal({ open: false, mode: 'create', data: null })}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              <i className={`fas ${projModal.mode === 'create' ? 'fa-plus-circle' : 'fa-edit'}`}></i>
              {projModal.mode === 'create' ? 'Nuevo Proyecto' : 'Editar Proyecto'}
            </div>

            <form onSubmit={handleProjSubmit}>
              <div className="admin-form-grid">

                <div className="form-field">
                  <label>Título *</label>
                  <input type="text" value={projForm.title} onChange={e => setProjForm({ ...projForm, title: e.target.value })} required />
                </div>

                <div className="form-field">
                  <label>Agencia / Autor</label>
                  <input type="text" value={projForm.agency} onChange={e => setProjForm({ ...projForm, agency: e.target.value })} placeholder="UNDER AGENCY, SOULWARE..." />
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label>Categoría</label>
                    <select
                      value={projForm.category}
                      onChange={e => {
                        const selectedKey = e.target.value;
                        const foundCat = categories.find(c => c.key === selectedKey);
                        setProjForm({
                          ...projForm,
                          category: selectedKey,
                          categoryLabel: foundCat ? foundCat.label : projForm.categoryLabel
                        });
                      }}
                    >
                      {categories.map(cat => (
                        <option key={cat.id || cat.key} value={cat.key}>
                          {cat.label} ({cat.key})
                        </option>
                      ))}
                      {!categories.some(c => c.key === projForm.category) && projForm.category && (
                        <option value={projForm.category}>{projForm.categoryLabel || projForm.category}</option>
                      )}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Etiqueta Categoría *</label>
                    <input type="text" value={projForm.categoryLabel} onChange={e => setProjForm({ ...projForm, categoryLabel: e.target.value })} placeholder="WordPress, Front End..." required />
                  </div>
                </div>

                <div className="form-field">
                  <label>Descripción Corta *</label>
                  <input type="text" value={projForm.description} onChange={e => setProjForm({ ...projForm, description: e.target.value })} required />
                </div>

                <div className="form-field">
                  <label>Descripción Detallada</label>
                  <textarea rows={4} value={projForm.longDescription} onChange={e => setProjForm({ ...projForm, longDescription: e.target.value })}></textarea>
                </div>

                <div className="form-field">
                  <label>Tecnologías (separadas por coma) *</label>
                  <input type="text" value={projForm.technologies} onChange={e => setProjForm({ ...projForm, technologies: e.target.value })} placeholder="React, Sass, Node.js" required />
                </div>

                <div className="form-field">
                  <label>Imagen Principal (URL o subir) *</label>
                  {projForm.image && <img src={projForm.image} alt="" style={{ width: '100px', height: '66px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.5rem' }} />}
                  <input type="text" value={projForm.image} onChange={e => setProjForm({ ...projForm, image: e.target.value })} placeholder="/uploads/proyecto.png" required />
                  <input type="file" accept="image/*" onChange={async e => {
                    try {
                      showFeedback('Subiendo...', 'info');
                      const url = await uploadFile(e.target.files[0]);
                      setProjForm(f => ({ ...f, image: url }));
                      showFeedback('Imagen subida ✓');
                    } catch (err) { showFeedback(err.message, 'error'); }
                  }} />
                </div>

                <div className="form-field">
                  <label>Galería (URLs separadas por coma)</label>
                  <input type="text" value={projForm.gallery} onChange={e => setProjForm({ ...projForm, gallery: e.target.value })} placeholder="/uploads/cap1.png, /uploads/cap2.png" />
                  <input type="file" accept="image/*" onChange={async e => {
                    try {
                      showFeedback('Subiendo...', 'info');
                      const url = await uploadFile(e.target.files[0]);
                      const current = projForm.gallery ? projForm.gallery.split(',').map(s => s.trim()).filter(Boolean) : [];
                      current.push(url);
                      setProjForm(f => ({ ...f, gallery: current.join(', ') }));
                      showFeedback('Imagen agregada ✓');
                    } catch (err) { showFeedback(err.message, 'error'); }
                  }} />
                </div>

                <div className="form-field">
                  <label>YouTube Video URL</label>
                  <input type="url" value={projForm.youtubeUrl} onChange={e => setProjForm({ ...projForm, youtubeUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
                </div>

                <div className="form-field">
                  <label>GitHub URL</label>
                  <input type="url" value={projForm.githubUrl} onChange={e => setProjForm({ ...projForm, githubUrl: e.target.value })} />
                </div>

                <div className="form-field">
                  <label>URL Sitio Web en Producción</label>
                  <input type="url" value={projForm.webUrl} onChange={e => setProjForm({ ...projForm, webUrl: e.target.value })} placeholder="https://..." />
                </div>

                <div className="form-field" style={{ gridColumn: '1 / -1', background: 'rgba(245, 158, 11, 0.05)', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)', marginTop: '0.5rem' }}>
                  <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0, color: '#f59e0b', fontWeight: '600' }}>
                    <input
                      type="checkbox"
                      checked={projForm.featured || false}
                      onChange={e => setProjForm({ ...projForm, featured: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#f59e0b', cursor: 'pointer' }}
                    />
                    <i className="fas fa-star" style={{ color: '#f59e0b' }}></i>
                    Marcar como Proyecto Destacado (se mostrará en la sección superior del Home)
                  </label>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setProjModal({ open: false, mode: 'create', data: null })}>Cancelar</button>
                  <button type="submit" className="btn-save">
                    <i className="fas fa-save" style={{ marginRight: '0.4rem' }}></i>
                    {projModal.mode === 'create' ? 'Crear Proyecto' : 'Guardar Cambios'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          MODAL: EXPERIENCIA (Crear / Editar)
      ═══════════════════════════════════════ */}
      {expModal.open && (
        <div className="admin-modal-overlay" onClick={() => setExpModal({ open: false, mode: 'create', data: null })}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              <i className={`fas ${expModal.mode === 'create' ? 'fa-plus-circle' : 'fa-edit'}`}></i>
              {expModal.mode === 'create' ? 'Nueva Experiencia' : 'Editar Experiencia'}
            </div>

            <form onSubmit={handleExpSubmit}>
              <div className="admin-form-grid">

                <div className="form-field">
                  <label>Rol / Puesto *</label>
                  <input type="text" value={expForm.role} onChange={e => setExpForm({ ...expForm, role: e.target.value })} required />
                </div>

                <div className="form-field">
                  <label>Empresa / Organización *</label>
                  <input type="text" value={expForm.company} onChange={e => setExpForm({ ...expForm, company: e.target.value })} required />
                </div>

                <div className="form-field">
                  <label>Descripción de Funciones *</label>
                  <textarea rows={5} value={expForm.description} onChange={e => setExpForm({ ...expForm, description: e.target.value })} required></textarea>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label>Fecha Inicio *</label>
                    <input type="text" value={expForm.startDate} onChange={e => setExpForm({ ...expForm, startDate: e.target.value })} placeholder="Octubre 2022" required />
                  </div>
                  <div className="form-field">
                    <label>Fecha Fin (vacío = Presente)</label>
                    <input type="text" value={expForm.endDate} onChange={e => setExpForm({ ...expForm, endDate: e.target.value })} placeholder="Marzo 2025" />
                  </div>
                </div>

                <div className="form-field">
                  <label>Orden visual</label>
                  <input type="number" value={expForm.order} onChange={e => setExpForm({ ...expForm, order: e.target.value })} placeholder="1" />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setExpModal({ open: false, mode: 'create', data: null })}>Cancelar</button>
                  <button type="submit" className="btn-save">
                    <i className="fas fa-save" style={{ marginRight: '0.4rem' }}></i>
                    {expModal.mode === 'create' ? 'Crear Experiencia' : 'Guardar Cambios'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          MODAL: EDUCACIÓN (Crear / Editar)
      ═══════════════════════════════════════ */}
      {eduModal.open && (
        <div className="admin-modal-overlay" onClick={() => setEduModal({ open: false, mode: 'create', data: null })}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              <i className={`fas ${eduModal.mode === 'create' ? 'fa-plus-circle' : 'fa-edit'}`}></i>
              {eduModal.mode === 'create' ? 'Nuevo Registro' : 'Editar Registro'}
            </div>

            <form onSubmit={handleEduSubmit}>
              <div className="admin-form-grid">

                <div className="form-field">
                  <label>Título / Rol *</label>
                  <input type="text" value={eduForm.role} onChange={e => setEduForm({ ...eduForm, role: e.target.value })} required />
                </div>

                <div className="form-field">
                  <label>Institución / Empresa *</label>
                  <input type="text" value={eduForm.company} onChange={e => setEduForm({ ...eduForm, company: e.target.value })} required />
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label>Período / Fecha *</label>
                    <input type="text" value={eduForm.date} onChange={e => setEduForm({ ...eduForm, date: e.target.value })} placeholder="2024 – 2025" required />
                  </div>
                  <div className="form-field">
                    <label>Tipo *</label>
                    <select value={eduForm.type} onChange={e => setEduForm({ ...eduForm, type: e.target.value })}>
                      <option value="EDUCATION">Educación</option>
                      <option value="CERTIFICATION">Certificación</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label>Orden visual</label>
                  <input type="number" value={eduForm.order} onChange={e => setEduForm({ ...eduForm, order: e.target.value })} placeholder="1" />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setEduModal({ open: false, mode: 'create', data: null })}>Cancelar</button>
                  <button type="submit" className="btn-save">
                    <i className="fas fa-save" style={{ marginRight: '0.4rem' }}></i>
                    {eduModal.mode === 'create' ? 'Crear Registro' : 'Guardar Cambios'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          MODAL: CATEGORÍA (Crear / Editar)
      ═══════════════════════════════════════ */}
      {catModal.open && (
        <div className="admin-modal-overlay" onClick={() => setCatModal({ open: false, mode: 'create', data: null })}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              <i className={`fas ${catModal.mode === 'create' ? 'fa-plus-circle' : 'fa-edit'}`}></i>
              {catModal.mode === 'create' ? 'Nueva Categoría' : 'Editar Categoría'}
            </div>

            <form onSubmit={handleCatSubmit}>
              <div className="admin-form-grid">
                <div className="form-field">
                  <label>Nombre de Categoría (Label) *</label>
                  <input
                    type="text"
                    value={catForm.label}
                    onChange={e => {
                      const newLabel = e.target.value;
                      const autoKey = newLabel.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                      setCatForm({
                        ...catForm,
                        label: newLabel,
                        key: catModal.mode === 'create' ? autoKey : catForm.key
                      });
                    }}
                    placeholder="Ej. Desarrollo Mobile"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Identificador Técnico (Key / Slug) *</label>
                  <input
                    type="text"
                    value={catForm.key}
                    onChange={e => setCatForm({ ...catForm, key: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="ej. mobile"
                    required
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label>Clase de Icono FontAwesome (Opcional)</label>
                    <input
                      type="text"
                      value={catForm.icon}
                      onChange={e => setCatForm({ ...catForm, icon: e.target.value })}
                      placeholder="fa-mobile-alt"
                    />
                  </div>
                  <div className="form-field">
                    <label>Orden de Visualización</label>
                    <input
                      type="number"
                      value={catForm.order}
                      onChange={e => setCatForm({ ...catForm, order: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setCatModal({ open: false, mode: 'create', data: null })}>Cancelar</button>
                  <button type="submit" className="btn-save">
                    <i className="fas fa-save" style={{ marginRight: '0.4rem' }}></i>
                    {catModal.mode === 'create' ? 'Crear Categoría' : 'Guardar Cambios'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
