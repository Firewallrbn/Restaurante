// static/pedidos.js
document.addEventListener('DOMContentLoaded', async () => {
    try {
      // Verificar si hay token
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = '/login/';
        return;
      }
  
      // Obtener el parámetro de búsqueda si existe
      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get('q') || '';
  
      // Hacer la solicitud autenticada
      const response = await api.fetchAutenticado(`/pedidos/?q=${encodeURIComponent(q)}`);
      
      // Aquí deberías procesar la respuesta y renderizar los pedidos
      // Esto depende de cómo quieras manejar la respuesta (puede ser JSON o HTML)
      
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    }
  });