import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * AdminLogin - Página pública de autenticación del administrador.
 * Tras un login exitoso, guarda el JWT en localStorage y redirige al panel.
 */
export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

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
      navigate('/panel-admin');
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* noindex meta para SEO - evitar indexación del panel */}
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <div className="admin-container">
        <form className="login-card" onSubmit={handleLogin}>
          <h3>
            <i className="fas fa-lock" style={{ marginRight: '0.8rem', color: '#2754ff' }}></i>
            Panel de Administración
          </h3>

          {loginError && <p className="error-msg">{loginError}</p>}

          <div className="form-group">
            <label htmlFor="admin-username">Usuario</label>
            <input
              id="admin-username"
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Contraseña</label>
            <input
              id="admin-password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </>
  );
}
