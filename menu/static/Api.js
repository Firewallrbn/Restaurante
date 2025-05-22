document.addEventListener('DOMContentLoaded', function() {
async function fetchAutenticado(url, options = {}) {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    window.location.href = '/login/';
    throw new Error('Token no encontrado');
  }

  const config = {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  };
    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        await refrescarToken(); // Intentar renovar el token
        return fetchAutenticado(url, options); // Reintentar la solicitud
      }
  
      if (!response.ok) throw new Error('Error en la solicitud');
      return await response.json();
  
    } catch (error) {
      console.error('Error:', error);
      if (error.message.includes('autenticación')) {
        window.location.href = '/login/'; // Redirigir si falla la autenticación
      }
      throw error;
    }
  }
  
  async function refrescarToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await fetch('/api/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken })
    });
  
    if (!response.ok) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw new Error('Error al refrescar token');
    }
  
    const data = await response.json();
    localStorage.setItem('access_token', data.access);
  }
});