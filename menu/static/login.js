document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/api/token/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password })
    });
  
    const data = await response.json();
  
    if (response.ok) {
      localStorage.setItem('access_token', data.access);
      // Redirigir, o guardar el token para usarlo en llamadas API
      window.location.href = "/menu/";
    } else {
      alert("Credenciales inválidas");
    }
  });